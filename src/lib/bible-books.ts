// Bible book metadata for JW.org NWT URL building.
// number is the canonical 1..66 book number used in the JW.org verse anchor.
// slug is the URL slug used in https://www.jw.org/en/library/bible/nwt/books/<slug>/<chapter>/

export interface BookMeta {
  number: number;
  slug: string;
  aliases: string[]; // lowercased, no punctuation
}

export const BIBLE_BOOKS: BookMeta[] = [
  { number: 1, slug: "genesis", aliases: ["genesis", "gen", "ge"] },
  { number: 2, slug: "exodus", aliases: ["exodus", "ex", "exo"] },
  { number: 3, slug: "leviticus", aliases: ["leviticus", "lev", "le"] },
  { number: 4, slug: "numbers", aliases: ["numbers", "num", "nu"] },
  { number: 5, slug: "deuteronomy", aliases: ["deuteronomy", "deut", "dt", "de"] },
  { number: 6, slug: "joshua", aliases: ["joshua", "josh", "jos"] },
  { number: 7, slug: "judges", aliases: ["judges", "judg", "jdg"] },
  { number: 8, slug: "ruth", aliases: ["ruth", "ru"] },
  { number: 9, slug: "1-samuel", aliases: ["1 samuel", "1samuel", "1 sam", "1sam", "1 sa", "1sa"] },
  { number: 10, slug: "2-samuel", aliases: ["2 samuel", "2samuel", "2 sam", "2sam", "2 sa", "2sa"] },
  { number: 11, slug: "1-kings", aliases: ["1 kings", "1kings", "1 ki", "1ki", "1 kgs"] },
  { number: 12, slug: "2-kings", aliases: ["2 kings", "2kings", "2 ki", "2ki", "2 kgs"] },
  { number: 13, slug: "1-chronicles", aliases: ["1 chronicles", "1chronicles", "1 chron", "1 chr", "1ch"] },
  { number: 14, slug: "2-chronicles", aliases: ["2 chronicles", "2chronicles", "2 chron", "2 chr", "2ch"] },
  { number: 15, slug: "ezra", aliases: ["ezra", "ezr"] },
  { number: 16, slug: "nehemiah", aliases: ["nehemiah", "neh", "ne"] },
  { number: 17, slug: "esther", aliases: ["esther", "est", "es"] },
  { number: 18, slug: "job", aliases: ["job"] },
  { number: 19, slug: "psalms", aliases: ["psalms", "psalm", "ps", "psa"] },
  { number: 20, slug: "proverbs", aliases: ["proverbs", "prov", "pr", "pro"] },
  { number: 21, slug: "ecclesiastes", aliases: ["ecclesiastes", "eccl", "ecc", "ec"] },
  { number: 22, slug: "song-of-solomon", aliases: ["song of solomon", "song of songs", "song", "sos", "ca"] },
  { number: 23, slug: "isaiah", aliases: ["isaiah", "isa", "is"] },
  { number: 24, slug: "jeremiah", aliases: ["jeremiah", "jer", "je"] },
  { number: 25, slug: "lamentations", aliases: ["lamentations", "lam", "la"] },
  { number: 26, slug: "ezekiel", aliases: ["ezekiel", "ezek", "eze"] },
  { number: 27, slug: "daniel", aliases: ["daniel", "dan", "da"] },
  { number: 28, slug: "hosea", aliases: ["hosea", "hos", "ho"] },
  { number: 29, slug: "joel", aliases: ["joel", "joe"] },
  { number: 30, slug: "amos", aliases: ["amos", "am"] },
  { number: 31, slug: "obadiah", aliases: ["obadiah", "obad", "ob"] },
  { number: 32, slug: "jonah", aliases: ["jonah", "jon"] },
  { number: 33, slug: "micah", aliases: ["micah", "mic", "mi"] },
  { number: 34, slug: "nahum", aliases: ["nahum", "nah", "na"] },
  { number: 35, slug: "habakkuk", aliases: ["habakkuk", "hab"] },
  { number: 36, slug: "zephaniah", aliases: ["zephaniah", "zeph", "zep"] },
  { number: 37, slug: "haggai", aliases: ["haggai", "hag"] },
  { number: 38, slug: "zechariah", aliases: ["zechariah", "zech", "zec"] },
  { number: 39, slug: "malachi", aliases: ["malachi", "mal"] },
  { number: 40, slug: "matthew", aliases: ["matthew", "matt", "mt"] },
  { number: 41, slug: "mark", aliases: ["mark", "mk", "mr"] },
  { number: 42, slug: "luke", aliases: ["luke", "lk", "lu"] },
  { number: 43, slug: "john", aliases: ["john", "jn", "joh"] },
  { number: 44, slug: "acts", aliases: ["acts", "ac"] },
  { number: 45, slug: "romans", aliases: ["romans", "rom", "ro"] },
  { number: 46, slug: "1-corinthians", aliases: ["1 corinthians", "1corinthians", "1 cor", "1cor", "1 co"] },
  { number: 47, slug: "2-corinthians", aliases: ["2 corinthians", "2corinthians", "2 cor", "2cor", "2 co"] },
  { number: 48, slug: "galatians", aliases: ["galatians", "gal", "ga"] },
  { number: 49, slug: "ephesians", aliases: ["ephesians", "eph"] },
  { number: 50, slug: "philippians", aliases: ["philippians", "phil", "php"] },
  { number: 51, slug: "colossians", aliases: ["colossians", "col"] },
  { number: 52, slug: "1-thessalonians", aliases: ["1 thessalonians", "1thessalonians", "1 thess", "1 th"] },
  { number: 53, slug: "2-thessalonians", aliases: ["2 thessalonians", "2thessalonians", "2 thess", "2 th"] },
  { number: 54, slug: "1-timothy", aliases: ["1 timothy", "1timothy", "1 tim", "1 ti"] },
  { number: 55, slug: "2-timothy", aliases: ["2 timothy", "2timothy", "2 tim", "2 ti"] },
  { number: 56, slug: "titus", aliases: ["titus", "tit"] },
  { number: 57, slug: "philemon", aliases: ["philemon", "phlm", "phm"] },
  { number: 58, slug: "hebrews", aliases: ["hebrews", "heb"] },
  { number: 59, slug: "james", aliases: ["james", "jas", "jam"] },
  { number: 60, slug: "1-peter", aliases: ["1 peter", "1peter", "1 pet", "1 pe"] },
  { number: 61, slug: "2-peter", aliases: ["2 peter", "2peter", "2 pet", "2 pe"] },
  { number: 62, slug: "1-john", aliases: ["1 john", "1john", "1 jn", "1 jo"] },
  { number: 63, slug: "2-john", aliases: ["2 john", "2john", "2 jn", "2 jo"] },
  { number: 64, slug: "3-john", aliases: ["3 john", "3john", "3 jn", "3 jo"] },
  { number: 65, slug: "jude", aliases: ["jude", "jud"] },
  { number: 66, slug: "revelation", aliases: ["revelation", "rev", "re"] },
];

