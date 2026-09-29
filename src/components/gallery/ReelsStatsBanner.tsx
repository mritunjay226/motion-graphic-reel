import React from "react";
import Link from "next/link";
import { Zap, Film, Layers } from "lucide-react";

interface ReelsStatsBannerProps {
  total: number;
  completed: number;
  rendering: number;
  totalScenes?: number;
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}

export const ReelsStatsBanner: React.FC<ReelsStatsBannerProps> = ({
  total,
  completed,
  rendering,
  totalScenes = 0,
  viewMode,
  setViewMode,
}) => {
  return (
    <section className="border-b-2 border-[#111111]/15 px-4 sm:px-8 py-6 sm:py-10 relative overflow-hidden bg-transparent select-none">
      {/* Broadcast Telemetry Strip */}
      <div className="max-w-7xl mx-auto mb-6 bg-[#111111] text-white p-2 rounded-xl border border-[#111111] shadow-[2px_2px_0px_#FFE600] flex items-center justify-between overflow-x-auto text-[10px] font-mono font-bold uppercase tracking-widest gap-4">
        <div className="flex items-center gap-3 shrink-0 pl-1">
          <span className="w-2 h-2 rounded-full bg-[#B5F500] animate-ping" />
          <span className="text-[#B5F500] font-black">2.5D RIG ACTIVE</span>
        </div>
        <div className="flex items-center gap-6 shrink-0 text-neutral-300">
          <span>● 1080×1920 9:16 VERTICAL</span>
          <span>● 30 FPS SPRING PHYSICS</span>
          <span>● 39-SOUND FOLEY SUITE</span>
          <span>● IMAGEKIT MULTI-PLANE</span>
          <span>● CARTESIA & GEMINI TTS</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 pr-1 text-[#FFE600]">
          <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>BROADCAST SPECS LOCKED</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
        <div>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2.5">
            <Film className="w-3 h-3 text-[#111111]" />
            <span>BROADCAST VAULT • EPISODE ARCHIVE</span>
          </div>

          <h1 className="font-bebas text-4xl sm:text-6xl uppercase tracking-wide text-[#111111] leading-[0.95] mb-2">
            2.5D REELS ARCHIVE
          </h1>

          <p className="text-xs sm:text-sm text-[#555555] font-medium leading-relaxed max-w-xl">
            Browse, preview, and edit your investigative documentary reels. Open any reel in the Director Studio to adjust multi-plane camera trajectories, tactile Foley SFX, and custom sound design.
          </p>
        </div>

        {/* Right Side: View Mode Switcher, Quick Action & Brutalist Stats Grid */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3.5">
          {/* View Mode Switcher Toggle */}
          <div className="inline-flex items-center bg-white p-1 rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] gap-1 self-start sm:self-end">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#111111] text-[#FFE600] shadow-xs border border-[#111111]"
                  : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
              }`}
              title="Poster Grid View"
            >
              <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#111111] text-[#FFE600] shadow-xs border border-[#111111]"
                  : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
              }`}
              title="Studio Table View"
            >
              <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
                <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" strokeLinecap="round" />
                <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" strokeLinecap="round" />
                <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>Studio List</span>
            </button>
          </div>

          <Link
            href="/create-video"
            className="px-5 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd900] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current text-[#111111]" />
            <span>New Reel</span>
          </Link>

          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {/* Total */}
            <div className="bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-2.5 sm:p-3 rounded-xl text-center min-w-[70px] sm:min-w-[80px]">
              <span className="font-bebas text-2xl sm:text-3xl text-[#111111] leading-none block">
                {total}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#666666] block mt-0.5">
                Total
              </span>
            </div>

            {/* Ready */}
            <div className="bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#B5F500] p-2.5 sm:p-3 rounded-xl text-center min-w-[70px] sm:min-w-[80px]">
              <span className="font-bebas text-2xl sm:text-3xl text-[#111111] leading-none block">
                {completed}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#111111] bg-[#B5F500] px-1 py-0.2 rounded border border-[#111111] inline-block mt-0.5">
                Ready
              </span>
            </div>

            {/* Processing */}
            <div className="bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#FFE600] p-2.5 sm:p-3 rounded-xl text-center min-w-[70px] sm:min-w-[80px]">
              <span className="font-bebas text-2xl sm:text-3xl text-[#111111] leading-none block">
                {rendering}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#111111] bg-[#FFE600] px-1 py-0.2 rounded border border-[#111111] inline-block mt-0.5">
                Active
              </span>
            </div>

            {/* Total Scenes */}
            <div className="bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-2.5 sm:p-3 rounded-xl text-center min-w-[70px] sm:min-w-[80px]">
              <span className="font-bebas text-2xl sm:text-3xl text-[#111111] leading-none block">
                {totalScenes}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#555555] block mt-0.5">
                Scenes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



