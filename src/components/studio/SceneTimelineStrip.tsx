import React from "react";
import { Film, Sliders } from "lucide-react";

interface SceneTimelineStripProps {
  storyboard?: any[];
  activeSceneIndex: number;
  onSeekToScene: (startFrame: number, idx: number) => void;
  onEditScene: (idx: number) => void;
}

export const SceneTimelineStrip: React.FC<SceneTimelineStripProps> = ({
  storyboard,
  activeSceneIndex,
  onSeekToScene,
  onEditScene,
}) => {
  if (!storyboard || storyboard.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all">
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-black/[0.05]">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#1D1D1F]" />
          <h3 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] tracking-tight">
            Timeline
          </h3>
        </div>
        <span className="text-[11px] font-medium text-[#86868B]">
          Click to jump · Edit scenes
        </span>
      </div>

      {/* Horizontal Strip Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {storyboard.map((sc: any, idx: number) => {
          const isCurrent = activeSceneIndex === idx;
          const sFrame = sc.startFrame ?? 0;
          const dFrames = sc.durationFrames ?? 90;
          const durSec = (dFrames / 30).toFixed(1);

          return (
            <div
              key={idx}
              onClick={() => onSeekToScene(sFrame, idx)}
              className={`p-3 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative group ${isCurrent
                  ? "bg-white border-[#0071E3] shadow-sm ring-2 ring-[#0071E3]/20"
                  : "bg-neutral-50/70 border-black/[0.04] hover:bg-white hover:border-black/[0.1] hover:shadow-xs"
                }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${isCurrent
                      ? "bg-[#0071E3] text-white"
                      : "bg-black/[0.06] text-[#86868B] group-hover:text-[#1D1D1F]"
                    }`}
                >
                  Scene {idx + 1}
                </span>

                <span className="text-[10px] text-[#86868B] font-medium">
                  {durSec}s
                </span>
              </div>

              <p className="text-xs font-medium text-[#1D1D1F] leading-snug line-clamp-1">
                {sc.headline || `Scene ${idx + 1}`}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                <span className="text-[10px] text-[#86868B] capitalize truncate max-w-[70px]">
                  {sc.visualType ? sc.visualType.replace(/_/g, " ") : "hero"}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditScene(idx);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors cursor-pointer"
                >
                  <Sliders className="w-2.5 h-2.5" />
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

