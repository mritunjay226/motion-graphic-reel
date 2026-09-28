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
import { ContinuousSpatialCamera } from "./components/ContinuousSpatialCamera";
import { RackFocusLayer } from "./components/RackFocusLayer";
import { RemotionVideoLayer } from "./components/RemotionVideoLayer";
import { TactilePaperCanvas } from "./components/TactilePaperCanvas";

interface SceneRendererProps {
  scene: Scene;
  voiceId?: string;
  theme?: VideoTheme;
  enableAudio?: boolean;
  sceneIndex?: number;
  totalScenes?: number;
  prevScene?: Scene;
  nextScene?: Scene;
}

/**
 * SceneRenderer orchestrates Vox documentary visual storytelling by routing scenes into 
 * broadcast-grade, collision-free 2.5D Vox layout templates with intelligent 3D spatial
 * camera choreography, match-cut portal dives, and optical rack focus depth-of-field.
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  voiceId,
  theme,
  enableAudio = true,
  sceneIndex = 0,
  totalScenes = 6,
  prevScene,
  nextScene,
}) => {
  const frame = useCurrentFrame();

  const {
    sceneId,
    startFrame,
    durationFrames,
    animationRules,
    whisperTokens = [],
    spatialCameraConfig,
  } = scene;

  const canvasBg = theme?.canvasBg || "#F4F4F6";
  const isGradientBg = canvasBg.includes("gradient");

  const layoutType = (scene as any).layoutType || (scene as any).visualType || "center_hero_cutout";

  // Select dynamic layout template preset
  const LayoutTemplate = getLayoutTemplate(scene, sceneId);

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

  // Inter-Scene Match-Cut Handoff Determination
  const isMatchCutEntry = Boolean(
    sceneIndex > 0 &&
    (prevScene?.spatialCameraConfig?.trajectoryMode === "portal_dive_matchcut" ||
     spatialCameraConfig?.trajectoryMode === "portal_dive_matchcut")
  );

  const isMatchCutExit = Boolean(
    nextScene &&
    (spatialCameraConfig?.trajectoryMode === "portal_dive_matchcut" ||
     nextScene?.spatialCameraConfig?.trajectoryMode === "portal_dive_matchcut")
  );

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
        {/* Optical Rack Focus Depth-of-Field Engine */}
        <RackFocusLayer
          focusPlane={spatialCameraConfig?.rackFocusTarget || "subject"}
          durationFrames={durationFrames}
          transitionFrames={12}
          maxBlur={5}
        >
          {/* Broadcast-Grade 3D Continuous Spatial Camera Rig */}
          <ContinuousSpatialCamera
            sceneIndex={sceneIndex}
            totalScenes={totalScenes}
            durationFrames={durationFrames}
            layoutType={layoutType}
            tokens={whisperTokens}
            config={spatialCameraConfig}
            isMatchCutEntry={isMatchCutEntry}
            isMatchCutExit={isMatchCutExit}
          >
            {/* Render Dynamic Broadcast Vox Layout Template */}
            <LayoutTemplate scene={scene} theme={theme} />
          </ContinuousSpatialCamera>
        </RackFocusLayer>
      </CinematicDepthTransition>
    </AbsoluteFill>
  );
};
