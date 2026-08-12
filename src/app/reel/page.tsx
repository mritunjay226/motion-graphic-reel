"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@remotion/player";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";

export default function ReelsGalleryPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "rendering" | "mine">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "scenes">("newest");
  const [previewReel, setPreviewReel] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch reels from Convex database with fallback to listUserReels
  const reelsAll = useQuery(api.reels.listAllReels);
  const reelsGuest = useQuery(api.reels.listUserReels, { userId: "user_guest" });
  const reelsUser = useQuery(
    api.reels.listUserReels,
    user?.id ? { userId: user.id } : "skip"
  );

  // Combine and deduplicate reels if fallback is used
  const reels = useMemo(() => {
    if (reelsAll !== undefined) return reelsAll;
    if (!reelsGuest && !reelsUser) return undefined;
    const combined = [...(reelsGuest || []), ...(reelsUser || [])];
    const uniqueMap = new Map();
    combined.forEach((item: any) => uniqueMap.set(item._id, item));
    return Array.from(uniqueMap.values());
  }, [reelsAll, reelsGuest, reelsUser]);

  const deleteReelMutation = useMutation(api.reels.deleteReel);


  // Statistics calculation
  const stats = useMemo(() => {
    if (!reels) return { total: 0, completed: 0, rendering: 0, myCount: 0 };
    const currentUserId = user?.id || "user_guest";
    return {
      total: reels.length,
      completed: reels.filter((r: any) => r.status === "completed").length,
      rendering: reels.filter((r: any) => r.status === "rendering" || r.status === "draft").length,
      myCount: reels.filter((r: any) => r.userId === currentUserId || (currentUserId === "user_guest" && r.userId === "user_guest")).length,
    };
  }, [reels, user?.id]);

  // Filter & Sort Reels
  const filteredReels = useMemo(() => {
    if (!reels) return [];
    const currentUserId = user?.id || "user_guest";

    return reels
      .filter((r: any) => {
        // Tab Filter
        if (activeTab === "completed" && r.status !== "completed") return false;
        if (activeTab === "rendering" && r.status !== "rendering" && r.status !== "draft") return false;
        if (activeTab === "mine" && r.userId !== currentUserId && !(currentUserId === "user_guest" && r.userId === "user_guest")) return false;

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = r.title?.toLowerCase().includes(q);
          const topicMatch = r.topic?.toLowerCase().includes(q);
          return titleMatch || topicMatch;
        }

        return true;
      })
      .sort((a: any, b: any) => {
        if (sortBy === "oldest") {
          return (a.createdAt || 0) - (b.createdAt || 0);
        }
        if (sortBy === "scenes") {
          return (b.storyboard?.length || 0) - (a.storyboard?.length || 0);
        }
        // Default: newest
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [reels, activeTab, searchQuery, sortBy, user?.id]);

  // Memoize Remotion execution plan for the active preview modal reel (stable by ID & timestamp)
  const previewExecutionPlan = useMemo(() => {
    if (!previewReel || previewReel.status !== "completed") return null;
    return convertConvexReelToExecutionPlan(previewReel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewReel?._id, previewReel?.updatedAt]);

  const previewInputProps = useMemo(() => {
    if (!previewExecutionPlan) return null;
    return {
      plan: previewExecutionPlan,
      enableAudio: true,
      bgMusicUrl: previewReel?.bgMusicUrl || "/music/without_me.mp3",
      bgMusicVolume: previewReel?.bgMusicVolume ?? 0.15,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewExecutionPlan?.projectMeta?.title, previewReel?._id, previewReel?.bgMusicUrl, previewReel?.bgMusicVolume]);

  const handleDelete = async (reelId: Id<"reels">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this reel?")) return;
    setDeletingId(reelId);
    try {
      await deleteReelMutation({ reelId });
      if (previewReel?._id === reelId) {
        setPreviewReel(null);
      }
    } catch (err) {
      console.error("Failed to delete reel:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F2F1EC] text-[#0C0C0E] flex flex-col font-sans selection:bg-[#B4F500] selection:text-black vox-paper-texture">
      {/* 1. Vox Editorial Top Header */}
      <header className="border-b-2 border-[#0C0C0E] bg-[#F2F1EC]/95 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-1 bg-[#0C0C0E] text-[#B4F500] font-bebas text-2xl tracking-widest rounded shadow-[3px_3px_0px_#FFE600] flex items-center gap-2 hover:bg-[#222224] transition-colors"
          >
            <span>VOX</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#B4F500] animate-ping" />
          </Link>
          <div>
            <h1 className="font-bebas text-xl tracking-wide text-[#0C0C0E] leading-none flex items-center gap-2">
              <span>REELS GALLERY</span>
              <span className="text-[10px] font-utility font-black bg-[#B4F500] text-[#0C0C0E] border border-[#0C0C0E] px-2 py-0.5 rounded uppercase">
                COMMUNITY ARCHIVE
              </span>
            </h1>
            <p className="text-[10px] text-[#666666] font-utility font-bold uppercase tracking-wider">
              Explore 2.5D Motion Graphic Video Creations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/create-video"
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#B4F500] text-[#0C0C0E] hover:bg-[#a5e400] transition-all shadow-vox border-2 border-[#0C0C0E] flex items-center gap-1.5"
          >
            <span>⚡ + Create New Reel</span>
          </Link>

          <div className="pl-2 border-l-2 border-[#D8D7D2]">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 rounded-full border-2 border-[#0C0C0E]",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-[#0C0C0E] text-white hover:bg-[#222224] transition-all border border-[#0C0C0E]"
                >
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section & Stats Banner */}
      <section className="bg-white border-b-4 border-[#0C0C0E] px-6 sm:px-10 py-10 shadow-xs relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="inline-block bg-[#FFE500] text-[#0C0C0E] font-bebas text-xs px-3 py-1 font-bold uppercase tracking-widest mb-3 rounded border border-[#0C0C0E]">
              GENERATED MOTION REELS ENGINE
            </div>
            <h1 className="font-bebas text-4xl sm:text-6xl text-[#0C0C0E] uppercase leading-none mb-3">
              Explore Documentary Video Reels
            </h1>
            <p className="text-sm text-[#555555] font-medium leading-relaxed max-w-2xl">
              Real-time directory of 2.5D documentary video reels generated with Cartesia Sonic voiceovers, Deepgram STT, dynamic Remotion animations, and paper-cutout visual assets.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-[#F7F7F5] border-2 border-[#0C0C0E] p-3.5 rounded-2xl text-center shadow-xs">
              <span className="font-bebas text-3xl text-[#0C0C0E] leading-none block">
                {stats.total}
              </span>
              <span className="text-[10px] font-utility font-black text-[#666666] uppercase">
                Total Reels
              </span>
            </div>

            <div className="bg-[#B4F500]/20 border-2 border-[#0C0C0E] p-3.5 rounded-2xl text-center shadow-xs">
              <span className="font-bebas text-3xl text-emerald-800 leading-none block">
                {stats.completed}
              </span>
              <span className="text-[10px] font-utility font-black text-emerald-900 uppercase">
                Completed
              </span>
            </div>

            <div className="bg-[#FFE500]/30 border-2 border-[#0C0C0E] p-3.5 rounded-2xl text-center shadow-xs">
              <span className="font-bebas text-3xl text-amber-800 leading-none block">
                {stats.rendering}
              </span>
              <span className="text-[10px] font-utility font-black text-amber-900 uppercase">
                In Pipeline
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Controls Bar: Search, Tab Filters & Sorting */}
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: "all", label: `ALL REELS (${stats.total})` },
            { id: "completed", label: `COMPLETED (${stats.completed})` },
            { id: "rendering", label: `IN PIPELINE (${stats.rendering})` },
            { id: "mine", label: `MY REELS (${stats.myCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bebas tracking-wider uppercase transition-all border-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0C0C0E] text-[#B4F500] border-[#0C0C0E] shadow-vox"
                  : "bg-white text-[#0C0C0E] border-[#D8D7D2] hover:border-[#0C0C0E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              placeholder="Search topic or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-[#0C0C0E] rounded-xl px-4 py-2 text-xs font-semibold placeholder-[#888888] focus:outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border-2 border-[#0C0C0E] rounded-xl px-3 py-2 text-xs font-utility font-bold uppercase text-[#0C0C0E] focus:outline-none shadow-xs cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="scenes">Sort: Most Scenes</option>
          </select>
        </div>
      </div>

      {/* 4. Reels Grid Showcase */}
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 pb-16 flex-1">
        {!reels ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white border-3 border-[#D8D7D2] rounded-3xl p-5 h-96 animate-pulse flex flex-col justify-between"
              >
                <div className="h-6 bg-neutral-200 rounded-lg w-3/4 mb-3" />
                <div className="w-full aspect-[9/16] bg-neutral-200 rounded-2xl my-2 flex-1" />
                <div className="h-10 bg-neutral-200 rounded-xl w-full mt-3" />
              </div>
            ))}
          </div>
        ) : filteredReels.length === 0 ? (
          /* Empty Filter Result State */
          <div className="bg-white border-4 border-[#0C0C0E] rounded-3xl p-12 text-center shadow-vox max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-[#FFE500] border-2 border-[#0C0C0E] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
              🎬
            </div>
            <h3 className="font-bebas text-3xl uppercase text-[#0C0C0E] mb-2">
              No Video Reels Found
            </h3>
            <p className="text-xs text-[#666666] font-medium mb-6">
              {searchQuery
                ? `No video reels matched search query "${searchQuery}".`
                : "No reels match the selected tab filter."}
            </p>
            <Link
              href="/create-video"
              className="inline-block px-6 py-3 rounded-xl font-bebas text-lg tracking-wider uppercase bg-[#B4F500] text-[#0C0C0E] border-2 border-[#0C0C0E] hover:bg-[#a5e400] transition-all shadow-vox"
            >
              + Create First Video Reel
            </Link>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReels.map((reel: any) => {
              const isCompleted = reel.status === "completed";
              const isRendering = reel.status === "rendering" || reel.status === "draft";
              const sceneCount = reel.storyboard?.length || 0;
              const formattedDate = new Date(reel.createdAt || Date.now()).toLocaleDateString(
                undefined,
                { month: "short", day: "numeric", year: "numeric" }
              );

              return (
                <motion.div
                  key={reel._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-3 border-[#0C0C0E] rounded-3xl p-5 shadow-vox hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Status & Date Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-utility font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                            : isRendering
                            ? "bg-amber-100 text-amber-900 border-amber-400 animate-pulse"
                            : "bg-red-100 text-red-800 border-red-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCompleted
                              ? "bg-emerald-500"
                              : isRendering
                              ? "bg-amber-500 animate-ping"
                              : "bg-red-500"
                          }`}
                        />
                        {reel.status}
                      </span>

                      <span className="text-[10px] font-mono text-[#888888]">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Reel Title */}
                    <h3 className="font-bebas text-xl text-[#0C0C0E] uppercase leading-tight line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors">
                      {reel.topic || reel.title}
                    </h3>
                    <p className="text-[11px] text-[#666666] font-mono mb-3">
                      {sceneCount} SCENES • 1080×1920 @ 30FPS
                    </p>
                  </div>

                  {/* Visual Reel Card Preview Frame */}
                  <div
                    onClick={() => {
                      if (isCompleted) {
                        setPreviewReel(reel);
                      } else {
                        router.push(`/reel/${reel._id}`);
                      }
                    }}
                    className="w-full aspect-[9/16] rounded-2xl border-2 border-[#0C0C0E] bg-[#111113] my-2 relative overflow-hidden cursor-pointer group/frame flex flex-col items-center justify-between p-4 shadow-inner"
                  >
                    {/* Background Decorative Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black opacity-90" />
                    
                    {/* Top Sticker Scene Badge */}
                    <div className="relative z-10 w-full flex justify-between items-center text-[10px] font-mono text-neutral-300 border-b border-neutral-800 pb-2">
                      <span className="bg-[#FFE500] text-[#0C0C0E] font-bold px-1.5 py-0.5 rounded text-[9px]">
                        2.5D CUTOUT
                      </span>
                      <span>{reel.storyboard?.[0]?.headline?.slice(0, 16) || "SCENE 1"}</span>
                    </div>

                    {/* Center Action Overlay Icon */}
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center my-auto">
                      {isCompleted ? (
                        <div className="w-14 h-14 rounded-full bg-[#B4F500] border-2 border-[#0C0C0E] flex items-center justify-center text-xl text-[#0C0C0E] font-black shadow-vox group-hover/frame:scale-110 transition-transform">
                          ▶
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center text-amber-400" />
                      )}
                      <span className="text-[11px] font-bebas tracking-wider uppercase text-neutral-300">
                        {isCompleted ? "Click to Quick Watch" : "Processing Render..."}
                      </span>
                    </div>

                    {/* Bottom Narration Snippet */}
                    <div className="relative z-10 w-full bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-xl text-[10px] text-neutral-400 font-sans line-clamp-2">
                      "{reel.storyboard?.[0]?.narration || "Documentary narration script..."}"
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#E8E7E2]">
                    <button
                      onClick={() => {
                        if (isCompleted) {
                          setPreviewReel(reel);
                        } else {
                          router.push(`/reel/${reel._id}`);
                        }
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-bebas tracking-wider uppercase bg-[#0C0C0E] text-[#B4F500] hover:bg-[#222224] transition-colors border border-[#0C0C0E] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>▶ Quick Play</span>
                    </button>

                    <Link
                      href={`/reel/${reel._id}`}
                      className="px-3 py-2 rounded-xl text-xs font-bebas tracking-wider uppercase bg-[#F7F7F5] hover:bg-[#FFE500] text-[#0C0C0E] border-2 border-[#0C0C0E] transition-colors flex items-center justify-center cursor-pointer"
                      title="Open Full Studio Page"
                    >
                      <span>👁️</span>
                    </Link>

                    <button
                      onClick={(e) => handleDelete(reel._id, e)}
                      disabled={deletingId === reel._id}
                      className="px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-300 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Reel"
                    >
                      {deletingId === reel._id ? "..." : "🗑️"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Quick Play Video Modal */}
      <AnimatePresence>
        {previewReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center overflow-y-auto"
            onClick={() => setPreviewReel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border-2 border-neutral-800 rounded-3xl p-6 max-w-4xl w-full text-white shadow-2xl relative flex flex-col lg:flex-row gap-6 items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewReel(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold flex items-center justify-center z-20 cursor-pointer"
              >
                ✕
              </button>

              {/* Remotion 9:16 Video Player Column */}
              <div className="w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-black relative">
                {mounted && previewInputProps ? (
                  <Player
                    component={BlockbusterNetflixReel}
                    inputProps={previewInputProps}
                    durationInFrames={previewExecutionPlan?.projectMeta.totalDurationFrames || 900}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    fps={30}
                    numberOfSharedAudioTags={5}
                    style={{ width: "100%", height: "100%" }}
                    controls
                    autoPlay
                    loop
                    clickToPlay
                    showVolumeControls
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400 gap-3">
                    <span className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-mono">Loading Remotion Video Composition...</p>
                  </div>
                )}
              </div>

              {/* Reel Info & Storyboard Summary Column */}
              <div className="flex-1 flex flex-col justify-between w-full h-full">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 inline-block mb-3">
                    LIVE QUICK WATCH PREVIEW
                  </span>
                  <h2 className="font-bebas text-3xl text-white uppercase leading-tight mb-2">
                    {previewReel.topic || previewReel.title}
                  </h2>
                  <p className="text-xs text-neutral-400 font-mono mb-4">
                    {previewReel.storyboard?.length || 0} Scenes Assembled • Cartesia Sonic Voice
                  </p>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-t border-b border-neutral-800 py-3 mb-6">
                    {previewReel.storyboard?.map((sc: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs"
                      >
                        <div className="font-bold text-amber-400 text-[10px] uppercase mb-0.5">
                          SCENE {idx + 1}: {sc.headline}
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-normal">
                          {sc.narration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/reel/${previewReel._id}`}
                    className="flex-1 py-3 rounded-xl text-xs font-bebas tracking-wider uppercase bg-[#B4F500] hover:bg-[#a5e400] text-[#0C0C0E] font-black text-center border-2 border-[#0C0C0E] shadow-vox transition-all"
                  >
                    Open Studio & Customize Music →
                  </Link>

                  <button
                    onClick={() => setPreviewReel(null)}
                    className="px-4 py-3 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
