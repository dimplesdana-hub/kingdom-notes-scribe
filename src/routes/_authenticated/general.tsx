import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Folder as FolderIcon, Mic, Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useFolders } from "@/lib/folders";

export const Route = createFileRoute("/_authenticated/general")({
  head: () => ({
    meta: [
      { title: "General — Kingdom Notes" },
      { name: "description", content: "Organize non-religious recordings like work meetings, interviews, and personal notes into folders." },
    ],
  }),
  component: GeneralPage,
});

function GeneralPage() {
  const { folders, addFolder, removeFolder } = useFolders("general");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const submit = () => {
    const v = name.trim();
    if (!v) return;
    addFolder(v);
    setName("");
    setCreating(false);
  };

  return (
    <PageShell title="General">
      <p className="text-sm text-muted-foreground">
        Folders for non-religion recordings — work meetings, interviews, personal notes.
      </p>

      <button
        onClick={() => setCreating(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-2.5 text-sm font-medium text-primary"
      >
        <Plus className="h-4 w-4" /> New folder
      </button>

      {creating && (
        <div className="mt-3 rounded-xl border border-border bg-card p-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setCreating(false); }}
            placeholder="Folder name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={() => setCreating(false)} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground">Cancel</button>
            <button onClick={submit} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Create</button>
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-3">
        {folders.map((f) => (
          <li key={f.id} className="flex items-center gap-3 rounded-2xl border border-card-hairline bg-folder-gradient p-4 shadow-card transition-all hover:shadow-elevated">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <FolderIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 font-semibold text-foreground">{f.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">0 recordings</div>
            </div>
            <button
              onClick={() => removeFolder(f.id)}
              aria-label="Delete folder"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {folders.length === 0 && (
          <li className="rounded-2xl border border-dashed border-card-hairline bg-card p-10 text-center text-sm text-muted-foreground">
            No folders yet. Tap "New folder" to start.
          </li>
        )}
      </ul>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-card">
        <Mic className="h-4 w-4" /> Start a general recording
      </button>
    </PageShell>
  );
}
