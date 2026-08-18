"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Sparkles,
  Layers,
  Zap,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  Flame,
  Scissors,
  ArrowRight,
  TrendingUp,
  Camera,
  Mic,
  Share2,
  Check,
  X,
} from "lucide-react";

interface ComparisonRow {
  icon: any;
  feature: string;
  category: string;
  voxText: string;
  genericText: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    icon: Scissors,
    feature: "Cutout Depth",
    category: "LAYERS",
    voxText: "2.5D Die-Cut Stickers & Boil",
    genericText: "Flat unedited stock photos",
  },
  {
    icon: Camera,
    feature: "Camera Motion",
    category: "STEADICAM",
    voxText: "Continuous Drift & Dynamic Pacing",
    genericText: "Rigid linear Ken Burns pan",
  },
  {
    icon: Mic,
    feature: "Cinema Audio",
    category: "SOUNDSTAGE",
    voxText: "Cinema Voice + Foley SFX Sync",
    genericText: "Monotone synthetic robotic voice",
  },
  {
    icon: Zap,
    feature: "Word Captions",
    category: "TIMING",
    voxText: "Dynamic Sub-Second Highlights",
    genericText: "Unaligned static text blocks",
  },
  {
    icon: Share2,
    feature: "Multi-Publish",
    category: "DISTRIBUTION",
    voxText: "1-Click Direct YouTube & IG",
    genericText: "Manual download & multi-reupload",
  },
];

