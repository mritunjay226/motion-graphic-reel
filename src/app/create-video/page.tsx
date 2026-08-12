"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { ReelGenerationProgress } from "@/components/ReelGenerationProgress";

export interface CartesiaVoice {
  id: string;
  name: string;
  lang: "hi" | "en" | "es" | "fr" | "de" | "all";
  desc: string;
}

const CARTESIA_VOICES: CartesiaVoice[] = [
  // Hindi Voices
  { id: "7e8cb11d-37af-476b-ab8f-25da99b18644", name: "Anuj — Hindi Narrator", lang: "hi", desc: "Hindi Male — Energetic, high retention documentary narrator" },
  { id: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc", name: "Jacquelin — Hindi Female", lang: "hi", desc: "Hindi Female — Smooth, engaging narrative voice" },

  // English & Multi-lingual Voices
  { id: "62ae83ad-4f6a-430b-af41-a9bede9286ca", name: "Vox High-Retention Explainer", lang: "en", desc: "Dynamic, fast-paced, high energy viral documentary voice" },
  { id: "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1", name: "Clive — Documentary Narrator", lang: "en", desc: "UK Male — Deep, suspenseful, cinematic tone for thrillers & crime" },
  { id: "5ee9feff-1265-424a-9d7f-8e4d431a12c7", name: "Ronald — Deep Authority", lang: "en", desc: "US Male — Authoritative, high stakes narrator" },
  { id: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4", name: "Skylar — High Tempo Guide", lang: "en", desc: "US Female — Energetic tech & innovation explainer" },
  { id: "ef191366-f52f-447a-a398-ed8c0f2943a1", name: "Archie — Storyteller", lang: "en", desc: "UK Male — Fast engaging narrative voice" },
];

const LANGUAGES = [
  { id: "hi", name: "Hindi (Hinglish)", flag: "🇮🇳", desc: "Hinglish subtitles with Hindi voiceover" },
  { id: "en", name: "English", flag: "🇺🇸", desc: "Classic viral documentary script" },
  { id: "es", name: "Spanish (Español)", flag: "🇪🇸", desc: "High-retention Spanish voiceover" },
  { id: "fr", name: "French (Français)", flag: "🇫🇷", desc: "Cinematic French documentary" },
  { id: "de", name: "German (Deutsch)", flag: "🇩🇪", desc: "Authoritative German narrative" },
];

const PRESET_TOPICS_EN = [
  "Why OpenAI Fired Sam Altman in 2023",
  "How Nvidia Became a $3 Trillion Empire",
  "The Secret Engineering Behind Concorde",
  "How Red Bull Built an Extreme Sports Empire",
  "The Rise and Fall of BlackBerry",
  "Why McDonald's Ice Cream Machines Always Break",
  "How Spotify Re-engineered Music Streaming",
];

const PRESET_TOPICS_HI = [
  "क्यों OpenAI ने Sam Altman को निकाला?",
  "कैसे Nvidia $3 Trillion की कंपनी बनी",
  "McDonald's की आइसक्रीम मशीनें हमेशा ख़राब क्यों रहती हैं?",
  "Red Bull की सीक्रेट मार्केटिंग स्ट्रेटेजी",
  "कैसे Spotify ने म्यूज़िक इंडस्ट्री को बदल दिया",
  "BlackBerry के पतन की असली कहानी",
];

export default function CreateVideoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, user } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi");
  const [topic, setTopic] = useState<string>("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("7e8cb11d-37af-476b-ab8f-25da99b18644");
  const [model, setModel] = useState<string>("flux");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch default voice when language changes
  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    if (langId === "hi") {
      setSelectedVoiceId("7e8cb11d-37af-476b-ab8f-25da99b18644");
    } else {
      setSelectedVoiceId("62ae83ad-4f6a-430b-af41-a9bede9286ca");
    }
  };

  // Pre-fill topic from URL search param if available
  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic) {
      setTopic(urlTopic);
    }
  }, [searchParams]);

  const activePresets = selectedLanguage === "hi" ? PRESET_TOPICS_HI : PRESET_TOPICS_EN;

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const userId = user?.id || "user_guest";

      const res = await fetch("/api/generate-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          topic: topic.trim(),
          voiceId: selectedVoiceId,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();

      if (data.success && data.reelId) {
        setActiveReelId(data.reelId);
      } else {
        setErrorMessage(data.error || "Failed to trigger video generation pipeline.");
        setIsGenerating(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to trigger video generation pipeline.");
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F2F1EC] text-[#0C0C0E] flex flex-col font-sans selection:bg-[#B4F500] selection:text-black vox-paper-texture">
      {/* Vox Editorial Navigation Header */}
      <header className="border-b-2 border-[#0C0C0E] bg-[#F2F1EC]/90 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-1 bg-[#0C0C0E] text-[#B4F500] font-bebas text-lg tracking-wider rounded hover:bg-[#222224] transition-colors flex items-center gap-1"
          >
            <span>← STUDIO</span>
          </Link>
          <div>
            <h1 className="font-bebas text-xl tracking-wide text-[#0C0C0E] leading-none">
              CREATE VOX VIDEO REEL
            </h1>
            <p className="text-[10px] text-[#666666] font-utility font-bold uppercase tracking-wider">
              Automated 2.5D Motion Generation Workstation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 rounded-full border-2 border-[#0C0C0E]" } }} />
          ) : (
            <SignInButton mode="modal">
              <button type="button" className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-[#B4F500] text-[#0C0C0E] hover:bg-[#a5e400] transition-all shadow-vox border border-[#0C0C0E]">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      {/* Main Studio Form & Progress Workstation */}
      <div className="flex-1 max-w-[960px] w-full mx-auto p-6 sm:p-10 flex flex-col justify-center">
        {activeReelId ? (
          <div className="flex flex-col gap-4">
            <ReelGenerationProgress
              reelId={activeReelId}
              onComplete={(reelId) => {
                router.push(`/reel/${reelId}`);
              }}
              onRetry={() => {
                setActiveReelId(null);
                setIsGenerating(false);
              }}
            />

            <button
              type="button"
              onClick={() => {
                setActiveReelId(null);
                setIsGenerating(false);
              }}
              className="text-xs text-[#666666] hover:text-[#0C0C0E] underline font-utility font-bold text-center"
            >
              ← Back to Video Creation Studio
            </button>
          </div>
        ) : (
          /* Vox Studio Form Card */
          <div className="bg-white border-4 border-[#0C0C0E] rounded-3xl p-8 sm:p-10 shadow-vox relative overflow-hidden">
            
            {/* Header Badge & Title */}
            <div className="mb-8">
              <div className="inline-block bg-[#FFE500] text-[#0C0C0E] font-bebas text-xs px-3 py-1 font-bold uppercase tracking-widest mb-3 rounded border border-[#0C0C0E]">
                DOCUMENTARY MOTION GENERATOR
              </div>
              <h2 className="font-bebas text-4xl sm:text-5xl text-[#0C0C0E] uppercase leading-none mb-3">
                What Story Would You Like To Create?
              </h2>
              <p className="text-sm text-[#555555] font-medium leading-relaxed max-w-2xl">
                Enter any documentary topic or business case study. Our automated pipeline generates the 6-scene script, Cartesia voiceover, Deepgram captions, and 2.5D paper cutout stickers.
              </p>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleCreateVideo} className="flex flex-col gap-6">
              
              {/* Language Selector */}
              <div className="bg-[#F7F7F5] p-5 rounded-2xl border-2 border-[#0C0C0E]">
                <label className="font-bebas text-base text-[#0C0C0E] block mb-3 uppercase tracking-wide flex items-center justify-between">
                  <span>🌐 Target Video Language</span>
                  <span className="text-[10px] bg-[#B4F500] text-[#0C0C0E] px-2 py-0.5 rounded font-utility font-black uppercase">
                    HIGH RETENTION VOICE & FONTS
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        selectedLanguage === lang.id
                          ? "bg-[#0C0C0E] text-white border-[#0C0C0E] shadow-sm"
                          : "bg-white text-[#0C0C0E] border-[#D8D7D2] hover:border-[#0C0C0E]"
                      }`}
                    >
                      <span className="text-xl mb-1">{lang.flag}</span>
                      <span className="text-xs font-bold">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="font-bebas text-lg text-[#0C0C0E] block mb-2 uppercase tracking-wide">
                  DOCUMENTARY TOPIC / STORY PROMPT
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedLanguage === "hi" ? "e.g. क्यों OpenAI ने Sam Altman को निकाला?" : "e.g. How Apple Nearly Went Bankrupt in 1997"}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#F7F7F5] border-2 border-[#0C0C0E] text-[#0C0C0E] placeholder-[#888888] rounded-2xl px-5 py-4 text-base focus:outline-none focus:bg-white font-semibold shadow-inner"
                />
              </div>

              {/* Quick Topic Presets */}
              <div>
                <label className="text-[11px] font-utility font-bold text-[#666666] block mb-2 uppercase tracking-wider">
                  OR CLICK A SIGNATURE {selectedLanguage === "hi" ? "HINDI" : "DOCUMENTARY"} TOPIC PRESET:
                </label>
                <div className="flex flex-wrap gap-2">
                  {activePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTopic(preset)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all text-left cursor-pointer ${
                        topic === preset
                          ? "bg-[#0C0C0E] text-[#B4F500] border-[#0C0C0E]"
                          : "bg-[#F7F7F5] text-[#333333] border-[#D8D7D2] hover:border-[#0C0C0E]"
                      }`}
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice & Image Model Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Voice Selection */}
                <div className="bg-[#F7F7F5] p-5 rounded-2xl border-2 border-[#0C0C0E]">
                  <label className="font-bebas text-base text-[#0C0C0E] block mb-3 uppercase tracking-wide flex items-center justify-between">
                    <span>🎙️ Cartesia AI Voice</span>
                    <span className="text-[10px] font-utility font-bold text-[#666666]">SONIC 3 MULTILINGUAL</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    {CARTESIA_VOICES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVoiceId(v.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          selectedVoiceId === v.id
                            ? "bg-[#0C0C0E] text-white border-[#0C0C0E]"
                            : "bg-white text-[#0C0C0E] border-[#D8D7D2] hover:border-[#0C0C0E]"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold mb-0.5">
                          <span>{v.name}</span>
                          {selectedVoiceId === v.id && (
                            <span className="text-[10px] bg-[#B4F500] text-[#0C0C0E] px-1.5 py-0.2 rounded font-utility font-black">
                              SELECTED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] opacity-75 font-mono">{v.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Cutout Model Selection */}
                <div className="bg-[#F7F7F5] p-5 rounded-2xl border-2 border-[#0C0C0E] flex flex-col justify-between">
                  <div>
                    <label className="font-bebas text-base text-[#0C0C0E] block mb-3 uppercase tracking-wide flex items-center justify-between">
                      <span>🎨 AI Image Generator</span>
                      <span className="text-[10px] font-utility font-bold text-[#666666]">DOCUMENTARY STYLE</span>
                    </label>

                    <div className="flex flex-col gap-2">
                      {[
                        { id: "flux", name: "Flux.1 Schnell", desc: "Fastest 12-step documentary generator" },
                        { id: "flux-realism", name: "Flux Realism", desc: "Photorealistic archival documentary" },
                        { id: "turbo", name: "SDXL Turbo", desc: "Ultra fast preview generator" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setModel(m.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            model === m.id
                              ? "bg-[#0C0C0E] text-white border-[#0C0C0E]"
                              : "bg-white text-[#0C0C0E] border-[#D8D7D2] hover:border-[#0C0C0E]"
                          }`}
                        >
                          <div className="flex justify-between items-center text-xs font-bold mb-0.5">
                            <span>{m.name}</span>
                            {model === m.id && (
                              <span className="text-[10px] bg-[#FFE500] text-[#0C0C0E] px-1.5 py-0.2 rounded font-utility font-black">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] opacity-75 font-mono">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-[#FFE500] border-2 border-[#0C0C0E] rounded-xl text-[11px] font-mono font-bold text-[#0C0C0E]">
                    ✨ Prompts automatically append Vox archival film grain & documentary lighting modifiers!
                  </div>
                </div>

              </div>

              {/* Submit Launch Button */}
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-5 rounded-2xl font-bebas text-2xl tracking-wider uppercase bg-[#B4F500] hover:bg-[#a5e400] disabled:opacity-50 text-[#0C0C0E] border-2 border-[#0C0C0E] transition-all shadow-vox flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isGenerating ? (
                  <span>Dispatching Inngest Pipeline...</span>
                ) : (
                  <span>⚡ DISPATCH VOX VIDEO PIPELINE →</span>
                )}
              </button>
            </form>

            {/* Error Display */}
            {errorMessage && (
              <div className="mt-4 p-3.5 bg-red-50 border-2 border-red-600 rounded-xl text-xs font-mono font-bold text-red-700">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
