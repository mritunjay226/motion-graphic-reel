"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { StudioNavbar } from "@/components/StudioNavbar";
import { ReelGenerationProgress } from "@/components/ReelGenerationProgress";
import {
  Zap,
  Sparkles,
  Dices,
  Mic,
  Play,
  Square,
  Flame,
  Briefcase,
  Cpu,
  Palette,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Pin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface CartesiaVoice {
  id: string;
  name: string;
  lang: "hi" | "en" | "es" | "fr" | "de" | "all";
  desc: string;
  sampleText: string;
  accent: string;
}

const CARTESIA_VOICES: CartesiaVoice[] = [
  // Hindi Voices
  {
    id: "7e8cb11d-37af-476b-ab8f-25da99b18644",
    name: "Anuj",
    lang: "hi",
    accent: "Hindi Male",
    desc: "Energetic, high retention documentary narrator",
    sampleText: "नमस्ते! यह एक हाई-रिटेंशन 2.5D डॉक्यूमेंट्री वीडियो रील्स इंजन है।",
  },
  {
    id: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
    name: "Jacquelin",
    lang: "hi",
    accent: "Hindi Female",
    desc: "Smooth, engaging cinematic narrative voice",
    sampleText: "एक छोटे से फैसले ने कैसे पूरी कंपनी की तकदीर बदल दी?",
  },

  // English & Multi-lingual Voices
  {
    id: "62ae83ad-4f6a-430b-af41-a9bede9286ca",
    name: "Vox Dynamic Explainer",
    lang: "en",
    accent: "US Male",
    desc: "Fast-paced, high energy viral documentary voice",
    sampleText: "How did a small Silicon Valley startup take down a multi-billion dollar legacy giant?",
  },
  {
    id: "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1",
    name: "Clive",
    lang: "en",
    accent: "UK Male",
    desc: "Deep, suspenseful, cinematic tone for thrillers & mysteries",
    sampleText: "Behind closed doors, a secret deal was signed that almost caused a catastrophe.",
  },
  {
    id: "5ee9feff-1265-424a-9d7f-8e4d431a12c7",
    name: "Ronald",
    lang: "en",
    accent: "US Authority",
    desc: "Authoritative, deep high-stakes business narrator",
    sampleText: "In 1997, they had just 90 days of cash left before total liquidation.",
  },
  {
    id: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4",
    name: "Skylar",
    lang: "en",
    accent: "US Female",
    desc: "Energetic tech & modern innovation explainer",
    sampleText: "Why does the world depend on one single microchip factory in Taiwan?",
  },
];

const LANGUAGES = [
  { id: "hi", name: "Hindi (Hinglish)", flag: "🇮🇳", defaultVoice: "7e8cb11d-37af-476b-ab8f-25da99b18644" },
  { id: "en", name: "English", flag: "🇺🇸", defaultVoice: "62ae83ad-4f6a-430b-af41-a9bede9286ca" },
  { id: "es", name: "Spanish", flag: "🇪🇸", defaultVoice: "62ae83ad-4f6a-430b-af41-a9bede9286ca" },
  { id: "fr", name: "French", flag: "🇫🇷", defaultVoice: "62ae83ad-4f6a-430b-af41-a9bede9286ca" },
  { id: "de", name: "German", flag: "🇩🇪", defaultVoice: "62ae83ad-4f6a-430b-af41-a9bede9286ca" },
];

const CATEGORIZED_TRENDING_TOPICS = {
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

function CreateVideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi");
  const [topic, setTopic] = useState<string>("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("7e8cb11d-37af-476b-ab8f-25da99b18644");
  const [activeCategory, setActiveCategory] = useState<"viral" | "business" | "tech">("viral");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [model, setModel] = useState<string>("flux");

  // State for generation & progress
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuggestingAi, setIsSuggestingAi] = useState<boolean>(false);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio preview state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Language auto-switch matching voice
  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    const targetLang = LANGUAGES.find((l) => l.id === langId);
    if (targetLang) {
      setSelectedVoiceId(targetLang.defaultVoice);
    }
  };

  // Pre-fill topic from URL parameter
  useEffect(() => {
    const urlTopic = searchParams.get("topic");
    if (urlTopic) {
      setTopic(urlTopic);
    }
  }, [searchParams]);

  // Audio Preview Audition Handler
  const handleAuditionVoice = async (voice: CartesiaVoice, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingVoiceId === voice.id && audioRef.current) {
      audioRef.current.pause();
      setPlayingVoiceId(null);
      return;
    }

    try {
      setPlayingVoiceId(voice.id);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: voice.sampleText,
          voiceId: voice.id,
          language: voice.lang === "hi" ? "hi" : "en",
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setPlayingVoiceId(null);
        }
      } else {
        setPlayingVoiceId(null);
      }
    } catch {
      setPlayingVoiceId(null);
    }
  };

  // AI Live Topic Generation via Gemini 2.5
  const handleSuggestTopicAi = async () => {
    setIsSuggestingAi(true);
    try {
      const res = await fetch("/api/suggest-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLanguage }),
      });
      const data = await res.json();
      if (data.success && data.topic) {
        setTopic(data.topic);
      } else {
        handleInstantRandomRoll();
      }
    } catch {
      handleInstantRandomRoll();
    } finally {
      setIsSuggestingAi(false);
    }
  };

  // Instant Random Roll
  const handleInstantRandomRoll = () => {
    const isHi = selectedLanguage === "hi";
    const allTopics = [
      ...(isHi ? CATEGORIZED_TRENDING_TOPICS.viral.topicsHi : CATEGORIZED_TRENDING_TOPICS.viral.topicsEn),
      ...(isHi ? CATEGORIZED_TRENDING_TOPICS.business.topicsHi : CATEGORIZED_TRENDING_TOPICS.business.topicsEn),
      ...(isHi ? CATEGORIZED_TRENDING_TOPICS.tech.topicsHi : CATEGORIZED_TRENDING_TOPICS.tech.topicsEn),
    ];

    const available = allTopics.filter((t) => t !== topic);
    const randomChoice = available[Math.floor(Math.random() * available.length)] || allTopics[0];
    setTopic(randomChoice);
  };

  // Submit Video Generation
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

  const currentCategoryData = CATEGORIZED_TRENDING_TOPICS[activeCategory];
  const activeChips = selectedLanguage === "hi" ? currentCategoryData.topicsHi : currentCategoryData.topicsEn;
  const currentVoiceObj = CARTESIA_VOICES.find((v) => v.id === selectedVoiceId) || CARTESIA_VOICES[0];

  return (
    <main className="min-h-screen bg-[#F4F4F6] text-[#111111] flex flex-col font-sans selection:bg-[#FFE600] selection:text-black vox-paper-texture overflow-x-hidden">
      {/* Hidden Audio Element for Voice Auditioning */}
      <audio ref={audioRef} className="hidden" />

      {/* Global Studio Navigation Header */}
      <StudioNavbar />

      {/* Main Studio Fast-Lane Center */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
        {activeReelId ? (
          /* Live Transparent AI Production Crew Workstation */
          <div className="flex flex-col gap-5 animate-in fade-in duration-300 w-full items-center">
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
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-xs font-bold text-[#111111] hover:bg-[#FFE600] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel & Back to Prompt Workstation</span>
            </button>
          </div>
        ) : (
          /* ⚡ THE FAST-LANE CREATION WORKSTATION */
          <div className="bg-white border-4 border-[#0C0C0E] rounded-3xl p-6 sm:p-10 shadow-vox relative overflow-hidden">
            
            {/* Top Badge & Tagline */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-[#FFE600] text-[#0C0C0E] font-bebas text-xs px-3 py-1 font-bold uppercase tracking-widest rounded border border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>FAST-LANE 2.5D REEL ENGINE</span>
                </span>
                <span className="text-[11px] font-utility font-bold text-[#666666] hidden sm:inline">
                  • 60s Generation to Multi-Platform Publish
                </span>
              </div>

              {/* Language Pills (Instant 1-Tap Switch) */}
              <div className="flex items-center gap-1 bg-[#F2F1EC] p-1 rounded-xl border-2 border-[#0C0C0E]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedLanguage === lang.id
                        ? "bg-[#0C0C0E] text-[#B4F500] shadow-xs"
                        : "text-[#555555] hover:text-[#0C0C0E] hover:bg-white"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-utility uppercase text-[11px]">{lang.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-bebas text-4xl sm:text-6xl text-[#0C0C0E] uppercase leading-none tracking-tight mb-2">
              WHAT STORY DO YOU WANT TO CREATE?
            </h1>
            <p className="text-sm text-[#555555] font-medium leading-relaxed max-w-2xl mb-8">
              Enter any documentary topic or business scandal. Our automated pipeline writes the script, records voiceover, syncs captions, cuts out 2.5D stickers, and prepares 1-click publishing.
            </p>

            {/* Creation Form */}
            <form onSubmit={handleCreateVideo} className="flex flex-col gap-6">
              
              {/* ── 1. SINGLE-INPUT POWERHOUSE PROMPT BAR ── */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder={
                      selectedLanguage === "hi"
                        ? "e.g. क्यों OpenAI ने Sam Altman को निकाला?"
                        : "e.g. How Apple Nearly Went Bankrupt in 1997"
                    }
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-[#F7F7F5] border-3 border-[#0C0C0E] text-[#0C0C0E] placeholder-[#888888] rounded-2xl px-6 py-5 text-base sm:text-lg focus:outline-none focus:bg-white focus:border-[#0C0C0E] font-bold shadow-inner transition-all pr-28 sm:pr-36"
                  />

                  {/* Inside Input Action: 🎲 Surprise Me Button */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleInstantRandomRoll}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#FFE600] text-[#0C0C0E] border-2 border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
                      title="Instant Roll from viral documentary database"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span className="font-utility font-black uppercase text-[10px] hidden sm:inline">Surprise</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Bar Actions: AI Brainstormer & Voice Preview Callout */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isSuggestingAi}
                      onClick={handleSuggestTopicAi}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFE500] hover:bg-[#ffe100] disabled:opacity-60 text-[#0C0C0E] border-2 border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer group active:scale-95"
                    >
                      {isSuggestingAi ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                      )}
                      <span className="font-utility font-black uppercase text-[10px]">
                        {isSuggestingAi ? "Thinking..." : "AI Brainstorm"}
                      </span>
                    </button>

                    {/* Active Voice Pill with Audio Audition */}
                    <div className="flex items-center gap-2 bg-[#F2F1EC] border-2 border-[#0C0C0E] px-3 py-1 rounded-xl">
                      <Mic className="w-3.5 h-3.5 text-[#0C0C0E]" />
                      <span className="font-utility font-bold text-xs text-[#0C0C0E]">
                        {currentVoiceObj.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAuditionVoice(currentVoiceObj, e)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase border border-[#0C0C0E] transition-all flex items-center gap-1 ${
                          playingVoiceId === currentVoiceObj.id
                            ? "bg-[#B4F500] text-[#0C0C0E] animate-pulse"
                            : "bg-white text-[#0C0C0E] hover:bg-[#FFE600]"
                        }`}
                      >
                        {playingVoiceId === currentVoiceObj.id ? (
                          <>
                            <Square className="w-2.5 h-2.5 fill-current" />
                            <span>STOP</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>SAMPLE</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs font-utility font-bold text-[#444444] hover:text-[#0C0C0E] underline flex items-center gap-1"
                  >
                    {showAdvanced ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide Custom Settings</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Fine-Tune Voice & Model</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ── 2. CATEGORIZED 1-CLICK VIRAL TOPIC CHIPS ── */}
              <div className="bg-[#F7F7F5] border-2 border-[#0C0C0E] rounded-2xl p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#D8D7D2]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 fill-[#0C0C0E] text-[#0C0C0E]" />
                    <span className="font-utility font-black text-xs uppercase tracking-wider text-[#0C0C0E]">
                      1-CLICK VIRAL IDEAS:
                    </span>
                  </div>

                  {/* Niche Category Switcher */}
                  <div className="flex items-center gap-1.5">
                    {(["viral", "business", "tech"] as const).map((cat) => {
                      const CatIcon = CATEGORIZED_TRENDING_TOPICS[cat].icon;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-utility font-black uppercase transition-all flex items-center gap-1 ${
                            activeCategory === cat
                              ? "bg-[#0C0C0E] text-[#FFE600]"
                              : "bg-white text-[#555555] border border-[#D8D7D2] hover:border-[#0C0C0E]"
                          }`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic Pill List */}
                <div className="flex flex-wrap gap-2">
                  {activeChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTopic(chip)}
                      className={`text-xs px-3.5 py-2 rounded-xl border-2 font-bold transition-all text-left cursor-pointer flex items-center gap-2 ${
                        topic === chip
                          ? "bg-[#0C0C0E] text-[#B4F500] border-[#0C0C0E] shadow-[2px_2px_0px_#B4F500]"
                          : "bg-white text-[#222222] border-[#D8D7D2] hover:border-[#0C0C0E] hover:bg-[#FAF9F5]"
                      }`}
                    >
                      <Pin className="w-3 h-3 text-[#0C0C0E]/70 shrink-0" />
                      <span>"{chip}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 3. COLLAPSIBLE ADVANCED SETTINGS (VOICE AUDITIONING & MODELS) ── */}
              {showAdvanced && (
                <div className="bg-[#FAF9F5] p-5 rounded-2xl border-2 border-dashed border-[#0C0C0E] flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8D7D2]">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-[#0C0C0E]" />
                      <span className="font-bebas text-lg text-[#0C0C0E] uppercase tracking-wide">
                        VOICE ACTOR AUDITIONS & IMAGE ENGINE
                      </span>
                    </div>
                    <span className="text-[10px] font-utility font-bold text-[#666666]">
                      CINEMA STUDIO VOICE ENGINE
                    </span>
                  </div>

                  {/* Voice Grid with Instant Play Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {CARTESIA_VOICES.map((v) => {
                      const isSelected = selectedVoiceId === v.id;
                      const isPlaying = playingVoiceId === v.id;

                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVoiceId(v.id)}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#0C0C0E] text-white border-[#0C0C0E] shadow-[3px_3px_0px_#B4F500]"
                              : "bg-white text-[#0C0C0E] border-[#D8D7D2] hover:border-[#0C0C0E]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-xs">{v.name}</span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                isSelected ? "bg-[#B4F500] text-[#0C0C0E]" : "bg-neutral-100 text-neutral-600"
                              }`}>
                                {v.accent}
                              </span>
                            </div>
                            <p className="text-[10px] opacity-75 font-mono line-clamp-2 mb-3">
                              {v.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-[9px] font-mono opacity-60">
                              {isSelected ? "✓ SELECTED" : "CLICK TO SET"}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleAuditionVoice(v, e)}
                              className={`px-2 py-1 rounded text-[9px] font-utility font-black uppercase transition-all flex items-center gap-1 ${
                                isPlaying
                                  ? "bg-[#B4F500] text-[#0C0C0E] animate-pulse"
                                  : isSelected
                                  ? "bg-[#FFE600] text-[#0C0C0E] hover:bg-white"
                                  : "bg-[#0C0C0E] text-[#FFE600] hover:bg-neutral-800"
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Square className="w-2.5 h-2.5 fill-current" />
                                  <span>STOP</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                  <span>PLAY</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Image Generation Engine */}
                  <div className="pt-3 border-t border-[#D8D7D2]">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Palette className="w-3.5 h-3.5 text-[#0C0C0E]" />
                      <label className="text-[11px] font-utility font-black text-[#0C0C0E] uppercase block">
                        Background AI Image Style:
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "flux", name: "Flux.1 Schnell", desc: "Fastest 12-step documentary generator" },
                        { id: "flux-realism", name: "Flux Realism", desc: "Photorealistic archival documentary" },
                        { id: "turbo", name: "SDXL Turbo", desc: "Ultra fast preview generator" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setModel(m.id)}
                          className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                            model === m.id
                              ? "bg-[#0C0C0E] text-[#FFE600] border-[#0C0C0E]"
                              : "bg-white text-[#0C0C0E] border-[#D8D7D2] hover:border-[#0C0C0E]"
                          }`}
                        >
                          <p className="text-xs font-bold">{m.name}</p>
                          <p className="text-[9px] opacity-75 font-mono">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. PRIMARY FAST-LANE LAUNCH BUTTON ── */}
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-5 rounded-2xl font-bebas text-2xl sm:text-3xl tracking-wider uppercase bg-[#B4F500] hover:bg-[#a5e400] disabled:opacity-50 text-[#0C0C0E] border-3 border-[#0C0C0E] transition-all shadow-vox hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-3 cursor-pointer active:scale-98 select-none"
              >
                {isGenerating ? (
                  <>
                    <span className="w-6 h-6 border-3 border-[#0C0C0E] border-t-transparent rounded-full animate-spin" />
                    <span>DISPATCHING 2.5D REEL PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 fill-current" />
                    <span>DISPATCH 2.5D REEL ENGINE (30s)</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-600 rounded-xl text-xs font-mono font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CreateVideoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2F1EC] text-[#0C0C0E] flex flex-col items-center justify-center font-bebas text-2xl tracking-wider">
          Loading Fast-Lane Studio...
        </div>
      }
    >
      <CreateVideoContent />
    </Suspense>
  );
}
