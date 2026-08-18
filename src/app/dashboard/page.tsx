"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { StudioNavbar } from "@/components/StudioNavbar";
import { useUser } from "@clerk/nextjs";
import { Zap, Search, X, Film, Play, Download, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
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
    <main className="min-h-screen bg-[#F2F1EC] text-[#0C0C0E] flex flex-col font-sans selection:bg-[#B4F500] selection:text-black vox-paper-texture">
      {/* Global Studio Navigation Header */}
      <StudioNavbar />

      <div className="max-w-7xl w-full mx-auto p-4 sm:p-8 flex-1 flex flex-col gap-8">
        
        {/* Top Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-[#0C0C0E] rounded-3xl p-6 sm:p-8 shadow-vox">
          <div>
            <div className="inline-block bg-[#FFE600] text-[#0C0C0E] font-bebas text-xs px-3 py-1 font-bold uppercase tracking-widest mb-2 rounded border border-[#0C0C0E]">
              CREATOR WORKSPACE & REEL LIBRARY
            </div>
            <h1 className="font-bebas text-4xl sm:text-5xl text-[#0C0C0E] uppercase leading-none tracking-tight">
              YOUR 2.5D VIDEO PRODUCTION ARCHIVE
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] font-medium mt-1">
              Manage your generated documentary reels, export broadcast MP4s, and track social channel distributions.
            </p>
          </div>

          <Link
            href="/create-video"
            className="px-6 py-4 rounded-2xl font-bebas text-xl tracking-wider uppercase bg-[#B4F500] hover:bg-[#a5e400] text-[#0C0C0E] border-2 border-[#0C0C0E] shadow-[3px_3px_0px_#0C0C0E] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>CREATE NEW REEL</span>
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder="Search reels by topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-[#0C0C0E] rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold placeholder-[#888888] focus:outline-none shadow-[2px_2px_0px_#0C0C0E]"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#E7E6E0] p-1 rounded-xl border border-[#D8D7D2] self-start sm:self-auto">
            {(["all", "completed", "rendering", "failed"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-utility transition-all ${
                  filterStatus === st
                    ? "bg-[#0C0C0E] text-[#B4F500] shadow-xs"
                    : "text-[#555555] hover:text-[#0C0C0E]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Video Reel Cards Grid */}
        {filteredReels.length === 0 ? (
          /* Empty State */
          <div className="bg-white border-3 border-[#0C0C0E] rounded-3xl p-12 text-center shadow-vox flex flex-col items-center justify-center my-6">
            <Film className="w-14 h-14 text-neutral-400 mb-3" />
            <h3 className="font-bebas text-3xl text-[#0C0C0E] uppercase mb-2">
              NO REELS FOUND
            </h3>
            <p className="text-xs text-[#666666] font-medium max-w-md mb-6">
              {searchQuery
                ? `No video reels matching "${searchQuery}". Try a different search term.`
                : "You haven't generated any 2.5D documentary video reels yet. Start in 60 seconds!"}
            </p>
            <Link
              href="/create-video"
              className="px-6 py-3 rounded-xl font-bebas text-lg bg-[#B4F500] hover:bg-[#a5e400] text-[#0C0C0E] border-2 border-[#0C0C0E] shadow-[2px_2px_0px_#0C0C0E] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>CREATE YOUR FIRST REEL</span>
              <ArrowRight className="w-4 h-4" />
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
                  className="bg-white border-3 border-[#0C0C0E] rounded-2xl overflow-hidden shadow-vox hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between group"
                >
                  {/* Card Thumbnail / Header */}
                  <div>
                    <div className="aspect-[9/10] bg-[#0C0C0E] relative overflow-hidden flex items-center justify-center border-b-2 border-[#0C0C0E]">
                      {heroImg ? (
                        <img
                          src={heroImg}
                          alt={reel.topic}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-neutral-500 font-mono text-xs">
                          <Film className="w-8 h-8 text-neutral-500" />
                          <span>2.5D Motion Reel</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-[9px] font-utility font-black px-2 py-0.5 rounded uppercase border ${
                            reel.status === "completed"
                              ? "bg-[#B4F500] text-[#0C0C0E] border-[#0C0C0E]"
                              : reel.status === "failed"
                              ? "bg-red-500 text-white border-[#0C0C0E]"
                              : "bg-[#FFE600] text-[#0C0C0E] border-[#0C0C0E] animate-pulse"
                          }`}
                        >
                          {reel.status}
                        </span>
                      </div>

                      {/* Scene Count Badge */}
                      <div className="absolute top-3 right-3 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-white/20">
                        {sceneCount} SCENES
                      </div>

                      {/* Center Play Overlay Icon */}
                      <Link
                        href={`/reel/${reel._id}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#B4F500] border-2 border-[#0C0C0E] text-[#0C0C0E] font-bold flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </Link>
                    </div>

                    {/* Content Meta */}
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] font-utility font-bold text-[#777777] mb-1.5">
                        <span>{dateStr}</span>
                        {reel.language && (
                          <span className="uppercase bg-[#F2F1EC] px-1.5 py-0.2 rounded border border-[#D8D7D2]">
                            {reel.language}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bebas text-xl text-[#0C0C0E] leading-tight line-clamp-2 uppercase">
                        {reel.topic || reel.title || "Untitled Reel"}
                      </h3>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 pt-0 flex flex-col gap-2">
                    <Link
                      href={`/reel/${reel._id}`}
                      className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-center bg-[#0C0C0E] text-[#B4F500] hover:bg-[#222224] transition-colors border border-[#0C0C0E] flex items-center justify-center gap-1.5"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>OPEN IN STUDIO</span>
                    </Link>

                    {hasVideo && (
                      <a
                        href={reel.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-full py-1.5 rounded-lg text-[10px] font-bold text-center bg-[#E7E6E0] hover:bg-[#dcdbd4] text-[#333333] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download 1080p MP4</span>
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
