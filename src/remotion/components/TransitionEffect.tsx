import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { TransitionOutConfig } from "../types";

interface TransitionEffectProps {
  config: TransitionOutConfig;
  /** Scene start frame (absolute) */
  sceneStartFrame: number;
}

/**
 * Renders scene transition-out effects at exact frame numbers.
 *
 * Supported types:
 * - whip_zoom_motion_blur: Rapid scale + directional blur
 * - hard_cut_flash: White flash overlay
 * - fade_to_black: Smooth opacity to black
 */
export const TransitionEffect: React.FC<TransitionEffectProps> = ({
  config,
  sceneStartFrame,
}) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + sceneStartFrame;

  switch (config.type) {
    case "whip_zoom_motion_blur":
      return (
        <WhipZoomTransition
          config={config}
          absoluteFrame={absoluteFrame}
        />
      );
    case "hard_cut_flash":
      return (
        <FlashTransition config={config} absoluteFrame={absoluteFrame} />
      );
    case "fade_to_black":
      return (
        <FadeToBlackTransition
          config={config}
          absoluteFrame={absoluteFrame}
        />
      );
    default:
      return null;
  }
};

// ─── Whip Zoom with Motion Blur ──────────────────────────────────────────────

const WhipZoomTransition: React.FC<{
  config: TransitionOutConfig;
  absoluteFrame: number;
}> = ({ config, absoluteFrame }) => {
  const triggerFrame = config.triggerFrame;
  const duration = config.durationFrames ?? 8;
  const endFrame = triggerFrame + duration;

  if (absoluteFrame < triggerFrame || absoluteFrame > endFrame) return null;

  const progress = interpolate(
    absoluteFrame,
    [triggerFrame, endFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.exp),
    }
  );

  const scale = interpolate(progress, [0, 1], [1, config.zoomTarget ?? 3.5]);
  const blur = interpolate(progress, [0, 1], [0, 20]);
  const opacity = interpolate(progress, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Direction of the zoom
  const dirRad = ((config.directionDeg ?? 0) * Math.PI) / 180;
  const offsetX = Math.cos(dirRad) * progress * 50;
  const offsetY = Math.sin(dirRad) * progress * 50;

  return (
    <>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
          filter: `blur(${blur}px)`,
          pointerEvents: "none",
          zIndex: 200,
        }}
      />
      {/* Fade to white/black at the end of the whip */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity,
          pointerEvents: "none",
          zIndex: 201,
        }}
      />
    </>
  );
};

// ─── Hard Cut Flash ──────────────────────────────────────────────────────────

const FlashTransition: React.FC<{
  config: TransitionOutConfig;
  absoluteFrame: number;
}> = ({ config, absoluteFrame }) => {
  const triggerFrame = config.triggerFrame;
  const duration = config.flashDurationFrames ?? 4;
  const endFrame = triggerFrame + duration;

  if (absoluteFrame < triggerFrame || absoluteFrame > endFrame) return null;

  const opacity = interpolate(
    absoluteFrame,
    [triggerFrame, triggerFrame + 1, endFrame],
    [0, config.flashOpacity ?? 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: config.flashColor ?? "#FFFFFF",
        opacity,
        pointerEvents: "none",
        zIndex: 200,
      }}
    />
  );
};

// ─── Fade to Black ───────────────────────────────────────────────────────────

const FadeToBlackTransition: React.FC<{
  config: TransitionOutConfig;
  absoluteFrame: number;
}> = ({ config, absoluteFrame }) => {
  const triggerFrame = config.triggerFrame;
  const duration = config.durationFrames ?? 30;
  const endFrame = triggerFrame + duration;

  if (absoluteFrame < triggerFrame) return null;

  const opacity = interpolate(
    absoluteFrame,
    [triggerFrame, endFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity,
        pointerEvents: "none",
        zIndex: 200,
      }}
    />
  );
};
