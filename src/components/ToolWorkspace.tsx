import { useState, type ReactNode } from "react";

export function OutputPanel({
  output,
  loading,
  error,
  placeholder,
  onClear,
}: {
  output: string | null;
  loading: boolean;
  error: string | null;
  placeholder: string;
  onClear?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent opacity-20" />
      <div className="relative flex min-h-[18rem] flex-col">
        <div className="mb-5 flex items-center justify-between">
          <p className="eyebrow text-accent">AI output</p>
          <span className="flex items-center gap-1.5 text-[10px] font-bold opacity-60">
            <span className="size-1.5 rounded-full bg-accent" />
            {output ? "Needs review" : "Awaiting input"}
          </span>
        </div>

        {error ? (
          <p className="text-sm leading-relaxed text-accent">{error}</p>
        ) : loading ? (
          <p className="animate-pulse text-sm leading-relaxed opacity-70">Drafting…</p>
        ) : output ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-90">{output}</p>
        ) : (
          <p className="text-sm leading-relaxed opacity-60">{placeholder}</p>
        )}

        {output && !loading ? (
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={copy}
              className="rounded-md bg-card px-4 py-2 text-xs font-bold text-card-foreground"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            {onClear ? (
              <button
                type="button"
                onClick={() => {
                  setCopied(false);
                  onClear();
                }}
                className="rounded-md border border-primary-foreground/30 px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Clear
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto pt-6">
          <p className="eyebrow text-accent">Human oversight required</p>
          <p className="mt-1 text-[11px] leading-relaxed opacity-60">
            This is an AI draft written only from what you typed. Read it in full, replace any
            placeholder in brackets, and correct anything inaccurate before you use or send it.
          </p>
        </div>
      </div>
    </div>
  );
}

export function InputCard({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card-surface p-6">
      <div className="mb-5">
        <p className="eyebrow text-accent">{step}</p>
        <h2 className="font-display text-xl font-extrabold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  );
}

export function OptionPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            option === value
              ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
              : "rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-input"
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function GenerateButton({
  loading,
  disabled,
  children,
}: {
  loading: boolean;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="mt-5 w-full rounded-md bg-accent py-3 text-sm font-bold tracking-wide text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
    >
      {loading ? "Working…" : children}
    </button>
  );
}

export const textareaClass =
  "w-full resize-none rounded-md border border-border bg-muted p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring";
