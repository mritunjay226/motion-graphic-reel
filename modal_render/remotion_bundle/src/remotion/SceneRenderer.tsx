import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring } from "remotion";
import type { Scene } from "./types";
import type { VideoTheme } from "./utils/themes";
import { AnimatedLayer } from "./components/ParallaxLayer";
import { OverlayFx } from "./components/OverlayFx";
import { PaperSticker } from "./components/PaperSticker";
import { CharacterBoil } from "./components/CharacterBoil";
import { WordByWordCaptions } from "./components/WordByWordCaptions";
import { TransitionEffect } from "./components/TransitionEffect";
import { SwingingOverheadLamp } from "./components/SwingingOverheadLamp";
import { VoxTypography } from "./components/VoxTypography";
import { VoxLeaderLine } from "./components/VoxLeaderLine";
import { GsapSvgGraphics } from "./components/GsapSvgGraphics";
import { CinematicDepthTransition, CinematicTransitionType } from "./components/CinematicDepthTransition";
import { ExitAnimationWrapper } from "./components/ExitAnimationWrapper";
import { TypewriterParagraph } from "./components/TypewriterParagraph";
import { NewsArticleClipping } from "./components/NewsArticleClipping";
import { SpotlightOverlay } from "./components/SpotlightOverlay";

import { getLayoutTemplate } from "./templates/layouts";
import { VoxCameraRig, CameraZoomPreset } from "./components/VoxCameraRig";
import { RemotionVideoLayer } from "./components/RemotionVideoLayer";
import { TactilePaperCanvas } from "./components/TactilePaperCanvas";

interface SceneRendererProps {
  scene: Scene;
  voiceId?: string;
  theme?: VideoTheme;
  enableAudio?: boolean;
}

/**
 * SceneRenderer orchestrates Vox documentary visual storytelling by routing scenes into 
 * broadcast-grade, collision-free 2.5D Vox layout templates with intelligent Steadicam
 * camera choreography, keyword-synced punch zooms, and selective spotlight focus.
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  voiceId,
  theme,
  enableAudio = true,
}) => {
  const frame = useCurrentFrame();

  const {
    sceneId,
    startFrame,
    durationFrames,
    animationRules,
    whisperTokens = [],
  } = scene;

  const canvasBg = theme?.canvasBg || "#F4F4F6";
  const isGradientBg = canvasBg.includes("gradient");

  const layoutType = (scene as any).layoutType || (scene as any).visualType || "center_hero_cutout";

  // Select dynamic layout template preset
  const LayoutTemplate = getLayoutTemplate(scene, sceneId);

  // Dynamic cinematic camera presets rotating across the 6-scene story arc
  const cameraPresets: CameraZoomPreset[] = [
    "slow_push_in",     // Scene 1: Authoritative center hook push
    "focal_pan_right",  // Scene 2: Smooth slider drift tracking right
    "slow_pull_out",    // Scene 3: Wide context reveal
    "punch_zoom_beat",  // Scene 4: Crisp impact snap with steady push
    "focal_pan_left",   // Scene 5: Smooth slider drift tracking left
    "slow_push_in",     // Scene 6: Dramatic climax push
  ];
  const activeCameraPreset = cameraPresets[(Number(sceneId) - 1 + cameraPresets.length) % cameraPresets.length];

  // Determine if this scene features secondary evidence (charts, memos, clippings)
  const normLayout = String(layoutType).toLowerCase();
  const hasSecondaryEvidence =
    normLayout.includes("split") ||
    normLayout.includes("memo") ||
    normLayout.includes("chart") ||
    normLayout.includes("stat") ||
    normLayout.includes("matrix") ||
    normLayout.includes("document");

  // Dynamic 2.5D depth transitions rotating across scenes
  const transitionTypes: CinematicTransitionType[] = [
    "depth_snap_whip",
    "torn_paper_rip",
    "anamorphic_light_leak",
    "torn_paper_rip",
    "film_shutter_snap",
    "depth_snap_whip",
  ];
  const activeTransition = transitionTypes[(Number(sceneId) - 1 + transitionTypes.length) % transitionTypes.length];

  const backgroundImageUrl = scene.imageKitUrls?.background || scene.imageUrl;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      {/* ── 2.5D CINEMATIC DEPTH & TACTILE TRANSITION ENGINE ── */}
      <CinematicDepthTransition
        type={activeTransition}
        sceneStartFrame={startFrame}
        durationFrames={durationFrames}
        transitionFrames={7}
      >
        {/* Broadcast-Grade 2.5D Vox Camera Controller Rig */}
        <VoxCameraRig
          zoomPreset={activeCameraPreset}
          layoutType={layoutType}
          tokens={whisperTokens}
          enableHandheldWiggle={true}
          durationFrames={durationFrames}
        >
          {/* ── ATMOSPHERIC SCENE B-ROLL / IMAGE BACKGROUND OVERLAY (LIGHT & SUBTLE BEHIND CONTENT) ── */}
          {scene.bRollUrl || scene.videoUrl ? (
            <RemotionVideoLayer
              src={scene.bRollUrl || scene.videoUrl || ""}
              opacity={0.12}
              style={{
                mixBlendMode: "soft-light",
                filter: "contrast(0.9) brightness(1.3) saturate(0.35)",
                zIndex: 1,
              }}
            />
          ) : backgroundImageUrl ? (
            <AbsoluteFill style={{ mixBlendMode: "soft-light", opacity: 0.14, pointerEvents: "none", zIndex: 1 }}>
              <Img
                src={backgroundImageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "contrast(0.9) brightness(1.3) saturate(0.35)",
                }}
              />
            </AbsoluteFill>
          ) : null}

          {/* Render Dynamic Broadcast Vox Layout Template */}
          <LayoutTemplate scene={scene} theme={theme} />
        </VoxCameraRig>
      </CinematicDepthTransition>
    </AbsoluteFill>
  );
};
