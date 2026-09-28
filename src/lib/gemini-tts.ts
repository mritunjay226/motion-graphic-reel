import { GoogleGenAI } from "@google/genai";
import mime from "mime";

/**
 * Gemini 3.8 TTS Voiceover Engine
 * 
 * Supports:
 * - gemini-3.8-flash-tts (Primary high-retention studio voiceover)
 * - gemini-3.8-flash-lite-tts (Ultra-fast lightweight voiceover)
 * 
 * Prebuilt Voices:
 * - Fola: Warm, charismatic, emotive storyteller (English & Multilingual)
 * - Puck: Upbeat, energetic, modern narrative pace
 * - Charon: Deep, dramatic, authoritative baritone
 * - Kore: Clear, balanced, focused documentary narration
 * - Fenrir: Bold, resonant, high-impact investigative style
 * - Aoede: Sophisticated, smooth, cinematic studio delivery
 */

export type GeminiTtsModel = "gemini-3.8-flash-tts" | "gemini-3.8-flash-lite-tts";

export interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

export interface GeminiTtsOptions {
  text: string;
  voiceName?: string;
  model?: GeminiTtsModel | string;
  temperature?: number;
  language?: string;
}

export interface GeminiAudioResult {
  buffer: Buffer;
  durationSec: number;
  sampleRate: number;
  mimeType: string;
  model: GeminiTtsModel;
  voiceName: string;
}

// In-memory cache for synthesized audio to ensure instant seeking in Remotion and preview
const audioCache = new Map<string, GeminiAudioResult>();

/**
 * Maps legacy voice IDs or presets to official Gemini 3.8 voice names.
 */
export function resolveGeminiVoiceName(voiceIdOrName?: string, language: string = "en"): string {
  if (!voiceIdOrName) return "Fola";

  const lower = voiceIdOrName.toLowerCase();

  // If already a valid Gemini voice name or starts with one
  const validVoices = ["fola", "puck", "charon", "kore", "fenrir", "aoede", "leda", "orus", "zephyr"];
  for (const v of validVoices) {
    if (lower === v || lower.startsWith(`${v}_`) || lower.includes(v)) {
      return v.charAt(0).toUpperCase() + v.slice(1);
    }
  }

  // Voice mappings for legacy presets and descriptions
  if (lower.includes("deep") || lower.includes("matthew") || lower.includes("baritone") || lower.includes("scandal")) {
    return "Charon";
  }
  if (lower.includes("mark") || lower.includes("tech") || lower.includes("energetic") || lower.includes("upbeat")) {
    return "Puck";
  }
  if (lower.includes("brian") || lower.includes("british") || lower.includes("investigative") || lower.includes("bold")) {
    return "Fenrir";
  }
  if (lower.includes("pro") || lower.includes("broadcast") || lower.includes("studio") || lower.includes("aoede")) {
    return "Aoede";
  }
  if (lower.includes("kore") || lower.includes("calm") || lower.includes("clarity")) {
    return "Kore";
  }

  return "Fola";
}

/**
 * Resolves the appropriate Gemini TTS model identifier.
 */
export function resolveGeminiModel(model?: string): GeminiTtsModel {
  if (model === "gemini-3.8-flash-lite-tts" || model?.includes("lite")) {
    return "gemini-3.8-flash-lite-tts";
  }
  return "gemini-3.8-flash-tts";
}

/**
 * Parses MIME type parameters to extract PCM configuration.
 */
export function parseMimeType(mimeType: string): WavConversionOptions {
  const [fileType, ...params] = mimeType.split(";").map((s) => s.trim());
  const [_, format] = fileType.split("/");

  const options: WavConversionOptions = {
    numChannels: 1,
    sampleRate: 24000,
    bitsPerSample: 16,
  };

  if (format && (format.startsWith("L") || format.startsWith("l"))) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }

  for (const param of params) {
    const [key, value] = param.split("=").map((s) => s.trim());
    if (key === "rate") {
      const parsedRate = parseInt(value, 10);
      if (!isNaN(parsedRate)) options.sampleRate = parsedRate;
    }
    if (key === "channels") {
      const parsedChannels = parseInt(value, 10);
      if (!isNaN(parsedChannels)) options.numChannels = parsedChannels;
    }
  }

  return options;
}

