import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="flex min-h-16 w-full items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 md:px-6">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
