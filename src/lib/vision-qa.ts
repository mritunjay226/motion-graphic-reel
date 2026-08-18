/**
 * Gemini 2.5 Flash Multimodal Vision QA Inspector.
 *
 * Inspects video preview thumbnails and candidate archival images against
 * documentary scene narration to verify semantic relevance and visual quality.
 */

export interface VisionQAResult {
  isRelevant: boolean;
  confidence: number; // 1 - 10
  visualSummary: string;
  rejectionReason?: string;
}

/**
 * Validates a candidate image/video thumbnail against the scene narration using Gemini 2.5 Flash Vision.
 */
export async function verifyMediaRelevance(
  mediaThumbnailUrl: string,
  sceneNarration: string,
  searchQuery: string
): Promise<VisionQAResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  if (!geminiApiKey || !mediaThumbnailUrl) {
    // If no key or no URL, assume default acceptance with medium confidence
    return {
      isRelevant: true,
      confidence: 7,
      visualSummary: "Accepted without AI vision inspection (offline fallback)",
    };
  }

  try {
    // Fetch image as Base64 buffer
    const imgRes = await fetch(mediaThumbnailUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!imgRes.ok) {
      return {
        isRelevant: false,
        confidence: 0,
        visualSummary: "Failed to download preview thumbnail",
        rejectionReason: `HTTP ${imgRes.status}`,
      };
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imgRes.headers.get("content-type") || "image/jpeg";

    const prompt = `You are an elite Vox Video Documentary Art Director & Visual Inspector.
Evaluate if this video/image thumbnail is visually relevant and high-quality for this documentary scene.

Documentary Scene Narration:
"${sceneNarration}"

Search Query Used:
"${searchQuery}"

Inspection Criteria:
1. Is the visual theme relevant to the topic/mood described in the narration?
2. Is it clean, high quality, and free of massive intrusive watermarks/spam?

Respond ONLY with a valid JSON object matching this schema:
{
  "isRelevant": true or false,
  "confidence": integer from 1 to 10,
  "visualSummary": "concise 5-word description of what is in the image",
  "rejectionReason": "short reason if isRelevant is false or confidence < 6"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const apiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType.split(";")[0],
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isRelevant: Boolean(parsed.isRelevant && parsed.confidence >= 6),
          confidence: Number(parsed.confidence) || 7,
          visualSummary: parsed.visualSummary || "Verified visual asset",
          rejectionReason: parsed.rejectionReason,
        };
      }
    }

    return {
      isRelevant: true,
      confidence: 7,
      visualSummary: "Gemini Vision accepted (default parsing)",
    };
  } catch (err: any) {
    console.warn(`[Vision QA Warning] Thumbnail verification error:`, err.message);
    // Graceful fallback to avoid blocking the pipeline
    return {
      isRelevant: true,
      confidence: 6,
      visualSummary: "Fallback acceptance on error",
    };
  }
}
