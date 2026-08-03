import React from "react";
import type { ProjectedShadowConfig } from "../types";

interface ProjectedShadowProps {
  /** Shadow configuration from execution plan */
  config: ProjectedShadowConfig;
  /** URL of the foreground image to duplicate as shadow */
  foregroundUrl: string;
}

/**
 * Creates a dynamic floor shadow by duplicating the foreground asset,
 * applying CSS skew + translate, and projecting it beneath the subject.
 *
 * The shadow is rendered as a black-tinted, blurred clone of the foreground
 * to create the illusion of a subject standing on a surface.
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
        width: "80%",
        height: "60%",
        transform: `translateX(-50%) skewX(${config.skewX ?? "-35deg"}) translateY(${config.translateY ?? 40}px)`,
        transformOrigin: "bottom center",
        opacity: config.opacity ?? 0.35,
        filter: `blur(${config.blur ?? 8}px) brightness(0)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <img
        src={foregroundUrl}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "bottom center",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
};
