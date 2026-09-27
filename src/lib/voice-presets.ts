/**
 * Curated Pre-Template Voices for Chatterbox Zero-Shot TTS.
 *
 * Sourced from assets/ref_voices and registered directly via Modal Chatterbox.
 * Each voice includes a permanent 10-second reference clip (clipUrl)
 * and an instant audio preview sample (previewUrl).
 */

export interface VoicePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
  language: "en" | "hi";
  clipUrl: string;
  previewUrl: string;
  recommendedExaggeration: number;
  recommendedCfgWeight: number;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    "id": "brian_english",
    "name": "Brian (British Documentary)",
    "description": "Crisp, authoritative British documentary delivery. Perfect for business histories and deep investigative breakdowns.",
    "accent": "British / Documentary",
    "language": "en",
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697783/voice_library/system/brian_english.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697797/voice_library_previews/cwbustg8otc2ulagbg1n.wav",
    "recommendedExaggeration": 0.7,
    "recommendedCfgWeight": 0.35
  },
  {
    "id": "brian_hindi",
    "name": "Brian (Hindi Storyteller)",
    "description": "Deep, warm conversational Hindi storytelling with natural cadence.",
    "accent": "Hindi / Conversational",
    "language": "hi",
    "recommendedExaggeration": 0.65,
    "recommendedCfgWeight": 0.4,
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697897/voice_library/system/brian_hindi.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697900/voice_library_previews/izsqvyelhludib6cmrgz.wav"
  },
  {
    "id": "mark_american",
    "name": "Mark (American Tech & Business)",
    "description": "Confident, energetic modern American narrator. Ideal for startup breakdowns and tech reels.",
    "accent": "American / Upbeat Tech",
    "language": "en",
    "recommendedExaggeration": 0.75,
    "recommendedCfgWeight": 0.4,
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697903/voice_library/system/mark_american.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697904/voice_library_previews/qrq9dcetxectpyolbut6.wav"
  },
  {
    "id": "matthew_english",
    "name": "Matthew (Deep Vox Baritone)",
    "description": "Gravel baritone with dramatic gravity. Ideal for true crime, scandals, and high-suspense climaxes.",
    "accent": "American / Deep Baritone",
    "language": "en",
    "recommendedExaggeration": 0.68,
    "recommendedCfgWeight": 0.32,
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697905/voice_library/system/matthew_english.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697907/voice_library_previews/gvejykhpt5mg4kiack5e.wav"
  },
  {
    "id": "matthew_hindi",
    "name": "Matthew (Hindi Deep Voice)",
    "description": "Authoritative, resonant Hindi narration for dramatic exposes and investigative reels.",
    "accent": "Hindi / Dramatic",
    "language": "hi",
    "recommendedExaggeration": 0.65,
    "recommendedCfgWeight": 0.38,
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697909/voice_library/system/matthew_hindi.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697912/voice_library_previews/wrxwzxefpz2kr2p6ziiz.wav"
  },
  {
    "id": "pro_narrator_english",
    "name": "Pro Narrator (Cinematic Studio)",
    "description": "Polished broadcast studio voice. Balanced, dynamic, and crystal-clear articulation.",
    "accent": "Neutral Studio / Broadcast",
    "language": "en",
    "recommendedExaggeration": 0.7,
    "recommendedCfgWeight": 0.35,
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697915/voice_library/system/pro_narrator_english.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697917/voice_library_previews/oz9qj0phcqmzd5cnixje.wav"
  },
  {
    "id": "pro_narrator_hindi",
    "name": "Pro Narrator (Hindi Broadcast)",
    "description": "Clear, broadcast-grade Hindi narration with excellent articulation.",
    "accent": "Hindi / Broadcast",
    "language": "hi",
    "recommendedExaggeration": 0.65,
    "recommendedCfgWeight": 0.4,
    "clipUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697921/voice_library/system/pro_narrator_hindi.wav",
    "previewUrl": "https://res.cloudinary.com/diah8zonu/video/upload/v1788697925/voice_library_previews/errhcawomupal9wuvco3.wav"
  }
];

export function getVoicePresetById(id: string): VoicePreset | undefined {
  return VOICE_PRESETS.find((v) => v.id === id);
}

export function getDefaultVoiceForLanguage(language: string = "en"): VoicePreset {
  const langKey = language.toLowerCase();
  if (langKey === "hi" || langKey === "hinglish") {
    return VOICE_PRESETS.find((v) => v.language === "hi") || VOICE_PRESETS[1];
  }
  return VOICE_PRESETS[0]; // Brian (British Documentary)
}
