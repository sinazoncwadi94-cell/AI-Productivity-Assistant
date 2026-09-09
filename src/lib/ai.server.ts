const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export async function callAI(system: string, user: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this workspace.");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "google/gemini-3.8-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    let message = body;
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? body;
    } catch {
      /* keep raw body */
    }
    if (res.status === 429) {
      throw new Error("Too many requests right now. Please wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new Error(message || "AI credits are exhausted for this workspace.");
    }
    throw new Error(message || `AI request failed (${res.status}).`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

export const NO_INVENTION_RULE =
  "Use ONLY the information the user provided. Never invent names, dates, numbers, facts, deadlines, or commitments that are not in the input. If something essential is missing, leave a clearly marked placeholder in square brackets such as [name] or [date] instead of guessing. Return plain text only, no markdown code fences.";