export default function ComparisonSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<"vox" | "generic">("vox");

  // Scroll Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const yStickerLeft = useTransform(smoothProgress, [0, 1], [-50, 60]);
  const yStickerRight = useTransform(smoothProgress, [0, 1], [60, -70]);
  const cardTiltY = useTransform(smoothProgress, [0, 0.5, 1], [4, 0, -4]);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[#F4F4F6] text-[#111111] border-b-4 border-[#111111] select-none relative overflow-hidden"
    >
      {/* Halftone Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none vox-halftone opacity-25 z-0" />

      {/* Floating Parallax Background Elements */}
      <motion.div
        style={{ y: yStickerLeft }}
        className="absolute top-20 left-6 z-10 hidden xl:flex items-center gap-2 bg-[#FFE600] text-[#111111] border-3 border-[#111111] px-3.5 py-1.5 rounded-xl shadow-[4px_4px_0px_#111111] pointer-events-none font-bebas text-base"
      >
        <TrendingUp className="w-4 h-4 text-[#111111]" />
        <span>+340% AUDIENCE RETENTION</span>
      </motion.div>

      <motion.div
        style={{ y: yStickerRight }}
        className="absolute top-1/3 right-8 z-10 hidden xl:flex items-center gap-2 bg-[#111111] text-[#B5F500] border-3 border-[#111111] px-3.5 py-1.5 rounded-xl shadow-[4px_4px_0px_#B5F500] pointer-events-none font-mono text-xs font-bold"
      >
        <span>MOSIDD 2.5D RIG</span>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-[#FFE600] text-[#111111] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md border-2 border-[#111111] shadow-xs">
            WHY 2.5D MOTION GRAPHICS WIN
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-[#111111] uppercase leading-tight mb-4">
            Standard AI Slideshows <br />
            <span className="bg-[#111111] text-[#B5F500] px-3.5 py-0.5 inline-block transform -rotate-1 border-3 border-[#111111] rounded-lg">
              Vs. 2.5D Documentary Reels
            </span>
          </h2>
          <p className="text-base text-[#555555] font-medium leading-relaxed">
            Audiences scroll past flat, robotic AI stock image slideshows in 1.2 seconds. See how our MoSidd 2.5D Steadicam choreography keeps viewers hooked until the last frame.
          </p>

          {/* Interactive Switcher Toggle */}
          <div className="inline-flex items-center gap-2 bg-white p-1.5 rounded-2xl border-3 border-[#111111] shadow-vox mt-6">
            <button
              type="button"
              onClick={() => setActiveMode("vox")}
              className={`px-5 py-2.5 rounded-xl font-bebas text-lg tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "vox"
                  ? "bg-[#B5F500] text-[#111111] border-2 border-[#111111] shadow-xs scale-102"
                  : "text-[#666666] hover:text-black"
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>VOX 2.5D REEL ENGINE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("generic")}
              className={`px-5 py-2.5 rounded-xl font-bebas text-lg tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "generic"
                  ? "bg-[#E50914] text-white border-2 border-[#111111] shadow-xs scale-102"
                  : "text-[#666666] hover:text-black"
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>GENERIC AI SLIDESHOW</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Comparison Showcase with 3D Perspective */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center [perspective:1000px]">
          
          {/* Left Column: Visual Mockup Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              style={{ rotateY: cardTiltY }}
              className="w-full max-w-sm bg-white border-4 border-[#111111] rounded-3xl p-5 shadow-[10px_10px_0px_#111111] relative overflow-hidden transform transition-transform duration-300 hover:scale-102"
            >
              
              {/* Badge */}
              <div className="flex items-center justify-between mb-3 border-b-2 border-[#E2E2E8] pb-2.5">
                <span
                  className={`text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    activeMode === "vox"
                      ? "bg-[#B5F500] text-[#111111] border-[#111111]"
                      : "bg-red-100 text-red-700 border-red-400"
                  }`}
                >
                  {activeMode === "vox" ? "⚡ 2.5D MOTION RIG" : "⚠️ FLAT SLIDESHOW"}
                </span>

                <span className="text-[10px] font-mono text-neutral-500 font-black">
                  {activeMode === "vox" ? "RETENTION: 84.2%" : "RETENTION: 12.8%"}
                </span>
              </div>

              {/* 9:16 Visual Stage */}
              <div className="w-full aspect-[9/11] rounded-2xl border-3 border-[#111111] overflow-hidden relative bg-[#111111] flex flex-col justify-between p-3.5 shadow-inner">
                
                {activeMode === "vox" ? (
                  /* ── PROPER 2.5D MOTION GRAPHIC VIDEO ENGINE STAGE ── */
                  <div className="w-full h-full flex flex-col justify-between relative overflow-hidden rounded-xl">
                    {/* Layer 1: Full-Bleed Animated Documentary Background with Steadicam Drift */}
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], x: [0, -6, 0], y: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <img
                        src="/vox_documentary_bg.png"
                        alt="Documentary Scene"
                        className="w-full h-full object-cover filter contrast-125 brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute inset-0 vox-halftone opacity-30" />
                    </motion.div>

                    {/* Layer 2: Top Scene Badge & Stamp */}
                    <div className="relative z-20 flex items-center justify-between pt-1">
                      <span className="text-[8px] font-mono font-black uppercase bg-[#FFE600] text-[#111111] px-2 py-0.5 rounded border border-[#111111] shadow-xs">
                        SCENE 01 • 2.5D MOTION RIG
                      </span>
                      <span className="bg-red-600 text-white font-mono text-[7px] font-black uppercase px-1.5 py-0.5 rounded border border-white/40 tracking-wider">
                        CLASSIFIED 2000
                      </span>
                    </div>

                    {/* Layer 3: Center 2.5D Die-Cut Subject with Character Boil + SVG Leader Lines */}
                    <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                      
                      {/* Animated Leader Line Tag */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.8, 1, 0.8], y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="self-end mr-2 bg-[#E50914] text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded shadow-lg border border-white/40 mb-1 z-20"
                      >
                        $50M BUYOUT REFUSED ✕
                      </motion.div>

                      {/* Foreground Cutout Subject */}
                      <motion.div
                        animate={{
                          y: [0, -6, 0],
                          rotate: [-1.5, 1.5, -1.5],
                          scale: [1, 1.02, 1],
                        }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                        className="w-32 h-36 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#B5F500] rounded-2xl p-1.5 flex flex-col items-center justify-between text-center overflow-hidden animate-character-boil"
                      >
                        <div className="w-full h-22 rounded-xl overflow-hidden border-2 border-[#111111] bg-[#111111]">
                          <img src="/vox_subject_cutout.png" alt="Paper Cutout" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-full flex items-center justify-between px-1">
                          <span className="font-bebas text-sm text-[#111111] leading-none">
                            REED HASTINGS
                          </span>
                          <span className="text-[7px] font-mono text-neutral-600 font-black uppercase">
                            DIE-CUT
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Layer 4: Kinetic Word-by-Word Captions & Live Soundwave HUD */}
                    <div className="relative z-20 space-y-1.5">
                      <div className="bg-black/90 border border-white/20 rounded-xl p-2 shadow-lg backdrop-blur-xs">
                        <p className="text-[10px] font-extrabold text-white leading-tight">
                          <span className="bg-[#FFE600] text-black px-1 rounded mr-1">In 2000,</span>
                          Blockbuster laughed at Netflix's $50M offer...
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[7px] font-mono font-bold text-[#B5F500] bg-black/80 px-2 py-0.5 rounded border border-neutral-800">
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-2.5 h-2.5 text-[#B5F500]" />
                          <span>FOLEY SFX + CINEMA AUDIO</span>
                        </span>
                        <span className="animate-pulse">ACTIVE ●</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── GENERIC AI SLIDESHOW STAGE (AUTHENTICALLY LOW-EFFORT FLAT SLIDESHOW) ── */
                  <div className="w-full h-full flex flex-col justify-between relative overflow-hidden rounded-xl bg-black">
                    
                    {/* Top Ugly Template Bar */}
                    <div className="relative z-20 pt-1 flex items-center justify-between text-[7px] font-mono bg-black/90 p-1.5 border-b border-neutral-800">
                      <span className="text-neutral-500">
                        AUTOMATED_SLIDESHOW_V1.EXE
                      </span>
                      <span className="bg-red-600/80 text-white font-bold px-1 rounded">
                        FLAT / NO MOTION
                      </span>
                    </div>

                    {/* Center Pillarboxed 16:9 Landscape Stock Photo in Vertical Viewport */}
                    <div className="relative z-10 my-auto w-full flex flex-col items-center">
                      <div className="w-full aspect-video bg-neutral-900 border-y border-neutral-700 relative overflow-hidden flex items-center justify-center">
                        <img
                          src="/vox_subject_cutout.png"
                          alt="Unedited Stock Photo"
                          className="w-full h-full object-cover filter grayscale contrast-50 brightness-75 scale-125"
                        />
                        
                        {/* Ugly Stock Watermark */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none">
                          <span className="text-white/60 font-mono text-[9px] font-black uppercase tracking-widest border border-white/40 px-2 py-0.5 transform -rotate-12">
                            UNLICENSED STOCK WATERMARK
                          </span>
                          <span className="text-red-400 font-mono text-[7px] mt-1">
                            free_trial_sample_img_049.jpg
                          </span>
                        </div>
                      </div>

                      {/* Immediate Swipe-Away Retention Drop Banner */}
                      <div className="mt-2 bg-red-950/90 text-red-300 border border-red-800/80 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold flex items-center gap-1 shadow-md">
                        <span>👆 94% VIEWERS SWIPED AWAY (0:01s)</span>
                      </div>
                    </div>

                    {/* Bottom Clumsy Wall-of-Text Subtitle Block (No Dynamic Sync) */}
                    <div className="relative z-20 space-y-1 p-1 bg-black/95 border-t border-neutral-800">
                      <div className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-left">
                        <span className="text-[7px] font-mono text-neutral-500 uppercase block mb-0.5">
                          🤖 MONOTONE ROBOT TTS (NO FOLEY SFX):
                        </span>
                        <p className="text-[8px] text-neutral-300 font-sans leading-snug">
                          "Netflix was an American subscription DVD mail company founded in 1997 in California which lost money."
                        </p>
                      </div>

                      {/* Generic Static Progress Bar */}
                      <div className="flex items-center justify-between text-[7px] font-mono text-neutral-500 px-1">
                        <span>SLIDE 1 OF 12</span>
                        <span>TRANSITION: FADE (LINEAR)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Status Ticker Footer */}
              <div className="mt-3 pt-2 border-t-2 border-[#E2E2E8] flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[#666666] text-[10px]">MOTION RIG:</span>
                <span className={activeMode === "vox" ? "text-[#111111] bg-[#B5F500] px-2 py-0.5 rounded text-[9px]" : "text-red-600 bg-red-50 px-2 py-0.5 rounded text-[9px]"}>
                  {activeMode === "vox" ? "Steadicam + Foley SFX" : "Linear Pan & Zero SFX"}
                </span>
              </div>

            </motion.div>
          </div>

          {/* Right Column: Sleek Compact Editorial Spec Table (7 cols) */}
          <div className="lg:col-span-7 bg-white border-4 border-[#111111] rounded-3xl p-5 sm:p-6 shadow-[10px_10px_0px_#111111] flex flex-col justify-between">
            
            {/* Table Header HUD */}
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#111111]" />
                <span className="font-bebas text-xl text-[#111111] uppercase tracking-wide">
                  Feature Comparison Matrix
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                <span className="bg-[#B5F500] text-[#111111] px-2 py-0.5 rounded border border-[#111111]">
                  VOX 2.5D
                </span>
                <span className="text-neutral-400">VS</span>
                <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-300">
                  STANDARD AI
                </span>
              </div>
            </div>

            {/* Compact Spec Rows Stack */}
            <div className="divide-y divide-[#EAEAEA] text-xs">
              {COMPARISON_ROWS.map((row, idx) => {
                const RowIcon = row.icon;
                return (
                  <div
                    key={idx}
                    className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF9F5] px-2 rounded-xl transition-colors"
                  >
                    {/* Left: Feature Name */}
                    <div className="flex items-center gap-2 sm:w-1/3">
                      <div className="w-6 h-6 rounded-md bg-[#111111] text-[#B5F500] flex items-center justify-center shrink-0">
                        <RowIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-[#111111] font-sans text-xs block leading-tight">
                          {row.feature}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-400 font-bold uppercase">
                          {row.category}
                        </span>
                      </div>
                    </div>

                    {/* Right: Dual Compact Chips */}
                    <div className="grid grid-cols-2 gap-2 sm:w-2/3">
                      {/* Vox Chip */}
                      <div className="bg-[#B5F500]/20 border border-[#B5F500] rounded-lg px-2 py-1 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-800 font-black shrink-0" />
                        <span className="text-[11px] font-bold text-[#111111] truncate">
                          {row.voxText}
                        </span>
                      </div>

                      {/* Generic Chip */}
                      <div className="bg-neutral-100 border border-neutral-200 rounded-lg px-2 py-1 flex items-center gap-1.5 opacity-70">
                        <X className="w-3 h-3 text-red-500 font-black shrink-0" />
                        <span className="text-[11px] text-neutral-500 truncate line-through decoration-red-400">
                          {row.genericText}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Compact Retention Banner */}
            <div className="mt-4 pt-3 border-t-2 border-[#111111] flex items-center justify-between bg-[#111111] text-white p-3 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#B5F500] text-[#111111] font-bebas text-lg px-2 py-0.5 rounded font-black leading-none">
                  3.4×
                </span>
                <span className="font-bebas text-sm uppercase tracking-wide text-[#FFE600]">
                  Higher Algorithm Retention & Watch Time
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-neutral-400 hidden sm:inline-block">
                MEASURED OVER 100K+ VIEWS
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
