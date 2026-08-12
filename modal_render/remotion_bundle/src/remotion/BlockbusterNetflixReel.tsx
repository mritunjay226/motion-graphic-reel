"use client";

import React from "react";
import { AbsoluteFill, Sequence, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import { executionPlan as defaultPlan } from "./data/execution-plan";
import type { ExecutionPlan } from "./types";
import { SceneRenderer } from "./SceneRenderer";
import { FilmTreatment } from "./components/FilmTreatment";
import { getVideoTheme, resolveVideoTheme, DEFAULT_STYLE_ID, DEFAULT_PALETTE_ID } from "./utils/themes";

export interface BlockbusterNetflixReelProps {
  plan?: ExecutionPlan;
  voiceId?: string;
  themeId?: string;
  styleId?: string;
  colorPaletteId?: string;
  enableAudio?: boolean;
  bgMusicUrl?: string;
  bgMusicVolume?: number;
}

/**
 * Main Remotion composition component for the 2.5D documentary reel.
 * Root-level pre-buffered audio track sequences ensure ZERO inter-scene buffering pauses,
 * smooth 30 FPS video playback, and velocity-matched Vox transitions.
 */
export const BlockbusterNetflixReel: React.FC<BlockbusterNetflixReelProps> = ({
  plan = defaultPlan,
  voiceId = "62ae83ad-4f6a-430b-af41-a9bede9286ca",
  themeId,
  styleId,
  colorPaletteId,
  enableAudio = true,
  bgMusicUrl = "/music/without_me.mp3",
  bgMusicVolume = 0.15,
}) => {
  const frame = useCurrentFrame();
  const activePlan = plan || defaultPlan;

  // Resolve active theme by styleId + colorPaletteId (or fallback to themeId string)
  const activeTheme = styleId
    ? resolveVideoTheme(styleId, colorPaletteId)
    : getVideoTheme(themeId || DEFAULT_STYLE_ID);

  const { scenes, filmTreatment } = activePlan;

  // Validate master fullVoiceoverUrl (exclude fake mock placeholders)
  const masterAudioUrl = activePlan.audioPipeline?.fullVoiceoverUrl;
  const isValidMasterUrl = Boolean(
    masterAudioUrl &&
    typeof masterAudioUrl === "string" &&
    masterAudioUrl.length > 10 &&
    !masterAudioUrl.includes("cdn.saas.com")
  );

  // Dynamic Audio Ducking via frame callback (prevents timeline re-renders and volume warnings)
  const getDynamicMusicVolume = (f: number) => {
    const isSpeechAtFrame = scenes.some(
      (sc) => f >= sc.startFrame && f <= sc.startFrame + sc.durationFrames - 2
    );
    return isSpeechAtFrame ? bgMusicVolume : Math.min(0.35, bgMusicVolume * 1.4);
  };

  let resolvedBgMusicUrl = (bgMusicUrl && !bgMusicUrl.includes("cdn.saas.com")) ? bgMusicUrl : "";
  if (resolvedBgMusicUrl.includes("localhost:3000")) {
    resolvedBgMusicUrl = resolvedBgMusicUrl.replace("http://localhost:3000", "");
  }
  if (resolvedBgMusicUrl.startsWith("/")) {
    resolvedBgMusicUrl = staticFile(resolvedBgMusicUrl);
  }

  const isGradientBg = activeTheme.canvasBg.includes("gradient");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isGradientBg ? "transparent" : activeTheme.canvasBg,
        backgroundImage: isGradientBg
          ? activeTheme.canvasBg
          : "radial-gradient(rgba(0,0,0,0.12) 1.5px, transparent 1.5px)",
        backgroundSize: isGradientBg ? "100% 100%" : "24px 24px",
      }}
    >
      {/* ── BACKGROUND MUSIC TRACK (DYNAMICALLY DUCKED & LOOPED ACROSS REEL) ── */}
      {enableAudio && resolvedBgMusicUrl && (
        <Audio
          src={resolvedBgMusicUrl}
          volume={getDynamicMusicVolume}
          loop
        />
      )}

      {/* ── MASTER CONTINUOUS VOICEOVER OR PER-SCENE AUDIO FALLBACK ── */}
      {enableAudio && (
        isValidMasterUrl && masterAudioUrl ? (
          <Audio
            src={masterAudioUrl}
            volume={1.0}
          />
        ) : (
          scenes.map((scene) => {
            const finalAudioUrl =
              scene.audioUrl && !scene.audioUrl.includes("cdn.saas.com")
                ? scene.audioUrl
                : `/api/tts?text=${encodeURIComponent(scene.narrationLine)}&voiceId=${voiceId}`;

            return (
              <Sequence
                key={`audio-scene-${scene.sceneId}`}
                from={scene.startFrame}
                durationInFrames={scene.durationFrames}
                name={`AUDIO: Scene ${scene.sceneId}`}
                layout="none"
              >
                <Audio
                  src={finalAudioUrl}
                  volume={1.0}
                />
              </Sequence>
            );
          })
        )
      )}

      {/* ── SCENE VISUAL SEQUENCE STACK ── */}
      {scenes.map((scene) => (
        <Sequence
          key={`scene-${scene.sceneId}`}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={scene.sceneTitle}
        >
          <SceneRenderer
            scene={scene}
            voiceId={voiceId}
            theme={activeTheme}
            enableAudio={false}
          />
        </Sequence>
      ))}

      {/* Global Cinematic Film Treatment Overlay ("Texture Sandwich") */}
      <FilmTreatment config={filmTreatment} theme={activeTheme} />
    </AbsoluteFill>
  );
};
