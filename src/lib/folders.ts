import { useEffect, useState } from "react";

export type Folder = { id: string; name: string; createdAt: number };

const KEYS = {
  religion: "kn-folders-religion",
  general: "kn-folders-general",
} as const;

export type FolderScope = keyof typeof KEYS;

const DEFAULTS: Record<FolderScope, Folder[]> = {
  religion: [
    { id: "f-midweek", name: "Midweek Meetings", createdAt: 0 },
    { id: "f-weekend", name: "Weekend Meetings", createdAt: 0 },
    { id: "f-assemblies", name: "Assemblies", createdAt: 0 },
    { id: "f-personal", name: "Personal Study", createdAt: 0 },
  ],
  general: [
    { id: "g-work", name: "Work Meetings", createdAt: 0 },
    { id: "g-personal", name: "Personal Notes", createdAt: 0 },
    { id: "g-interviews", name: "Interviews", createdAt: 0 },
  ],
};

function read(scope: FolderScope): Folder[] {
  if (typeof localStorage === "undefined") return DEFAULTS[scope];
  try {
    const raw = localStorage.getItem(KEYS[scope]);
    if (!raw) return DEFAULTS[scope];
    return JSON.parse(raw) as Folder[];
  } catch {
    return DEFAULTS[scope];
  }
}

function write(scope: FolderScope, folders: Folder[]) {
  try { localStorage.setItem(KEYS[scope], JSON.stringify(folders)); } catch {}
}

export function useFolders(scope: FolderScope) {
  const [folders, setFolders] = useState<Folder[]>(DEFAULTS[scope]);
  useEffect(() => { setFolders(read(scope)); }, [scope]);

  const addFolder = (name: string) => {
    const next = [...folders, { id: `${scope}-${Date.now()}`, name, createdAt: Date.now() }];
    setFolders(next);
    write(scope, next);
  };
  const removeFolder = (id: string) => {
    const next = folders.filter((f) => f.id !== id);
    setFolders(next);
    write(scope, next);
  };
  return { folders, addFolder, removeFolder };
}
