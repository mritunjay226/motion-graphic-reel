import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

interface VoxLeaderLineProps {
  /** Label badge text e.g. "EST. 1997" or "OFFER EVALUATION" */
  label: string;
  /** Value or secondary text e.g. "$50,000,000" */
  value?: string;
  /** Frame offset to trigger entrance */
  enterAtFrame?: number;
  /** Direction: left to right or right to left */
  direction?: "left" | "right";
  /** Width of horizontal leader line in px */
  lineWidth?: number;
  /** Height of vertical connector line in px */
  lineHeight?: number;
  /** Top position override */
  top?: string | number;
  /** Left position override */
  left?: string | number;
  /** Right position override */
  right?: string | number;
  /** Bottom position override */
  bottom?: string | number;
}

/**
 * Vox Signature Architectural Leader Line & Info Badge Component.
 *
 * Renders animated dashed leader lines and metadata callout badges pointing to scene subjects.
 */
export const VoxLeaderLine: React.FC<VoxLeaderLineProps> = ({
  label,
  value,
  enterAtFrame = 8,
  direction = "right",
  lineWidth = 120,
  lineHeight = 40,
  top,
  left,
  right,
  bottom,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - enterAtFrame;

  if (localFrame < 0) return null;

  const lineSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const badgeSpring = spring({
    frame: Math.max(0, localFrame - 5),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const currentLineWidth = interpolate(lineSpring, [0, 1], [0, lineWidth]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        display: "flex",
        flexDirection: direction === "right" ? "row" : "row-reverse",
        alignItems: "center",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {/* Target Dot */}
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#FFE600",
          boxShadow: "0 0 10px #FFE600",
          flexShrink: 0,
        }}
      />

      {/* Horizontal Dashed Leader Line */}
      <div
        style={{
          width: `${currentLineWidth}px`,
          height: "2px",
          borderTop: "2px dashed #444444",
          transformOrigin: direction === "right" ? "left center" : "right center",
        }}
      />

      {/* Info Badge */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "6px 12px",
          backgroundColor: "#111111",
          borderRadius: "6px",
          border: "1px solid #333333",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          marginLeft: direction === "right" ? "8px" : "0",
          marginRight: direction === "left" ? "8px" : "0",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: "bold",
            color: "#FFE600",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          [{label}]
        </span>
        {value && (
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "1px",
              lineHeight: 1.1,
              marginTop: "2px",
            }}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
};
