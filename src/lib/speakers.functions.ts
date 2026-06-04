import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UpsertSchema = z.object({
  name: z.string().min(1).max(200),
  congregation: z.string().max(200).nullable().optional(),
  role: z.enum(["brother", "sister", "unknown"]).optional(),
});

export const upsertSpeaker = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpsertSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Look up by case-insensitive name
    const { data: existing } = await supabase
      .from("speakers")
      .select("id, congregation, role")
      .eq("user_id", userId)
      .ilike("name", data.name)
      .maybeSingle();

    if (existing) {
      const patch: Record<string, unknown> = {};
      if (data.congregation && data.congregation !== existing.congregation) patch.congregation = data.congregation;
      if (data.role && data.role !== existing.role) patch.role = data.role;
      if (Object.keys(patch).length > 0) {
        await supabase.from("speakers").update(patch).eq("id", existing.id);
      }
      return { id: existing.id as string, created: false };
    }

    const { data: inserted, error } = await supabase
      .from("speakers")
      .insert({
        user_id: userId,
        name: data.name,
        congregation: data.congregation ?? null,
        role: data.role ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string, created: true };
  });

export const findSpeakerByName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ name: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("speakers")
      .select("name, congregation, role")
      .eq("user_id", userId)
      .ilike("name", data.name)
      .maybeSingle();
    return { speaker: row ?? null };
  });
