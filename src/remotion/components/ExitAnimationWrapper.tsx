"use client";

import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";

export type ExitAnimationType =
  | "shrink_out"
  | "slide_left"
  | "paper_tear_out"
  | "fade_scale";

interface ExitAnimationWrapperProps {
  startFrameOffset: number;
  durationFrames: number;
  exitAnimation?: ExitAnimationType;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Handles element entrance, active floating lifecycle, and clean exit animations.
 * When element's allocated duration expires, it cleanly exits the frame, leaving room
 * for incoming components.
 */
export const ExitAnimationWrapper: React.FC<ExitAnimationWrapperProps> = ({
  startFrameOffset,
  durationFrames,
  exitAnimation = "fade_scale",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrameOffset;

  // Don't render before entrance frame or after exit animation completes
  const exitWindow = 12; // 12 frames for exit transition
  if (localFrame < 0 || localFrame > durationFrames + exitWindow) {
    return null;
  }

  // 1. Entrance Spring Progress (first 15 frames)
  const entranceProgress = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
  });

  const entranceOpacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  let entranceScale = interpolate(entranceProgress, [0, 1], [0.85, 1]);
  let entranceY = interpolate(entranceProgress, [0, 1], [40, 0]);

  // 2. Exit Progress (last exitWindow frames)
  const exitLocalFrame = Math.max(0, localFrame - durationFrames);
  const isExiting = localFrame > durationFrames;

  let exitOpacity = 1;
  let exitScale = 1;
  let exitX = 0;
  let exitY = 0;
  let exitRotation = 0;

  if (isExiting) {
    const exitProgress = interpolate(exitLocalFrame, [0, exitWindow], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

    switch (exitAnimation) {
      case "shrink_out":
        exitScale = interpolate(exitProgress, [0, 1], [1, 0.4]);
        break;

      case "slide_left":
        exitX = interpolate(exitProgress, [0, 1], [0, -180]);
        exitRotation = interpolate(exitProgress, [0, 1], [0, -12]);
        break;

      case "paper_tear_out":
        exitY = interpolate(exitProgress, [0, 1], [0, 160]);
        exitRotation = interpolate(exitProgress, [0, 1], [0, 15]);
        exitScale = interpolate(exitProgress, [0, 1], [1, 0.8]);
        break;

      case "fade_scale":
      default:
        exitScale = interpolate(exitProgress, [0, 1], [1, 1.15]);
        break;
    }
  }

  const combinedOpacity = entranceOpacity * exitOpacity;
  const combinedScale = entranceScale * exitScale;
  const combinedX = exitX;
  const combinedY = entranceY + exitY;

  return (
    <div
      style={{
        opacity: combinedOpacity,
        transform: `translate(${combinedX}px, ${combinedY}px) rotate(${exitRotation}deg) scale(${combinedScale})`,
        transformOrigin: "center center",
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
