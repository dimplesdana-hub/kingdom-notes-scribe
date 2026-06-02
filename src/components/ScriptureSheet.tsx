import { useEffect } from "react";
import { BookOpen, Copy, ExternalLink, X } from "lucide-react";

const SAMPLE: Record<string, string> = {
  "Romans 8:38": "For I am convinced that neither death nor life, nor angels nor governments, nor things now here nor things to come, nor powers,",
  "Psalm 46:1": "God is for us a refuge and strength, a help that is readily found in times of distress.",
  "Isaiah 41:10": "Do not be afraid, for I am with you. Do not be anxious, for I am your God. I will fortify you, yes, I will help you.",
  "John 17:3": "This means everlasting life, their coming to know you, the only true God, and the one whom you sent, Jesus Christ.",
  "John 3:16": "For God loved the world so much that he gave his only-begotten Son, so that everyone exercising faith in him might not be destroyed but have everlasting life.",
  "Matthew 5:9": "Happy are the peacemakers, since they will be called sons of God.",
  "Daniel 2:44": "In the days of those kings the God of heaven will set up a kingdom that will never be destroyed.",
};

export function ScriptureSheet({ reference, onClose }: { reference: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const text = SAMPLE[reference] ?? "Tap 'Open in JW Library' to view this scripture in full.";
  const encoded = encodeURIComponent(reference);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-label="Close" />
      <div className="animate-slide-up relative mx-auto w-full max-w-md rounded-t-3xl bg-card p-5 shadow-elevated safe-bottom" style={{ height: "70vh" }}>
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted">
          <X className="h-5 w-5" />
        </button>
        <div className="text-2xl font-bold text-primary">{reference}</div>
        <p className="mt-5 text-lg leading-relaxed text-foreground">{text}</p>
        <div className="absolute inset-x-5 bottom-6 grid gap-2 safe-bottom">
          <a
            href={`jwlibrary:///finder?bible=${encoded}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
          >
            <BookOpen className="h-5 w-5" /> Open in JW Library
          </a>
          <a
            href={`https://www.jw.org/finder?wtlocale=E&pub=nwtsty&bible=${encoded}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-semibold text-foreground"
          >
            <ExternalLink className="h-5 w-5" /> Open on JW.org
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(`${reference} — ${text}`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-semibold text-foreground"
          >
            <Copy className="h-5 w-5" /> Copy
          </button>
        </div>
      </div>
    </div>
  );
}
