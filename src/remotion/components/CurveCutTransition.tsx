import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

interface CurveCutTransitionProps {
  /** Scene start frame (absolute) */
  sceneStartFrame: number;
  /** Scene duration in frames */
  durationFrames: number;
  /** Length of the velocity peak transition window in frames (default 6 frames) */
  cutWindowFrames?: number;
  children: React.ReactNode;
}

/**
 * Vox Signature "Cutting the Curve" Velocity-Matched Scene Transition Component.
 *
 * Implements Vox's signature editing trick:
 * 1. Accelerates the outgoing scene to peak velocity using heavy cubic ease-in (Easing.in(Easing.cubic)).
 * 2. Hard cuts exactly at the peak velocity frame (velocity max).
 * 3. Incoming scene inherits matching initial peak velocity and decelerates smoothly (Easing.out(Easing.cubic)).
 */
export const CurveCutTransition: React.FC<CurveCutTransitionProps> = ({
  sceneStartFrame,
  durationFrames,
  cutWindowFrames = 6,
  children,
}) => {
  const frame = useCurrentFrame();

  // Outgoing velocity curve (last cutWindowFrames of scene)
  const isTransitioningOut = frame >= durationFrames - cutWindowFrames;
  
  // Incoming velocity curve (first cutWindowFrames of scene)
  const isTransitioningIn = frame <= cutWindowFrames;

  let velocityX = 0;
  let velocityY = 0;
  let scale = 1;

  if (isTransitioningOut) {
    const outFrame = frame - (durationFrames - cutWindowFrames);
    // Accelerate to peak velocity at scene end
    const outProgress = interpolate(
      outFrame,
      [0, cutWindowFrames],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.bezier(0.7, 0, 0.84, 0)), // Heavy ease-in acceleration
      }
    );

    velocityX = interpolate(outProgress, [0, 1], [0, -160]);
    scale = interpolate(outProgress, [0, 1], [1, 1.08]);
  } else if (isTransitioningIn) {
    // Decelerate from peak matching velocity at scene start
    const inProgress = interpolate(
      frame,
      [0, cutWindowFrames],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.bezier(0.16, 1, 0.3, 1)), // Heavy ease-out deceleration
      }
    );

    velocityX = interpolate(inProgress, [0, 1], [160, 0]);
    scale = interpolate(inProgress, [0, 1], [0.94, 1]);
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${velocityX}px) scale(${scale})`,
        willChange: "transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
