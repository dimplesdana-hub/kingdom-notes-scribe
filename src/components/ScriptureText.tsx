import { InlineScripture } from "./InlineScripture";

/** Renders text and converts [Book Chapter:Verse] tokens into inline expandable
 *  scripture chips. Also highlights publication names in gold. */
export function ScriptureText({ text, className = "" }: { text: string; className?: string }) {
  const PUBS = ["Watchtower", "Awake!", "JW Library", "JW.org", "Bible Teach", "Examining the Scriptures Daily"];

  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]$/);
        if (m) {
          return <InlineScripture key={i} reference={m[1]} />;
        }
        let segs: (string | { pub: string })[] = [part];
        for (const pub of PUBS) {
          segs = segs.flatMap((seg) => {
            if (typeof seg !== "string") return [seg];
            const re = new RegExp(`(${pub.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
            return seg.split(re).map((s) => (s === pub ? { pub } : s));
          });
        }
        return (
          <span key={i}>
            {segs.map((s, j) =>
              typeof s === "string" ? (
                s
              ) : (
                <span
                  key={j}
                  className="rounded bg-gold/30 px-1 font-medium text-gold-foreground dark:bg-gold/25 dark:text-gold"
                >
                  {s.pub}
                </span>
              ),
            )}
          </span>
        );
      })}
    </span>
  );
}
