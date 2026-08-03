import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import type { BackgroundMotion } from "../types";

/**
 * Resolves an easing string name to a Remotion Easing function.
 */
function resolveEasing(name?: string) {
  switch (name) {
    case "easeInOutCubic":
      return Easing.inOut(Easing.cubic);
    case "easeOutSine":
      return Easing.out(Easing.sin);
    case "easeInOutQuad":
      return Easing.inOut(Easing.quad);
    case "easeInOutSine":
      return Easing.inOut(Easing.sin);
    case "easeOutCubic":
      return Easing.out(Easing.cubic);
    case "easeInExpo":
      return Easing.in(Easing.exp);
    default:
      return Easing.inOut(Easing.ease);
  }
}

interface ParallaxLayerProps {
  /** URL or path for the background image */
  backgroundUrl: string;
  /** Background motion configuration from execution plan */
  backgroundMotion: BackgroundMotion;
  /** Scene start frame (absolute) — used to compute local frame */
  sceneStartFrame: number;
  /** Scene duration in frames */
  sceneDurationFrames: number;
  /** Theme color grade filter string (e.g. contrast(1.2)...) */
  themeFilter?: string;
  children?: React.ReactNode;
}

/**
 * Applies independent zoom/pan interpolations to background and foreground
 * layers to create a 2.5D depth parallax effect with theme color grading.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  backgroundUrl,
  backgroundMotion,
  sceneStartFrame,
  themeFilter,
  children,
}) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + sceneStartFrame;

  // Background scale
  const bgScale = interpolate(
    absoluteFrame,
    backgroundMotion.scaleInterpolation.inputRange,
    backgroundMotion.scaleInterpolation.outputRange,
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: resolveEasing(backgroundMotion.scaleInterpolation.easing),
    }
  );

  // Background pan X
  const bgPanX = backgroundMotion.panX
    ? interpolate(
        absoluteFrame,
        backgroundMotion.panX.inputRange,
        backgroundMotion.panX.outputRange,
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Background pan Y
  const bgPanY = backgroundMotion.panY
    ? interpolate(
        absoluteFrame,
        backgroundMotion.panY.inputRange,
        backgroundMotion.panY.outputRange,
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  return (
    <AbsoluteFill>
      {/* Background Image with Theme Color Grade */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translate(${bgPanX}px, ${bgPanY}px)`,
          filter: themeFilter || undefined,
          willChange: "transform, filter",
        }}
      >
        <img
          src={backgroundUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback gradient shown behind the image */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(135deg, #0a1628 0%, #1a0a2e 30%, #0d1117 60%, #162447 100%)",
            zIndex: -1,
          }}
        />
      </AbsoluteFill>

      {/* Children (foreground, props, captions) render on top */}
      {children}
    </AbsoluteFill>
  );
};

export { resolveEasing };
