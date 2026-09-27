import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const VOICES_DIR = path.join(rootDir, "assets", "ref_voices");
const BASE_URL = "https://mishramritunjay45--chatterbox-tts-chatterbox-web.modal.run";

const VOICES_CONFIG = [
  {
    fileName: "brian_english.mp3",
    id: "brian_english",
    name: "Brian (British Documentary)",
    description: "Crisp, authoritative British documentary delivery. Perfect for business histories and deep investigative breakdowns.",
    accent: "British / Documentary",
    language: "en",
    endpoint: "turbo",
    previewText: "Hello, this is a preview of the British documentary voice.",
    // Already registered in previous test:
    clipUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1788697783/voice_library/system/brian_english.wav",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1788697797/voice_library_previews/cwbustg8otc2ulagbg1n.wav",
    recommendedExaggeration: 0.70,
    recommendedCfgWeight: 0.35,
  },
  {
    fileName: "brian_hindi.mp3",
    id: "brian_hindi",
    name: "Brian (Hindi Storyteller)",
    description: "Deep, warm conversational Hindi storytelling with natural cadence.",
    accent: "Hindi / Conversational",
    language: "hi",
    endpoint: "multi",
    previewText: "नमस्ते, यह हिंदी डॉक्यूमेंट्री आवाज़ का प्रीव्यू है।",
    recommendedExaggeration: 0.65,
    recommendedCfgWeight: 0.40,
  },
  {
    fileName: "mark.mp3",
    id: "mark_american",
    name: "Mark (American Tech & Business)",
    description: "Confident, energetic modern American narrator. Ideal for startup breakdowns and tech reels.",
    accent: "American / Upbeat Tech",
    language: "en",
    endpoint: "turbo",
    previewText: "Hey there, this is Mark with your business and tech breakdown.",
    recommendedExaggeration: 0.75,
    recommendedCfgWeight: 0.40,
  },
  {
    fileName: "matthew_english.mp3",
    id: "matthew_english",
    name: "Matthew (Deep Vox Baritone)",
    description: "Gravel baritone with dramatic gravity. Ideal for true crime, scandals, and high-suspense climaxes.",
    accent: "American / Deep Baritone",
    language: "en",
    endpoint: "turbo",
    previewText: "And then, in the shadows of the corporate boardroom, everything unraveled.",
    recommendedExaggeration: 0.68,
    recommendedCfgWeight: 0.32,
  },
  {
    fileName: "matthew_hindi.mp3",
    id: "matthew_hindi",
    name: "Matthew (Hindi Deep Voice)",
    description: "Authoritative, resonant Hindi narration for dramatic exposes and investigative reels.",
    accent: "Hindi / Dramatic",
    language: "hi",
    endpoint: "multi",
    previewText: "और फिर, किसी को अंदाज़ा नहीं था कि आगे क्या होने वाला है।",
    recommendedExaggeration: 0.65,
    recommendedCfgWeight: 0.38,
  },
  {
    fileName: "pro_narrator_english.mp3",
    id: "pro_narrator_english",
    name: "Pro Narrator (Cinematic Studio)",
    description: "Polished broadcast studio voice. Balanced, dynamic, and crystal-clear articulation.",
    accent: "Neutral Studio / Broadcast",
    language: "en",
    endpoint: "turbo",
    previewText: "Welcome to this investigative retrospective. Let's examine the evidence.",
    recommendedExaggeration: 0.70,
    recommendedCfgWeight: 0.35,
  },
  {
    fileName: "pro_narrator_hindi.mp3",
    id: "pro_narrator_hindi",
    name: "Pro Narrator (Hindi Broadcast)",
    description: "Clear, broadcast-grade Hindi narration with excellent articulation.",
    accent: "Hindi / Broadcast",
    language: "hi",
    endpoint: "multi",
    previewText: "डॉक्यूमेंट्री के इस एपिसोड में आपका स्वागत है। चलिए शुरुआत करते हैं।",
    recommendedExaggeration: 0.65,
    recommendedCfgWeight: 0.40,
  },
];

async function registerVoice(voice) {
  if (voice.clipUrl && voice.previewUrl) {
    console.log(`⏩ [Cache] Voice "${voice.name}" already has Cloudinary URLs.`);
    return voice;
  }

  const filePath = path.join(VOICES_DIR, voice.fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return voice;
  }

  const url = `${BASE_URL}/${voice.endpoint}/save-voice`;
  console.log(`🎙️ [Uploading] ${voice.name} (${voice.fileName}) -> ${url}...`);

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: "audio/mpeg" });

  const formData = new FormData();
  formData.append("ref_audio", blob, voice.fileName);
  formData.append("user_id", "system");
  formData.append("voice_name", voice.id);
  formData.append("preview_text", voice.previewText);

  if (voice.endpoint === "multi") {
    formData.append("language_id", "hi");
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log(`  ✅ Success! clip_url: ${data.clip_url}`);
    console.log(`  ✅ preview_url: ${data.preview_url}`);

    return {
      ...voice,
      clipUrl: data.clip_url,
      previewUrl: data.preview_url,
    };
  } catch (err) {
    console.error(`  ❌ Failed for ${voice.name}:`, err.message);
    return voice;
  }
}

async function run() {
  console.log("🚀 Registering reference voices with Chatterbox on Modal...");
  const processed = [];

  for (const voice of VOICES_CONFIG) {
    const res = await registerVoice(voice);
    processed.push(res);
  }

  // Write out src/lib/voice-presets.ts
  const tsContent = `/**
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

export const VOICE_PRESETS: VoicePreset[] = ${JSON.stringify(
    processed.map(({ fileName, endpoint, previewText, ...rest }) => rest),
    null,
    2
  )};

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
`;

  const outputPath = path.join(rootDir, "src", "lib", "voice-presets.ts");
  fs.writeFileSync(outputPath, tsContent, "utf-8");
  console.log(`\n🎉 Successfully generated ${outputPath}!`);
}

run().catch(console.error);
