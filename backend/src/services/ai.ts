const MODEL = "llama-3.1-8b-instant";

export async function getAiInsight(
  assets: string[],
  investorType: string | null,
): Promise<string> {
  const key = process.env.GROQ_API_KEY;

  const prompt =
    `Give a short, friendly daily insight (2-3 sentences) for a crypto investor. ` +
    `Investor type: ${investorType ?? "general"}. ` +
    `Interested assets: ${assets.join(", ") || "crypto in general"}. ` +
    `Keep it calm and encouraging. This is not financial advice.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("AI returned an empty response");
  }
  return text;
}

export function fallbackInsight(investorType: string | null): string {
  switch (investorType) {
    case "HODLer":
      return "Markets move in cycles, and patience tends to reward long-term holders. Keep your conviction, but never invest more than you can afford to lose.";
    case "Day Trader":
      return "Volatility is the day trader's playground, but discipline beats adrenaline. Define your stop-losses and stick to your plan.";
    case "NFT Collector":
      return "Collect what you genuinely value, not just what's trending. Strong communities and creators often outlast the hype cycles.";
    default:
      return "Stay curious and diversified. The best investors keep learning and avoid emotional decisions during big market swings.";
  }
}
