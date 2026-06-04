import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Sparkles, ListChecks, BookOpen, Share2, Loader2 } from "lucide-react";
import { sampleTranscripts, type Transcript } from "@/lib/sample-data";
import { ScriptureText } from "@/components/ScriptureText";
import { InlineScripture } from "@/components/InlineScripture";
import { ShareSheet } from "@/components/ShareSheet";
import { getTranscript } from "@/lib/summarize.functions";
import { findReferences } from "@/lib/bible-books";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/_authenticated/transcripts_/$id")({
  head: () => ({ meta: [{ title: "Transcript — Kingdom Notes" }] }),
  component: TranscriptDetailPage,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">Transcript not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">{String(error)}</div>
  ),
});

type Tab = "transcript" | "summary" | "actions" | "scriptures";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "transcript", label: "Transcript", icon: FileText },
  { id: "summary", label: "Summary", icon: Sparkles },
  { id: "actions", label: "Action Items", icon: ListChecks },
  { id: "scriptures", label: "Scriptures", icon: BookOpen },
];

interface ViewModel {
  type: string;
  title: string;
  speaker: string;
  congregation: string;
  date: string;
  duration: string;
  body: { time: string; speaker: string; text: string }[];
  summary: string[];
  actionItems: string[];
  scriptures: string[];
  summaryStatus: "idle" | "pending" | "processing" | "ready" | "failed";
  summaryError: string | null;
}

function sampleToView(t: Transcript): ViewModel {
  return {
    type: t.type,
    title: t.title,
    speaker: t.speaker,
    congregation: t.congregation,
    date: t.date,
    duration: t.duration,
    body: t.body,
    summary: t.summary,
    actionItems: t.actionItems,
    scriptures: t.scriptures,
    summaryStatus: "ready",
    summaryError: null,
  };
}

function rowToView(row: any): ViewModel {
  const fullText: string = row.full_text ?? "";
  const speakerName: string = row.speaker || "Speaker";
  const body = fullText
    .split(/\n{2,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((text) => ({ time: "", speaker: speakerName, text }));
  return {
    type: row.type ?? "Recording",
    title: row.title ?? "Untitled",
    speaker: speakerName,
    congregation: row.congregation ?? "",
    date: row.date ?? "",
    duration: row.duration ?? "",
    body,
    summary: Array.isArray(row.summary) ? row.summary : [],
    actionItems: Array.isArray(row.action_items) ? row.action_items : [],
    scriptures: Array.isArray(row.scriptures) ? row.scriptures : [],
    summaryStatus: (row.summary_status ?? "idle") as ViewModel["summaryStatus"],
    summaryError: row.summary_error ?? null,
  };
}

function TranscriptDetailPage() {
  const { id } = Route.useParams();
  const [tab, setTab] = useState<Tab>("transcript");

  const isUuid = UUID_RE.test(id);
  const fetchRow = useServerFn(getTranscript);

  const sample = !isUuid ? sampleTranscripts.find((x) => x.id === id) : undefined;

  const { data: row, isLoading, error } = useQuery({
    queryKey: ["transcript", id],
    queryFn: () => fetchRow({ data: { id } }),
    enabled: isUuid,
    // Poll while AI summary is still processing.
    refetchInterval: (q) => {
      const r: any = q.state.data;
      const s = r?.summary_status;
      return s === "pending" || s === "processing" ? 2000 : false;
    },
  });

  if (!isUuid && !sample) {
    return <div className="p-8 text-center text-muted-foreground">Transcript not found.</div>;
  }
  if (isUuid && isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading transcript…
      </div>
    );
  }
  if (isUuid && error) {
    return <div className="p-8 text-center text-destructive">{String(error)}</div>;
  }
  if (isUuid && !row) {
    return <div className="p-8 text-center text-muted-foreground">Transcript not found.</div>;
  }

  const t: ViewModel = sample ? sampleToView(sample) : rowToView(row);
  const aiBusy = t.summaryStatus === "pending" || t.summaryStatus === "processing";

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-28">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-4 pb-3 pt-4 backdrop-blur safe-top">
        <div className="flex items-center gap-2">
          <Link
            to="/transcripts"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-primary">{t.type}</div>
            <h1 className="line-clamp-1 text-base font-semibold text-foreground">{t.title}</h1>
            <div className="line-clamp-1 text-xs text-muted-foreground">
              {t.speaker}
              {t.congregation && ` · ${t.congregation}`}
              {t.date && ` · ${t.date}`}
              {t.duration && ` · ${t.duration}`}
            </div>
          </div>
          {sample && (
            <ShareSheet
              transcript={sample}
              trigger={
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              }
            />
          )}
        </div>

        <div className="-mx-1 mt-3 flex gap-1 overflow-x-auto">
          {TABS.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.id;
            const showDot = aiBusy && (tb.id === "summary" || tb.id === "actions");
            return (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tb.label}
                {showDot && <Loader2 className="h-3 w-3 animate-spin" />}
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-4 pt-4">
        {tab === "transcript" && <TranscriptTab paragraphs={t.body} />}
        {tab === "summary" && (
          <AiList
            items={t.summary}
            status={t.summaryStatus}
            error={t.summaryError}
            emptyLabel="No summary yet."
            busyLabel="Generating summary…"
          />
        )}
        {tab === "actions" && (
          <AiList
            items={t.actionItems}
            status={t.summaryStatus}
            error={t.summaryError}
            emptyLabel="No action items detected."
            busyLabel="Extracting action items…"
          />
        )}
        {tab === "scriptures" && <ScripturesTab refs={t.scriptures} />}
      </main>
    </div>
  );
}

function TranscriptTab({ paragraphs }: { paragraphs: { time: string; speaker: string; text: string }[] }) {
  if (!paragraphs.length) {
    return <Empty msg="The transcript will appear here once the recording is processed." />;
  }
  return (
    <ul className="space-y-4">
      {paragraphs.map((p, i) => (
        <li key={i} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">{p.speaker}</span>
            {p.time && <span className="text-muted-foreground">{p.time}</span>}
          </div>
          <p className="text-[0.95rem] leading-relaxed text-foreground">
            <ScriptureText text={p.text} />
          </p>
        </li>
      ))}
    </ul>
  );
}

function AiList({
  items,
  status,
  error,
  emptyLabel,
  busyLabel,
}: {
  items: string[];
  status: ViewModel["summaryStatus"];
  error: string | null;
  emptyLabel: string;
  busyLabel: string;
}) {
  if (status === "pending" || status === "processing") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card p-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" /> {busyLabel}
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        AI summary failed{error ? `: ${error}` : "."}
      </div>
    );
  }
  if (!items.length) return <Empty msg={emptyLabel} />;
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-2xl bg-card p-4 text-[0.95rem] text-foreground shadow-card"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function ScripturesTab({ refs }: { refs: string[] }) {
  if (!refs.length) return <Empty msg="No scriptures detected in this recording." />;
  return (
    <ul className="space-y-2">
      {refs.map((r) => (
        <li key={r} className="rounded-2xl bg-card p-4 shadow-card">
          <InlineScripture reference={r} />
        </li>
      ))}
    </ul>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}
