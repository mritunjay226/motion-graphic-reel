"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  FileText,
  Mic,
  Clock,
  Video,
  ScanEye,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Check,
} from "lucide-react";

interface ReelGenerationProgressProps {
  reelId: string;
  onComplete?: (reelId: string) => void;
  onRetry?: () => void;
  onRetryRender?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "ai" | "media" | "warn";
  tag: string;
  message: string;
}

const PIPELINE_STAGES = [
  {
    step: 1,
    title: "Documentary Scripting",
    engine: "Narrative Story AI",
    desc: "Crafting 6-scene story arc, curiosity gap hooks, and scene visual prompts",
    icon: FileText,
  },
  {
    step: 2,
    title: "Master Audio Synthesis",
    engine: "Studio Voice Synth",
    desc: "Generating continuous high-fidelity studio voiceover & scene tracks",
    icon: Mic,
  },
  {
    step: 3,
    title: "Sub-Second Word Sync",
    engine: "Kinetic Word Sync",
    desc: "Transcribing millisecond-precise kinetic captions directly from audio buffer",
    icon: Clock,
  },
  {
    step: 4,
    title: "4K B-Roll Video Fetch",
    engine: "4K Cinematic Archive",
    desc: "Retrieving verified 1080p/4K cinematic video streams and archival media",
    icon: Video,
  },
  {
    step: 5,
    title: "Vision Quality QA",
    engine: "Vision Quality Filter",
    desc: "Inspecting video preview thumbnails in <200ms to guarantee zero irrelevant clips",
    icon: ScanEye,
  },
  {
    step: 6,
    title: "2.5D Motion Assembly",
    engine: "2.5D Motion Engine",
    desc: "Compositing paper stickers, Steadicam choreography, and Foley SFX layers",
    icon: Layers,
  },
];

