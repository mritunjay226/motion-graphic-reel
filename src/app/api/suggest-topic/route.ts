import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { language = "en" } = await req.json();

    const geminiApiKey = process.env.GEMINI_API_KEY || "";
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || "";

    const isHindi = language.toLowerCase() === "hi";

    const prompt = isHindi
      ? `Generate 1 unique, captivating, viral documentary reel topic in Hindi (or Hinglish) in the style of Vox, MagnatesMedia, or Dhruv Rathee.
Topics can be about business rivalries, secret tech decisions, historical mysteries, psychological paradoxes, or corporate scandals.
Rules:
- Output ONLY the single topic title as plain text. No quotes, no markdown, no explanation.
- Example: कैसे Nvidia $3 Trillion की कंपनी बनी
- Example: 50M डॉलर की वो एक गलती जिसने Blockbuster को डुबो दिया`
      : `Generate 1 unique, captivating, viral documentary reel topic in English in the style of Vox, MagnatesMedia, or Johnny Harris.
Topics can be about business rivalries, secret tech engineering, historical paradoxes, dark corporate scandals, or psychological quirks.
Rules:
- Output ONLY the single topic title as plain text. No quotes, no markdown, no explanation.
- Example: How Rolex Created Artificial Scarcity
- Example: The $100 Billion Scam of Theranos & Elizabeth Holmes
- Example: Why Airplane Windows Are Round And Not Square`;

    // 1. Native Gemini 2.5 Flash
    if (geminiApiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.95,
            maxOutputTokens: 60,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        const cleanTopic = rawText.replace(/^["'`]+|["'`]+$/g, "").trim();
        if (cleanTopic) {
          return NextResponse.json({ success: true, topic: cleanTopic });
        }
      }
    }

    // 2. OpenRouter fallback
    if (openRouterApiKey) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.95,
          max_tokens: 60,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.choices?.[0]?.message?.content?.trim() || "";
        const cleanTopic = rawText.replace(/^["'`]+|["'`]+$/g, "").trim();
        if (cleanTopic) {
          return NextResponse.json({ success: true, topic: cleanTopic });
        }
      }
    }

    return NextResponse.json({
      success: false,
      error: "No AI provider available",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
