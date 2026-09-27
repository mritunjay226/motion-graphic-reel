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

export type { VoiceOption };

function CreateVideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi");
  const [topic, setTopic] = useState<string>("");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("brian_hindi");
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
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#0071E3]/20 selection:text-[#0071E3] overflow-x-hidden">
      {/* Hidden Audio Element for Voice Auditioning */}
      <audio ref={audioRef} className="hidden" />

      {/* Navigation Header */}
      <StudioNavbar />

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col justify-center">
        {activeReelId ? (
          /* Workstation Progress View */
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
              className="px-5 py-2 rounded-full bg-white border border-black/[0.08] shadow-xs text-xs font-medium text-[#1D1D1F] hover:bg-black/[0.03] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to prompt</span>
            </button>
          </div>
        ) : (
          /* Clean Apple Creation Card */
          <div className="apple-card rounded-[32px] p-6 sm:p-10 relative">
            {/* Top Eyebrow & Language Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                New Motion Reel
              </span>

              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] leading-tight mb-2">
                What story will you tell?
              </h1>
              <p className="text-sm text-[#86868B] font-normal leading-relaxed max-w-xl">
                Enter any documentary topic or case study. We'll write the script, record the voiceover, sync captions, and animate the visual scenes.
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
                className="w-full py-4 rounded-full text-base font-semibold bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 text-white shadow-[0_4px_16px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_22px_rgba(0,113,227,0.4)] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating video...</span>
                  </>
                ) : (
                  <>
                    <span>Generate video</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
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
        <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col items-center justify-center text-sm font-medium">
          Loading Studio...
        </div>
      }
    >
      <CreateVideoContent />
    </Suspense>
  );
}
