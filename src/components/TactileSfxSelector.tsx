"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Play, Sliders } from "lucide-react";
import { SFX_CATALOG, type SfxSoundId } from "@/remotion/utils/sfxRegistry";

interface TactileSfxSelectorProps {
  sfxVolume: number;
  enableSfx: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleEnable: (enabled: boolean) => void;
}

const FEATURED_SFX_DEMOS: { id: SfxSoundId; label: string; tag: string }[] = [
  { id: "cinematic_whoosh", label: "3D Crane Swoop", tag: "Flight" },
  { id: "paper_slide", label: "Document Lift", tag: "Flight" },
  { id: "paper_tape", label: "Evidence Pin", tag: "Anchor" },
  { id: "marker_highlighter", label: "Highlighter Sweep", tag: "Headline" },
  { id: "rubber_stamp", label: "Forensic Stamp", tag: "Badge" },
  { id: "camera_shutter", label: "Polaroid Shutter", tag: "Photo" },
  { id: "cinematic_sub_boom", label: "Sub-Bass Drop", tag: "Impact" },
  { id: "tape_rewind", label: "Loop Rewind", tag: "Loop" },
  { id: "cash_register", label: "Cash Register", tag: "Milestone" },
  { id: "coin_clink", label: "Coin Clink", tag: "Finance" },
  { id: "mechanical_click", label: "Vault Lock", tag: "Metaphor" },
  { id: "bubble_pop", label: "Funnel Bubble", tag: "Metaphor" },
];

export const TactileSfxSelector: React.FC<TactileSfxSelectorProps> = ({
  sfxVolume,
  enableSfx,
  onVolumeChange,
  onToggleEnable,
}) => {
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playSfxPreview = (soundId: SfxSoundId) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const item = SFX_CATALOG[soundId];
    if (!item) return;

    const audio = new Audio(`/sfx/${item.fileName}`);
    audio.volume = Math.min(1.0, item.defaultVolume * 2.0);
    audioRef.current = audio;
    setPlayingId(soundId);

    audio.play().catch((e) => console.warn("Audio preview blocked:", e));
    audio.onended = () => setPlayingId(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-5 shadow-xs font-sans text-[#1D1D1F]">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-black/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center text-[#1D1D1F]">
            <Sparkles className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">
              Tactile Sound Effects
            </h3>
            <p className="text-[11px] text-[#86868B]">
              Foley frame synchronization
            </p>
          </div>
        </div>

        {/* Master SFX Enable Toggle */}
        <button
          type="button"
          onClick={() => onToggleEnable(!enableSfx)}
          className={`text-xs font-medium px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
            enableSfx
              ? "bg-[#0071E3] text-white shadow-xs"
              : "bg-black/[0.05] text-[#86868B] hover:text-[#1D1D1F]"
          }`}
        >
          {enableSfx ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Enabled</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-[#86868B] font-normal leading-relaxed mb-4">
        Sound effects are synchronized to keyframe moments: paper rips, rubber stamps, polaroid snaps, and highlighter marker sweeps.
      </p>

      {/* SFX Volume Slider */}
      <div className="bg-neutral-50/70 border border-black/[0.04] rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-[#86868B]" />
            Master volume
          </span>
          <span className="text-[11px] font-mono text-[#1D1D1F]">
            {Math.round(sfxVolume * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1.5"
          step="0.05"
          value={sfxVolume}
          disabled={!enableSfx}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-[#0071E3] cursor-pointer h-1.5 bg-black/[0.08] rounded-full disabled:opacity-40"
        />
      </div>

      {/* Broadcast Mix Hierarchy Visualizer */}
      <div className="bg-black/[0.02] border border-black/[0.04] rounded-xl p-3 mb-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#1D1D1F]">
          <span>Broadcast Mix Hierarchy</span>
          <span className="text-[10px] text-[#86868B] font-mono">Calibrated Headroom</span>
        </div>

        <div className="space-y-1.5 text-[10px]">
          {/* Dialogue Bus */}
          <div className="flex items-center justify-between">
            <span className="text-[#1D1D1F] font-medium w-24">Dialogue</span>
            <div className="flex-1 mx-2 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-[#0071E3] rounded-full w-[95%]" />
            </div>
            <span className="font-mono text-[#0071E3] font-semibold w-12 text-right">0 dB</span>
          </div>

          {/* Ducked Music Bus */}
          <div className="flex items-center justify-between">
            <span className="text-[#86868B] font-medium w-24">Ducked Music</span>
            <div className="flex-1 mx-2 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[42%]" />
            </div>
            <span className="font-mono text-emerald-600 font-semibold w-12 text-right">-22 dB</span>
          </div>

          {/* Inter-Scene Flight Swell Bus */}
          <div className="flex items-center justify-between">
            <span className="text-[#86868B] font-medium w-24">Flight Swell</span>
            <div className="flex-1 mx-2 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[65%]" />
            </div>
            <span className="font-mono text-emerald-600 font-semibold w-12 text-right">-14 dB</span>
          </div>

          {/* Tactile Foley Bus */}
          <div className="flex items-center justify-between">
            <span className="text-[#86868B] font-medium w-24">Tactile Foley</span>
            <div className="flex-1 mx-2 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min(100, Math.round(sfxVolume * 55))}%` }}
              />
            </div>
            <span className="font-mono text-amber-600 font-semibold w-12 text-right">-16 dB</span>
          </div>
        </div>
      </div>

      {/* Interactive Sound Audition Grid */}
      <div>
        <span className="text-[11px] font-medium text-[#86868B] block mb-2">
          Sound samples:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEATURED_SFX_DEMOS.map((demo) => {
            const isPlaying = playingId === demo.id;

            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => playSfxPreview(demo.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isPlaying
                    ? "bg-white border-[#0071E3] ring-2 ring-[#0071E3]/20 shadow-xs"
                    : "bg-neutral-50/70 border-black/[0.04] hover:border-black/[0.1] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-black/[0.05] text-[#86868B]">
                    {demo.tag}
                  </span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isPlaying ? "bg-[#0071E3] text-white animate-pulse" : "bg-black/[0.06] text-[#1D1D1F]"
                  }`}>
                    <Play className="w-2 h-2 fill-current ml-0.2" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#1D1D1F] leading-snug block">
                  {demo.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
