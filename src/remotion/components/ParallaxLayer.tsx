import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";

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

type EntranceType =
  | "fade_scale"
  | "slide_up"
  | "slide_down"
  | "slide_left"
  | "slide_right"
  | "slide_corner_top_left"
  | "slide_corner_top_right"
  | "slide_corner_bottom_left"
  | "slide_corner_bottom_right"
  | "slide_smooth_ease"
  | "pop_in"
  | "none";

interface AnimatedLayerProps {
  /** Entrance animation type */
  entrance?: EntranceType;
  /** Frame offset within scene to start the entrance */
  enterAtFrame?: number;
  /** Spring damping for entrance */
  damping?: number;
  /** Spring stiffness for entrance */
  stiffness?: number;
  /** Continuous slow zoom drift (1 = no zoom) */
  zoomDrift?: { from: number; to: number };
  /** Continuous slow pan drift in px */
  panDrift?: { x?: number; y?: number };
  /** Absolute positioning overrides */
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
    height?: string;
  };
  /** z-index */
  zIndex?: number;
  /** Scene start frame for absolute timing */
  sceneStartFrame: number;
  /** Scene duration frames for drift calculation */
  sceneDurationFrames: number;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Universal animated layer wrapper for Vox Reel elements.
 *
 * Supports Vox signature corner slide entrances, cubic-bezier ease-in-out curves,
 * and rotation settling for maximum visual satisfaction.
 */
export const AnimatedLayer: React.FC<AnimatedLayerProps> = ({
  entrance = "fade_scale",
  enterAtFrame = 0,
  damping = 12,
  stiffness = 100,
  zoomDrift,
  panDrift,
  position,
  zIndex = 10,
  sceneStartFrame,
  sceneDurationFrames,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceLocalFrame = frame - enterAtFrame;

  if (entranceLocalFrame < 0) {
    return null;
  }

  const springVal = spring({
    frame: entranceLocalFrame,
    fps,
    config: { damping, stiffness, mass: 0.8 },
  });

  const voxEase = interpolate(
    entranceLocalFrame,
    [0, 18],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  let entranceTranslateX = 0;
  let entranceTranslateY = 0;
  let entranceRotation = 0;
  let entranceScale = 1;
  let entranceOpacity = 1;

  switch (entrance) {
    case "fade_scale":
      entranceScale = interpolate(springVal, [0, 1], [0.7, 1]);
      entranceOpacity = interpolate(springVal, [0, 1], [0, 1]);
      break;
    case "slide_up":
      entranceTranslateY = interpolate(springVal, [0, 1], [120, 0]);
      entranceOpacity = interpolate(springVal, [0, 1], [0, 1]);
      break;
    case "slide_down":
      entranceTranslateY = interpolate(springVal, [0, 1], [-120, 0]);
      entranceOpacity = interpolate(springVal, [0, 1], [0, 1]);
      break;
    case "slide_left":
      entranceTranslateX = interpolate(springVal, [0, 1], [200, 0]);
      entranceOpacity = interpolate(springVal, [0, 1], [0, 1]);
      break;
    case "slide_right":
      entranceTranslateX = interpolate(springVal, [0, 1], [-200, 0]);
      entranceOpacity = interpolate(springVal, [0, 1], [0, 1]);
      break;
    case "slide_corner_top_left":
      entranceTranslateX = interpolate(voxEase, [0, 1], [-280, 0]);
      entranceTranslateY = interpolate(voxEase, [0, 1], [-240, 0]);
      entranceRotation = interpolate(voxEase, [0, 1], [-14, 0]);
      entranceOpacity = interpolate(voxEase, [0, 1], [0, 1]);
      break;
    case "slide_corner_top_right":
      entranceTranslateX = interpolate(voxEase, [0, 1], [280, 0]);
      entranceTranslateY = interpolate(voxEase, [0, 1], [-240, 0]);
      entranceRotation = interpolate(voxEase, [0, 1], [14, 0]);
      entranceOpacity = interpolate(voxEase, [0, 1], [0, 1]);
      break;
    case "slide_corner_bottom_left":
      entranceTranslateX = interpolate(voxEase, [0, 1], [-280, 0]);
      entranceTranslateY = interpolate(voxEase, [0, 1], [240, 0]);
      entranceRotation = interpolate(voxEase, [0, 1], [-10, 0]);
      entranceOpacity = interpolate(voxEase, [0, 1], [0, 1]);
      break;
    case "slide_corner_bottom_right":
      entranceTranslateX = interpolate(voxEase, [0, 1], [280, 0]);
      entranceTranslateY = interpolate(voxEase, [0, 1], [240, 0]);
      entranceRotation = interpolate(voxEase, [0, 1], [10, 0]);
      entranceOpacity = interpolate(voxEase, [0, 1], [0, 1]);
      break;
    case "slide_smooth_ease":
      entranceTranslateX = interpolate(voxEase, [0, 1], [-200, 0]);
      entranceScale = interpolate(voxEase, [0, 1], [0.8, 1]);
      entranceOpacity = interpolate(voxEase, [0, 1], [0, 1]);
      break;
    case "pop_in":
      entranceScale = interpolate(springVal, [0, 1], [0, 1]);
      entranceOpacity = interpolate(springVal, [0, 1], [0, 1]);
      break;
    case "none":
      break;
  }

  let driftScale = 1;
  let driftX = 0;
  let driftY = 0;

  if (zoomDrift) {
    driftScale = interpolate(
      frame - sceneStartFrame,
      [0, sceneDurationFrames],
      [zoomDrift.from, zoomDrift.to],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  if (panDrift) {
    driftX = interpolate(
      frame - sceneStartFrame,
      [0, sceneDurationFrames],
      [0, panDrift.x ?? 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    driftY = interpolate(
      frame - sceneStartFrame,
      [0, sceneDurationFrames],
      [0, panDrift.y ?? 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  const totalScale = entranceScale * driftScale;
  const totalX = entranceTranslateX + driftX;
  const totalY = entranceTranslateY + driftY;

  const positionStyles: React.CSSProperties = position
    ? {
        position: "absolute",
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        width: position.width ?? "auto",
        height: position.height ?? "auto",
      }
    : {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };

  return (
    <div
      style={{
        ...positionStyles,
        zIndex,
        transform: `translate(${totalX}px, ${totalY}px) rotate(${entranceRotation}deg) scale(${totalScale})`,
        opacity: entranceOpacity,
        willChange: "transform, opacity",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export { resolveEasing };