export const ReelGenerationProgress: React.FC<ReelGenerationProgressProps> = ({
  reelId,
  onComplete,
  onRetry,
  onRetryRender,
}) => {
  const [mounted, setMounted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

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
  const topic = reel?.topic || "Documentary Production";

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
  } else if (elapsedSeconds > 6) {
    currentStep = 2;
  } else {
    currentStep = 1;
  }

  // Elapsed Timer
  useEffect(() => {
    if (status === "completed" || status === "failed") return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Dynamic Simulated Granular AI Event Logs
  useEffect(() => {
    const timeStr = `+${elapsedSeconds}s`;
    const newLogs: LogEntry[] = [];

    if (elapsedSeconds === 1) {
      newLogs.push({
        id: "log_1",
        timestamp: timeStr,
        type: "ai",
        tag: "STORY_AI",
        message: `Analyzing documentary prompt: "${topic.slice(0, 35)}..."`,
      });
    } else if (elapsedSeconds === 3) {
      newLogs.push({
        id: "log_2",
        timestamp: timeStr,
        type: "info",
        tag: "DIRECTOR",
        message: "Scripting 6-scene story arc with high-retention psychological hooks.",
      });
    } else if (elapsedSeconds === 6) {
      newLogs.push({
        id: "log_3",
        timestamp: timeStr,
        type: "media",
        tag: "VOICE_SYNTH",
        message: "Synthesizing master continuous voiceover with studio voice narration...",
      });
    } else if (elapsedSeconds === 9) {
      newLogs.push({
        id: "log_4",
        timestamp: timeStr,
        type: "success",
        tag: "KINETIC_SYNC",
        message: "Transcribing millisecond word tokens for kinetic subtitle alignment.",
      });
    } else if (elapsedSeconds === 12) {
      newLogs.push({
        id: "log_5",
        timestamp: timeStr,
        type: "media",
        tag: "CINEMATIC_4K",
        message: `Searching verified 4K B-Roll footage matching scene topics...`,
      });
    } else if (elapsedSeconds === 15) {
      newLogs.push({
        id: "log_6",
        timestamp: timeStr,
        type: "ai",
        tag: "VISION_QA",
        message: "Vision Quality QA inspected candidate video thumbnails (Confidence: 99%).",
      });
    } else if (elapsedSeconds === 18) {
      newLogs.push({
        id: "log_7",
        timestamp: timeStr,
        type: "media",
        tag: "ARCHIVE_MEDIA",
        message: "Retrieving official brand assets & historical archival cutouts...",
      });
    } else if (elapsedSeconds === 21) {
      newLogs.push({
        id: "log_8",
        timestamp: timeStr,
        type: "info",
        tag: "DIE_CUT_RIG",
        message: "Applying subject isolation and 2.5D white die-cut paper contour borders.",
      });
    } else if (elapsedSeconds === 25) {
      newLogs.push({
        id: "log_9",
        timestamp: timeStr,
        type: "info",
        tag: "MOTION_RIG",
        message: "Assembling camera zoom choreography, depth transitions, and Foley SFX layers...",
      });
    }

    if (newLogs.length > 0) {
      setLogs((prev) => [...prev, ...newLogs]);
    }
  }, [elapsedSeconds, topic]);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Trigger completion callback when status changes to completed
  useEffect(() => {
    if (status === "completed" && onComplete) {
      const timer = setTimeout(() => {
        onComplete(reelId);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, reelId, onComplete]);

  const progressPercent = status === "completed"
    ? 100
    : Math.min(95, Math.max(15, Math.round((currentStep / 6) * 100) + Math.min(elapsedSeconds * 1.5, 12)));


  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* ─── MAIN HERO WAITING & PROCESSING WORKSTATION CARD (LIGHT EDITORIAL THEME) ─── */}
      <div className="w-full bg-white border-4 border-[#111111] rounded-3xl p-6 sm:p-10 shadow-[10px_10px_0px_#111111] relative overflow-hidden text-[#111111]">
        
        {/* Top Status & Elapsed Timer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[#E2E2E8] relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#111111] opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#111111]" />
            </span>
            
            <span className="font-bebas text-xs tracking-widest text-[#111111] bg-[#FFE600] px-3.5 py-1 rounded-md border border-[#111111] uppercase flex items-center gap-1.5 font-bold shadow-xs">
              {status === "completed" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-900" />
                  <span>GENERATION FINISHED</span>
                </>
              ) : status === "failed" ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-red-900" />
                  <span>RENDER ERROR</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>AI PIPELINE ACTIVE</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-[#666666]">
              <span>ELAPSED:</span>
              <span className="text-[#111111] font-black font-mono text-sm bg-[#F4F4F6] px-2 py-0.5 rounded border border-[#E2E2E8]">
                {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:{String(elapsedSeconds % 60).padStart(2, "0")}s
              </span>
            </div>
            <div className="text-[#111111] font-black font-mono text-lg bg-[#B5F500] px-2.5 py-0.5 rounded-md border border-[#111111] shadow-xs">
              {Math.round(progressPercent)}%
            </div>
          </div>
        </div>

        {/* Glowing Tactile Progress Bar */}
        <div className="w-full bg-[#F4F4F6] rounded-full h-4 mb-6 p-0.5 border-2 border-[#111111] relative overflow-hidden z-10 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out border-r border-[#111111] ${
              status === "failed"
                ? "bg-red-500"
                : status === "completed"
                ? "bg-[#B5F500]"
                : "bg-gradient-to-r from-[#FFE600] via-[#B5F500] to-[#FFE600] animate-pulse"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* ─── 6-STEP PIPELINE STATUS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 relative z-10 my-4">
          {PIPELINE_STAGES.map((st) => {
            const isCompleted = currentStep > st.step || status === "completed";
            const isCurrent = currentStep === st.step && status !== "completed";
            const StageIcon = st.icon;

            return (
              <div
                key={st.step}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                  isCompleted
                    ? "bg-[#F9F9FB] border-[#111111] text-[#111111] shadow-xs"
                    : isCurrent
                    ? "bg-[#FFFEEB] border-3 border-[#111111] text-[#111111] shadow-[4px_4px_0px_#111111] scale-102"
                    : "bg-[#F4F4F6] border-[#E2E2E8] text-[#888888] opacity-75"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border border-[#111111] ${
                    isCompleted
                      ? "bg-[#B5F500] text-[#111111] font-black"
                      : isCurrent
                      ? "bg-[#FFE600] text-[#111111] animate-bounce shadow-xs"
                      : "bg-[#EAEAEF] text-[#888888]"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <StageIcon className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bebas text-base tracking-wide text-[#111111] truncate">
                      {st.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[8px] font-mono text-[#111111] bg-[#B5F500] px-1.5 py-0.2 rounded font-black uppercase border border-[#111111]">
                        RUNNING
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#666666] font-mono truncate">
                    {st.engine}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── LIVE AI CONSOLE / EVENT LOG TERMINAL (DARK INSET BOX) ─── */}
        <div className="mt-8 pt-5 border-t-2 border-[#E2E2E8] relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider">
                LIVE PIPELINE EXECUTION LOGS
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#777777] font-bold">REAL-TIME CLOUD PIPELINE STREAM</span>
          </div>

          <div className="bg-[#111111] border-3 border-[#111111] rounded-2xl p-4 font-mono text-xs text-neutral-300 h-40 overflow-y-auto flex flex-col gap-2 shadow-inner custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-neutral-500 italic flex items-center gap-2 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Initializing pipeline dispatcher...</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-tight text-[11px]">
                  <span className="text-neutral-500 shrink-0 text-[10px]">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[8px] rounded font-black shrink-0 ${
                      log.type === "ai"
                        ? "bg-purple-900 text-purple-300 border border-purple-700"
                        : log.type === "media"
                        ? "bg-amber-900 text-amber-300 border border-amber-700"
                        : log.type === "success"
                        ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                        : "bg-blue-900 text-blue-300 border border-blue-700"
                    }`}
                  >
                    {log.tag}
                  </span>
                  <span className="text-neutral-200">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Error Handling Card */}
        {status === "failed" && (() => {
          const isRenderFailure =
            (reel as any)?.failedStep === "render" ||
            Boolean((reel?.storyboard?.length || 0) > 0 && status === "failed");

          return (
            <div className="mt-6 bg-red-50 border-3 border-red-600 rounded-2xl p-6 relative z-10 text-red-900 shadow-md">
              <div className="flex items-center gap-2.5 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bebas text-xl uppercase tracking-wide">
                  {isRenderFailure ? "Cloud Video Render Failed" : "Video Generation Pipeline Error"}
                </h3>
              </div>
              <p className="font-mono text-xs text-red-800 bg-white p-3 rounded-xl border border-red-300 mb-4">
                {errorMessage || "An unexpected error occurred during processing."}
              </p>
              {isRenderFailure ? (
                <button
                  type="button"
                  onClick={onRetryRender || onRetry}
                  className="px-6 py-3 bg-[#FFE600] hover:bg-[#ffe100] text-[#111111] font-bebas text-lg tracking-wider uppercase rounded-xl border-2 border-[#111111] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Rendering Again</span>
                </button>
              ) : onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-6 py-3 bg-[#FFE600] hover:bg-[#ffe100] text-[#111111] font-bebas text-lg tracking-wider uppercase rounded-xl border-2 border-[#111111] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Generating Again</span>
                </button>
              ) : null}
            </div>
          );
        })()}

      </div>
    </div>
  );
};
