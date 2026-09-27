"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import { LogEntry, PIPELINE_STAGES } from "./progress/constants";
import { ProgressHeader } from "./progress/ProgressHeader";
import { ProgressStageStepper } from "./progress/ProgressStageStepper";
import { ProgressTerminalLogs } from "./progress/ProgressTerminalLogs";
import { ProgressErrorCard } from "./progress/ProgressErrorCard";

export type { LogEntry };
export { PIPELINE_STAGES };

export interface ReelGenerationProgressProps {
  reelId: string;
  onComplete?: (reelId: string) => void;
  onRetry?: () => void;
  onRetryRender?: () => void;
}

export const ReelGenerationProgress: React.FC<ReelGenerationProgressProps> = ({
  reelId,
  onComplete,
  onRetry,
  onRetryRender,
}) => {
  const [mounted, setMounted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

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
  const errorMessage = reel?.errorMessage || "An unrecoverable error occurred during video generation.";
  const topic = reel?.topic || "Documentary Production";

  const dbCurrentStep = (reel as any)?.currentStep;
  const dbProgressPercent = (reel as any)?.progressPercent;
  const dbProgressMessage = (reel as any)?.progressMessage;

  let currentStep = 1;
  if (status === "completed") {
    currentStep = 6;
  } else if (typeof dbCurrentStep === "number" && dbCurrentStep >= 1) {
    currentStep = dbCurrentStep;
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

  // Append real pipeline progress messages from Convex to logs
  useEffect(() => {
    if (!dbProgressMessage) return;
    setLogs((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].message === dbProgressMessage) {
        return prev;
      }
      return [
        ...prev,
        {
          id: `log_db_${Date.now()}`,
          timestamp: `+${elapsedSeconds}s`,
          type: "ai",
          tag: "PIPELINE",
          message: dbProgressMessage,
        },
      ];
    });
  }, [dbProgressMessage, elapsedSeconds]);

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
    : (typeof dbProgressPercent === "number"
      ? Math.min(98, Math.max(5, dbProgressPercent))
      : Math.min(95, Math.max(10, Math.round((currentStep / 6) * 100))));

  const isRenderFailure =
    (reel as any)?.failedStep === "render" ||
    Boolean((reel?.storyboard?.length || 0) > 0 && status === "failed");

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden text-[#1D1D1F]">
        {/* 1. Header with Progress Bar */}
        <ProgressHeader
          status={status}
          elapsedSeconds={elapsedSeconds}
          progressPercent={progressPercent}
          dbProgressMessage={dbProgressMessage}
        />

        {/* 2. 6-Step Pipeline Status Grid */}
        <ProgressStageStepper
          currentStep={currentStep}
          status={status}
        />

        {/* 3. Live AI Console / Event Log Terminal */}
        <ProgressTerminalLogs logs={logs} />

        {/* 4. Error Handling Card */}
        <ProgressErrorCard
          status={status}
          isRenderFailure={isRenderFailure}
          errorMessage={errorMessage}
          onRetry={onRetry}
          onRetryRender={onRetryRender}
        />
      </div>
    </div>
  );
};

