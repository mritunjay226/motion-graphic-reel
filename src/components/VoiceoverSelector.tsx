"use client";

import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Mic, Play, Pause, Check } from "lucide-react";
import type { VoiceDeliveryStyle } from "@/lib/gemini-tts";

interface VoiceoverSelectorProps {
  reelId?: Id<"reels"> | string;
  currentVoiceId?: string;
  currentVoiceStyle?: string;
  onVoiceChange?: (voiceId: string, style?: string) => void;
}

const FEATURED_VOICES: Array<{
  id: string;
  geminiName: string;
  label: string;
  role: string;
  tag: string;
  color: string;
  previewUrl: string;
  sampleText: string;
}> = [
  {
    id: "fenrir_gemini",
    geminiName: "Fenrir",
    label: "Fenrir",
    role: "Investigative Documentary",
    tag: "Recommended",
    color: "#0071E3",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549911/vox-reels/gemini_previews/fenrir_en.wav",
    sampleText: "In the year 2000, a small startup called Netflix walked into Blockbuster's headquarters with a bold offer.",
  },
  {
    id: "aoede_gemini",
    geminiName: "Aoede",
    label: "Aoede",
    role: "Cinematic Broadcast",
    tag: "Cinematic",
    color: "#8B5CF6",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549907/vox-reels/gemini_previews/aoede_en.wav",
    sampleText: "Welcome. This is Aoede, offering polished, sophisticated cinematic studio delivery.",
  },
  {
    id: "charon_gemini",
    geminiName: "Charon",
    label: "Charon",
    role: "Dramatic Baritone",
    tag: "High Stakes",
    color: "#EF4444",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549909/vox-reels/gemini_previews/charon_en.wav",
    sampleText: "This is Charon, a deep and authoritative baritone voice for investigative documentaries.",
  },
  {
    id: "puck_gemini",
    geminiName: "Puck",
    label: "Puck",
    role: "Modern Tech Explainer",
    tag: "High Energy",
    color: "#10B981",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549917/vox-reels/gemini_previews/puck_en.wav",
    sampleText: "Hello! This is Puck, an energetic and modern narrator voice crafted for fast-paced reels.",
  },
  {
    id: "fola_gemini",
    geminiName: "Fola",
    label: "Fola",
    role: "Warm Storyteller",
    tag: "Story",
    color: "#F59E0B",
    previewUrl: "https://res.cloudinary.com/diah8zonu/video/upload/v1790549912/vox-reels/gemini_previews/fola_en.wav",
    sampleText: "Hello, this is Fola, a warm, charismatic storyteller crafted for high-retention reels.",
  },
];

const DELIVERY_STYLES: Array<{ id: VoiceDeliveryStyle; label: string; desc: string }> = [
  { id: "investigative", label: "Investigative", desc: "Vox / Netflix serious documentary tone" },
  { id: "cinematic", label: "Cinematic", desc: "Sophisticated broadcast storytelling" },
  { id: "dramatic", label: "Dramatic", desc: "Heavy suspense & revelation impact" },
  { id: "energetic", label: "Fast Tech", desc: "Punchy rapid explainer cadence" },
];

export const VoiceoverSelector: React.FC<VoiceoverSelectorProps> = ({
  reelId,
  currentVoiceId = "fenrir_gemini",
  currentVoiceStyle = "investigative",
  onVoiceChange,
}) => {
  const updateReelVoice = useMutation(api.reels.updateReelVoice);

  const [selectedVoice, setSelectedVoice] = useState<string>(currentVoiceId);
  const [selectedStyle, setSelectedStyle] = useState<string>(currentVoiceStyle);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelectVoice = async (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (onVoiceChange) onVoiceChange(voiceId, selectedStyle);

    if (reelId) {
      try {
        setIsUpdating(true);
        await updateReelVoice({
          reelId: reelId as Id<"reels">,
          voiceId,
          voiceStyle: selectedStyle,
        });
      } catch (err) {
        console.error("Failed to update reel voice:", err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSelectStyle = async (style: VoiceDeliveryStyle) => {
    setSelectedStyle(style);
    if (onVoiceChange) onVoiceChange(selectedVoice, style);

    if (reelId) {
      try {
        setIsUpdating(true);
        await updateReelVoice({
          reelId: reelId as Id<"reels">,
          voiceId: selectedVoice,
          voiceStyle: style,
        });
      } catch (err) {
        console.error("Failed to update reel voice style:", err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const togglePreview = (voice: (typeof FEATURED_VOICES)[0]) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (playingVoiceId === voice.id) {
      setPlayingVoiceId(null);
      return;
    }

    const audioUrl = voice.previewUrl || `/api/tts?text=${encodeURIComponent(voice.sampleText)}&voiceId=${voice.id}&style=${selectedStyle}`;
    const audio = new Audio(audioUrl);
    audio.volume = 0.95;
    audioRef.current = audio;
    setPlayingVoiceId(voice.id);

    audio.play().catch((e) => {
      console.warn("Audio preview playback blocked:", e);
      setPlayingVoiceId(null);
    });

    audio.onended = () => setPlayingVoiceId(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-5 shadow-xs font-sans text-[#1D1D1F] space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center text-[#1D1D1F]">
            <Mic className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">
              Voiceover Narrator
            </h3>
            <p className="text-[11px] text-[#86868B]">
              Broadcast documentary presence & acting style
            </p>
          </div>
        </div>

        {isUpdating && (
          <span className="text-[11px] text-[#0071E3] font-medium animate-pulse">
            Saving...
          </span>
        )}
      </div>

      {/* Voice Delivery Style Selector */}
      <div>
        <span className="text-[11px] font-medium text-[#86868B] block mb-2">
          Vocal Delivery Style:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {DELIVERY_STYLES.map((st) => {
            const isSelected = selectedStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStyle(st.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0071E3] text-white border-[#0071E3] shadow-xs"
                    : "bg-neutral-50/70 border-black/[0.04] text-[#1D1D1F] hover:bg-white hover:border-black/[0.1]"
                }`}
              >
                <span className="text-xs font-semibold block leading-tight">
                  {st.label}
                </span>
                <span className={`text-[9px] block leading-tight truncate ${isSelected ? "text-white/80" : "text-[#86868B]"}`}>
                  {st.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Preset Cards */}
      <div>
        <span className="text-[11px] font-medium text-[#86868B] block mb-2">
          Narrator Voice:
        </span>
        <div className="space-y-2">
          {FEATURED_VOICES.map((voice) => {
            const isSelected = selectedVoice === voice.id || selectedVoice === voice.geminiName;
            const isPlaying = playingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => handleSelectVoice(voice.id)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${
                  isSelected
                    ? "bg-white border-[#0071E3] ring-2 ring-[#0071E3]/20 shadow-xs"
                    : "bg-neutral-50/70 border-black/[0.04] hover:border-black/[0.1] hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Audition Play Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePreview(voice);
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isPlaying
                        ? "bg-[#0071E3] text-white scale-105 shadow-xs"
                        : "bg-black/[0.06] text-[#1D1D1F] hover:bg-black/[0.12] hover:scale-105"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#1D1D1F]">
                        {voice.label}
                      </span>
                      <span
                        className="text-[9px] font-medium px-1.5 py-0.2 rounded-full border border-black/[0.06]"
                        style={{
                          backgroundColor: `${voice.color}15`,
                          color: voice.color,
                        }}
                      >
                        {voice.tag}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#86868B] block">
                      {voice.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0071E3] flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
