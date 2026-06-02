import { Link, useRouterState } from "@tanstack/react-router";
import { Mic, FileText, Calendar, Radio, Settings } from "lucide-react";

const tabs = [
  { to: "/", label: "Record", icon: Mic },
  { to: "/transcripts", label: "Transcripts", icon: FileText },
  { to: "/program", label: "Program", icon: Calendar },
  { to: "/updates", label: "Updates", icon: Radio },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur safe-bottom">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pt-1.5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "stroke-[2.2]" : ""}`} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
