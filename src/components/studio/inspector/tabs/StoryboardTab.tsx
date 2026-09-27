import React from "react";
import { Check, Video, Sliders } from "lucide-react";

interface StoryboardTabProps {
  storyboard?: any[];
  activeSceneIndex: number;
  onSeekToScene: (startFrame: number, idx: number) => void;
  onEditScene: (idx: number) => void;
  onDirectStockPicker: (idx: number) => void;
}

export const StoryboardTab: React.FC<StoryboardTabProps> = ({
  storyboard,
  activeSceneIndex,
  onSeekToScene,
  onEditScene,
  onDirectStockPicker,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
        <span className="text-xs font-medium text-[#86868B]">
          Click scene to preview • Edit to customize copy & assets
        </span>
        <span className="text-xs font-mono text-[#86868B] bg-black/[0.04] px-2 py-0.5 rounded-full">
          {storyboard?.length || 6} Scenes
        </span>
      </div>

      {storyboard?.map((sc: any, idx: number) => {
        const isCurrent = activeSceneIndex === idx;
        const sFrame = sc.startFrame ?? 0;
        const dFrames = sc.durationFrames ?? 90;
        const durSec = (dFrames / 30).toFixed(1);

        return (
          <div
            key={sc.sceneId || idx}
            onClick={() => onSeekToScene(sFrame, idx)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative ${isCurrent
                ? "bg-white border-[#0071E3] ring-2 ring-[#0071E3]/15 shadow-sm"
                : "bg-[#FBFBFD] border-black/[0.06] hover:border-black/[0.12] hover:bg-white"
              }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${isCurrent
                      ? "bg-[#0071E3] text-white"
                      : "bg-black/[0.05] text-[#1D1D1F]"
                    }`}
                >
                  Scene {idx + 1}
                </span>

                <span className="text-xs font-medium text-[#86868B]">
                  {durSec}s • F{sFrame}
                </span>
              </div>

              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onDirectStockPicker(idx)}
                  title="Search stock video"
                  className="px-2.5 py-1 bg-white hover:bg-black/[0.04] border border-black/[0.08] rounded-full text-xs font-medium text-[#1D1D1F] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Video className="w-3 h-3 text-[#0071E3]" />
                  <span>B-Roll</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditScene(idx)}
                  title="Edit Scene"
                  className="px-2.5 py-1 bg-black/[0.05] hover:bg-black/[0.09] rounded-full text-xs font-medium text-[#1D1D1F] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Headline & Narration */}
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F] leading-snug">
                {sc.headline}
              </h4>
              <p className="text-xs text-[#86868B] font-normal line-clamp-2 mt-1 leading-relaxed">
                "{sc.narration}"
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 pt-1 border-t border-black/[0.04] text-[11px]">
              {sc.imageUrl ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Cutout asset</span>
                </span>
              ) : null}

              {sc.videoUrl || sc.bRollUrl ? (
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>4K Video</span>
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
