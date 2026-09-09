import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell, OversightBanner } from "@/components/AppShell";
import {
  FieldLabel,
  GenerateButton,
  InputCard,
  OptionPills,
  OutputPanel,
  textareaClass,
} from "@/components/ToolWorkspace";
import { dailySummary } from "@/lib/ai.functions";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Daily Work Summary — WorkMate AI" },
      {
        name: "description",
        content:
          "Write up your day as a clear summary of what you finished, what carried over and what is blocked.",
      },
      { property: "og:title", content: "Daily Work Summary — WorkMate AI" },
      {
        property: "og:description",
        content: "Turn scattered notes about your day into a tidy work summary.",
      },
    ],
  }),
  component: SummaryPage,
});

const AUDIENCES = ["Personal record", "Manager update", "Team standup"] as const;

function SummaryPage() {
  const run = useServerFn(dailySummary);
  const [work, setWork] = useState("");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("Personal record");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await run({ data: { work, audience } });
      setOutput(res.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell eyebrow="04 — Summary" title="Daily Summary">
      <OversightBanner>
        This summary reflects only what you wrote below. Check it for accuracy — especially anything about
        progress, blockers or other people — before you share it.
      </OversightBanner>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit}>
          <InputCard step="04 — Summary" title="Daily Work Summary">
            <FieldLabel>What did you work on today?</FieldLabel>
            <textarea
              rows={10}
              value={work}
              onChange={(e) => setWork(e.target.value)}
              className={textareaClass}
              placeholder="Jot down what you finished, what is still open and anything blocking you…"
            />

            <div className="mt-4">
              <FieldLabel>Write it for</FieldLabel>
              <OptionPills options={AUDIENCES} value={audience} onChange={setAudience} />
            </div>

            <GenerateButton loading={loading} disabled={!work.trim()}>
              Write my daily summary
            </GenerateButton>
          </InputCard>
        </form>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          placeholder="Your end-of-day summary will appear here."
        />
      </div>
    </AppShell>
  );
}
