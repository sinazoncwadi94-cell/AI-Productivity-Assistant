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
    const system = `You rewrite rough workplace notes into clear, polished, professional ${data.channel.toLowerCase()}s suitable for a workplace. Tone: ${data.tone}. ${
      data.channel === "Email"
        ? 'Structure it exactly as: a line "Subject: ..." then a blank line, then a greeting addressed to (Manager\'s name) unless the user named the recipient, then the body in short paragraphs, then a closing line and the sign-off "(Your name)" unless the user gave their own name.'
        : "Return only the message text: no subject line, no sign-off, 1-3 short paragraphs."
    } Keep every point the user made and change nothing about the meaning, intent or commitments — only improve clarity, grammar, structure and professionalism. Keep it about the same length or shorter. ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.text) };
  });

const PlannerInput = z.object({
  tasks: z.string().min(1).max(6000),
  hours: z.string().max(40).optional(),
});

export const planDay = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a task prioritisation assistant. Take the user's task list and return a prioritised daily plan as plain text. Include every task the user listed exactly once, reordered most important first, and add no tasks of your own.
Format:
"Prioritised tasks" — a numbered list, each line: "N. Task — Priority: High/Medium/Low — Why: short reason based only on what the user wrote (deadline, dependency, effort)".
"Suggested order for the day" — 2-4 sentences describing the order of work${
      data.hours ? `, fitted to about ${data.hours} of working time` : ""
    }. If the listed work clearly exceeds the available time, say which items should move to another day.
Base priority only on deadlines, dependencies or urgency the user actually stated; where none is stated, say "Why: no deadline given". ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.tasks) };
  });

const NotesInput = z.object({
  notes: z.string().min(1).max(12000),
});

export const summariseMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You summarise meeting notes. Return plain text in exactly three sections, each with its heading on its own line:
"Summary" — 3-5 short bullet lines starting with "- " covering what was discussed.
"Decisions" — bullet lines for decisions actually recorded, or "- None recorded".
"Action items" — one bullet per task, in the form "- Owner — task — due date", or "- None recorded". Use (Owner) or (Due date) where the notes do not say. Never assign an owner or a date the notes do not contain. ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.notes) };
  });

const SummaryInput = z.object({
  work: z.string().min(1).max(12000),
  audience: z.enum(["Personal record", "Manager update", "Team standup"]),
});

export const dailySummary = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You write an end-of-day work summary for this audience: ${data.audience}. Return plain text in exactly four sections, each heading on its own line:
"Completed today" — bullet lines for work the user says is finished, or "- None recorded".
"Unfinished / in progress" — bullet lines for work started but not finished, or "- None recorded".
"Carried over to tomorrow" — bullet lines, or "- None recorded".
"Blockers & next steps" — bullet lines, or "- None recorded".
Place each item in exactly one section, based only on how the user described it; if the status is unclear, put it under "Unfinished / in progress". Keep it factual and brief. ${NO_INVENTION_RULE}`;
    return { output: await callAI(system, data.work) };
  });
