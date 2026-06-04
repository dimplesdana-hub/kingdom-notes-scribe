import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Share2, FileText, Upload, Plus, Folder as FolderIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { sampleTranscripts } from "@/lib/sample-data";
import { ShareSheet } from "@/components/ShareSheet";
import { useFolders } from "@/lib/folders";

export const Route = createFileRoute("/_authenticated/transcripts")({
  head: () => ({
    meta: [
      { title: "Transcripts — Kingdom Notes" },
      { name: "description", content: "Search, organize, and review all your saved transcripts with scripture references and AI summaries." },
    ],
  }),
  component: TranscriptsPage,
});

const FILTERS = ["All", "Meetings", "Assemblies", "Conventions", "Personal Study", "Imported"] as const;

function TranscriptsPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");
  const { folders, addFolder } = useFolders("religion");
  const [newFolder, setNewFolder] = useState("");
  const [showNew, setShowNew] = useState(false);

  const submitFolder = () => {
    const v = newFolder.trim();
    if (!v) return;
    addFolder(v);
    setNewFolder("");
    setShowNew(false);
  };

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
            className="w-full rounded-xl border border-card-hairline bg-card py-2.5 pl-9 pr-3 text-sm shadow-card outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button aria-label="Filter transcripts" className="flex h-10 w-10 items-center justify-center rounded-xl border border-card-hairline bg-card shadow-card">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="-mx-4 mt-3 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                active === f
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card text-foreground/70 border border-card-hairline shadow-chip hover:text-foreground active:scale-[0.97]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-card-hairline bg-card py-2.5 text-sm font-medium text-primary shadow-chip">
        <Upload className="h-4 w-4" /> Import from Otter
      </button>

      {active === "All" && (
        <>
          <div className="mt-5 flex items-center justify-between">
            <h2 className="section-label px-1">Folders</h2>
            <button
              onClick={() => setShowNew((v) => !v)}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              <Plus className="h-3.5 w-3.5" /> New
            </button>
          </div>

          {showNew && (
            <div className="mt-2 flex gap-2">
              <input
                autoFocus
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitFolder(); if (e.key === "Escape") setShowNew(false); }}
                placeholder="Folder name"
                className="flex-1 rounded-lg border border-card-hairline bg-card px-3 py-2 text-sm"
              />
              <button onClick={submitFolder} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Add</button>
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">
            {folders.map((f) => (
              <button
                key={f.id}
                className="flex items-center gap-2 rounded-2xl border border-card-hairline bg-folder-gradient p-2.5 text-left shadow-card transition-transform active:scale-[0.98] hover:shadow-elevated"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <FolderIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight text-foreground">{f.name}</div>
                  <div className="text-[11px] text-muted-foreground">0 recordings</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t.id}>
            <Link
              to="/transcripts/$id"
              params={{ id: t.id }}
              className="block rounded-2xl border border-card-hairline bg-card p-4 shadow-card transition-all active:scale-[0.99] hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t.type}</div>
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
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground-soft">{t.preview}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.date} · {t.duration}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{t.scriptures.length} scriptures</span>
              </div>
            </Link>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-card-hairline bg-card p-10 text-center text-sm text-muted-foreground">
            No transcripts match your search yet.
          </li>
        )}
      </ul>
    </PageShell>
  );
}
