"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Clock, Eye, Sparkles, CheckCircle2 } from "lucide-react";

export default function MetricTickerBar() {
  const METRICS = [
    {
      icon: TrendingUp,
      label: "AUDIENCE RETENTION",
      value: "+340%",
      sub: "vs. Standard Stock Slideshows",
      color: "text-[#B5F500]",
    },
    {
      icon: Clock,
      label: "GPU RENDER LATENCY",
      value: "<60 SECONDS",
      sub: "1080×1920 @ 30 FPS Cloud Pipeline",
      color: "text-[#FFE600]",
    },
    {
      icon: Zap,
      label: "SUB-SECOND SYNC",
      value: "100% TIMED",
      sub: "Sub-Second Word Kinetic Timing",
      color: "text-[#B5F500]",
    },
    {
      icon: Sparkles,
      label: "AI STORY ENGINE",
      value: "6 SCENE HOOKS",
      sub: "Psychological Story Hook Architecture",
      color: "text-[#FFE600]",
    },
    {
      icon: Eye,
      label: "VISION QA GATE",
      value: "99.4% ACCURACY",
      sub: "Automated Irrelevant Footage Filter",
      color: "text-[#B5F500]",
    },
    {
      icon: CheckCircle2,
      label: "MULTI-CHANNEL",
      value: "1-CLICK DISPATCH",
      sub: "Instant Instagram & YouTube Upload",
      color: "text-[#FFE600]",
    },
  ];

  return (
    <div className="border-y-3 border-[#111111] bg-[#111111] text-white py-6 overflow-hidden relative select-none">
      {/* Subtle Background Glow Line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B5F500]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {METRICS.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#1A1A1E] border-2 border-neutral-800 hover:border-[#B5F500]/60 p-3.5 rounded-2xl flex flex-col justify-between transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest truncate">
                    {m.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${m.color} group-hover:scale-110 transition-transform`} />
                </div>
                
                <div className={`font-bebas text-2xl sm:text-3xl leading-none ${m.color} tracking-wide`}>
                  {m.value}
                </div>

                <p className="text-[10px] text-neutral-400 font-mono mt-1 line-clamp-1">
                  {m.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
