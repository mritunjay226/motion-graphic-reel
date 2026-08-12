"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ReelGenerationProgressProps {
  reelId: string;
  onComplete?: (reelId: string) => void;
  onRetry?: () => void;
}

const PIPELINE_STEPS = [
  {
    step: 1,
    title: "Generating Documentary Script",
    description: "Google Gemini 2.5 Director writing 6-scene story beats & visual event timelines...",
    icon: "🚀",
  },
  {
    step: 2,
    title: "Formulating Visual Asset Prompts",
    description: "Creating targeted single-subject cutout & event prompts...",
    icon: "🎨",
  },
  {
    step: 3,
    title: "Synthesizing Cartesia Voice Narrations",
    description: "Generating AI voiceover audio tracks for all scenes...",
    icon: "🎙️",
  },
  {
    step: 4,
    title: "Transcribing Word-Level Subtitles",
    description: "Deepgram Nova-2 generating kinetic captions...",
    icon: "📝",
  },
  {
    step: 5,
    title: "Generating & Uploading Cutout Assets",
    description: "Processing ImageKit AI Background Removal for cutouts & news clippings...",
    icon: "🖼️",
  },
  {
    step: 6,
    title: "Assembling 2.5D Motion Graphics Storyboard",
    description: "Finalizing timeline keyframes and Remotion compositions...",
    icon: "🎬",
  },
];

export const ReelGenerationProgress: React.FC<ReelGenerationProgressProps> = ({
  reelId,
  onComplete,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isValidConvexId = Boolean(
    reelId &&
    !reelId.includes("_") &&
    reelId.length >= 10
  );

  const reel = useQuery(
    api.reels.getReelById,
    mounted && isValidConvexId ? { reelId: reelId as Id<"reels"> } : "skip"
  );

  const status = reel?.status || "rendering";
  const storyboard = reel?.storyboard || [];
  const errorMessage = reel?.errorMessage || "An unrecoverable error occurred during video generation.";

  // Calculate current active step based on storyboard scenes assembled
  const assembledCount = Array.isArray(storyboard) ? storyboard.length : 0;

  let currentStep = 1;
  if (status === "completed") {
    currentStep = 6;
  } else if (assembledCount >= 5) {
    currentStep = 5;
  } else if (assembledCount >= 3) {
    currentStep = 4;
  } else if (assembledCount >= 1) {
    currentStep = 3;
  } else {
    currentStep = 2;
  }

  // Trigger completion callback when status changes to completed
  useEffect(() => {
    if (status === "completed" && onComplete) {
      const timer = setTimeout(() => {
        onComplete(reelId);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [status, reelId, onComplete]);

  const progressPercent = status === "completed" ? 100 : Math.min(95, Math.round((currentStep / 6) * 100));

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
            {status === "completed" ? "✅ GENERATION COMPLETED" : status === "failed" ? "❌ PIPELINE ERROR" : "⚡ LIVE PIPELINE PROCESSING"}
          </span>
          <h3 className="text-xl font-black text-white mt-2">
            {status === "completed"
              ? "Your 2.5D Vox Video Reel is Ready!"
              : status === "failed"
              ? "Video Generation Failed"
              : "Generating Your 2.5D Vox Reel..."}
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Topic: <span className="text-neutral-200 font-bold">{reel?.topic || "Documentary Story"}</span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-amber-400 font-mono">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-950 rounded-full h-3 mb-8 p-0.5 border border-neutral-800 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            status === "failed"
              ? "bg-red-500"
              : status === "completed"
              ? "bg-emerald-400"
              : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 animate-pulse"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ERROR STATE CARD */}
      {status === "failed" ? (
        <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-5 mb-6 text-red-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">⚠️</span>
            <h4 className="font-extrabold text-sm uppercase tracking-wide">Pipeline Error Encountered</h4>
          </div>
          <p className="text-xs font-mono text-red-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-red-900/60 mb-4">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-all shadow-lg shadow-red-500/20"
          >
            🔄 Try Generating Again
          </button>
        </div>
      ) : (
        /* STEP LIST INDICATOR */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PIPELINE_STEPS.map((item) => {
            const isFinished = currentStep > item.step || status === "completed";
            const isCurrent = currentStep === item.step && status !== "completed";

            return (
              <div
                key={item.step}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isFinished
                    ? "bg-neutral-950/60 border-emerald-500/30 text-neutral-300"
                    : isCurrent
                    ? "bg-amber-950/40 border-amber-500/60 text-white shadow-lg shadow-amber-500/10"
                    : "bg-neutral-950/30 border-neutral-800/60 text-neutral-500 opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    isFinished
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : isCurrent
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-bounce"
                      : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {isFinished ? "✓" : item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold truncate">
                      {item.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 animate-pulse">
                        PROCESSING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono leading-tight mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
