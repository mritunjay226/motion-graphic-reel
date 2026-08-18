import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { TransitionOutConfig } from "../types";
import { TornPaper } from "./TornPaper";
import { TvPowerOff } from "@/components/remocn/tv-power-off";

interface TransitionEffectProps {
  config: TransitionOutConfig;
  /** Scene start frame (absolute) */
  sceneStartFrame: number;
}

/**
 * Renders satisfying scene transition-out effects at exact frame numbers.
 *
 * Supported types:
 * - whip_zoom_motion_blur: Rapid scale + directional blur
 * - hard_cut_flash: White flash overlay
 * - fade_to_black: Smooth opacity to black
 * - paper_rip_wipe: Satisfying procedural torn paper edge wipe across frame
 * - camera_shutter_snap: 2-panel shutter snap with flash shutter click
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
    case "tv_power_off":
      return (
        <TvPowerOffTransition
          config={config}
          absoluteFrame={absoluteFrame}
        />
      );
    default:
      // Fallback to satisfying torn paper rip wipe for smooth scene transition
      return (
        <PaperRipWipeTransition
          config={config}
          absoluteFrame={absoluteFrame}
        />
      );
  }
};

// ─── Satisfying Procedural Torn Paper Rip Wipe ────────────────────────────────

const PaperRipWipeTransition: React.FC<{
  config: TransitionOutConfig;
  absoluteFrame: number;
}> = ({ config, absoluteFrame }) => {
  const triggerFrame = config.triggerFrame;
  const duration = config.durationFrames ?? 12;
  const endFrame = triggerFrame + duration;

  if (absoluteFrame < triggerFrame || absoluteFrame > endFrame) return null;

  const progress = interpolate(
    absoluteFrame,
    [triggerFrame, endFrame],
    [-100, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 200,
        overflow: "hidden",
      }}
    >
      <TornPaper
        borderWidth={6}
        borderColor="#FFFFFF"
        tornScale={16}
        tornFrequency={0.05}
        shadow={true}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: `translateX(${progress}%)`,
          background: "#FAFAFA",
        }}
      >
        <div style={{ width: "100%", height: "100%", background: "#FAFAFA" }} />
      </TornPaper>
    </AbsoluteFill>
  );
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
  const fadeOpacity = interpolate(progress, [0, 0.3, 1], [1, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blackOpacity = interpolate(progress, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dirRad = ((config.directionDeg ?? 0) * Math.PI) / 180;
  const offsetX = Math.cos(dirRad) * progress * 50;
  const offsetY = Math.sin(dirRad) * progress * 50;

  return (
    <>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
          opacity: fadeOpacity,
          pointerEvents: "none",
          zIndex: 200,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
          opacity: blackOpacity,
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

// ─── CRT TV Power Off ─────────────────────────────────────────────────────────

const TvPowerOffTransition: React.FC<{
  config: TransitionOutConfig;
  absoluteFrame: number;
}> = ({ config, absoluteFrame }) => {
  const triggerFrame = config.triggerFrame;
  const duration = config.durationFrames ?? 18;

  if (absoluteFrame < triggerFrame) return null;

  return (
    <AbsoluteFill style={{ zIndex: 220, pointerEvents: "none" }}>
      <TvPowerOff delay={0} durationInFrames={duration}>
        <AbsoluteFill style={{ background: "transparent" }} />
      </TvPowerOff>
    </AbsoluteFill>
  );
};
