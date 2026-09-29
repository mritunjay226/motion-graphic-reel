import React from "react";
import { Search, X, RotateCcw, Globe } from "lucide-react";

export type ReelTabFilter = "all" | "completed" | "rendering" | "mine";
export type ReelSortOption = "newest" | "oldest" | "scenes";
export type ReelLanguageFilter = "all" | "en" | "hi";

interface ReelsFilterBarProps {
  activeTab: ReelTabFilter;
  setActiveTab: (tab: ReelTabFilter) => void;
  stats: {
    total: number;
    completed: number;
    rendering: number;
    myCount: number;
  };
  languageFilter: ReelLanguageFilter;
  setLanguageFilter: (lang: ReelLanguageFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: ReelSortOption;
  setSortBy: (sort: ReelSortOption) => void;
  resultCount: number;
}

export const ReelsFilterBar: React.FC<ReelsFilterBarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  languageFilter,
  setLanguageFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  resultCount,
}) => {
  const isFiltered =
    activeTab !== "all" || languageFilter !== "all" || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setActiveTab("all");
    setLanguageFilter("all");
    setSearchQuery("");
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 flex flex-col gap-3">
      {/* Top Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
        {/* Left: Brutalist Status Tabs & Language Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Tab Group */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] select-none">
            {[
              { id: "all", label: "All Reels", count: stats.total },
              { id: "completed", label: "Ready", count: stats.completed },
              { id: "rendering", label: "Active", count: stats.rendering },
              { id: "mine", label: "My Reels", count: stats.myCount },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ReelTabFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-[#111111] text-[#FFE600] border border-[#111111] shadow-[2px_2px_0px_#FFE600] scale-102"
                      : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                      isActive ? "bg-[#FFE600] text-[#111111]" : "bg-neutral-200 text-[#333333]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Language Toggle Pill Group */}
          <div className="inline-flex items-center gap-1 p-1 bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] select-none">
            <span className="text-[10px] font-mono font-black text-[#888888] px-2 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#111111]" />
              LANG:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "en", label: "🇺🇸 EN" },
              { id: "hi", label: "🇮🇳 HI" },
            ].map((lang) => {
              const isActive = languageFilter === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setLanguageFilter(lang.id as ReelLanguageFilter)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black uppercase transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FFE600] text-[#111111] border border-[#111111] shadow-[2px_2px_0px_#111111]"
                      : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search Input & Sort Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111] stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] focus:shadow-[4px_4px_0px_#FFE600] rounded-xl pl-9 pr-8 py-2 text-xs font-mono font-bold text-[#111111] placeholder-[#777777] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#111111] cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReelSortOption)}
            className="bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] rounded-xl px-3.5 py-2 text-xs font-mono font-black uppercase text-[#111111] focus:outline-none focus:shadow-[4px_4px_0px_#FFE600] cursor-pointer shrink-0"
          >
            <option value="newest">Newest Dispatch</option>
            <option value="oldest">Oldest First</option>
            <option value="scenes">Most Scenes</option>
          </select>
        </div>
      </div>

      {/* Telemetry Status Sub-bar */}
      <div className="flex items-center justify-between text-[11px] font-mono font-bold px-1 text-[#555555]">
        <div className="flex items-center gap-2">
          <span className="text-[#111111] font-black uppercase tracking-wider">
            SHOWING {resultCount} OF {stats.total} REELS
          </span>
          {isFiltered && (
            <span className="bg-[#FFE600] text-[#111111] px-2 py-0.5 rounded text-[10px] font-black border border-[#111111]">
              FILTERED
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs text-[#111111] hover:text-black font-black uppercase tracking-wider cursor-pointer underline decoration-[#FFE600] decoration-2 underline-offset-4"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
