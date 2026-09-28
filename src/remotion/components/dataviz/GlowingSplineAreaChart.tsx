import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface DataPoint {
  xLabel: string;
  value: number;
  displayValue?: string;
}

export interface GlowingSplineAreaChartProps {
  title?: string;
  subtitle?: string;
  data?: DataPoint[];
  startFrame?: number;
  aesthetic?: "documentary" | "tech";
  accentColor?: string;
  metricPrefix?: string;
  metricSuffix?: string;
  scale?: number;
}

const DEFAULT_DATA: DataPoint[] = [
  { xLabel: "2018", value: 120, displayValue: "$120M" },
  { xLabel: "2019", value: 240, displayValue: "$240M" },
  { xLabel: "2020", value: 410, displayValue: "$410M" },
  { xLabel: "2021", value: 680, displayValue: "$680M" },
  { xLabel: "2022", value: 1150, displayValue: "$1.15B" },
  { xLabel: "2023", value: 1980, displayValue: "$1.98B" },
  { xLabel: "2024", value: 3120, displayValue: "$3.12T" },
];

/**
 * GLOWING SPLINE AREA CHART (Advanced Data Visualization)
 *
 * Smooth cubic Bézier spline interpolation with animated stroke draw,
 * translucent area fill, exact parametric leading radar dot, and floating value tooltip.
 *
 * Supports both "documentary" (Vox archival paper) and "tech" (Linear dark neon) aesthetics.
 */
