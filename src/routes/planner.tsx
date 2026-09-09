import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell, OversightBanner } from "@/components/AppShell";
import {
  FieldLabel,
  GenerateButton,
  InputCard,
  OutputPanel,
  textareaClass,
} from "@/components/ToolWorkspace";
import { planDay } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkMate AI" },
      {
        name: "description",
        content: "Paste your task list and get a prioritised daily plan with a suggested order of work.",
      },
      { property: "og:title", content: "AI Task Planner — WorkMate AI" },
      {
        property: "og:description",
        content: "Prioritise your tasks and build a realistic plan for the day.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planDay);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await run({ data: { tasks, hours: hours.trim() || undefined } });
      setOutput(res.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell eyebrow="02 — Planner" title="Task Planner">
      <OversightBanner>
        Priorities are suggestions based only on the tasks you listed. You know the real deadlines and
        politics — adjust the plan before you commit to it.
      </OversightBanner>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit}>
          <InputCard step="02 — Planner" title="Today's Prioritised Plan">
            <FieldLabel>Your tasks (one per line)</FieldLabel>
            <textarea
              rows={9}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              className={textareaClass}
              placeholder="List everything on your plate, with deadlines if you know them…"
            />

            <div className="mt-4">
              <FieldLabel>Time available today (optional)</FieldLabel>
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full rounded-md border border-border bg-muted p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. 5 hours"
              />
            </div>

            <GenerateButton loading={loading} disabled={!tasks.trim()}>
              Build my daily plan
            </GenerateButton>
          </InputCard>
        </form>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          placeholder="Your prioritised plan will appear here once you generate it."
        />
      </div>
    </AppShell>
  );
}
