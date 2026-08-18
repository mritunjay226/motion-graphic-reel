"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Rocket,
  Sparkles,
  CheckCircle2,
  Share2,
  TrendingUp,
  MessageSquare,
  Hash,
  Send,
  Zap,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon } from "@/components/icons/BrandIcons";

export default function SocialPublishShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePlatform, setActivePlatform] = useState<"youtube" | "instagram">("youtube");
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Scroll Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const yBadge1 = useTransform(smoothProgress, [0, 1], [-70, 80]);
  const yBadge2 = useTransform(smoothProgress, [0, 1], [80, -90]);
  const yBadge3 = useTransform(smoothProgress, [0, 1], [-40, 50]);
  const rotateBadge1 = useTransform(smoothProgress, [0, 1], [-8, 12]);
  const rotateBadge2 = useTransform(smoothProgress, [0, 1], [10, -10]);
  const phoneTiltY = useTransform(smoothProgress, [0, 0.5, 1], [8, 0, -8]);

  const handleSimulateDispatch = () => {
    setIsSimulatingDispatch(true);
    setTimeout(() => {
      setIsSimulatingDispatch(false);
      setDispatchedSuccess(true);
      setTimeout(() => setDispatchedSuccess(false), 4000);
    }, 1500);
  };

  return (
    <section
      ref={containerRef}
      className="py-28 bg-[#111111] text-white border-b-4 border-[#111111] select-none relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(255,230,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Parallax Channel Badges */}
      <motion.div
        style={{ y: yBadge1, rotate: rotateBadge1 }}
        className="absolute top-20 left-10 z-10 hidden xl:flex items-center gap-2.5 bg-red-600/90 text-white border-2 border-red-400 px-4 py-2 rounded-2xl shadow-[6px_6px_0px_#B5F500] pointer-events-none font-bebas text-lg"
      >
        <YoutubeIcon className="w-5 h-5 text-white" />
        <span>DIRECT YOUTUBE SHORTS API</span>
      </motion.div>

      <motion.div
        style={{ y: yBadge2, rotate: rotateBadge2 }}
        className="absolute bottom-24 left-1/4 z-10 hidden xl:flex items-center gap-2.5 bg-fuchsia-600/90 text-white border-2 border-fuchsia-400 px-4 py-2 rounded-2xl shadow-[6px_6px_0px_#FFE600] pointer-events-none font-bebas text-lg"
      >
        <InstagramIcon className="w-5 h-5 text-white" />
        <span>INSTAGRAM REELS AUTO-POST</span>
      </motion.div>

      <motion.div
        style={{ y: yBadge3 }}
        className="absolute top-1/3 right-12 z-10 hidden xl:flex flex-col items-center bg-[#B5F500] text-[#111111] border-3 border-[#111111] px-4 py-2.5 rounded-2xl shadow-[6px_6px_0px_#111111] pointer-events-none font-mono text-xs font-bold text-center"
      >
        <span>VIRAL TITLE HOOKS</span>
        <span className="text-[9px] text-neutral-800">AUTOMATIC PINNED FIRST COMMENT</span>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#FFE600] text-[#111111] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md shadow-xs">
            1-CLICK MULTI-CHANNEL DISTRIBUTION
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase leading-tight mb-4">
            Zero Manual Downloads. <br />
            <span className="text-[#B5F500]">Direct Social Auto-Dispatch</span>
          </h2>
          <p className="text-base text-neutral-400 font-medium leading-relaxed">
            Render your 2.5D documentary reel and post directly to YouTube Shorts and Instagram Reels in a single click with AI-crafted viral hooks, tags, and algorithmic first comments.
          </p>
        </div>

        {/* Interactive Dual-Channel Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center [perspective:1000px]">
          
          {/* Left Column: Platform Toggle & Mock Post Configuration (6 cols) */}
          <div className="lg:col-span-6 bg-[#1A1A1E] border-3 border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Platform Selector Tabs */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setActivePlatform("youtube")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bebas text-lg uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                    activePlatform === "youtube"
                      ? "bg-red-600/20 text-red-400 border-red-500 shadow-md"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <YoutubeIcon className="w-5 h-5 text-red-500" />
                  <span>YOUTUBE SHORTS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePlatform("instagram")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bebas text-lg uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                    activePlatform === "instagram"
                      ? "bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500 shadow-md"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <InstagramIcon className="w-5 h-5 text-fuchsia-400" />
                  <span>INSTAGRAM REELS</span>
                </button>
              </div>

              {/* AI Auto-Generated Copy Preview Box */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-neutral-400 font-bold block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" />
                    <span>AI VIRAL HOOK TITLE:</span>
                  </span>
                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-white font-semibold">
                    {activePlatform === "youtube"
                      ? "Why Blockbuster Laughed At Netflix in 2000 (And Lost $45B) 😱 #shorts"
                      : "THE CRAZY TRUTH ABOUT BLOCKBUSTER'S $50M MISTAKE 🚨"}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 font-bold block mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#B5F500]" />
                    <span>ALGORITHMIC HASHTAGS & TAGS:</span>
                  </span>
                  <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-[#B5F500] text-[11px] font-bold">
                    #Documentary #BusinessStrategy #Netflix #Startup #MotionGraphics #VoxStyle
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 font-bold block mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PINNED ENGAGEMENT QUESTION (FIRST COMMENT):</span>
                  </span>
                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-neutral-300 italic">
                    "Would you have taken the $50M Netflix deal in 2000? Let us know below! 👇"
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleSimulateDispatch}
                disabled={isSimulatingDispatch}
                className="w-full py-4 rounded-2xl font-bebas text-2xl uppercase tracking-wider bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] border-2 border-white shadow-vox transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingDispatch ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin" />
                    <span>DISPATCHING 1080×1920 MP4 TO SOCIAL CLOUD...</span>
                  </>
                ) : dispatchedSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-900" />
                    <span>DISPATCH COMPLETE! LIVE ON YOUTUBE & IG</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>TEST 1-CLICK PUBLISH DISPATCH</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Mockup Feed Preview with 3D Parallax Tilt (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              style={{ rotateY: phoneTiltY }}
              className="w-full max-w-sm bg-black border-4 border-neutral-700 rounded-3xl p-4 shadow-2xl relative overflow-hidden transform transition-transform duration-300 hover:scale-102"
            >
              
              {/* Phone Status Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-3 px-2">
                <span>9:41 AM</span>
                <span className="text-[#B5F500] font-bold">5G • BROADCAST LIVE</span>
              </div>

              {/* Feed Card */}
              <div className="w-full aspect-[9/12] rounded-2xl overflow-hidden bg-[#1A1A1E] border-2 border-neutral-800 relative flex flex-col justify-between p-4">
                <img
                  src="/vox_subject_cutout.png"
                  alt="Social Post Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Top Channel Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#B5F500] border-2 border-white text-[#111111] flex items-center justify-center font-bebas text-sm font-bold">
                      VX
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Vox Documentary Hub</p>
                      <p className="text-[9px] text-neutral-400 font-mono">@voxdocumentaries</p>
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-mono font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                    LIVE SHORTS
                  </span>
                </div>

                {/* Floating Social Reactions Bar */}
                <div className="relative z-10 self-end flex flex-col items-center gap-3 bg-black/60 p-2 rounded-2xl border border-white/10 backdrop-blur-sm text-xs font-mono">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="w-4 h-4 text-[#B5F500]" />
                    <span className="text-[9px] font-bold mt-0.5">84.2K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageSquare className="w-4 h-4 text-[#FFE600]" />
                    <span className="text-[9px] font-bold mt-0.5">1.4K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-[9px] font-bold mt-0.5">9.8K</span>
                  </div>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="relative z-10 bg-black/80 p-2.5 rounded-xl border border-white/10 text-[10px] text-white">
                  <p className="font-bold line-clamp-2">
                    Why Blockbuster rejected Netflix in 2000... Full breakdown in reel! 🔥 #shorts #business
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
