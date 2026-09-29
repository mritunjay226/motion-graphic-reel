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
    <div className="flex flex-col gap-3.5">
      {/* Vox Editorial Prompt Input Bar */}
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
          className="w-full bg-[#FFFDF7] border-3 border-[#111111] text-[#111111] placeholder-[#888888] rounded-2xl px-5 py-4 text-base sm:text-lg font-bold shadow-[4px_4px_0px_#111111] focus:outline-none focus:shadow-[6px_6px_0px_#FFE600] transition-all pr-32 sm:pr-36"
        />

        {/* Surprise Dice Roll Button */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={onInstantRandomRoll}
            className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd900] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
            title="Roll an editorial documentary topic"
          >
            <Dices className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden sm:inline">Surprise</span>
          </button>
        </div>
      </div>

      {/* Sub-Bar Actions: AI Suggest + Narrator Audition + Image Engine */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Suggest Pill */}
          <button
            type="button"
            disabled={isSuggestingAi}
            onClick={onSuggestTopicAi}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#111111] hover:bg-[#222222] disabled:opacity-50 text-[#B5F500] border-2 border-[#111111] shadow-[2px_2px_0px_#FFE600] transition-all cursor-pointer active:translate-y-0.5"
          >
            {isSuggestingAi ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isSuggestingAi ? "Scripting..." : "AI Suggest"}</span>
          </button>

          {/* Active Voice Pill with Audio Preview */}
          <div className="inline-flex items-center gap-2 bg-[#FFFDF7] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] px-3 py-1 rounded-xl text-xs text-[#111111]">
            <Volume2 className="w-3.5 h-3.5 text-[#555555]" />
            <span className="font-bold truncate max-w-[130px]">
              {currentVoiceObj.name}
            </span>
            <button
              type="button"
              onClick={(e) => onAuditionVoice(currentVoiceObj, e)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase transition-all flex items-center gap-1 cursor-pointer border ${
                playingVoiceId === currentVoiceObj.id
                  ? "bg-[#FFE600] text-[#111111] border-[#111111] animate-pulse"
                  : "bg-white hover:bg-[#FFE600] text-[#111111] border-[#111111]"
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

        {/* Custom Image Engine Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#333333] hover:text-[#111111] bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Hide Engine</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Visual Engine</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
