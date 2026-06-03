import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { lookupScripture } from "@/lib/scriptures";
import { fetchScripture } from "@/lib/scripture.functions";
import { buildJwUrl, parseReference } from "@/lib/bible-books";

// Module-level cache so reopening a chip is instant.
const verseCache = new Map<string, string>();

/** Inline expandable scripture chip. Tap to expand verse text in-place,
 *  no external link or modal. Tap again to collapse. Verse is fetched
 *  from JW.org (NWT) on first expand and cached. */
export function InlineScripture({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string | null>(() => verseCache.get(reference) ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = useServerFn(fetchScripture);

  useEffect(() => {
    if (!open || text || loading) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchVerse({ data: { reference } })
      .then((res) => {
        if (cancelled) return;
        if (res.text) {
          verseCache.set(reference, res.text);
          setText(res.text);
        } else {
          // Fall back to the local NWT snippet map if we have it.
          const fallback = lookupScripture(reference);
          setText(fallback);
          if (res.error) setError(res.error);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setText(lookupScripture(reference));
        setError(e?.message ?? "Failed to load verse");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, reference, text, loading, fetchVerse]);

  return (
    <span className="inline align-baseline">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mx-0.5 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/25"
        aria-expanded={open}
      >
        {reference}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (() => {
        const parsed = parseReference(reference);
        const jwUrl = parsed ? buildJwUrl(parsed) : null;
        const showFallback = !loading && !text;
        return (
          <span className="my-2 block rounded-xl border-l-4 border-primary bg-foreground/95 p-3 text-[0.95rem] leading-relaxed text-background shadow-card dark:bg-card dark:text-foreground">
            <span className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <span>{reference} · NWT</span>
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            </span>
            <span className="block">
              {loading && !text ? (
                "Loading verse…"
              ) : text ? (
                text
              ) : jwUrl ? (
                <a
                  href={jwUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline"
                >
                  {reference} — tap to read on JW.org
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                "Verse text unavailable."
              )}
            </span>
            {error && !loading && showFallback && (
              <span className="mt-1 block text-xs text-primary/80">{error}</span>
            )}
            <button
              onClick={() => setOpen(false)}
              className="mt-2 block text-xs font-medium text-primary hover:underline"
            >
              Collapse
            </button>
          </span>
        );
      })()}
    </span>
  );
}
