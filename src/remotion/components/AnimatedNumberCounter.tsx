import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { getFontFamily, FONTS } from "../utils/fonts";

export interface AnimatedNumberCounterProps {
  /** Target numeric value */
  toValue: number;
  /** Starting numeric value (default: 0) */
  fromValue?: number;
  /** Prefix text before number (e.g. "$", "€") */
  prefix?: string;
  /** Suffix text after number (e.g. "%", "X", " BILLION", " USERS") */
  suffix?: string;
  /** Decimal places to show */
  decimals?: number;
  /** Frame offset to begin rolling the counter */
  enterAtFrame?: number;
  /** Duration in frames to complete the count up */
  durationFrames?: number;
  /** Primary number font size in px */
  fontSize?: number;
  /** Primary text color */
  color?: string;
  /** Optional Delta badge (e.g. "+340% GROWTH" or "-85% LOSS") */
  deltaBadgeText?: string;
  /** Delta badge color */
  deltaBadgeColor?: "green" | "red" | "yellow";
  /** Font family */
  fontFamily?: string;
  /** Additional container styling */
  style?: React.CSSProperties;
}

/**
 * High-Retention Animated Metric & Financial Counter Component.
 *
 * Implements:
 * 1. High-speed smooth cubic mechanical number ticker
 * 2. Formatted number strings with comma separators and decimal precision
 * 3. Pop-in Delta indicator pill badge
 * 4. Micro-scale impact pulse when hitting the final target value
 */
export const AnimatedNumberCounter: React.FC<AnimatedNumberCounterProps> = ({
  toValue,
  fromValue = 0,
  prefix = "$",
  suffix = "",
  decimals = 0,
  enterAtFrame = 4,
  durationFrames = 28,
  fontSize = 84,
  color = "#111113",
  deltaBadgeText,
  deltaBadgeColor = "green",
  fontFamily = FONTS.bebasNeue,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterAtFrame);
  if (localFrame < 0) return null;

  // Entrance spring
  const entrySpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  // Numeric interpolation with custom fast-in ease-out curve
  const currentNumericValue = interpolate(
    localFrame,
    [0, durationFrames],
    [fromValue, toValue],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.12, 1, 0.25, 1),
    }
  );

  // Impact bounce when reaching target
  const impactSpring = spring({
    frame: Math.max(0, localFrame - durationFrames),
    fps,
    config: { damping: 12, stiffness: 240 },
  });
  const impactScale = interpolate(impactSpring, [0, 1], [1.0, 1.05]);

  // Delta badge entrance spring
  const badgeSpring = spring({
    frame: Math.max(0, localFrame - (durationFrames - 6)),
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  // Format number
  const formattedNumber = currentNumericValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const activeFontFamily = getFontFamily(fontFamily);

  const badgeBg =
    deltaBadgeColor === "green"
      ? "#00E676"
      : deltaBadgeColor === "red"
      ? "#FF1744"
      : "#FFE600";

  const badgeTextColor =
    deltaBadgeColor === "yellow" ? "#111113" : "#FFFFFF";

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${entrySpring * (localFrame >= durationFrames ? impactScale : 1.0)})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {/* ── MAIN NUMBER DISPLAY ── */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "4px",
          fontFamily: activeFontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          color,
          lineHeight: 1.0,
          letterSpacing: "2px",
          textShadow: color === "#FFFFFF" ? "0 4px 20px rgba(0,0,0,0.8)" : "0 2px 10px rgba(0,0,0,0.12)",
        }}
      >
        {prefix && <span style={{ opacity: 0.9, fontSize: `${Math.round(fontSize * 0.85)}px` }}>{prefix}</span>}
        <span>{formattedNumber}</span>
        {suffix && (
          <span style={{ fontSize: `${Math.round(fontSize * 0.65)}px`, letterSpacing: "1.5px", marginLeft: "4px", opacity: 0.95 }}>
            {suffix.toUpperCase()}
          </span>
        )}
      </div>

      {/* ── DELTA / GROWTH BADGE PILL ── */}
      {deltaBadgeText && localFrame >= durationFrames - 10 && (
        <div
          style={{
            marginTop: "12px",
            backgroundColor: badgeBg,
            color: badgeTextColor,
            fontFamily: getFontFamily(FONTS.inter),
            fontSize: "15px",
            fontWeight: 900,
            padding: "5px 16px",
            borderRadius: "999px",
            letterSpacing: "1px",
            boxShadow: `0 4px 14px ${badgeBg}66`,
            transform: `scale(${badgeSpring})`,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{deltaBadgeText.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
