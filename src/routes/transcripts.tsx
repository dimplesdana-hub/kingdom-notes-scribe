import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Share2, FileText, Upload } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { sampleTranscripts } from "@/lib/sample-data";
import { ShareSheet } from "@/components/ShareSheet";

export const Route = createFileRoute("/transcripts")({
  head: () => ({ meta: [{ title: "Transcripts — Kingdom Notes" }] }),
  component: TranscriptsPage,
});

const FILTERS = ["All", "Meetings", "Assemblies", "Conventions", "Personal Study", "Imported"] as const;

function TranscriptsPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");

  const items = sampleTranscripts.filter((t) => {
    const fOk =
      active === "All" ||
      (active === "Meetings" && t.type === "Meeting") ||
      (active === "Assemblies" && t.type === "Assembly") ||
      (active === "Conventions" && t.type === "Convention") ||
      (active === "Personal Study" && t.type === "Personal Study");
    const sOk = !q || (t.title + t.speaker + t.preview).toLowerCase().includes(q.toLowerCase());
    return fOk && sOk;
  });

  return (
    <PageShell title="My Transcripts">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search transcripts"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-card">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="-mx-4 mt-3 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-2.5 text-sm font-medium text-primary">
        <Upload className="h-4 w-4" /> Import from Otter
      </button>

      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t.id}>
            <Link
              to="/transcripts/$id"
              params={{ id: t.id }}
              className="block rounded-2xl bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-primary">{t.type}</div>
                    <div className="line-clamp-1 font-semibold text-foreground">{t.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {t.speaker}{t.congregation && ` · ${t.congregation}`}
                    </div>
                  </div>
                </div>
                <ShareSheet
                  transcript={t}
                  trigger={
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                      aria-label="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{t.preview}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.date} · {t.duration}</span>
                <span className="rounded-full bg-gold/25 px-2 py-0.5 font-medium text-gold-foreground dark:text-gold">{t.scriptures.length} scriptures</span>
              </div>
            </Link>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No transcripts match your search yet.
          </li>
        )}
      </ul>
    </PageShell>
  );
}
