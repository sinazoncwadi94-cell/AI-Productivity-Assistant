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
import { summariseMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Assistant — WorkMate AI" },
      {
        name: "description",
        content: "Turn raw meeting notes into a short summary, recorded decisions and clear action items.",
      },
      { property: "og:title", content: "Meeting Notes Assistant — WorkMate AI" },
      {
        property: "og:description",
        content: "Summarise meeting notes and pull out owners, tasks and due dates.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(summariseMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await run({ data: { notes } });
      setOutput(res.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell eyebrow="03 — Notes" title="Meeting Notes">
      <OversightBanner>
        Owners and due dates come only from your notes. Anything shown in square brackets is missing —
        confirm it with the people involved before sharing this summary.
      </OversightBanner>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit}>
          <InputCard step="03 — Notes" title="Meeting Summary">
            <FieldLabel>Your raw meeting notes</FieldLabel>
            <textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={textareaClass}
              placeholder="Paste your notes, bullet points or transcript…"
            />

            <GenerateButton loading={loading} disabled={!notes.trim()}>
              Summarise & extract action items
            </GenerateButton>
          </InputCard>
        </form>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          placeholder="Your summary, decisions and action items will appear here."
        />
      </div>
    </AppShell>
  );
}
