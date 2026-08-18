"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Palette, Volume2, Sparkles, Check, Play, Scissors, Layers, Sliders, Music, Disc } from "lucide-react";

interface ThemePreset {
  id: string;
  name: string;
  subtitle: string;
  bgColor: string;
  cardBg: string;
  accentColor: string;
  textColor: string;
  fontClass: string;
  texture: string;
  soundName: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: "vox_dark",
    name: "Vox Dark Archival",
    subtitle: "High-contrast documentary, newsprint halftones & neon yellow highlights.",
    bgColor: "bg-[#0C0C0E]",
    cardBg: "bg-[#1A1A1E]",
    accentColor: "#B5F500",
    textColor: "text-white",
    fontClass: "font-bebas",
    texture: "vox-halftone",
    soundName: "Foley Paper Unfold & Camera Shutter",
  },
  {
    id: "retro_vhs",
    name: "Retro VHS 90s",
    subtitle: "Analog CRT scanlines, chromatic aberration, and timestamp overlay.",
    bgColor: "bg-[#0A0518]",
    cardBg: "bg-[#160D2C]",
    accentColor: "#FF007F",
    textColor: "text-[#FFE600]",
    fontClass: "font-mono",
    texture: "vox-scanlines",
    soundName: "Tape Rewind & Static Click",
  },
  {
    id: "blueprint",
    name: "Blueprint Matrix",
    subtitle: "Architectural grid lines, technical telemetry nodes, and cyan accents.",
    bgColor: "bg-[#071324]",
    cardBg: "bg-[#0D223F]",
    accentColor: "#00F0FF",
    textColor: "text-cyan-200",
    fontClass: "font-mono",
    texture: "bg-[linear-gradient(to_right,#00f0ff0f_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff0f_1px,transparent_1px)] [background-size:24px_24px]",
    soundName: "Subtle Computer Beep & Telemetry",
  },
  {
    id: "ft_paper",
    name: "Financial Times Paper",
    subtitle: "Tactile peach newsprint with editorial serifs and archival red stamps.",
    bgColor: "bg-[#FDF0E7]",
    cardBg: "bg-white",
    accentColor: "#9C4125",
    textColor: "text-[#111111]",
    fontClass: "font-serif-editorial",
    texture: "vox-paper-fiber",
    soundName: "Typewriter Key & Bell",
  },
  {
    id: "monochrome_noir",
    name: "Monochrome Noir",
    subtitle: "Ultra high-contrast black & white cinema grain with sharp leader lines.",
    bgColor: "bg-[#050505]",
    cardBg: "bg-[#141414]",
    accentColor: "#FFFFFF",
    textColor: "text-white",
    fontClass: "font-sans",
    texture: "vox-film-grain",
    soundName: "Film Projector 35mm Click",
  },
];

