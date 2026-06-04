// Detect speaker introductions in transcript text.
// Returns the first match or null.

export type SpeakerRole = "brother" | "sister" | "unknown";

export interface DetectedSpeaker {
  role: SpeakerRole;
  name: string;
  congregation: string | null;
}

// Capitalized 1-3 word name, allowing hyphens/apostrophes.
const NAME = "([A-Z][a-zA-Z'’\\-]+(?:\\s+[A-Z][a-zA-Z'’\\-]+){0,2})";
// Congregation: 1-4 capitalized words (optionally followed by "congregation"/"Congregation").
const CONG = "([A-Z][a-zA-Z'’\\-]+(?:\\s+[A-Z][a-zA-Z'’\\-]+){0,3})";

// Order matters — most specific first.
const PATTERNS: { re: RegExp; role: SpeakerRole }[] = [
  // "Our speaker today is Brother John Smith from Eastside [Congregation]"
  { re: new RegExp(`\\b(?:our\\s+(?:next\\s+)?speaker(?:\\s+today)?\\s+is|we['’]?ll\\s+(?:now\\s+)?hear\\s+from|i['’]?d\\s+like\\s+to\\s+introduce)\\s+(?:brother|bro\\.?)\\s+${NAME}(?:\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?)?`, "i"), role: "brother" },
  { re: new RegExp(`\\b(?:our\\s+(?:next\\s+)?speaker(?:\\s+today)?\\s+is|we['’]?ll\\s+(?:now\\s+)?hear\\s+from|i['’]?d\\s+like\\s+to\\s+introduce)\\s+(?:sister|sis\\.?)\\s+${NAME}(?:\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?)?`, "i"), role: "sister" },
  // "Brother John from Eastside will now give us a talk"
  { re: new RegExp(`\\b(?:brother|bro\\.?)\\s+${NAME}\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?\\s+(?:will|is\\s+going\\s+to)\\s+(?:now\\s+)?(?:give|deliver|share)`, "i"), role: "brother" },
  { re: new RegExp(`\\b(?:sister|sis\\.?)\\s+${NAME}\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?\\s+(?:will|is\\s+going\\s+to)\\s+(?:now\\s+)?(?:give|deliver|share)`, "i"), role: "sister" },
  // Bare "Brother John from Eastside [congregation]"
  { re: new RegExp(`\\b(?:brother|bro\\.?)\\s+${NAME}\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?`, "i"), role: "brother" },
  { re: new RegExp(`\\b(?:sister|sis\\.?)\\s+${NAME}\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?`, "i"), role: "sister" },
  // "Our next speaker is John Smith"
  { re: new RegExp(`\\bour\\s+(?:next\\s+)?speaker(?:\\s+today)?\\s+is\\s+${NAME}(?:\\s+(?:from|of)\\s+${CONG}(?:\\s+congregation)?)?`, "i"), role: "unknown" },
  // "I'd like to introduce Brother John" (no congregation)
  { re: new RegExp(`\\bi['’]?d\\s+like\\s+to\\s+introduce\\s+(?:brother|bro\\.?)\\s+${NAME}`, "i"), role: "brother" },
  { re: new RegExp(`\\bi['’]?d\\s+like\\s+to\\s+introduce\\s+(?:sister|sis\\.?)\\s+${NAME}`, "i"), role: "sister" },
];

const NOISE = new Set([
  "Congregation", "Today", "Now", "Jehovah", "God", "Christ", "Jesus", "Lord",
  "The", "And", "But", "So", "For", "Bible", "Brother", "Sister",
]);

function cleanCong(c: string | undefined): string | null {
  if (!c) return null;
  const trimmed = c.trim().replace(/\s+congregation$/i, "");
  if (!trimmed || NOISE.has(trimmed.split(/\s+/)[0])) return null;
  return trimmed;
}

function cleanName(n: string): string | null {
  const t = n.trim();
  if (!t) return null;
  const first = t.split(/\s+/)[0];
  if (NOISE.has(first)) return null;
  return t;
}

export function detectSpeaker(text: string): DetectedSpeaker | null {
  if (!text) return null;
  for (const { re, role } of PATTERNS) {
    const m = text.match(re);
    if (!m) continue;
    const name = cleanName(m[1] || "");
    if (!name) continue;
    return { role, name, congregation: cleanCong(m[2]) };
  }
  return null;
}

export function honorific(role: SpeakerRole): string {
  if (role === "brother") return "Bro.";
  if (role === "sister") return "Sis.";
  return "";
}

export function formatSpeaker(role: SpeakerRole, name: string): string {
  const h = honorific(role);
  return h ? `${h} ${name}` : name;
}
