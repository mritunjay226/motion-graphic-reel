"use client";

import React from "react";
import { AbsoluteFill, Sequence, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import { executionPlan as defaultPlan } from "./data/execution-plan";
import type { ExecutionPlan } from "./types";
import { SceneRenderer } from "./SceneRenderer";
import { FilmTreatment } from "./components/FilmTreatment";
import { TactilePaperCanvas } from "./components/TactilePaperCanvas";
import { TactileSfxLayer } from "./components/TactileSfxLayer";
import { getVideoTheme, resolveVideoTheme, DEFAULT_STYLE_ID, DEFAULT_PALETTE_ID } from "./utils/themes";
import { PRESET_MUSIC_URL_MAP } from "./utils/resolveAsset";

export interface BlockbusterNetflixReelProps {
  plan?: ExecutionPlan;
  voiceId?: string;
  themeId?: string;
  styleId?: string;
  colorPaletteId?: string;
  textureType?: string;
  paperTextureOpacity?: number;
  customTextureUrl?: string;
  enableAudio?: boolean;
  enableSfx?: boolean;
  sfxVolume?: number;
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
  textureType,
  paperTextureOpacity,
  customTextureUrl,
  enableAudio = true,
  enableSfx = true,
  sfxVolume = 1.0,
  bgMusicUrl = "/music/documentary_pulse.mp3",
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

  // Smooth Exponential Sidechain Ducking:
  // Ducks music to ~ -22dB during speech, smoothly eases up to ~ -14dB during narrative pauses
  const duckedVolume = Math.max(0.06, bgMusicVolume * 0.55);
  const swelledVolume = Math.min(0.35, bgMusicVolume * 1.5);

  const getDynamicMusicVolume = (f: number) => {
    const activeScene = scenes.find(
      (sc) => f >= sc.startFrame && f <= sc.startFrame + sc.durationFrames
    );

    if (!activeScene) {
      return swelledVolume;
    }

    const localF = f - activeScene.startFrame;
    const remainingF = activeScene.startFrame + activeScene.durationFrames - f;
    const fadeFrames = 6;

    // Smooth ease-in duck at speech onset
    if (localF < fadeFrames) {
      return interpolate(localF, [0, fadeFrames], [swelledVolume, duckedVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    // Smooth ease-out swell at speech conclusion
    if (remainingF < fadeFrames) {
      return interpolate(fadeFrames - remainingF, [0, fadeFrames], [duckedVolume, swelledVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    return duckedVolume;
  };

  let resolvedBgMusicUrl = (bgMusicUrl && !bgMusicUrl.includes("cdn.saas.com")) ? bgMusicUrl : "";
  if (resolvedBgMusicUrl.includes("localhost:3000")) {
    resolvedBgMusicUrl = resolvedBgMusicUrl.replace("http://localhost:3000", "");
  }
  // Auto-map local preset paths to permanent Cloudinary CDN URLs so cloud renders never 404
  for (const [key, cdnUrl] of Object.entries(PRESET_MUSIC_URL_MAP)) {
    if (resolvedBgMusicUrl === key || resolvedBgMusicUrl.endsWith(key)) {
      resolvedBgMusicUrl = cdnUrl;
      break;
    }
  }
  if (resolvedBgMusicUrl.startsWith("/")) {
    try {
      resolvedBgMusicUrl = staticFile(resolvedBgMusicUrl);
    } catch {
      // Keep URL as-is
    }
  }

  const isGradientBg = activeTheme.canvasBg.includes("gradient");

  const effectiveTextureType = textureType || activeTheme.textureType || "paper_fiber";
  const effectiveTextureOpacity = paperTextureOpacity ?? activeTheme.paperTextureOpacity ?? (effectiveTextureType === "clean_studio" ? 0 : 0.18);

  return (
    <TactilePaperCanvas
      baseColor={activeTheme.canvasBg || "#FAF8F2"}
      textureType={effectiveTextureType}
      customTextureUrl={customTextureUrl}
      paperTextureOpacity={effectiveTextureOpacity}
      vignetteStrength={activeTheme.vignette ?? 0.08}
      gridOpacity={activeTheme.paperGridOpacity ?? 0}
      gridSize={activeTheme.paperGridSize ?? 36}
      showSubGrid={false}
      showCreases={activeTheme.showCreases ?? false}
    >
      {/* ── BACKGROUND MUSIC TRACK (DYNAMICALLY DUCKED & LOOPED ACROSS REEL) ── */}
      {enableAudio && resolvedBgMusicUrl && (
        <Audio
          src={resolvedBgMusicUrl}
          volume={getDynamicMusicVolume}
          loop
        />
      )}

      {/* ── PER-SCENE FRAME-SYNCHRONIZED AUDIO (MATCHES DEEPGRAM TOKENS 100%) ── */}
      {enableAudio && (
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
      )}

      {/* ── BROADCAST 2.5D TACTILE FOLEY SFX LAYER ── */}
      <TactileSfxLayer
        scenes={scenes}
        audioPipeline={activePlan.audioPipeline}
        sfxVolume={sfxVolume}
        enableAudio={enableAudio}
        enableSfx={enableSfx}
      />

      {/* ── BACKGROUND CINEMATIC FILM & TEXTURE LAYER (STRICTLY BEHIND CONTENT) ── */}
      <FilmTreatment config={filmTreatment} theme={activeTheme} />

      {/* ── SCENE VISUAL SEQUENCE STACK (FOREGROUND: ALL SUBJECTS, TEXT, CUTOUTS, CAPTIONS) ── */}
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
    </TactilePaperCanvas>
  );
};
