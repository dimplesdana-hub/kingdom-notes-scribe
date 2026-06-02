// Shared NWT verse lookup. Phase 2 will fetch dynamically from JW.org.
export const SCRIPTURE_TEXT: Record<string, string> = {
  "Romans 8:38":
    "For I am convinced that neither death nor life, nor angels nor governments, nor things now here nor things to come, nor powers,",
  "Psalm 46:1":
    "God is for us a refuge and strength, a help that is readily found in times of distress.",
  "Isaiah 41:10":
    "Do not be afraid, for I am with you. Do not be anxious, for I am your God. I will fortify you, yes, I will help you.",
  "John 17:3":
    "This means everlasting life, their coming to know you, the only true God, and the one whom you sent, Jesus Christ.",
  "John 3:16":
    "For God loved the world so much that he gave his only-begotten Son, so that everyone exercising faith in him might not be destroyed but have everlasting life.",
  "Matthew 5:9": "Happy are the peacemakers, since they will be called sons of God.",
  "Philippians 4:7":
    "And the peace of God, which surpasses all understanding, will guard your hearts and your mental powers by means of Christ Jesus.",
  "Romans 12:18": "If possible, as far as it depends on you, be peaceable with all men.",
  "Daniel 2:44":
    "In the days of those kings the God of heaven will set up a kingdom that will never be destroyed.",
};

export function lookupScripture(ref: string): string {
  return (
    SCRIPTURE_TEXT[ref] ??
    "Verse text will be available once connected to the JW.org library. Tap to retry."
  );
}
