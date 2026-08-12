"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TEMPLATES = [
  { id: 1, name: "Center Hero Cutout", category: "Opener", code: "Template1CenterHero", tag: "STORY OPENER", desc: "Classic Vox center subject die-cut with leader line animation.", color: "bg-[#FFE600]" },
  { id: 2, name: "Split Memo Typewriter", category: "Reports", code: "Template2SplitMemo", tag: "EVIDENCE & REPORT", desc: "Dual memo typewriter split with highlighted case evidence.", color: "bg-[#B5F500]" },
  { id: 3, name: "Newspaper Clipping", category: "Reports", code: "Template3NewspaperCutout", tag: "HISTORICAL CONTEXT", desc: "Archival newsprint texture with red rubber stamp impact.", color: "bg-white" },
  { id: 4, name: "Revenue Stat Trend", category: "Financial", code: "Template4StatTrend", tag: "METRIC GROWTH", desc: "High-contrast percentage stats with kinetic trend arrows.", color: "bg-[#FFE600]" },
  { id: 5, name: "Punchline Quote Spotlight", category: "Opener", code: "Template5QuoteSpotlight", tag: "VICTORY STAMP", desc: "Massive editorial serif quote with yellow highlighter backdrop.", color: "bg-[#111111]" },
  { id: 6, name: "Infographic Bar Chart", category: "Financial", code: "Template6BarChart", tag: "FINANCIAL SCALE", desc: "3D perspective bar chart grow animation with orbit ring.", color: "bg-[#B5F500]" },
  { id: 7, name: "Dual Versus Comparison", category: "Reports", code: "Template7DualVersus", tag: "COMPETITOR BATTLE", desc: "Side-by-side competitor battle comparison with vs badge.", color: "bg-[#FFE600]" },
  { id: 8, name: "Bullet List Left", category: "Reports", code: "Template8BulletList", tag: "KEY TAKEAWAYS", desc: "Staggered numbered takeaways with tactile checkmark pills.", color: "bg-white" },
  { id: 9, name: "Timeline Milestone Road", category: "Financial", code: "Template9TimelineRoad", tag: "ROADMAP CHRONOLOGY", desc: "Chronological milestone roadmap with animated progress dot.", color: "bg-[#B5F500]" },
  { id: 10, name: "Magnifier Document", category: "Reports", code: "Template10MagnifierDoc", tag: "INSPECTOR ZOOM", desc: "Simulated magnifying glass lens zoom over confidential file.", color: "bg-[#FFE600]" },
  { id: 11, name: "Circular Orbit Nodes", category: "Financial", code: "Template11OrbitInfographic", tag: "VOX ORBIT RING", desc: "Rotating telemetry orbit ring connecting 4 key data nodes.", color: "bg-[#B5F500]" },
  { id: 12, name: "Breaking News Ticker", category: "Opener", code: "Template12BreakingTicker", tag: "CRITICAL ALERT", desc: "High-voltage breaking news yellow/black marquee ticker.", color: "bg-red-500" },
];