export default function ThemeAudioStudioPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [isPlayingSfx, setIsPlayingSfx] = useState(false);

  // Scroll Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const yDisc = useTransform(smoothProgress, [0, 1], [-80, 90]);
  const rotateDisc = useTransform(smoothProgress, [0, 1], [0, 360]);
  const yWave = useTransform(smoothProgress, [0, 1], [60, -70]);
  const yChip = useTransform(smoothProgress, [0, 1], [-50, 60]);

  const handleAuditionSfx = () => {
    setIsPlayingSfx(true);
    setTimeout(() => setIsPlayingSfx(false), 1200);
  };

  return (
    <section
      ref={containerRef}
      className="py-28 bg-[#F4F4F6] text-[#111111] border-b-4 border-[#111111] select-none relative overflow-hidden"
    >
      {/* Floating Parallax Background Audio Visual Elements */}
      <motion.div
        style={{ y: yDisc, rotate: rotateDisc }}
        className="absolute top-16 right-8 z-10 hidden xl:flex items-center justify-center w-28 h-28 rounded-full bg-[#111111] border-4 border-[#FFE600] shadow-[8px_8px_0px_#111111] pointer-events-none opacity-80"
      >
        <div className="w-10 h-10 rounded-full bg-[#FFE600] flex items-center justify-center font-bebas text-[#111111] text-xs font-bold">
          AUDIO
        </div>
      </motion.div>

      <motion.div
        style={{ y: yWave }}
        className="absolute bottom-20 left-8 z-10 hidden xl:flex items-center gap-1.5 bg-[#111111] text-[#B5F500] px-4 py-2.5 rounded-2xl border-2 border-[#B5F500] shadow-md pointer-events-none font-mono text-xs"
      >
        <Volume2 className="w-4 h-4 text-[#B5F500]" />
        <span>FOLEY DUCKING ENGINE: -18dB</span>
      </motion.div>

      <motion.div
        style={{ y: yChip }}
        className="absolute top-1/2 left-4 z-10 hidden xl:block bg-[#FFE600] text-[#111111] font-mono text-[10px] font-bold px-3 py-1.5 rounded-xl border-2 border-[#111111] shadow-xs transform -rotate-6 pointer-events-none"
      >
        7 BROADCAST STYLES
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block bg-[#111111] text-[#B5F500] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md shadow-xs">
            ART DIRECTION & SOUND DESIGN STUDIO
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-[#111111] uppercase leading-tight mb-4">
            Custom Visual Themes <br />
            <span className="bg-[#FFE600] px-3.5 py-0.5 inline-block transform -rotate-1 border-3 border-[#111111] rounded-lg">
              & Foley Soundscapes
            </span>
          </h2>
          <p className="text-base text-[#555555] font-medium leading-relaxed">
            Switch art directions with a single click. Every preset automatically pairs tailored typography, halftone textures, paper color grading, and authentic Foley sound effects.
          </p>
        </div>

        {/* 2-Column Theme Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Preset Selector Pills (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono text-[#555555] font-bold uppercase block mb-1">
              SELECT VISUAL THEME PRESET:
            </span>

            {THEME_PRESETS.map((preset) => {
              const isSelected = activeTheme.id === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  onClick={() => setActiveTheme(preset)}
                  whileHover={{ x: 6 }}
                  className={`p-4 rounded-2xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#111111] shadow-[6px_6px_0px_#111111] scale-102"
                      : "bg-[#EAEAEF] border-[#D0D0D8] hover:border-[#111111] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border-2 border-[#111111]"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      <h4 className="font-bebas text-xl text-[#111111] leading-none">
                        {preset.name}
                      </h4>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono font-black uppercase bg-[#B5F500] text-[#111111] px-2 py-0.5 rounded border border-[#111111]">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#666666] font-medium leading-relaxed">
                    {preset.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Stage Mockup with Active Theme Styling (7 cols) */}
          <div className="lg:col-span-7 flex justify-center [perspective:1000px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTheme.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.25 }}
                className={`w-full max-w-md ${activeTheme.bgColor} ${activeTheme.textColor} border-4 border-[#111111] rounded-3xl p-6 shadow-[14px_14px_0px_#111111] relative overflow-hidden`}
              >
                {/* Theme Texture Simulation */}
                <div className={`absolute inset-0 pointer-events-none opacity-40 ${activeTheme.texture}`} />

                {/* Top Viewfinder Bar */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-3 mb-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-ping"
                      style={{ backgroundColor: activeTheme.accentColor }}
                    />
                    <span className="font-bold uppercase tracking-wider">
                      THEME: {activeTheme.name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold opacity-75">
                    9:16 VERTICAL
                  </span>
                </div>

                {/* Center 9:16 Simulated Stage */}
                <div className={`w-full aspect-[9/11] rounded-2xl ${activeTheme.cardBg} border-2 border-white/20 p-5 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                  
                  {/* Scene Title */}
                  <div className="relative z-10">
                    <span
                      className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border border-black/20 inline-block mb-1"
                      style={{ backgroundColor: activeTheme.accentColor, color: "#111111" }}
                    >
                      SCENE 01 HOOK
                    </span>
                    <h3 className={`${activeTheme.fontClass} text-3xl leading-tight uppercase`}>
                      The Fall of Blockbuster
                    </h3>
                  </div>

                  {/* Cutout Visual Element */}
                  <div className="relative z-10 my-auto flex flex-col items-center">
                    <div className="w-36 h-36 rounded-2xl border-2 border-white/30 overflow-hidden bg-black/40 relative shadow-xl">
                      <img
                        src="/vox_subject_cutout.png"
                        alt="Subject Cutout"
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute bottom-1 right-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded text-black"
                        style={{ backgroundColor: activeTheme.accentColor }}
                      >
                        STICKER LAYER
                      </span>
                    </div>
                  </div>

                  {/* Kinetic Subtitles Pill */}
                  <div className="relative z-10 bg-black/80 border border-white/20 p-2.5 rounded-xl text-xs font-bold text-white shadow-lg">
                    <span
                      className="px-1 py-0.5 rounded text-black mr-1"
                      style={{ backgroundColor: activeTheme.accentColor }}
                    >
                      In 2000,
                    </span>
                    Netflix pitched a buyout for $50,000,000...
                  </div>
                </div>

                {/* Bottom Sound Design Audition Bar */}
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Volume2 className="w-4 h-4 text-[#FFE600]" />
                    <span className="text-[11px] truncate max-w-[200px]">
                      {activeTheme.soundName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAuditionSfx}
                    disabled={isPlayingSfx}
                    className="px-3 py-1.5 rounded-xl font-bebas text-sm uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-white/30 hover:scale-105 transition-all text-[#111111]"
                    style={{ backgroundColor: activeTheme.accentColor }}
                  >
                    <Play className={`w-3 h-3 fill-current ${isPlayingSfx ? "animate-spin" : ""}`} />
                    <span>{isPlayingSfx ? "AUDITIONING..." : "PLAY SFX"}</span>
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
