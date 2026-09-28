import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface DonutSegment {
  label: string;
  percentage: number;
  color: string;
}

export interface RadialProgressDonutProps {
  title?: string;
  subtitle?: string;
  primaryPercentage?: number;
  primaryLabel?: string;
  segments?: DonutSegment[];
  startFrame?: number;
  aesthetic?: "documentary" | "tech";
  accentColor?: string;
  scale?: number;
}

const DEFAULT_SEGMENTS: DonutSegment[] = [
  { label: "PRIMARY LEADER", percentage: 92.4, color: "#DC2626" },
  { label: "COMPETITOR A", percentage: 5.6, color: "#D97706" },
  { label: "ALL OTHERS", percentage: 2.0, color: "#64748B" },
];

/**
 * RADIAL PROGRESS DONUT (Advanced Data Visualization)
 *
 * Concentric circular arc gauge with spring-driven SVG stroke-dash progression,
 * glowing spark tip, giant center tabular counter, and segment breakdown legend.
 */
export const RadialProgressDonut: React.FC<RadialProgressDonutProps> = ({
  title = "MARKET MONOPOLY AUDIT",
  subtitle = "ADVANCED SEMICONDUCTOR CHIP PRODUCTION",
  primaryPercentage = 92.4,
  primaryLabel = "GLOBAL SHARE",
  segments = DEFAULT_SEGMENTS,
  startFrame = 6,
  aesthetic = "documentary",
  accentColor,
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDoc = aesthetic === "documentary";

  // Palette tokens
  const primaryColor = accentColor || (isDoc ? "#DC2626" : "#10B981");
  const cardBg = isDoc ? "#FAF5E8" : "#0F172A";
  const cardBorder = isDoc ? "2px solid #D6CEBE" : "1px solid rgba(255,255,255,0.12)";
  const trackColor = isDoc ? "#E5DECE" : "rgba(255, 255, 255, 0.08)";
  const labelColor = isDoc ? "#5C5042" : "#94A3B8";

  // Card entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Arc progress spring
  const arcSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 60, mass: 1.1 },
  });

  // Geometry: Radius 180px
  const radius = 180;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius; // ~1131px

  const currentFrac = Math.min(1, Math.max(0, (primaryPercentage / 100) * arcSpring));
  const strokeDashoffset = circumference * (1 - currentFrac);

  // Live count-up percentage for center display
  const rollingPercent = (currentFrac * 100).toFixed(1);

  // Spark tip coordinate on the leading edge of the arc
  // Starts at top (-90 deg), sweeps clockwise
  const tipAngleDeg = -90 + currentFrac * 360;
  const tipRad = (tipAngleDeg * Math.PI) / 180;
  const tipX = radius * Math.cos(tipRad);
  const tipY = radius * Math.sin(tipRad);

  return (
    <div
      style={{
        position: "relative",
        width: "920px",
        height: "640px",
        transform: `scale(${scale * entrance})`,
        transformOrigin: "center center",
        backgroundColor: cardBg,
        border: cardBorder,
        borderRadius: isDoc ? "6px" : "16px",
        boxShadow: isDoc
          ? "0 16px 36px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)"
          : "0 24px 48px rgba(0,0,0,0.65), 0 0 30px rgba(16, 185, 129, 0.15)",
        padding: "36px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* ── CARD HEADER ── */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.14em",
                color: isDoc ? "#B45309" : "#10B981",
                backgroundColor: isDoc ? "#FEF3C7" : "rgba(16, 185, 129, 0.15)",
                padding: "3px 8px",
                borderRadius: isDoc ? "3px" : "9999px",
                border: isDoc ? "1px solid #F59E0B" : "1px solid rgba(16, 185, 129, 0.35)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {isDoc ? "FORENSIC MONOPOLY METRIC" : "ALLOCATION BREAKDOWN"}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: labelColor }}>
              {subtitle}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: isDoc ? "#1E293B" : "#F8FAFC",
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* ── MAIN DONUT STAGE (CENTER GAUGE + HUB) ── */}
      <div style={{ position: "relative", width: "420px", height: "420px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg
          width="420"
          height="420"
          viewBox="-210 -210 420 420"
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        >
          <defs>
            {/* Glowing filter for tech mode */}
            <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={primaryColor} floodOpacity="0.75" />
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />

          {/* Animated Progress Arc */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90)"
            filter={isDoc ? "none" : "url(#donutGlow)"}
          />

          {/* Leading Spark Cap */}
          {currentFrac > 0.03 && (
            <circle
              cx={tipX}
              cy={tipY}
              r={strokeWidth * 0.42}
              fill="#FFFFFF"
              stroke={primaryColor}
              strokeWidth="2.5"
            />
          )}
        </svg>

        {/* ── CENTER HUB: GIANT PERCENTAGE COUNTER ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: isDoc ? "#0F172A" : "#FFFFFF",
              fontFamily: "'Space Grotesk', monospace",
              lineHeight: 1,
            }}
          >
            {rollingPercent}%
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: primaryColor,
              marginTop: "4px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {primaryLabel}
          </span>
        </div>
      </div>

      {/* ── BOTTOM SEGMENT BREAKDOWN LEGEND PILLS ── */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {segments.map((seg, idx) => (
          <div
            key={`seg-${idx}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "4px",
              backgroundColor: isDoc ? "#FFFDF7" : "rgba(255,255,255,0.05)",
              border: isDoc ? "1px solid #E2D9C5" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: seg.color,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: isDoc ? "#1E293B" : "#F8FAFC",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {seg.label}:
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 900,
                color: seg.color,
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              {seg.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
