"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How fast is the complete reel generation & render pipeline?",
    answer:
      "From entering your topic prompt to final 1080×1920 MP4 video render takes under 60 seconds. Our distributed cloud architecture parallelizes narrative story scripting, studio voiceover synthesis, 2.5D background cutout extraction, and high-speed cloud video rendering concurrently.",
    tag: "SPEED & INFRASTRUCTURE",
  },
  {
    question: "Can I customize scripts, voiceovers, and storyboard visuals before rendering?",
    answer:
      "Yes! You have 100% full creative control in the Fast-Lane Workstation and Director Control Suite. You can edit script narrations line-by-line, test 4 different cinema voice profiles, adjust music ducking levels, replace B-roll footage, and switch between 7 visual art direction themes.",
    tag: "CREATIVE CONTROL",
  },
  {
    question: "Are generated videos, music tracks, and cutouts copyright-safe for monetization?",
    answer:
      "Every video generated is 100% royalty-free and cleared for commercial monetization across YouTube, Instagram, TikTok, and Facebook. Our pipeline fetches verified commercial stock assets and pairs them with original synthesized voiceovers.",
    tag: "COMMERCIAL LICENSING",
  },
  {
    question: "How does 1-Click Multi-Channel Social Publishing work?",
    answer:
      "Once your reel finishes rendering, click 'Publish to Social' to directly dispatch the 1080×1920 MP4 to your connected YouTube Shorts and Instagram Reels accounts. The system automatically writes viral title hooks, description copies, hashtags, and engagement starter comments.",
    tag: "DISTRIBUTION",
  },
  {
    question: "What video specs and export formats are supported?",
    answer:
      "All reels are rendered in high-bitrate 1080×1920 vertical format (9:16 aspect ratio) at smooth 30 FPS, perfectly optimized for mobile social feeds and algorithmic discovery. You can download the pristine MP4 directly or copy the permanent high-speed CDN URL.",
    tag: "VIDEO SPECS",
  },
];

export default function CreatorFaqAccordion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Scroll Parallax Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  const yStickerLeft = useTransform(smoothProgress, [0, 1], [-60, 70]);
  const yStickerRight = useTransform(smoothProgress, [0, 1], [70, -80]);
  const rotateLeft = useTransform(smoothProgress, [0, 1], [-10, 10]);
  const rotateRight = useTransform(smoothProgress, [0, 1], [8, -12]);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      ref={containerRef}
      className="py-28 bg-[#F4F4F6] text-[#111111] border-b-4 border-[#111111] select-none relative overflow-hidden"
    >
      {/* Floating Parallax Badges */}
      <motion.div
        style={{ y: yStickerLeft, rotate: rotateLeft }}
        className="absolute top-20 left-8 z-10 hidden xl:flex items-center gap-2 bg-[#FFE600] text-[#111111] border-3 border-[#111111] px-4 py-2 rounded-2xl shadow-[6px_6px_0px_#111111] pointer-events-none font-bebas text-lg"
      >
        <ShieldCheck className="w-5 h-5 text-[#111111]" />
        <span>100% ROYALTY-FREE ASSETS</span>
      </motion.div>

      <motion.div
        style={{ y: yStickerRight, rotate: rotateRight }}
        className="absolute bottom-28 right-8 z-10 hidden xl:flex items-center gap-2 bg-[#111111] text-[#B5F500] border-3 border-[#111111] px-4 py-2 rounded-2xl shadow-[6px_6px_0px_#B5F500] pointer-events-none font-mono text-xs font-bold"
      >
        <Zap className="w-4 h-4 text-[#B5F500]" />
        <span>PARALLEL CLOUD COMPILER</span>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block bg-[#111111] text-[#B5F500] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md shadow-xs">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-[#111111] uppercase leading-tight mb-4">
            Everything You Need To Know <br />
            <span className="bg-[#FFE600] px-3.5 py-0.5 inline-block transform -rotate-1 border-3 border-[#111111] rounded-lg">
              About The 2.5D Engine
            </span>
          </h2>
          <p className="text-base text-[#555555] font-medium leading-relaxed">
            Got questions about rendering speeds, commercial rights, or social multi-publishing? We have answers.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                className="bg-white border-3 border-[#111111] rounded-2xl shadow-vox overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9F5] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#111111] flex items-center justify-center font-bebas text-lg font-black shrink-0 shadow-xs">
                      0{idx + 1}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#777777] uppercase tracking-wider block mb-0.5">
                        {faq.tag}
                      </span>
                      <h3 className="font-bebas text-xl sm:text-2xl text-[#111111] leading-tight">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl border-2 border-[#111111] flex items-center justify-center transition-transform shrink-0 ${
                      isOpen ? "bg-[#B5F500] rotate-180" : "bg-[#F4F4F6]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-[#111111]" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-[#E2E2E8] bg-[#FAF9F5] text-sm text-[#444444] font-medium leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
