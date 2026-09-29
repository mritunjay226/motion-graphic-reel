"use client";

import React, { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerRef } from "@remotion/player";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";
import { useAssetPreloader } from "@/lib/useAssetPreloader";
import { ReelGenerationProgress } from "@/components/ReelGenerationProgress";
import { StudioNavbar } from "@/components/StudioNavbar";
import { BgMusicSelector } from "@/components/BgMusicSelector";
import { ThemeSelector } from "@/components/ThemeSelector";
import { BgTextureSelector } from "@/components/BgTextureSelector";
import { TactileSfxSelector } from "@/components/TactileSfxSelector";
import { VoiceoverSelector } from "@/components/VoiceoverSelector";
import { SocialPublishModal } from "@/components/SocialPublishModal";
import { SceneEditorModal } from "@/components/SceneEditorModal";
import { StockVideoPickerModal } from "@/components/StockVideoPickerModal";

// Studio Modular Components
import { ReelStudioHeader } from "@/components/studio/ReelStudioHeader";
import { ReelVideoMonitor } from "@/components/studio/ReelVideoMonitor";
import { TransportControls } from "@/components/studio/TransportControls";
import { SceneTimelineStrip } from "@/components/studio/SceneTimelineStrip";
import { StudioInspector, InspectorTab } from "@/components/studio/inspector/StudioInspector";
import { StoryboardTab } from "@/components/studio/inspector/tabs/StoryboardTab";
import { ExportTab } from "@/components/studio/inspector/tabs/ExportTab";

export type { InspectorTab };

interface ReelPageProps {
  params: Promise<{ reelId: string }>;
}

