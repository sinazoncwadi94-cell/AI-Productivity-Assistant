import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAI, NO_INVENTION_RULE } from "./ai.server";

const EmailInput = z.object({
  text: z.string().min(1).max(6000),
  tone: z.enum(["Professional", "Friendly", "Formal", "Concise"]),
  channel: z.enum(["Email", "Chat message"]),
});

export const rewriteMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You rewrite rough workplace notes into clear ${data.channel.toLowerCase()}s. Tone: ${data.tone}. ${
      data.channel === "Email"
        ? 'Start with a line "Subject: ..." then a blank line, then the message body.'
        : "Return only the message text, no subject line."
    } Keep it about the same length or shorter. ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.text) };
  });

const PlannerInput = z.object({
  tasks: z.string().min(1).max(6000),
  hours: z.string().max(40).optional(),
});

export const planDay = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a task prioritisation assistant. Take the user's task list and return a prioritised daily plan as plain text.
Format: a numbered list. Each line: "N. Task — Priority: High/Medium/Low — Why: short reason". After the list, add a short section "Suggested order for the day" with 2-4 sentences.${
      data.hours ? ` The user has about ${data.hours} of working time available.` : ""
    } ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.tasks) };
  });

const NotesInput = z.object({
  notes: z.string().min(1).max(12000),
});

export const summariseMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You summarise meeting notes. Return plain text in exactly three sections:
"Summary" — 3-5 short bullet lines starting with "- ".
"Decisions" — bullet lines, or "- None recorded" if none are in the notes.
"Action items" — bullet lines in the form "- Owner — task — due date". Use [owner] or [due date] where the notes do not say. ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.notes) };
  });

const SummaryInput = z.object({
  work: z.string().min(1).max(12000),
  audience: z.enum(["Personal record", "Manager update", "Team standup"]),
});

export const dailySummary = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You write an end-of-day work summary for this audience: ${data.audience}. Return plain text in three sections:
"Completed today" — bullet lines starting with "- ".
"In progress / carried over" — bullet lines, or "- None" if none.
"Blockers & next steps" — bullet lines, or "- None" if none.
Keep it factual and brief. ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.work) };
  });
