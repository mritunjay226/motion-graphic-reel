"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PIPELINE_STEPS = [
  { step: "01", title: "Script & Storyboard", tech: "Gemini 2.5 Pro", desc: "Generates 6 scene hooks, 2.5D layer instructions & timed captions.", icon: "✍️" },
  { step: "02", title: "Voiceover Synthesis", tech: "Cartesia TTS API", desc: "High-emotion natural audio narration with word timestamps.", icon: "🎙️" },
  { step: "03", title: "2.5D Cutout Processing", tech: "ImageKit CDN Engine", desc: "Removes photo background & extracts subject paper stickers.", icon: "✂️" },
  { step: "04", title: "Remotion Cloud Render", tech: "Remotion Lambda", desc: "Compiles 1080x1920 MP4 video reel at 30 FPS under 60 seconds.", icon: "⚡" },
];

export default function VoxCtaSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#F4F4F6] text-[#111111] border-b-4 border-[#111111] select-none">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Pipeline Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#FFE600] text-[#111111] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md border-2 border-[#111111] shadow-xs">
            AUTOMATED REEL PIPELINE ARCHITECTURE
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-[#111111] uppercase leading-tight mb-4">
            From Topic To Render <br />
            <span className="bg-[#111111] text-[#B5F500] px-3.5 py-0.5 inline-block transform rotate-1 border-3 border-[#111111] rounded-lg">
              In Under 60 Seconds
            </span>
          </h2>
          <p className="text-base text-[#555555] font-medium leading-relaxed">
            Hover over each pipeline stage to inspect how AI storyboards, Cartesia voiceovers, ImageKit cutouts, and Remotion video layers compile into finished reels.
          </p>
        </div>

        {/* Pipeline Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PIPELINE_STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              onHoverStart={() => setHoveredStep(idx)}
              onHoverEnd={() => setHoveredStep(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white border-4 border-[#111111] rounded-2xl p-6 shadow-[8px_8px_0px_#111111] flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all ${
                hoveredStep === idx ? "bg-[#FFFEEB] border-[#111111]" : ""
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bebas text-3xl text-[#111111] font-black">
                    {s.step}
                  </span>
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <h3 className="font-bebas text-2xl text-[#111111] leading-tight mb-1">
                  {s.title}
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase text-[#111111] bg-[#B5F500] px-2.5 py-0.5 rounded-md border border-[#111111] inline-block mb-3">
                  {s.tech}
                </span>
                <p className="text-xs text-[#555555] font-semibold leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-[#E2E2E8] flex justify-between items-center text-[10px] font-mono text-[#777777]">
                <span>AUTOMATED</span>
                <span className="text-[#111111] font-extrabold text-[11px]">STAGE READY ✓</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final High-Impact CTA Banner */}
        <div className="bg-[#111111] text-white rounded-3xl p-10 sm:p-16 text-center border-4 border-[#111111] shadow-[16px_16px_0px_#B5F500] relative overflow-hidden glow-vox-lime">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#B5F500_1px,transparent_1px)] [background-size:20px_20px]" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <div className="inline-block bg-[#B5F500] text-[#111111] font-bebas text-sm px-4 py-1 font-bold uppercase tracking-widest mb-4 rounded-md shadow-xs">
              READY TO GENERATE YOUR FIRST REEL?
            </div>
            
            <h2 className="font-bebas text-5xl sm:text-7xl text-white uppercase leading-none mb-6">
              Start Building <br />
              <span className="text-[#FFE600]">Broadcast Motion Graphics</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed font-medium">
              Join creators using Vox 2.5D templates to produce high-retention social media reels in seconds.
            </p>

            <Link
              href="/create-video"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl font-bebas text-2xl tracking-wider uppercase bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] border-3 border-white shadow-[6px_6px_0px_#FFE600] transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <span>🚀 LAUNCH VOX STUDIO ENGINE →</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
