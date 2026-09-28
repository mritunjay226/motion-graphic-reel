import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export interface LeakingConversionFunnelProps {
  /** Top stage label */
  topLabel?: string;
  /** Top stage count / metric */
  topMetric?: string;
  /** Middle stage label */
  midLabel?: string;
  /** Middle stage count / metric */
  midMetric?: string;
  /** Bottom stage label */
  bottomLabel?: string;
  /** Bottom stage count / metric */
  bottomMetric?: string;
  /** Frame when side leaks start spurting */
  leakStartFrame?: number;
  /** Scale sizing factor (default: 1.0) */
  scale?: number;
}

/**
 * LEAKING CONVERSION FUNNEL (Concrete Physical Metaphor)
 *
 * Designed exclusively for Vox/Documentary style reels (Vox, Johnny Harris, MagnatesMedia).
 * Renders an authentic laboratory frosted-glass funnel with physical fluid droplets,
 * side fissure fractures emitting parabolic projectile churn particles, and a collecting beaker.
 */
export const LeakingConversionFunnel: React.FC<LeakingConversionFunnelProps> = ({
  topLabel = "100,000 VISITORS",
  topMetric = "TOP OF FUNNEL",
  midLabel = "12,000 SIGNUPS",
  midMetric = "TRIAL ACTIVATION",
  bottomLabel = "450 CUSTOMERS",
  bottomMetric = "NET RETENTION",
  leakStartFrame = 14,
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

  // Funnel Geometry
  // Top: width 640px, y: -260
  // Mid: width 380px, y: -90
  // Spout: width 150px, y: 80
  // Beaker base: y: 280

  // Seeded deterministic particles for side leaks
  const leakParticles = useMemo(() => {
    const list: Array<{
      id: number;
      side: "left" | "right";
      stage: "top" | "mid";
      vX: number;
      vY: number;
      size: number;
      birthFrame: number;
    }> = [];

    for (let i = 0; i < 48; i++) {
      const isLeft = i % 2 === 0;
      const isTop = i % 3 !== 0;
      const birth = leakStartFrame + (i * 2.8);
      const vX = (isLeft ? -1 : 1) * (3.5 + (i % 5) * 1.2);
      const vY = -1.5 - (i % 3) * 0.8;
      const size = 5 + (i % 4) * 2.5;

      list.push({
        id: i,
        side: isLeft ? "left" : "right",
        stage: isTop ? "top" : "mid",
        vX,
        vY,
        size,
        birthFrame: birth,
      });
    }
    return list;
  }, [leakStartFrame]);

  // Liquid level rising in bottom beaker
  const beakerFillProgress = interpolate(
    frame,
    [leakStartFrame + 10, leakStartFrame + 60],
    [0.15, 0.78],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "relative",
        width: "900px",
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
          bottom: "35px",
          width: "480px",
          height: "40px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0) 70%)",
          filter: "blur(6px)",
          zIndex: 1,
        }}
      />

      {/* ── SVG LAYER: GLASS FUNNEL & BEAKER GEOMETRY ── */}
      <svg
        width="900"
        height="820"
        viewBox="-450 -410 900 820"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          zIndex: 5,
        }}
      >
        <defs>
          {/* Frosted Glass Body Gradient */}
          <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="25%" stopColor="rgba(240,249,255,0.12)" />
            <stop offset="75%" stopColor="rgba(240,249,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.45)" />
          </linearGradient>

          {/* Top Funnel Fluid (Cyan) */}
          <linearGradient id="cyanFluid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.9" />
          </linearGradient>

          {/* Middle Funnel Fluid (Amber) */}
          <linearGradient id="amberFluid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.95" />
          </linearGradient>

          {/* Bottom Retained Fluid (Emerald) */}
          <linearGradient id="emeraldFluid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
          </linearGradient>

          {/* Glass Beaker Rim */}
          <linearGradient id="glassRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* ── 1. FUNNEL FLUID MASSES (INTERIOR) ── */}
        {/* Stage 1 Fluid (Top trapezoid) */}
        <polygon
          points="-310,-240 310,-240 185,-90 -185,-90"
          fill="url(#cyanFluid)"
          opacity="0.85"
        />

        {/* Stage 2 Fluid (Middle trapezoid) */}
        <polygon
          points="-185,-90 185,-90 70,60 -70,60"
          fill="url(#amberFluid)"
          opacity="0.88"
        />

        {/* Stage 3 Fluid (Spout column) */}
        <polygon
          points="-68,60 68,60 60,180 -60,180"
          fill="url(#emeraldFluid)"
          opacity="0.9"
        />

        {/* ── 2. GLASS FUNNEL CONICAL CONTOUR & ETCHINGS ── */}
        {/* Outer Funnel Wall */}
        <path
          d="M -320 -250 L -190 -85 L -75 60 L -70 190 L 70 190 L 75 60 L 190 -85 L 320 -250 Z"
          fill="url(#glassBody)"
          stroke="url(#glassRim)"
          strokeWidth="3.5"
        />

        {/* Funnel Top Oval Rim */}
        <ellipse cx="0" cy="-250" rx="320" ry="24" fill="rgba(255,255,255,0.25)" stroke="#CBD5E1" strokeWidth="3" />

        {/* Etched Glass Measurement Hash Marks */}
        {[-210, -170, -130, -50, -10, 20, 100, 140].map((yVal, idx) => (
          <line
            key={`hash-${idx}`}
            x1={idx % 2 === 0 ? -120 : -90}
            y1={yVal}
            x2={-50}
            y2={yVal}
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="2"
            strokeDasharray={idx % 2 === 0 ? "none" : "3 3"}
          />
        ))}

        {/* ── 3. FISSURE CRACKS ON SIDES (SPURTING SOURCES) ── */}
        {frame >= leakStartFrame && (
          <g id="fissureCracks">
            {/* Top Left Crack */}
            <path
              d="M -245 -160 L -235 -152 L -248 -142 L -238 -135"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Top Right Crack */}
            <path
              d="M 245 -160 L 235 -150 L 250 -138 L 240 -130"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Mid Left Crack */}
            <path
              d="M -125 -15 L -115 -8 L -128 2 L -118 10"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ── 4. BOTTOM COLLECTION BEAKER (CYLINDRICAL GLASS FLASK) ── */}
        <g id="beaker" transform="translate(0, 190)">
          {/* Beaker Body */}
          <path
            d="M -110 0 L -110 130 C -110 150 110 150 110 130 L 110 0 Z"
            fill="url(#glassBody)"
            stroke="url(#glassRim)"
            strokeWidth="3"
          />
          {/* Liquid Inside Beaker */}
          <rect
            x="-106"
            y={130 - beakerFillProgress * 120}
            width="212"
            height={beakerFillProgress * 120}
            rx="6"
            fill="url(#emeraldFluid)"
          />
          {/* Beaker Glass Base Lip */}
          <ellipse cx="0" cy="130" rx="110" ry="12" fill="none" stroke="#64748B" strokeWidth="3" />
        </g>
      </svg>

      {/* ── 5. PARABOLIC PROJECTILE CHURN PARTICLES ── */}
      {frame >= leakStartFrame &&
        leakParticles.map((pt) => {
          const age = frame - pt.birthFrame;
          if (age < 0 || age > 22) return null;

          // Origin coordinate based on stage & side
          const originX =
            pt.stage === "top"
              ? pt.side === "left"
                ? -245
                : 245
              : pt.side === "left"
              ? -125
              : 125;
          const originY = pt.stage === "top" ? -150 : -5;

          // Parabolic trajectory: x = x0 + vx*t, y = y0 + vy*t + 1/2*g*t^2
          const g = 0.55;
          const posX = originX + pt.vX * age;
          const posY = originY + pt.vY * age + 0.5 * g * Math.pow(age, 2);
          const opacity = interpolate(age, [0, 16, 22], [1, 0.85, 0], { extrapolateRight: "clamp" });

          return (
            <div
              key={`leak-pt-${pt.id}-${Math.floor(frame / 30)}`}
              style={{
                position: "absolute",
                left: `calc(50% + ${posX}px)`,
                top: `calc(50% + ${posY}px)`,
                width: `${pt.size}px`,
                height: `${pt.size}px`,
                borderRadius: "50%",
                background: "radial-gradient(circle, #F87171 0%, #DC2626 70%, #991B1B 100%)",
                boxShadow: "0 0 6px rgba(220, 38, 38, 0.8)",
                opacity,
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
            />
          );
        })}

      {/* ── 6. PHYSICAL LABELS & STAMPED EVIDENCE TAGS ── */}
      {/* Top Stage Stamped Label */}
      <div
        style={{
          position: "absolute",
          top: "85px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FAF5E8",
          border: "2px solid #0891B2",
          borderRadius: "4px",
          padding: "6px 14px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 25,
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 800, color: "#0891B2", letterSpacing: "0.1em" }}>
          {topMetric}
        </span>
        <span style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", fontFamily: "'Bebas Neue', sans-serif" }}>
          {topLabel}
        </span>
      </div>

      {/* Top Side Leak Stamped Warning Badge (Left) */}
      {frame >= leakStartFrame + 4 && (
        <div
          style={{
            position: "absolute",
            left: "40px",
            top: "220px",
            transform: "rotate(-12deg)",
            backgroundColor: "#FEF2F2",
            border: "2px dashed #DC2626",
            borderRadius: "4px",
            padding: "6px 12px",
            boxShadow: "0 6px 14px rgba(220, 38, 38, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 30,
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 900, color: "#991B1B" }}>CRITICAL LEAK</span>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "#DC2626", fontFamily: "'Bebas Neue', sans-serif" }}>
            -88% DROP-OFF
          </span>
        </div>
      )}

      {/* Mid Stage Stamped Label */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FAF5E8",
          border: "2px solid #D97706",
          borderRadius: "4px",
          padding: "6px 14px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 25,
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 800, color: "#D97706", letterSpacing: "0.1em" }}>
          {midMetric}
        </span>
        <span style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", fontFamily: "'Bebas Neue', sans-serif" }}>
          {midLabel}
        </span>
      </div>

      {/* Mid Side Leak Stamped Warning Badge (Right) */}
      {frame >= leakStartFrame + 8 && (
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "370px",
            transform: "rotate(10deg)",
            backgroundColor: "#FEF2F2",
            border: "2px dashed #DC2626",
            borderRadius: "4px",
            padding: "6px 12px",
            boxShadow: "0 6px 14px rgba(220, 38, 38, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 30,
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 900, color: "#991B1B" }}>CHURN RATE</span>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "#DC2626", fontFamily: "'Bebas Neue', sans-serif" }}>
            -65% CHURN
          </span>
        </div>
      )}

      {/* Bottom Retained Output Stamped Label */}
      <div
        style={{
          position: "absolute",
          bottom: "95px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#F0FDF4",
          border: "2px solid #10B981",
          borderRadius: "4px",
          padding: "8px 16px",
          boxShadow: "0 6px 14px rgba(16, 185, 129, 0.35)",
          zIndex: 30,
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 900, color: "#047857", letterSpacing: "0.1em" }}>
          {bottomMetric}
        </span>
        <span style={{ fontSize: "28px", fontWeight: 900, color: "#065F46", fontFamily: "'Bebas Neue', sans-serif" }}>
          {bottomLabel}
        </span>
      </div>
    </div>
  );
};
