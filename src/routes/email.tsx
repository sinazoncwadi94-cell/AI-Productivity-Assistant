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
import { rewriteMessage } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email & Message Assistant — WorkMate AI" },
      {
        name: "description",
        content:
          "Turn a rough note into a clear, professional email or chat message, in the tone you choose.",
      },
      { property: "og:title", content: "Email & Message Assistant — WorkMate AI" },
      {
        property: "og:description",
        content: "Rewrite rough workplace notes into professional messages you review before sending.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Formal", "Concise"] as const;
const CHANNELS = ["Email", "Chat message"] as const;

function EmailPage() {
  const run = useServerFn(rewriteMessage);
  const [text, setText] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("Email");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await run({ data: { text, tone, channel } });
      setOutput(res.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell eyebrow="01 — Assistant" title="Email & Messages">
      <OversightBanner>
        This draft is written only from the note you provide. Read it end to end, correct anything wrong,
        and add any missing details before you send it.
      </OversightBanner>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit}>
          <InputCard step="01 — Assistant" title="Email & Message Toner">
            <FieldLabel>Your rough note</FieldLabel>
            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={textareaClass}
              placeholder="Type your note exactly as it comes to mind…"
            />

            <div className="mt-4">
              <FieldLabel>Format</FieldLabel>
              <OptionPills options={CHANNELS} value={channel} onChange={setChannel} />
            </div>

            <div className="mt-4">
              <FieldLabel>Tone</FieldLabel>
              <OptionPills options={TONES} value={tone} onChange={setTone} />
            </div>

            <GenerateButton loading={loading} disabled={!text.trim()}>
              Generate professional version
            </GenerateButton>
          </InputCard>
        </form>

        <OutputPanel
          output={output}
          loading={loading}
          error={error}
          onClear={() => {
            setOutput(null);
            setError(null);
            setText("");
          }}
          placeholder="Your rewritten message will appear here once you generate it."
        />
      </div>
    </AppShell>
  );
}
