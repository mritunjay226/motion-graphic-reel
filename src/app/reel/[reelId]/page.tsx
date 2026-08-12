"use client";

import React, { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Player } from "@remotion/player";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";
import { ReelGenerationProgress } from "@/components/ReelGenerationProgress";

import { BgMusicSelector } from "@/components/BgMusicSelector";
import { ThemeSelector } from "@/components/ThemeSelector";

interface ReelPageProps {
  params: Promise<{ reelId: string }>;
}

/**
 * Convex Reel Preview Route — Fetches and renders seeded video reels directly from Convex DB.
 *
 * Performance-optimized Remotion player container with strict status loading guards:
 * - Only renders Remotion Player when status === 'completed'
 * - Displays dynamic pipeline progress panel while status is 'rendering' or 'draft'
 */
export default function ReelPreviewPage({ params }: ReelPageProps) {
  const resolvedParams = use(params);
  const rawReelId = resolvedParams.reelId;

  const [mounted, setMounted] = useState(false);
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

  // Convert DB storyboard into hydrated Remotion ExecutionPlan (Memoized by ID & timestamp)
  const executionPlan = useMemo(() => {
    if (!reel || status !== "completed") return null;
    return convertConvexReelToExecutionPlan(reel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel?._id, reel?.updatedAt, status]);

  // Memoize inputProps for Remotion Player
  const inputProps = useMemo(() => {
    if (!executionPlan) return null;
    return {
      plan: executionPlan,
      themeId: activeThemeId,
      enableAudio: true,
      bgMusicUrl: reel?.bgMusicUrl || "/music/without_me.mp3",
      bgMusicVolume: reel?.bgMusicVolume ?? 0.15,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executionPlan?.projectMeta?.title, reel?._id, activeThemeId, reel?.bgMusicUrl, reel?.bgMusicVolume]);

  // Memoize total duration frames
  const totalFrames = useMemo(() => {
    return executionPlan?.projectMeta.totalDurationFrames || 900;
  }, [executionPlan]);

  // ─── Render / Export State ──────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [renderElapsed, setRenderElapsed] = useState(0);
  const renderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect when rendering starts/stops and manage the elapsed timer
  const isRendering = reel?.status === "rendering";
  const hasVideo = Boolean(reel?.videoUrl);

  useEffect(() => {
    if (isRendering && reel?.renderStartedAt) {
      // Start the elapsed time counter
      setRenderElapsed(Math.floor((Date.now() - reel.renderStartedAt) / 1000));
      renderTimerRef.current = setInterval(() => {
        setRenderElapsed(Math.floor((Date.now() - (reel.renderStartedAt || Date.now())) / 1000));
      }, 1000);
    } else {
      // Stop the timer
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

  // Retry video generation pipeline handler
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
      // On success, Convex will reactively update status to "rendering"
    } catch (err: any) {
      setExportError(err.message || "Network error");
      setIsExporting(false);
    }
  }, [isExporting, isRendering, rawReelId, activeThemeId, reel?.bgMusicUrl, reel?.bgMusicVolume]);

  // Format elapsed seconds as MM:SS
  const formatElapsed = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center font-bold text-neutral-300 text-sm transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white uppercase flex items-center gap-2">
              <span>CONVEX DB REEL PREVIEW</span>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                DATABASE LIVE FETCH
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Reel ID: {rawReelId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/create-video"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-500 text-neutral-950 transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
          >
            <span>➕</span> Create New Reel
          </Link>
          {mounted && reel && (
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                status === "completed"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : status === "failed"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "completed"
                    ? "bg-emerald-400"
                    : status === "failed"
                    ? "bg-red-400"
                    : "bg-amber-400 animate-ping"
                }`}
              />
              STATUS: {status}
            </span>
          )}
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-6 flex flex-col justify-center items-center">
        {/* GUARD: Display Live Progress Component if Video Generation is Still Rendering (pipeline, not MP4 render) */}
        {status !== "completed" && status !== "rendering" ? (
          <div className="w-full max-w-3xl">
            <ReelGenerationProgress reelId={rawReelId} onRetry={handleRetry} />
          </div>
        ) : (
          /* COMPLETED: Display Remotion Video Player & Reel Details */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Remotion Player (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="bg-neutral-900 border border-neutral-800/80 p-4 rounded-2xl shadow-2xl w-full max-w-[440px] flex flex-col items-center relative group">
                {/* Player Ambient Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                {/* 9:16 Vertical Video Bezel */}
                <div className="w-full aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-black relative z-10">
                  {mounted && inputProps ? (
                    <Player
                      component={BlockbusterNetflixReel}
                      inputProps={inputProps}
                      durationInFrames={totalFrames}
                      compositionWidth={1080}
                      compositionHeight={1920}
                      fps={30}
                      numberOfSharedAudioTags={5}
                      style={{ width: "100%", height: "100%" }}
                      controls
                      autoPlay
                      loop
                      spaceKeyToPlayOrPause
                      doubleClickToFullscreen
                      clickToPlay
                      showVolumeControls
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3 text-neutral-400">
                      <span className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono">Hydrating Remotion Composition...</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between w-full px-2 text-[11px] font-mono text-neutral-400">
                  <span>9:16 Vertical Reel</span>
                  <span>1080 × 1920 @ 30fps</span>
                </div>
              </div>
            </div>

            {/* Right Column: Reel Details & Storyboard Metadata (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* ── Export / Download Panel ── */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-violet-400 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-800/40">
                  EXPORT VIDEO
                </span>

                {/* ── Currently Rendering State ── */}
                {isRendering && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="w-10 h-10 rounded-full bg-violet-500/20 border-2 border-violet-400 border-t-transparent animate-spin flex items-center justify-center" />
                        <span className="absolute inset-0 w-10 h-10 rounded-full bg-violet-400/10 animate-ping" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Rendering on Modal.com...</p>
                        <p className="text-xs text-neutral-400 font-mono">Cloud GPU • 1080×1920 @ 30fps</p>
                      </div>
                    </div>
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Elapsed Time</span>
                        <span className="font-mono font-bold text-violet-400 tabular-nums">
                          {formatElapsed(renderElapsed)}
                        </span>
                      </div>
                      <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse"
                          style={{ width: `${Math.min(95, (renderElapsed / 120) * 100)}%`, transition: "width 1s linear" }}
                        />
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1.5">Typically completes in 60–120 seconds</p>
                    </div>
                    {reel?.modalCallId && (
                      <p className="text-[10px] font-mono text-neutral-500 truncate">
                        Modal Call: {reel.modalCallId}
                      </p>
                    )}
                  </div>
                )}

                {/* ── Has Rendered Video — Download Available ── */}
                {hasVideo && !isRendering && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">MP4 Ready</span>
                      </div>
                      {reel?.renderDurationMs && (
                        <p className="text-[11px] text-neutral-400 font-mono mb-3">
                          Rendered in {(reel.renderDurationMs / 1000).toFixed(1)}s
                        </p>
                      )}
                      <a
                        href={reel?.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download MP4
                      </a>
                    </div>
                    {/* Re-render button */}
                    <button
                      onClick={handleExportMp4}
                      disabled={isExporting}
                      className="w-full px-4 py-2 rounded-xl text-xs font-bold border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-all disabled:opacity-40"
                    >
                      🔄 Re-render with Current Settings
                    </button>
                  </div>
                )}

                {/* ── No Video Yet — Export Button ── */}
                {!hasVideo && !isRendering && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Preview your reel in the player, customize theme & music, then export to a downloadable MP4 file.
                    </p>
                    <button
                      onClick={handleExportMp4}
                      disabled={isExporting || status !== "completed"}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition-all shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting Render...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Export MP4 via Modal Cloud
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-neutral-500 text-center">
                      Renders on Modal.com • ~60–120s • Uploaded to Cloudinary CDN
                    </p>
                  </div>
                )}

                {/* ── Error Message ── */}
                {(exportError || (reel?.status === "failed" && reel?.failedStep === "render")) && (
                  <div className="mt-3 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-400 mb-1">Render Failed</p>
                    <p className="text-[11px] text-red-300/70 font-mono">
                      {exportError || reel?.errorMessage || "Unknown error"}
                    </p>
                    <button
                      onClick={() => { setExportError(null); handleExportMp4(); }}
                      className="mt-2 text-[11px] font-bold text-red-400 hover:text-red-300 underline underline-offset-2"
                    >
                      Retry Export
                    </button>
                  </div>
                )}
              </div>

              {/* Theme & Styling Selector Panel */}
              <ThemeSelector
                reelId={rawReelId as Id<"reels">}
                currentThemeId={activeThemeId}
                onThemeChange={(_styleId, _paletteId, combinedThemeId) => setActiveThemeId(combinedThemeId)}
              />

              {/* Background Music Selector Panel */}
              <BgMusicSelector
                reelId={rawReelId as Id<"reels">}
                currentBgMusicUrl={reel?.bgMusicUrl}
                currentBgMusicVolume={reel?.bgMusicVolume}
              />

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40">
                  DOCUMENTARY STORYBOARD
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-3 mb-1">
                  {reel?.topic || "Generated Video Reel"}
                </h2>
                <p className="text-xs text-neutral-400 font-mono mb-4">
                  {reel?.storyboard?.length || 0} Scenes Assembled • Cartesia Audio • Deepgram STT
                </p>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                  {reel?.storyboard?.map((sc: any, idx: number) => (
                    <div
                      key={sc.sceneId || idx}
                      className="bg-neutral-950 border border-neutral-800/80 p-3.5 rounded-xl hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          SCENE {sc.sceneId || idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {sc.visualType || "center_cutout_hero"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">
                        {sc.headline}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {sc.narration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
