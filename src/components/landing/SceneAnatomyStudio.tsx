"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  Sparkles,
  Eye,
  Scissors,
  Volume2,
  FileText,
  Video,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface LayerToggle {
  id: string;
  name: string;
  tag: string;
  desc: string;
  icon: any;
  color: string;
}

const SCENE_LAYERS: LayerToggle[] = [
  {
    id: "bg_halftone",
    name: "Archival Paper Canvas",
    tag: "LAYER 01 • TEXTURE",
    desc: "Tactile paper grain, CRT scanlines & dark newsprint halftone dots.",
    icon: FileText,
    color: "#B5F500",
  },
  {
    id: "b_roll",
    name: "4K Verified B-Roll Footage",
    tag: "LAYER 02 • FOOTAGE",
    desc: "AI Vision QA matched historical footage from commercial archives.",
    icon: Video,
    color: "#FFE600",
  },
  {
    id: "cutout",
    name: "Die-Cut Subject Cutout",
    tag: "LAYER 03 • CUTOUT",
    desc: "Real-time subject isolation with white paper contour & character boil.",
    icon: Scissors,
    color: "#B5F500",
  },
  {
    id: "leader_lines",
    name: "Kinetic Leader Annotations",
    tag: "LAYER 04 • GRAPHICS",
    desc: "Dynamic SVG red leader lines, percentage badges & stamp marks.",
    icon: Sparkles,
    color: "#E50914",
  },
  {
    id: "captions",
    name: "Kinetic Sub-Second Captions",
    tag: "LAYER 05 • SUBTITLES",
    desc: "Sub-second word highlight pill timed to the millisecond.",
    icon: Zap,
    color: "#FFE600",
  },
  {
    id: "foley",
    name: "Foley Audio & Ducking",
    tag: "LAYER 06 • SOUNDSTAGE",
    desc: "Paper unfolding SFX, camera shutter clicks & ducked documentary beat.",
    icon: Volume2,
    color: "#B5F500",
  },
];

