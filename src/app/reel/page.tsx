"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";
import { StudioNavbar } from "@/components/StudioNavbar";

// Gallery Modular Components
import { ReelsStatsBanner } from "@/components/gallery/ReelsStatsBanner";
import {
  ReelsFilterBar,
  ReelTabFilter,
  ReelSortOption,
  ReelLanguageFilter,
} from "@/components/gallery/ReelsFilterBar";
import { ReelCard } from "@/components/gallery/ReelCard";
import { ReelsTableView } from "@/components/gallery/ReelsTableView";
import { ReelsEmptyState } from "@/components/gallery/ReelsEmptyState";
import { ReelPreviewModal } from "@/components/gallery/ReelPreviewModal";

import FilmTreatment from "@/components/landing/FilmTreatment";

export default function ReelsGalleryPage() {
  const router = useRouter();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ReelTabFilter>("all");
  const [languageFilter, setLanguageFilter] = useState<ReelLanguageFilter>("all");
  const [sortBy, setSortBy] = useState<ReelSortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
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
      myCount: reels.filter(
        (r: any) =>
          r.userId === currentUserId ||
          (currentUserId === "user_guest" && r.userId === "user_guest")
      ).length,
    };
  }, [reels, user?.id]);

  // Total scene count across all reels
  const totalScenes = useMemo(() => {
    if (!reels) return 0;
    return reels.reduce((acc: number, r: any) => acc + (r.storyboard?.length || 0), 0);
  }, [reels]);

  // Filter & Sort Reels
  const filteredReels = useMemo(() => {
    if (!reels) return [];
    const currentUserId = user?.id || "user_guest";

    return reels
      .filter((r: any) => {
        // Tab Filter
        if (activeTab === "completed" && r.status !== "completed") return false;
        if (activeTab === "rendering" && r.status !== "rendering" && r.status !== "draft") return false;
        if (
          activeTab === "mine" &&
          r.userId !== currentUserId &&
          !(currentUserId === "user_guest" && r.userId === "user_guest")
        )
          return false;

        // Language Filter
        if (languageFilter !== "all") {
          const reelLang = (r.language || "en").toLowerCase();
          if (reelLang !== languageFilter) return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = r.title?.toLowerCase().includes(q);
          const topicMatch = r.topic?.toLowerCase().includes(q);
          const voiceMatch = r.voiceId?.toLowerCase().includes(q);
          const themeMatch = r.themeId?.toLowerCase().includes(q);
          const sceneMatch = r.storyboard?.some((s: any) =>
            s.headline?.toLowerCase().includes(q)
          );
          return titleMatch || topicMatch || voiceMatch || themeMatch || sceneMatch;
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
  }, [reels, activeTab, languageFilter, searchQuery, sortBy, user?.id]);

  // Memoize Remotion execution plan for the active preview modal reel
  const previewExecutionPlan = useMemo(() => {
    if (!previewReel || previewReel.status !== "completed") return null;
    return convertConvexReelToExecutionPlan(previewReel);
  }, [previewReel]);

  const previewInputProps = useMemo(() => {
    if (!previewExecutionPlan) return null;
    return {
      plan: previewExecutionPlan,
      enableAudio: true,
      enableSfx: true,
      sfxVolume: 1.0,
      bgMusicUrl:
        previewReel?.bgMusicUrl ||
        "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
      bgMusicVolume: previewReel?.bgMusicVolume ?? 0.15,
    };
  }, [previewExecutionPlan, previewReel]);

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
    <main className="min-h-screen bg-[#F4F4F6] text-[#111111] flex flex-col font-sans selection:bg-[#FFE600] selection:text-black relative overflow-x-hidden">
      {/* Reusable Film Treatment Overlay */}
      <FilmTreatment grainOpacity={0.12} scanlines={true} vignette={false} />

      {/* Broadcast Studio Viewfinder HUD View */}
      <div className="absolute top-20 left-6 pointer-events-none z-20 opacity-70 hidden sm:block">
        <svg className="w-12 h-12 stroke-[#111111]" fill="none" viewBox="0 0 48 48">
          <path d="M 4 20 L 4 4 L 20 4" strokeWidth="3" strokeLinecap="square" />
        </svg>
        <div className="text-[9px] font-mono text-[#111111] font-black tracking-widest mt-0.5">
          REC [30FPS]
        </div>
      </div>
      <div className="absolute top-20 right-6 pointer-events-none z-20 opacity-70 hidden sm:block text-right">
        <svg className="w-12 h-12 stroke-[#111111] ml-auto" fill="none" viewBox="0 0 48 48">
          <path d="M 28 4 L 44 4 L 44 20" strokeWidth="3" strokeLinecap="square" />
        </svg>
        <div className="text-[9px] font-mono text-[#111111] font-black tracking-widest mt-0.5">
          VAULT: ARCHIVE
        </div>
      </div>

      {/* 1. Global Vox Studio Navigation */}
      <StudioNavbar />

      {/* 2. Hero Section & Stats Banner */}
      <ReelsStatsBanner
        total={stats.total}
        completed={stats.completed}
        rendering={stats.rendering}
        totalScenes={totalScenes}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* 3. Controls Bar: Search, Tab Filters, Language Toggle & Sorting */}
      <ReelsFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        languageFilter={languageFilter}
        setLanguageFilter={setLanguageFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        resultCount={filteredReels.length}
      />

      {/* 4. Reels Grid or Studio Table Showcase */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pb-16 flex-1 relative z-20">
        {!reels ? (
          /* Loading Skeletons with Brutalist Frames */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-[#FFFDF7] border-3 border-[#111111] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#111111] animate-pulse flex flex-col justify-between h-[480px]"
              >
                <div>
                  <div className="h-5 bg-neutral-200 rounded border border-[#111111] w-24 mb-3" />
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </div>
                <div className="w-full aspect-[9/16] bg-neutral-200 rounded-2xl border-2 border-[#111111] my-2 flex-1" />
                <div className="h-10 bg-neutral-200 rounded-xl border border-[#111111] w-full mt-2" />
              </div>
            ))}
          </div>
        ) : filteredReels.length === 0 ? (
          /* Empty Filter Result State */
          <ReelsEmptyState searchQuery={searchQuery} />
        ) : viewMode === "table" ? (
          /* Studio Table View */
          <ReelsTableView
            reels={filteredReels}
            deletingId={deletingId}
            onPreview={(selected) => setPreviewReel(selected)}
            onNavigate={(id) => router.push(`/reel/${id}`)}
            onDelete={handleDelete}
          />
        ) : (
          /* Poster Gallery Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReels.map((r: any) => (
              <ReelCard
                key={r._id}
                reel={r}
                deletingId={deletingId}
                onPreview={(selected) => setPreviewReel(selected)}
                onNavigate={(id) => router.push(`/reel/${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Pop-up Remotion Preview Modal */}
      <ReelPreviewModal
        previewReel={previewReel}
        previewInputProps={previewInputProps}
        onClose={() => setPreviewReel(null)}
        onNavigateToStudio={(id) => router.push(`/reel/${id}`)}
      />
    </main>
  );
}
