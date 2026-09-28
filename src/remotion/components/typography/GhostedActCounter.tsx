import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { getFontFamily, FONTS } from "../../utils/fonts";

export interface GhostedActCounterProps {
  /** The primary large numeral or act token (e.g. "01", "02", "ACT I", "PART 03") */
  counterText: string;
  /** Optional secondary kicker label (e.g. "THE CRACKDOWN", "PHASE 01: THE ORIGIN") */
  kickerText?: string;
  /** Frame when the element enters (default 2) */
  enterAtFrame?: number;
  /** Primary font size for the large counter (default 320) */
  fontSize?: number;
  /** Text color (default dark slate for paper, or white for dark canvas) */
  color?: string;
  /** Ghost opacity level (0.05 to 0.25, default 0.12) */
  opacity?: number;
  /** Font family override */
  fontFamily?: string;
  /** Top vertical placement (default "420px") */
  top?: string | number;
  /** Horizontal alignment: "center" | "left" | "right" (default "center") */
  alignment?: "center" | "left" | "right";
  /** Whether to show technical crosshair framing markers */
  showFramingMarkers?: boolean;
}

export const GhostedActCounter: React.FC<GhostedActCounterProps> = ({
  counterText,
  kickerText,
  enterAtFrame = 2,
  fontSize = 320,
  color = "#0F172A",
  opacity = 0.12,
  fontFamily,
  top = "420px",
  alignment = "center",
  showFramingMarkers = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterAtFrame);

  // Entrance spring: majestic upward fade and subtle settle
  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1.2 },
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.92, 1.0]);
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, opacity]);
  const enterY = interpolate(enterSpring, [0, 1], [30, 0]);

  // Continuous subtle parallax scale drift (1.0 -> 1.06) over scene duration
  const driftScale = interpolate(frame, [0, 150], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(frame, [0, 150], [0, -12], {
    extrapolateRight: "clamp",
  });

  const activeFont = fontFamily || getFontFamily(FONTS.bebasNeue);
  const kickerFont = getFontFamily(FONTS.spaceGrotesk);

  const alignStyles: React.CSSProperties =
    alignment === "left"
      ? { left: "80px", alignItems: "flex-start", textAlign: "left" }
      : alignment === "right"
      ? { right: "80px", alignItems: "flex-end", textAlign: "right" }
      : {
          left: "50%",
          transform: `translateX(-50%) translateY(${enterY + driftY}px) scale(${
            enterScale * driftScale
          })`,
          alignItems: "center",
          textAlign: "center",
        };

  return (
    <div
      style={{
        position: "absolute",
        top,
        width: "920px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: enterOpacity,
        pointerEvents: "none",
        zIndex: 5,
        ...alignStyles,
        ...(alignment !== "center"
          ? {
              transform: `translateY(${enterY + driftY}px) scale(${
                enterScale * driftScale
              })`,
            }
          : {}),
      }}
    >
      {/* Optional Top Kicker Line with Editorial Framing */}
      {kickerText && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "-12px",
            opacity: 0.9,
          }}
        >
          {showFramingMarkers && (
            <span
              style={{
                fontFamily: kickerFont,
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.2em",
                color,
              }}
            >
              [ //
            </span>
          )}
          <span
            style={{
              fontFamily: kickerFont,
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color,
            }}
          >
            {kickerText}
          </span>
          {showFramingMarkers && (
            <span
              style={{
                fontFamily: kickerFont,
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.2em",
                color,
              }}
            >
              // ]
            </span>
          )}
        </div>
      )}

      {/* Massive Ghosted Counter Numerals */}
      <span
        style={{
          fontFamily: activeFont,
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          color,
          userSelect: "none",
          whiteSpace: "nowrap",
          textShadow: "0 20px 60px rgba(0,0,0,0.06)",
        }}
      >
        {counterText}
      </span>
    </div>
  );
};
