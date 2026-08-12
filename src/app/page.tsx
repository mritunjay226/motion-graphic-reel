"use client";

import React from "react";
import VoxHeroSection from "@/components/landing/VoxHeroSection";
import ScrollMotionReelSim from "@/components/landing/ScrollMotionReelSim";
import ParallaxCutoutSection from "@/components/landing/ParallaxCutoutSection";
import HorizontalTemplatesScroll from "@/components/landing/HorizontalTemplatesScroll";
import VoxCtaSection from "@/components/landing/VoxCtaSection";
import VoxInteractiveCursor from "@/components/landing/VoxInteractiveCursor";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F4F6] text-[#111111] font-sans selection:bg-[#FFE600] selection:text-black relative">
      {/* Broadcast Studio Viewfinder Cursor Tracker */}
      <VoxInteractiveCursor />

      {/* 1. Kinetic Vox Hero Section with Elevated Prompt Bar */}
      <VoxHeroSection />

      {/* 2. Live Pinned Scroll Motion Reel Video Simulation */}
      <ScrollMotionReelSim />

      {/* 3. Interactive 2.5D Layer Depth Separation Section */}
      <ParallaxCutoutSection />

      {/* 4. GSAP Pinned Horizontal Template Track Showcase */}
      <HorizontalTemplatesScroll />

      {/* 5. Pipeline Architecture & Launch Studio CTA */}
      <VoxCtaSection />

      {/* Footer */}
      <footer className="border-t-2 border-[#111111] bg-[#111111] text-gray-400 py-8 px-6 text-center text-xs font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bebas text-lg text-[#B5F500]">VOX REEL ENGINE 2.5D</span>
            <span className="text-[10px] text-gray-500">• 1080x1920 @ 30 FPS</span>
          </div>
          <p>© 2026 Vox Reel Engine. Powered by Next.js, Remotion, GSAP & Framer Motion.</p>
        </div>
      </footer>
    </main>
  );
}
