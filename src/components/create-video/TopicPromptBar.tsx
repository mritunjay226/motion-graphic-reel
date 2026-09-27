import React from "react";
import { Dices, Sparkles, Loader2, Volume2, Play, Square, ChevronDown, ChevronUp } from "lucide-react";
import { VoiceOption } from "./constants";

interface TopicPromptBarProps {
  topic: string;
  setTopic: (val: string) => void;
  selectedLanguage: string;
  isSuggestingAi: boolean;
  onInstantRandomRoll: () => void;
  onSuggestTopicAi: () => void;
  currentVoiceObj: VoiceOption;
  playingVoiceId: string | null;
  onAuditionVoice: (voice: VoiceOption, e: React.MouseEvent) => void;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TopicPromptBar: React.FC<TopicPromptBarProps> = ({
  topic,
  setTopic,
  selectedLanguage,
  isSuggestingAi,
  onInstantRandomRoll,
  onSuggestTopicAi,
  currentVoiceObj,
  playingVoiceId,
  onAuditionVoice,
  showAdvanced,
  setShowAdvanced,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Spotlight-Style Input Container */}
      <div className="relative group">
        <input
          type="text"
          required
          autoFocus
          placeholder={
            selectedLanguage === "hi"
              ? "e.g. क्यों OpenAI ने Sam Altman को निकाला?"
              : "e.g. The Story Behind Pixar's Secret Founding"
          }
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-white border border-black/[0.08] text-[#1D1D1F] placeholder-[#86868B]/60 rounded-2xl px-5 py-4 text-base sm:text-lg font-medium focus:outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all pr-28 sm:pr-32"
        />

        {/* Surprise Button */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={onInstantRandomRoll}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Roll an editorial topic"
          >
            <Dices className="w-3.5 h-3.5 text-[#86868B]" />
            <span className="hidden sm:inline">Surprise</span>
          </button>
        </div>
      </div>

      {/* Sub-Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          {/* AI Suggest Pill */}
          <button
            type="button"
            disabled={isSuggestingAi}
            onClick={onSuggestTopicAi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0071E3]/10 hover:bg-[#0071E3]/15 disabled:opacity-50 text-[#0071E3] transition-all cursor-pointer active:scale-95"
          >
            {isSuggestingAi ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isSuggestingAi ? "Generating..." : "Suggest idea"}</span>
          </button>

          {/* Active Voice Pill */}
          <div className="inline-flex items-center gap-2 bg-black/[0.03] border border-black/[0.04] px-3 py-1 rounded-full text-xs text-[#1D1D1F]">
            <Volume2 className="w-3.5 h-3.5 text-[#86868B]" />
            <span className="font-medium truncate max-w-[130px]">
              {currentVoiceObj.name}
            </span>
            <button
              type="button"
              onClick={(e) => onAuditionVoice(currentVoiceObj, e)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${playingVoiceId === currentVoiceObj.id
                  ? "bg-[#0071E3] text-white animate-pulse"
                  : "bg-white text-[#1D1D1F] shadow-xs hover:bg-neutral-100"
                }`}
            >
              {playingVoiceId === currentVoiceObj.id ? (
                <>
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Settings Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors flex items-center gap-1 cursor-pointer"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Hide settings</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Image options</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
