"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Layers, Sparkles } from "lucide-react";

export default function ParallaxCutoutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeLayerInspect, setActiveLayerInspect] = useState<number | null>(null);
  const [isExplodedMode, setIsExplodedMode] = useState(false);
  const [scrollDepthPercent, setScrollDepthPercent] = useState(0);

  // Mouse tilt physics state for 3D stage
  const [tiltOffset, setTiltOffset] = useState({ rotateX: 0, rotateY: 0 });

  // Bind layer separation directly to scroll position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollDepthPercent(Math.round(latest * 100));
  });

  // Scroll Transforms for 2.5D Layer Displacement
  const bgZ = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const bgRotateY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const bgX = useTransform(scrollYProgress, [0, 1], [0, -160]);

  const cutoutZ = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const cutoutScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const cutoutRotateY = useTransform(scrollYProgress, [0, 1], [0, 14]);

  const calloutZ = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const calloutX = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const calloutRotateY = useTransform(scrollYProgress, [0, 1], [0, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltOffset({
      rotateX: (-y / rect.height) * 16,
      rotateY: (x / rect.width) * 16,
    });
  };

  const handleMouseLeave = () => {
    setTiltOffset({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section ref={sectionRef} className="py-24 bg-[#F4F4F6] text-[#111111] border-b-4 border-[#111111] overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block bg-[#111111] text-[#B5F500] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md shadow-xs border border-[#111111]">
            2.5D LAYER SEPARATION ENGINE
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-[#111111] uppercase leading-tight mb-4">
            Scroll & Hover To Explode <br />
            <span className="bg-[#FFE600] px-3.5 py-0.5 inline-block transform -rotate-1 text-[#111111] border-3 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-lg">
              2.5D Motion Graphic Depth
            </span>
          </h2>
          <p className="text-base text-[#555555] font-medium leading-relaxed">
            Move your cursor or scroll down to separate background photos, subject cutouts, and callout badges into true 3D spatial layers!
          </p>
        </div>

        {/* 3D Scroll Depth Workstation Container */}
        <div className="bg-white border-4 border-[#111111] rounded-3xl p-6 sm:p-8 shadow-[14px_14px_0px_#111111] max-w-4xl mx-auto">
          
          {/* Controls Bar & Interactive Explosive Mode Button */}
          <div className="mb-6 bg-[#F4F4F6] p-4 rounded-2xl border-2 border-[#111111] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bebas text-xl text-[#111111]">SCROLL DISPLACEMENT:</span>
              <span className="text-xs font-black bg-[#111111] text-[#B5F500] px-3 py-1 rounded shadow-xs">
                {scrollDepthPercent}% DISPLACED
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Explosive Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsExplodedMode(!isExplodedMode)}
                className={`px-3 py-1 rounded-lg font-bold border-2 transition-all cursor-pointer text-xs flex items-center gap-1.5 ${
                  isExplodedMode
                    ? "bg-[#E50914] text-white border-[#111111] shadow-xs animate-pulse"
                    : "bg-[#111111] text-[#B5F500] border-[#111111] hover:bg-[#222222]"
                }`}
              >
                {isExplodedMode ? (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    <span>EXPLODED 3D VIEW ON</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TOGGLE 3D EXPLODE</span>
                  </>
                )}
              </button>

              {/* Layer Spotlight Isolator Buttons */}
              {[
                { id: 1, label: "L1: PHOTO" },
                { id: 2, label: "L2: CUTOUT" },
                { id: 3, label: "L3: CALLOUT" },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveLayerInspect(activeLayerInspect === l.id ? null : l.id)}
                  className={`px-2.5 py-1 rounded-lg border-2 transition-all cursor-pointer text-[10px] font-bold ${
                    activeLayerInspect === l.id
                      ? "bg-[#FFE600] text-[#111111] border-[#111111] shadow-xs"
                      : "bg-white text-[#444444] border-[#E2E2E8] hover:border-[#111111]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Visual Layer Canvas Container (Mouse Tilt + Scroll Transform) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-[460px] w-full flex items-center justify-center overflow-hidden bg-[#FAFAFA] rounded-2xl border-3 border-[#111111] [perspective:1000px] shadow-inner cursor-crosshair"
          >
            {/* Interactive Motion Container responding to Mouse Tilt */}
            <motion.div
              animate={{
                rotateX: tiltOffset.rotateX,
                rotateY: tiltOffset.rotateY,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
            >
              
              {/* Layer 1: Background Scene Card */}
              <motion.div
                style={{
                  z: activeLayerInspect === 1 ? 90 : isExplodedMode ? -300 : bgZ,
                  rotateY: bgRotateY,
                  x: isExplodedMode ? -240 : bgX,
                }}
                className={`absolute w-72 h-80 bg-[#111111] text-white p-4 rounded-2xl border-3 border-[#111111] shadow-xl flex flex-col justify-between overflow-hidden transition-all ${
                  activeLayerInspect === 1 ? "ring-4 ring-[#B5F500] z-30" : ""
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-[#B5F500] font-bold z-10 bg-[#111111]/85 px-2 py-0.5 rounded">
                  <span>LAYER #1</span>
                  <span>HISTORICAL ARCHIVE</span>
                </div>
                
                <div className="absolute inset-0 z-0">
                  <img src="/vox_documentary_bg.png" alt="Archival Background" className="w-full h-full object-cover opacity-80" />
                </div>

                <div className="text-[10px] font-mono text-gray-200 border-t border-gray-800 pt-2 font-semibold z-10 bg-[#111111]/90 px-2 py-1 rounded">
                  Resolution: 1080×1920 • 4K Source
                </div>
              </motion.div>

              {/* Layer 2: Die-Cut Subject Cutout with Organic Wiggle */}
              <motion.div
                style={{
                  z: activeLayerInspect === 2 ? 120 : isExplodedMode ? 100 : cutoutZ,
                  scale: cutoutScale,
                  rotateY: cutoutRotateY,
                }}
                className={`absolute z-10 w-64 h-76 bg-white text-[#111111] p-3.5 rounded-2xl border-4 border-[#111111] shadow-[10px_10px_0px_#FFE600] flex flex-col items-center justify-between text-center rotate-[-3deg] overflow-hidden transition-all animate-character-boil ${
                  activeLayerInspect === 2 ? "ring-4 ring-[#FFE600] z-30" : ""
                }`}
              >
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  LAYER #2 • DIE-CUT SUBJECT
                </span>
                
                <div className="w-full h-44 rounded-xl overflow-hidden border-2 border-[#111111] bg-[#111111] my-1">
                  <img src="/vox_subject_cutout.png" alt="Paper Cutout Subject" className="w-full h-full object-cover" />
                </div>

                <span className="font-bebas text-xl text-[#111111] leading-none">
                  2.5D CHARACTER CUTOUT
                </span>
              </motion.div>

              {/* Layer 3: Leader Callout Badge */}
              <motion.div
                style={{
                  z: activeLayerInspect === 3 ? 150 : isExplodedMode ? 350 : calloutZ,
                  x: isExplodedMode ? 240 : calloutX,
                  rotateY: calloutRotateY,
                }}
                className={`absolute z-20 w-60 bg-[#FFE600] text-[#111111] p-4 rounded-xl border-3 border-[#111111] shadow-[8px_8px_0px_#111111] rotate-[6deg] transition-all ${
                  activeLayerInspect === 3 ? "ring-4 ring-red-600 z-30" : ""
                }`}
              >
                <div className="text-[9px] font-mono font-black uppercase tracking-widest text-[#111111]">
                  LAYER #3 • LEADER CALLOUT
                </div>
                <div className="font-bebas text-2xl text-[#111111] leading-none mt-1">
                  CONFIDENTIAL METRIC
                </div>
                <div className="mt-2 text-[10px] font-bold bg-[#111111] text-[#B5F500] px-2.5 py-0.5 inline-block rounded-md shadow-xs">
                  REMOTE SCROLL DEPTH SYNCHRONIZED
                </div>
              </motion.div>

            </motion.div>
          </div>

          <div className="mt-6 text-center text-xs font-mono text-[#555555] font-bold flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B5F500] animate-ping" />
            <span>Move your mouse over the canvas to feel true 3D spatial perspective!</span>
          </div>

        </div>

      </div>
    </section>
  );
}