// Build a lookup map: normalized alias -> BookMeta
const ALIAS_MAP: Map<string, BookMeta> = (() => {
  const m = new Map<string, BookMeta>();
  for (const b of BIBLE_BOOKS) {
    for (const a of b.aliases) m.set(a, b);
  }
  return m;
})();

// Normalize spoken variants into canonical alias form.
// Handles: "Revelations" -> "revelation", "First/1st John" -> "1 john",
// "Second Corinthians" -> "2 corinthians", "Third John" -> "3 john".
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
  display: string; // canonical "Book Chapter:Verse[-EndVerse]"
  chapter: number;
  verse: number;
  endVerse?: number;
}

export function parseReference(raw: string): ParsedRef | null {
  // Match written ("John 3:16", "Romans 8:38-39") AND spoken
  // ("John 3 16", "Romans 8 38 39", "Revelation 21 3") formats.
  const m = raw.match(
    /^\s*((?:(?:[1-3]|first|second|third|1st|2nd|3rd)\s+)?[A-Za-z]+(?:\s+(?:of\s+)?[A-Za-z]+)?)\s+(\d+)(?::\s*(\d+)(?:\s*[-–]\s*(\d+))?|\s+(\d+)(?:\s*[-–\s]\s*(\d+))?)\s*$/i,
  );
  if (!m) return null;
  const book = findBook(m[1]);
  if (!book) return null;
  const chapter = parseInt(m[2], 10);
  const verse = parseInt(m[3] ?? m[5], 10);
  const endRaw = m[4] ?? m[6];
  const endVerse = endRaw ? parseInt(endRaw, 10) : undefined;
  const fullName = book.aliases[0]
    .split(" ")
    .map((w) => (w.match(/^\d/) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  const display = `${fullName} ${chapter}:${verse}${endVerse ? `-${endVerse}` : ""}`;
  return { book, display, chapter, verse, endVerse };
}

// JW.org anchor: #v[bookNum][chapter zero-padded to 3][verse zero-padded to 3]
function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function buildJwUrl(p: ParsedRef): string {
  return `https://www.jw.org/en/library/bible/nwt/books/${p.book.slug}/${p.chapter}/#v${p.book.number}${pad3(p.chapter)}${pad3(p.verse)}`;
}

// Book-name alternation, including spoken ordinal prefixes and "Revelations".
const BOOK_ALT =
  "(?:(?:[1-3]|First|Second|Third|1st|2nd|3rd)\\s+)?" +
  "(?:Genesis|Gen|Exodus|Exod?|Leviticus|Lev|Numbers|Num|Deuteronomy|Deut|Joshua|Josh|Judges|Judg|Ruth|Samuel|Sam|Kings|Kgs|Chronicles|Chron|Chr|Ezra|Nehemiah|Neh|Esther|Est|Job|Psalms?|Ps|Proverbs|Prov|Pr|Ecclesiastes|Eccl|Ecc|Song(?:\\sof\\s(?:Solomon|Songs))?|Isaiah|Isa|Jeremiah|Jer|Lamentations|Lam|Ezekiel|Ezek|Daniel|Dan|Hosea|Hos|Joel|Amos|Obadiah|Obad|Jonah|Jon|Micah|Mic|Nahum|Nah|Habakkuk|Hab|Zephaniah|Zeph|Haggai|Hag|Zechariah|Zech|Malachi|Mal|Matthew|Matt|Mt|Mark|Mk|Luke|Lk|John|Jn|Acts|Romans|Rom|Corinthians|Cor|Galatians|Gal|Ephesians|Eph|Philippians|Phil|Php|Colossians|Col|Thessalonians|Thess|Timothy|Tim|Titus|Tit|Philemon|Phlm|Hebrews|Heb|James|Jas|Peter|Pet|Jude|Revelations?|Rev)";

// Match written "Book C:V[-E]" OR spoken "Book C V [E]" (spaces between numbers).
const REF_REGEX = new RegExp(
  `\\b(${BOOK_ALT}\\.?\\s+\\d+(?::\\s*\\d+(?:\\s*[-–]\\s*\\d+)?|\\s+\\d+(?:\\s*[-–\\s]\\s*\\d+)?))\\b`,
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
