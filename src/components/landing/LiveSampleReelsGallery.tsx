"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, X, Zap, Clock, Volume2, ArrowRight, Eye, Film, Sparkles } from "lucide-react";

interface SampleReel {
  id: string;
  topic: string;
  category: "Business" | "Tech" | "History" | "Finance";
  duration: string;
  thumbnail: string;
  scenesCount: number;
  hook: string;
  audioVoice: string;
  transcriptPreview: string[];
}

const SAMPLE_REELS: SampleReel[] = [
  {
    id: "netflix_blockbuster",
    topic: "Why Netflix Crushed Blockbuster in 2000",
    category: "Business",
    duration: "30s",
    thumbnail: "/vox_subject_cutout.png",
    scenesCount: 6,
    hook: "The $50M Mistake That Changed Entertainment Forever",
    audioVoice: "Cinema Voice • US Documentary",
    transcriptPreview: [
      "In 2000, Blockbuster laughed at a $50M buyout offer.",
      "By eliminating late fees, Netflix completely disrupted video retail.",
      "Today, Netflix is worth over $45 Billion.",
    ],
  },
  {
    id: "nvidia_ai_empire",
    topic: "How Nvidia Built a $3 Trillion Monopoly",
    category: "Tech",
    duration: "30s",
    thumbnail: "/vox_documentary_bg.png",
    scenesCount: 6,
    hook: "From Video Game GPUs to the Brain of Artificial Intelligence",
    audioVoice: "Studio Narration • Authoritative Male",
    transcriptPreview: [
      "Jensen Huang bet the entire company on CUDA parallel processing in 2006.",
      "Wall Street thought it was a waste of billions.",
      "Now, 92% of all AI supercomputers run on Nvidia silicon.",
    ],
  },
  {
    id: "concorde_disaster",
    topic: "The Secret Engineering Flaw of Concorde",
    category: "History",
    duration: "30s",
    thumbnail: "/vox_newspaper_clipping.png",
    scenesCount: 6,
    hook: "Supersonic Luxury to Global Grounding in 120 Seconds",
    audioVoice: "Cinema Voice • UK Documentary",
    transcriptPreview: [
      "Flying at Mach 2 from London to New York in under 3 hours.",
      "A single titanium strip on the runway sparked catastrophic rupture.",
      "The era of commercial supersonic flight ended instantly.",
    ],
  },
  {
    id: "dyson_miracle",
    topic: "How Dyson Engineered a $500 Hairdryer Phenomenon",
    category: "Finance",
    duration: "30s",
    thumbnail: "/vox_subject_cutout.png",
    scenesCount: 6,
    hook: "5,127 Failed Prototypes to 100 Million Cult Fans",
    audioVoice: "Studio Narration • US Female",
    transcriptPreview: [
      "James Dyson spent 15 years in debt perfecting cyclone airflow.",
      "By moving the motor into the handle, he re-engineered balance.",
      "Today it dominates luxury beauty with 60% gross margins.",
    ],
  },
];

