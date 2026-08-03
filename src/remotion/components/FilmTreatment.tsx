import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import type { FilmTreatmentConfig } from "../types";
import type { VideoTheme } from "../utils/themes";

interface FilmTreatmentProps {
  config: FilmTreatmentConfig;
  theme?: VideoTheme;
}

/**
 * The "Texture Sandwich" — cinematic film look overlay.
 * Renders grain, scanlines, vignette, and corner blur on every frame.
 * Dynamically adjusts parameters when a Video Theme is selected.
 */
export const FilmTreatment: React.FC<FilmTreatmentProps> = ({
  config,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grainOpacity = theme ? theme.grainOpacity : config.grainOpacity;
  const hasScanlines = theme ? theme.scanlines : config.scanlines;
  const vignetteAmount = theme ? theme.vignette : config.vignette;

  // Animated grain: change the noise seed at grainFps intervals
  const grainSeed = config.grainAnimated
    ? Math.floor(frame / (fps / config.grainFps))
    : 0;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      {/* Film Grain Layer */}
      <AbsoluteFill
        style={{
          mixBlendMode: config.grainBlendMode as React.CSSProperties["mixBlendMode"],
          opacity: grainOpacity,
          background: generateNoiseGradient(grainSeed),
        }}
      />

      {/* Scanlines Layer */}
      {hasScanlines && (
        <AbsoluteFill
          style={{
            mixBlendMode: config.scanlineBlendMode as React.CSSProperties["mixBlendMode"],
            opacity: config.scanlineOpacity,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${config.scanlineWidth}px,
              rgba(0, 0, 0, 1) ${config.scanlineWidth}px,
              rgba(0, 0, 0, 1) ${config.scanlineWidth * 2}px
            )`,
            backgroundSize: `100% ${config.scanlineWidth * 2}px`,
          }}
        />
      )}

      {/* Vignette Layer */}
      {vignetteAmount > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: config.vignetteBlendMode as React.CSSProperties["mixBlendMode"],
            background: `radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(0, 0, 0, ${vignetteAmount}) 100%
            )`,
          }}
        />
      )}

      {/* Corner Blur Layer */}
      {config.cornerBlur && (
        <AbsoluteFill
          style={{
            boxShadow: `inset 0 0 ${config.cornerBlurSpread}px ${config.cornerBlurRadius}px rgba(0, 0, 0, 0.3)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Generates a pseudo-random noise gradient using CSS radial gradients.
 * Each seed produces a visually distinct noise pattern, creating the
 * animated grain effect when the seed changes at grainFps intervals.
 */
function generateNoiseGradient(seed: number): string {
  const layers: string[] = [];
  const count = 6;

  for (let i = 0; i < count; i++) {
    const x = Math.floor(random(`grain-x-${seed}-${i}`) * 100);
    const y = Math.floor(random(`grain-y-${seed}-${i}`) * 100);
    const size = 20 + Math.floor(random(`grain-s-${seed}-${i}`) * 40);
    const alpha = 0.03 + random(`grain-a-${seed}-${i}`) * 0.08;

    layers.push(
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${alpha}) 0%, transparent ${size}%)`
    );
  }

  return layers.join(", ");
}
