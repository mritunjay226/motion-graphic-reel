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
import { ReelsFilterBar, ReelTabFilter, ReelSortOption } from "@/components/gallery/ReelsFilterBar";
import { ReelCard } from "@/components/gallery/ReelCard";
import { ReelsEmptyState } from "@/components/gallery/ReelsEmptyState";
import { ReelPreviewModal } from "@/components/gallery/ReelPreviewModal";

export default function ReelsGalleryPage() {
  const router = useRouter();
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ReelTabFilter>("all");
  const [sortBy, setSortBy] = useState<ReelSortOption>("newest");
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
      bgMusicUrl: previewReel?.bgMusicUrl || "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
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
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#0071E3] selection:text-white relative">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none" />

      {/* 1. Global Studio Navigation */}
      <StudioNavbar />

      {/* 2. Hero Section & Stats Banner */}
      <ReelsStatsBanner
        total={stats.total}
        completed={stats.completed}
        rendering={stats.rendering}
      />

      {/* 3. Controls Bar: Search, Tab Filters & Sorting */}
      <ReelsFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* 4. Reels Grid Showcase */}
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 pb-16 flex-1 relative z-10">
        {!reels ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-md border border-black/[0.06] rounded-[24px] p-4 h-96 animate-pulse flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="h-5 bg-black/[0.05] rounded-full w-24 mb-3" />
                  <div className="h-5 bg-black/[0.05] rounded-lg w-3/4 mb-2" />
                  <div className="h-4 bg-black/[0.04] rounded-lg w-1/2" />
                </div>
                <div className="w-full aspect-[9/16] bg-black/[0.05] rounded-2xl my-2 flex-1" />
                <div className="h-9 bg-black/[0.06] rounded-full w-full mt-2" />
              </div>
            ))}
          </div>
        ) : filteredReels.length === 0 ? (
          /* Empty Filter Result State */
          <ReelsEmptyState searchQuery={searchQuery} />
        ) : (
          /* Gallery Grid */
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

