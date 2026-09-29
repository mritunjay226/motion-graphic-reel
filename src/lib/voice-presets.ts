/**
 * Curated Voice Presets for Gemini 3.8 Flash TTS & Gemini 3.8 Flash Lite TTS.
 *
 * All voices are powered by official Google Gemini prebuilt voices:
 * - Puck: Upbeat, energetic modern narrator with rapid narrative cadence
 * - Charon: Deep, authoritative dramatic baritone with commanding gravity
 * - Kore: Crisp, balanced, neutral documentary narrator
 * - Fenrir: Bold, resonant, high-impact investigative breakdown voice
 * - Aoede: Sophisticated, smooth, cinematic studio broadcast delivery
 * - Leda: Warm, bright, expressive, and engaging narrator
 * - Orus: Firm, steady, informative, and authoritative corporate
 * - Zephyr: Gentle, airy, conversational, and contemplative
 * - Fola: Warm, charismatic, emotive storyteller
 */

export interface VoicePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
  language: "en" | "hi";
  geminiVoiceName: string;
  model: "gemini-3.8-flash-tts" | "gemini-3.8-flash-lite-tts";
  previewUrl: string;
  sampleText: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  // ── English Studio Narrators (Gemini 3.8 Flash TTS) ──
  {
    id: "fola_gemini",
    name: "Fola (Gemini 3.8 Flash Studio)",
    description: "Warm, charismatic, and emotionally captivating narrator. Ideal for viral storytelling and brand narratives.",
    accent: "Neutral / Emotive Studio",
    language: "en",
    geminiVoiceName: "Fola",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549912/vox-reels/gemini_previews/fola_en.wav",
    sampleText: "Hello, this is Fola, a warm, charismatic storyteller crafted for high-retention reels.",
  },
  {
    id: "puck_gemini",
    name: "Puck (Gemini 3.8 Flash Dynamic)",
    description: "Upbeat, energetic modern narrator with rapid narrative cadence. Perfect for tech breakdowns and high-hook reels.",
    accent: "Modern / Upbeat Tech",
    language: "en",
    geminiVoiceName: "Puck",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549917/vox-reels/gemini_previews/puck_en.wav",
    sampleText: "Hello! This is Puck, an energetic and modern narrator voice powered by Gemini 3.8.",
  },
  {
    id: "charon_gemini",
    name: "Charon (Gemini 3.8 Flash Deep Voice)",
    description: "Resonant, authoritative deep baritone with dramatic weight. Essential for true crime, scandals, and thrilling climaxes.",
    accent: "Deep Baritone / Dramatic",
    language: "en",
    geminiVoiceName: "Charon",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549909/vox-reels/gemini_previews/charon_en.wav",
    sampleText: "This is Charon, a deep and authoritative baritone voice for investigative documentaries.",
  },
  {
    id: "fenrir_gemini",
    name: "Fenrir (Gemini 3.8 Flash Bold)",
    description: "Crisp, authoritative investigative documentary voice. Perfect for business histories and deep investigative breakdowns.",
    accent: "Authoritative / Documentary",
    language: "en",
    geminiVoiceName: "Fenrir",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549911/vox-reels/gemini_previews/fenrir_en.wav",
    sampleText: "This is Fenrir. A bold, resonant, and high-impact documentary voice.",
  },
  {
    id: "aoede_gemini",
    name: "Aoede (Gemini 3.8 Flash Cinematic)",
    description: "Polished, sophisticated broadcast studio voice. Balanced, dynamic, and crystal-clear articulation.",
    accent: "Sophisticated / Broadcast",
    language: "en",
    geminiVoiceName: "Aoede",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549907/vox-reels/gemini_previews/aoede_en.wav",
    sampleText: "Welcome. This is Aoede, offering polished, sophisticated cinematic studio delivery.",
  },
  {
    id: "leda_gemini",
    name: "Leda (Gemini 3.8 Flash Expressive)",
    description: "Warm, bright, expressive, and engaging voice. Great for lifestyle, education, and optimistic business histories.",
    accent: "Warm / Bright Studio",
    language: "en",
    geminiVoiceName: "Leda",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549915/vox-reels/gemini_previews/leda_en.wav",
    sampleText: "Hello! This is Leda, a warm, bright, and expressive narrator for your reels.",
  },
  {
    id: "orus_gemini",
    name: "Orus (Gemini 3.8 Flash Corporate)",
    description: "Firm, steady, informative, and authoritative narrator. Ideal for market analysis and financial breakdowns.",
    accent: "Firm / Informative",
    language: "en",
    geminiVoiceName: "Orus",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549916/vox-reels/gemini_previews/orus_en.wav",
    sampleText: "This is Orus, a firm, steady, and clear voice designed for informative breakdowns.",
  },
  {
    id: "zephyr_gemini",
    name: "Zephyr (Gemini 3.8 Flash Conversational)",
    description: "Gentle, airy, conversational, and thoughtful narrative pace. Perfect for human interest and long-form explainers.",
    accent: "Gentle / Conversational",
    language: "en",
    geminiVoiceName: "Zephyr",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549919/vox-reels/gemini_previews/zephyr_en.wav",
    sampleText: "Hello, this is Zephyr, an engaging and thoughtful voice for compelling storytelling.",
  },
  {
    id: "kore_gemini_lite",
    name: "Kore (Gemini 3.8 Flash Lite)",
    description: "Ultra-fast, clear and focused voice powered by Gemini 3.8 Flash Lite. Smooth flow and minimal latency.",
    accent: "Neutral / Crystal Clear",
    language: "en",
    geminiVoiceName: "Kore",
    model: "gemini-3.8-flash-lite-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549914/vox-reels/gemini_previews/kore_en.wav",
    sampleText: "Hello, this is Kore, delivering crisp, focused, and balanced documentary narration.",
  },

  // ── Hindi / Multilingual Narrators (Gemini 3.8 Flash TTS) ──
  {
    id: "fola_hindi",
    name: "Fola (Gemini 3.8 Hindi Storyteller)",
    description: "Deep, natural conversational Hindi storytelling with authentic cadence and pronunciation.",
    accent: "Hindi / Conversational",
    language: "hi",
    geminiVoiceName: "Fola",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549913/vox-reels/gemini_previews/fola_hi.wav",
    sampleText: "नमस्ते, यह जेमिनी 3.8 का हिंदी वॉइसओवर है। यह आपकी रील्स को एक नया रूप देगा।",
  },
  {
    id: "charon_hindi",
    name: "Charon (Gemini 3.8 Hindi Dramatic)",
    description: "Authoritative, resonant Hindi narration for dramatic exposes and investigative reels.",
    accent: "Hindi / Dramatic Baritone",
    language: "hi",
    geminiVoiceName: "Charon",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549910/vox-reels/gemini_previews/charon_hi.wav",
    sampleText: "यह चारोन की आवाज़ है, जो गंभीर और रहस्यमयी डॉक्यूमेंट्री के लिए एकदम सही है।",
  },
  {
    id: "puck_hindi",
    name: "Puck (Gemini 3.8 Hindi Tech & Upbeat)",
    description: "Fast-paced, vibrant Hindi narrator for startup stories, tech breakdowns, and viral reels.",
    accent: "Hindi / Upbeat Modern",
    language: "hi",
    geminiVoiceName: "Puck",
    model: "gemini-3.8-flash-tts",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549918/vox-reels/gemini_previews/puck_hi.wav",
    sampleText: "नमस्ते! यह पक की तेज़ और रोमांचक आवाज़ है, जो टेक और वायरल स्टोरीज़ के लिए बेहतरीन है।",
  },
];

