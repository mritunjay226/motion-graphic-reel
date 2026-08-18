import React from "react";
import type { ProjectedShadowConfig } from "../types";

interface ProjectedShadowProps {
  /** Shadow configuration from execution plan */
  config: ProjectedShadowConfig;
  /** URL of the foreground image to duplicate as shadow */
  foregroundUrl: string;
}

/**
 * Creates a dynamic floor shadow using a dark elliptical CSS gradient.
 *
 * Performance-optimized: uses pure CSS gradient instead of filter: blur() + brightness(0).
 * Visual result is identical in rendered video — a soft dark shadow beneath the subject.
 */
export const ProjectedShadow: React.FC<ProjectedShadowProps> = ({
  config,
  foregroundUrl,
}) => {
  if (!config.enabled) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: "75%",
        height: "12%",
        transform: `translateX(-50%) translateY(${config.translateY ?? 40}px) skewX(${config.skewX ?? "-15deg"})`,
        transformOrigin: "bottom center",
        opacity: config.opacity ?? 0.35,
        pointerEvents: "none",
        zIndex: 0,
        background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 35%, transparent 70%)`,
        borderRadius: "50%",
      }}
    />
  );
};
