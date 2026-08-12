"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import FilmTreatment from "./FilmTreatment";

const CAPTIONS_SCENE_1 = [
  { text: "In 2000,", start: 1, end: 90 },
  { text: "Blockbuster", start: 91, end: 170 },
  { text: "laughed at", start: 171, end: 230 },
  { text: "a $50M offer", start: 231, end: 300 },
];

const CAPTIONS_SCENE_2 = [
  { text: "By eliminating", start: 301, end: 380 },
  { text: "late fees,", start: 381, end: 450 },
  { text: "Netflix disrupted", start: 451, end: 530 },
  { text: "video retail.", start: 531, end: 600 },
];

const CAPTIONS_SCENE_3 = [
  { text: "Today, Netflix", start: 601, end: 680 },
  { text: "is worth over", start: 681, end: 770 },
  { text: "$45 Billion", start: 771, end: 900 },
];

export default function ScrollMotionReelSim() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [speedMode, setSpeedMode] = useState<"0.5x" | "1.0x" | "2.0x">("1.0x");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Bind Framer Motion scroll progress to container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate live frame number (0 to 900 frames for 30s reel @ 30 FPS)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frame = Math.min(900, Math.max(1, Math.round(latest * 900)));
    setCurrentFrame(frame);
  });

  // Scene transition transforms
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.33], [1, 1, 0]);
  const scene2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.62, 0.67], [0, 1, 1, 0]);
  const scene3Opacity = useTransform(scrollYProgress, [0.64, 0.7, 0.95, 1], [0, 1, 1, 1]);

  // Motion graphic transforms
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const leaderLineLength = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const stampScale = useTransform(scrollYProgress, [0.38, 0.45], [2.5, 1]);
  const barChartHeight = useTransform(scrollYProgress, [0.7, 0.9], ["0%", "85%"]);
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const scrollToScene = (sceneIndex: number) => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight;
    const targetScroll = top + (height / 3) * sceneIndex;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    const top = containerRef.current.offsetTop;
    const height = containerRef.current.offsetHeight;
    window.scrollTo({ top: top + height * progress, behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative h-[330vh] bg-[#0C0C0E] text-white select-none">
      {/* Sticky Fullscreen Motion Graphic Reel Workstation */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 py-6">
        
        {/* Film Treatment Noise & CRT Overlay */}
        <FilmTreatment grainOpacity={0.18} scanlines={true} vignette={true} />

        {/* Workstation Header HUD */}
        <div className="absolute top-4 left-6 right-6 z-40 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#B5F500]">
          <div className="flex items-center gap-3">
            <span className="bg-[#111111] text-[#B5F500] px-3.5 py-1.5 rounded-lg border-2 border-[#B5F500]/60 uppercase tracking-widest font-black flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B5F500] animate-ping" />
              <span>LIVE REMOTION SCROLL ENGINE</span>
            </span>

            {/* Scene Jump Navigation Pills */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#1A1A1A] p-1 rounded-lg border border-gray-800 text-[10px]">
              <button
                type="button"
                onClick={() => scrollToScene(0)}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                  currentFrame < 300 ? "bg-[#FFE600] text-[#111111] shadow-xs" : "text-gray-400 hover:text-white"
                }`}
              >
                SCENE 01: HERO CUTOUT
              </button>
              <button
                type="button"
                onClick={() => scrollToScene(1)}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                  currentFrame >= 300 && currentFrame < 600 ? "bg-[#FFE600] text-[#111111] shadow-xs" : "text-gray-400 hover:text-white"
                }`}
              >
                SCENE 02: NEWSPAPER MEMO
              </button>
              <button
                type="button"
                onClick={() => scrollToScene(2)}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                  currentFrame >= 600 ? "bg-[#FFE600] text-[#111111] shadow-xs" : "text-gray-400 hover:text-white"
                }`}
              >
                SCENE 03: ORBIT BAR CHART
              </button>
            </div>
          </div>

          {/* Live Frame Counter & Timecode */}
          <div className="bg-[#1A1A1A] px-4 py-1.5 rounded-lg border border-gray-800 flex items-center gap-3 font-mono text-xs shadow-md">
            <span className="text-gray-400 font-bold">FRAME:</span>
            <span className="text-[#FFE600] font-black">{currentFrame.toString().padStart(3, "0")} / 900</span>
            <span className="text-gray-600">|</span>
            <span className="text-white font-bold">
              00:{(Math.floor(currentFrame / 30)).toString().padStart(2, "0")}:
              {((currentFrame % 30) * 3).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE 9:16 VERTICAL MOTION GRAPHIC VIDEO REEL SIMULATOR STAGE */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-[390px] h-[78vh] max-h-[720px] rounded-3xl overflow-hidden border-4 border-[#333333] shadow-[0_0_80px_rgba(181,245,0,0.15)] bg-[#FAFAFA] flex flex-col justify-between p-6 group">
          
          {/* Top Control Bar inside Player */}
          <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="bg-[#111111]/80 hover:bg-[#111111] text-[#B5F500] border border-[#B5F500]/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>{isAudioMuted ? "🔇 MUTE" : "🔊 AUDIO ON"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-[#111111]/80 hover:bg-[#111111] text-[#B5F500] border border-[#B5F500]/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>{isPlaying ? "⏸ PAUSE STAGE" : "▶ PLAY STAGE"}</span>
            </button>
          </div>

          {/* Background Canvas Layer */}
          <motion.div style={{ scale: bgScale }} className="absolute inset-0 z-0">
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_40%,#FAFAFA_0%,#E6E6E6_60%,#D0D0D0_100%)] vox-halftone opacity-80" />
          </motion.div>

          {/* ==================== SCENE 1: CENTER HERO CUTOUT ==================== */}
          <motion.div style={{ opacity: scene1Opacity }} className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
            <div className="pt-8">
              <div className="inline-block bg-[#FFE600] text-[#111111] font-bebas text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider mb-1.5 border border-[#111111] shadow-xs">
                SCENE 01 • STORY OPENER
              </div>
              <h2 className="font-bebas text-4xl text-[#111111] leading-none">
                THE $50 MILLION <br />
                <span className="text-[#E50914] bg-white px-2 py-0.5 inline-block border-2 border-[#111111] shadow-[3px_3px_0px_#111111]">
                  MISTAKE
                </span>
              </h2>
            </div>

            {/* Scene 1 Subject Cutout with Organic Boil Wiggle */}
            <div className="relative flex-1 flex items-center justify-center my-4">
              <motion.div style={{ y: foregroundY }} className="relative z-10 w-52 h-60 bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rounded-2xl flex flex-col items-center justify-between p-3 text-center rotate-[-3deg] overflow-hidden animate-character-boil">
                <div className="w-full h-32 relative rounded-xl overflow-hidden border-2 border-[#111111] bg-[#111111]">
                  <img src="/vox_subject_cutout.png" alt="Die-cut Subject" className="w-full h-full object-cover" />
                </div>
                <span className="font-bebas text-2xl text-[#111111] leading-tight mt-1">
                  BLOCKBUSTER CEO
                </span>
                <span className="text-[10px] font-mono text-[#555555] font-extrabold uppercase">
                  REJECTED NETFLIX PITCH
                </span>
              </motion.div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 300 300">
                <motion.path
                  d="M 180 150 L 250 110 L 280 110"
                  stroke="#E50914"
                  strokeWidth="3.5"
                  fill="none"
                  style={{ pathLength: leaderLineLength }}
                />
                <circle cx="280" cy="110" r="5" fill="#E50914" />
              </svg>

              <div className="absolute right-0 top-16 bg-[#111111] text-white text-[10px] font-mono px-2.5 py-1 rounded-md shadow-md border border-[#E50914] font-bold">
                REFUSED BUYOUT
              </div>
            </div>

            {/* Word-by-Word Synchronized Captions Box */}
            <div className="bg-white/95 border-2 border-[#111111] rounded-xl p-3 shadow-[4px_4px_0px_#111111] z-20">
              <div className="flex flex-wrap gap-1 font-sans text-xs text-[#111111] font-extrabold leading-relaxed">
                {CAPTIONS_SCENE_1.map((cap, i) => (
                  <span
                    key={i}
                    className={`px-1 rounded transition-colors ${
                      currentFrame >= cap.start && currentFrame <= cap.end
                        ? "bg-[#FFE600] text-black scale-105"
                        : "text-[#444444]"
                    }`}
                  >
                    {cap.text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ==================== SCENE 2: NEWSPAPER & STAMP ==================== */}
          <motion.div style={{ opacity: scene2Opacity }} className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
            <div className="pt-8">
              <div className="inline-block bg-[#111111] text-[#B5F500] font-bebas text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider mb-1.5 shadow-xs">
                SCENE 02 • HISTORICAL PROOF
              </div>
              <h2 className="font-bebas text-4xl text-[#111111] leading-none">
                THE NETFLIX MODEL <br />
                <span className="bg-[#FFE600] text-[#111111] px-2 py-0.5 inline-block border border-[#111111]">
                  TAKES OVER
                </span>
              </h2>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <div className="w-60 bg-[#F4F1EA] border-3 border-[#111111] p-3.5 shadow-[8px_8px_0px_#111111] rotate-[2deg] rounded-lg animate-character-boil">
                <div className="w-full h-36 rounded-md border-2 border-[#111111] overflow-hidden mb-2">
                  <img src="/vox_newspaper_clipping.png" alt="Newspaper Clipping" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bebas text-xl text-[#111111] leading-none mb-1">
                  DVD BY MAIL SURGES 300%
                </h4>
                <p className="text-[10px] text-[#222222] leading-tight font-serif-editorial italic font-normal">
                  Subscribers flock to flat-rate monthly plans with zero late fees.
                </p>
              </div>

              <motion.div
                style={{ scale: stampScale }}
                className="absolute top-12 right-2 border-4 border-red-600 text-red-600 font-bebas text-3xl px-3 py-1 rotate-[-12deg] bg-red-600/10 font-black uppercase tracking-widest pointer-events-none rounded-lg shadow-lg"
              >
                DISRUPTED
              </motion.div>
            </div>

            <div className="bg-white/95 border-2 border-[#111111] rounded-xl p-3 shadow-[4px_4px_0px_#111111] z-20">
              <div className="flex flex-wrap gap-1 font-sans text-xs text-[#111111] font-extrabold leading-relaxed">
                {CAPTIONS_SCENE_2.map((cap, i) => (
                  <span
                    key={i}
                    className={`px-1 rounded transition-colors ${
                      currentFrame >= cap.start && currentFrame <= cap.end
                        ? "bg-[#B5F500] text-black scale-105"
                        : "text-[#444444]"
                    }`}
                  >
                    {cap.text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ==================== SCENE 3: INFOGRAPHIC ORBIT & BAR CHART ==================== */}
          <motion.div style={{ opacity: scene3Opacity }} className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
            <div className="pt-8">
              <div className="inline-block bg-[#E50914] text-white font-bebas text-xs px-2.5 py-0.5 font-bold uppercase tracking-wider mb-1.5 shadow-xs">
                SCENE 03 • FINANCIAL SCALE
              </div>
              <h2 className="font-bebas text-4xl text-[#111111] leading-none">
                $45 BILLION <br />
                <span className="bg-[#111111] text-[#B5F500] px-2 py-0.5 inline-block border border-[#111111]">
                  VALUATION
                </span>
              </h2>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <motion.svg style={{ rotate: orbitRotation }} className="absolute w-56 h-56 pointer-events-none opacity-50" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" stroke="#B5F500" strokeWidth="2.5" strokeDasharray="6,6" fill="none" />
                <circle cx="100" cy="10" r="6" fill="#B5F500" />
                <circle cx="190" cy="100" r="6" fill="#111111" />
              </motion.svg>

              <div className="w-56 h-48 bg-white border-3 border-[#111111] p-3.5 shadow-[8px_8px_0px_#111111] rounded-xl flex items-end justify-between gap-3">
                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <span className="text-[9px] font-mono text-[#666666] mb-1 font-extrabold">$50M</span>
                  <div className="w-full bg-[#111111] h-[25%] rounded-t" />
                  <span className="text-[10px] font-bebas mt-1">2000</span>
                </div>

                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <span className="text-[9px] font-mono text-[#666666] mb-1 font-extrabold">$10B</span>
                  <div className="w-full bg-[#FFE600] h-[55%] rounded-t border border-[#111111]" />
                  <span className="text-[10px] font-bebas mt-1">2010</span>
                </div>

                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <span className="text-[9px] font-mono text-[#E50914] mb-1 font-black">$45B</span>
                  <motion.div style={{ height: barChartHeight }} className="w-full bg-[#B5F500] rounded-t border border-[#111111]" />
                  <span className="text-[10px] font-bebas mt-1">PEAK</span>
                </div>
              </div>
            </div>

            <div className="bg-white/95 border-2 border-[#111111] rounded-xl p-3 shadow-[4px_4px_0px_#111111] z-20">
              <div className="flex flex-wrap gap-1 font-sans text-xs text-[#111111] font-extrabold leading-relaxed">
                {CAPTIONS_SCENE_3.map((cap, i) => (
                  <span
                    key={i}
                    className={`px-1 rounded transition-colors ${
                      currentFrame >= cap.start && currentFrame <= cap.end
                        ? "bg-[#FFE600] text-black scale-105"
                        : "text-[#444444]"
                    }`}
                  >
                    {cap.text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Workstation Timeline Scrubber */}
        <div className="absolute bottom-4 left-6 right-6 z-40 bg-[#1A1A1A] p-3 rounded-2xl border border-gray-800 flex items-center gap-4 shadow-xl">
          <span className="text-[10px] font-mono text-gray-400 font-bold hidden sm:block">SCRUB TIMELINE:</span>
          
          <div
            onClick={handleTimelineClick}
            className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden relative border border-gray-700 cursor-pointer group"
          >
            <motion.div
              style={{ width: `${(currentFrame / 900) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#FFE600] to-[#B5F500] relative"
            />
          </div>

          <span className="text-[10px] font-mono text-[#B5F500] font-black">
            {Math.round((currentFrame / 900) * 100)}% COMPLETE
          </span>
        </div>
      </div>
    </section>
  );
}
