"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
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
import { CurveCutTransition } from "./components/CurveCutTransition";
import { ExitAnimationWrapper } from "./components/ExitAnimationWrapper";
import { TypewriterParagraph } from "./components/TypewriterParagraph";
import { NewsArticleClipping } from "./components/NewsArticleClipping";

import { getLayoutTemplate } from "./templates/layouts";

interface SceneRendererProps {
  scene: Scene;
  voiceId?: string;
  theme?: VideoTheme;
  enableAudio?: boolean;
}

/**
 * SceneRenderer orchestrates Vox documentary visual storytelling by routing scenes into 
 * broadcast-grade, collision-free 2.5D Vox layout templates (12 dynamic presets).
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
  } = scene;

  const canvasBg = theme?.canvasBg || "#F4F4F6";
  const isGradientBg = canvasBg.includes("gradient");

  // Continuous dynamic camera scale zoom (1.0 -> 1.05) over scene duration
  const cameraScale = interpolate(frame, [0, Math.max(1, durationFrames)], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Select dynamic layout template preset
  const LayoutTemplate = getLayoutTemplate(scene, sceneId);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: isGradientBg ? "transparent" : canvasBg,
        backgroundImage: isGradientBg
          ? `${canvasBg}, radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)`
          : `radial-gradient(rgba(0,0,0,0.12) 1.5px, transparent 1.5px)`,
        backgroundSize: isGradientBg ? "100% 100%, 24px 24px" : "24px 24px",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
        filter: theme?.filter || "none",
      }}
    >
      {/* ── VOX "CUTTING THE CURVE" VELOCITY-MATCHED SCENE TRANSITION ── */}
      <CurveCutTransition
        sceneStartFrame={startFrame}
        durationFrames={durationFrames}
        cutWindowFrames={6}
      >
        {/* Top Studio Stage Badges (Vox Reference Style) */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "50px",
            right: "50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 900,
            pointerEvents: "none",
          }}
        >
          {/* Left Theme Scene Opener Badge */}
          <div
            style={{
              backgroundColor: theme?.badgeBg || "#FFE600",
              border: `2.5px solid ${theme?.badgeBorder || "#111111"}`,
              borderRadius: "4px",
              padding: "4px 12px",
              boxShadow: `3px 3px 0px ${theme?.badgeBorder || "#111111"}`,
              fontFamily: `${theme?.fontFamily || "Bebas Neue"}, sans-serif`,
              fontSize: "18px",
              fontWeight: 800,
              color: theme?.badgeText || "#111111",
              letterSpacing: "1.5px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>SCENE {String(sceneId).padStart(2, "0")} • {scene.sceneTitle?.replace(/SCENE \d+:\s*/i, "").slice(0, 20).toUpperCase() || "STORY OPENER"}</span>
          </div>

          {/* Right Dark Studio Status Badge */}
          <div
            style={{
              backgroundColor: theme?.badgeBorder || "#1B2A10",
              border: `2.5px solid ${theme?.badgeBorder || "#111111"}`,
              borderRadius: "6px",
              padding: "4px 12px",
              boxShadow: "3px 3px 0px rgba(0,0,0,0.5)",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              color: theme?.orbitRingColor || "#B4F500",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: theme?.orbitRingColor || "#B4F500", borderRadius: "1px" }} />
            <span>{theme?.name.toUpperCase() || "PAUSE STAGE"}</span>
          </div>
        </div>

        {/* Render Dynamic Broadcast Vox Layout Template */}
        <LayoutTemplate scene={scene} theme={theme} />
      </CurveCutTransition>

      {/* Scene Transition Out */}
      {animationRules?.transitionOut && (
        <TransitionEffect
          config={animationRules.transitionOut}
          sceneStartFrame={startFrame}
        />
      )}
    </AbsoluteFill>
  );
};
