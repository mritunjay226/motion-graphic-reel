import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export interface SpotlightOverlayProps {
  /** Frame when spotlight smoothly activates (defaults to beat 3 evidence reveal ~frame 35) */
  startFrame?: number;
  /** Duration in frames for smooth fade-in (default 18 frames) */
  transitionFrames?: number;
  /** Max dimming opacity for peripheral canvas (default 0.18 = 18%) */
  maxDimOpacity?: number;
  /** Focal center X position as percentage string or px (default "50%") */
  centerX?: string;
  /** Focal center Y position as percentage string or px (default "45%") */
  centerY?: string;
  /** Inner radius where canvas remains 100% lit (default "30%") */
  innerRadius?: string;
  /** Outer radius where dimming reaches max opacity (default "78%") */
  outerRadius?: string;
  /** Accent spotlight color (default deep charcoal / ambient vignette) */
  dimColor?: string;
}

/**
 * Selective Focus Spotlight Mask.
 *
 * Smoothly darkens the non-active peripheral canvas by 15-20% when secondary
 * infographic evidence or memos appear, directing 100% of viewer attention to the focal asset.
 */
export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({
  startFrame = 35,
  transitionFrames = 18,
  maxDimOpacity = 0.18,
  centerX = "50%",
  centerY = "45%",
  innerRadius = "30%",
  outerRadius = "78%",
  dimColor = "rgba(10, 12, 18, 1)",
}) => {
  const frame = useCurrentFrame();

  // Smooth ease-in fade for the spotlight mask
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + transitionFrames],
    [0, maxDimOpacity],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  if (opacity <= 0.001) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 40,
        opacity,
        background: `radial-gradient(ellipse at ${centerX} ${centerY}, transparent ${innerRadius}, ${dimColor} ${outerRadius})`,
        mixBlendMode: "multiply",
        willChange: "opacity",
      }}
    />
  );
};
