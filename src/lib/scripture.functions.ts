import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseReference } from "./bible-books";

const InputSchema = z.object({
  reference: z.string().min(3).max(120),
});

/** Fetch NWT verse text from JW.org for a given reference (e.g. "John 3:16" or "Romans 8:38-39"). */
export const fetchScripture = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const parsed = parseReference(data.reference);
    if (!parsed) return { text: null, error: "Unrecognized reference" as string | null };

    const url = `https://www.jw.org/en/library/bible/nwt/books/${parsed.book.slug}/${parsed.chapter}/`;

    try {
      const res = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; KingdomNotes/1.0; +https://kingdomnotes.app)",
          "accept": "text/html",
        },
      });
      if (!res.ok) return { text: null, error: `JW.org returned ${res.status}` };
      const html = await res.text();

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
      return { text: null, error: e?.message ?? "Failed to fetch verse" };
    }
  });

/** Extract a single verse's plain text from a JW.org NWT chapter page. */
function extractVerse(html: string, bookNum: number, chapter: number, verse: number): string | null {
  // JW.org marks each verse with id="v<bookNum><chapter padded to 3><verse padded to 3>"
  const id = `v${bookNum}${String(chapter).padStart(3, "0")}${String(verse).padStart(3, "0")}`;
  // The verse text lives inside a span with that id; capture content up to closing </span>.
  // Use a permissive regex that finds the id then grabs text until the next <span id="v...".
  const idIdx = html.indexOf(`id="${id}"`);
  if (idIdx === -1) return null;
  // Find the start of the enclosing element after the id attribute
  const afterAttr = html.indexOf(">", idIdx);
  if (afterAttr === -1) return null;
  // Slice from there until the next verse marker or end of paragraph
  const tail = html.slice(afterAttr + 1);
  const nextVerse = tail.search(/id="v\d{9,10}"/);
  const segment = nextVerse === -1 ? tail.slice(0, 4000) : tail.slice(0, nextVerse);
  // Strip tags, footnotes, verse numbers
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
  // Often starts with the verse number followed by text — strip leading "16 " etc.
  text = text.replace(new RegExp(`^${verse}\\s+`), "");
  return text || null;
}
