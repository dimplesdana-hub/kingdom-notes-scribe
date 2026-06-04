import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mic, Square, Pause, Play, Plus, ChevronDown, Circle, Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ScriptureText } from "@/components/ScriptureText";
import { type SessionType } from "@/lib/sample-data";
import { useLiveTranscription } from "@/lib/useLiveTranscription";
import { findReferences } from "@/lib/bible-books";
import {
  createTranscriptFromRecording,
  summarizeTranscript,
} from "@/lib/summarize.functions";
import { detectSpeaker, formatSpeaker, honorific, type SpeakerRole } from "@/lib/speaker-detect";
import { upsertSpeaker, findSpeakerByName } from "@/lib/speakers.functions";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [{ title: "Record — Kingdom Notes" }] }),
  component: RecordPage,
});

type Status = "idle" | "recording" | "paused";

const SESSION_TYPES: SessionType[] = ["Meeting", "Assembly", "Convention", "Personal Study", "Field Service"];

function RecordPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [showSession, setShowSession] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [session, setSession] = useState({
    type: "Meeting" as SessionType,
    date: new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    speaker: "",
    congregation: "",
    title: "",
  });
  const timerRef = useRef<number | null>(null);
  const live = useLiveTranscription();
  const navigate = useNavigate();
  const createTranscript = useServerFn(createTranscriptFromRecording);
  const summarize = useServerFn(summarizeTranscript);

  useEffect(() => {
    if (status === "recording") {
      timerRef.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const toggle = async () => {
    if (status === "recording") {
      setStatus("paused");
      live.stop();
    } else {
      setSaveError(null);
      setStatus("recording");
      await live.start();
    }
  };

  const stop = async () => {
    live.stop();
    const previousElapsed = elapsed;
    const fullText = live.finals.join("\n\n").trim();
    setStatus("idle");
    setElapsed(0);

    if (!fullText) {
      live.reset();
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const dur = fmtDuration(previousElapsed);
      const scriptures = Array.from(
        new Set(findReferences(fullText).map((r) => r.parsed.display)),
      );
      const { id } = await createTranscript({
        data: {
          title: session.title || `${session.type} — ${session.date}`,
          type: session.type,
          speaker: session.speaker || null,
          congregation: session.congregation || null,
          date: session.date,
          duration: dur,
          fullText,
          scriptures,
        },
      });
      // Fire-and-forget AI summary. The detail page polls for completion.
      summarize({ data: { transcriptId: id, text: fullText } }).catch((e) =>
        console.error("Summarize failed:", e),
      );
      live.reset();
      navigate({ to: "/transcripts/$id", params: { id } });
    } catch (e: any) {
      setSaveError(e?.message ?? "Could not save transcript");
    } finally {
      setSaving(false);
    }
  };

  const speakerLabel = session.speaker || "Speaker";
  const paragraphs = groupFinalsBySentences(live.finals, 5).map((text) => ({
    speaker: speakerLabel,
    text,
  }));

  return (
    <PageShell
      title="Kingdom Notes"
      right={
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Circle className={`h-2.5 w-2.5 fill-current ${status === "recording" ? "text-emerald-500" : "text-emerald-500"}`} />
          Live
        </span>
      }
    >
      {/* Session info bar */}
      <button
        onClick={() => setShowSession(true)}
        className="w-full rounded-2xl bg-card p-4 text-left shadow-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{session.type}</span>
              <span className="text-xs text-muted-foreground">{session.date}</span>
            </div>
            <div className="mt-2 truncate text-sm font-semibold text-foreground">
              {session.title || "Tap to add talk title"}
            </div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {session.speaker || "Speaker not set"}{session.congregation ? ` · ${session.congregation}` : ""}
            </div>
          </div>
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </button>

      {/* Live transcript */}
      <section className="mt-4 min-h-[42vh] rounded-2xl bg-card p-4 shadow-card">
        {paragraphs.length === 0 && !live.partial ? (
          <div className="flex h-full min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Mic className="h-9 w-9 text-primary" />
            </div>
            <p className="mt-4 max-w-[16rem] text-sm text-muted-foreground">
              Tap record to begin. Scriptures and publications will be detected automatically.
            </p>
            {live.error && <p className="mt-3 text-xs text-red-500">{live.error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <div key={i}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/80">{p.speaker}</div>
                <ScriptureText text={p.text} className="text-[15px] leading-relaxed text-foreground" />
              </div>
            ))}
            {live.partial && (
              <p className="text-[15px] leading-relaxed italic text-muted-foreground">{live.partial}</p>
            )}
          </div>
        )}
      </section>

      {saving && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving transcript…
        </div>
      )}
      {saveError && (
        <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{saveError}</div>
      )}

      {/* Recording controls */}
      <section className="mt-6 flex flex-col items-center gap-3">
        {status !== "idle" && (
          <div className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${status === "recording" ? "bg-red-500" : "bg-gold"}`} />
            <span className="font-semibold text-foreground">
              {status === "recording" ? (live.status === "connecting" ? "Connecting…" : "Recording") : "Paused"}
            </span>
            <span className="tabular-nums text-muted-foreground">{fmt(elapsed)}</span>
          </div>
        )}
        <div className="flex items-center gap-6">
          {status !== "idle" && (
            <button onClick={stop} disabled={saving} className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-card disabled:opacity-50" aria-label="Stop">
              <Square className="h-6 w-6 fill-foreground text-foreground" />
            </button>
          )}
          <button
            onClick={toggle}
            disabled={saving}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground shadow-elevated transition-transform active:scale-95 disabled:opacity-50 ${
              status === "recording" ? "animate-record-pulse bg-red-500" : "bg-primary"
            }`}
            aria-label={status === "recording" ? "Pause" : "Record"}
          >
            {status === "recording" ? <Pause className="h-9 w-9" /> : status === "paused" ? <Play className="h-9 w-9 fill-current" /> : <Mic className="h-9 w-9" />}
          </button>
          <button className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-card" aria-label="Add">
            <Plus className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </section>


      {showSession && <SessionEditor session={session} onSave={(s) => { setSession(s); setShowSession(false); }} onClose={() => setShowSession(false)} />}
    </PageShell>
  );
}

function fmtDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec} sec`;
  const m = Math.round(totalSec / 60);
  return `${m} min`;
}

/** Accumulate live final turns into blocks of at least `minSentences` sentences
 *  so we don't render a new card for every short utterance. */
function groupFinalsBySentences(finals: string[], minSentences = 5): string[] {
  const blocks: string[] = [];
  let current = "";
  let count = 0;
  for (const f of finals) {
    if (current && count >= minSentences) {
      blocks.push(current);
      current = "";
      count = 0;
    }
    current = current ? `${current} ${f}` : f;
    const m = f.match(/[.!?]+(\s|$)/g);
    count += m ? m.length : 0;
  }
  if (current) blocks.push(current);
  return blocks;
}

function SessionEditor({ session, onSave, onClose }: { session: any; onSave: (s: any) => void; onClose: () => void }) {
  const [s, setS] = useState(session);
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <button className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="animate-slide-up relative mx-auto w-full max-w-md rounded-t-3xl bg-card p-5 shadow-elevated safe-bottom">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
        <h2 className="text-lg font-semibold text-foreground">Session details</h2>
        <div className="mt-4 space-y-3">
          <Field label="Session type">
            <select value={s.type} onChange={(e) => setS({ ...s, type: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              {SESSION_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <input value={s.date} onChange={(e) => setS({ ...s, date: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          </Field>
          <Field label="Speaker name">
            <input placeholder="e.g., Bro. Marcus Williams" value={s.speaker} onChange={(e) => setS({ ...s, speaker: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          </Field>
          <Field label="Congregation">
            <input placeholder="e.g., Eastside Congregation" value={s.congregation} onChange={(e) => setS({ ...s, congregation: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          </Field>
          <Field label="Talk title">
            <input placeholder="Auto-filled from program" value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          </Field>
        </div>
        <button onClick={() => onSave(s)} className="mt-5 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Save</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
