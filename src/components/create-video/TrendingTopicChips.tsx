import React from "react";
import { CATEGORIZED_TRENDING_TOPICS, TopicCategoryKey } from "./constants";
import { Sparkles } from "lucide-react";

interface TrendingTopicChipsProps {
  activeCategory: TopicCategoryKey;
  setActiveCategory: (cat: TopicCategoryKey) => void;
  selectedLanguage: string;
  topic: string;
  onSelectTopic: (topic: string) => void;
}

export const TrendingTopicChips: React.FC<TrendingTopicChipsProps> = ({
  activeCategory,
  setActiveCategory,
  selectedLanguage,
  topic,
  onSelectTopic,
}) => {
  const currentCategoryData = CATEGORIZED_TRENDING_TOPICS[activeCategory];
  const activeChips =
    selectedLanguage === "hi"
      ? currentCategoryData.topicsHi
      : currentCategoryData.topicsEn;

  return (
    <div className="bg-[#FFFDF7] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5">
      {/* Category Header & Niche Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFE600] border border-[#111111]" />
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[#111111]">
            Curated Case Files
          </span>
        </div>

        {/* Niche Category Switcher */}
        <div className="inline-flex items-center bg-white p-1 rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] gap-1 select-none">
          {(["viral", "business", "tech"] as const).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wide transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111111] text-[#FFE600] shadow-[1px_1px_0px_#111111] border border-[#111111]"
                    : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Study Topic Badges */}
      <div className="flex flex-wrap gap-2">
        {activeChips.map((chip) => {
          const isSelected = topic === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => onSelectTopic(chip)}
              className={`text-xs px-3.5 py-2 rounded-xl transition-all text-left cursor-pointer active:translate-y-0.5 ${
                isSelected
                  ? "bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] font-black -translate-y-0.5"
                  : "bg-white text-[#222222] border-2 border-[#111111]/30 hover:border-[#111111] hover:shadow-[2px_2px_0px_#111111] font-bold"
              }`}
            >
              <span>{chip}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

