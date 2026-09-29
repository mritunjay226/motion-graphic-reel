import React, { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Play, Eye, Trash2, Loader2, Share2, Check, Download, Layers } from "lucide-react";
import { getVideoTheme } from "@/remotion/utils/themes";

interface ReelsTableViewProps {
  reels: any[];
  deletingId: string | null;
  onPreview: (reel: any) => void;
  onNavigate: (reelId: string) => void;
  onDelete: (reelId: Id<"reels">, e: React.MouseEvent) => void;
}

export const ReelsTableView: React.FC<ReelsTableViewProps> = ({
  reels,
  deletingId,
  onPreview,
  onNavigate,
  onDelete,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/reel/${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full bg-[#FFFDF7] border-3 border-[#111111] rounded-3xl shadow-[8px_8px_0px_#111111] overflow-hidden">
      {/* Table Header Bar */}
      <div className="bg-[#111111] text-white px-6 py-3.5 border-b-3 border-[#111111] grid grid-cols-12 gap-4 items-center text-[10px] font-mono font-black uppercase tracking-widest select-none">
        <div className="col-span-5 sm:col-span-4 flex items-center gap-2">
          <span className="text-[#FFE600]">●</span>
          <span>Dossier / Title</span>
        </div>
        <div className="col-span-3 sm:col-span-2">Status & Specs</div>
        <div className="hidden md:block col-span-3">Storyboard Strip</div>
        <div className="hidden lg:block col-span-1">Voice & Theme</div>
        <div className="col-span-4 sm:col-span-6 md:col-span-3 lg:col-span-2 text-right">
          Director Actions
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y-2 divide-[#111111]/10">
        {reels.map((reel) => {
          const isCompleted = reel.status === "completed";
          const isRendering = reel.status === "rendering" || reel.status === "draft";
          const scenes = reel.storyboard || [];
          const sceneCount = scenes.length;
          const formattedDate = new Date(reel.createdAt || Date.now()).toLocaleDateString(
            undefined,
            { month: "short", day: "numeric" }
          );

          const heroImageUrl =
            scenes[0]?.imageUrl ||
            scenes[0]?.imageKitUrls?.foreground ||
            scenes[1]?.imageUrl;

          const themeObj = getVideoTheme(reel.themeId);
          const themeName = themeObj?.name ? themeObj.name.split("(")[0].trim() : "Vox Explainer";

          const voiceLabel = reel.voiceId
            ? reel.voiceId.replace(/_/g, " ").replace(/gemini|cartesia/i, "").trim()
            : "Narrator";

          const totalFrames = scenes.reduce(
            (acc: number, s: any) => acc + (s.durationFrames || 150),
            0
          );
          const durationSec = Math.round(totalFrames / 30);
          const isCopied = copiedId === reel._id;

          return (
            <div
              key={reel._id}
              onClick={() => onNavigate(reel._id)}
              className="p-4 sm:p-5 grid grid-cols-12 gap-4 items-center hover:bg-[#FFE600]/10 transition-colors cursor-pointer group"
            >
              {/* Col 1: Dossier Title & Poster Thumbnail */}
              <div className="col-span-5 sm:col-span-4 flex items-center gap-3.5 min-w-0">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCompleted) onPreview(reel);
                    else onNavigate(reel._id);
                  }}
                  className="w-12 h-18 sm:w-14 sm:h-22 rounded-xl bg-black border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 relative overflow-hidden group/thumb flex items-center justify-center cursor-pointer"
                >
                  {heroImageUrl ? (
                    <img
                      src={heroImageUrl}
                      alt={reel.topic || "Reel thumb"}
                      className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1c1c22]" />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#FFE600] text-[#111111] flex items-center justify-center border border-[#111111] shadow-xs">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-[#111111] text-[#FFE600] text-[9px] font-mono font-black px-1.5 py-0.2 rounded border border-[#111111] uppercase">
                      {reel.language === "hi" ? "🇮🇳 HI" : "🇺🇸 EN"}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#666666] uppercase">
                      {formattedDate}
                    </span>
                  </div>
                  <h4 className="font-bebas text-lg sm:text-xl text-[#111111] uppercase leading-tight truncate group-hover:text-[#111111]">
                    {reel.topic || reel.title}
                  </h4>
                  <p className="text-[10px] font-mono text-[#555555] truncate max-w-xs">
                    {scenes[0]?.headline || "Investigation dossier"}
                  </p>
                </div>
              </div>

              {/* Col 2: Status & Specs */}
              <div className="col-span-3 sm:col-span-2">
                <span
                  className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border border-[#111111] shadow-xs inline-flex items-center gap-1.5 mb-1 ${
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
                <div className="text-[10px] font-mono font-bold text-[#666666] uppercase">
                  {sceneCount} SCENES • {durationSec > 0 ? `${durationSec}S` : "30FPS"}
                </div>
              </div>

              {/* Col 3: Miniature Storyboard Strip */}
              <div className="hidden md:block col-span-3 min-w-0">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {scenes.slice(0, 6).map((sc: any, idx: number) => {
                    const img = sc.imageUrl || sc.imageKitUrls?.foreground;
                    return (
                      <div
                        key={idx}
                        className="w-9 h-14 rounded-lg bg-neutral-900 border border-[#111111] shrink-0 overflow-hidden relative shadow-xs"
                        title={`Scene ${idx + 1}: ${sc.headline || "Untitled"}`}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-neutral-500">
                            0{idx + 1}
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] font-mono text-[#FFE600] font-black text-center">
                          0{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                  {sceneCount > 6 && (
                    <span className="text-[9px] font-mono font-black text-[#888888] pl-1">
                      +{sceneCount - 6}
                    </span>
                  )}
                </div>
              </div>

              {/* Col 4: Voice & Theme */}
              <div className="hidden lg:block col-span-1 space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white border border-[#111111] text-[#333333] shadow-xs block truncate" title={themeName}>
                  🎨 {themeName}
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white border border-[#111111] text-[#333333] shadow-xs block truncate" title={voiceLabel}>
                  🎙️ {voiceLabel}
                </span>
              </div>

              {/* Col 5: Actions */}
              <div
                className="col-span-4 sm:col-span-6 md:col-span-3 lg:col-span-2 flex items-center justify-end gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onNavigate(reel._id)}
                  className="px-3 py-2 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#B5F500] text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-[#111111] shadow-[2px_2px_0px_#B5F500] hover:-translate-y-0.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Studio</span>
                </button>

                {isCompleted && (
                  <button
                    type="button"
                    onClick={() => onPreview(reel)}
                    title="Quick Player Preview"
                    className="p-2 rounded-xl bg-white hover:bg-[#FFE600] text-[#111111] transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleCopy(reel._id, e)}
                  title={isCopied ? "Link Copied!" : "Share Link"}
                  className={`p-2 rounded-xl transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 ${
                    isCopied
                      ? "bg-[#B5F500] text-[#111111]"
                      : "bg-white hover:bg-[#FFE600] text-[#111111]"
                  }`}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>

                {reel.videoUrl && (
                  <a
                    href={reel.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${reel.topic || "reel"}.mp4`}
                    title="Download MP4 Video"
                    className="p-2 rounded-xl bg-white hover:bg-[#B5F500] text-[#111111] transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  </a>
                )}

                <button
                  type="button"
                  disabled={deletingId === reel._id}
                  onClick={(e) => onDelete(reel._id, e)}
                  title="Delete Reel"
                  className="p-2 rounded-xl bg-white hover:bg-red-50 text-[#777777] hover:text-red-600 transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] disabled:opacity-50 hover:-translate-y-0.5"
                >
                  {deletingId === reel._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
