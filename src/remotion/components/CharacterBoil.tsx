import React from "react";
import { useCurrentFrame } from "remotion";
import type { BoilConfig } from "../types";

interface CharacterBoilProps {
  /** Boil configuration with rotation and scale oscillation params */
  config: BoilConfig;
  children: React.ReactNode;
}

/**
 * Wraps any child element with micro-oscillation to make still images feel alive.
 * Applies sinusoidal rotation and scale oscillations — the "character boil" effect.
 *
 * This creates the subtle living/breathing motion that distinguishes 2.5D
 * motion graphics from static slideshows.
 */
export const CharacterBoil: React.FC<CharacterBoilProps> = ({
  config,
  children,
}) => {
  const frame = useCurrentFrame();

  const { rotationOscillation, scaleOscillation } = config;

  // Rotation: oscillate between minDeg and maxDeg
  const rotationAmplitude =
    (rotationOscillation.maxDeg - rotationOscillation.minDeg) / 2;
  const rotationCenter =
    (rotationOscillation.maxDeg + rotationOscillation.minDeg) / 2;
  const rotation =
    rotationCenter +
    rotationAmplitude *
    Math.sin((frame / rotationOscillation.periodFrames) * Math.PI * 2);

  // Scale: oscillate between minScale and maxScale
  const scaleAmplitude =
    (scaleOscillation.maxScale - scaleOscillation.minScale) / 2;
  const scaleCenter =
    (scaleOscillation.maxScale + scaleOscillation.minScale) / 2;
  const scale =
    scaleCenter +
    scaleAmplitude *
    Math.sin((frame / scaleOscillation.periodFrames) * Math.PI * 2);

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        willChange: "transform",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};