export default function SceneAnatomyStudio() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-linked parallax transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const yBgSlow = useTransform(smoothProgress, [0, 1], [-80, 80]);
  const yFloating1 = useTransform(smoothProgress, [0, 1], [60, -90]);
  const yFloating2 = useTransform(smoothProgress, [0, 1], [-70, 70]);
  const yFloating3 = useTransform(smoothProgress, [0, 1], [90, -110]);
  const rotateSticker1 = useTransform(smoothProgress, [0, 1], [-8, 12]);
  const rotateSticker2 = useTransform(smoothProgress, [0, 1], [15, -10]);
  const canvasRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-8, 0, 8]);
  const canvasRotateX = useTransform(smoothProgress, [0, 0.5, 1], [6, 0, -6]);

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    bg_halftone: true,
    b_roll: true,
    cutout: true,
    leader_lines: true,
    captions: true,
    foley: true,
  });

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const enableAll = () => {
    setActiveLayers({
      bg_halftone: true,
      b_roll: true,
      cutout: true,
      leader_lines: true,
      captions: true,
      foley: true,
    });
  };

  return (
    <section
      ref={containerRef}
      className="py-28 bg-[#0C0C0E] text-white border-b-4 border-[#111111] select-none relative overflow-hidden"
    >
      {/* Parallax Background Ambient Glow & Halftone Grid */}
      <motion.div
        style={{ y: yBgSlow }}
        className="absolute top-1/4 left-1/3 w-[800px] h-[600px] bg-[radial-gradient(circle,rgba(181,245,0,0.08)_0%,transparent_70%)] pointer-events-none"
      />
      <div className="absolute inset-0 pointer-events-none vox-halftone opacity-30 z-0" />

      {/* Floating Parallax Background Stamps & Badges */}
      <motion.div
        style={{ y: yFloating1, rotate: rotateSticker1 }}
        className="absolute top-20 left-8 z-10 hidden xl:flex items-center gap-2 bg-[#1A1A1E]/90 border-2 border-[#B5F500] px-4 py-2 rounded-2xl shadow-[6px_6px_0px_#B5F500] pointer-events-none"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#B5F500] animate-ping" />
        <span className="font-mono text-xs font-black text-[#B5F500] uppercase tracking-wider">
          LAYER DEPTH: 6-PLANE RIG
        </span>
      </motion.div>

      <motion.div
        style={{ y: yFloating2, rotate: rotateSticker2 }}
        className="absolute top-1/3 right-10 z-10 hidden xl:flex flex-col items-center bg-[#FFE600] text-[#111111] border-3 border-[#111111] p-3 rounded-2xl shadow-[8px_8px_0px_#111111] pointer-events-none font-bebas text-center"
      >
        <span className="text-2xl leading-none">30 FPS KINETIC</span>
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
          FRAME-PERFECT SYNC
        </span>
      </motion.div>

      <motion.div
        style={{ y: yFloating3 }}
        className="absolute bottom-28 left-12 z-10 hidden xl:flex items-center gap-2 bg-[#E50914] text-white border-2 border-white/40 px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-none font-mono text-[10px] font-bold"
      >
        <Flame className="w-3.5 h-3.5 fill-current" />
        <span>AFTER EFFECTS EQUIVALENT: 40 HOURS</span>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#B5F500] text-[#111111] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md shadow-xs">
            INSIDE THE 2.5D MOTION RIG
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase leading-tight mb-4">
            Anatomy of a Broadcast Scene <br />
            <span className="text-[#FFE600]">Toggle & Inspect Every Layer</span>
          </h2>
          <p className="text-base text-neutral-400 font-medium leading-relaxed">
            Click the layer toggles below to deconstruct how background textures, 4K footage, paper cutouts, kinetic leader lines, and Foley soundscapes assemble in real-time.
          </p>
        </div>

        {/* 2-Column Interactive Layer Rig with 3D Perspective */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left Column: Interactive Layer Toggles (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-neutral-400 font-bold uppercase">
                SCENE COMPOSITOR LAYERS:
              </span>
              <button
                type="button"
                onClick={enableAll}
                className="text-xs font-mono text-[#B5F500] hover:underline font-bold cursor-pointer"
              >
                RESET ALL LAYERS ON
              </button>
            </div>

            {SCENE_LAYERS.map((layer) => {
              const isActive = activeLayers[layer.id];
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  whileHover={{ x: 8 }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? "bg-[#1A1A1E] border-[#B5F500]/70 shadow-lg"
                      : "bg-neutral-900/50 border-neutral-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                        isActive ? "bg-[#B5F500] text-[#111111]" : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bebas text-xl text-white leading-tight">
                          {layer.name}
                        </h4>
                        <span className="text-[9px] font-mono font-bold text-neutral-400">
                          {layer.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {layer.desc}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                      isActive
                        ? "bg-[#B5F500] border-[#B5F500] text-[#111111]"
                        : "border-neutral-700 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Live Layered Canvas Preview with Parallax 3D Perspective (6 cols) */}
          <div className="lg:col-span-6 flex justify-center [perspective:1200px]">
            <motion.div
              style={{
                rotateY: canvasRotateY,
                rotateX: canvasRotateX,
              }}
              className="w-full max-w-sm aspect-[9/13] bg-[#111111] border-4 border-neutral-700 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between transform transition-transform duration-200 hover:scale-102"
            >
              
              {/* Layer 1: Archival Paper Halftone Background */}
              <AnimatePresence>
                {activeLayers.bg_halftone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,#222226_0%,#0C0C0E_100%)] vox-halftone pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Layer 2: 4K Verified B-Roll Footage */}
              <AnimatePresence>
                {activeLayers.b_roll && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.65 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-1 pointer-events-none"
                  >
                    <img
                      src="/vox_documentary_bg.png"
                      alt="4K B-Roll Scene"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top Scene HUD Header */}
              <div className="relative z-20 flex items-center justify-between text-xs font-mono">
                <span className="bg-[#FFE600] text-[#111111] font-black px-2 py-0.5 rounded text-[9px]">
                  SCENE ANATOMY
                </span>
                <span className="text-[#B5F500] font-bold text-[10px]">
                  {Object.values(activeLayers).filter(Boolean).length} / 6 LAYERS ACTIVE
                </span>
              </div>

              {/* Center Scene Body: Cutout + Leader Lines */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                
                {/* Layer 4: Kinetic Leader Annotations */}
                <AnimatePresence>
                  {activeLayers.leader_lines && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-3 right-0 bg-[#E50914] text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-lg font-bold border border-white/20 z-20 animate-bounce"
                    >
                      $50M BUYOUT REFUSED
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Layer 3: Die-Cut Subject Cutout */}
                <AnimatePresence>
                  {activeLayers.cutout ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="w-40 h-44 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#B5F500] rounded-2xl p-2 flex flex-col items-center justify-between text-center overflow-hidden animate-character-boil"
                    >
                      <div className="w-full h-24 rounded-lg overflow-hidden border-2 border-[#111111] bg-[#111111]">
                        <img src="/vox_subject_cutout.png" alt="Cutout" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bebas text-lg text-[#111111] leading-none">
                        BLOCKBUSTER CEO
                      </span>
                      <span className="text-[8px] font-mono text-neutral-500 font-bold uppercase">
                        2.5D DIE-CUT STICKER
                      </span>
                    </motion.div>
                  ) : (
                    <div className="w-40 h-44 border-2 border-dashed border-neutral-700 rounded-2xl flex items-center justify-center text-xs text-neutral-500 font-mono text-center p-2">
                      [Layer 03 Cutout Disabled]
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Layer 5: Deepgram Kinetic Captions */}
              <div className="relative z-20 space-y-2">
                <AnimatePresence>
                  {activeLayers.captions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-black/90 border border-white/20 p-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
                    >
                      <span className="bg-[#FFE600] text-black px-1 rounded mr-1">In 2000,</span>
                      Blockbuster laughed at a $50M offer...
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Layer 6: Foley Soundstage Indicator */}
                <AnimatePresence>
                  {activeLayers.foley && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between text-[9px] font-mono text-[#B5F500] bg-neutral-900/90 px-2 py-1 rounded border border-neutral-800"
                    >
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-[#B5F500]" />
                        <span>FOLEY: Paper Unfold + Shutter Click</span>
                      </span>
                      <span className="animate-pulse">ACTIVE ●</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Bottom Time & Cost Revolution Benchmark Banner */}
        <div className="bg-[#1A1A1E] border-3 border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold text-[#FFE600] uppercase tracking-widest block mb-1">
              THE CREATOR TIME & COST EQUATION
            </span>
            <h3 className="font-bebas text-3xl sm:text-4xl text-white uppercase leading-tight">
              40 Hours in After Effects vs. 60 Seconds in Vox
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Old Way */}
            <div className="bg-neutral-900/80 border-2 border-red-950 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3 text-red-400 font-bold">
                <span className="uppercase">TRADITIONAL AGENCY WORKFLOW</span>
                <span>SLOW & EXPENSIVE</span>
              </div>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> 40+ hours per reel in After Effects & Premiere
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> $1,200 – $2,500 freelancer video editing cost
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> 3-5 days turnaround per video topic
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> Manual cutout tracing & manual subtitle keyframing
                </li>
              </ul>
            </div>

            {/* Vox Way */}
            <div className="bg-neutral-900/80 border-2 border-[#B5F500]/50 p-5 rounded-2xl relative glow-vox-lime">
              <div className="flex items-center justify-between mb-3 text-[#B5F500] font-black">
                <span className="uppercase">VOX 2.5D AUTONOMOUS PIPELINE</span>
                <span>INSTANT & SCALABLE</span>
              </div>
              <ul className="space-y-2 text-white font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B5F500] shrink-0" /> Under 60 seconds cloud GPU rendering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B5F500] shrink-0" /> ~$0.30 total API cost per 1080×1920 MP4
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B5F500] shrink-0" /> Automated AI documentary script & 2.5D die-cuts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B5F500] shrink-0" /> 1-Click direct dispatch to YouTube & Instagram
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
