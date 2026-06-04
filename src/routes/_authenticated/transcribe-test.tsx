import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useLiveTranscription } from "@/lib/useLiveTranscription";

export const Route = createFileRoute("/_authenticated/transcribe-test")({
  head: () => ({
    meta: [
      { title: "Transcribe Test — Kingdom Notes" },
      { name: "description", content: "Test the live speech-to-text engine and microphone setup before your next recording session." },
    ],
  }),
  component: TranscribeTestPage,
});

function statusColor(status: string) {
  switch (status) {
    case "live":
      return "bg-green-500";
    case "connecting":
      return "bg-yellow-500 animate-pulse";
    case "error":
      return "bg-red-500";
    default:
      return "bg-muted-foreground/40";
  }
}

function TranscribeTestPage() {
  const { status, error, partial, finals, start, stop, reset } = useLiveTranscription();

  // Auto-stop after 30s to keep it "short"
  useEffect(() => {
    if (status !== "live") return;
    const t = setTimeout(() => stop(), 30_000);
    return () => clearTimeout(t);
  }, [status, stop]);

  const isActive = status === "live" || status === "connecting";

  return (
    <PageShell title="Live Transcription Test">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-card-hairline bg-card p-3">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor(status)}`} />
          <span className="text-sm font-medium capitalize text-foreground">{status}</span>
          {status === "live" && (
            <span className="ml-auto text-xs text-muted-foreground">auto-stops in 30s</span>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={start} className="flex-1">
              Start test
            </Button>
          ) : (
            <Button onClick={stop} variant="destructive" className="flex-1">
              Stop
            </Button>
          )}
          <Button
            onClick={() => {
              stop();
              reset();
            }}
            variant="outline"
            disabled={isActive}
          >
            Clear
          </Button>
        </div>

        <div className="min-h-[12rem] rounded-lg border border-card-hairline bg-card p-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
            Transcript
          </div>
          {finals.length === 0 && !partial ? (
            <p className="text-sm text-muted-foreground">
              {isActive ? "Listening… speak into your microphone." : "Press Start and grant mic access."}
            </p>
          ) : (
            <div className="space-y-2 text-sm text-foreground">
              {finals.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {partial && <p className="text-muted-foreground italic">{partial}</p>}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
