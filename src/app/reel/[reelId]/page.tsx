"use client";

import React, { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Player, PlayerRef } from "@remotion/player";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";
import { useAssetPreloader } from "@/lib/useAssetPreloader";
import { ReelGenerationProgress } from "@/components/ReelGenerationProgress";
import { StudioNavbar } from "@/components/StudioNavbar";
import { BgMusicSelector } from "@/components/BgMusicSelector";
import { ThemeSelector } from "@/components/ThemeSelector";
import { TactileSfxSelector } from "@/components/TactileSfxSelector";
import { SocialPublishModal } from "@/components/SocialPublishModal";
import FilmTreatment from "@/components/landing/FilmTreatment";
import {
  ArrowLeft,
  Zap,
  Share2,
  Download,
  RefreshCw,
  Film,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  SkipBack,
  SkipForward,
  Scissors,
  Sparkles,
  Layers,
  Video,
} from "lucide-react";

interface ReelPageProps {
  params: Promise<{ reelId: string }>;
}

/**
 * Redesigned 2.5D Motion Graphic Director Suite — Broadcast Player & Custom Transport Studio.
 */
export default function ReelPreviewPage({ params }: ReelPageProps) {
  const resolvedParams = use(params);
  const rawReelId = resolvedParams.reelId;

  const [mounted, setMounted] = useState(false);
  const playerRef = useRef<PlayerRef>(null);

  // Playback & Frame State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [sfxVolume, setSfxVolume] = useState<number>(1.0);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate if rawReelId matches Convex ID format
  const isValidConvexId = Boolean(
    rawReelId &&
    !rawReelId.includes("_") &&
    rawReelId.length >= 10
  );

  // Fetch reel document from Convex DB
  const reel = useQuery(
    api.reels.getReelById,
    mounted && isValidConvexId ? { reelId: rawReelId as Id<"reels"> } : "skip"
  );

  const status = reel?.status || "rendering";

  // Dynamic Theme state with Convex DB sync fallback
  const [activeThemeId, setActiveThemeId] = useState<string>("vox_explainer");
  useEffect(() => {
    if (reel?.themeId) {
      setActiveThemeId(reel.themeId);
    }
  }, [reel?.themeId]);

  // Check if storyboard data is generated and available
  const hasStoryboard = Boolean(
    reel?.storyboard && Array.isArray(reel.storyboard) && reel.storyboard.length > 0
  );

  // Base uncalibrated ExecutionPlan for initial preloader discovery
  const initialPlan = useMemo(() => {
    if (!reel || !hasStoryboard) return null;
    return convertConvexReelToExecutionPlan(reel);
  }, [reel, hasStoryboard]);

  // YouTube-style proactive lookahead buffer hook (warms audio, images, SFX and extracts exact audio durations)
  const preloadStatus = useAssetPreloader(initialPlan, currentFrame);

  // Calibrated Remotion ExecutionPlan with physical audio duration precision
  const executionPlan = useMemo(() => {
    if (!reel || !hasStoryboard) return null;
    return convertConvexReelToExecutionPlan(reel, preloadStatus.audioDurations);
  }, [reel, hasStoryboard, preloadStatus.audioDurations]);

  // Memoize inputProps for Remotion Player
  const inputProps = useMemo(() => {
    if (!executionPlan) return null;
    return {
      plan: executionPlan,
      themeId: activeThemeId,
      enableAudio: !isMuted,
      enableSfx,
      sfxVolume,
      bgMusicUrl: reel?.bgMusicUrl || "/music/documentary_pulse.mp3",
      bgMusicVolume: reel?.bgMusicVolume ?? 0.15,
    };
  }, [executionPlan, activeThemeId, isMuted, enableSfx, sfxVolume, reel?.bgMusicUrl, reel?.bgMusicVolume]);

  // Memoize total duration frames
  const totalFrames = useMemo(() => {
    return executionPlan?.projectMeta.totalDurationFrames || 900;
  }, [executionPlan]);

  // Sync player events
  useEffect(() => {
    const current = playerRef.current;
    if (!current) return;

    const onTimeUpdate = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    current.addEventListener("timeupdate", onTimeUpdate);
    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);

    return () => {
      current.removeEventListener("timeupdate", onTimeUpdate);
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [mounted, inputProps]);

  // Active scene click to seek
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);

  const handleSeekToScene = (startFrame: number, idx: number) => {
    setActiveSceneIndex(idx);
    if (playerRef.current) {
      playerRef.current.seekTo(startFrame);
      playerRef.current.play();
    }
  };

  // Custom Transport Controls Handlers
  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleSeekFrame = (targetFrame: number) => {
    if (!playerRef.current) return;
    const clamped = Math.max(0, Math.min(totalFrames - 1, targetFrame));
    playerRef.current.seekTo(clamped);
  };

  const handleSkipSeconds = (seconds: number) => {
    if (!playerRef.current) return;
    const target = Math.max(0, Math.min(totalFrames - 1, currentFrame + seconds * 30));
    playerRef.current.seekTo(target);
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
  };

  const handleToggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unmute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const stageContainerRef = useRef<HTMLDivElement>(null);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      stageContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // ─── Render / Export State ──────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [renderElapsed, setRenderElapsed] = useState(0);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const renderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRendering = reel?.status === "rendering";
  const hasVideo = Boolean(reel?.videoUrl);

  useEffect(() => {
    if (isRendering && reel?.renderStartedAt) {
      setRenderElapsed(Math.floor((Date.now() - reel.renderStartedAt) / 1000));
      renderTimerRef.current = setInterval(() => {
        setRenderElapsed(Math.floor((Date.now() - (reel.renderStartedAt || Date.now())) / 1000));
      }, 1000);
    } else {
      if (renderTimerRef.current) {
        clearInterval(renderTimerRef.current);
        renderTimerRef.current = null;
      }
      if (!isRendering) setIsExporting(false);
    }
    return () => {
      if (renderTimerRef.current) clearInterval(renderTimerRef.current);
    };
  }, [isRendering, reel?.renderStartedAt]);

  // Retry pipeline handler
  const [isRetrying, setIsRetrying] = useState(false);
  const handleRetry = useCallback(async () => {
    if (!reel || isRetrying) return;
    setIsRetrying(true);
    try {
      await fetch("/api/generate-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId: rawReelId,
          userId: reel.userId || "user_guest",
          topic: reel.topic,
          language: reel.language || "en",
        }),
      });
    } catch (err) {
      console.error("Failed to retry reel generation:", err);
    } finally {
      setIsRetrying(false);
    }
  }, [reel, isRetrying, rawReelId]);

  // Export MP4 handler
  const handleExportMp4 = useCallback(async () => {
    if (isExporting || isRendering) return;
    setIsExporting(true);
    setExportError(null);

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId: rawReelId,
          themeId: activeThemeId,
          bgMusicUrl: reel?.bgMusicUrl,
          bgMusicVolume: reel?.bgMusicVolume,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setExportError(data.error || "Failed to trigger render");
        setIsExporting(false);
      }
    } catch (err: any) {
      setExportError(err.message || "Network error");
      setIsExporting(false);
    }
  }, [isExporting, isRendering, rawReelId, activeThemeId, reel?.bgMusicUrl, reel?.bgMusicVolume]);

  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentTimeSeconds = Math.floor(currentFrame / 30);
  const totalTimeSeconds = Math.floor(totalFrames / 30);

  return (
    <main className="min-h-screen bg-[#F4F4F6] text-[#111111] flex flex-col font-sans selection:bg-[#FFE600] selection:text-black relative overflow-x-hidden">
      {/* Film Treatment Overlay */}
      {/* <FilmTreatment grainOpacity={0.08} scanlines={false} vignette={false} /> */}

      {/* SVG Background Paper Texture */}
      <div className="absolute inset-0 pointer-events-none vox-paper-texture opacity-80 z-0" />
      <div className="absolute inset-0 pointer-events-none vox-halftone opacity-20 z-0" />

      {/* Global Studio Navigation Header */}
      <StudioNavbar />

      {/* Director Control Room Subheader HUD */}
      <div className="border-b-3 border-[#111111] bg-white sticky top-0 z-40 px-6 sm:px-10 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/create-video"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE600] font-black text-[#111111] text-xs transition-all flex items-center gap-2 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-bebas text-sm uppercase tracking-wider">Create New Reel</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase bg-[#111111] text-[#B5F500] px-2.5 py-0.5 rounded">
              TOPIC
            </span>
            <span className="text-sm font-bold text-[#111111] font-sans truncate max-w-md">
              {reel?.topic || rawReelId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mounted && reel && (
            <div className="flex items-center gap-2 font-mono text-xs">
              <span
                className={`px-3 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5 border-2 border-[#111111] shadow-xs ${
                  status === "completed"
                    ? "bg-[#B5F500] text-[#111111]"
                    : status === "failed"
                    ? "bg-red-500 text-white"
                    : "bg-[#FFE600] text-[#111111] animate-pulse"
                }`}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : status === "failed" ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#111111] animate-ping" />
                )}
                <span>STAGE: {status}</span>
              </span>

              <span className="hidden sm:inline-block text-[10px] text-[#555555] font-bold">
                1080×1920 @ 30FPS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Studio Workstation Canvas */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center items-center relative z-10">
        
        {/* GUARD: Display Live Progress Component if Video Generation is Still In Progress */}
        {!hasStoryboard && status !== "completed" ? (
          <div className="w-full max-w-3xl my-8">
            <ReelGenerationProgress
              reelId={rawReelId}
              onRetry={handleRetry}
              onRetryRender={handleExportMp4}
            />
          </div>
        ) : (
          /* COMPLETED: 2.5D Motion Reel Player + Director Control Suite */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: 9:16 VIDEO PLAYER & STUDIO TRANSPORT SUITE (7 cols) ── */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="bg-white border-4 border-[#111111] p-5 rounded-3xl shadow-[12px_12px_0px_#111111] w-full max-w-[430px] flex flex-col items-center relative group">
                
                {/* Top Viewfinder Bezel HUD */}
                <div className="w-full flex items-center justify-between border-b-2 border-[#111111] pb-3 mb-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5 font-black text-[#111111]">
                    <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-red-600 animate-pulse" : "bg-neutral-400"}`} />
                    <span>VIEWFINDER 9:16 {isPlaying ? "[PLAYING]" : "[PAUSED]"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* YouTube-Style Stream Buffer Status Badge */}
                    <span
                      className={`font-mono font-black px-2 py-0.5 rounded border border-[#111111] text-[10px] flex items-center gap-1 ${
                        preloadStatus.isFullyBuffered
                          ? "bg-[#B5F500] text-[#111111]"
                          : "bg-amber-100 text-amber-900 animate-pulse"
                      }`}
                    >
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      {preloadStatus.isFullyBuffered
                        ? "STREAM BUFFERED"
                        : `BUFFERING ${preloadStatus.progressPercent}%`}
                    </span>
                    <span className="bg-[#FFE600] text-[#111111] font-black px-2 py-0.5 rounded border border-[#111111] text-[10px]">
                      {totalTimeSeconds}s DURATION
                    </span>
                    <span className="text-neutral-500 font-bold text-[10px]">
                      {totalFrames} FRAMES
                    </span>
                  </div>
                </div>

                {/* 9:16 Vertical Video Frame Stage */}
                <div
                  ref={stageContainerRef}
                  onClick={handleTogglePlay}
                  className="w-full aspect-[9/16] rounded-2xl overflow-hidden border-3 border-[#111111] bg-[#111111] relative z-10 shadow-inner cursor-pointer select-none group/stage"
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
                            <span className="w-8 h-8 border-3 border-[#B5F500] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[11px] font-mono font-bold text-[#B5F500]">
                              STREAM BUFFERING 45 FRAMES...
                            </p>
                          </div>
                        )}
                        style={{ width: "100%", height: "100%" }}
                        controls={false}
                        autoPlay={false}
                        loop
                        spaceKeyToPlayOrPause
                        doubleClickToFullscreen
                        clickToPlay
                      />

                      {/* Floating Tactile Play Button Overlay When Paused */}
                      <AnimatePresence>
                        {!isPlaying && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px]"
                          >
                            <div className="w-18 h-18 rounded-2xl bg-[#B5F500] text-[#111111] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] flex items-center justify-center transform group-hover/stage:scale-110 transition-transform">
                              <Play className="w-9 h-9 fill-current ml-1" />
                            </div>
                            <span className="mt-3 px-3 py-1 rounded-full bg-[#111111] text-white font-bebas text-sm uppercase tracking-wider border border-[#FFE600] shadow-md">
                              CLICK OR SPACE TO PLAY
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3 text-neutral-400">
                      <span className="w-8 h-8 border-3 border-[#B5F500] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono font-bold text-white">
                        Hydrating 2.5D Motion Reel...
                      </p>
                    </div>
                  )}
                </div>

                {/* ── CUSTOM STUDIO TRANSPORT CONTROLLER SUITE ── */}
                <div className="mt-4 w-full bg-[#F4F4F6] border-2 border-[#111111] p-3.5 rounded-2xl flex flex-col gap-3 shadow-xs">
                  
                  {/* Timeline Scrubber Track */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#111111]">
                      <span>
                        {String(Math.floor(currentTimeSeconds / 60)).padStart(2, "0")}:{String(currentTimeSeconds % 60).padStart(2, "0")} / {String(Math.floor(totalTimeSeconds / 60)).padStart(2, "0")}:{String(totalTimeSeconds % 60).padStart(2, "0")}
                      </span>
                      <span className="text-[#666666] text-[10px]">
                        FRAME {currentFrame} / {totalFrames}
                      </span>
                    </div>

                    {/* Interactive YouTube-Style Multi-Layer Scrubber Slider */}
                    <div className="relative w-full h-4 flex items-center group/scrubber">
                      {/* Layer 1: Base Track Background */}
                      <div className="absolute inset-x-0 h-2 bg-[#E2E2E8] rounded-full border border-[#111111] overflow-hidden">
                        {/* Layer 2: YouTube-Style Lookahead Buffer Bar (Pre-loaded frames ahead) */}
                        <div
                          className="h-full bg-[#B5F500]/60 transition-all duration-150 ease-out"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                preloadStatus.progressPercent,
                                Math.round(((currentFrame + 45) / totalFrames) * 100)
                              )
                            )}%`,
                          }}
                        />
                        {/* Layer 3: Active Played Progress Bar */}
                        <div
                          className="absolute inset-y-0 left-0 bg-[#111111] transition-all duration-75 ease-out"
                          style={{
                            width: `${Math.min(100, Math.round((currentFrame / totalFrames) * 100))}%`,
                          }}
                        />
                      </div>

                      {/* Layer 4: Interactive Invisible Range Input Overlaid */}
                      <input
                        type="range"
                        min={0}
                        max={totalFrames - 1}
                        value={currentFrame}
                        onChange={(e) => handleSeekFrame(Number(e.target.value))}
                        className="relative z-10 w-full h-4 opacity-0 cursor-pointer"
                      />

                      {/* Thumb Marker */}
                      <div
                        className="absolute w-3.5 h-3.5 bg-[#FFE600] border-2 border-[#111111] rounded-full shadow-xs pointer-events-none transform -translate-x-1/2 transition-transform group-hover/scrubber:scale-125"
                        style={{
                          left: `${Math.min(100, Math.max(0, (currentFrame / totalFrames) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Primary Transport Control Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#DCDCE2]">
                    <div className="flex items-center gap-1.5">
                      {/* Restart / Seek to 0 */}
                      <button
                        type="button"
                        onClick={handleRestart}
                        title="Restart Reel"
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFE600] border-2 border-[#111111] flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* -1s Jump */}
                      <button
                        type="button"
                        onClick={() => handleSkipSeconds(-1)}
                        title="Rewind 1s"
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFE600] border-2 border-[#111111] flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                      >
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Main Big Play / Pause Button */}
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="px-6 py-2 rounded-xl bg-[#FFE600] hover:bg-[#B5F500] text-[#111111] font-bebas text-lg uppercase tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>PAUSE</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>PLAY REEL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* +1s Jump */}
                      <button
                        type="button"
                        onClick={() => handleSkipSeconds(1)}
                        title="Forward 1s"
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFE600] border-2 border-[#111111] flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>

                      {/* Mute Toggle */}
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                        className={`w-8 h-8 rounded-lg border-2 border-[#111111] flex items-center justify-center transition-all cursor-pointer shadow-xs active:translate-y-0.5 ${
                          isMuted ? "bg-red-100 text-red-700" : "bg-white hover:bg-[#FFE600] text-[#111111]"
                        }`}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Fullscreen */}
                      <button
                        type="button"
                        onClick={handleToggleFullscreen}
                        title="Toggle Fullscreen"
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFE600] border-2 border-[#111111] flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs active:translate-y-0.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Frame Quick Scene Jump Bar */}
                <div className="mt-4 w-full pt-3 border-t-2 border-[#E2E2E8]">
                  <span className="text-[10px] font-mono font-black uppercase text-[#666666] block mb-2">
                    FAST SCENE JUMP:
                  </span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {reel?.storyboard?.map((sc: any, idx: number) => {
                      const isSelected = activeSceneIndex === idx;
                      const sFrame = sc.startFrame ?? 0;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSeekToScene(sFrame, idx)}
                          className={`py-1.5 px-1 rounded-lg font-bebas text-sm uppercase transition-all border-2 cursor-pointer ${
                            isSelected
                              ? "bg-[#B5F500] text-[#111111] border-[#111111] shadow-xs"
                              : "bg-[#F4F4F6] text-[#555555] border-[#E2E2E8] hover:border-[#111111]"
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* ── RIGHT COLUMN: FAST-LANE 1-CLICK COMMAND CENTER (5 cols) ── */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* 1. PRIMARY HIGH-VELOCITY EXPORT & SOCIAL PUBLISH CARD */}
              <div className="bg-white border-4 border-[#111111] rounded-3xl p-6 shadow-[10px_10px_0px_#111111] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#E2E2E8] pb-3">
                  <span className="text-xs font-bebas tracking-wider text-[#111111] bg-[#B5F500] px-3 py-1 rounded-md border border-[#111111] uppercase flex items-center gap-1.5 font-bold shadow-xs">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>1-CLICK PUBLISH & EXPORT</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">
                    INSTAGRAM • YOUTUBE • MP4
                  </span>
                </div>

                {/* ── Currently Rendering on Cloud GPU State ── */}
                {isRendering && (
                  <div className="space-y-3 bg-[#111111] text-white p-4 rounded-2xl border-2 border-[#111111]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="w-9 h-9 rounded-full bg-[#B5F500]/20 border-2 border-[#B5F500] border-t-transparent animate-spin flex items-center justify-center" />
                        <span className="absolute inset-0 w-9 h-9 rounded-full bg-[#B5F500]/10 animate-ping" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white font-bebas tracking-wide">Compiling 1080p MP4 on Cloud GPU...</p>
                        <p className="text-xs text-neutral-400 font-mono">1080×1920 @ 30fps • Cloud CDN</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 font-mono">
                      <span className="text-neutral-400">Elapsed GPU Time</span>
                      <span className="font-bold text-[#FFE600] tabular-nums">
                        {formatElapsed(renderElapsed)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                      <div
                        className="h-full bg-gradient-to-r from-[#B5F500] to-[#FFE600] rounded-full animate-pulse"
                        style={{ width: `${Math.min(95, (renderElapsed / 120) * 100)}%`, transition: "width 1s linear" }}
                      />
                    </div>
                  </div>
                )}

                {/* ── Has Rendered Video Ready ── */}
                {hasVideo && !isRendering && (
                  <div className="space-y-3">
                    <div className="bg-[#FFFEEB] border-2 border-[#111111] rounded-2xl p-4 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                            1080p MP4 Ready
                          </span>
                        </div>
                        {reel?.renderDurationMs && (
                          <span className="text-[10px] text-neutral-500 font-mono font-bold">
                            Rendered in {(reel.renderDurationMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>

                      {/* 1-Click Publish to Instagram & YouTube */}
                      <button
                        onClick={() => setIsSocialModalOpen(true)}
                        className="w-full mb-3 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bebas text-xl uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 hover:opacity-95 text-white transition-all shadow-md border-2 border-[#111111] cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>1-CLICK PUBLISH TO INSTAGRAM & YOUTUBE</span>
                      </button>

                      {/* Direct MP4 Download Button */}
                      <a
                        href={reel?.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bebas text-lg uppercase tracking-wider bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] transition-all border-2 border-[#111111] shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download 1080p MP4 File</span>
                      </a>

                      {/* Social Post Badges */}
                      {reel?.socialPosts && reel.socialPosts.length > 0 && (
                        <div className="mt-3 pt-3 border-t-2 border-[#E2E2E8] space-y-1.5 font-mono">
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 block mb-1">
                            Dispatched Channel Feeds:
                          </span>
                          {reel.socialPosts.map((p: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-[#111111]"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    p.status === "published"
                                      ? "bg-emerald-500"
                                      : p.status === "failed"
                                      ? "bg-red-500"
                                      : "bg-amber-500 animate-pulse"
                                  }`}
                                />
                                <span className="font-bold text-[#111111] capitalize">
                                  {p.platform}
                                </span>
                              </div>
                              {p.postUrl ? (
                                <a
                                  href={p.postUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-600 font-bold hover:underline flex items-center gap-1"
                                >
                                  <span>View Live Reel</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-[10px] uppercase text-neutral-500 font-bold">
                                  {p.status}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleExportMp4}
                      disabled={isExporting}
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#FFE600] transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-render MP4 with Current Style Settings</span>
                    </button>
                  </div>
                )}

                {/* ── No Rendered Video Yet — Export Trigger ── */}
                {!hasVideo && !isRendering && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#555555] font-medium leading-relaxed">
                      Preview your reel in the 9:16 player, customize theme & music below, then compile your broadcast-ready MP4.
                    </p>
                    <button
                      onClick={handleExportMp4}
                      disabled={isExporting || status !== "completed"}
                      className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bebas text-2xl uppercase tracking-wider bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] transition-all border-3 border-[#111111] shadow-[4px_4px_0px_#111111] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isExporting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Cloud GPU Render...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-current" />
                          <span>RENDER 1080P BROADCAST MP4</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-[#777777] text-center font-mono font-bold">
                      High-Speed Cloud GPU • ~60s • Auto-Uploads to High-Speed CDN
                    </p>
                  </div>
                )}

                {/* Error Banner with Try Rendering Again Button */}
                {(exportError || (reel?.status === "failed" && (reel?.failedStep === "render" || hasStoryboard))) && (
                  <div className="mt-4 bg-red-50 border-3 border-red-500 rounded-2xl p-4 text-red-900 shadow-xs">
                    <div className="flex items-center gap-2 font-bold text-sm mb-1 text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="font-bebas text-lg uppercase tracking-wide">Cloud Render Failed</span>
                    </div>
                    <p className="font-mono text-[11px] text-red-700 bg-white p-2.5 rounded-xl border border-red-200 mb-3">
                      {exportError || reel?.errorMessage || "Cloud rendering encountered an error."}
                    </p>
                    <button
                      type="button"
                      onClick={handleExportMp4}
                      disabled={isExporting}
                      className="w-full py-2.5 px-4 bg-[#FFE600] hover:bg-[#ffe100] text-[#111111] font-bebas text-lg uppercase tracking-wider rounded-xl border-2 border-[#111111] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[2px_2px_0px_#111111] active:translate-y-0.5 active:shadow-none"
                    >
                      <RefreshCw className={`w-4 h-4 ${isExporting ? "animate-spin" : ""}`} />
                      <span>Try Rendering Again</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. THEME & PALETTE SELECTOR */}
              <div className="border-3 border-[#111111] rounded-3xl overflow-hidden shadow-vox">
                <ThemeSelector
                  reelId={rawReelId as Id<"reels">}
                  currentThemeId={activeThemeId}
                  onThemeChange={(_styleId, _paletteId, combinedThemeId) => setActiveThemeId(combinedThemeId)}
                />
              </div>

              {/* 3. BACKGROUND MUSIC & AUDIO VOLUME SELECTOR */}
              <div className="border-3 border-[#111111] rounded-3xl overflow-hidden shadow-vox">
                <BgMusicSelector
                  reelId={rawReelId as Id<"reels">}
                  currentBgMusicUrl={reel?.bgMusicUrl}
                  currentBgMusicVolume={reel?.bgMusicVolume}
                />
              </div>

              {/* 4. TACTILE FOLEY SFX MASTER CONTROL & AUDITION STUDIO */}
              <TactileSfxSelector
                sfxVolume={sfxVolume}
                enableSfx={enableSfx}
                onVolumeChange={setSfxVolume}
                onToggleEnable={setEnableSfx}
              />

              {/* 5. INTERACTIVE STORYBOARD & TIMELINE SCRUBBER */}
              <div className="bg-white border-4 border-[#111111] rounded-3xl p-6 shadow-[10px_10px_0px_#111111]">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#E2E2E8] pb-3">
                  <span className="text-xs font-bebas tracking-wider text-[#111111] bg-[#FFE600] px-3 py-1 rounded-md border border-[#111111] uppercase flex items-center gap-1.5 font-bold shadow-xs">
                    <Film className="w-3.5 h-3.5" />
                    <span>INTERACTIVE STORYBOARD</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">
                    CLICK TO SEEK SCENE
                  </span>
                </div>

                <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {reel?.storyboard?.map((sc: any, idx: number) => {
                    const isSelected = activeSceneIndex === idx;
                    const sFrame = sc.startFrame ?? 0;

                    return (
                      <div
                        key={sc.sceneId || idx}
                        onClick={() => handleSeekToScene(sFrame, idx)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#FFFEEB] border-[#111111] shadow-md"
                            : "bg-[#F9F9FB] border-[#E2E2E8] hover:border-[#111111]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#111111] ${
                            isSelected
                              ? "bg-[#B5F500] text-[#111111]"
                              : "bg-[#111111] text-[#FFE600]"
                          }`}>
                            SCENE 0{sc.sceneId || idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 font-bold">
                            Frame: {sFrame}
                          </span>
                        </div>
                        <h4 className="font-bebas text-xl text-[#111111] leading-tight mb-1">
                          {sc.headline}
                        </h4>
                        <p className="text-xs text-[#555555] font-medium line-clamp-2 leading-relaxed">
                          "{sc.narration}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Zernio Social Publishing Modal Dialog */}
      {hasVideo && (
        <SocialPublishModal
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
          reelId={rawReelId}
          videoUrl={reel?.videoUrl || ""}
          topic={reel?.topic || ""}
          title={reel?.title || ""}
          storyboardSummary={reel?.storyboard?.map((s: any) => s.narration).join(" ")}
          heroImageUrl={reel?.storyboard?.[0]?.imageUrl || reel?.storyboard?.[1]?.imageUrl}
          existingSocialPosts={reel?.socialPosts}
        />
      )}
    </main>
  );
}