export default function LiveSampleReelsGallery() {
  const [selectedSample, setSelectedSample] = useState<SampleReel | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [modalFrameIndex, setModalFrameIndex] = useState(0);

  const filteredSamples = activeTab === "ALL"
    ? SAMPLE_REELS
    : SAMPLE_REELS.filter((s) => s.category === activeTab);

  return (
    <section className="py-24 bg-[#111111] text-white border-b-4 border-[#111111] select-none relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(181,245,0,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-neutral-800 pb-8">
          <div>
            <div className="inline-block bg-[#B5F500] text-[#111111] font-bebas text-xs px-3.5 py-1 font-bold uppercase tracking-widest mb-3 rounded-md shadow-xs">
              REAL-WORLD PRODUCTIONS
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase leading-none">
              Generated With <br />
              <span className="text-[#FFE600]">Vox 2.5D Motion Engine</span>
            </h2>
            <p className="text-sm text-neutral-400 font-medium max-w-lg mt-2">
              Click any documentary reel to preview the 9:16 vertical animation, audio narration, and kinetic word highlights.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            {["ALL", "Business", "Tech", "History", "Finance"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                  activeTab === cat
                    ? "bg-[#FFE600] text-[#111111] shadow-xs scale-105"
                    : "bg-[#1A1A1E] text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Card Interactive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSamples.map((sample) => (
            <motion.div
              key={sample.id}
              onClick={() => {
                setSelectedSample(sample);
                setModalFrameIndex(0);
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[#1A1A1E] border-3 border-neutral-800 hover:border-[#B5F500] rounded-3xl p-5 shadow-2xl flex flex-col justify-between cursor-pointer group transition-all relative overflow-hidden"
            >
              <div>
                {/* 9:16 Vertical Preview Frame */}
                <div className="w-full aspect-[9/13] rounded-2xl overflow-hidden bg-black border-2 border-neutral-800 relative mb-4 flex flex-col items-center justify-between p-3.5 group-hover:border-[#B5F500]/60 transition-colors">
                  
                  {/* Background Image Texture */}
                  <img
                    src={sample.thumbnail}
                    alt={sample.topic}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Top Category Badge */}
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black uppercase bg-[#B5F500] text-[#111111] px-2 py-0.5 rounded">
                      {sample.category}
                    </span>
                    <span className="text-[9px] font-mono text-white/80 bg-black/70 px-2 py-0.5 rounded border border-white/20 font-bold">
                      {sample.duration} @ 30FPS
                    </span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#B5F500] border-2 border-[#111111] text-[#111111] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>

                  {/* Bottom Hook Subtitle */}
                  <div className="relative z-10 w-full bg-black/80 p-2 rounded-xl border border-white/10 text-[10px] text-neutral-300 line-clamp-2 font-mono">
                    "{sample.hook}"
                  </div>
                </div>

                {/* Topic Title */}
                <h3 className="font-bebas text-2xl text-white uppercase leading-tight line-clamp-2 mb-1 group-hover:text-[#B5F500] transition-colors">
                  {sample.topic}
                </h3>
                
                <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 mt-1">
                  <Volume2 className="w-3 h-3 text-[#FFE600]" />
                  <span>{sample.audioVoice}</span>
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 font-bold">{sample.scenesCount} SCENES</span>
                <span className="text-[#B5F500] font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>WATCH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* 9:16 Video Player Popover Modal */}
      <AnimatePresence>
        {selectedSample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedSample(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1E] text-white rounded-3xl border-3 border-neutral-700 shadow-2xl p-6 max-w-lg w-full relative flex flex-col gap-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#B5F500]" />
                  <span className="font-bebas text-lg text-white uppercase tracking-wide">
                    2.5D REEL INSPECTION STUDIO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSample(null)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 9:16 Vertical Video Bezel */}
              <div className="w-full aspect-[9/14] max-h-[440px] rounded-2xl border-2 border-neutral-800 bg-black relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                <img
                  src={selectedSample.thumbnail}
                  alt={selectedSample.topic}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

                {/* Top Scene Tracker */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="bg-[#FFE600] text-[#111111] font-black px-2 py-0.5 rounded text-[10px]">
                    SCENE 01 OF 06
                  </span>
                  <span className="text-[#B5F500] font-bold">1080×1920 @ 30FPS</span>
                </div>

                {/* Center Animated Title */}
                <div className="relative z-10 text-center my-auto px-4">
                  <h3 className="font-bebas text-3xl sm:text-4xl text-white uppercase leading-none drop-shadow-md">
                    {selectedSample.topic}
                  </h3>
                  <div className="mt-3 inline-block bg-black/80 px-3 py-1 rounded-full border border-white/20 font-mono text-[10px] text-[#FFE600]">
                    🎙️ {selectedSample.audioVoice}
                  </div>
                </div>

                {/* Live Captions Word Highlight */}
                <div className="relative z-10 bg-black/85 p-3 rounded-xl border border-neutral-800 space-y-1">
                  <p className="text-xs font-bold text-white leading-relaxed">
                    <span className="bg-[#B5F500] text-[#111111] px-1 rounded mr-1">
                      "{selectedSample.transcriptPreview[modalFrameIndex] || selectedSample.transcriptPreview[0]}"
                    </span>
                  </p>
                </div>
              </div>

              {/* Transcript Scrubbing Controls */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400">NEXT SCENE CUE:</span>
                <div className="flex items-center gap-1.5">
                  {selectedSample.transcriptPreview.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setModalFrameIndex(idx)}
                      className={`w-6 h-6 rounded font-bold transition-all ${
                        modalFrameIndex === idx
                          ? "bg-[#B5F500] text-[#111111]"
                          : "bg-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Instant Remix Action */}
              <Link
                href={`/create-video?topic=${encodeURIComponent(selectedSample.topic)}`}
                className="w-full py-3.5 rounded-xl font-bebas text-xl uppercase tracking-wider bg-[#B5F500] hover:bg-[#a6e200] text-[#111111] transition-all flex items-center justify-center gap-2 border-2 border-white shadow-lg cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>REMIX THIS REEL IN FAST-LANE STUDIO →</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
