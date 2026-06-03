import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw, Mic, Plus, Bell } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { weekendProgram, midweekProgram, conventionProgram } from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/program")({
  head: () => ({ meta: [{ title: "Program — Kingdom Notes" }] }),
  component: ProgramPage,
});

const TABS = ["This Week", "Upcoming", "Convention", "Assembly"] as const;

function ProgramPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("This Week");

  return (
    <PageShell
      title="Meeting Programs"
      right={
        <button className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Refresh">
          <RefreshCw className="h-5 w-5" />
        </button>
      }
    >
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "This Week" && (
        <div className="mt-4 space-y-4">
          <Card title="Weekend Meeting" subtitle={weekendProgram.date}>
            <Row label="Public Talk" title={weekendProgram.publicTalk.title} sub={`${weekendProgram.publicTalk.speaker} · ${weekendProgram.publicTalk.congregation}`} />
            <Row label="Watchtower Study" title={weekendProgram.watchtowerStudy.title} sub={`${weekendProgram.watchtowerStudy.paragraphs} · Conductor: ${weekendProgram.watchtowerStudy.conductor}`} />
            <div className="mt-3 text-xs text-muted-foreground">Chairman: {weekendProgram.chairman}</div>
          </Card>

          <Card title="Midweek Meeting — Christian Life & Ministry" subtitle={midweekProgram.date}>
            <ul className="divide-y divide-border">
              {midweekProgram.parts.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">{p.time}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">{p.type}</span>
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{p.title}</div>
                    {p.person && <div className="text-xs text-muted-foreground">{p.person}</div>}
                  </div>
                  <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary" aria-label="Record">
                    <Mic className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "Upcoming" && (
        <EmptyState text="No upcoming meetings scheduled yet. Pull to refresh or add one manually." />
      )}

      {tab === "Convention" && (
        <div className="mt-4 space-y-4">
          {conventionProgram.map((day) => (
            <Card key={day.day} title={`${day.day} — ${day.date}`}>
              <ul className="divide-y divide-border">
                {day.sessions.map((s, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div>
                      <div className="text-xs text-muted-foreground tabular-nums">{s.time}</div>
                      <div className="mt-0.5 text-sm font-medium text-foreground">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.type}</div>
                    </div>
                    <div className="flex gap-1">
                      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground" aria-label="Reminder">
                        <Bell className="h-4 w-4" />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary" aria-label="Record">
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === "Assembly" && (
        <EmptyState text="No assembly program loaded. Tap the + button to add one manually." />
      )}

      <button className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated" aria-label="Add program">
        <Plus className="h-6 w-6" />
      </button>
    </PageShell>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="mb-3">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-border py-3 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-primary">{label}</div>
        <div className="mt-0.5 text-sm font-medium text-foreground">{title}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </div>
      <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary" aria-label="Record">
        <Mic className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
