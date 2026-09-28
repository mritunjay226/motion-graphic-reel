import { Flame, Briefcase, Cpu, LucideIcon } from "lucide-react";
import { VOICE_PRESETS } from "@/lib/voice-presets";

export interface VoiceOption {
  id: string;
  name: string;
  lang: "hi" | "en" | "es" | "fr" | "de" | "all";
  desc: string;
  sampleText: string;
  accent: string;
  previewUrl?: string;
}

export const GEMINI_VOICES: VoiceOption[] = [
  // ── Curated Gemini 3.8 Flash TTS Voice Library ──
  ...VOICE_PRESETS.map((vp) => ({
    id: vp.id,
    name: vp.name,
    lang: vp.language as "hi" | "en",
    accent: vp.accent,
    desc: vp.description,
    sampleText: vp.sampleText || (vp.language === "hi"
      ? "नमस्ते, यह हिंदी डॉक्यूमेंट्री आवाज़ का प्रीव्यू है।"
      : "Hello, this is a sample preview of this documentary narrator voice."),
    previewUrl: vp.previewUrl,
  })),
];

// Alias for backwards compatibility across existing components
export const CARTESIA_VOICES = GEMINI_VOICES;


export interface LanguageOption {
  id: string;
  name: string;
  flag: string;
  defaultVoice: string;
}

export const LANGUAGES: LanguageOption[] = [
  { id: "en", name: "English", flag: "🇺🇸", defaultVoice: "fola_gemini" },
  { id: "hi", name: "Hindi (Hinglish)", flag: "🇮🇳", defaultVoice: "fola_hindi" },
  { id: "es", name: "Spanish", flag: "🇪🇸", defaultVoice: "fola_gemini" },
  { id: "fr", name: "French", flag: "🇫🇷", defaultVoice: "fola_gemini" },
  { id: "de", name: "German", flag: "🇩🇪", defaultVoice: "fola_gemini" },
];

export type TopicCategoryKey = "viral" | "business" | "tech";

export interface CategoryTopicData {
  label: string;
  icon: LucideIcon;
  topicsEn: string[];
  topicsHi: string[];
}

export const CATEGORIZED_TRENDING_TOPICS: Record<TopicCategoryKey, CategoryTopicData> = {
  viral: {
    label: "VIRAL SCANDALS",
    icon: Flame,
    topicsEn: [
      "Why OpenAI Fired Sam Altman in 2023",
      "The $100 Billion Scam of Theranos & Elizabeth Holmes",
      "The 1983 Soviet Nuclear False Alarm That Saved Earth",
      "The $1 Billion Heist of Bangladesh Central Bank",
      "The Secret War Between Boeing and Airbus",
    ],
    topicsHi: [
      "क्यों OpenAI ने Sam Altman को निकाला?",
      "Theranos का $100 Billion का फ्रॉड कैसे पकड़ा गया?",
      "1983 का वो न्यूक्लियर अलार्म जिसने दुनिया को बचा लिया",
      "Dubai के बुर्ज खलीफा का सीक्रेट सीवेज सिस्टम",
    ],
  },
  business: {
    label: "BUSINESS & LUXURY",
    icon: Briefcase,
    topicsEn: [
      "Why Ferrari Sues Its Own Billionaire Customers",
      "How Rolex Created Artificial Scarcity",
      "How Costco Makes Billions Selling Hot Dogs at a Loss",
      "Why McDonald's Ice Cream Machines Always Break",
      "How Netflix Crushed Blockbuster with $0 Ads",
    ],
    topicsHi: [
      "Ferrari अपने ही अमीर ग्राहकों पर केस क्यों करती है?",
      "Rolex कैसे घड़ियों की बनावटी कमी पैदा करता है?",
      "McDonald's की आइसक्रीम मशीनें हमेशा ख़राब क्यों रहती हैं?",
      "Costco सस्ते Hot Dog बेचकर भी अरबों कैसे कमाता है?",
      "Netflix ने Blockbuster को 9000 स्टोर्स के साथ कैसे बर्बाद किया?",
    ],
  },
  tech: {
    label: "TECH DOMINANCE",
    icon: Cpu,
    topicsEn: [
      "How Nvidia Became a $3 Trillion Empire",
      "How TSMC Secretly Controls the World Economy",
      "How Apple Nearly Went Bankrupt in 1997",
      "The Rise and Fall of BlackBerry",
      "How Amazon Created AWS by Complete Accident",
    ],
    topicsHi: [
      "कैसे Nvidia $3 Trillion की कंपनी बनी",
      "कैसे TSMC दुनिया की पूरी टेक इकोनॉमी को कंट्रोल करता है?",
      "Apple 1997 में कैसे दिवालिया होने की कगार पर था?",
      "BlackBerry के पतन की असली कहानी",
      "Amazon ने गलती से AWS क्लाउड कैसे बना दिया?",
    ],
  },
};
