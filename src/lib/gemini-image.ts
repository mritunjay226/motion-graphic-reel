import { GoogleGenAI } from "@google/genai";

/**
 * Generates an image using Google AI Studio Gemini API (gemini-2.5-flash-image).
 * Returns Base64 Data URL (data:image/png;base64,...) ready for ImageKit upload.
 *
 * @param prompt Visual prompt describing single subject / scene element.
 */
export async function generateGeminiImage(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_IMAGEGEN_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_IMAGEGEN_API_KEY or GEMINI_API_KEY is not defined in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Clean prompt for high-quality documentary cutout image generation
  const cleanPrompt = prompt
    .replace(/^Single subject cutout of\s*/i, "Documentary subject cutout of ")
    .concat(", studio lighting, clean background, 8k resolution, documentary style");

  try {
    console.log(`[Gemini Image Gen] Generating AI image for prompt: "${cleanPrompt.slice(0, 70)}..."`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: cleanPrompt,
      config: {
        responseModalities: ["image"],
      },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          console.log(`[Gemini Image Gen] ✅ Successfully generated image buffer (${part.inlineData.data.length} chars Base64)`);
          return dataUrl;
        }
      }
    }

    throw new Error("No inline image data in primary candidate.");
  } catch (primaryErr: any) {
    console.warn(`[Gemini Image Gen Primary Warning] ${primaryErr.message}. Attempting generalized prompt retry...`);

    // Retry with sanitized generic prompt to bypass strict entity filters
    const genericPrompt = prompt
      .replace(/Sam Altman|Elon Musk|Mark Zuckerberg|Steve Jobs|Bill Gates/gi, "tech executive")
      .concat(", professional studio paper cutout illustration, 4k, documentary asset");

    const fallbackResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: genericPrompt,
      config: {
        responseModalities: ["image"],
      },
    });

    const fbCandidates = fallbackResponse.candidates;
    if (fbCandidates && fbCandidates.length > 0) {
      const parts = fbCandidates[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw primaryErr;
  }
}
