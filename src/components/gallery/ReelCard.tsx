import React, { useState } from "react";
import { motion } from "framer-motion";
import { Id } from "../../../convex/_generated/dataModel";
import { Play, Eye, Trash2, Loader2, Share2, Check, Download, Layers } from "lucide-react";
import { getVideoTheme } from "@/remotion/utils/themes";

interface ReelCardProps {
  reel: any;
  deletingId: string | null;
  onPreview: (reel: any) => void;
  onNavigate: (reelId: string) => void;
  onDelete: (reelId: Id<"reels">, e: React.MouseEvent) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  deletingId,
  onPreview,
  onNavigate,
  onDelete,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const isCompleted = reel.status === "completed";
  const isRendering = reel.status === "rendering" || reel.status === "draft";
  const scenes = reel.storyboard || [];
  const sceneCount = scenes.length;

  const formattedDate = new Date(reel.createdAt || Date.now()).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" }
  );

  // Active scene based on scrubber hover
  const activeScene = scenes[currentSceneIdx] || scenes[0];
  const activeImageUrl =
    activeScene?.imageUrl ||
    activeScene?.imageKitUrls?.foreground ||
    scenes[0]?.imageUrl ||
    scenes[0]?.imageKitUrls?.foreground;

  // Resolved theme metadata
  const themeObj = getVideoTheme(reel.themeId);
  const themeName = themeObj?.name ? themeObj.name.split("(")[0].trim() : "Vox Explainer";

  // Voice Actor label
  const voiceLabel = reel.voiceId
    ? reel.voiceId.replace(/_/g, " ").replace(/gemini|cartesia/i, "").trim()
    : "Documentary Narrator";

  // Total Duration calculation (30 fps)
  const totalFrames = scenes.reduce((acc: number, s: any) => acc + (s.durationFrames || 150), 0);
  const durationSec = Math.round(totalFrames / 30);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/reel/${reel._id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="bg-[#FFFDF7] border-3 border-[#111111] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#111111] hover:shadow-[8px_8px_0px_#FFE600] hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden"
    >
      {/* 1. Header Strip: Status, Language & Date */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b-2 border-[#111111]/10">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-[#111111] shadow-xs flex items-center gap-1.5 ${
                isCompleted
                  ? "bg-[#B5F500] text-[#111111]"
                  : isRendering
                    ? "bg-[#FFE600] text-[#111111] animate-pulse"
                    : "bg-red-500 text-white"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCompleted
                    ? "bg-[#111111]"
                    : isRendering
                      ? "bg-red-600 animate-ping"
                      : "bg-white"
                }`}
              />
              <span>{isRendering ? "IN PIPELINE" : reel.status?.toUpperCase()}</span>
            </span>

            <span className="bg-[#111111] text-[#FFE600] text-[9px] font-mono font-black px-2 py-0.5 rounded border border-[#111111] uppercase">
              {reel.language === "hi" ? "🇮🇳 HI" : "🇺🇸 EN"}
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold text-[#666666] uppercase">
            {formattedDate}
          </span>
        </div>

        {/* 2. Reel Title & Duration Telemetry */}
        <h3 className="font-bebas text-2xl text-[#111111] leading-tight line-clamp-2 uppercase tracking-wide group-hover:text-[#111111] mb-1">
          {reel.topic || reel.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#666666] uppercase tracking-wider mb-2">
          <span>{sceneCount} SCENES • {durationSec > 0 ? `${durationSec}S DURATION` : "9:16"}</span>
          <span className="text-[#111111] font-black">1080×1920</span>
        </div>
      </div>

      {/* 3. Visual Reel Card Preview Frame with Interactive Scene Scrubber */}
      <div className="my-1.5">
        <div
          onClick={() => {
            if (isCompleted) {
              onPreview(reel);
            } else {
              onNavigate(reel._id);
            }
          }}
          className="w-full aspect-[9/16] rounded-2xl border-2 border-[#111111] bg-[#111113] relative overflow-hidden cursor-pointer group/frame flex flex-col items-center justify-between p-3.5 shadow-[3px_3px_0px_#111111]"
        >
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={activeScene?.headline || reel.topic || "Reel preview"}
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover/frame:scale-105 group-hover/frame:opacity-95 transition-all duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c22] to-[#0c0c0e] opacity-90" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

          {/* Viewfinder Corner Overlays */}
          <div className="absolute top-2 left-2 text-[#FFE600] font-mono text-[9px] pointer-events-none select-none font-bold opacity-80">
            ┌ 0{currentSceneIdx + 1}
          </div>
          <div className="absolute top-2 right-2 text-[#FFE600] font-mono text-[9px] pointer-events-none select-none font-bold opacity-80">
            ┐
          </div>

          {/* Top Frame Telemetry */}
          <div className="relative z-10 w-full flex justify-between items-center">
            <span className="text-[8px] font-mono text-[#FFE600] font-black tracking-widest uppercase bg-black/80 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              REC [30FPS]
            </span>

            {/* Audio Foley Soundwave Visualizer Bounce */}
            <div
              className="flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded bg-black/80 border border-white/10"
              title="39-Sound Foley Suite Active"
            >
              <span className="w-0.75 bg-[#B5F500] rounded-full h-2 group-hover:h-3 transition-all duration-150" />
              <span className="w-0.75 bg-[#FFE600] rounded-full h-3 group-hover:h-1.5 transition-all duration-200" />
              <span className="w-0.75 bg-[#B5F500] rounded-full h-1.5 group-hover:h-3 transition-all duration-100" />
              <span className="w-0.75 bg-[#FFE600] rounded-full h-2.5 group-hover:h-1 transition-all duration-300" />
            </div>
          </div>

          {/* Center Play Button HUD */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-center group-hover/frame:scale-110 group-hover/frame:bg-[#ffd900] transition-all">
            <Play className="w-5 h-5 fill-current ml-0.5 text-[#111111]" />
          </div>

          {/* Bottom Headline & Subtitle Snippet */}
          <div className="relative z-10 w-full space-y-1">
            <div className="text-[10px] font-mono font-black text-[#111111] bg-[#FFE600] px-2.5 py-1 rounded truncate border border-[#111111] shadow-xs">
              {activeScene?.headline || reel.topic}
            </div>
            {activeScene?.subtitle && (
              <p className="text-[9px] font-mono font-medium text-white/90 line-clamp-1 bg-black/75 px-2 py-0.5 rounded border border-white/10">
                {activeScene.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 4. Interactive Scene Scrubber Dots (1..N) */}
        {sceneCount > 1 && (
          <div
            className="flex items-center justify-between pt-2 px-1 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[9px] font-mono font-black text-[#666666] uppercase flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#111111]" />
              SCENES:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {scenes.map((_: any, idx: number) => {
                const isCurrent = currentSceneIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setCurrentSceneIdx(idx)}
                    onClick={() => setCurrentSceneIdx(idx)}
                    className={`w-5 h-5 rounded-md text-[9px] font-mono font-black flex items-center justify-center transition-all cursor-pointer border ${
                      isCurrent
                        ? "bg-[#FFE600] text-[#111111] border-[#111111] shadow-[1px_1px_0px_#111111] scale-110"
                        : "bg-white text-[#777777] border-neutral-300 hover:border-[#111111] hover:text-[#111111]"
                    }`}
                    title={`Scene 0${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. Metadata Badges Strip (Theme & Voice) */}
      <div className="flex flex-wrap items-center gap-1.5 my-2">
        <span
          className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-[#111111] text-[#333333] shadow-xs truncate max-w-[140px]"
          title={themeName}
        >
          🎨 {themeName}
        </span>
        <span
          className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-[#111111] text-[#333333] shadow-xs truncate max-w-[130px]"
          title={voiceLabel}
        >
          🎙️ {voiceLabel}
        </span>
      </div>

      {/* 6. Card Action Footer */}
      <div className="flex items-center gap-1.5 pt-2.5 border-t-2 border-[#111111]/10">
        <button
          type="button"
          onClick={() => onNavigate(reel._id)}
          className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#B5F500] text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#111111] shadow-[2px_2px_0px_#B5F500] hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Open Studio</span>
        </button>

        {isCompleted && (
          <button
            type="button"
            onClick={() => onPreview(reel)}
            title="Quick Player Preview"
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FFE600] text-[#111111] text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {/* Copy Share Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          title={copied ? "Link Copied!" : "Copy Share Link"}
          className={`p-2.5 rounded-xl transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 ${
            copied
              ? "bg-[#B5F500] text-[#111111]"
              : "bg-white hover:bg-[#FFE600] text-[#111111]"
          }`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 stroke-[3] text-[#111111]" />
          ) : (
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>

        {/* Direct MP4 Download (if rendered) */}
        {reel.videoUrl && (
          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`${reel.topic || "reel"}.mp4`}
            onClick={(e) => e.stopPropagation()}
            title="Download MP4 Video"
            className="p-2.5 rounded-xl bg-white hover:bg-[#B5F500] text-[#111111] transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        )}

        {/* Delete Reel Dossier */}
        <button
          type="button"
          disabled={deletingId === reel._id}
          onClick={(e) => onDelete(reel._id, e)}
          title="Delete Reel Dossier"
          className="p-2.5 rounded-xl bg-white hover:bg-red-50 text-[#777777] hover:text-red-600 transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0.5"
        >
          {deletingId === reel._id ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
