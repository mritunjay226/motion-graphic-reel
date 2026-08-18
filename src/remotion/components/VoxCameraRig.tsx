import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import type { WhisperToken } from "../types";
import type { VoxLayoutType } from "../templates/layouts";

export type CameraFocalPoint = "center" | "left" | "right" | "top" | "bottom" | "left_infographic" | "right_hero";
export type CameraZoomPreset =
  | "smart_choreography"
  | "slow_push_in"
  | "slow_pull_out"
  | "focal_pan_right"
  | "focal_pan_left"
  | "punch_zoom_beat"
  | "static";

export interface VoxCameraRigProps {
  /** Target focus area for camera tracking */
  focalPoint?: CameraFocalPoint;
  /** Presets for continuous camera scale & pan drift */
  zoomPreset?: CameraZoomPreset;
  /** Optional layout type for layout-aware focal coordinate tracking */
  layoutType?: VoxLayoutType | string;
  /** Optional word tokens from Deepgram STT */
  tokens?: WhisperToken[];
  /** Enable subtle documentary camera drift */
  enableHandheldWiggle?: boolean;
  /** Total scene duration frames */
  durationFrames: number;
  /** Children elements inside camera viewport */
  children: React.ReactNode;
  /** Optional container style overrides */
  style?: React.CSSProperties;
}

/**
 * Broadcast-Grade Cinematic Camera Controller Rig.
 *
 * Implements high-impact, visible documentary camera moves:
 * 1. Powerful, visible zoom pushes (1.00x -> 1.15x) and wide pull-outs (1.16x -> 1.00x).
 * 2. Dynamic horizontal motorized slider glides (±65px horizontal tracking).
 * 3. Impact snap zooms on keyframe beats.
 * 4. Pure 2D translation and scale keeping text crisp and rock-solid.
 */
export const VoxCameraRig: React.FC<VoxCameraRigProps> = ({
  focalPoint = "center",
  zoomPreset = "slow_push_in",
  layoutType,
  durationFrames,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeDuration = Math.max(1, durationFrames);

  // ─── 1. RESOLVE DYNAMIC CINEMATIC CAMERA PRESET ─────────────────────────
  let activePreset = zoomPreset;

  if (zoomPreset === "smart_choreography") {
    const normLayout = (layoutType || "").toLowerCase();
    if (normLayout.includes("split_left") || normLayout.includes("dual")) {
      activePreset = "focal_pan_right";
    } else if (normLayout.includes("newspaper") || normLayout.includes("list")) {
      activePreset = "focal_pan_left";
    } else if (normLayout.includes("stat") || normLayout.includes("quote")) {
      activePreset = "punch_zoom_beat";
    } else {
      activePreset = "slow_push_in";
    }
  }

  // ─── 2. CALCULATE HIGH-IMPACT VISIBLE SCALE & PAN ───────────────────────
  let currentScale = 1.0;
  let currentPanX = 0;
  let currentPanY = 0;

  switch (activePreset) {
    case "slow_push_in": {
      // Powerful, cinematic push-in into the subject (1.00x -> 1.15x)
      currentScale = interpolate(frame, [0, safeDuration], [1.0, 1.15], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      currentPanY = interpolate(frame, [0, safeDuration], [0, -24], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }

    case "slow_pull_out": {
      // Dynamic wide reveal pull-out (1.16x -> 1.00x)
      currentScale = interpolate(frame, [0, safeDuration], [1.16, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      currentPanY = interpolate(frame, [0, safeDuration], [-24, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }

    case "focal_pan_right": {
      // Visible motorized slider tracking left-to-right (65px -> -65px)
      currentScale = interpolate(frame, [0, safeDuration], [1.02, 1.10], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      currentPanX = interpolate(frame, [0, safeDuration], [65, -65], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      break;
    }

    case "focal_pan_left": {
      // Visible motorized slider tracking right-to-left (-65px -> 65px)
      currentScale = interpolate(frame, [0, safeDuration], [1.02, 1.10], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      currentPanX = interpolate(frame, [0, safeDuration], [-65, 65], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      break;
    }

    case "punch_zoom_beat": {
      // Snappy Beat 1 impact punch with continuous push
      const punchSpring = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 220, mass: 0.45 },
      });
      const punchSnap = interpolate(punchSpring, [0, 1], [1.0, 1.18]);
      const slowDrift = interpolate(frame, [0, safeDuration], [0, 0.04], {
        extrapolateRight: "clamp",
      });
      currentScale = punchSnap + slowDrift;
      break;
    }

    case "static":
    default: {
      currentScale = 1.0;
      break;
    }
  }

  // ─── 3. FOCAL POINT OFFSET ──────────────────────────────────────────────
  let focalOffsetX = 0;
  let focalOffsetY = 0;

  switch (focalPoint) {
    case "right":
    case "right_hero":
      focalOffsetX = -35;
      break;
    case "left":
    case "left_infographic":
      focalOffsetX = 35;
      break;
    case "top":
      focalOffsetY = 20;
      break;
    case "bottom":
      focalOffsetY = -20;
      break;
    case "center":
    default:
      focalOffsetX = 0;
      focalOffsetY = 0;
      break;
  }

  const finalScale = currentScale;
  const finalPanX = currentPanX + focalOffsetX;
  const finalPanY = currentPanY + focalOffsetY;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        transform: `scale(${finalScale}) translate(${finalPanX}px, ${finalPanY}px)`,
        transformOrigin: "center center",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
