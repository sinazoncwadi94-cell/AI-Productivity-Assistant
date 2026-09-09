import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, OversightBanner } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI — AI assistant for everyday work tasks" },
      {
        name: "description",
        content:
          "WorkMate AI drafts professional messages, prioritises your tasks, summarises meeting notes and writes daily work summaries — always for your review.",
      },
      { property: "og:title", content: "WorkMate AI — AI assistant for everyday work tasks" },
      {
        property: "og:description",
        content:
          "Four AI work tools in one dashboard: message assistant, task planner, meeting notes and daily summary.",
      },
    ],
  }),
  component: Overview,
});

const TOOLS = [
  {
    to: "/email",
    step: "01 — Assistant",
    title: "Email & Message Toner",
    body: "Paste a rough note, pick a tone, and get a clear, professional version to review and send.",
  },
  {
    to: "/planner",
    step: "02 — Planner",
    title: "Task Planner",
    body: "Drop in your task list and get a prioritised plan for the day with a suggested order.",
  },
  {
    to: "/notes",
    step: "03 — Notes",
    title: "Meeting Notes Assistant",
    body: "Turn messy meeting notes into a summary, recorded decisions and clear action items.",
  },
  {
    to: "/summary",
    step: "04 — Summary",
    title: "Daily Work Summary",
    body: "Write up what you did today as a tidy summary for yourself, your manager or standup.",
  },
] as const;

function Overview() {
  return (
    <AppShell eyebrow="Your workspace" title="WorkMate AI">
      <OversightBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link key={tool.to} to={tool.to} className="card-surface block p-6 transition-shadow hover:shadow-lg">
            <p className="eyebrow text-accent">{tool.step}</p>
            <h2 className="mb-3 font-display text-xl font-extrabold">{tool.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
            <p className="mt-5 text-xs font-bold text-accent">Open tool</p>
          </Link>
        ))}
      </div>

      <div className="card-surface p-6">
        <p className="eyebrow text-accent">How it works</p>
        <h2 className="mb-3 font-display text-xl font-extrabold">You provide the facts</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every tool works only from what you type in. WorkMate AI does not have access to your inbox,
          calendar or files, and it will never fill in names, dates or numbers you have not given it —
          missing details appear as placeholders in square brackets for you to complete.
        </p>
      </div>
    </AppShell>
  );
}
