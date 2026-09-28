import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";

export interface AnimatedCursorProps {
  /** Starting coordinate in container px */
  startPoint?: { x: number; y: number };
  /** Destination target coordinate in container px */
  targetPoint?: { x: number; y: number };
  /** Frame when cursor starts gliding toward target (default: 12) */
  startFrame?: number;
  /** Duration of movement in frames (default: 26) */
  moveDurationFrames?: number;
  /** Frame when click press occurs (default: 42) */
  clickAtFrame?: number;
  /** Click press duration in frames (default: 16) */
  clickDurationFrames?: number;
  /** Optional author pill label next to cursor (e.g. "Admin", "User", "Dev") */
  authorLabel?: string;
  /** Author badge background color */
  authorBadgeColor?: string;
  /** Click shockwave ripple color */
  rippleColor?: string;
  /** Cursor body fill color (default: white) */
  cursorColor?: string;
  style?: React.CSSProperties;
}

/**
 * AnimatedCursor
 *
 * Broadcast-Grade Animated Mouse Cursor with authentic human Bézier movement curves,
 * tactile downscale press physics, and expanding radial click shockwave ripples.
 */
export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  startPoint = { x: 750, y: 1100 },
  targetPoint = { x: 480, y: 620 },
  startFrame = 12,
  moveDurationFrames = 26,
  clickAtFrame = 42,
  clickDurationFrames = 18,
  authorLabel,
  authorBadgeColor = "#3B82F6",
  rippleColor = "#3B82F6",
  cursorColor = "#FFFFFF",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── 1. MOVEMENT INTERPOLATION (Human Bézier Glide with Subtle Arc) ──
  const moveProgress = interpolate(
    frame,
    [startFrame, startFrame + moveDurationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  // Subtle natural human arc displacement
  const arcDisplacement = Math.sin(moveProgress * Math.PI) * -28;

  const currentX = interpolate(moveProgress, [0, 1], [startPoint.x, targetPoint.x]) + arcDisplacement * 0.4;
  const currentY = interpolate(moveProgress, [0, 1], [startPoint.y, targetPoint.y]) + arcDisplacement;

  // ── 2. CLICK PRESS & SCALE DYNAMICS ──
  const isAfterClick = frame >= clickAtFrame;
  const localClickFrame = Math.max(0, frame - clickAtFrame);

  let cursorScale = 1.0;
  let rippleRadius = 0;
  let rippleOpacity = 0;

  if (isAfterClick && localClickFrame <= clickDurationFrames) {
    // Spring press down and recoil
    const clickSpring = spring({
      frame: localClickFrame,
      fps,
      config: { damping: 12, stiffness: 240, mass: 0.4 },
    });

    cursorScale = interpolate(clickSpring, [0, 0.35, 1], [1.0, 0.84, 1.0]);

    // Expanding radial shockwave ripple
    rippleRadius = interpolate(localClickFrame, [0, clickDurationFrames], [4, 52], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    rippleOpacity = interpolate(localClickFrame, [0, clickDurationFrames], [0.85, 0], {
      extrapolateRight: "clamp",
    });
  } else if (isAfterClick) {
    cursorScale = 1.0;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${currentX.toFixed(2)}px`,
        top: `${currentY.toFixed(2)}px`,
        zIndex: 90,
        pointerEvents: "none",
        willChange: "transform",
        ...style,
      }}
    >
      {/* ── EXPANDING RADIAL CLICK SHOCKWAVE RIPPLE ── */}
      {rippleOpacity > 0.02 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${rippleRadius * 2}px`,
            height: `${rippleRadius * 2}px`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            border: `2.5px solid ${rippleColor}`,
            boxShadow: `0 0 16px ${rippleColor}`,
            opacity: rippleOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── PIXEL-PERFECT SVG MOUSE CURSOR ── */}
      <div
        style={{
          transform: `scale(${cursorScale.toFixed(3)}) rotate(-2deg)`,
          transformOrigin: "0 0",
          filter: "drop-shadow(0 6px 14px rgba(0, 0, 0, 0.38))",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <svg
          width="26"
          height="32"
          viewBox="0 0 24 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Authentic macOS Arrow Cursor */}
          <path
            d="M2.5 2.5L2.5 24.5L7.8 19.8L12.5 28.5L16.2 26.5L11.5 17.8L18.5 17.8L2.5 2.5Z"
            fill={cursorColor}
            stroke="#09090B"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>

        {/* ── OPTIONAL COLLABORATIVE AUTHOR BADGE ── */}
        {authorLabel && (
          <div
            style={{
              marginLeft: "6px",
              marginTop: "16px",
              backgroundColor: authorBadgeColor,
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "9999px",
              letterSpacing: "0.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            {authorLabel}
          </div>
        )}
      </div>
    </div>
  );
};
