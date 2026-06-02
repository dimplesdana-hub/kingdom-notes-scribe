import type { ReactNode } from "react";

interface Props {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export function PageShell({ title, right, children, contentClassName = "" }: Props) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-24">
      {title && (
        <header className="safe-top sticky top-0 z-30 flex items-center justify-between border-b border-card-hairline bg-header-gradient px-4 pb-4 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {right}
        </header>
      )}
      <main className={`flex-1 px-4 pt-4 ${contentClassName}`}>{children}</main>
    </div>
  );
}
