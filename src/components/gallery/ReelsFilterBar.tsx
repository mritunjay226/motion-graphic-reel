import React from "react";
import { Search, X } from "lucide-react";

export type ReelTabFilter = "all" | "completed" | "rendering" | "mine";
export type ReelSortOption = "newest" | "oldest" | "scenes";

interface ReelsFilterBarProps {
  activeTab: ReelTabFilter;
  setActiveTab: (tab: ReelTabFilter) => void;
  stats: {
    total: number;
    completed: number;
    rendering: number;
    myCount: number;
  };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: ReelSortOption;
  setSortBy: (sort: ReelSortOption) => void;
}

export const ReelsFilterBar: React.FC<ReelsFilterBarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-5 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* iOS Segmented Tab Filters */}
      <div className="bg-black/[0.04] p-1 rounded-full flex flex-wrap sm:flex-nowrap items-center gap-1 w-full md:w-auto">
        {[
          { id: "all", label: "All", count: stats.total },
          { id: "completed", label: "Ready", count: stats.completed },
          { id: "rendering", label: "Processing", count: stats.rendering },
          { id: "mine", label: "My Reels", count: stats.myCount },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ReelTabFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${isActive
                  ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                  : "text-[#86868B] hover:text-[#1D1D1F] font-medium"
                }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${isActive ? "bg-black/[0.06] text-[#1D1D1F]" : "text-[#86868B]"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar & Sort Dropdown */}
      <div className="flex items-center gap-2.5 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
          <input
            type="text"
            placeholder="Search reels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-full pl-9 pr-8 py-1.5 text-xs text-[#1D1D1F] placeholder-[#86868B] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as ReelSortOption)}
          className="bg-white/80 border border-black/[0.08] rounded-full px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="scenes">Most scenes</option>
        </select>
      </div>
    </div>
  );
};

