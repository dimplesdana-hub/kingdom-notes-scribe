import { InlineScripture } from "./InlineScripture";
import { findReferences } from "@/lib/bible-books";

/** Renders text and converts both [Book Chapter:Verse] tokens AND raw scripture
 *  references (e.g. "John 3:16", "Romans 8:38-39") into inline expandable
 *  scripture chips. Also highlights publication names in gold. */
export function ScriptureText({ text, className = "" }: { text: string; className?: string }) {
  const PUBS = ["Watchtower", "Awake!", "JW Library", "JW.org", "Bible Teach", "Examining the Scriptures Daily"];

  // First split out explicit [bracketed] tokens; they always become chips.
  const bracketParts = text.split(/(\[[^\]]+\])/g);

  return (
    <span className={className}>
      {bracketParts.map((part, i) => {
        const bracket = part.match(/^\[([^\]]+)\]$/);
        if (bracket) return <InlineScripture key={`b-${i}`} reference={bracket[1]} />;
        return <RenderPlain key={`p-${i}`} text={part} pubs={PUBS} />;
      })}
    </span>
  );
}

function RenderPlain({ text, pubs }: { text: string; pubs: string[] }) {
  // Detect raw scripture references first.
  const refs = findReferences(text);
  if (!refs.length) return <RenderWithPubs text={text} pubs={pubs} />;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  refs.forEach((r, idx) => {
    if (r.start > cursor) {
      nodes.push(
        <RenderWithPubs key={`t-${idx}`} text={text.slice(cursor, r.start)} pubs={pubs} />,
      );
    }
    nodes.push(<InlineScripture key={`r-${idx}`} reference={r.parsed.display} />);
    cursor = r.end;
  });
  if (cursor < text.length) {
    nodes.push(<RenderWithPubs key="t-end" text={text.slice(cursor)} pubs={pubs} />);
  }
  return <>{nodes}</>;
}

function RenderWithPubs({ text, pubs }: { text: string; pubs: string[] }) {
  let segs: (string | { pub: string })[] = [text];
  for (const pub of pubs) {
    segs = segs.flatMap((seg) => {
      if (typeof seg !== "string") return [seg];
      const re = new RegExp(`(${pub.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
      return seg.split(re).map((s) => (s === pub ? { pub } : s));
    });
  }
  return (
    <>
      {segs.map((s, j) =>
        typeof s === "string" ? (
          <span key={j}>{s}</span>
        ) : (
          <span
            key={j}
            className="rounded bg-gold/30 px-1 font-medium text-gold-foreground dark:bg-gold/25 dark:text-gold"
          >
            {s.pub}
          </span>
        ),
      )}
    </>
  );
}
