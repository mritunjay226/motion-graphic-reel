import React from "react";
import Link from "next/link";
import { Film, Plus } from "lucide-react";

interface ReelsEmptyStateProps {
  searchQuery: string;
}

export const ReelsEmptyState: React.FC<ReelsEmptyStateProps> = ({
  searchQuery,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[32px] p-10 sm:p-14 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] max-w-md mx-auto my-12">
      <div className="w-12 h-12 bg-black/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#86868B]">
        <Film className="w-5 h-5 text-[#1D1D1F]" />
      </div>
      <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
        No reels found
      </h3>
      <p className="text-xs text-[#86868B] font-normal leading-relaxed mb-6">
        {searchQuery
          ? `No video reels matched "${searchQuery}".`
          : "You haven't created any video reels in this view yet."}
      </p>
      <Link
        href="/create-video"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all shadow-sm active:scale-[0.98] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Create a reel</span>
      </Link>
    </div>
  );
};

