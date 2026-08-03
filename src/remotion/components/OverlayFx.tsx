import React from "react";
import { AbsoluteFill } from "remotion";
import type { OverlayFxConfig } from "../types";

interface OverlayFxProps {
  config: OverlayFxConfig;
}

/**
 * Atmospheric overlay for effects like rising smoke, rain, dust, ember sparks.
 *
 * Implements contrast crushing, black lifting, and radial edge feathering so
 * particle and smoke loops dissipate seamlessly into backgrounds without hard rectangular cutoffs.
 */
export const OverlayFx: React.FC<OverlayFxProps> = ({ config }) => {
  const overlayStyle = getOverlayStyle(config);

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: config.blendMode as React.CSSProperties["mixBlendMode"],
        opacity: config.opacity,
        maskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 100%)",
        filter: "contrast(1.3) brightness(1.1)",
        pointerEvents: "none",
        zIndex: 2,
        ...overlayStyle,
      }}
    />
  );
};

/**
 * Generates CSS-based atmospheric effects as placeholders
 * until actual video assets are available.
 */
function getOverlayStyle(
  config: OverlayFxConfig
): React.CSSProperties {
  switch (config.type) {
    case "rising_smoke":
      return {
        background: `
          radial-gradient(ellipse at 30% 90%, rgba(200,200,200,0.18) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 85%, rgba(180,180,180,0.14) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 95%, rgba(160,160,160,0.16) 0%, transparent 55%)
        `,
      };
    case "dust_particles":
      return {
        background: `
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06) 0%, transparent 3%),
          radial-gradient(circle at 60% 15%, rgba(255,255,255,0.05) 0%, transparent 2%),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.07) 0%, transparent 4%),
          radial-gradient(circle at 35% 55%, rgba(255,255,255,0.04) 0%, transparent 2%),
          radial-gradient(circle at 90% 40%, rgba(255,255,255,0.06) 0%, transparent 3%)
        `,
      };
    case "light_flares":
      return {
        background: `
          radial-gradient(ellipse at 70% 20%, rgba(255,200,100,0.12) 0%, transparent 40%),
          radial-gradient(ellipse at 30% 60%, rgba(255,180,80,0.08) 0%, transparent 35%)
        `,
      };
    case "ember_sparks":
      return {
        background: `
          radial-gradient(circle at 45% 60%, rgba(0,255,100,0.08) 0%, transparent 5%),
          radial-gradient(circle at 25% 30%, rgba(0,200,80,0.06) 0%, transparent 3%),
          radial-gradient(circle at 75% 45%, rgba(0,255,120,0.07) 0%, transparent 4%),
          radial-gradient(circle at 55% 80%, rgba(0,180,60,0.05) 0%, transparent 3%)
        `,
      };
    case "rain_heavy":
      return {
        background: `
          repeating-linear-gradient(
            175deg,
            transparent,
            transparent 8px,
            rgba(180,200,220,0.06) 8px,
            rgba(180,200,220,0.06) 9px
          )
        `,
      };
    case "flickering_light":
      return {
        background: `
          radial-gradient(ellipse at 50% 10%, rgba(255,255,220,0.1) 0%, transparent 50%)
        `,
      };
    default:
      return {};
  }
}