const LEGACY_ID_FALLBACK_MAP: Record<string, string> = {
  brian_english: "fenrir_gemini",
  brian_hindi: "fola_hindi",
  mark_american: "puck_gemini",
  matthew_english: "charon_gemini",
  matthew_hindi: "charon_hindi",
  pro_narrator_english: "aoede_gemini",
  pro_narrator_hindi: "fola_hindi",
  "62ae83ad-4f6a-430b-af41-a9bede9286ca": "puck_gemini",
  "7e8cb11d-37af-476b-ab8f-25da99b18644": "fola_hindi",
};

export function getVoicePresetById(id?: string): VoicePreset | undefined {
  if (!id) return VOICE_PRESETS[0];

  const direct = VOICE_PRESETS.find((v) => v.id === id);
  if (direct) return direct;

  const mappedId = LEGACY_ID_FALLBACK_MAP[id];
  if (mappedId) {
    return VOICE_PRESETS.find((v) => v.id === mappedId);
  }

  // Match by voice name or ID substring
  const lower = id.toLowerCase();
  const byVoiceName = VOICE_PRESETS.find(
    (v) => v.geminiVoiceName.toLowerCase() === lower || v.id.toLowerCase().includes(lower)
  );
  if (byVoiceName) return byVoiceName;

  return undefined;
}

export function getDefaultVoiceForLanguage(language: string = "en"): VoicePreset {
  const langKey = language.toLowerCase();
  if (langKey === "hi" || langKey === "hinglish") {
    return VOICE_PRESETS.find((v) => v.id === "fola_hindi") || VOICE_PRESETS.find((v) => v.language === "hi") || VOICE_PRESETS[0];
  }
  return VOICE_PRESETS.find((v) => v.id === "fenrir_gemini") || VOICE_PRESETS[0];
}
