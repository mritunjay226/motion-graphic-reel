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
          <h3 className="text-sm font-semibold text-[#1D1D1F]">
            Voice Narrator
          </h3>
          <p className="text-xs text-[#86868B]">
            Studio-quality voiceover matched to your language.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="inline-flex items-center bg-black/[0.04] p-0.5 rounded-full border border-black/[0.03]">
          <button
            type="button"
            onClick={() => setVoiceFilter("matching")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${voiceFilter === "matching"
                ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            {selectedLanguage === "hi" ? "Hindi Voices" : "English Voices"}
          </button>
          <button
            type="button"
            onClick={() => setVoiceFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${voiceFilter === "all"
                ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            All ({CARTESIA_VOICES.length})
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
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group select-none ${isSelected
                  ? "bg-white border-[#0071E3] ring-2 ring-[#0071E3]/20 shadow-[0_4px_16px_rgba(0,113,227,0.12)]"
                  : "bg-white border-black/[0.07] hover:border-black/[0.15] hover:shadow-sm"
                }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <div>
                    <span className="font-semibold text-sm text-[#1D1D1F] block leading-tight">
                      {v.name}
                    </span>
                    <span className="text-[11px] text-[#86868B] font-medium mt-0.5 block">
                      {v.accent}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${v.lang === "hi"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                  >
                    {v.lang === "hi" ? "Hindi" : "English"}
                  </span>
                </div>

                <p className="text-xs text-[#86868B] line-clamp-2 leading-relaxed mb-3">
                  {v.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-black/[0.05]">
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${isSelected ? "text-[#0071E3]" : "text-[#86868B] group-hover:text-[#1D1D1F]"
                    }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </>
                  ) : (
                    "Select"
                  )}
                </span>

                <button
                  type="button"
                  onClick={(e) => onAuditionVoice(v, e)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${isPlaying
                      ? "bg-[#0071E3] text-white shadow-xs animate-pulse"
                      : "bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F]"
                    }`}
                  title="Audition voice preview"
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Sample</span>
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
