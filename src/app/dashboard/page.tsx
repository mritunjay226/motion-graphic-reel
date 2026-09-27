"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { StudioNavbar } from "@/components/StudioNavbar";
import { Search, X, Film, Play, Download, Plus } from "lucide-react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "rendering" | "failed">("all");

  const reels = useQuery(api.reels.listAllReels) || [];

  // Filter reels
  const filteredReels = reels.filter((reel: any) => {
    const matchesSearch =
      (reel.topic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reel.title || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : reel.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#0071E3] selection:text-white relative">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none" />

      {/* Global Studio Navigation Header */}
      <StudioNavbar />

      <div className="max-w-7xl w-full mx-auto p-4 sm:p-8 flex-1 flex flex-col gap-8 relative z-10">

        {/* Top Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-2">
              Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-1.5">
              Production Archive
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B] font-normal leading-relaxed max-w-xl">
              Review and inspect your generated documentary reels, export 1080p MP4 master renders, and manage distribution.
            </p>
          </div>

          <Link
            href="/create-video"
            className="px-5 py-2.5 rounded-full font-semibold text-xs bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create reel</span>
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full sm:w-80 relative">
            <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-full pl-9 pr-8 py-2 text-xs text-[#1D1D1F] placeholder-[#86868B] outline-none shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="bg-black/[0.04] p-1 rounded-full flex items-center gap-1 self-start sm:self-auto">
            {(["all", "completed", "rendering", "failed"] as const).map((st) => {
              const labelMap: Record<string, string> = {
                all: "All",
                completed: "Ready",
                rendering: "Processing",
                failed: "Failed",
              };
              const isActive = filterStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${isActive
                      ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                      : "text-[#86868B] hover:text-[#1D1D1F] font-medium"
                    }`}
                >
                  {labelMap[st] || st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Reel Cards Grid */}
        {filteredReels.length === 0 ? (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[32px] p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center my-6 max-w-md mx-auto">
            <div className="w-12 h-12 bg-black/[0.04] rounded-2xl flex items-center justify-center mb-3 text-[#86868B]">
              <Film className="w-5 h-5 text-[#1D1D1F]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
              No reels found
            </h3>
            <p className="text-xs text-[#86868B] font-normal leading-relaxed max-w-sm mb-6">
              {searchQuery
                ? `No video reels matching "${searchQuery}". Try a different search term.`
                : "You haven't created any video reels in this archive yet."}
            </p>
            <Link
              href="/create-video"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create a reel</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredReels.map((reel: any) => {
              const hasVideo = Boolean(reel.videoUrl);
              const sceneCount = reel.storyboard?.length || 0;
              const heroImg = reel.storyboard?.[0]?.imageUrl || reel.storyboard?.[1]?.imageUrl;
              const dateStr = new Date(reel.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={reel._id}
                  className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
                >
                  {/* Card Thumbnail / Header */}
                  <div>
                    <div className="aspect-[9/10] bg-[#111113] rounded-2xl relative overflow-hidden flex items-center justify-center border border-black/[0.08]">
                      {heroImg ? (
                        <img
                          src={heroImg}
                          alt={reel.topic}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-400 font-medium text-xs">
                          <Film className="w-6 h-6 text-neutral-400" />
                          <span>Motion Reel</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${reel.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                              : reel.status === "failed"
                                ? "bg-red-50 text-red-700 border-red-200/60"
                                : "bg-blue-50 text-[#0071E3] border-blue-200/60"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${reel.status === "completed"
                                ? "bg-[#34C759]"
                                : reel.status === "failed"
                                  ? "bg-red-500"
                                  : "bg-[#0071E3] animate-ping"
                              }`}
                          />
                          <span className="capitalize">{reel.status === "rendering" ? "Processing" : reel.status}</span>
                        </span>
                      </div>

                      {/* Scene Count Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                        {sceneCount} scenes
                      </div>

                      {/* Center Play Overlay Icon */}
                      <Link
                        href={`/reel/${reel._id}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md text-[#1D1D1F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </Link>
                    </div>

                    {/* Content Meta */}
                    <div className="pt-3 pb-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#86868B] mb-1">
                        <span>{dateStr}</span>
                        {reel.language && (
                          <span className="uppercase bg-black/[0.04] px-1.5 py-0.2 rounded-full text-[10px]">
                            {reel.language}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-[#1D1D1F] leading-snug line-clamp-2">
                        {reel.topic || reel.title || "Untitled Reel"}
                      </h3>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-black/[0.05] mt-2 flex flex-col gap-1.5">
                    <Link
                      href={`/reel/${reel._id}`}
                      className="w-full py-2 rounded-full text-xs font-semibold text-center bg-[#1D1D1F] hover:bg-black text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Open Studio</span>
                    </Link>

                    {hasVideo && (
                      <a
                        href={reel.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-full py-1.5 rounded-full text-[11px] font-medium text-center bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download 1080p</span>
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
