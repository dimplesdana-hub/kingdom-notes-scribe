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
      const timeout = setTimeout(() => controller.abort(), 5000);
      let html: string;
      try {
        const res = await fetch(url, {
          headers: {
            "user-agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "referer": "https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/",
            "cache-control": "no-cache",
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

function cleanHtmlToText(segment: string, stripLeadingNum?: number): string {
  let text = segment
    .replace(/<sup[\s\S]*?<\/sup>/g, "")
    .replace(/<a[^>]*class="[^"]*fn[^"]*"[\s\S]*?<\/a>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripLeadingNum !== undefined) {
    text = text.replace(new RegExp(`^${stripLeadingNum}\\s+`), "");
  }
  return text;
}

/** Extract a single verse's plain text from a WOL NWT chapter page.
 *  Primary: WOL id="v<book>-<chapter>-<verse>-..." anchor pattern.
 *  Fallback: data-usfm attribute and class-based verse markers. */
function extractVerse(html: string, bookNum: number, chapter: number, verse: number): string | null {
  // Strategy 1: standard id="v{book}-{chapter}-{verse}-..." anchor
  const idPrefix = `v${bookNum}-${chapter}-${verse}-`;
  const idIdx = html.indexOf(`id="${idPrefix}`);
  if (idIdx !== -1) {
    const afterAttr = html.indexOf(">", idIdx);
    if (afterAttr !== -1) {
      const tail = html.slice(afterAttr + 1);
      const nextVerse = tail.search(/id="v\d+-\d+-\d+-/);
      const segment = nextVerse === -1 ? tail.slice(0, 4000) : tail.slice(0, nextVerse);
      const text = cleanHtmlToText(segment, verse);
      if (text) return text;
    }
  }

  // Strategy 2: data-usfm attribute (e.g., data-usfm="GEN 1:1")
  const books = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
  const usfmBook = books[bookNum - 1];
  if (usfmBook) {
    const usfmAttr = `data-usfm="${usfmBook} ${chapter}:${verse}"`;
    const usfmIdx = html.indexOf(usfmAttr);
    if (usfmIdx !== -1) {
      const openTag = html.lastIndexOf("<", usfmIdx);
      const closeAngle = html.indexOf(">", usfmIdx);
      if (openTag !== -1 && closeAngle !== -1) {
        const tail = html.slice(closeAngle + 1);
        const nextVerse = tail.search(/data-usfm="|id="v\d+-\d+-\d+-/);
        const segment = nextVerse === -1 ? tail.slice(0, 4000) : tail.slice(0, nextVerse);
        const text = cleanHtmlToText(segment, verse);
        if (text) return text;
      }
    }
  }

  return null;
}
