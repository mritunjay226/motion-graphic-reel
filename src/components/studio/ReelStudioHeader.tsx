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
    <header className="border-b-2 border-[#111111] bg-white/95 backdrop-blur-md sticky top-16 z-40 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs select-none">
      {/* Left info & Back link */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/reel"
          title="Back to Vault"
          className="p-2 rounded-xl bg-white hover:bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transition-all hover:-translate-y-0.5 active:translate-y-0.5 shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
        </Link>

        <div className="flex items-center gap-2.5 truncate">
          <span className="font-mono text-xs font-black uppercase tracking-wide text-[#111111] truncate max-w-xs sm:max-w-md">
            {topic || title || rawReelId}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l-2 border-[#111111]/15 text-xs font-mono font-bold text-[#555555]">
          <span>1080×1920</span>
          <span>•</span>
          <span>30 FPS</span>
          <span>•</span>
          <span className="text-[#111111] bg-[#FFE600] px-2 py-0.5 rounded border border-[#111111] font-mono font-black text-[10px] shadow-xs">
            {totalTimeSeconds}S DURATION
          </span>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Status Stamp */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-black uppercase border border-[#111111] shadow-xs ${
            status === "completed"
              ? "bg-[#B5F500] text-[#111111]"
              : status === "failed"
                ? "bg-red-500 text-white"
                : "bg-[#FFE600] text-[#111111] animate-pulse"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === "completed"
                ? "bg-[#111111]"
                : status === "failed"
                  ? "bg-white"
                  : "bg-red-600 animate-ping"
            }`}
          />
          <span>{status === "completed" ? "STUDIO READY" : status?.toUpperCase()}</span>
        </span>

        {/* Social Publish Button */}
        {hasVideo && (
          <button
            type="button"
            onClick={onOpenSocialModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-[#111111] hover:bg-[#222222] text-[#FFE600] border-2 border-[#111111] shadow-[2px_2px_0px_#FFE600] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
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
            className="px-4 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd900] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download MP4</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onExportMp4}
            disabled={isExporting || isRendering || status !== "completed"}
            className="px-4 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#ffd900] disabled:opacity-40 text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isRendering || isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Export 1080p</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

