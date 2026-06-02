import { useState } from "react";
import { ScriptureSheet } from "./ScriptureSheet";

/** Renders text and converts [Book Chapter:Verse] tokens to orange chips.
 *  Also highlights publication names in gold. */
export function ScriptureText({ text, className = "" }: { text: string; className?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const PUBS = ["Watchtower", "Awake!", "JW Library", "JW.org", "Bible Teach", "Examining the Scriptures Daily"];

  // split by scripture tokens
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      <span className={className}>
        {parts.map((part, i) => {
          const m = part.match(/^\[([^\]]+)\]$/);
          if (m) {
            const ref = m[1];
            return (
              <button
                key={i}
                onClick={() => setOpen(ref)}
                className="mx-0.5 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
              >
                {ref}
              </button>
            );
          }
          // highlight publications
          let segs: (string | { pub: string })[] = [part];
          for (const pub of PUBS) {
            segs = segs.flatMap(seg => {
              if (typeof seg !== "string") return [seg];
              const re = new RegExp(`(${pub.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
              return seg.split(re).map((s) => (s === pub ? { pub } : s));
            });
          }
          return (
            <span key={i}>
              {segs.map((s, j) =>
                typeof s === "string"
                  ? s
                  : <span key={j} className="rounded bg-gold/30 px-1 font-medium text-gold-foreground dark:bg-gold/25 dark:text-gold">{s.pub}</span>
              )}
            </span>
          );
        })}
      </span>
      {open && <ScriptureSheet reference={open} onClose={() => setOpen(null)} />}
    </>
  );
}
