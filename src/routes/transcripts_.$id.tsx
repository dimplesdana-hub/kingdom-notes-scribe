import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FileText, Sparkles, ListChecks, BookOpen, Share2 } from "lucide-react";
import { sampleTranscripts } from "@/lib/sample-data";
import { ScriptureText } from "@/components/ScriptureText";
import { InlineScripture } from "@/components/InlineScripture";
import { ShareSheet } from "@/components/ShareSheet";

export const Route = createFileRoute("/transcripts_/$id")({
  head: () => ({ meta: [{ title: "Transcript — Kingdom Notes" }] }),
  loader: ({ params }) => {
    const t = sampleTranscripts.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return t;
  },
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

function TranscriptDetailPage() {
  const t = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("transcript");

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
              {t.congregation && ` · ${t.congregation}`} · {t.date} · {t.duration}
            </div>
          </div>
          <ShareSheet
            transcript={t}
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
        </div>

        <div className="-mx-1 mt-3 flex gap-1 overflow-x-auto">
          {TABS.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.id;
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
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-4 pt-4">
        {tab === "transcript" && <TranscriptTab paragraphs={t.body} />}
        {tab === "summary" && <BulletList items={t.summary} emptyLabel="No summary yet." />}
        {tab === "actions" && (
          <BulletList items={t.actionItems} emptyLabel="No action items extracted." />
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
            <span className="text-muted-foreground">{p.time}</span>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-foreground">
            <ScriptureText text={p.text} />
          </p>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
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
