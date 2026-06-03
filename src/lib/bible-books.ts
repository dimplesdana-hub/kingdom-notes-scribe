// Bible book metadata for JW.org NWT URL building.
// number is the canonical 1..66 book number used in the JW.org verse anchor.

export interface BookMeta {
  number: number;
  slug: string;
  chapters: number;
  aliases: string[]; // lowercased, no punctuation
}

export const BIBLE_BOOKS: BookMeta[] = [
  { number: 1, slug: "genesis", chapters: 50, aliases: ["genesis", "gen", "ge"] },
  { number: 2, slug: "exodus", chapters: 40, aliases: ["exodus", "ex", "exo"] },
  { number: 3, slug: "leviticus", chapters: 27, aliases: ["leviticus", "lev", "le"] },
  { number: 4, slug: "numbers", chapters: 36, aliases: ["numbers", "num", "nu"] },
  { number: 5, slug: "deuteronomy", chapters: 34, aliases: ["deuteronomy", "deut", "dt", "de"] },
  { number: 6, slug: "joshua", chapters: 24, aliases: ["joshua", "josh", "jos"] },
  { number: 7, slug: "judges", chapters: 21, aliases: ["judges", "judg", "jdg"] },
  { number: 8, slug: "ruth", chapters: 4, aliases: ["ruth", "ru"] },
  { number: 9, slug: "1-samuel", chapters: 31, aliases: ["1 samuel", "1samuel", "1 sam", "1sam", "1 sa", "1sa"] },
  { number: 10, slug: "2-samuel", chapters: 24, aliases: ["2 samuel", "2samuel", "2 sam", "2sam", "2 sa", "2sa"] },
  { number: 11, slug: "1-kings", chapters: 22, aliases: ["1 kings", "1kings", "1 ki", "1ki", "1 kgs"] },
  { number: 12, slug: "2-kings", chapters: 25, aliases: ["2 kings", "2kings", "2 ki", "2ki", "2 kgs"] },
  { number: 13, slug: "1-chronicles", chapters: 29, aliases: ["1 chronicles", "1chronicles", "1 chron", "1 chr", "1ch"] },
  { number: 14, slug: "2-chronicles", chapters: 36, aliases: ["2 chronicles", "2chronicles", "2 chron", "2 chr", "2ch"] },
  { number: 15, slug: "ezra", chapters: 10, aliases: ["ezra", "ezr"] },
  { number: 16, slug: "nehemiah", chapters: 13, aliases: ["nehemiah", "neh", "ne"] },
  { number: 17, slug: "esther", chapters: 10, aliases: ["esther", "est", "es"] },
  { number: 18, slug: "job", chapters: 42, aliases: ["job"] },
  { number: 19, slug: "psalms", chapters: 150, aliases: ["psalms", "psalm", "ps", "psa"] },
  { number: 20, slug: "proverbs", chapters: 31, aliases: ["proverbs", "prov", "pr", "pro"] },
  { number: 21, slug: "ecclesiastes", chapters: 12, aliases: ["ecclesiastes", "eccl", "ecc", "ec"] },
  { number: 22, slug: "song-of-solomon", chapters: 8, aliases: ["song of solomon", "song of songs", "song", "sos", "ca"] },
  { number: 23, slug: "isaiah", chapters: 66, aliases: ["isaiah", "isa", "is"] },
  { number: 24, slug: "jeremiah", chapters: 52, aliases: ["jeremiah", "jer", "je"] },
  { number: 25, slug: "lamentations", chapters: 5, aliases: ["lamentations", "lam", "la"] },
  { number: 26, slug: "ezekiel", chapters: 48, aliases: ["ezekiel", "ezek", "eze"] },
  { number: 27, slug: "daniel", chapters: 12, aliases: ["daniel", "dan", "da"] },
  { number: 28, slug: "hosea", chapters: 14, aliases: ["hosea", "hos", "ho"] },
  { number: 29, slug: "joel", chapters: 3, aliases: ["joel", "joe"] },
  { number: 30, slug: "amos", chapters: 9, aliases: ["amos", "am"] },
  { number: 31, slug: "obadiah", chapters: 1, aliases: ["obadiah", "obad", "ob"] },
  { number: 32, slug: "jonah", chapters: 4, aliases: ["jonah", "jon"] },
  { number: 33, slug: "micah", chapters: 7, aliases: ["micah", "mic", "mi"] },
  { number: 34, slug: "nahum", chapters: 3, aliases: ["nahum", "nah", "na"] },
  { number: 35, slug: "habakkuk", chapters: 3, aliases: ["habakkuk", "hab"] },
  { number: 36, slug: "zephaniah", chapters: 3, aliases: ["zephaniah", "zeph", "zep"] },
  { number: 37, slug: "haggai", chapters: 2, aliases: ["haggai", "hag"] },
  { number: 38, slug: "zechariah", chapters: 14, aliases: ["zechariah", "zech", "zec"] },
  { number: 39, slug: "malachi", chapters: 4, aliases: ["malachi", "mal"] },
  { number: 40, slug: "matthew", chapters: 28, aliases: ["matthew", "matt", "mt"] },
  { number: 41, slug: "mark", chapters: 16, aliases: ["mark", "mk", "mr"] },
  { number: 42, slug: "luke", chapters: 24, aliases: ["luke", "lk", "lu"] },
  { number: 43, slug: "john", chapters: 21, aliases: ["john", "jn", "joh"] },
  { number: 44, slug: "acts", chapters: 28, aliases: ["acts", "ac"] },
  { number: 45, slug: "romans", chapters: 16, aliases: ["romans", "rom", "ro"] },
  { number: 46, slug: "1-corinthians", chapters: 16, aliases: ["1 corinthians", "1corinthians", "1 cor", "1cor", "1 co"] },
  { number: 47, slug: "2-corinthians", chapters: 13, aliases: ["2 corinthians", "2corinthians", "2 cor", "2cor", "2 co"] },
  { number: 48, slug: "galatians", chapters: 6, aliases: ["galatians", "gal", "ga"] },
  { number: 49, slug: "ephesians", chapters: 6, aliases: ["ephesians", "eph"] },
  { number: 50, slug: "philippians", chapters: 4, aliases: ["philippians", "phil", "php"] },
  { number: 51, slug: "colossians", chapters: 4, aliases: ["colossians", "col"] },
  { number: 52, slug: "1-thessalonians", chapters: 5, aliases: ["1 thessalonians", "1thessalonians", "1 thess", "1 th"] },
  { number: 53, slug: "2-thessalonians", chapters: 3, aliases: ["2 thessalonians", "2thessalonians", "2 thess", "2 th"] },
  { number: 54, slug: "1-timothy", chapters: 6, aliases: ["1 timothy", "1timothy", "1 tim", "1 ti"] },
  { number: 55, slug: "2-timothy", chapters: 4, aliases: ["2 timothy", "2timothy", "2 tim", "2 ti"] },
  { number: 56, slug: "titus", chapters: 3, aliases: ["titus", "tit"] },
  { number: 57, slug: "philemon", chapters: 1, aliases: ["philemon", "phlm", "phm"] },
  { number: 58, slug: "hebrews", chapters: 13, aliases: ["hebrews", "heb"] },
  { number: 59, slug: "james", chapters: 5, aliases: ["james", "jas", "jam"] },
  { number: 60, slug: "1-peter", chapters: 5, aliases: ["1 peter", "1peter", "1 pet", "1 pe"] },
  { number: 61, slug: "2-peter", chapters: 3, aliases: ["2 peter", "2peter", "2 pet", "2 pe"] },
  { number: 62, slug: "1-john", chapters: 5, aliases: ["1 john", "1john", "1 jn", "1 jo"] },
  { number: 63, slug: "2-john", chapters: 1, aliases: ["2 john", "2john", "2 jn", "2 jo"] },
  { number: 64, slug: "3-john", chapters: 1, aliases: ["3 john", "3john", "3 jn", "3 jo"] },
  { number: 65, slug: "jude", chapters: 1, aliases: ["jude", "jud"] },
  { number: 66, slug: "revelation", chapters: 22, aliases: ["revelation", "rev", "re"] },
];

