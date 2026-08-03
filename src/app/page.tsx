"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);
import { getResolvedExecutionPlan } from "@/remotion/data/execution-plan";
import { POLLINATIONS_MODELS } from "@/remotion/utils/pollinations";

const CARTESIA_VOICES = [
  { id: "5ee9feff-1265-424a-9d7f-8e4d431a12c7", name: "Ronald — Deep Thinker (US Male)" },
  { id: "b24f41fd-00a3-4cd8-992a-a0c9f13f3ef1", name: "Clive — Measured Expert (UK Male)" },
  { id: "47c38ca4-5f35-497b-b1a3-415245fb35e1", name: "Daniel — Modern Assistant (US Male)" },
  { id: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4", name: "Skylar — Friendly Guide (US Female)" },
  { id: "ef191366-f52f-447a-a398-ed8c0f2943a1", name: "Archie — Approachable Mate (UK Male)" },
];

export default function Home() {
  const [activeSceneTab, setActiveSceneTab] = useState<number | null>(0);
  const [model, setModel] = useState<"flux" | "flux-realism" | "turbo" | "sana">("flux");
  const [seed, setSeed] = useState<number>(42);
  const [quality, setQuality] = useState<"preview" | "hd">("preview");

  // Cartesia voice state
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("5ee9feff-1265-424a-9d7f-8e4d431a12c7");
  const [isGeneratingTts, setIsGeneratingTts] = useState<boolean>(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);

  // Dynamically resolve execution plan with Pollinations AI URLs
  const activePlan = useMemo(() => {
    return getResolvedExecutionPlan({ model, seed, quality });
  }, [model, seed, quality]);

  // Memoize inputProps as required by AGENTS.md rules
  const inputProps = useMemo(
    () => ({ plan: activePlan, voiceId: selectedVoiceId }),
    [activePlan, selectedVoiceId]
  );

  const { projectMeta, scenes, filmTreatment, audioPipeline } = activePlan;

  const handleRandomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 10000));
  };

  const handleGenerateCartesiaTts = async (textToSpeak?: string) => {
    setIsGeneratingTts(true);
    setTtsError(null);

    const script = textToSpeak || audioPipeline.narrationScript;

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script,
          voiceId: selectedVoiceId,
          modelId: "sonic-3",
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const audioBlob = await res.blob();
      const url = URL.createObjectURL(audioBlob);
      setTtsAudioUrl(url);
    } catch (err: any) {
      console.error("Cartesia TTS Generation Error:", err);
      setTtsError(err.message || "Failed to generate Cartesia voice audio.");
    } finally {
      setIsGeneratingTts(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-between p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-red-600/20 text-red-500 rounded-full border border-red-500/30">
              2.5D REEL ENGINE
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> CARTESIA AI VOICE
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-600/20 text-purple-400 rounded-full border border-purple-500/30">
              POLLINATIONS AI
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {projectMeta.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Remotion 4.x Active</span>
          </div>
        </div>
      </header>

      {/* Main Studio View */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Remotion Player Container */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="player-container w-full max-w-[360px] aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl">
            <Player
              component={BlockbusterNetflixReel}
              inputProps={inputProps}
              durationInFrames={projectMeta.totalDurationFrames}
              fps={projectMeta.fps}
              compositionWidth={projectMeta.width}
              compositionHeight={projectMeta.height}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls
              autoPlay={false}
              loop
              acknowledgeRemotionLicense
            />
          </div>
          <p className="text-xs text-neutral-500 mt-3 text-center">
            Click play to preview interactive 2.5D reel animation with live Pollinations AI visuals
          </p>

          {/* Cartesia Voice Narration Audio Player */}
          {ttsAudioUrl && (
            <div className="w-full max-w-[360px] mt-4 bg-blue-950/40 border border-blue-500/40 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Cartesia Voice Audio Ready
                </span>
                <span className="font-mono text-neutral-400 text-[10px]">Sonic-3</span>
              </div>
              <audio src={ttsAudioUrl} controls autoPlay className="w-full h-8" />
            </div>
          )}
        </div>

        {/* Right Column — Controls & Scene Breakdown */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Cartesia AI Voiceover Panel */}
          <div className="bg-neutral-900/80 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                </svg>
                Cartesia AI Voice Pipeline
              </h2>
              <span className="text-[11px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                Cartesia API Key Connected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">
                  Select Cartesia Voice
                </label>
                <select
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="w-full bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-lg p-2 font-mono text-xs focus:outline-none focus:border-blue-500"
                >
                  {CARTESIA_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isGeneratingTts}
                  onClick={() => handleGenerateCartesiaTts()}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {isGeneratingTts ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Generating Cartesia Audio...</span>
                    </>
                  ) : (
                    <>
                      <span>🎙️ Generate Full Script Narration</span>
                    </>
                  )}
                </button>
              </div>

              {ttsError && (
                <p className="text-red-400 text-xs bg-red-950/50 border border-red-800/50 p-2 rounded">
                  {ttsError}
                </p>
              )}
            </div>
          </div>

          {/* Pollinations AI Generator Controls */}
          <div className="bg-neutral-900/80 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Pollinations AI Image Pipeline
              </h2>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                18 AI Assets Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Model Picker */}
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">
                  AI Image Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="w-full bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-lg p-2 font-mono text-xs focus:outline-none focus:border-purple-500"
                >
                  {POLLINATIONS_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution Toggle */}
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">
                  Render Quality
                </label>
                <div className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setQuality("preview")}
                    className={`py-1 text-center rounded font-medium transition-all ${
                      quality === "preview"
                        ? "bg-purple-600 text-white shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Preview (540p)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality("hd")}
                    className={`py-1 text-center rounded font-medium transition-all ${
                      quality === "hd"
                        ? "bg-purple-600 text-white shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    HD (1080p)
                  </button>
                </div>
              </div>
            </div>

            {/* Seed Control & Refresh Button */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800/60">
              <div className="flex-1 flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 font-mono text-[11px]">SEED:</span>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                  className="bg-transparent text-neutral-200 font-mono text-xs w-full focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleRandomizeSeed}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
              >
                <span>🎲 Re-roll Visuals</span>
              </button>
            </div>
          </div>

          {/* Film Treatment Card */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
              </svg>
              Film Treatment Overlay (&quot;Texture Sandwich&quot;)
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-500 block">Film Grain</span>
                <span className="font-mono text-neutral-200">{filmTreatment.grainOpacity * 100}% Opacity ({filmTreatment.grainBlendMode})</span>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-500 block">Scanlines</span>
                <span className="font-mono text-neutral-200">{filmTreatment.scanlineWidth}px @ {filmTreatment.scanlineOpacity * 100}%</span>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-500 block">Vignette</span>
                <span className="font-mono text-neutral-200">{filmTreatment.vignette * 100}% Strength</span>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-neutral-500 block">Corner Blur</span>
                <span className="font-mono text-neutral-200">{filmTreatment.cornerBlurRadius}px Radius</span>
              </div>
            </div>
          </div>

          {/* Scenes Accordion & Prompt Inspector */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              6-Scene AI Asset & Speech Inspector
            </h2>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {scenes.map((scene, idx) => {
                const isOpen = activeSceneTab === idx;

                return (
                  <div
                    key={scene.sceneId}
                    className="bg-neutral-950 border border-neutral-800/80 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSceneTab(isOpen ? null : idx)}
                      className="w-full p-3 text-left flex items-center justify-between hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-neutral-800 text-xs font-mono font-bold flex items-center justify-center text-neutral-300">
                          {scene.sceneId}
                        </span>
                        <span className="font-semibold text-sm text-neutral-200">
                          {scene.sceneTitle}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500">
                        f{scene.startFrame}-{scene.endFrame} ({scene.durationSeconds}s)
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-3 pt-0 border-t border-neutral-800/50 text-xs space-y-3 mt-2">
                        <div className="flex items-center justify-between bg-neutral-900 p-2 rounded border border-neutral-800 gap-2">
                          <p className="text-neutral-300 italic flex-1">
                            &quot;{scene.narrationLine}&quot;
                          </p>
                          <button
                            type="button"
                            disabled={isGeneratingTts}
                            onClick={() => handleGenerateCartesiaTts(scene.narrationLine)}
                            className="bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white px-2 py-1 rounded text-[10px] font-bold border border-blue-500/40 transition-colors shrink-0"
                          >
                            🗣️ Speak Line
                          </button>
                        </div>

                        {/* Pollinations Links */}
                        <div className="space-y-1.5">
                          <span className="font-bold text-purple-400 block text-[11px]">
                            POLLINATIONS AI GENERATED ASSETS:
                          </span>
                          
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            <a
                              href={scene.imageKitUrls.background}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-neutral-900 hover:bg-purple-950/60 text-purple-300 border border-neutral-800 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                            >
                              <span>🖼️ Background Image</span>
                            </a>

                            <a
                              href={scene.imageKitUrls.foreground}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-neutral-900 hover:bg-purple-950/60 text-purple-300 border border-neutral-800 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                            >
                              <span>👤 Subject Cutout</span>
                            </a>

                            {scene.imageKitUrls.props.map((pUrl, pI) => (
                              <a
                                key={pI}
                                href={pUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-neutral-900 hover:bg-purple-950/60 text-purple-300 border border-neutral-800 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                              >
                                <span>✨ Prop #{pI + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Prompts Details */}
                        <div className="bg-neutral-900/70 p-2.5 rounded border border-neutral-800/80 text-[11px] space-y-1 text-neutral-400">
                          <p><strong className="text-neutral-300">BG Prompt:</strong> {scene.assetPrompts.backgroundPrompt}</p>
                          <p><strong className="text-neutral-300">Subject Prompt:</strong> {scene.assetPrompts.foregroundCutoutPrompt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mt-8 pt-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
        MoSidd 2.5D Motion Graphics Pipeline &bull; Remotion + Next.js App Router &bull; Cartesia AI TTS &bull; Pollinations.ai Integration
      </footer>
    </main>
  );
}