export default function ReelPreviewPage({ params }: ReelPageProps) {
  const resolvedParams = use(params);
  const rawReelId = resolvedParams.reelId;

  const [mounted, setMounted] = useState(false);
  const playerRef = useRef<PlayerRef>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Playback & Frame State
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapFeedback, setTapFeedback] = useState<"play" | "pause" | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [sfxVolume, setSfxVolume] = useState<number>(1.0);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);

  // Inspector Panel Active Tab
  const [activeTab, setActiveTab] = useState<InspectorTab>("storyboard");

  // Scene Editor & Stock Picker Modals
  const [isSceneEditorOpen, setIsSceneEditorOpen] = useState(false);
  const [editingSceneIndex, setEditingSceneIndex] = useState<number>(0);
  const [isDirectStockPickerOpen, setIsDirectStockPickerOpen] = useState(false);
  const [stockPickerTargetSceneIdx, setStockPickerTargetSceneIdx] = useState<number>(0);

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

  // Voiceover Narrator state with Convex sync
  const [activeVoiceId, setActiveVoiceId] = useState<string>(
    (reel as any)?.voiceId || "fenrir_gemini"
  );
  const [activeVoiceStyle, setActiveVoiceStyle] = useState<string>(
    (reel as any)?.voiceStyle || "investigative"
  );

  useEffect(() => {
    if ((reel as any)?.voiceId) {
      setActiveVoiceId((reel as any).voiceId);
    }
    if ((reel as any)?.voiceStyle) {
      setActiveVoiceStyle((reel as any).voiceStyle);
    }
  }, [(reel as any)?.voiceId, (reel as any)?.voiceStyle]);

  // Dynamic Background Texture & Paper Tooth state
  const [activeTextureType, setActiveTextureType] = useState<string>("paper_fiber");
  const [activeTextureOpacity, setActiveTextureOpacity] = useState<number>(0.18);
  const [enableInfiniteCanvas, setEnableInfiniteCanvas] = useState<boolean>(true);
  const [enableLoop, setEnableLoop] = useState<boolean>(false);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false);

  // Check if storyboard data is generated and available
  const hasStoryboard = Boolean(
    reel?.storyboard && Array.isArray(reel.storyboard) && reel.storyboard.length > 0
  );

  // Base uncalibrated ExecutionPlan for initial preloader discovery
  const initialPlan = useMemo(() => {
    if (!reel || !hasStoryboard) return null;
    return convertConvexReelToExecutionPlan(reel);
  }, [reel, hasStoryboard]);

  // Proactive lookahead buffer hook
  const preloadStatus = useAssetPreloader(initialPlan, currentFrame);

  // Calibrated Remotion ExecutionPlan
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
      textureType: activeTextureType,
      paperTextureOpacity: activeTextureOpacity,
      enableAudio: !isMuted,
      voiceId: activeVoiceId,
      enableSfx,
      sfxVolume,
      bgMusicUrl: reel?.bgMusicUrl || "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
      bgMusicVolume: reel?.bgMusicVolume ?? 0.15,
      enableInfiniteCanvas,
      enableLoop,
      showSafeZones,
    };
  }, [
    executionPlan,
    activeThemeId,
    activeTextureType,
    activeTextureOpacity,
    isMuted,
    activeVoiceId,
    enableSfx,
    sfxVolume,
    reel?.bgMusicUrl,
    reel?.bgMusicVolume,
    enableInfiniteCanvas,
    enableLoop,
    showSafeZones,
  ]);

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

  // Active scene tracking based on current frame
  const activeSceneIndex = useMemo(() => {
    if (!reel?.storyboard || reel.storyboard.length === 0) return 0;
    const foundIdx = reel.storyboard.findIndex((sc: any) => {
      const s = sc.startFrame ?? 0;
      const d = sc.durationFrames ?? 90;
      return currentFrame >= s && currentFrame < s + d;
    });
    return foundIdx >= 0 ? foundIdx : 0;
  }, [reel?.storyboard, currentFrame]);

  const handleSeekToScene = (startFrame: number, _idx: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(startFrame);
      playerRef.current.play();
    }
  };

  // Custom Transport Controls Handlers
  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!playerRef.current) return;
    try {
      const currentlyPlaying = playerRef.current.isPlaying();
      if (currentlyPlaying) {
        playerRef.current.pause();
        setIsPlaying(false);
        setTapFeedback("pause");
      } else {
        playerRef.current.play();
        setIsPlaying(true);
        setTapFeedback("play");
      }
    } catch {
      if (isPlaying) {
        playerRef.current.pause();
        setIsPlaying(false);
        setTapFeedback("pause");
      } else {
        playerRef.current.play();
        setIsPlaying(true);
        setTapFeedback("play");
      }
    }
    setTimeout(() => setTapFeedback(null), 450);
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

  const currentTimeSeconds = Math.floor(currentFrame / 30);
  const totalTimeSeconds = Math.floor(totalFrames / 30);

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#0071E3] selection:text-white relative overflow-x-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none" />

      {/* Global Studio Top Navigation */}
      <StudioNavbar />

      {/* ─── UNIFIED PRO STUDIO TELEMETRY HEADER ─── */}
      <ReelStudioHeader
        rawReelId={rawReelId}
        topic={reel?.topic}
        title={reel?.title}
        totalTimeSeconds={totalTimeSeconds}
        status={status}
        hasVideo={hasVideo}
        videoUrl={reel?.videoUrl}
        isRendering={isRendering}
        isExporting={isExporting}
        onOpenSocialModal={() => setIsSocialModalOpen(true)}
        onExportMp4={handleExportMp4}
      />

      {/* ─── MAIN PRO STUDIO WORKSPACE ─── */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-6 flex flex-col gap-6 relative z-10">
        {!hasStoryboard && status !== "completed" ? (
          <div className="w-full max-w-3xl mx-auto my-8">
            <ReelGenerationProgress
              reelId={rawReelId}
              onRetry={handleRetry}
              onRetryRender={handleExportMp4}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Top Row: Video Viewport Monitor (Left) + Tabbed Studio Inspector (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ── LEFT: 9:16 VIDEO MONITOR & TRANSPORT CONTROLS ── */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] p-4 rounded-[28px] sm:rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] w-full max-w-[400px] flex flex-col items-center relative">
                  <ReelVideoMonitor
                    playerRef={playerRef}
                    stageContainerRef={stageContainerRef}
                    inputProps={inputProps}
                    totalFrames={totalFrames}
                    currentFrame={currentFrame}
                    isPlaying={isPlaying}
                    tapFeedback={tapFeedback}
                    preloadStatus={preloadStatus}
                    mounted={mounted}
                    onTogglePlay={handleTogglePlay}
                    showSafeZones={showSafeZones}
                    onToggleSafeZones={() => setShowSafeZones((prev) => !prev)}
                    enableInfiniteCanvas={enableInfiniteCanvas}
                    onToggleInfiniteCanvas={() => setEnableInfiniteCanvas((prev) => !prev)}
                    enableLoop={enableLoop}
                    onToggleLoop={() => setEnableLoop((prev) => !prev)}
                  />

                  <TransportControls
                    currentFrame={currentFrame}
                    totalFrames={totalFrames}
                    currentTimeSeconds={currentTimeSeconds}
                    totalTimeSeconds={totalTimeSeconds}
                    activeSceneIndex={activeSceneIndex}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    preloadStatus={preloadStatus}
                    onSeekFrame={handleSeekFrame}
                    onTogglePlay={() => handleTogglePlay()}
                    onRestart={handleRestart}
                    onSkipSeconds={handleSkipSeconds}
                    onToggleMute={handleToggleMute}
                    onToggleFullscreen={handleToggleFullscreen}
                  />
                </div>
              </div>

              {/* ── RIGHT: TABBED PRO STUDIO INSPECTOR ── */}
              <div className="lg:col-span-7 flex flex-col">
                <StudioInspector
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  sceneCount={reel?.storyboard?.length || 6}
                >
                  {activeTab === "storyboard" && (
                    <StoryboardTab
                      storyboard={reel?.storyboard}
                      activeSceneIndex={activeSceneIndex}
                      onSeekToScene={handleSeekToScene}
                      onEditScene={(idx) => {
                        setEditingSceneIndex(idx);
                        setIsSceneEditorOpen(true);
                      }}
                      onDirectStockPicker={(idx) => {
                        setStockPickerTargetSceneIdx(idx);
                        setIsDirectStockPickerOpen(true);
                      }}
                    />
                  )}

                  {activeTab === "style" && (
                    <div className="rounded-2xl sm:rounded-3xl border border-black/[0.06] bg-white/70 overflow-hidden shadow-xs">
                      <ThemeSelector
                        reelId={rawReelId as Id<"reels">}
                        currentThemeId={activeThemeId}
                        onThemeChange={(_styleId, _paletteId, combinedThemeId) => setActiveThemeId(combinedThemeId)}
                      />
                    </div>
                  )}

                  {activeTab === "canvas" && (
                    <div className="space-y-4">
                      {/* 3D Spatial Canvas & Retention Safe Zone Controls */}
                      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.06] bg-white/70 p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                          <div>
                            <h4 className="text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider">
                              Camera & Spatial Stage
                            </h4>
                            <p className="text-[11px] text-[#86868B] mt-0.5">
                              Configure 3D flight trajectory, loop closure, and social retention guides
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* 3D Infinite Canvas Switch */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                            <div>
                              <span className="text-xs font-medium text-[#1D1D1F] block">
                                3D Infinite Spatial Canvas
                              </span>
                              <span className="text-[11px] text-[#86868B]">
                                Seamless orbital camera flight across investigative documents (Vox style)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEnableInfiniteCanvas((prev) => !prev)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                enableInfiniteCanvas ? "bg-[#0071E3]" : "bg-neutral-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  enableInfiniteCanvas ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Seamless Video Loop Switch */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                            <div>
                              <span className="text-xs font-medium text-[#1D1D1F] block">
                                Seamless Social Loop
                              </span>
                              <span className="text-[11px] text-[#86868B]">
                                Camera smoothly swoops back to Scene 1 in final 30 frames for infinite loop playback
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEnableLoop((prev) => !prev)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                enableLoop ? "bg-[#8B5CF6]" : "bg-neutral-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  enableLoop ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>

                          {/* 9:16 Social Retention Safe Zones Switch */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                            <div>
                              <span className="text-xs font-medium text-[#1D1D1F] block">
                                9:16 Social Safe Zones
                              </span>
                              <span className="text-[11px] text-[#86868B]">
                                Overlay UI boundaries for TikTok, Reels, and YouTube Shorts
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowSafeZones((prev) => !prev)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                showSafeZones ? "bg-[#E11D48]" : "bg-neutral-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  showSafeZones ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Paper Texture Selector */}
                      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.06] bg-white/70 overflow-hidden shadow-xs">
                        <BgTextureSelector
                          currentTextureId={activeTextureType}
                          currentOpacity={activeTextureOpacity}
                          onTextureChange={(texId, op) => {
                            setActiveTextureType(texId);
                            setActiveTextureOpacity(op);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "audio" && (
                    <div className="space-y-5">
                      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.06] bg-white/70 overflow-hidden shadow-xs">
                        <VoiceoverSelector
                          reelId={rawReelId as Id<"reels">}
                          currentVoiceId={activeVoiceId}
                          currentVoiceStyle={activeVoiceStyle}
                          onVoiceChange={(vId, vStyle) => {
                            setActiveVoiceId(vId);
                            if (vStyle) setActiveVoiceStyle(vStyle);
                          }}
                        />
                      </div>

                      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.06] bg-white/70 overflow-hidden shadow-xs">
                        <BgMusicSelector
                          reelId={rawReelId as Id<"reels">}
                          currentBgMusicUrl={reel?.bgMusicUrl}
                          currentBgMusicVolume={reel?.bgMusicVolume}
                        />
                      </div>

                      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.06] bg-white/70 overflow-hidden shadow-xs">
                        <TactileSfxSelector
                          sfxVolume={sfxVolume}
                          enableSfx={enableSfx}
                          onVolumeChange={setSfxVolume}
                          onToggleEnable={setEnableSfx}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "export" && (
                    <ExportTab
                      isRendering={isRendering}
                      hasVideo={hasVideo}
                      renderElapsed={renderElapsed}
                      videoUrl={reel?.videoUrl}
                      isExporting={isExporting}
                      status={status}
                      exportError={exportError}
                      onExportMp4={handleExportMp4}
                      onOpenSocialModal={() => setIsSocialModalOpen(true)}
                    />
                  )}
                </StudioInspector>
              </div>
            </div>

            {/* ── BOTTOM ROW: HORIZONTAL MULTI-TRACK SCENE TIMELINE STRIP ── */}
            <SceneTimelineStrip
              storyboard={reel?.storyboard}
              activeSceneIndex={activeSceneIndex}
              onSeekToScene={handleSeekToScene}
              onEditScene={(idx) => {
                setEditingSceneIndex(idx);
                setIsSceneEditorOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Live Scene Director Modal */}
      {reel?.storyboard && (
        <SceneEditorModal
          isOpen={isSceneEditorOpen}
          onClose={() => setIsSceneEditorOpen(false)}
          reelId={rawReelId}
          sceneIndex={editingSceneIndex}
          scene={reel.storyboard[editingSceneIndex]}
        />
      )}

      {/* Direct Stock Video Picker Modal from Storyboard */}
      {reel?.storyboard && (
        <StockVideoPickerModal
          isOpen={isDirectStockPickerOpen}
          onClose={() => setIsDirectStockPickerOpen(false)}
          initialQuery={reel.storyboard[stockPickerTargetSceneIdx]?.headline || "documentary"}
          onSelectVideo={async (_vid) => {
            setEditingSceneIndex(stockPickerTargetSceneIdx);
            setIsSceneEditorOpen(true);
          }}
        />
      )}

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
