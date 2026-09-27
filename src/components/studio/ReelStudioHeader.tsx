import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Share2, Download, Video } from "lucide-react";

interface ReelStudioHeaderProps {
  rawReelId: string;
  topic?: string;
  title?: string;
  totalTimeSeconds: number;
  status: string;
  hasVideo: boolean;
  videoUrl?: string;
  isRendering: boolean;
  isExporting: boolean;
  onOpenSocialModal: () => void;
  onExportMp4: () => void;
}

export const ReelStudioHeader: React.FC<ReelStudioHeaderProps> = ({
  rawReelId,
  topic,
  title,
  totalTimeSeconds,
  status,
  hasVideo,
  videoUrl,
  isRendering,
  isExporting,
  onOpenSocialModal,
  onExportMp4,
}) => {
  return (
    <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Left info & Back link */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/reel"
          title="Back to Library"
          className="p-2 rounded-xl bg-black/[0.03] hover:bg-black/[0.07] text-[#1D1D1F] transition-all active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2.5 truncate">
          <span className="text-xs font-semibold text-[#1D1D1F] truncate max-w-xs sm:max-w-md">
            {topic || title || rawReelId}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-black/[0.08] text-xs font-medium text-[#86868B]">
          <span>1080×1920</span>
          <span>•</span>
          <span>30 fps</span>
          <span>•</span>
          <span className="text-[#1D1D1F] bg-black/[0.04] px-2 py-0.5 rounded-md font-mono">
            {totalTimeSeconds}s
          </span>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Status Indicator */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status === "completed"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : status === "failed"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${status === "completed"
                ? "bg-[#34C759]"
                : status === "failed"
                  ? "bg-red-500"
                  : "bg-[#FF9500] animate-pulse"
              }`}
          />
          <span className="capitalize">{status}</span>
        </span>

        {/* Social Publish Button */}
        {hasVideo && (
          <button
            type="button"
            onClick={onOpenSocialModal}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 text-white shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        )}

        {/* Download / Export Button */}
        {hasVideo && !isRendering ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MP4</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onExportMp4}
            disabled={isExporting || isRendering || status !== "completed"}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {isRendering || isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5" />
                <span>Export 1080p</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
