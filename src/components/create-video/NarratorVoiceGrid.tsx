import React from "react";
import { Mic, Play, Square, Check } from "lucide-react";
import { VoiceOption, CARTESIA_VOICES } from "./constants";

interface NarratorVoiceGridProps {
  displayedVoices: VoiceOption[];
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  playingVoiceId: string | null;
  onAuditionVoice: (voice: VoiceOption, e: React.MouseEvent) => void;
  voiceFilter: "matching" | "all";
  setVoiceFilter: (filter: "matching" | "all") => void;
  selectedLanguage: string;
}

export const NarratorVoiceGrid: React.FC<NarratorVoiceGridProps> = ({
  displayedVoices,
  selectedVoiceId,
  onSelectVoice,
  playingVoiceId,
  onAuditionVoice,
  voiceFilter,
  setVoiceFilter,
  selectedLanguage,
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Header and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl tracking-wide uppercase text-[#111111] leading-none">
            Documentary Narrator Voice
          </h3>
          <p className="text-[10px] text-[#555555] font-mono font-bold uppercase tracking-wider mt-0.5">
            Ultra-realistic broadcast narration calibrated for 2.5D reels
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="inline-flex items-center bg-white p-1 rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] gap-1 select-none">
          <button
            type="button"
            onClick={() => setVoiceFilter("matching")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wide transition-all cursor-pointer ${
              voiceFilter === "matching"
                ? "bg-[#111111] text-[#FFE600] shadow-[1px_1px_0px_#111111] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
            }`}
          >
            {selectedLanguage === "hi" ? "Hindi (Hinglish)" : "English Cast"}
          </button>
          <button
            type="button"
            onClick={() => setVoiceFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wide transition-all cursor-pointer ${
              voiceFilter === "all"
                ? "bg-[#111111] text-[#FFE600] shadow-[1px_1px_0px_#111111] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
            }`}
          >
            All Voices ({CARTESIA_VOICES.length})
          </button>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {displayedVoices.map((v: VoiceOption) => {
          const isSelected = selectedVoiceId === v.id;
          const isPlaying = playingVoiceId === v.id;

          return (
            <div
              key={v.id}
              onClick={() => onSelectVoice(v.id)}
              className={`p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between relative group select-none ${
                isSelected
                  ? "bg-[#FFFDF7] border-3 border-[#111111] shadow-[5px_5px_0px_#FFE600] ring-2 ring-[#111111] -translate-y-1"
                  : "bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#FFE600] hover:-translate-y-1"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div>
                    <span className="font-bebas text-xl text-[#111111] block leading-tight tracking-wide">
                      {v.name}
                    </span>
                    <span className="text-[10px] text-[#555555] font-mono font-bold uppercase tracking-wider block mt-0.5">
                      {v.accent}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border border-[#111111] shadow-xs ${
                      v.lang === "hi"
                        ? "bg-[#FFE600] text-[#111111]"
                        : "bg-[#B5F500] text-[#111111]"
                    }`}
                  >
                    {v.lang === "hi" ? "Hindi" : "English"}
                  </span>
                </div>

                <p className="text-xs text-[#555555] font-medium line-clamp-2 leading-relaxed mb-3">
                  {v.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t-2 border-[#111111]/10">
                <span
                  className={`text-xs font-mono font-black uppercase flex items-center gap-1 ${
                    isSelected ? "text-[#111111]" : "text-[#777777] group-hover:text-[#111111]"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>SELECTED</span>
                    </>
                  ) : (
                    "SELECT"
                  )}
                </span>

                <button
                  type="button"
                  onClick={(e) => onAuditionVoice(v, e)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer border-2 border-[#111111] ${
                    isPlaying
                      ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111] animate-pulse"
                      : "bg-white hover:bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111] active:translate-y-0.5"
                  }`}
                  title="Audition voice preview"
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>STOP</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>AUDITION</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
