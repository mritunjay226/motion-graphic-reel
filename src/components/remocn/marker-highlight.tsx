"use client";

import React from "react";
import {
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getFontFamily, FONTS } from "@/remotion/utils/fonts";

export interface MarkerHighlightProps {
  before?: string;
  highlight: string;
  after?: string;
  markerColor?: string;
  baseColor?: string;
  highlightedTextColor?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  speed?: number;
  className?: string;
}

export function MarkerHighlight({
  before = "",
  highlight,
  after = "",
  markerColor = "#facc15",
  baseColor = "#171717",
  highlightedTextColor = "#171717",
  fontSize = 38,
  fontWeight = 800,
  fontFamily,
  speed = 1,
  className,
}: MarkerHighlightProps) {
  const frame = useCurrentFrame() * speed;
  const { fps } = useVideoConfig();

  const activeFont = getFontFamily(fontFamily || FONTS.bebasNeue);

  const fullLen = (before + highlight + after).length;
  let autoFontSize = fontSize;
  if (fullLen > 60) {
    autoFontSize = Math.round(fontSize * 0.68);
  } else if (fullLen > 35) {
    autoFontSize = Math.round(fontSize * 0.84);
  }

  const markerScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14 },
  });

  const textColor = interpolateColors(
    interpolate(markerScale, [0.5, 0.8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [baseColor, highlightedTextColor],
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <span
        className={className}
        style={{
          fontSize: `${autoFontSize}px`,
          fontWeight,
          color: baseColor,
          letterSpacing: "1px",
          lineHeight: 1.25,
          fontFamily: activeFont,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        {before}
        <span style={{ position: "relative", display: "inline-block", padding: "0 6px" }}>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: "0 -0.1em",
              background: markerColor,
              borderRadius: "4px",
              transformOrigin: "left center",
              transform: `scaleX(${markerScale}) rotate(-0.5deg)`,
              boxShadow: `0 4px 14px ${markerColor}66`,
              zIndex: 0,
            }}
          />
          <span style={{ position: "relative", zIndex: 1, color: textColor }}>
            {highlight}
          </span>
        </span>
        {after}
      </span>
    </div>
  );
}
