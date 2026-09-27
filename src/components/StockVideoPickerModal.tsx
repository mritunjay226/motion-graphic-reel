"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  Video,
  Play,
  Check,
  Zap,
  Loader2,
  Sparkles,
  ExternalLink,
  Film,
} from "lucide-react";
import type { FetchedBRollVideo } from "@/lib/video-fetcher";

export interface StockVideoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSelectVideo: (video: FetchedBRollVideo) => void;
}

const QUICK_TAGS = [
  "Wall Street",
  "Server Room",
  "Stock Market",
  "Corporate Meeting",
  "Newspaper Press",
  "Microchip Tech",
  "Cyber Security",
  "Documentary",
  "Luxury Gold",
  "Time Lapse City",
];

export const StockVideoPickerModal: React.FC<StockVideoPickerModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
  onSelectVideo,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [videos, setVideos] = useState<FetchedBRollVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<FetchedBRollVideo | null>(null);
  const [hoveredVideoUrl, setHoveredVideoUrl] = useState<string | null>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      const q = initialQuery.trim() || "documentary cinematic";
      setQuery(q);
      performSearch(q);
      setSelectedVideo(null);
      setHoveredVideoUrl(null);
    }
  }, [isOpen, initialQuery]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/stock-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm.trim(), perPage: 12 }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.error("Failed to search stock videos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleQuickTagClick = (tag: string) => {
    setQuery(tag);
    performSearch(tag);
  };

  const handleConfirmSelection = () => {
    if (selectedVideo) {
      onSelectVideo(selectedVideo);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[14px_14px_0px_#111111] overflow-hidden text-[#111111]">

        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b-3 border-[#111111] bg-[#FFFEEB]">
          <div className="flex items-center gap-3">
            <span className="font-bebas text-sm bg-[#111111] text-[#B5F500] px-3 py-1 rounded-md tracking-wider uppercase font-bold flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              <span>STOCK B-ROLL ARCHIVE</span>
            </span>
            <h3 className="font-bebas text-2xl tracking-wide uppercase">
              REALTIME 4K / HD VIDEO SEARCH
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-[#111111] bg-white hover:bg-[#FFE600] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar & Quick Category Tags */}
        <div className="p-4 sm:p-5 border-b-2 border-[#E2E2E8] bg-[#F8F8FA] flex flex-col gap-3">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 4K B-Roll (e.g. Wall street, server room, newspaper printing...)"
                className="w-full bg-white border-2 border-[#111111] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFE600] shadow-xs"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-2xl bg-[#FFE600] hover:bg-[#B5F500] text-[#111111] font-bebas text-base uppercase tracking-wider border-2 border-[#111111] shadow-[2px_2px_0px_#111111] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SEARCHING...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>SEARCH</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Tags Scrollable Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[10px] font-mono font-black uppercase text-neutral-400 shrink-0">
              POPULAR:
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FFE600] text-[#111111] border border-[#111111] text-[10px] font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer shadow-xs active:translate-y-0.5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Video Search Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#F2F1EC]">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-neutral-500">
              <span className="w-8 h-8 border-3 border-[#111111] border-t-transparent rounded-full animate-spin" />
              <p className="font-bebas text-lg uppercase tracking-wider text-[#111111]">
                Querying 4K / HD Video Repositories...
              </p>
            </div>
          ) : videos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-center text-neutral-400">
              <Film className="w-10 h-10 text-neutral-300" />
              <p className="font-bebas text-xl text-[#111111] uppercase tracking-wide">
                No Stock Videos Found
              </p>
              <p className="text-xs text-neutral-500 max-w-sm">
                Try searching with broader terms like "finance", "technology", "office", or click a popular tag above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((vid, idx) => {
                const isSelected = selectedVideo?.videoUrl === vid.videoUrl;
                const isHovered = hoveredVideoUrl === vid.videoUrl;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedVideo(vid)}
                    onMouseEnter={() => setHoveredVideoUrl(vid.videoUrl)}
                    onMouseLeave={() => setHoveredVideoUrl(null)}
                    className={`bg-white border-3 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col relative group ${isSelected
                        ? "border-[#111111] shadow-[5px_5px_0px_#B5F500] scale-[1.02] ring-2 ring-[#B5F500]"
                        : "border-[#111111] hover:border-[#111111] hover:shadow-[4px_4px_0px_#111111]"
                      }`}
                  >
                    {/* Video Player / Thumbnail Preview Aspect Container */}
                    <div className="relative w-full aspect-video bg-black overflow-hidden">
                      {isHovered ? (
                        /* Live Realtime Hover Video Stream */
                        <video
                          src={vid.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        /* Static Poster Thumbnail */
                        <img
                          src={vid.previewThumbnailUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=640&q=80"}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}

                      {/* Live Hover Badge */}
                      {isHovered && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#111111]/80 text-[#B5F500] text-[9px] font-mono font-bold flex items-center gap-1 backdrop-blur-xs border border-[#B5F500]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B5F500] animate-ping" />
                          <span>LIVE HOVER PREVIEW</span>
                        </div>
                      )}

                      {/* Duration Tag */}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold">
                        {vid.durationSeconds}s
                      </div>

                      {/* Source & Resolution Tag */}
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-[#111111]/80 text-[#FFE600] text-[9px] font-mono font-black uppercase">
                        {vid.source} • {vid.width >= 1920 ? "1080P" : "HD"}
                      </div>

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#B5F500] text-[#111111] border-2 border-[#111111] flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Card Footer Bar */}
                    <div className="p-2.5 flex items-center justify-between border-t-2 border-[#111111] bg-white text-xs">
                      <span className="font-bebas text-sm text-[#111111] tracking-wide truncate max-w-[150px]">
                        B-ROLL CLIP #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo(vid);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-mono font-black uppercase border transition-all ${isSelected
                            ? "bg-[#B5F500] text-[#111111] border-[#111111]"
                            : "bg-[#F4F4F6] hover:bg-[#FFE600] text-[#111111] border-[#E2E2E8]"
                          }`}
                      >
                        {isSelected ? "SELECTED" : "SELECT"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Confirmation Bar */}
        <div className="p-4 sm:p-5 border-t-3 border-[#111111] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {selectedVideo ? (
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-8 rounded-lg border-2 border-[#111111] overflow-hidden bg-black shrink-0 relative">
                  <video
                    src={selectedVideo.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bebas tracking-wide text-[#111111]">
                    READY TO REPLACE SCENE VIDEO ({selectedVideo.durationSeconds}s • {selectedVideo.source.toUpperCase()})
                  </p>
                  <p className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">
                    {selectedVideo.videoUrl.slice(0, 50)}...
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 font-mono">
                Hover to preview video • Click to select a clip
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 border-[#111111] bg-white hover:bg-neutral-100 font-bebas text-sm uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={!selectedVideo}
              className="px-6 py-2 rounded-xl border-2 border-[#111111] bg-[#B5F500] hover:bg-[#a5e400] text-[#111111] font-bebas text-lg uppercase tracking-wider shadow-[3px_3px_0px_#111111] flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>REPLACE WITH SELECTED VIDEO</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
