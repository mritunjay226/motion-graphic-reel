import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";

export interface MagnifierSpotlightLensProps {
  /** Diameter of the magnifier lens in pixels */
  diameter?: number;
  /** Primary rim border color (e.g. #FFE600 or #FFFFFF) */
  color?: string;
  /** Start frame */
  enterAtFrame?: number;
  /** Sweep motion across coordinates [startX, endX, startY, endY] */
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
  /** Duration of sweep motion */
  sweepDurationFrames?: number;
  /** Optional badge label tag (e.g. "FORENSIC ZOOM 3.2X" or "SECRET CLAUSE") */
  label?: string;
  /** Children element to show magnified inside the lens */
  children?: React.ReactNode;
  /** Additional container styling */
  style?: React.CSSProperties;
}

/**
 * 2.5D Interactive Forensic Magnifier Spotlight Loupe (Vox / Investigative Reel Style).
 */
export const MagnifierSpotlightLens: React.FC<MagnifierSpotlightLensProps> = ({
  diameter = 220,
  color = "#FFE600",
  enterAtFrame = 4,
  startX = 0,
  endX = 80,
  startY = 0,
  endY = 40,
  sweepDurationFrames = 35,
  label = "EVIDENCE ZOOM // 3.2X",
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterAtFrame);
  if (localFrame < 0) return null;

  // Pop-in spring
  const lensSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 140 },
  });

  // Sweep coordinates
  const currentX = interpolate(localFrame, [0, sweepDurationFrames], [startX, endX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const currentY = interpolate(localFrame, [0, sweepDurationFrames], [startY, endY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        width: `${diameter}px`,
        height: `${diameter}px`,
        transform: `translate(${currentX}px, ${currentY}px) scale(${lensSpring})`,
        transformOrigin: "center center",
        pointerEvents: "none",
        zIndex: 35,
        ...style,
      }}
    >
      {/* Outer Glow & Glass Rim */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `5px solid ${color}`,
          boxShadow: `0 0 40px ${color}66, 0 16px 45px rgba(0,0,0,0.5), inset 0 0 25px ${color}33`,
          backgroundColor: `${color}18`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Optical Crosshairs */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1.5px", backgroundColor: color, opacity: 0.6 }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1.5px", backgroundColor: color, opacity: 0.6 }} />
        <div style={{ position: "absolute", width: "24px", height: "24px", borderRadius: "50%", border: `1.5px dashed ${color}`, opacity: 0.8 }} />

        {/* Magnified Inset Content */}
        {children && (
          <div
            style={{
              transform: "scale(1.35)",
              transformOrigin: "center center",
            }}
          >
            {children}
          </div>
        )}

        {/* Glass Glare Highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Label Pill Attached to Rim */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#111113",
            color,
            border: `2px solid ${color}`,
            borderRadius: "6px",
            padding: "3px 12px",
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "1px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {label.toUpperCase()}
        </div>
      )}
    </div>
  );
};
