import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { CharacterBoil } from "./CharacterBoil";
import { getFontFamily, FONTS } from "../utils/fonts";

export interface InteractiveRouteMapProps {
  /** Origin location name (e.g. "LOS GATOS, CA" or "SILICON VALLEY") */
  originName?: string;
  /** Destination location name (e.g. "GLOBAL MARKET" or "NEW YORK") */
  destinationName?: string;
  /** Route badge label */
  routeTag?: string;
  /** Primary accent color (default: #FFE600) */
  color?: string;
  /** Frame offset to begin route animation */
  enterAtFrame?: number;
  /** Width in px */
  width?: number;
  /** Height in px */
  height?: number;
  /** Optional container style */
  style?: React.CSSProperties;
}

const boilConfig = {
  rotationOscillation: { minDeg: -0.8, maxDeg: 0.8, periodFrames: 34 },
  scaleOscillation: { minScale: 0.995, maxScale: 1.005, periodFrames: 38 },
};

/**
 * Broadcast 2.5D Documentary Investigation Route Map Component (Vox & Johnny Harris Style).
 * Pure mathematical SVG vectors with zero layout reflow.
 */
export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  originName = "LOS GATOS, CA",
  destinationName = "GLOBAL EXPANSION",
  routeTag = "TRANSMISSION ROUTE // 01",
  color = "#FFE600",
  enterAtFrame = 4,
  width = 720,
  height = 420,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterAtFrame);
  if (localFrame < 0) return null;

  // Entrance spring
  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // Flight arc draw progress
  const flightDraw = interpolate(localFrame, [6, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Destination pin drop spring
  const pinSpring = spring({
    frame: Math.max(0, localFrame - 20),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // Pulse ring radar cycle
  const pulseScale = interpolate((localFrame % 30), [0, 30], [1, 2.8]);
  const pulseOpacity = interpolate((localFrame % 30), [0, 30], [0.8, 0]);

  return (
    <div style={{ position: "relative", width: `${width}px`, height: `${height}px`, ...style }}>
      <CharacterBoil config={boilConfig}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(16, 20, 28, 0.96)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "24px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.08)",
            padding: "20px",
            boxSizing: "border-box",
            overflow: "hidden",
            transform: `scale(${cardSpring})`,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "10px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#00E676",
                  boxShadow: "0 0 8px #00E676",
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", color: "#FFFFFF", letterSpacing: "1.2px" }}>
                MAP TELEMETRY ACTIVE
              </span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "13px", color: color, fontWeight: 700, letterSpacing: "1px" }}>
              {routeTag}
            </span>
          </div>

          {/* Map Vector Canvas */}
          <svg
            viewBox="0 0 680 320"
            style={{ width: "100%", height: "80%", overflow: "visible" }}
          >
            {/* Topo / Lat-Long Grid */}
            <line x1="20" y1="80" x2="660" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="20" y1="160" x2="660" y2="160" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="20" y1="240" x2="660" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="180" y1="20" x2="180" y2="300" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="360" y1="20" x2="360" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="540" y1="20" x2="540" y2="300" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Stylized Continent Silhouettes */}
            {/* Americas */}
            <path
              d="M 60 70 Q 120 60, 160 100 Q 180 150, 150 220 Q 120 280, 80 250 Q 50 180, 60 70 Z"
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.5"
            />
            {/* Eurasia / Africa */}
            <path
              d="M 280 80 Q 440 50, 560 90 Q 620 160, 540 240 Q 420 270, 360 210 Q 300 160, 280 80 Z"
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.5"
            />

            {/* Animated Curved Flight / Connection Path */}
            <path
              d="M 140 130 Q 340 20, 520 150"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeDasharray="8 6"
              strokeDashoffset={interpolate(flightDraw, [0, 1], [460, 0])}
              style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
            />

            {/* Origin Pin Point (Point A: 140, 130) */}
            <circle cx="140" cy="130" r="8" fill="#111113" stroke="#00E676" strokeWidth="3" />
            <circle cx="140" cy="130" r={8 * pulseScale} fill="none" stroke="#00E676" strokeWidth="2" opacity={pulseOpacity} />
            <text x="140" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="bold">
              {originName}
            </text>

            {/* Destination Pin Point (Point B: 520, 150) */}
            <g transform={`scale(${pinSpring})`} style={{ transformOrigin: "520px 150px" }}>
              <circle cx="520" cy="150" r="10" fill={color} stroke="#111113" strokeWidth="3" />
              <circle cx="520" cy="150" r={10 * pulseScale} fill="none" stroke={color} strokeWidth="2" opacity={pulseOpacity} />
              <text x="520" y="185" textAnchor="middle" fill={color} fontSize="14" fontFamily="monospace" fontWeight="900">
                {destinationName}
              </text>
            </g>
          </svg>
        </div>
      </CharacterBoil>
    </div>
  );
};
