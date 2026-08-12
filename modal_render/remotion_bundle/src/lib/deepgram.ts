import type { WhisperToken } from "@/remotion/types";

const deepgramApiKey = process.env.DEEPGRAM_API_KEY || "";

/**
 * Transcribes audio via Deepgram Nova-2 STT API into high-precision word timestamps
 * formatted into Whisper token chunks for 1–2 line kinetic subtitles.
 */
export async function transcribeAudioWithDeepgram(
  narrationText: string,
  audioUrlOrBuffer?: string | Buffer,
  language?: string
): Promise<WhisperToken[]> {
  const fallbackText = narrationText || "In the early days of this story, a bold risk changed everything.";
  const targetLanguage = language || "en";

  try {
    if (!deepgramApiKey || !audioUrlOrBuffer) {
      return generateFallbackTokens(fallbackText);
    }

    // Require Deepgram SDK
    const DeepgramSDK = require("@deepgram/sdk");
    const createClient = DeepgramSDK.createClient || DeepgramSDK.default?.createClient;
    
    if (!createClient) {
      return generateFallbackTokens(fallbackText);
    }

    const deepgram = createClient(deepgramApiKey);

    const dgOptions: any = {
      model: "nova-2",
      language: targetLanguage,
      smart_format: true,
      punctuate: true,
      utterances: true,
    };

    let response: any;
    if (typeof audioUrlOrBuffer === "string") {
      response = await deepgram.listen.prerecorded.transcribeUrl(
        { url: audioUrlOrBuffer },
        dgOptions
      );
    } else {
      response = await deepgram.listen.prerecorded.transcribeFile(
        audioUrlOrBuffer,
        dgOptions
      );
    }

    const words = response?.result?.results?.channels?.[0]?.alternatives?.[0]?.words || [];

    if (words.length === 0) {
      return generateFallbackTokens(fallbackText);
    }

    // Convert Deepgram words to Remotion Whisper tokens (30 FPS)
    const tokens: WhisperToken[] = words.map((w: any) => {
      const startMs = Math.round((w.start || 0) * 1000);
      const endMs = Math.round((w.end || 0) * 1000);
      const startFrame = Math.floor((w.start || 0) * 30);
      const endFrame = Math.max(startFrame + 2, Math.ceil((w.end || 0) * 30));

      return {
        word: w.punctuated_word || w.word || "",
        startMs,
        endMs,
        startFrame,
        endFrame,
      };
    });

    return tokens;
  } catch (error) {
    console.error("[Deepgram Error]", error);
    return generateFallbackTokens(fallbackText);
  }
}

/**
 * Fallback token generator matching narration text word-by-word.
 */
function generateFallbackTokens(text: string): WhisperToken[] {
  const words = text.split(/\s+/).filter(Boolean);
  // Cartesia TTS sonic-3 speech pace: ~180ms per word (5.4 frames/word @ 30 FPS)
  const durationPerWordMs = 180;

  return words.map((word, idx) => {
    const startMs = idx * durationPerWordMs;
    const endMs = (idx + 1) * durationPerWordMs;
    const startFrame = Math.floor(startMs / 33.33);
    const endFrame = Math.max(startFrame + 1, Math.ceil(endMs / 33.33));

    return {
      word,
      startMs,
      endMs,
      startFrame,
      endFrame,
    };
  });
}
