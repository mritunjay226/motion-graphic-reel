import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export type FocusTargetPlane = "subject" | "background" | "foreground" | "all_sharp";

export interface RackFocusLayerProps {
  /** Target plane to keep in sharp focus */
  focusPlane?: FocusTargetPlane;
  /** Total scene duration in frames */
  durationFrames: number;
  /** Frames to complete the focus pull (default: 12) */
  transitionFrames?: number;
  /** Max blur radius in pixels for out-of-focus plane (default: 6) */
  maxBlur?: number;
  /** Dimming factor on out-of-focus background (0.90 to 1.0, default: 0.94) */
  dimFactor?: number;
  /** Frame at which focus pull begins (default: 0 for scene entrance) */
  triggerAtFrame?: number;
  /** Simulate subtle physical lens breathing during focus pull (default: true) */
  lensBreathing?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Optical Rack Focus & Depth-of-Field Engine for Documentary Motion Graphics.
 *
 * Simulates a cinema prime lens pulling focus between layers with:
 * 1. Smooth Gaussian optical blur falloff.
 * 2. Subtle optical lens breathing (1.012x -> 1.00x scale shift).
 * 3. Photometric brightness falloff on de-emphasized background planes.
 */
export const RackFocusLayer: React.FC<RackFocusLayerProps> = ({
  focusPlane = "subject",
  durationFrames,
  transitionFrames = 12,
  maxBlur = 6,
  dimFactor = 0.94,
  triggerAtFrame = 0,
  lensBreathing = true,
  children,
  style,
}) => {
  const frame = useCurrentFrame();

  if (focusPlane === "all_sharp") {
    return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
  }

  // Smooth focus pull progress from 0 (entrance state) to 1 (target focus settled)
  const localFrame = Math.max(0, frame - triggerAtFrame);
  const focusProgress = interpolate(
    localFrame,
    [0, Math.max(1, transitionFrames)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  // When focusing on subject, background begins slightly blurred and sharpens, or vice-versa
  let currentBlur = 0;
  let currentBrightness = 1.0;
  let breathingScale = 1.0;

  switch (focusPlane) {
    case "subject": {
      // Focus settles sharply on foreground subject while background softens
      currentBlur = interpolate(focusProgress, [0, 1], [maxBlur * 0.4, 0]);
      currentBrightness = interpolate(focusProgress, [0, 1], [dimFactor, 1.0]);
      if (lensBreathing) {
        breathingScale = interpolate(focusProgress, [0, 1], [1.012, 1.0], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
      }
      break;
    }

    case "background": {
      // Focus shifts backward to wide background context
      currentBlur = interpolate(focusProgress, [0, 1], [0, maxBlur]);
      currentBrightness = interpolate(focusProgress, [0, 1], [1.0, dimFactor]);
      if (lensBreathing) {
        breathingScale = interpolate(focusProgress, [0, 1], [1.0, 1.008]);
      }
      break;
    }

    case "foreground": {
      // Foreground remains crisp
      currentBlur = 0;
      currentBrightness = 1.0;
      break;
    }

    default:
      break;
  }

  return (
    <AbsoluteFill
      style={{
        filter: currentBlur > 0.1 ? `blur(${currentBlur.toFixed(2)}px) brightness(${currentBrightness.toFixed(3)})` : undefined,
        transform: breathingScale !== 1.0 ? `scale(${breathingScale.toFixed(4)})` : undefined,
        transformOrigin: "center center",
        willChange: "filter, transform",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
