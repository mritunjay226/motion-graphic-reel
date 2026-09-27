import React from "react";
import { Player, PlayerRef } from "@remotion/player";
import { motion, AnimatePresence } from "framer-motion";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";
import { Play, Pause, AlertTriangle } from "lucide-react";

interface ReelVideoMonitorProps {
  playerRef: React.RefObject<PlayerRef | null>;
  stageContainerRef: React.RefObject<HTMLDivElement | null>;
  inputProps: any;
  totalFrames: number;
  currentFrame: number;
  isPlaying: boolean;
  tapFeedback: "play" | "pause" | null;
  preloadStatus: {
    isFullyBuffered: boolean;
    progressPercent: number;
  };
  mounted: boolean;
  onTogglePlay: (e?: React.MouseEvent) => void;
}

export const ReelVideoMonitor: React.FC<ReelVideoMonitorProps> = ({
  playerRef,
  stageContainerRef,
  inputProps,
  totalFrames,
  currentFrame,
  isPlaying,
  tapFeedback,
  preloadStatus,
  mounted,
  onTogglePlay,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Monitor Bezel Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 text-xs font-medium text-[#86868B]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-[#34C759] animate-pulse" : "bg-neutral-300"}`} />
          <span className="text-[#1D1D1F] font-semibold">Monitor</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span
            className={`px-2 py-0.5 rounded-full border ${preloadStatus.isFullyBuffered
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
              }`}
          >
            {preloadStatus.isFullyBuffered ? "Buffered" : `${preloadStatus.progressPercent}%`}
          </span>
          <span className="text-[#86868B]">
            F{currentFrame}
          </span>
        </div>
      </div>

      {/* 9:16 Video Frame Viewport Stage (Pro Display Styling) */}
      <div
        ref={stageContainerRef}
        onClick={onTogglePlay}
        className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-[#0A0A0C] border border-black/10 relative z-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer select-none group/stage"
      >
        {mounted && inputProps ? (
          <>
            <Player
              ref={playerRef}
              component={BlockbusterNetflixReel}
              inputProps={inputProps}
              durationInFrames={totalFrames}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={30}
              playbackRate={1}
              numberOfSharedAudioTags={32}
              renderLoading={() => (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-white gap-2">
                  <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-xs text-neutral-400 font-medium">
                    Loading scenes...
                  </p>
                </div>
              )}
              style={{ width: "100%", height: "100%" }}
              controls={false}
              autoPlay={false}
              loop
              spaceKeyToPlayOrPause
              doubleClickToFullscreen
              clickToPlay={false}
              errorFallback={({ error }) => (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/95 p-6 text-center text-white gap-3 z-30">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-200">
                    Video Fallback
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-xs">
                    {error?.message || "Using asset fallback."}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playerRef.current?.seekTo(0);
                    }}
                    className="mt-2 px-3 py-1.5 bg-white text-black font-medium text-xs rounded-full cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    Replay
                  </button>
                </div>
              )}
            />

            {/* Floating Glass Play Button HUD when Paused */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px] pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl group-hover/stage:scale-105 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>
                  <span className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10">
                    Space to play
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap Feedback Ripple */}
            <AnimatePresence>
              {tapFeedback === "pause" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-sm text-white flex items-center justify-center shadow-2xl">
                    <Pause className="w-7 h-7 fill-current" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-2 text-neutral-400">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-neutral-300">
              Loading Composition...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