export const GlowingSplineAreaChart: React.FC<GlowingSplineAreaChartProps> = ({
  title = "VALUATION TRAJECTORY",
  subtitle = "MARKET CAPITALIZATION SURGE (2018 - 2024)",
  data = DEFAULT_DATA,
  startFrame = 8,
  aesthetic = "documentary",
  accentColor,
  metricPrefix = "$",
  metricSuffix = "",
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDoc = aesthetic === "documentary";

  // Palette tokens based on aesthetic
  const primaryColor = accentColor || (isDoc ? "#DC2626" : "#06B6D4");
  const areaGradientTop = isDoc ? "rgba(220, 38, 38, 0.35)" : "rgba(6, 182, 212, 0.4)";
  const areaGradientBottom = isDoc ? "rgba(220, 38, 38, 0.0)" : "rgba(6, 182, 212, 0.0)";
  const cardBg = isDoc ? "#FAF5E8" : "#0F172A";
  const cardBorder = isDoc ? "2px solid #D6CEBE" : "1px solid rgba(255,255,255,0.12)";
  const gridLineColor = isDoc ? "rgba(180, 160, 130, 0.35)" : "rgba(255, 255, 255, 0.08)";
  const labelColor = isDoc ? "#5C5042" : "#94A3B8";

  // Card entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Spline line draw spring: 0 to 1
  const drawSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, stiffness: 55, mass: 1.1 },
  });

  // Chart Dimensions
  const chartW = 760;
  const chartH = 340;
  const padLeft = 80;
  const padTop = 60;
  const baselineY = padTop + chartH;

  // Normalize data points to canvas coordinates
  const { points, splinePath, areaPath, segments } = useMemo(() => {
    const vals = data.map((d) => d.value);
    const minVal = 0;
    const maxVal = Math.max(...vals) * 1.12;

    const coords = data.map((d, i) => {
      const x = padLeft + (i / (data.length - 1)) * chartW;
      const normalizedY = (d.value - minVal) / (maxVal - minVal);
      const y = baselineY - normalizedY * chartH;
      return { x, y, ...d };
    });

    // Compute smooth cubic Bézier control points
    const segs: Array<{
      p0: { x: number; y: number };
      p1: { x: number; y: number };
      c1: { x: number; y: number };
      c2: { x: number; y: number };
      val0: number;
      val1: number;
    }> = [];

    let pathD = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 0; i < coords.length - 1; i++) {
      const pPrev = coords[Math.max(0, i - 1)];
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const pNext = coords[Math.min(coords.length - 1, i + 2)];

      const c1x = p0.x + (p1.x - pPrev.x) / 6;
      const c1y = p0.y + (p1.y - pPrev.y) / 6;
      const c2x = p1.x - (pNext.x - p0.x) / 6;
      const c2y = p1.y - (pNext.y - p0.y) / 6;

      pathD += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.x} ${p1.y}`;

      segs.push({
        p0: { x: p0.x, y: p0.y },
        p1: { x: p1.x, y: p1.y },
        c1: { x: c1x, y: c1y },
        c2: { x: c2x, y: c2y },
        val0: p0.value,
        val1: p1.value,
      });
    }

    const lastCoord = coords[coords.length - 1];
    const firstCoord = coords[0];
    const areaD = `${pathD} L ${lastCoord.x} ${baselineY} L ${firstCoord.x} ${baselineY} Z`;

    return { points: coords, splinePath: pathD, areaPath: areaD, segments: segs };
  }, [data]);

  // Parametric tracking of leading radar point along the cubic Bézier curve
  const clampedT = Math.max(0.001, Math.min(0.999, drawSpring));
  const numSegments = segments.length;
  const globalProgress = clampedT * numSegments;
  const currentSegIdx = Math.min(numSegments - 1, Math.floor(globalProgress));
  const u = globalProgress - currentSegIdx; // local u in [0, 1]

  const activeSeg = segments[currentSegIdx];
  // Cubic Bézier formula: B(u) = (1-u)^3 P0 + 3(1-u)^2 u C1 + 3(1-u) u^2 C2 + u^3 P1
  const u1 = 1 - u;
  const leadX =
    Math.pow(u1, 3) * activeSeg.p0.x +
    3 * Math.pow(u1, 2) * u * activeSeg.c1.x +
    3 * u1 * Math.pow(u, 2) * activeSeg.c2.x +
    Math.pow(u, 3) * activeSeg.p1.x;

  const leadY =
    Math.pow(u1, 3) * activeSeg.p0.y +
    3 * Math.pow(u1, 2) * u * activeSeg.c1.y +
    3 * u1 * Math.pow(u, 2) * activeSeg.c2.y +
    Math.pow(u, 3) * activeSeg.p1.y;

  const currentValue = Math.round(activeSeg.val0 + u * (activeSeg.val1 - activeSeg.val0));

  // Pulse ripple cycle
  const rippleAge = (frame - startFrame) % 18;
  const rippleScale = interpolate(rippleAge, [0, 18], [1, 2.4]);
  const rippleOpacity = interpolate(rippleAge, [0, 18], [0.9, 0]);

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
          : "0 24px 48px rgba(0,0,0,0.65), 0 0 30px rgba(6, 182, 212, 0.15)",
        padding: "36px 40px",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* ── CARD HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            {isDoc ? (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "0.14em",
                  color: "#B45309",
                  backgroundColor: "#FEF3C7",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  border: "1px solid #F59E0B",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                DOCUMENTARY AUDIT
              </span>
            ) : (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "#06B6D4",
                  backgroundColor: "rgba(6, 182, 212, 0.15)",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(6, 182, 212, 0.35)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                REALTIME TELEMETRY
              </span>
            )}
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

        {/* Live Top Metric Callout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            backgroundColor: isDoc ? "#FFFDF7" : "rgba(255,255,255,0.04)",
            border: isDoc ? "1px solid #E2D9C5" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            padding: "6px 14px",
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 800, color: labelColor, letterSpacing: "0.1em" }}>
            PEAK SURGE
          </span>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: primaryColor,
              fontFamily: "'Space Grotesk', monospace",
              lineHeight: 1.1,
            }}
          >
            {data[data.length - 1].displayValue || `${metricPrefix}${data[data.length - 1].value}${metricSuffix}`}
          </span>
        </div>
      </div>

      {/* ── SVG CHART VIEWPORT ── */}
      <div style={{ position: "relative", width: "100%", height: "460px", overflow: "visible" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 920 460"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Area Translucent Gradient */}
            <linearGradient id="splineAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={areaGradientTop} />
              <stop offset="100%" stopColor={areaGradientBottom} />
            </linearGradient>

            {/* Glowing Stroke Filter for Tech Mode */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* ── 1. HORIZONTAL & VERTICAL GRID LINES ── */}
          {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const gy = baselineY - frac * chartH;
            return (
              <g key={`grid-${idx}`}>
                <line
                  x1={padLeft}
                  y1={gy}
                  x2={padLeft + chartW}
                  y2={gy}
                  stroke={gridLineColor}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}
          {/* Baseline X Axis */}
          <line
            x1={padLeft}
            y1={baselineY}
            x2={padLeft + chartW}
            y2={baselineY}
            stroke={isDoc ? "#64748B" : "#475569"}
            strokeWidth="2"
          />

          {/* ── 2. TRANSLUCENT AREA FILL ── */}
          <path d={areaPath} fill="url(#splineAreaGrad)" opacity={Math.min(1, drawSpring * 1.2)} />

          {/* ── 3. GLOWING CUBIC BÉZIER SPLINE STROKE ── */}
          <path
            d={splinePath}
            fill="none"
            stroke={primaryColor}
            strokeWidth={isDoc ? "4.5" : "4"}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1000}
            strokeDasharray={1000}
            strokeDashoffset={1000 * (1 - drawSpring)}
            filter={isDoc ? "none" : "url(#neonGlow)"}
          />

          {/* ── 4. X-AXIS LABELS (YEARS / QUARTERS) ── */}
          {points.map((pt, idx) => (
            <text
              key={`x-lbl-${idx}`}
              x={pt.x}
              y={baselineY + 28}
              textAnchor="middle"
              fill={labelColor}
              fontSize="14"
              fontWeight="700"
              fontFamily="'Space Grotesk', sans-serif"
            >
              {pt.xLabel}
            </text>
          ))}
        </svg>

        {/* ── 5. EXACT PARAMETRIC LEADING RADAR DOT ── */}
        {drawSpring > 0.02 && (
          <div
            style={{
              position: "absolute",
              left: `${(leadX / 920) * 100}%`,
              top: `${(leadY / 460) * 100}%`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 15,
            }}
          >
            {/* Pulsing Ripple Ring */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: `2px solid ${primaryColor}`,
                transform: `translate(-50%, -50%) scale(${rippleScale})`,
                opacity: rippleOpacity,
              }}
            />
            {/* Center Core Dot */}
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                border: `3px solid ${primaryColor}`,
                boxShadow: `0 0 10px ${primaryColor}`,
              }}
            />

            {/* Floating Value Tooltip Pill */}
            <div
              style={{
                position: "absolute",
                bottom: "22px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: isDoc ? "#1E293B" : "#020617",
                border: `2px solid ${primaryColor}`,
                borderRadius: "6px",
                padding: "4px 10px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                {metricPrefix}
                {currentValue.toLocaleString()}
                {metricSuffix}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
