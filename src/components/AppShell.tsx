import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/email", label: "Email & Messages" },
  { to: "/planner", label: "Task Planner" },
  { to: "/notes", label: "Meeting Notes" },
  { to: "/summary", label: "Daily Summary" },
] as const;

export function AppShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card p-6 md:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md bg-primary font-display text-lg font-black text-primary-foreground">
            W
          </div>
          <div>
            <p className="font-display text-base font-extrabold leading-none">WorkMate</p>
            <p className="eyebrow text-accent">AI</p>
          </div>
        </div>

        <p className="eyebrow mb-3 text-muted-foreground">Tools</p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
              activeProps={{
                className:
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold bg-accent text-accent-foreground",
              }}
            >
              <span className="size-1.5 rounded-full bg-current opacity-60" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-md border border-border bg-muted p-3">
          <p className="mb-1 text-[11px] font-bold">Human oversight</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            AI drafts are suggestions. Review before you send or file anything.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b border-border bg-muted px-6 py-6 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow text-accent">{eyebrow}</p>
              <h1 className="font-display text-3xl font-black leading-none md:text-4xl">{title}</h1>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-2 sm:flex">
              <span className="text-[11px] font-bold text-muted-foreground">4 tools ready</span>
              <span className="size-2 rounded-full bg-accent" />
            </div>
          </div>

          <nav className="-mx-1 mt-5 flex gap-1 overflow-x-auto md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground"
                activeProps={{
                  className:
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold bg-accent text-accent-foreground border border-accent",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="space-y-6 p-6 md:p-10">
          {children}
          <p className="pb-4 pt-2 text-center text-[11px] text-muted-foreground">
            WorkMate AI generates drafts only — you stay in control of every word that goes out.
          </p>
        </div>
      </main>
    </div>
  );
}

export function OversightBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 overflow-hidden rounded-lg bg-primary p-4 text-primary-foreground">
      <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-md bg-accent font-display text-lg font-black text-accent-foreground">
        !
      </span>
      <div>
        <p className="text-sm font-bold">Human oversight required</p>
        <p className="text-sm leading-relaxed opacity-70">
          {children ??
            "WorkMate AI only drafts from what you provide — it never invents facts. Always review and edit AI-generated content before sending, filing, or sharing."}
        </p>
      </div>
    </div>
  );
}
