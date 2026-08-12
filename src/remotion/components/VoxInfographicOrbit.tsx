import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface VoxInfographicOrbitProps {
  color?: string;
}

/**
 * Vox Signature Infographic Node Orbit Ring.
 * Renders an elliptical orbit ring with 6 glowing neon green node dots
 * revolving around the subject cutout (matching the exact Vox design language).
 */
export const VoxInfographicOrbit: React.FC<VoxInfographicOrbitProps> = ({
  color = "#B5F500",
}) => {
  const frame = useCurrentFrame();

  // Slow continuous rotation of the orbit system
  const orbitRotation = (frame * 0.4) % 360;

  const nodeCount = 6;
  const nodes = Array.from({ length: nodeCount });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 15,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "480px",
          height: "220px",
          borderRadius: "50%",
          border: `2px solid ${color}`,
          boxShadow: `0 0 18px ${color}AA, inset 0 0 14px ${color}60`,
          transform: `translateY(60px) rotateX(68deg) rotateZ(${orbitRotation}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Orbiting Neon Nodes */}
        {nodes.map((_, i) => {
          const angle = (i * (360 / nodeCount) * Math.PI) / 180;
          const rx = 240;
          const ry = 110;
          const x = rx + rx * Math.cos(angle) - 14;
          const y = ry + ry * Math.sin(angle) - 14;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: color,
                boxShadow: `0 0 16px ${color}, 0 0 30px ${color}`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