/**
 * Creates standard 44-byte RIFF/WAVE header for raw PCM audio.
 */
export function createWavHeader(dataLength: number, options: WavConversionOptions): Buffer {
  const { numChannels, sampleRate, bitsPerSample } = options;

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write("RIFF", 0);                      // ChunkID
  buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
  buffer.write("WAVE", 8);                      // Format
  buffer.write("fmt ", 12);                     // Subchunk1ID
  buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);        // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
  buffer.writeUInt32LE(byteRate, 28);           // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
  buffer.write("data", 36);                     // Subchunk2ID
  buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

  return buffer;
}

/**
 * Sanitizes narration text for high-cadence TTS pronunciation.
 */
export function sanitizeTranscript(text: string): string {
  return text
    .replace(/\s*\.{3,}/g, ".")
    .replace(/;/g, ",")
    .replace(/—/g, ",")
    .replace(/–/g, ",")
    .replace(/,{2,}/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generates audio using Gemini 3.8 TTS Flash or Gemini 3.8 TTS Flash Lite.
 */
export async function generateGeminiAudio(options: GeminiTtsOptions): Promise<GeminiAudioResult> {
  const {
    text,
    voiceName: requestedVoice,
    model: requestedModel,
    temperature = 1,
    language = "en",
  } = options;

  if (!text || !text.trim()) {
    throw new Error("Text parameter is required for Gemini TTS generation.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const voiceName = resolveGeminiVoiceName(requestedVoice, language);
  const model = resolveGeminiModel(requestedModel);
  const cleanText = sanitizeTranscript(text);

  const cacheKey = `${model}:${voiceName}:${cleanText}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const ai = new GoogleGenAI({ apiKey });

  const config = {
    temperature,
    responseModalities: ["audio"],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName,
        },
      },
    },
  };

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `## Transcript:\n${cleanText}`,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    const pcmChunks: Buffer[] = [];
    let mimeType = "audio/l16; rate=24000; channels=1";

    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      for (const part of chunk.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          if (part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          pcmChunks.push(Buffer.from(part.inlineData.data, "base64"));
        }
      }
    }

    if (pcmChunks.length === 0) {
      throw new Error(`Gemini TTS returned no audio data for model ${model} and voice ${voiceName}.`);
    }

    const combinedPcm = Buffer.concat(pcmChunks);
    const wavOptions = parseMimeType(mimeType);
    const wavHeader = createWavHeader(combinedPcm.length, wavOptions);
    const finalWavBuffer = Buffer.concat([wavHeader, combinedPcm]);

    const byteRate = (wavOptions.sampleRate * wavOptions.numChannels * wavOptions.bitsPerSample) / 8;
    const durationSec = Math.round((combinedPcm.length / byteRate) * 100) / 100;

    const result: GeminiAudioResult = {
      buffer: finalWavBuffer,
      durationSec: Math.max(1.0, durationSec),
      sampleRate: wavOptions.sampleRate,
      mimeType: "audio/wav",
      model,
      voiceName,
    };

    audioCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    // If flash-tts failed and model was not already lite, try flash-lite-tts fallback
    if (model === "gemini-3.8-flash-tts") {
      console.warn(`[Gemini TTS] Falling back from gemini-3.8-flash-tts to gemini-3.8-flash-lite-tts: ${err.message}`);
      return generateGeminiAudio({
        ...options,
        model: "gemini-3.8-flash-lite-tts",
      });
    }
    throw err;
  }
}

/**
 * Direct buffer generation with memory caching for Next.js API routes & Remotion playback.
 */
export async function getOrGenerateGeminiAudio(
  text: string,
  voiceName: string = "Fola",
  model: GeminiTtsModel = "gemini-3.8-flash-tts",
  language: string = "en"
): Promise<Buffer> {
  const result = await generateGeminiAudio({
    text,
    voiceName,
    model,
    language,
  });
  return result.buffer;
}
