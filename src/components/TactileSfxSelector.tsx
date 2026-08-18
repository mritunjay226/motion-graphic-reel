"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Play, Check, Sliders, Layers } from "lucide-react";
import { SFX_CATALOG, type SfxSoundId } from "@/remotion/utils/sfxRegistry";

interface TactileSfxSelectorProps {
  sfxVolume: number;
  enableSfx: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleEnable: (enabled: boolean) => void;
}

const FEATURED_SFX_DEMOS: { id: SfxSoundId; label: string; tag: string; color: string }[] = [
  { id: "paper_rip", label: "Paper Tear Rip", tag: "TRANSITION", color: "bg-[#FFE600] text-[#111111]" },
  { id: "rubber_stamp", label: "Rubber Stamp Slam", tag: "SEAL BADGE", color: "bg-[#FF3366] text-white" },
  { id: "camera_shutter", label: "Polaroid Shutter Snap", tag: "PHOTO SNAP", color: "bg-[#00F0FF] text-[#111111]" },
  { id: "marker_highlighter", label: "Yellow Highlighter", tag: "HEADLINE", color: "bg-[#B5F500] text-[#111111]" },
  { id: "cash_register", label: "Cash Register Ding", tag: "STAT PEAK", color: "bg-[#10B981] text-white" },
  { id: "typewriter_key", label: "Typewriter Keystroke", tag: "MEMO/DOC", color: "bg-[#8B5CF6] text-white" },
  { id: "cinematic_sub_boom", label: "Cinematic Sub Boom", tag: "HOOK/DROP", color: "bg-[#111111] text-[#FFE600]" },
  { id: "bell_ding", label: "Milestone Bell Ding", tag: "CHECKLIST", color: "bg-[#F59E0B] text-white" },
];

/**
 * Interactive Tactile SFX Studio Card for auditioning and calibrating physical sound effects.
 */
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
    <div className="bg-white border-4 border-[#111111] rounded-3xl p-6 shadow-[10px_10px_0px_#111111] relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#E2E2E8] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bebas tracking-wider text-[#111111] bg-[#B5F500] px-3 py-1 rounded-md border border-[#111111] uppercase flex items-center gap-1.5 font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>2.5D TACTILE FOLEY ENGINE</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            39 SOUNDS LOADED
          </span>
        </div>

        {/* Master SFX Enable Toggle */}
        <button
          type="button"
          onClick={() => onToggleEnable(!enableSfx)}
          className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border-2 border-[#111111] transition-all cursor-pointer shadow-xs active:translate-y-0.5 flex items-center gap-1.5 ${
            enableSfx ? "bg-[#111111] text-[#FFE600]" : "bg-red-100 text-red-700"
          }`}
        >
          {enableSfx ? (
            <>
              <Volume2 className="w-3 h-3" />
              <span>FOLEY ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3" />
              <span>FOLEY MUTED</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-[#555555] font-medium leading-relaxed mb-4">
        Every graphic element (rubber stamps, paper rips, camera clicks, marker strokes) is frame-locked to authentic physical sound effects.
      </p>

      {/* SFX Volume Calibration Slider */}
      <div className="bg-[#F8F8FA] border-2 border-[#111111] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            FOLEY MASTER MIX VOLUME
          </span>
          <span className="text-xs font-mono font-bold bg-[#FFE600] text-[#111111] px-2 py-0.5 rounded border border-[#111111]">
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
          className="w-full accent-[#111111] cursor-pointer h-2 bg-[#E2E2E8] rounded-lg disabled:opacity-40"
        />
        <div className="flex justify-between text-[9px] font-mono text-[#777777] mt-1 font-bold">
          <span>Subtle (-18dB)</span>
          <span>Broadcast Default (100%)</span>
          <span>Punchy Viral (+3dB)</span>
        </div>
      </div>

      {/* Interactive Sound Audition Grid */}
      <div>
        <span className="text-[10px] font-mono font-black uppercase text-[#666666] block mb-2">
          AUDITION TACTILE SOUND SAMPLES:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEATURED_SFX_DEMOS.map((demo) => {
            const isPlaying = playingId === demo.id;

            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => playSfxPreview(demo.id)}
                className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isPlaying
                    ? "bg-[#FFFEEB] border-[#111111] shadow-[2px_2px_0px_#111111] scale-[0.98]"
                    : "bg-[#F9F9FB] border-[#E2E2E8] hover:border-[#111111] hover:bg-white hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#111111] ${demo.color}`}>
                    {demo.tag}
                  </span>
                  <div className={`w-5 h-5 rounded-full border border-[#111111] flex items-center justify-center transition-all ${
                    isPlaying ? "bg-[#B5F500] animate-pulse" : "bg-white group-hover:bg-[#FFE600]"
                  }`}>
                    {isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-[#111111] animate-ping" />
                    ) : (
                      <Play className="w-2.5 h-2.5 fill-current text-[#111111] ml-0.5" />
                    )}
                  </div>
                </div>
                <span className="font-bebas text-sm text-[#111111] leading-tight block">
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
