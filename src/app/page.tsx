"use client";

import React from "react";
import VoxInteractiveCursor from "@/components/landing/VoxInteractiveCursor";
import VoxHeroSection from "@/components/landing/VoxHeroSection";
import MetricTickerBar from "@/components/landing/MetricTickerBar";
import ScrollMotionReelSim from "@/components/landing/ScrollMotionReelSim";
import ComparisonSection from "@/components/landing/ComparisonSection";
import LiveSampleReelsGallery from "@/components/landing/LiveSampleReelsGallery";
import ParallaxCutoutSection from "@/components/landing/ParallaxCutoutSection";
import SceneAnatomyStudio from "@/components/landing/SceneAnatomyStudio";
import ThemeAudioStudioPreview from "@/components/landing/ThemeAudioStudioPreview";
import SocialPublishShowcase from "@/components/landing/SocialPublishShowcase";
import CreatorFaqAccordion from "@/components/landing/CreatorFaqAccordion";
import VoxCtaSection from "@/components/landing/VoxCtaSection";
import EditorialFooter from "@/components/landing/EditorialFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F4F6] text-[#111111] font-sans selection:bg-[#FFE600] selection:text-black relative">
      {/* 1. Broadcast Studio Viewfinder Cursor Tracker */}
      <VoxInteractiveCursor />

      {/* 2. Kinetic Vox Hero Section with Elevated Prompt Bar & Voice Audition */}
      <VoxHeroSection />

      {/* 3. Real-Time Broadcast Telemetry Metric Ticker */}
      <MetricTickerBar />

      {/* 4. Live Pinned Scroll Motion Reel Video Simulation */}
      <ScrollMotionReelSim />

      {/* 5. 'Standard AI vs. 2.5D Documentary Reel' Interactive Comparison */}
      <ComparisonSection />

      {/* 6. Live 9:16 Sample Reels Gallery with Interactive Video Player */}
      <LiveSampleReelsGallery />

      {/* 7. Interactive 2.5D Layer Depth Separation & 3D Explode Canvas */}
      <ParallaxCutoutSection />

      {/* 8. Inside The 2.5D Motion Rig: Interactive Scene Anatomy & Cost Benchmark */}
      <SceneAnatomyStudio />

      {/* 9. Interactive Visual Themes & Foley Sound Studio Sandbox */}
      <ThemeAudioStudioPreview />

      {/* 10. 1-Click Multi-Channel Social Distribution Spotlight */}
      <SocialPublishShowcase />

      {/* 11. Tactile Paper Spring FAQ Accordion */}
      <CreatorFaqAccordion />

      {/* 12. 4-Stage Automated Pipeline Architecture & Launch CTA */}
      <VoxCtaSection />

      {/* 13. Rich Broadcast Studio Editorial Footer */}
      <EditorialFooter />
    </main>
  );
}