const ALIAS_MAP: Map<string, BookMeta> = (() => {
  const m = new Map<string, BookMeta>();
  for (const b of BIBLE_BOOKS) for (const a of b.aliases) m.set(a, b);
  return m;
})();

function normalize(name: string): string {
  let n = name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
  n = n.replace(/^(first|1st)\s+/, "1 ");
  n = n.replace(/^(second|2nd)\s+/, "2 ");
  n = n.replace(/^(third|3rd)\s+/, "3 ");
  n = n.replace(/\brevelations\b/, "revelation");
  return n;
}

export function findBook(name: string): BookMeta | null {
  return ALIAS_MAP.get(normalize(name)) ?? null;
}

export interface ParsedRef {
  book: BookMeta;
  display: string;
  chapter: number;
  verse: number;
  endVerse?: number;
}

// Parses a single reference string. Accepts:
//  - "John 3:16", "Romans 8:38-39", "Romans 8:38,39", "Romans 8:38, 39"
//  - spoken: "John 3 16", "Romans 8 38 39", "Romans 8 38 and 39"
export function parseReference(raw: string): ParsedRef | null {
  const m = raw.match(
    /^\s*((?:(?:[1-3]|first|second|third|1st|2nd|3rd)\s+)?[A-Za-z]+(?:\s+(?:of\s+)?[A-Za-z]+)?)\s+(\d+)\s*(?::\s*|\s+)(\d+)(?:\s*(?:[-–,]|\s+and)\s*(\d+))?\s*$/i,
  );
  if (!m) return null;
  const book = findBook(m[1]);
  if (!book) return null;
  const chapter = parseInt(m[2], 10);
  if (chapter < 1 || chapter > book.chapters) return null;
  const verse = parseInt(m[3], 10);
  const endVerse = m[4] ? parseInt(m[4], 10) : undefined;
  const fullName = book.aliases[0]
    .split(" ")
    .map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  const display = `${fullName} ${chapter}:${verse}${endVerse && endVerse > verse ? `-${endVerse}` : ""}`;
  return { book, display, chapter, verse, endVerse: endVerse && endVerse > verse ? endVerse : undefined };
}

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function buildJwUrl(p: { book: BookMeta; chapter: number; verse: number }): string {
  return `https://www.jw.org/en/library/bible/nwt/books/${p.book.slug}/${p.chapter}/#v${p.book.number}${pad3(p.chapter)}${pad3(p.verse)}`;
}

