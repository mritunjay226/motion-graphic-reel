"use client";

import React from "react";
import Link from "next/link";
import { Zap, Film, Sparkles, Folder, ArrowRight, ShieldCheck } from "lucide-react";

export default function EditorialFooter() {
  return (
    <footer className="bg-[#0C0C0E] text-white border-t-4 border-[#111111] select-none py-16 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Footer Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-800 pb-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bebas text-3xl sm:text-4xl text-[#B5F500] tracking-wider">
                VOX REEL ENGINE 2.5D
              </span>
              <span className="text-[10px] font-mono text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/40 px-2 py-0.5 rounded font-black">
                v2.5 PRO
              </span>
            </div>
            <p className="text-sm text-neutral-400 font-medium max-w-md">
              The autonomous AI motion graphics director turning topics, stories, and articles into broadcast-grade 9:16 documentary reels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create-video"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bebas text-xl uppercase tracking-wider bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] border-2 border-white shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>LAUNCH STUDIO NOW</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bebas text-xl uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-all cursor-pointer"
            >
              <Folder className="w-4 h-4" />
              <span>MY ARCHIVE</span>
            </Link>
          </div>
        </div>

        {/* Tech Stack Matrix & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-xs font-mono">
          
          {/* Col 1: System Health */}
          <div className="space-y-2">
            <span className="text-neutral-500 font-bold uppercase tracking-wider block">
              PIPELINE INFRASTRUCTURE
            </span>
            <div className="flex items-center gap-2 text-[#B5F500] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B5F500] animate-pulse" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              High-Speed Video Compiler • 2.5D Layer Rig • Studio Narration • Kinetic Sync
            </p>
          </div>

          {/* Col 2: Studio Navigation */}
          <div className="space-y-2">
            <span className="text-neutral-500 font-bold uppercase tracking-wider block">
              STUDIO SUITE
            </span>
            <ul className="space-y-1.5 text-neutral-300">
              <li><Link href="/create-video" className="hover:text-[#B5F500] transition-colors">Fast-Lane Workstation</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#B5F500] transition-colors">Reels Video Archive</Link></li>
              <li><Link href="/reel" className="hover:text-[#B5F500] transition-colors">Director Control Gallery</Link></li>
            </ul>
          </div>

          {/* Col 3: Supported Templates */}
          <div className="space-y-2">
            <span className="text-neutral-500 font-bold uppercase tracking-wider block">
              2.5D MOTION TEMPLATES
            </span>
            <ul className="space-y-1.5 text-neutral-300">
              <li>Center Hero Cutout (01)</li>
              <li>Split Memo Typewriter (02)</li>
              <li>Archival Newspaper (03)</li>
              <li>Kinetic Stat Trend (04)</li>
            </ul>
          </div>

          {/* Col 4: Commercial Cleared */}
          <div className="space-y-2">
            <span className="text-neutral-500 font-bold uppercase tracking-wider block">
              MONETIZATION
            </span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Commercial Cleared</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              Verified stock B-roll & synthesized original audio. Cleared for YouTube & IG Partner monetization.
            </p>
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <p>© 2026 Vox Reel Engine. Autonomous 2.5D Motion Graphic Video Platform.</p>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">1080×1920 @ 30 FPS BROADCAST SPEC</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
