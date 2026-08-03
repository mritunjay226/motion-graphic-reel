import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import type { PropAnimationConfig } from "../types";
import { ImageKitAsset } from "./ImageKitAsset";
import { resolveEasing } from "./ParallaxLayer";

interface PropAnimatorProps {
  propUrl: string;
  config: PropAnimationConfig;
  sceneStartFrame: number;
}

/**
 * Drives animation for contextual prop overlays (floating money, stamps, documents, light streaks).
 * Implements named motion strategies with frame-accurate interpolations and physics.
 */
export const PropAnimator: React.FC<PropAnimatorProps> = ({
  propUrl,
  config,
  sceneStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = frame + sceneStartFrame;
  const localFrame = absoluteFrame - config.startFrame;

  if (localFrame < 0) {
    return null;
  }

  // Evaluate opacity
  let opacity = config.opacity !== undefined ? evaluateVal(config.opacity, absoluteFrame) : 1;

  // Evaluate scale
  let scale = config.scale ? evaluateVal(config.scale, absoluteFrame) : 1;

  // Evaluate translate X & Y
  let translateX = config.translateX ? evaluateVal(config.translateX, absoluteFrame) : 0;
  let translateY = config.translateY ? evaluateVal(config.translateY, absoluteFrame) : 0;

  // Rotation
  let rotation = 0;
  if (config.rotationPerFrame) {
    rotation = localFrame * config.rotationPerFrame;
  }

  // Spring physics for slam / roll / pop motions
  if (config.springConfig) {
    const springVal = spring({
      frame: localFrame,
      fps,
      config: {
        damping: config.springConfig.damping,
        stiffness: config.springConfig.stiffness,
        mass: config.springConfig.mass ?? 1,
      },
    });

    if (config.motion === "slam_in_from_top") {
      const fromY = config.fromTranslateY ?? -400;
      const toY = config.toTranslateY ?? 0;
      translateY = interpolate(springVal, [0, 1], [fromY, toY]);
    } else if (config.motion === "slam_rotate_in") {
      const fromRot = config.fromRotation ?? 45;
      const toRot = config.toRotation ?? 0;
      const fromS = config.fromScale ?? 3;
      const toS = config.toScale ?? 1;
      rotation = interpolate(springVal, [0, 1], [fromRot, toRot]);
      scale = interpolate(springVal, [0, 1], [fromS, toS]);
    } else if (config.motion === "slam_stamp_in") {
      const fromS = config.fromScale ?? 5;
      const toS = config.toScale ?? 1;
      const fromOp = config.fromOpacity ?? 0;
      const toOp = config.toOpacity ?? 1;
      scale = interpolate(springVal, [0, 1], [fromS, toS]);
      opacity = interpolate(springVal, [0, 1], [fromOp, toOp]);
    } else if (config.motion === "counter_roll_in") {
      const fromY = config.fromTranslateY ?? 300;
      const toY = config.toTranslateY ?? 0;
      translateY = interpolate(springVal, [0, 1], [fromY, toY]);
      opacity = interpolate(springVal, [0, 1], [0, 1]);
    } else if (config.motion === "float_orbit") {
      scale = springVal;
    }
  }

  // Custom motion specific behaviors
  if (config.motion === "float_orbit") {
    const radius = config.orbitRadius ?? 30;
    const speed = config.orbitSpeed ?? 0.03;
    translateX += Math.cos(localFrame * speed) * radius;
    translateY += Math.sin(localFrame * speed * 0.8) * (radius * 0.5);
  } else if (config.motion === "scatter_fall" || config.motion === "explosion_scatter") {
    const gravity = config.gravity ?? 0.2;
    translateY += 0.5 * gravity * localFrame * localFrame;
    if (config.velocityRange) {
      translateX += localFrame * config.velocityRange.x[0];
    }
    if (config.rotationRange) {
      rotation += (localFrame * (config.rotationRange[1] - config.rotationRange[0])) / 100;
    }
  }

  const blendMode = (config.blendMode ?? "normal") as React.CSSProperties["mixBlendMode"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        mixBlendMode: blendMode,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div style={{ width: "80%", height: "80%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ImageKitAsset src={propUrl} objectFit="contain" />
      </div>
    </div>
  );
};

/** Helper to evaluate number or InterpolationRange */
function evaluateVal(val: number | { inputRange: number[]; outputRange: number[]; easing?: string }, absoluteFrame: number): number {
  if (typeof val === "number") return val;
  return interpolate(absoluteFrame, val.inputRange, val.outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: resolveEasing(val.easing),
  });
}
