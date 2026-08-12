"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import FilmTreatment from "./FilmTreatment";

const SAMPLE_PROMPTS = [
  "Why OpenAI Fired Sam Altman in 2023",
  "How Nvidia Became a $3 Trillion Empire",
  "The Secret Engineering Behind Concorde",
  "How Red Bull Built an Extreme Sports Empire",
  "Why McDonald's Ice Cream Machines Always Break",
];

const VOX_VOICES = [
  { id: "62ae83ad-4f6a-430b-af41-a9bede9286ca", name: "Cartesia AI", sample: "Cartesia Sonic Neural Voice", tag: "RECOMMENDED" },
  { id: "ronald", name: "Ronald", sample: "Deep authoritative documentary voice", tag: "US MALE" },
  { id: "clive", name: "Clive", sample: "Measured expert UK narrative", tag: "UK MALE" },
  { id: "skylar", name: "Skylar", sample: "Friendly engaging explainer voice", tag: "US FEMALE" },
];

export default function VoxHeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const [topicInput, setTopicInput] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("62ae83ad-4f6a-430b-af41-a9bede9286ca");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingAudioSample, setIsPlayingAudioSample] = useState(false);
  const [activeVoiceName, setActiveVoiceName] = useState("Cartesia AI");

  // Mouse Parallax Physics State
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Scroll Progress Hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero transforms on scroll
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroRotateX = useTransform(scrollYProgress, [0, 1], [0, 12]);

  // 2.5D Cutouts separation on scroll
  const leftCutoutX = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const rightCutoutX = useTransform(scrollYProgress, [0, 1], [0, 220]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMouseOffset({
      x: (clientX / innerWidth - 0.5) * 35,
      y: (clientY / innerHeight - 0.5) * 35,
    });
  };

  // Typewriter Auto-Fill Effect
  const handlePromptTypewriter = (text: string) => {
    setTopicInput("");
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < text.length) {
        setTopicInput(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 20);
  };

  const handleVoicePreview = (voiceId: string, name: string) => {
    setSelectedVoice(voiceId);
    setActiveVoiceName(name);
    setIsPlayingAudioSample(true);
    setTimeout(() => setIsPlayingAudioSample(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setIsSubmitting(true);
    router.push(
      `/create-video?topic=${encodeURIComponent(topicInput.trim())}&voice=${selectedVoice}`
    );
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[98vh] bg-[#F4F4F6] text-[#111111] flex flex-col justify-between overflow-hidden border-b-4 border-[#111111] select-none"
    >
      {/* Reusable Film Treatment Overlay */}
      <FilmTreatment grainOpacity={0.14} scanlines={true} vignette={true} />

      {/* SVG Background Fiber Grid */}
      <div className="absolute inset-0 pointer-events-none vox-paper-texture opacity-90 z-0" />
      <div className="absolute inset-0 pointer-events-none vox-halftone opacity-35 z-0" />

      {/* Broadcast Studio Viewfinder HUD View */}
      <div className="absolute top-20 left-6 pointer-events-none z-20 opacity-70 hidden sm:block">
        <svg className="w-16 h-16 stroke-[#111111]" fill="none" viewBox="0 0 48 48">
          <path d="M 4 20 L 4 4 L 20 4" strokeWidth="3.5" strokeLinecap="square" />
        </svg>
        <div className="text-[9px] font-mono text-[#111111] font-black tracking-widest mt-1">
          REC [30FPS]
        </div>
      </div>
      <div className="absolute top-20 right-6 pointer-events-none z-20 opacity-70 hidden sm:block text-right">
        <svg className="w-16 h-16 stroke-[#111111] ml-auto" fill="none" viewBox="0 0 48 48">
          <path d="M 28 4 L 44 4 L 44 20" strokeWidth="3.5" strokeLinecap="square" />
        </svg>
        <div className="text-[9px] font-mono text-[#111111] font-black tracking-widest mt-1">
          1080x1920 9:16
        </div>
      </div>

      {/* Top Editorial Sticky Header */}
      <header className="border-b-2 border-[#111111] bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-10 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.06, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1.5 bg-[#111111] text-[#B5F500] font-bebas text-2xl tracking-widest rounded shadow-[3px_3px_0px_#FFE600] flex items-center gap-2 cursor-pointer border border-[#111111]"
          >
            <span>VOX</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#B5F500] animate-ping" />
          </motion.div>
          <div>
            <h1 className="font-bebas text-2xl tracking-wide text-[#111111] leading-none">
              REEL ENGINE 2.5D
            </h1>
            <p className="text-[10px] text-[#555555] font-mono font-bold uppercase tracking-wider">
              Motion Graphic Broadcast Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/reel"
            className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-white text-[#111111] hover:bg-[#FFE600] transition-all flex items-center gap-1.5 shadow-[3px_3px_0px_#111111] border-2 border-[#111111] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>🎬 Gallery</span>
          </Link>

          <Link
            href="/create-video"
            className="px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#111111] text-white hover:bg-[#222222] transition-all flex items-center gap-2 shadow-[3px_3px_0px_#B5F500] border border-[#111111] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>+ Create Video</span>
          </Link>

          <div className="pl-3 border-l-2 border-[#E2E2E8] flex items-center gap-2">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 rounded-full border-2 border-[#111111]",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#B5F500] text-[#111111] hover:bg-[#a6e200] transition-all shadow-[3px_3px_0px_#111111] border border-[#111111] cursor-pointer"
                >
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Floating 2.5D Paper Cutouts (Parallax Mouse + Continuous Character Boil Wiggle) */}
      <motion.div
        style={{ x: leftCutoutX }}
        animate={{
          y: [0, -12, 0],
          rotate: [-3 + mouseOffset.x * 0.08, 0 + mouseOffset.y * 0.08, -3],
        }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute top-28 left-6 sm:left-10 hidden lg:block z-10 pointer-events-none"
      >
        <div className="bg-[#FFFDF7] border-3 border-[#111111] p-4 shadow-[8px_8px_0px_#111111] rounded-2xl max-w-[210px] animate-character-boil">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#555555] font-extrabold flex justify-between items-center border-b-2 border-[#111111] pb-1.5 mb-2">
            <span>FILE #04 • CASE STUDY</span>
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          </div>
          <div className="font-bebas text-2xl leading-none text-[#111111]">
            "$50M NETFLIX PITCH"
          </div>
          <div className="mt-2 text-[9px] font-black uppercase bg-[#FFE600] text-[#111111] px-2 py-0.5 inline-block border border-[#111111] shadow-xs">
            VERIFIED HISTORICAL DATA
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ x: rightCutoutX }}
        animate={{
          y: [0, 14, 0],
          rotate: [4 - mouseOffset.x * 0.08, 1 - mouseOffset.y * 0.08, 4],
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-32 right-6 sm:right-10 hidden lg:block z-10 pointer-events-none"
      >
        <div className="bg-[#FFE600] border-3 border-[#111111] p-4 shadow-[8px_8px_0px_#111111] rounded-2xl max-w-[220px] animate-character-boil">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#111111] font-black flex justify-between items-center border-b-2 border-[#111111] pb-1.5 mb-2">
            <span>REALTIME METRICS</span>
            <span className="font-extrabold text-red-600 animate-pulse">● LIVE</span>
          </div>
          <div className="font-bebas text-3xl text-[#111111] leading-none">
            +340% RETENTION
          </div>
          <p className="text-[9px] font-extrabold text-[#222222] mt-1 leading-tight">
            Remotion Dynamic Motion Cutout
          </p>
        </div>
      </motion.div>

      {/* Main Center Hero Section */}
      <motion.div
        style={{
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY,
          rotateX: heroRotateX,
        }}
        className="relative z-20 max-w-5xl mx-auto px-6 py-8 text-center flex-1 flex flex-col items-center justify-center [perspective:1000px]"
      >
        {/* Top Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full text-xs font-black bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] mb-5 transform hover:scale-105 transition-transform"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#111111] animate-pulse" />
          <span className="tracking-widest uppercase font-mono">VOX EDITORIAL ENGINE v2.5D</span>
        </motion.div>

        {/* Hero Title with Instrument Serif & Bebas Neue Font Pairing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="font-serif-editorial italic text-2xl sm:text-4xl text-[#444444] mb-2 font-normal">
            Visual Storytelling Re-Imagined
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#111111] uppercase leading-none">
            Turn Any Topic Into A <br />
            <span className="relative inline-block bg-[#111111] text-[#B5F500] px-6 py-1.5 mt-2 transform -rotate-1 shadow-[10px_10px_0px_#FFE600] border-3 border-[#111111] rounded-lg">
              2.5D Broadcast Reel
            </span>
          </h1>

          {/* Kinetic Underline SVG */}
          <svg className="w-full h-8 mt-3 max-w-xl mx-auto" viewBox="0 0 600 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M 10 15 Q 150 28 300 15 T 590 15"
              stroke="#111111"
              strokeWidth="4.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 15 20 Q 155 32 305 20 T 585 20"
              stroke="#B5F500"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.25, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* ========================================================================= */}
        {/* HIGH-HIERARCHY PROMPT BAR WITH LIVE EQUALIZER & TYPEWRITER PRESETS */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-2xl bg-white border-4 border-[#111111] rounded-3xl p-5 sm:p-6 shadow-[14px_14px_0px_#111111] relative z-30 mb-6 text-left glow-vox-lime"
        >
          {/* Header Bar with Voice Selector & Live Spectrum */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-[#E2E2E8]">
            <div className="flex items-center gap-2.5">
              <span className="font-bebas text-base tracking-wider uppercase text-[#111111]">
                INSTANT REEL PROMPT BAR
              </span>
              {/* Reactive Equalizer Spectrum Bars */}
              <div className="flex items-end gap-1 h-4 bg-[#111111] px-2 py-1 rounded">
                <motion.div animate={{ height: isPlayingAudioSample ? ["20%", "100%", "40%"] : ["40%", "80%", "30%"] }} transition={{ repeat: Infinity, duration: 0.35 }} className="w-1 bg-[#B5F500] rounded-full" />
                <motion.div animate={{ height: isPlayingAudioSample ? ["90%", "20%", "100%"] : ["80%", "30%", "90%"] }} transition={{ repeat: Infinity, duration: 0.25 }} className="w-1 bg-[#FFE600] rounded-full" />
                <motion.div animate={{ height: isPlayingAudioSample ? ["30%", "100%", "50%"] : ["30%", "90%", "40%"] }} transition={{ repeat: Infinity, duration: 0.45 }} className="w-1 bg-[#B5F500] rounded-full" />
              </div>
              {isPlayingAudioSample && (
                <span className="text-[10px] font-mono text-red-600 font-extrabold animate-pulse">
                  PLAYING: {activeVoiceName}
                </span>
              )}
            </div>

            {/* Voice Accent Pills */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold flex-wrap">
              <span className="text-[#666666]">VOICE:</span>
              {VOX_VOICES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVoicePreview(v.id, v.name)}
                  className={`px-2.5 py-1 rounded-md border-2 transition-all cursor-pointer font-bold ${
                    selectedVoice === v.id
                      ? "bg-[#111111] text-[#B5F500] border-[#111111] shadow-xs"
                      : "bg-[#F4F4F6] text-[#333333] border-[#E2E2E8] hover:border-[#111111]"
                  }`}
                  title={v.sample}
                >
                  🎙️ {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="What story or news topic do you want to turn into a reel?"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full bg-[#F9F9FB] border-3 border-[#111111] text-[#111111] placeholder-[#777777] rounded-2xl px-5 py-4 text-base sm:text-lg focus:outline-none focus:bg-white font-bold shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !topicInput.trim()}
              className="px-8 py-4 rounded-2xl font-bebas text-2xl tracking-wider uppercase bg-[#B5F500] hover:bg-[#a6e200] disabled:opacity-50 text-[#111111] border-3 border-[#111111] transition-all shadow-[4px_4px_0px_#111111] flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <span>Generating...</span>
              ) : (
                <span>⚡ GENERATE REEL →</span>
              )}
            </button>
          </form>

          {/* Quick Clickable Typewriter Prompts */}
          <div className="mt-4 pt-3 border-t-2 border-[#E2E2E8] flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <span className="font-bold text-[#111111] font-mono text-[11px] uppercase">
              TYPEWRITER PRESETS:
            </span>
            {SAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptTypewriter(prompt)}
                className="px-3 py-1 bg-[#F4F4F6] hover:bg-[#FFE600] border-2 border-[#111111] rounded-full text-[#111111] transition-all text-[11px] font-bold shadow-xs cursor-pointer transform hover:scale-105"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tech Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-[#444444]">
          <span className="px-3 py-1 bg-white border-2 border-[#111111] rounded-full shadow-xs">
            🎬 Remotion Lambda 30 FPS
          </span>
          <span className="px-3 py-1 bg-white border-2 border-[#111111] rounded-full shadow-xs">
            🎙️ Cartesia AI Audio
          </span>
          <span className="px-3 py-1 bg-white border-2 border-[#111111] rounded-full shadow-xs">
            ✂️ ImageKit 2.5D Cutouts
          </span>
          <span className="px-3 py-1 bg-white border-2 border-[#111111] rounded-full shadow-xs">
            ⚡ Gemini 2.5 Pro Storyboards
          </span>
        </div>

      </motion.div>

      {/* Scroll Down Button */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="relative z-20 pb-6 flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight * 0.92, behavior: "smooth" });
        }}
      >
        <span className="font-bebas text-xs tracking-widest text-[#555555] uppercase font-bold">
          SCROLL DOWN TO WORKSTATION ENGINE
        </span>
        <div className="w-8 h-12 rounded-full border-2 border-[#111111] flex items-center justify-center p-1 bg-white shadow-[3px_3px_0px_#111111]">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2.5 h-3.5 bg-[#111111] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
