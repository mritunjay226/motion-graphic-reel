import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface RubberStampInkBleedProps {
  /** Stamp text (e.g. "CONFIDENTIAL", "DEBUNKED", "APPROVED", "FRAUD") */
  text?: string;
  /** Subtitle / date stamp text */
  subtext?: string;
  /** Frame when the stamp slams down onto the document */
  impactFrame?: number;
  /** Rotation angle in degrees (default: -14 deg) */
  rotationDeg?: number;
  /** Ink color (default: rich vermillion #DC2626) */
  color?: string;
  /** Scale sizing factor */
  scale?: number;
}

/**
 * RUBBER STAMP INK-BLEED (Tactile Documentary Props)
 *
 * Simulates an authentic forensic evidence rubber stamp slammed onto paper.
 *
 * Features:
 * - High-stiffness slam spring with scale recoil (2.2 -> 1.0)
 * - Decaying camera micro-shake on impact
 * - Double-line distressed stencil border with ink-bleed erosion
 * - Authentic ink spatter dots
 */
export const RubberStampInkBleed: React.FC<RubberStampInkBleedProps> = ({
  text = "CONFIDENTIAL",
  subtext = "CASE FILE #8492-B",
  impactFrame = 24,
  rotationDeg = -14,
  color = "#DC2626",
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If before impact, stamp is in flight
  if (frame < impactFrame) {
    return null;
  }

  const elapsed = frame - impactFrame;

  // High-stiffness impact spring
  const impactSpring = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 280, mass: 0.85 },
  });

  // Scale: 2.2 down to 1.0 with mechanical bounce
  const currentScale = interpolate(impactSpring, [0, 1], [2.2, 1.0]);
  const opacity = interpolate(elapsed, [0, 2], [0.4, 1.0], { extrapolateRight: "clamp" });

  // Camera micro-shake impulse on impact frame
  const shakeDecay = Math.exp(-0.35 * elapsed);
  const shakeX = elapsed < 8 ? Math.cos(elapsed * 2.8) * 5 * shakeDecay : 0;
  const shakeY = elapsed < 8 ? Math.sin(elapsed * 2.8) * 7 * shakeDecay : 0;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 28px",
        border: `4px dashed ${color}`,
        borderRadius: "6px",
        outline: `2px solid ${color}`,
        outlineOffset: "4px",
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale * currentScale}) rotate(${rotationDeg}deg)`,
        transformOrigin: "center center",
        opacity,
        boxShadow: `0 4px 14px rgba(220, 38, 38, 0.25)`,
        backgroundColor: "rgba(220, 38, 38, 0.04)",
        userSelect: "none",
        zIndex: 50,
      }}
    >
      {/* ── MAIN STENCIL HEADLINE ── */}
      <span
        style={{
          fontSize: "44px",
          fontWeight: 900,
          letterSpacing: "0.18em",
          color,
          fontFamily: "'Bebas Neue', sans-serif",
          lineHeight: 1,
          textShadow: `1px 1px 0px rgba(0,0,0,0.15), 0 0 1px ${color}`,
        }}
      >
        {text}
      </span>

      {/* ── INK-BLEED SUBTITLE / DATE STAMP ── */}
      {subtext && (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color,
            fontFamily: "'Space Grotesk', monospace",
            marginTop: "6px",
            opacity: 0.9,
          }}
        >
          {subtext}
        </span>
      )}

      {/* ── ORGANIC INK SPATTER SPECKS ── */}
      <div
        style={{
          position: "absolute",
          top: "-6px",
          right: "-8px",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: color,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          left: "14px",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          backgroundColor: color,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "-7px",
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          backgroundColor: color,
          opacity: 0.5,
        }}
      />
    </div>
  );
};
