/**
 * Central Cartesia Sonic-3 Voiceover Engine.
 *
 * Provides in-memory cached TTS generation with text sanitization
 * for both Next.js API routes and Inngest durable step functions.
 */

// In-memory cache for generated TTS audio to make seeking instant and avoid duplicate generation
const audioCache = new Map<string, ArrayBuffer>();

export interface GenerateAudioOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  language?: string;
}

export async function getOrGenerateAudio(
  text: string,
  voiceId: string = "62ae83ad-4f6a-430b-af41-a9bede9286ca",
  modelId: string = "sonic-3",
  language: string = "en"
): Promise<ArrayBuffer> {
  const sanitizedText = text
    .replace(/\s*\.{3,}/g, ".")
    .replace(/;/g, ",")
    .replace(/—/g, ",")
    .replace(/,{2,}/g, ",")
    .replace(/\s+/g, " ")
    .trim();

  const cacheKey = `${voiceId}_${modelId}_${language}_${sanitizedText}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey) {
    throw new Error("CARTESIA_API_KEY is not configured in environment variables.");
  }

  const payload: any = {
    model_id: modelId,
    transcript: sanitizedText,
    voice: {
      mode: "id",
      id: voiceId,
    },
    output_format: {
      container: "mp3",
      bit_rate: 128000,
      sample_rate: 44100,
    },
  };

  if (language && language !== "en") {
    payload.language = language;
  }

  const response = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Cartesia-Version": "2026-03-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cartesia API error (${response.status}): ${errorText}`);
  }

  const buffer = await response.arrayBuffer();
  audioCache.set(cacheKey, buffer);
  return buffer;
}
