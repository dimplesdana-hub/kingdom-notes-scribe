import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  transcriptId: z.string().uuid(),
  text: z.string().min(1).max(200_000),
});

const SYSTEM_PROMPT = `You are an assistant that summarizes Jehovah's Witnesses meeting talks, assemblies, and personal study sessions.
Given a transcript, you produce:
1. A concise 3-5 bullet point summary capturing the main scriptural points.
2. Any clear action items, assignments, or applications the speaker asked the audience to do.

Respond ONLY with a JSON object matching exactly:
{"summary": ["..."], "actionItems": ["..."]}
- 3 to 5 short bullets in "summary" (one sentence each).
- 0 or more imperative items in "actionItems" (omit if none — use empty array).
- No markdown, no commentary, no code fences.`;

export const summarizeTranscript = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      await supabase
        .from("transcripts")
        .update({ summary_status: "failed", summary_error: "AI key not configured" })
        .eq("id", data.transcriptId)
        .eq("user_id", userId);
      return { ok: false as const, error: "AI key not configured" };
    }

    // Mark as processing
    await supabase
      .from("transcripts")
      .update({ summary_status: "processing", summary_error: null })
      .eq("id", data.transcriptId)
      .eq("user_id", userId);

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Transcript:\n\n${data.text}` },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        const msg =
          res.status === 429
            ? "AI rate limit reached. Try again shortly."
            : res.status === 402
              ? "AI credits exhausted. Add credits in workspace settings."
              : `AI gateway error ${res.status}: ${errText.slice(0, 200)}`;
        await supabase
          .from("transcripts")
          .update({ summary_status: "failed", summary_error: msg })
          .eq("id", data.transcriptId)
          .eq("user_id", userId);
        return { ok: false as const, error: msg };
      }

      const body = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = body.choices?.[0]?.message?.content ?? "";
      const parsed = safeParse(raw);
      const summary = Array.isArray(parsed?.summary)
        ? parsed.summary.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0).slice(0, 8)
        : [];
      const actionItems = Array.isArray(parsed?.actionItems)
        ? parsed.actionItems.filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0).slice(0, 12)
        : [];

      if (!summary.length) {
        const msg = "AI returned no summary";
        await supabase
          .from("transcripts")
          .update({ summary_status: "failed", summary_error: msg })
          .eq("id", data.transcriptId)
          .eq("user_id", userId);
        return { ok: false as const, error: msg };
      }

      await supabase
        .from("transcripts")
        .update({
          summary,
          action_items: actionItems,
          summary_status: "ready",
          summary_error: null,
        })
        .eq("id", data.transcriptId)
        .eq("user_id", userId);

      return { ok: true as const, summary, actionItems };
    } catch (e: any) {
      const msg = e?.message ?? "Failed to summarize";
      await supabase
        .from("transcripts")
        .update({ summary_status: "failed", summary_error: msg })
        .eq("id", data.transcriptId)
        .eq("user_id", userId);
      return { ok: false as const, error: msg };
    }
  });

function safeParse(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    // Try to pull a JSON object out of fenced or extra text.
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Fetch a transcript row (used by the detail page to poll while summary is processing). */
export const getTranscript = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

/** Create a transcript row from a finished recording. */
const CreateInput = z.object({
  title: z.string().min(1).max(300),
  type: z.string().min(1).max(60),
  speaker: z.string().max(200).optional().nullable(),
  congregation: z.string().max(200).optional().nullable(),
  date: z.string().max(40).optional().nullable(),
  duration: z.string().max(40).optional().nullable(),
  fullText: z.string().min(1).max(500_000),
  scriptures: z.array(z.string()).default([]),
});

export const createTranscriptFromRecording = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreateInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const preview = data.fullText.slice(0, 240);
    const { data: row, error } = await supabase
      .from("transcripts")
      .insert({
        user_id: userId,
        title: data.title,
        type: data.type,
        speaker: data.speaker ?? null,
        congregation: data.congregation ?? null,
        date: data.date ?? null,
        duration: data.duration ?? null,
        full_text: data.fullText,
        scriptures: data.scriptures,
        preview,
        summary_status: "pending",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });
