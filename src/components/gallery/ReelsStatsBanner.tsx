import React from "react";

interface ReelsStatsBannerProps {
  total: number;
  completed: number;
  rendering: number;
}

export const ReelsStatsBanner: React.FC<ReelsStatsBannerProps> = ({
  total,
  completed,
  rendering,
}) => {
  return (
    <section className="border-b border-black/[0.06] px-6 sm:px-10 py-8 sm:py-12 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-2">
            Library
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] mb-2">
            Your Reels
          </h1>
          <p className="text-sm text-[#86868B] font-normal leading-relaxed max-w-xl">
            Browse and inspect your motion graphic reels. Open any video in the studio to customize scenes, audio, and visual styles.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="bg-white/70 backdrop-blur-md border border-black/[0.06] p-3.5 sm:p-4 rounded-2xl text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-[100px]">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight block">
              {total}
            </span>
            <span className="text-[11px] font-medium text-[#86868B]">
              Total
            </span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-black/[0.06] p-3.5 sm:p-4 rounded-2xl text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-[100px]">
            <span className="text-2xl sm:text-3xl font-semibold text-[#34C759] tracking-tight block">
              {completed}
            </span>
            <span className="text-[11px] font-medium text-[#86868B]">
              Ready
            </span>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-black/[0.06] p-3.5 sm:p-4 rounded-2xl text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-[100px]">
            <span className="text-2xl sm:text-3xl font-semibold text-[#0071E3] tracking-tight block">
              {rendering}
            </span>
            <span className="text-[11px] font-medium text-[#86868B]">
              Processing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

