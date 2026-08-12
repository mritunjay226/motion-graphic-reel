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
 * Implements named motion strategies including Vox-style staggered flying documents & finger wagging.
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
      const toRot = config.toRotation ?? -12;
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
  } else if (config.motion === "finger_wag") {
    // Signature "no-no-no" finger wagging oscillation
    rotation += Math.sin(localFrame * 0.45) * 16;
  } else if (config.motion === "staggered_fly_in") {
    // Staggered flying newspapers / documents
    const staggerOffset = config.propIndex * 6; // 6 frames delay per prop
    const staggerFrame = Math.max(0, localFrame - staggerOffset);
    const flyProgress = interpolate(staggerFrame, [0, 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    scale = flyProgress;
    rotation += (1 - flyProgress) * 45;
  }

  const blendMode = (config.blendMode ?? "normal") as React.CSSProperties["mixBlendMode"];

  // Non-blocking layout styles based on prop index & motion strategy
  const propContainerStyle = getOptimizedPropContainerStyle(config, config.propIndex);

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        mixBlendMode: blendMode,
        pointerEvents: "none",
        zIndex: 50,
        ...propContainerStyle,
      }}
    >
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ImageKitAsset src={propUrl} objectFit="contain" maskType="paper_card" />
      </div>
    </div>
  );
};

/**
 * Computes non-occluding placement for props so they don't cover central subjects.
 */
function getOptimizedPropContainerStyle(
  config: PropAnimationConfig,
  propIndex: number
): React.CSSProperties {
  // If custom position coordinates exist, use them
  if (config.position) {
    const pos = config.position as Record<string, any>;
    return {
      top: pos.top ?? "auto",
      bottom: pos.bottom ?? "auto",
      left: pos.left ?? (pos.centerX ? "50%" : "auto"),
      right: pos.right ?? "auto",
      transform: pos.centerX ? "translateX(-50%)" : "none",
      width: pos.width ?? "60%",
      height: pos.height ?? "30%",
    };
  }

  // Finger wagging icon (bottom right corner)
  if (config.motion === "finger_wag") {
    return {
      bottom: "20%",
      right: "12%",
      width: "25%",
      height: "25%",
    };
  }

  // Stamp / Headline text props (upper third of frame)
  if (
    config.motion === "slam_stamp_in" ||
    config.motion === "slam_rotate_in" ||
    config.motion === "counter_roll_in" ||
    config.motion === "slam_in_from_top"
  ) {
    return {
      top: "18%",
      left: "10%",
      width: "80%",
      height: "28%",
    };
  }

  // Floating accent items (upper right or left side)
  if (config.motion === "float_orbit" || config.motion === "gentle_float") {
    return {
      top: "22%",
      right: "8%",
      width: "38%",
      height: "28%",
    };
  }

  // Full ambient sweeps or falling particles
  if (
    config.motion === "diagonal_sweep" ||
    config.motion === "constant_rise" ||
    config.motion === "continuous_fall" ||
    config.motion === "creep_upward" ||
    config.motion === "pulse_fade" ||
    config.motion === "staggered_fly_in"
  ) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
    };
  }

  // Fallback layout based on propIndex
  if (propIndex === 0) {
    return { top: "15%", left: "10%", width: "80%", height: "30%" };
  } else if (propIndex === 1) {
    return { top: "25%", right: "5%", width: "40%", height: "30%" };
  }

  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };
}

/** Helper to evaluate number or InterpolationRange */
function evaluateVal(
  val: number | { inputRange: number[]; outputRange: number[]; easing?: string },
  absoluteFrame: number
): number {
  if (typeof val === "number") return val;
  return interpolate(absoluteFrame, val.inputRange, val.outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: resolveEasing(val.easing),
  });
}
