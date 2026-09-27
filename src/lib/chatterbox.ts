/**
 * Central Chatterbox TTS Voiceover Engine.
 *
 * Runs on dedicated serverless Nvidia A10G GPU via Modal.com:
 * - ChatterboxTurboTTS (350M): Ultra-realistic English narration with paralinguistic tag support ([chuckle], [sigh], [gasp]).
 * - ChatterboxMultilingualTTS (500M): Natural Hindi / Hinglish & 23 languages.
 * - Zero-shot Voice Cloning: /turbo/clone and /multi/clone via voice_clip_url.
 * - Direct Cloudinary CDN upload: All endpoints return { url: "https://res.cloudinary.com/..." } with zero binary overhead!
 */

const audioCache = new Map<string, string>();

export const CHATTERBOX_MODAL_BASE_URL =
  process.env.CHATTERBOX_MODAL_URL || "https://mishramritunjay45--chatterbox-tts-chatterbox-web.modal.run";

export interface ChatterboxOptions {
  prompt: string;
  language?: string;
  voiceClipUrl?: string;
  exaggeration?: number;
  cfgWeight?: number;
  isHookScene?: boolean;
}

function twoDigitToWords(numStr: string): string {
  const n = parseInt(numStr, 10);
  if (isNaN(n)) return numStr;
  const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o > 0 ? `${tens[t]}-${ones[o]}` : tens[t];
}

/**
 * Normalizes numbers, currencies, percentages, and punctuation
 * to maximize natural cadence, prosody, and avoid TTS phonetic stutter.
 */
export function normalizeNarrationForTTS(text: string, language: string = "en"): string {
  if (!text) return "";

  const langKey = language.toLowerCase();
  const isHindi = langKey === "hi" || langKey === "hinglish";

  let cleaned = text;

  if (!isHindi) {
    // English currency, number & year expansions
    cleaned = cleaned
      .replace(/\$(\d+(?:\.\d+)?)\s*B(?:illion)?\b/gi, "$1 billion dollars")
      .replace(/\$(\d+(?:\.\d+)?)\s*M(?:illion)?\b/gi, "$1 million dollars")
      .replace(/\$(\d+(?:\.\d+)?)\s*K\b/gi, "$1 thousand dollars")
      .replace(/\$(\d+)/g, "$1 dollars")
      .replace(/\b(\d+)x\b/gi, "$1 times")
      .replace(/\b(\d+)%/g, "$1 percent")
      .replace(/\b19(\d{2})\b/g, (_, d) => `nineteen ${twoDigitToWords(d)}`)
      .replace(/\b20([0-2]\d)\b/g, (_, d) => `twenty ${twoDigitToWords(d)}`);
  } else {
    // Hindi currency cleanup: convert $ symbols cleanly so Hindi TTS doesn't stumble on foreign symbol
    cleaned = cleaned
      .replace(/\$(\d+(?:\.\d+)?)\s*B(?:illion)?\b/gi, "$1 अरब डॉलर")
      .replace(/\$(\d+(?:\.\d+)?)\s*M(?:illion)?\b/gi, "$1 मिलियन डॉलर")
      .replace(/\$(\d+)/g, "$1 डॉलर");
  }

  // Punctuation pacing: preserve single ellipsis for dramatic breath pause
  cleaned = cleaned
    .replace(/\.{4,}/g, "...")
    .replace(/—/g, ", ")
    .replace(/;/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

/**
 * Generate speech audio using Chatterbox on Modal.com.
 * Returns direct Cloudinary CDN audio URL.
 */
export async function generateChatterboxAudio(options: ChatterboxOptions): Promise<{ audioUrl: string }> {
  const {
    prompt,
    language = "en",
    voiceClipUrl,
    isHookScene = false,
  } = options;

  const normalizedText = normalizeNarrationForTTS(prompt, language);
  const langKey = language.toLowerCase();
  const isEnglish = langKey === "en" || langKey.startsWith("en-");

  // Documentary Reel Parameter Tuning:
  // Hook scene uses slightly higher urgency (0.75 / 0.45).
  // Standard documentary scenes use 0.70 / 0.35 (high emotional inflection with deliberate pacing).
  const defaultExaggeration = isHookScene ? 0.75 : 0.70;
  const defaultCfgWeight = isHookScene ? 0.45 : (isEnglish ? 0.35 : 0.40);

  const exaggeration = options.exaggeration ?? defaultExaggeration;
  const cfgWeight = options.cfgWeight ?? defaultCfgWeight;

  const cacheKey = `${langKey}_${voiceClipUrl || "default"}_${exaggeration}_${cfgWeight}_${normalizedText}`;
  if (audioCache.has(cacheKey)) {
    return { audioUrl: audioCache.get(cacheKey)! };
  }

  const baseUrl = CHATTERBOX_MODAL_BASE_URL.replace(/\/+$/, "");

  let endpoint = "";
  let body: Record<string, string> = {};

  if (isEnglish) {
    if (voiceClipUrl) {
      // English Voice Clone
      endpoint = `${baseUrl}/turbo/clone`;
      body = {
        text: normalizedText,
        voice_clip_url: voiceClipUrl,
        exaggeration: String(exaggeration),
        cfg_weight: String(cfgWeight),
      };
    } else {
      // English Turbo Standard
      endpoint = `${baseUrl}/turbo/generate`;
      body = {
        prompt: normalizedText,
        exaggeration: String(exaggeration),
        cfg_weight: String(cfgWeight),
      };
    }
  } else {
    const langId = langKey === "hi" || langKey === "hinglish" ? "hi" : langKey;
    if (voiceClipUrl) {
      // Multilingual Voice Clone
      endpoint = `${baseUrl}/multi/clone`;
      body = {
        text: normalizedText,
        voice_clip_url: voiceClipUrl,
        language_id: langId,
        exaggeration: String(exaggeration),
        cfg_weight: String(cfgWeight),
      };
    } else {
      // Multilingual Standard
      endpoint = `${baseUrl}/multi/generate`;
      body = {
        prompt: normalizedText,
        language_id: langId,
        exaggeration: String(exaggeration),
        cfg_weight: String(cfgWeight),
      };
    }
  }

  const formData = new URLSearchParams(body);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chatterbox API error (${response.status}) at ${endpoint}: ${errorText}`);
  }

  const data = await response.json();

  if (!data || !data.url) {
    throw new Error(`Chatterbox returned an invalid response without an audio URL: ${JSON.stringify(data)}`);
  }

  audioCache.set(cacheKey, data.url);
  return { audioUrl: data.url };
}
