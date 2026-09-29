"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { StudioNavbar } from "@/components/StudioNavbar";
import { ReelGenerationProgress } from "@/components/ReelGenerationProgress";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

import {
  CARTESIA_VOICES,
  LANGUAGES,
  CATEGORIZED_TRENDING_TOPICS,
  VoiceOption,
  TopicCategoryKey,
} from "@/components/create-video/constants";
import { LanguageSelector } from "@/components/create-video/LanguageSelector";
import { TopicPromptBar } from "@/components/create-video/TopicPromptBar";
import { TrendingTopicChips } from "@/components/create-video/TrendingTopicChips";
import { NarratorVoiceGrid } from "@/components/create-video/NarratorVoiceGrid";
import { AdvancedImageSettings } from "@/components/create-video/AdvancedImageSettings";

import FilmTreatment from "@/components/landing/FilmTreatment";
import { Zap, Sparkles } from "lucide-react";

export type { VoiceOption };

function CreateVideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi");
  const [topic, setTopic] = useState<string>("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("fola_hindi");
  const [voiceFilter, setVoiceFilter] = useState<"matching" | "all">("matching");
  const [activeCategory, setActiveCategory] = useState<TopicCategoryKey>("viral");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [model, setModel] = useState<string>("flux");

  const displayedVoices = useMemo<VoiceOption[]>(() => {
    if (voiceFilter === "all") return CARTESIA_VOICES;
    const isHi = selectedLanguage === "hi";
    return CARTESIA_VOICES.filter((v: VoiceOption) => isHi ? v.lang === "hi" : v.lang === "en");
  }, [selectedLanguage, voiceFilter]);

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
  const handleAuditionVoice = async (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingVoiceId === voice.id && audioRef.current) {
      audioRef.current.pause();
      setPlayingVoiceId(null);
      return;
    }

    if (voice.previewUrl) {
      setPlayingVoiceId(voice.id);
      if (audioRef.current) {
        audioRef.current.src = voice.previewUrl;
        audioRef.current.play().catch(() => setPlayingVoiceId(null));
        audioRef.current.onended = () => setPlayingVoiceId(null);
      }
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

  // AI Live Topic Generation
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
        setErrorMessage(data.error || "Failed to start video generation.");
        setIsGenerating(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to start video generation.");
      setIsGenerating(false);
    }
  };

  const currentVoiceObj = CARTESIA_VOICES.find((v) => v.id === selectedVoiceId) || CARTESIA_VOICES[0];

  return (
    <main className="min-h-screen bg-[#F4F4F6] text-[#111111] flex flex-col font-sans selection:bg-[#FFE600] selection:text-black overflow-x-hidden relative">
      {/* Reusable Vox Film Treatment Overlay */}
      <FilmTreatment grainOpacity={0.12} scanlines={true} vignette={false} />

      {/* Broadcast Studio Viewfinder HUD View */}
      <div className="absolute top-20 left-6 pointer-events-none z-20 opacity-70 hidden sm:block">
        <svg className="w-12 h-12 stroke-[#111111]" fill="none" viewBox="0 0 48 48">
          <path d="M 4 20 L 4 4 L 20 4" strokeWidth="3" strokeLinecap="square" />
        </svg>
        <div className="text-[9px] font-mono text-[#111111] font-black tracking-widest mt-0.5">
          REC [30FPS]
        </div>
      </div>
      <div className="absolute top-20 right-6 pointer-events-none z-20 opacity-70 hidden sm:block text-right">
        <svg className="w-12 h-12 stroke-[#111111] ml-auto" fill="none" viewBox="0 0 48 48">
          <path d="M 28 4 L 44 4 L 44 20" strokeWidth="3" strokeLinecap="square" />
        </svg>
        <div className="text-[9px] font-mono text-[#111111] font-black tracking-widest mt-0.5">
          1080x1920 9:16
        </div>
      </div>

      {/* Hidden Audio Element for Voice Auditioning */}
      <audio ref={audioRef} className="hidden" />

      {/* Vox Navigation Header */}
      <StudioNavbar />

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center relative z-20">
        {activeReelId ? (
          /* Workstation Progress View */
          <div className="flex flex-col gap-5 animate-in fade-in duration-300 w-full items-center">
            <div className="w-full bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-3xl p-6 sm:p-8">
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
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveReelId(null);
                setIsGenerating(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-[#FFE600] text-xs font-mono font-black uppercase tracking-wider text-[#111111] transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back to Prompt Console</span>
            </button>
          </div>
        ) : (
          /* Vox Studio Documentary Console Card */
          <div className="bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            {/* Top Eyebrow & Language Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[#111111]/15">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                  ● 2.5D MOTION CONSOLE
                </span>
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-[#555555] uppercase tracking-wider">
                  DISPATCH #01 • 30 FPS RIG
                </span>
              </div>

              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Headline */}
            <div className="mb-7">
              <h1 className="font-bebas text-4xl sm:text-6xl uppercase tracking-wide text-[#111111] leading-[0.95] mb-2.5">
                What Story Will You Animate?
              </h1>
              <p className="text-xs sm:text-sm text-[#555555] font-medium leading-relaxed max-w-2xl">
                Enter any documentary topic or investigative question. We'll research the facts, script a high-retention 6-scene story arc, record broadcast narration, and animate multi-plane cutouts.
              </p>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleCreateVideo} className="flex flex-col gap-6">
              {/* 1. Prompt Bar */}
              <TopicPromptBar
                topic={topic}
                setTopic={setTopic}
                selectedLanguage={selectedLanguage}
                isSuggestingAi={isSuggestingAi}
                onInstantRandomRoll={handleInstantRandomRoll}
                onSuggestTopicAi={handleSuggestTopicAi}
                currentVoiceObj={currentVoiceObj}
                playingVoiceId={playingVoiceId}
                onAuditionVoice={handleAuditionVoice}
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
              />

              {/* 2. Trending Topic Chips */}
              <TrendingTopicChips
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                selectedLanguage={selectedLanguage}
                topic={topic}
                onSelectTopic={setTopic}
              />

              {/* 3. Narrator Voice Grid */}
              <div className="flex flex-col gap-3">
                <NarratorVoiceGrid
                  displayedVoices={displayedVoices}
                  selectedVoiceId={selectedVoiceId}
                  onSelectVoice={setSelectedVoiceId}
                  playingVoiceId={playingVoiceId}
                  onAuditionVoice={handleAuditionVoice}
                  voiceFilter={voiceFilter}
                  setVoiceFilter={setVoiceFilter}
                  selectedLanguage={selectedLanguage}
                />

                {/* Optional Image Engine Drawer */}
                <AdvancedImageSettings
                  showAdvanced={showAdvanced}
                  setShowAdvanced={setShowAdvanced}
                  model={model}
                  setModel={setModel}
                />
              </div>

              {/* 4. Primary Launch Button */}
              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-4.5 rounded-2xl text-base sm:text-lg font-mono font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd900] disabled:opacity-40 text-[#111111] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[2px_2px_0px_#111111] transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
              >
                {isGenerating ? (
                  <>
                    <span className="w-5 h-5 border-3 border-[#111111] border-t-transparent rounded-full animate-spin" />
                    <span>Directing Reel & Animating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current text-[#111111]" />
                    <span>Launch 2.5D Motion Reel</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-5 p-4 bg-red-50 border-2 border-red-600 rounded-xl text-xs font-mono font-bold text-red-700 flex items-center gap-2.5 shadow-[3px_3px_0px_#EF4444]">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 stroke-[2.5]" />
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
        <div className="min-h-screen bg-[#F4F4F6] text-[#111111] flex flex-col items-center justify-center text-sm font-mono font-black uppercase">
          Loading Studio Console...
        </div>
      }
    >
      <CreateVideoContent />
    </Suspense>
  );
}
