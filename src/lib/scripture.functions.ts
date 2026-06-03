import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseReference } from "./bible-books";

const InputSchema = z.object({
  reference: z.string().min(3).max(120),
});

/** Fetch NWT verse text from WOL (Watchtower Online Library) for a given reference. */
export const fetchScripture = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const parsed = parseReference(data.reference);
    if (!parsed) return { text: null, error: "Unrecognized reference" as string | null };

    const url = `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${parsed.book.number}/${parsed.chapter}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      let html: string;
      try {
        const res = await fetch(url, {
          headers: {
            "user-agent":
              "Mozilla/5.0 (compatible; KingdomNotes/1.0; +https://kingdomnotes.app)",
            "accept": "text/html",
          },
          signal: controller.signal,
        });
        if (!res.ok) return { text: null, error: `WOL returned ${res.status}` };
        html = await res.text();
      } finally {
        clearTimeout(timeout);
      }

      const start = parsed.verse;
      const end = parsed.endVerse ?? parsed.verse;
      const collected: string[] = [];
      for (let v = start; v <= end; v++) {
        const t = extractVerse(html, parsed.book.number, parsed.chapter, v);
        if (t) collected.push(t);
      }
      if (!collected.length) return { text: null, error: "Verse text not found" };
      return { text: collected.join(" "), error: null };
    } catch (e: any) {
      const msg = e?.name === "AbortError" ? "Timed out" : e?.message ?? "Failed to fetch verse";
      return { text: null, error: msg };
    }
  });

/** Extract a single verse's plain text from a WOL NWT chapter page.
 *  WOL marks verses with id="v<book>-<chapter>-<verse>-..." and class names
 *  containing the verse number; we anchor on the id prefix and clean tags. */
function extractVerse(html: string, bookNum: number, chapter: number, verse: number): string | null {
  // WOL uses ids like id="v1-1-1-1" (book-chapter-verse-...) on verse spans.
  const idPrefix = `v${bookNum}-${chapter}-${verse}-`;
  const idIdx = html.indexOf(`id="${idPrefix}`);
  if (idIdx === -1) return null;
  const afterAttr = html.indexOf(">", idIdx);
  if (afterAttr === -1) return null;
  const tail = html.slice(afterAttr + 1);
  // Stop at the next verse marker
  const nextVerse = tail.search(/id="v\d+-\d+-\d+-/);
  const segment = nextVerse === -1 ? tail.slice(0, 4000) : tail.slice(0, nextVerse);
  let text = segment
    .replace(/<sup[\s\S]*?<\/sup>/g, "")
    .replace(/<a[^>]*class="[^"]*fn[^"]*"[\s\S]*?<\/a>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  text = text.replace(new RegExp(`^${verse}\\s+`), "");
  return text || null;
}
