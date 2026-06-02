import { useState } from "react";
import { FileText, Sparkles, Mic, Package } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Transcript } from "@/lib/sample-data";

interface Props {
  transcript: Transcript;
  trigger: React.ReactNode;
}

function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function transcriptText(t: Transcript) {
  return [
    `${t.title}`,
    `${t.speaker}${t.congregation ? " · " + t.congregation : ""}`,
    `${t.date} · ${t.duration}`,
    "",
    ...t.body.map((p) => `[${p.time}] ${p.speaker}\n${p.text}\n`),
  ].join("\n");
}

function summaryText(t: Transcript) {
  return [`Summary — ${t.title}`, "", ...t.summary.map((s) => `• ${s}`)].join("\n");
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export function ShareSheet({ transcript, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const base = slug(transcript.title);

  const options = [
    {
      icon: FileText,
      title: "Export Transcript",
      desc: "Save the full transcript as a text file",
      onClick: () => download(`${base}-transcript.txt`, transcriptText(transcript)),
    },
    {
      icon: Sparkles,
      title: "Export Summary",
      desc: "Save just the summary bullets",
      onClick: () => download(`${base}-summary.txt`, summaryText(transcript)),
    },
    {
      icon: Mic,
      title: "Export Audio",
      desc: "Share the original audio recording",
      onClick: async () => {
        if (typeof navigator !== "undefined" && (navigator as any).share) {
          try {
            await (navigator as any).share({
              title: transcript.title,
              text: `Audio for ${transcript.title}`,
            });
            return;
          } catch {
            /* user cancelled */
          }
        }
        alert("Audio file not attached to this sample transcript.");
      },
    },
    {
      icon: Package,
      title: "Export Everything",
      desc: "Transcript, summary, and audio bundled together",
      onClick: () => {
        const combined =
          transcriptText(transcript) + "\n\n---\n\n" + summaryText(transcript);
        download(`${base}-bundle.txt`, combined);
      },
    },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="border-border bg-background">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-foreground">Share or export</DrawerTitle>
          <DrawerDescription className="line-clamp-1">{transcript.title}</DrawerDescription>
        </DrawerHeader>
        <ul className="space-y-2 px-4 pb-6">
          {options.map((o) => {
            const Icon = o.icon;
            return (
              <li key={o.title}>
                <button
                  type="button"
                  onClick={() => {
                    o.onClick();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{o.title}</span>
                    <span className="block text-xs text-muted-foreground">{o.desc}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
