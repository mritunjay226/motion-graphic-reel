import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";

export type MarkerType =
  | "circle"
  | "arrow"
  | "highlighter_sweep"
  | "underline"
  | "redaction_bar"
  | "cross_out";

export interface LiveMarkerAnnotationProps {
  /** Type of hand-drawn annotation */
  type: MarkerType;
  /** Primary stroke or fill color (e.g. #FFE600 for yellow marker, #D61C1C for red pen, #111111 for black redaction) */
  color?: string;
  /** Frame offset when the annotation begins drawing */
  enterAtFrame?: number;
  /** Duration in frames to complete the draw motion (default: 12-16 frames for snappy feel) */
  drawDurationFrames?: number;
  /** Stroke thickness in pixels */
  strokeWidth?: number;
  /** Width of the annotation container */
  width?: number | string;
  /** Height of the annotation container */
  height?: number | string;
  /** Optional rotation angle in degrees */
  rotationDeg?: number;
  /** Additional container styles */
  style?: React.CSSProperties;
}

/**
 * High-Performance Vector Hand-Drawn Tactile Annotation Engine.
 *
 * Implements:
 * 1. Organic SVG Sketch Paths with natural hand-drawn wobble
 * 2. GPU-Accelerated strokeDashoffset draw animations
 * 3. Marker Squeak & Physical Pen physics
 * 4. Zero DOM layout thrashing
 */
export const LiveMarkerAnnotation: React.FC<LiveMarkerAnnotationProps> = ({
  type,
  color,
  enterAtFrame = 6,
  drawDurationFrames = 14,
  strokeWidth = 6,
  width = 240,
  height = 120,
  rotationDeg = -1.5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterAtFrame);
  if (localFrame < 0) return null;

  // Default color based on annotation archetype
  const activeColor =
    color ||
    (type === "circle" || type === "arrow" || type === "cross_out"
      ? "#D61C1C"
      : type === "redaction_bar"
      ? "#111113"
      : "#FFE600");

  // Draw progress [0 to 1] with organic natural hand curve
  const drawProgress = interpolate(
    localFrame,
    [0, drawDurationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  // Entrance pop spring
  const popSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `scale(${popSpring}) rotate(${rotationDeg}deg)`,
        transformOrigin: "center center",
        pointerEvents: "none",
        display: "inline-block",
        ...style,
      }}
    >
      {/* ─── 1. HAND-DRAWN ORGANIC OVAL CIRCLE ─── */}
      {type === "circle" && (
        <svg
          viewBox="0 0 200 100"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Rough organic oval with overlapping tail */}
          <path
            d="M 28 48 C 26 22, 90 12, 160 18 C 196 22, 192 78, 140 86 C 80 94, 18 84, 22 52 C 24 32, 60 20, 100 19"
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={620}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [620, 0])}
            style={{
              filter: `drop-shadow(0 2px 6px ${activeColor}55)`,
            }}
          />
        </svg>
      )}

      {/* ─── 2. SKETCHED ATTENTION ARROW ─── */}
      {type === "arrow" && (
        <svg
          viewBox="0 0 160 100"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Curved arrow stem */}
          <path
            d="M 15 80 Q 70 90, 120 40 T 145 20"
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={220}
            strokeDashoffset={interpolate(drawProgress, [0, 0.75], [220, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          {/* Arrow Head Bar 1 */}
          <path
            d="M 115 15 L 145 20"
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={50}
            strokeDashoffset={interpolate(drawProgress, [0.6, 0.9], [50, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          {/* Arrow Head Bar 2 */}
          <path
            d="M 135 48 L 145 20"
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={50}
            strokeDashoffset={interpolate(drawProgress, [0.75, 1], [50, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </svg>
      )}

      {/* ─── 3. DYNAMIC HIGHLIGHTER SWEEP ─── */}
      {type === "highlighter_sweep" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: activeColor,
            borderRadius: "4px",
            transformOrigin: "left center",
            transform: `scaleX(${drawProgress}) skewX(-6deg)`,
            opacity: 0.85,
            boxShadow: `0 2px 10px ${activeColor}66`,
            mixBlendMode: "multiply",
          }}
        />
      )}

      {/* ─── 4. HAND-DRAWN SQUIGGLY UNDERLINE ─── */}
      {type === "underline" && (
        <svg
          viewBox="0 0 200 20"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <path
            d="M 4 12 Q 40 4, 80 14 T 160 8 T 196 12"
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={220}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [220, 0])}
            style={{
              filter: `drop-shadow(0 2px 4px ${activeColor}44)`,
            }}
          />
        </svg>
      )}

      {/* ─── 5. TOP-SECRET REDACTION CENSORSHIP BAR ─── */}
      {type === "redaction_bar" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: activeColor,
            borderRadius: "2px",
            transformOrigin: "left center",
            transform: `scaleX(${drawProgress})`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {localFrame > drawDurationFrames && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                fontWeight: 900,
                color: "#D61C1C",
                letterSpacing: "2px",
                opacity: 0.8,
              }}
            >
              [REDACTED]
            </span>
          )}
        </div>
      )}

      {/* ─── 6. BOLD X CROSS-OUT ─── */}
      {type === "cross_out" && (
        <svg
          viewBox="0 0 100 100"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <line
            x1="12"
            y1="12"
            x2="88"
            y2="88"
            stroke={activeColor}
            strokeWidth={strokeWidth * 1.3}
            strokeLinecap="round"
            strokeDasharray={130}
            strokeDashoffset={interpolate(drawProgress, [0, 0.55], [130, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          <line
            x1="88"
            y1="12"
            x2="12"
            y2="88"
            stroke={activeColor}
            strokeWidth={strokeWidth * 1.3}
            strokeLinecap="round"
            strokeDasharray={130}
            strokeDashoffset={interpolate(drawProgress, [0.45, 1], [130, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </svg>
      )}
    </div>
  );
};
