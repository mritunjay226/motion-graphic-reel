import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@remotion/player";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";
import { Eye, X } from "lucide-react";

interface ReelPreviewModalProps {
  previewReel: any | null;
  previewInputProps: any;
  onClose: () => void;
  onNavigateToStudio: (reelId: string) => void;
}

export const ReelPreviewModal: React.FC<ReelPreviewModalProps> = ({
  previewReel,
  previewInputProps,
  onClose,
  onNavigateToStudio,
}) => {
  return (
    <AnimatePresence>
      {previewReel && previewInputProps && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-[28px] sm:rounded-[32px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] max-w-sm w-full flex flex-col items-center gap-3.5 relative"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1D1D1F] truncate max-w-[240px]">
                {previewReel.topic || previewReel.title}
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-xs text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden border border-black/[0.08] bg-black relative shadow-sm">
              <Player
                component={BlockbusterNetflixReel}
                inputProps={previewInputProps}
                durationInFrames={previewInputProps.plan?.projectMeta?.totalDurationFrames || 900}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                style={{ width: "100%", height: "100%" }}
                controls
                autoPlay
                loop
              />
            </div>

            {/* Footer Direct Action */}
            <div className="w-full flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToStudio(previewReel._id);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold tracking-normal flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open in Studio</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

