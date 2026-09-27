import React from "react";
import { CheckCircle2, Share2, Download, Video, Loader2 } from "lucide-react";

interface ExportTabProps {
  isRendering: boolean;
  hasVideo: boolean;
  renderElapsed: number;
  videoUrl?: string;
  isExporting: boolean;
  status: string;
  exportError: string | null;
  onExportMp4: () => void;
  onOpenSocialModal: () => void;
}

export const ExportTab: React.FC<ExportTabProps> = ({
  isRendering,
  hasVideo,
  renderElapsed,
  videoUrl,
  isExporting,
  status,
  exportError,
  onExportMp4,
  onOpenSocialModal,
}) => {
  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#FBFBFD] border border-black/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/[0.05]">
          <span className="text-sm font-semibold text-[#1D1D1F]">
            1080p Cloud Render
          </span>
          <span className="text-[11px] font-mono text-[#86868B]">
            H.264 • 30 fps
          </span>
        </div>

        {isRendering ? (
          <div className="space-y-3 bg-[#1D1D1F] text-white p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#0071E3]" />
              <div>
                <p className="text-xs font-semibold text-white">Rendering video on cloud workers...</p>
                <p className="text-[11px] text-neutral-400 font-mono">Elapsed: {formatElapsed(renderElapsed)}</p>
              </div>
            </div>
          </div>
        ) : hasVideo ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-medium text-xs bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
              <span>Your video is rendered and ready for download or direct publishing.</span>
            </div>

            <button
              type="button"
              onClick={onOpenSocialModal}
              className="w-full py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Publish to Instagram & YouTube</span>
            </button>

            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-full py-3 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download MP4</span>
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#86868B] leading-relaxed">
              Compile your timeline into a broadcast 1080p MP4 file. Rendering runs in parallel on GPU containers in ~20 seconds.
            </p>

            <button
              type="button"
              onClick={onExportMp4}
              disabled={isExporting || status !== "completed"}
              className="w-full py-3 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 active:scale-98 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Start Cloud Render</span>
            </button>
          </div>
        )}

        {exportError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {exportError}
          </div>
        )}
      </div>
    </div>
  );
};
