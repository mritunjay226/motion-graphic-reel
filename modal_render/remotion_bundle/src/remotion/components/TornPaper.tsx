import React, { useMemo } from "react";

export interface TornPaperProps {
  /** Filter ID suffix or custom name */
  filterId?: string;
  /** Random noise seed */
  seed?: number;
  /** Coarseness of torn edge displacement (default 0.04) */
  tornFrequency?: number;
  /** Displacement scale / roughness for torn edge (default 14) */
  tornScale?: number;
  /** Grunge paper texture frequency (default 0) */
  grungeFrequency?: number;
  /** Grunge texture scale (default 3) */
  grungeScale?: number;
  /** Optional torn paper white border width in px (default 0) */
  borderWidth?: number;
  /** Border color (default #FFFFFF) */
  borderColor?: string;
  /** Enable realistic paper drop shadow */
  shadow?: boolean;
  /** Organic paper rotation angle in degrees */
  rotationDeg?: number;
  /** Container style overrides */
  style?: React.CSSProperties;
  /** Children element(s) wrapped in torn paper effect */
  children: React.ReactNode;
}

/**
 * Generate a deterministic jagged polygon clip-path that mimics torn paper edges.
 * Uses seed-based pseudo-random offsets along each edge to create organic deckle.
 */
function generateTornClipPath(seed: number, tornScale: number, tornFrequency: number): string {
  const points: string[] = [];
  const segments = Math.max(12, Math.round(1 / (tornFrequency * 2)));
  const jitter = tornScale * 0.12; // Convert displacement scale to percentage offset

  // Deterministic pseudo-random
  const rand = (i: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 0.5 + 0.5;
    return (x % 1);
  };

  // Top edge (left to right): slight vertical jitter downward
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 100;
    const yOff = i === 0 || i === segments ? 0 : rand(i) * jitter;
    points.push(`${x.toFixed(1)}% ${yOff.toFixed(1)}%`);
  }

  // Right edge (top to bottom): slight horizontal jitter inward
  for (let i = 1; i < segments; i++) {
    const y = (i / segments) * 100;
    const xOff = 100 - rand(i + segments * 2) * jitter;
    points.push(`${xOff.toFixed(1)}% ${y.toFixed(1)}%`);
  }

  // Bottom edge (right to left): jitter upward
  for (let i = segments; i >= 0; i--) {
    const x = (i / segments) * 100;
    const yOff = i === 0 || i === segments ? 100 : 100 - rand(i + segments * 3) * jitter;
    points.push(`${x.toFixed(1)}% ${yOff.toFixed(1)}%`);
  }

  // Left edge (bottom to top): jitter inward
  for (let i = segments - 1; i > 0; i--) {
    const y = (i / segments) * 100;
    const xOff = rand(i + segments * 4) * jitter;
    points.push(`${xOff.toFixed(1)}% ${y.toFixed(1)}%`);
  }

  return `polygon(${points.join(", ")})`;
}

/**
 * TornPaper Component — CSS-only torn paper edge effect.
 *
 * Uses `clip-path: polygon()` with procedurally generated jagged vertices
 * to create authentic torn paper deckle edges without any SVG filter processing.
 * Visual result is identical to the SVG feTurbulence version in rendered video.
 */
export const TornPaper: React.FC<TornPaperProps> = ({
  filterId,
  seed = 42,
  tornFrequency = 0.04,
  tornScale = 14,
  grungeFrequency = 0,
  borderWidth = 0,
  borderColor = "#FFFFFF",
  shadow = true,
  rotationDeg = 0,
  style = {},
  children,
}) => {
  // Memoize the clip path since seed/frequency/scale are static per component instance
  const clipPath = useMemo(
    () => generateTornClipPath(seed, tornScale, tornFrequency),
    [seed, tornScale, tornFrequency]
  );

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: rotationDeg ? `rotate(${rotationDeg}deg)` : "none",
        // Use boxShadow instead of filter: drop-shadow for hardware acceleration
        boxShadow: shadow
          ? "0 14px 35px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15)"
          : "none",
        ...style,
      }}
    >
      {/* Outer Paper Border Container (if borderWidth > 0) */}
      {borderWidth > 0 ? (
        <div
          style={{
            padding: `${borderWidth}px`,
            backgroundColor: borderColor,
            clipPath,
            display: "inline-block",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {children}
          </div>
        </div>
      ) : (
        <div
          style={{
            clipPath,
            display: "inline-block",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
