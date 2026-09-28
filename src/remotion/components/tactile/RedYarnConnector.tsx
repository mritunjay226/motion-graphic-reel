import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface RedYarnPoint {
  x: number;
  y: number;
}

export interface RedYarnConnectorProps {
  /** Start anchor point (Pin A) in px */
  from: RedYarnPoint;
  /** End anchor point (Pin B) in px */
  to: RedYarnPoint;
  /** Frame when the string snaps between the two pins */
  startFrame?: number;
  /** Natural gravity sag in pixels */
  sagAmount?: number;
  /** Initial pluck vibration amplitude in pixels */
  pluckAmplitude?: number;
  /** Pluck frequency */
  pluckFrequency?: number;
  /** Damping decay rate for vibration */
  damping?: number;
  /** Primary yarn color (default: rich crimson #DC2626) */
  color?: string;
  /** Whether to render 3D brass pins at the endpoints */
  showPins?: boolean;
  /** Width/height bounding box if used in an isolated SVG */
  containerWidth?: number;
  containerHeight?: number;
}

/**
 * RED YARN CONNECTOR (Tactile Documentary Props)
 *
 * Simulates an authentic crimson conspiracy yarn string running between two pinned evidence items.
 *
 * Features:
 * - Catenary parabolic gravity sag
 * - Dynamic harmonic pluck vibration when the pin snaps
 * - Multi-strand twisted fiber texture
 * - Contact drop shadow cast onto background desk/corkboard
 * - 3D Brass/Red push-pins at endpoints
 */
export const RedYarnConnector: React.FC<RedYarnConnectorProps> = ({
  from,
  to,
  startFrame = 0,
  sagAmount = 26,
  pluckAmplitude = 18,
  pluckFrequency = 0.85,
  damping = 0.14,
  color = "#DC2626",
  showPins = true,
  containerWidth = 1080,
  containerHeight = 1920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If before start frame, string has not been strung yet
  if (frame < startFrame) {
    return null;
  }

  const elapsed = frame - startFrame;

  // Snapping entrance spring (string shoots from point A to point B)
  const snapProgress = spring({
    frame: elapsed,
    fps,
    config: { damping: 15, stiffness: 220 },
  });

  // Calculate dynamic end point during initial snap
  const currentToX = from.x + (to.x - from.x) * snapProgress;
  const currentToY = from.y + (to.y - from.y) * snapProgress;

  // Midpoint
  const midX = (from.x + currentToX) / 2;
  const midY = (from.y + currentToY) / 2;

  // Distance between points
  const dist = Math.sqrt(Math.pow(currentToX - from.x, 2) + Math.pow(currentToY - from.y, 2));

  // Dynamic catenary sag scaled by distance
  const baseSag = sagAmount * Math.min(1.5, Math.max(0.4, dist / 450));

  // Damped harmonic pluck vibration: A * e^(-γt) * sin(ωt)
  const vibration = pluckAmplitude * Math.exp(-damping * elapsed) * Math.sin(pluckFrequency * elapsed);

  // Control point with vertical sag and vibration
  const ctrlX = midX;
  const ctrlY = midY + baseSag + vibration;

  // SVG path definition
  const yarnPath = `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${currentToX} ${currentToY}`;

  return (
    <svg
      width={containerWidth}
      height={containerHeight}
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 25,
      }}
    >
      <defs>
        {/* Soft Desk Drop Shadow */}
        <filter id="yarnShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="12" stdDeviation="5" floodColor="#000000" floodOpacity="0.35" />
        </filter>

        {/* Brass Pin Metallic Gradient */}
        <radialGradient id="brassPinHead" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#D97706" />
          <stop offset="85%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
      </defs>

      {/* ── 1. AMBIENT YARN DROP SHADOW (CAST ONTO CORKBOARD/DESK) ── */}
      <path
        d={yarnPath}
        fill="none"
        stroke="#000000"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.32"
        transform="translate(4, 14)"
        style={{ filter: "blur(3px)" }}
      />

      {/* ── 2. BASE THICK CRIMSON YARN STRAND ── */}
      <path
        d={yarnPath}
        fill="none"
        stroke={color}
        strokeWidth="3.6"
        strokeLinecap="round"
      />

      {/* ── 3. TWISTED FIBER HIGHLIGHT STRAND ── */}
      <path
        d={yarnPath}
        fill="none"
        stroke="#FCA5A5"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="5 3"
        opacity="0.8"
      />

      {/* ── 4. ENDPOINT PUSH-PINS (OPTIONAL 3D BRASS PINS) ── */}
      {showPins && (
        <>
          {/* Start Pin A */}
          <g transform={`translate(${from.x}, ${from.y})`} filter="url(#yarnShadow)">
            {/* Twine knot ring wrapped on pin */}
            <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="3" />
            {/* 3D Pin Head */}
            <circle cx="0" cy="-2" r="7" fill="url(#brassPinHead)" stroke="#451A03" strokeWidth="1.5" />
            <circle cx="-2" cy="-4" r="2.5" fill="#FFFFFF" opacity="0.7" />
          </g>

          {/* End Pin B */}
          {snapProgress > 0.95 && (
            <g transform={`translate(${to.x}, ${to.y})`} filter="url(#yarnShadow)">
              {/* Twine knot ring wrapped on pin */}
              <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="3" />
              {/* 3D Pin Head */}
              <circle cx="0" cy="-2" r="7" fill="url(#brassPinHead)" stroke="#451A03" strokeWidth="1.5" />
              <circle cx="-2" cy="-4" r="2.5" fill="#FFFFFF" opacity="0.7" />
            </g>
          )}
        </>
      )}
    </svg>
  );
};
