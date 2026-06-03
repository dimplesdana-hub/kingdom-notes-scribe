import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { lookupScripture, SCRIPTURE_TEXT } from "@/lib/scriptures";
const SCRIPTURE_TEXT_HAS = (r: string) => Object.prototype.hasOwnProperty.call(SCRIPTURE_TEXT, r);
import { fetchScripture } from "@/lib/scripture.functions";
import { parseReference, type ParsedRef } from "@/lib/bible-books";

const verseCache = new Map<string, string>();

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

/** Study-Bible fallback link (per spec). */
function buildStudyBibleUrl(p: ParsedRef): string {
  return `https://www.jw.org/en/library/bible/study-bible/books/${p.book.slug}/${p.chapter}/#v${p.book.number}${pad3(p.chapter)}${pad3(p.verse)}`;
}

/** Inline expandable scripture chip. Tap to expand verse text in-place. */
export function InlineScripture({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string | null>(() => verseCache.get(reference) ?? null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const fetchVerse = useServerFn(fetchScripture);

  useEffect(() => {
    if (!open || text || loading || failed) return;
    let cancelled = false;
    setLoading(true);

    // Client-side hard timeout: never show "Loading…" longer than 3s.
    const timeout = setTimeout(() => {
      if (cancelled) return;
      const local = SCRIPTURE_TEXT_HAS(reference) ? lookupScripture(reference) : null;
      if (local) {
        verseCache.set(reference, local);
        setText(local);
      } else {
        setFailed(true);
      }
      setLoading(false);
      cancelled = true;
    }, 3000);

    fetchVerse({ data: { reference } })
      .then((res) => {
        if (cancelled) return;
        if (res.text) {
          verseCache.set(reference, res.text);
          setText(res.text);
        } else {
          const local = SCRIPTURE_TEXT_HAS(reference) ? lookupScripture(reference) : null;
          if (local) {
            verseCache.set(reference, local);
            setText(local);
          } else {
            setFailed(true);
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        const local = SCRIPTURE_TEXT_HAS(reference) ? lookupScripture(reference) : null;
        if (local) {
          verseCache.set(reference, local);
          setText(local);
        } else {
          setFailed(true);
        }
      })
      .finally(() => {
        if (cancelled) return;
        clearTimeout(timeout);
        setLoading(false);
        cancelled = true;
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [open, reference, text, loading, failed, fetchVerse]);

  const parsed = parseReference(reference);
  const fallbackUrl = parsed ? buildStudyBibleUrl(parsed) : null;

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
      {open && (
        <span className="my-2 block rounded-xl border-l-4 border-primary bg-foreground/95 p-3 text-[0.95rem] leading-relaxed text-background shadow-card dark:bg-card dark:text-foreground">
          <span className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <span>{reference} · NWT</span>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          </span>
          <span className="block">
            {text ? (
              text
            ) : loading ? (
              "Loading verse…"
            ) : fallbackUrl ? (
              <span className="block">
                <strong className="font-bold">{reference}</strong>{" "}
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline"
                >
                  Tap to read on JW.org
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            ) : (
              "Verse text unavailable."
            )}
          </span>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 block text-xs font-medium text-primary hover:underline"
          >
            Collapse
          </button>
        </span>
      )}
    </span>
  );
}
