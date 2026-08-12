import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import type { EntranceConfig } from "../types";

interface SpringEntranceProps {
  /** Entrance animation configuration */
  config: EntranceConfig;
  /** Scene start frame (absolute) */
  sceneStartFrame: number;
  children: React.ReactNode;
}

/**
 * Generic spring-animated entrance wrapper.
 *
 * Supports multiple entrance types:
 * - spring_scale_up / scale_up_with_glow
 * - slide_up_with_spring
 * - slam_in_from_right
 * - fade_in_with_scale
 * - drop_from_top_with_swing
 */
export const SpringEntrance: React.FC<SpringEntranceProps> = ({
  config,
  sceneStartFrame,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = frame + sceneStartFrame;

  // Don't animate before trigger
  const localFrame = absoluteFrame - config.triggerFrame;
  if (localFrame < 0) {
    return (
      <div style={{ opacity: 0, width: "100%", height: "100%" }}>
        {children}
      </div>
    );
  }

  // Spring progress (0 → 1)
  const springProgress = spring({
    frame: localFrame,
    fps,
    config: {
      damping: config.springConfig.damping,
      stiffness: config.springConfig.stiffness,
      mass: config.springConfig.mass ?? 1,
    },
  });

  // Compute transform values based on entrance type
  const transforms = computeEntranceTransform(config, springProgress, localFrame);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: transforms.transform,
        opacity: transforms.opacity,
        willChange: "transform, opacity",
        ...(transforms.extraStyles || {}),
      }}
    >
      {children}
    </div>
  );
};

function computeEntranceTransform(
  config: EntranceConfig,
  progress: number,
  localFrame: number
): {
  transform: string;
  opacity: number;
  extraStyles?: React.CSSProperties;
} {
  const fromScale = config.fromScale ?? 0;
  const toScale = config.toScale ?? 1;
  const fromTX = config.fromTranslateX ?? 0;
  const toTX = config.toTranslateX ?? 0;
  const fromTY = config.fromTranslateY ?? 0;
  const toTY = config.toTranslateY ?? 0;
  const fromOpacity = config.fromOpacity ?? 1;
  const toOpacity = config.toOpacity ?? 1;

  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
  const translateX = interpolate(progress, [0, 1], [fromTX, toTX]);
  const translateY = interpolate(progress, [0, 1], [fromTY, toTY]);
  const opacity = interpolate(progress, [0, 1], [fromOpacity, toOpacity]);

  let extraTransform = "";
  const extraStyles: React.CSSProperties = {};

  // Swing effect for drop_from_top_with_swing
  if (config.type === "drop_from_top_with_swing" && config.swingAmplitude) {
    const decayFrames = config.swingDecayFrames ?? 40;
    const decay = Math.max(0, 1 - localFrame / decayFrames);
    const swing =
      Math.sin(localFrame * 0.3) * config.swingAmplitude * decay;
    extraTransform = ` rotate(${swing}deg)`;
  }

  // Glow effect for scale_up_with_glow
  if (config.type === "scale_up_with_glow" && config.glowColor) {
    const glowSize = config.glowExpand
      ? interpolate(
          progress,
          [0, 1],
          [
            config.glowExpand.outputRange[0],
            config.glowExpand.outputRange[1],
          ]
        )
      : 0;
    extraStyles.filter = `drop-shadow(0 0 ${glowSize}px ${config.glowColor})`;
  }

  return {
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})${extraTransform}`,
    opacity,
    extraStyles,
  };
}
