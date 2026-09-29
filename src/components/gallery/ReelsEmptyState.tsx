import React from "react";
import Link from "next/link";
import { Film, Zap } from "lucide-react";

interface ReelsEmptyStateProps {
  searchQuery: string;
}

export const ReelsEmptyState: React.FC<ReelsEmptyStateProps> = ({
  searchQuery,
}) => {
  return (
    <div className="bg-[#FFFDF7] border-3 border-[#111111] rounded-3xl p-8 sm:p-12 text-center shadow-[8px_8px_0px_#111111] max-w-md mx-auto my-12 relative overflow-hidden">
      <div className="w-14 h-14 bg-[#FFE600] border-2 border-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#111111] shadow-[3px_3px_0px_#111111]">
        <Film className="w-6 h-6 stroke-[2.5]" />
      </div>
      <h3 className="font-bebas text-3xl uppercase tracking-wide text-[#111111] mb-2">
        {searchQuery ? "No Dossiers Found" : "Vault Empty"}
      </h3>
      <p className="text-xs text-[#555555] font-mono font-medium leading-relaxed mb-6">
        {searchQuery
          ? `No documentary reels matched "${searchQuery}". Try a different search query.`
          : "You haven't produced any 2.5D motion reels in this view yet. Launch the studio console to produce your first documentary."}
      </p>
      <Link
        href="/create-video"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-mono font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd900] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
      >
        <Zap className="w-4 h-4 fill-current text-[#111111]" />
        <span>Create First Reel</span>
      </Link>
    </div>
  );
};


