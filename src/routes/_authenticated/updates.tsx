import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Play, BookOpen, Newspaper, Users } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { updates } from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/updates")({
  head: () => ({ meta: [{ title: "Updates — Kingdom Notes" }] }),
  component: UpdatesPage,
});

function UpdatesPage() {
  return (
    <PageShell title="JW Updates">
      <div className="space-y-4">
        <article className="overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary to-primary/70">
            <Play className="h-12 w-12 fill-white text-white" />
            <span className="absolute bottom-2 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">Broadcast</span>
          </div>
          <div className="p-4">
            <div className="text-xs text-muted-foreground">Monthly Broadcast · Updated {updates.broadcast.updated}</div>
            <h2 className="mt-1 text-base font-semibold text-foreground">{updates.broadcast.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{updates.broadcast.description}</p>
            <a href="https://www.jw.org" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <ExternalLink className="h-4 w-4" /> Watch on JW.org
            </a>
          </div>
        </article>

        <PubCard icon={BookOpen} kind="Latest Watchtower" title={updates.watchtower.title} date={updates.watchtower.date} updated={updates.watchtower.updated} />
        <PubCard icon={Newspaper} kind="Latest Awake!" title={updates.awake.title} date={updates.awake.date} updated={updates.awake.updated} />

        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Users className="h-4 w-4" /> Congregation Announcements
          </div>
          <p className="text-sm text-muted-foreground">Connect NW Publisher to see announcements from your congregation.</p>
          <button className="mt-3 inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary">
            Connect NW Publisher
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function PubCard({ icon: Icon, kind, title, date, updated }: { icon: any; kind: string; title: string; date: string; updated: string }) {
  return (
    <article className="flex gap-4 rounded-2xl bg-card p-4 shadow-card">
      <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold/60 text-gold-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-primary">{kind}</div>
        <h3 className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{title}</h3>
        <div className="mt-0.5 text-xs text-muted-foreground">{date} · Updated {updated}</div>
        <a href="https://www.jw.org" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Read on JW.org <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