// Book-name alternation including ordinal prefixes and "Revelations".
const BOOK_ALT =
  "(?:(?:[1-3]|First|Second|Third|1st|2nd|3rd)\\s+)?" +
  "(?:Genesis|Gen|Exodus|Exod?|Leviticus|Lev|Numbers|Num|Deuteronomy|Deut|Joshua|Josh|Judges|Judg|Ruth|Samuel|Sam|Kings|Kgs|Chronicles|Chron|Chr|Ezra|Nehemiah|Neh|Esther|Est|Job|Psalms?|Ps|Proverbs|Prov|Pr|Ecclesiastes|Eccl|Ecc|Song(?:\\sof\\s(?:Solomon|Songs))?|Isaiah|Isa|Jeremiah|Jer|Lamentations|Lam|Ezekiel|Ezek|Daniel|Dan|Hosea|Hos|Joel|Amos|Obadiah|Obad|Jonah|Jon|Micah|Mic|Nahum|Nah|Habakkuk|Hab|Zephaniah|Zeph|Haggai|Hag|Zechariah|Zech|Malachi|Mal|Matthew|Matt|Mt|Mark|Mk|Luke|Lk|John|Jn|Acts|Romans|Rom|Corinthians|Cor|Galatians|Gal|Ephesians|Eph|Philippians|Phil|Php|Colossians|Col|Thessalonians|Thess|Timothy|Tim|Titus|Tit|Philemon|Phlm|Hebrews|Heb|James|Jas|Peter|Pet|Jude|Revelations?|Rev)";

// Matches written + spoken refs with optional verse range via "-", ",", or " and ".
const REF_REGEX = new RegExp(
  `\\b(${BOOK_ALT}\\.?\\s+\\d+\\s*(?::\\s*|\\s+)\\d+(?:\\s*(?:[-–,]|\\s+and)\\s*\\d+)?)\\b`,
  "gi",
);

export interface RefMatch {
  start: number;
  end: number;
  raw: string;
  parsed: ParsedRef;
}

export function findReferences(text: string): RefMatch[] {
  const out: RefMatch[] = [];
  REF_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = REF_REGEX.exec(text)) !== null) {
    const parsed = parseReference(m[1]);
    if (parsed) out.push({ start: m.index, end: m.index + m[1].length, raw: m[1], parsed });
  }
  return out;
}
