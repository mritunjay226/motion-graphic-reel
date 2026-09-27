import React from "react";
import { CATEGORIZED_TRENDING_TOPICS, TopicCategoryKey } from "./constants";

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
    <div className="bg-black/[0.02] border border-black/[0.05] rounded-2xl p-4 flex flex-col gap-3">
      {/* Category Pills & Label */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#86868B]">
          Featured Topics
        </span>

        {/* Niche Category Switcher */}
        <div className="inline-flex items-center bg-black/[0.04] p-0.5 rounded-full border border-black/[0.03]">
          {(["viral", "business", "tech"] as const).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${isSelected
                    ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Pill List */}
      <div className="flex flex-wrap gap-2">
        {activeChips.map((chip) => {
          const isSelected = topic === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => onSelectTopic(chip)}
              className={`text-xs px-3.5 py-2 rounded-xl transition-all text-left cursor-pointer active:scale-98 ${isSelected
                  ? "bg-[#0071E3] text-white shadow-sm font-medium"
                  : "bg-white text-[#1D1D1F] border border-black/[0.06] hover:border-black/[0.15] hover:shadow-xs"
                }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
};
