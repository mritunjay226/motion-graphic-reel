"use client";

import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import { executionPlan as defaultPlan } from "./data/execution-plan";
import type { ExecutionPlan } from "./types";
import { SceneRenderer } from "./SceneRenderer";
import { FilmTreatment } from "./components/FilmTreatment";
import { TactilePaperCanvas } from "./components/TactilePaperCanvas";
import { TactileSfxLayer } from "./components/TactileSfxLayer";
import { InfiniteWorldCanvas } from "./components/InfiniteWorldCanvas";
import { SocialSafeZoneOverlay } from "./components/SocialSafeZoneOverlay";
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
  enableInfiniteCanvas?: boolean;
  enableLoop?: boolean;
  showSafeZones?: boolean;
}

/**
 * Main Remotion composition component for the 2.5D documentary reel.
 * Root-level pre-buffered audio track sequences ensure ZERO inter-scene buffering pauses,
 * smooth 30 FPS video playback, and velocity-matched Vox transitions.
 */
export const BlockbusterNetflixReel: React.FC<BlockbusterNetflixReelProps> = ({
  plan = defaultPlan,
  voiceId = "fenrir_gemini",
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
  enableInfiniteCanvas = true,
  enableLoop = false,
  showSafeZones = false,
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

  // ── INTELLIGENT TOKEN-AWARE SIDECHAIN SPEECH INTERVALS ──
  // Precompute exact speech frame ranges from Whisper/Deepgram tokens or scene boundaries.
  const speechIntervals = useMemo(() => {
    const intervals: Array<{ start: number; end: number }> = [];

    scenes.forEach((sc) => {
      if (sc.whisperTokens && sc.whisperTokens.length > 0) {
        // Group contiguous words separated by less than 10 frames into a continuous speech block
        let blockStart = sc.whisperTokens[0].startFrame;
        let blockEnd = sc.whisperTokens[0].endFrame;

        for (let i = 1; i < sc.whisperTokens.length; i++) {
          const tok = sc.whisperTokens[i];
          if (tok.startFrame - blockEnd <= 10) {
            // Contiguous speech or micro-pause: extend block
            blockEnd = Math.max(blockEnd, tok.endFrame);
          } else {
            // Substantial narrative pause (>10 frames / 0.33s): push block and start new one
            intervals.push({ start: blockStart - 3, end: blockEnd + 4 });
            blockStart = tok.startFrame;
            blockEnd = tok.endFrame;
          }
        }
        intervals.push({ start: blockStart - 3, end: blockEnd + 4 });
      } else {
        // Fallback to scene-level boundaries with 4-frame ease padding
        intervals.push({
          start: sc.startFrame + 2,
          end: sc.startFrame + sc.durationFrames - 4,
        });
      }
    });

    return intervals;
  }, [scenes]);

  // Smooth Exponential Sidechain Ducking:
  // Ducks music to ~ -22dB during speech, smoothly swells up to ~ -14dB (+8dB boost) during narrative pauses & 3D camera flights
  const duckedVolume = Math.max(0.05, bgMusicVolume * 0.48);
  const swelledVolume = Math.min(0.35, bgMusicVolume * 1.60);

  const getDynamicMusicVolume = (f: number) => {
    const fadeFrames = 7;

    for (const interval of speechIntervals) {
      if (f >= interval.start && f <= interval.end) {
        // Active speech: ducked
        return duckedVolume;
      }

      // Smooth attack: speech about to begin within fadeFrames
      if (f < interval.start && interval.start - f <= fadeFrames) {
        const progress = (fadeFrames - (interval.start - f)) / fadeFrames;
        return interpolate(progress, [0, 1], [swelledVolume, duckedVolume]);
      }

      // Smooth release: speech just ended within fadeFrames
      if (f > interval.end && f - interval.end <= fadeFrames) {
        const progress = (f - interval.end) / fadeFrames;
        return interpolate(progress, [0, 1], [duckedVolume, swelledVolume]);
      }
    }

    // Dramatic narrative pause or inter-scene gap: swell music up for punchline impact!
    return swelledVolume;
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
              : `/api/tts?text=${encodeURIComponent(scene.narrationLine)}&voiceId=${voiceId}&style=investigative`;

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
        enableLoop={enableLoop}
      />

      {/* ── BACKGROUND CINEMATIC FILM & TEXTURE LAYER (STRICTLY BEHIND CONTENT) ── */}
      <FilmTreatment config={filmTreatment} theme={activeTheme} />

      {/* ── TRUE INFINITE CANVAS & 3D CAMERA FLIGHT STAGE ── */}
      {enableInfiniteCanvas ? (
        <InfiniteWorldCanvas
          scenes={scenes}
          theme={activeTheme}
          canvasBg={activeTheme.canvasBg || "#FAF8F2"}
          enableConnectors={true}
          enableLoop={enableLoop}
        />
      ) : (
        /* Legacy scene sequence stack */
        scenes.map((scene, idx) => (
          <Sequence
            key={`scene-${scene.sceneId}`}
            from={scene.startFrame}
            durationInFrames={scene.durationFrames}
            name={scene.sceneTitle}
          >
            <SceneRenderer
              scene={scene}
              sceneIndex={idx}
              totalScenes={scenes.length}
              prevScene={idx > 0 ? scenes[idx - 1] : undefined}
              nextScene={idx < scenes.length - 1 ? scenes[idx + 1] : undefined}
              voiceId={voiceId}
              theme={activeTheme}
              enableAudio={false}
            />
          </Sequence>
        ))
      )}

      {/* ── 9:16 SOCIAL RETENTION SAFE ZONE OVERLAY (QA & AUDIT GUIDE) ── */}
      {showSafeZones && <SocialSafeZoneOverlay platform="all" />}
    </TactilePaperCanvas>
  );
};
