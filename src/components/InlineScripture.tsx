import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { lookupScripture } from "@/lib/scriptures";

/** Inline expandable scripture chip. Tap to expand verse text in-place,
 *  no external link or modal. Tap again to collapse. */
export function InlineScripture({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const text = lookupScripture(reference);

  return (
    <span className="inline align-baseline">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mx-0.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
        aria-expanded={open}
      >
        {reference}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <span className="my-2 block rounded-xl border-l-4 border-primary bg-accent/60 p-3 text-[0.95rem] leading-relaxed text-foreground shadow-card dark:bg-card">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary">
            {reference} · NWT
          </span>
          <span className="block">{text}</span>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 text-xs font-medium text-primary hover:underline"
          >
            Collapse
          </button>
        </span>
      )}
    </span>
  );
}