export default function HorizontalTemplatesScroll() {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null);

  useGSAP(() => {
    if (!containerRef.current || !targetRef.current) return;

    const totalWidth = targetRef.current.scrollWidth - window.innerWidth + 120;

    gsap.to(targetRef.current, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${totalWidth}`,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: containerRef });

  const filteredTemplates = activeCategory === "ALL"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <section ref={containerRef} className="relative h-screen bg-[#0C0C0E] text-white overflow-hidden flex flex-col justify-between py-8 select-none">
      {/* Header & Category Bar */}
      <div className="px-8 flex flex-wrap items-center justify-between gap-4 z-10">
        <div>
          <div className="inline-block bg-[#B5F500] text-[#111111] font-bebas text-xs px-3 py-1 font-extrabold uppercase tracking-widest mb-1.5 rounded-md shadow-xs">
            GSAP PINNED SCROLL Showcase
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase leading-none">
            12 Vox Motion Templates <br />
            <span className="text-[#FFE600]">Ready For Remotion Render</span>
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {["ALL", "Opener", "Financial", "Reports"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#B5F500] text-[#111111] border-2 border-[#B5F500] shadow-sm"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-600"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontally Moving Cards Track */}
      <div ref={targetRef} className="flex gap-6 px-8 items-center py-6 w-max">
        {filteredTemplates.map((t) => (
          <motion.div
            key={t.id}
            onClick={() => setSelectedTemplate(t)}
            whileHover={{ y: -12, scale: 1.02 }}
            className="w-80 h-[410px] bg-white text-[#111111] rounded-3xl p-6 border-4 border-[#111111] shadow-[10px_10px_0px_#B5F500] flex flex-col justify-between cursor-pointer flex-shrink-0 group transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs font-black text-[#111111] bg-[#FFE600] px-2.5 py-0.5 rounded-md border border-[#111111]">
                TEMPLATE #{t.id.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase">
                9:16 VERTICAL
              </span>
            </div>

            <div className="my-auto text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#111111] text-[#B5F500] group-hover:bg-[#B5F500] group-hover:text-[#111111] transition-all flex items-center justify-center font-bebas text-3xl font-bold mb-3 shadow-md border-2 border-[#111111]">
                0{t.id}
              </div>
              <h3 className="font-bebas text-3xl leading-tight text-[#111111] mb-1">
                {t.name}
              </h3>
              <p className="font-mono text-[11px] text-gray-500 font-semibold mb-2">
                {t.code}.tsx
              </p>
              <p className="text-xs text-[#555555] font-medium leading-snug line-clamp-2">
                {t.desc}
              </p>
            </div>

            <div className="border-t-2 border-[#111111] pt-3 flex justify-between items-center text-[11px] font-bold">
              <span className="text-[#111111] font-mono">1080x1920 @ 30FPS</span>
              <span className="text-red-600 uppercase font-mono group-hover:translate-x-1 transition-transform">
                INSPECT →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Track Indicator */}
      <div className="px-8 font-mono text-xs text-gray-400 flex items-center justify-between z-10 border-t border-gray-800 pt-4">
        <span>VOX 2.5D LAYOUT MATRIX ENGINE</span>
        <span className="text-[#B5F500] font-bold">DRAG OR SCROLL HORIZONTALLY TO EXPLORE →</span>
      </div>

      {/* Modal Preview Popover */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-[#111111] rounded-3xl border-4 border-[#111111] shadow-[16px_16px_0px_#B5F500] p-6 max-w-md w-full relative"
            >
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>

              <div className="inline-block bg-[#FFE600] text-[#111111] font-bebas text-xs px-2.5 py-0.5 font-bold uppercase mb-2 border border-[#111111]">
                TEMPLATE SPECIFICATION
              </div>

              <h3 className="font-bebas text-4xl text-[#111111] leading-none mb-1">
                {selectedTemplate.name}
              </h3>
              <p className="font-mono text-xs text-gray-500 mb-4 font-bold">
                {selectedTemplate.code}.tsx
              </p>

              <div className="w-full h-56 bg-[#111111] rounded-2xl border-2 border-[#111111] overflow-hidden mb-4 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#B5F500] text-[#111111] flex items-center justify-center font-bebas text-2xl mx-auto mb-2 font-bold shadow-md">
                    0{selectedTemplate.id}
                  </div>
                  <span className="text-white font-mono text-xs font-bold block">
                    REMOTION 2.5D COMPONENT PREVIEW
                  </span>
                  <span className="text-[#B5F500] font-mono text-[10px]">
                    1080x1920 Vert • 30 FPS • ImageKit Layered
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#444444] font-semibold leading-relaxed mb-6">
                {selectedTemplate.desc}
              </p>

              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="w-full py-3 bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] font-bebas text-2xl uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] cursor-pointer"
              >
                CLOSE INSPECTION
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
