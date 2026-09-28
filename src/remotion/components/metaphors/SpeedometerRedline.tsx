import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export interface SpeedometerRedlineProps {
  /** Metric readout display */
  valueDisplay?: string;
  /** Unit label (e.g. "REQ / SEC", "LATENCY MS", "RPM x1000") */
  unitLabel?: string;
  /** Top benchmark headline */
  title?: string;
  /** Sub-status warning badge */
  warningLabel?: string;
  /** Frame when throttle opens and needle surges into redline */
  revFrame?: number;
  /** Gauge scale factor (default: 1.0) */
  scale?: number;
}

/**
 * SPEEDOMETER REDLINE (Concrete Physical Metaphor)
 *
 * Designed exclusively for Vox/Documentary style reels (Vox, Johnny Harris, MagnatesMedia).
 * Renders an authentic vintage high-performance automotive dial tachometer with chrome bezel,
 * torque needle spring, rev-limiter stop bounce, and high-frequency engine redline vibration.
 */
export const SpeedometerRedline: React.FC<SpeedometerRedlineProps> = ({
  valueDisplay = "14,800",
  unitLabel = "REQUESTS / SEC",
  title = "MAX SYSTEM THROUGHPUT",
  warningLabel = "REV-LIMITER ENGAGED (10X LOAD)",
  revFrame = 14,
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const isRedline = frame >= revFrame + 14;

  // Needle Angle Calculation:
  // Sweep arc: from -135 deg (0%) to +135 deg (100%)
  // Idle angle: -85 deg (~18%)
  // Redline target: +118 deg (~94%)
  let needleAngle = -85;

  if (frame < revFrame) {
    // Engine idle mechanical breathing (±1.0 deg)
    needleAngle = -85 + Math.sin(frame * 0.22) * 1.0;
  } else {
    // Rapid torque rev spring
    const revSpring = spring({
      frame: frame - revFrame,
      fps,
      config: { damping: 10, stiffness: 110, mass: 0.9 },
    });
    const baseAngle = interpolate(revSpring, [0, 1], [-85, 118]);

    // High-frequency mechanical rev-limiter jitter once needle reaches redline
    const redlineElapsed = Math.max(0, frame - (revFrame + 14));
    const jitter = isRedline
      ? Math.sin(redlineElapsed * 3.8) * 2.8 + Math.cos(redlineElapsed * 7.1) * 1.4
      : 0;

    needleAngle = baseAngle + jitter;
  }

  // Red alert bulb flashing in redline zone (every 5 frames)
  const isBulbLit = isRedline && Math.floor(frame / 4) % 2 === 0;

  return (
    <div
      style={{
        position: "relative",
        width: "820px",
        height: "820px",
        transform: `scale(${scale * entrance})`,
        transformOrigin: "center center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* ── BASE DESK CONTACT SHADOW ── */}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          width: "640px",
          height: "55px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0) 70%)",
          filter: "blur(8px)",
          zIndex: 1,
        }}
      />

      {/* ── SVG LAYER: ANALOG DIAL, TICK MARKS & CHROME BEZEL ── */}
      <svg
        width="820"
        height="820"
        viewBox="-410 -410 820 820"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          zIndex: 5,
        }}
      >
        <defs>
          {/* Chrome Bezel Rim Gradient */}
          <linearGradient id="chromeBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="25%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Dial Face Dark Texture */}
          <radialGradient id="dialFace" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Needle Gradient */}
          <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Bezel Drop Shadow */}
          <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* ── 1. CHROME BEZEL OUTER HOUSING ── */}
        <circle
          cx="0"
          cy="0"
          r="290"
          fill="url(#chromeBezel)"
          stroke="#0F172A"
          strokeWidth="6"
          filter="url(#gaugeShadow)"
        />
        {/* Inner Dark Dial Plate */}
        <circle cx="0" cy="0" r="268" fill="url(#dialFace)" stroke="#334155" strokeWidth="4" />

        {/* ── 2. MULTI-ZONE ARC BAND (0 to 100) ── */}
        {/* Normal Zone Arc (0% - 65% / -135° to +40°) */}
        <path
          d="M -162 162 A 230 230 0 0 1 176 147"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Warning Zone Arc (65% - 80% / +40° to +81°) */}
        <path
          d="M 176 147 A 230 230 0 0 1 227 36"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="12"
          opacity="0.9"
        />

        {/* Danger Redline Arc (80% - 100% / +81° to +135°) */}
        <path
          d="M 227 36 A 230 230 0 0 1 162 162"
          fill="none"
          stroke="#EF4444"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.95"
          filter={isRedline ? "drop-shadow(0 0 8px #EF4444)" : "none"}
        />

        {/* ── 3. ENGRAVED TICK MARKS ── */}
        {Array.from({ length: 28 }).map((_, i) => {
          // -135 deg to +135 deg sweep across 27 intervals
          const angleDeg = -135 + (i * 270) / 27;
          const aRad = (angleDeg * Math.PI) / 180;
          const isMajor = i % 3 === 0;
          const isDanger = angleDeg >= 80;
          const rInner = isMajor ? 208 : 220;
          const rOuter = 236;

          return (
            <line
              key={`tick-${i}`}
              x1={Math.cos(aRad) * rInner}
              y1={Math.sin(aRad) * rInner}
              x2={Math.cos(aRad) * rOuter}
              y2={Math.sin(aRad) * rOuter}
              stroke={isDanger ? "#EF4444" : isMajor ? "#F8FAFC" : "#64748B"}
              strokeWidth={isMajor ? 4 : 2}
            />
          );
        })}

        {/* ── 4. ANALOG COUNTERWEIGHTED NEEDLE ── */}
        <g id="needle" transform={`rotate(${needleAngle})`}>
          {/* Needle Pointer Shadow */}
          <polygon
            points="0,-225 10,-20 8,45 -8,45 -10,-20"
            fill="rgba(0,0,0,0.5)"
            transform="translate(4, 6)"
          />
          {/* Main Tapered Pointer */}
          <polygon points="0,-235 9,-20 7,45 -7,45 -9,-20" fill="url(#needleGrad)" stroke="#7F1D1D" strokeWidth="1" />
          {/* Counterweight Tail */}
          <circle cx="0" cy="38" r="14" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          {/* Center Needle Pivot Cap */}
          <circle cx="0" cy="0" r="28" fill="url(#chromeBezel)" stroke="#0F172A" strokeWidth="3" />
          <circle cx="0" cy="0" r="12" fill="#0F172A" />
        </g>
      </svg>

      {/* ── 5. DIGITAL HUD READOUT (INTERNAL ODOMETER) ── */}
      <div
        style={{
          position: "absolute",
          top: "470px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#0F172A",
          border: isRedline ? "2px solid #EF4444" : "2px solid #334155",
          borderRadius: "6px",
          padding: "6px 20px",
          boxShadow: isRedline ? "0 0 16px rgba(239, 68, 68, 0.4)" : "0 4px 10px rgba(0,0,0,0.5)",
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: "36px",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: isRedline ? "#F87171" : "#F8FAFC",
            fontFamily: "'Space Grotesk', monospace",
            lineHeight: 1.1,
          }}
        >
          {valueDisplay}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "#94A3B8",
            marginTop: "2px",
          }}
        >
          {unitLabel}
        </span>
      </div>

      {/* ── 6. TOP BENCHMARK HEADLINE & REDLINE WARNING BADGE ── */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FAF5E8",
          border: "2px solid #0F172A",
          borderRadius: "4px",
          padding: "8px 20px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
          zIndex: 25,
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", color: "#64748B" }}>
          PERFORMANCE BENCHMARK
        </span>
        <span style={{ fontSize: "24px", fontWeight: 900, color: "#0F172A", fontFamily: "'Bebas Neue', sans-serif" }}>
          {title}
        </span>
      </div>

      {/* Redline Warning Stamped Tag */}
      {isRedline && (
        <div
          style={{
            position: "absolute",
            bottom: "55px",
            backgroundColor: isBulbLit ? "#EF4444" : "#7F1D1D",
            border: "3px solid #FEE2E2",
            borderRadius: "6px",
            padding: "8px 20px",
            boxShadow: "0 8px 20px rgba(239, 68, 68, 0.6)",
            transform: "rotate(-2deg)",
            zIndex: 30,
            transition: "background-color 0.1s ease",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              color: "#FFFFFF",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {warningLabel}
          </span>
        </div>
      )}
    </div>
  );
};
