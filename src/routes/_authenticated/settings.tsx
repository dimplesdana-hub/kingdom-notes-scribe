import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun, Upload, Download, Cloud, Info, ChevronRight, BookOpen } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Kingdom Notes" },
      { name: "description", content: "Manage your profile, transcription preferences, connected services, and app appearance settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [name, setName] = useState("");
  const [cong, setCong] = useState("");
  const [autoScripture, setAutoScripture] = useState(true);
  const [autoSpeaker, setAutoSpeaker] = useState(true);
  const [saveAudio, setSaveAudio] = useState(true);
  const [textSize, setTextSize] = useState(16);
  const [backup, setBackup] = useState(false);

  return (
    <PageShell title="Settings">
      <Section title="My Profile">
        <TextField label="Name" value={name} onChange={setName} placeholder="Your name" />
        <TextField label="Congregation" value={cong} onChange={setCong} placeholder="e.g., Eastside Congregation" />
        <SelectField label="Preferred language" options={["English", "Spanish", "French", "Portuguese", "German"]} />
      </Section>

      <Section title="Connected Services">
        <RowItem
          icon={<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">NW</div>}
          title="NW Publisher"
          status="Not connected"
          statusColor="bg-muted-foreground"
          action="Connect"
        />
        <RowItem
          icon={<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/30 text-gold-foreground dark:text-gold"><BookOpen className="h-5 w-5" /></div>}
          title="JW Library"
          status="Installed"
          statusColor="bg-emerald-500"
          action="Open App"
        />
      </Section>

      <Section title="Recording Preferences">
        <SelectField label="Default session type" options={["Meeting", "Assembly", "Convention", "Personal Study", "Field Service"]} />
        <Toggle label="Auto-detect scriptures" value={autoScripture} onChange={setAutoScripture} />
        <Toggle label="Auto-detect speaker names" value={autoSpeaker} onChange={setAutoSpeaker} />
        <Toggle label="Save audio with transcript" value={saveAudio} onChange={setSaveAudio} />
        <SelectField label="Transcription mode" options={["Live (when connected)", "Record then transcribe", "Always record then transcribe"]} />
        <SelectField label="Audio quality" options={["Standard", "High"]} />
      </Section>

      <Section title="Import & Export">
        <ActionRow icon={Upload} label="Import from Otter.ai" />
        <ActionRow icon={Download} label="Export all transcripts" />
        <Toggle label="Backup to iCloud/Google Drive" value={backup} onChange={setBackup} icon={Cloud} />
      </Section>

      <Section title="Appearance">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
            <span className="text-sm text-foreground">Dark mode</span>
          </div>
          <button
            onClick={toggle}
            role="switch"
            aria-checked={theme === "dark"}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`block h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200 ${theme === "dark" ? "translate-x-[22px]" : "translate-x-0.5"}`} />
          </button>
        </div>
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-foreground">Text size</span>
            <span className="text-xs text-muted-foreground">{textSize}pt</span>
          </div>
          <input
            type="range" min={12} max={24} value={textSize}
            onChange={(e) => setTextSize(Number(e.target.value))}
            className="w-full accent-[color:var(--primary)]"
          />
        </div>
      </Section>

      <Section title="About">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-foreground"><Info className="h-4 w-4 text-muted-foreground" /> Version 1.0.0</div>
          <div className="mt-1.5 flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <a
              href={`https://github.com/dimplesdana-hub/kingdom-notes-scribe/commit/${__GIT_COMMIT_SHA__}`}
              target="_blank"
              rel="noopener noreferrer"
              className="select-all text-primary underline-offset-2 hover:underline"
              title="View commit on GitHub"
            >
              {__GIT_COMMIT_SHA__.slice(0, 7)}
            </a>
            <span className="text-[10px] opacity-60">({__BUILD_TIME__})</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground italic">"Kingdom Notes — Built to Enhance Review & Study"</p>
          <div className="mt-3 flex gap-4 text-xs text-primary">
            <a href="#">Privacy Policy</a>
            <span className="text-muted-foreground">|</span>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-2">
      <h2 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-card-hairline bg-card shadow-card divide-y divide-card-hairline">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block px-4 py-3">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
    </label>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block px-4 py-3">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, value, onChange, icon: Icon }: { label: string; value: boolean; onChange: (v: boolean) => void; icon?: any }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`block h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200 ${value ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function RowItem({ icon, title, status, statusColor, action }: any) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${statusColor}`} />
          {status}
        </div>
      </div>
      <button className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary">{action}</button>
    </div>
  );
}

function ActionRow({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-3 text-left">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
