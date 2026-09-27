import React from "react";
import { Film, Video, Search } from "lucide-react";

interface SceneMediaInputsProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  onOpenStockPicker: () => void;
}

export const SceneMediaInputs: React.FC<SceneMediaInputsProps> = ({
  imageUrl,
  setImageUrl,
  videoUrl,
  setVideoUrl,
  onOpenStockPicker,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-neutral-50/70 border border-black/[0.06] p-3.5 rounded-2xl">
      {/* Cutout Image URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-[#86868B]" />
          <span>Cutout image asset URL</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://... image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 bg-white border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-xl px-3 py-2 text-xs font-normal text-[#1D1D1F] placeholder-[#86868B] outline-none shadow-2xs transition-all"
          />
          {imageUrl && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-black/[0.08] shrink-0 bg-black">
              <img
                src={imageUrl}
                alt="Cutout Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Stock Video URL */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Video clip URL</span>
          </label>
          <button
            type="button"
            onClick={onOpenStockPicker}
            className="px-2.5 py-0.5 bg-black/[0.05] hover:bg-black/[0.1] rounded-full text-[10px] font-medium text-[#1D1D1F] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Search className="w-2.5 h-2.5" />
            <span>Stock library</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://...mp4 clip URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="flex-1 bg-white border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-xl px-3 py-2 text-xs font-normal text-[#1D1D1F] placeholder-[#86868B] outline-none shadow-2xs transition-all"
          />
          {videoUrl && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-black/[0.08] shrink-0 bg-black flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
