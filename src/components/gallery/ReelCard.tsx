import React from "react";
import { motion } from "framer-motion";
import { Id } from "../../../convex/_generated/dataModel";
import { Play, Eye, Trash2, Loader2 } from "lucide-react";

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
  const isCompleted = reel.status === "completed";
  const isRendering = reel.status === "rendering" || reel.status === "draft";
  const sceneCount = reel.storyboard?.length || 0;
  const formattedDate = new Date(reel.createdAt || Date.now()).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" }
  );

  const heroImageUrl =
    reel.storyboard?.[0]?.imageUrl ||
    reel.storyboard?.[0]?.imageKitUrls?.foreground ||
    reel.storyboard?.[1]?.imageUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top Status & Date Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${isCompleted
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                : isRendering
                  ? "bg-blue-50 text-[#0071E3] border-blue-200/60"
                  : "bg-red-50 text-red-700 border-red-200/60"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isCompleted
                  ? "bg-[#34C759]"
                  : isRendering
                    ? "bg-[#0071E3] animate-ping"
                    : "bg-red-500"
                }`}
            />
            <span className="capitalize">{isRendering ? "Processing" : reel.status}</span>
          </span>

          <span className="text-[11px] text-[#86868B] font-normal">
            {formattedDate}
          </span>
        </div>

        {/* Reel Title */}
        <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] leading-snug line-clamp-2 mb-1 group-hover:text-[#0071E3] transition-colors">
          {reel.topic || reel.title}
        </h3>
        <p className="text-[11px] text-[#86868B] font-normal mb-2.5">
          {sceneCount} scenes · 1080p
        </p>
      </div>

      {/* Visual Reel Card Preview Frame */}
      <div
        onClick={() => {
          if (isCompleted) {
            onPreview(reel);
          } else {
            onNavigate(reel._id);
          }
        }}
        className="w-full aspect-[9/16] rounded-2xl border border-black/[0.08] bg-[#111113] my-1 relative overflow-hidden cursor-pointer group/frame flex flex-col items-center justify-between p-3.5 shadow-sm"
      >
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={reel.topic || "Reel preview"}
            className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover/frame:scale-105 group-hover/frame:opacity-90 transition-all duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c22] to-[#0c0c0e] opacity-90" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top Tag inside frame */}
        <div className="relative z-10 w-full flex justify-end">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 uppercase">
            {reel.language?.toUpperCase() || "EN"}
          </span>
        </div>

        {/* Center Play Button HUD */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-[#1D1D1F] flex items-center justify-center shadow-lg group-hover/frame:scale-110 group-hover/frame:bg-white transition-all">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>

        {/* Bottom Headline snippet */}
        <div className="relative z-10 w-full">
          <span className="text-[10px] font-normal text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg block truncate border border-white/10">
            {reel.storyboard?.[0]?.headline || reel.topic}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-black/[0.05] mt-2">
        <button
          type="button"
          onClick={() => onNavigate(reel._id)}
          className="flex-1 py-2 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold tracking-normal transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Open Studio</span>
        </button>

        <button
          type="button"
          disabled={deletingId === reel._id}
          onClick={(e) => onDelete(reel._id, e)}
          title="Delete Reel"
          className="p-2 rounded-full bg-neutral-100 hover:bg-red-50 text-[#86868B] hover:text-red-600 transition-all cursor-pointer disabled:opacity-50"
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

