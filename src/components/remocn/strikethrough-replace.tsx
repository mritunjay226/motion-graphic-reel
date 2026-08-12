"use client";

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { getFontFamily, FONTS } from "@/remotion/utils/fonts";

export interface StrikethroughReplaceProps {
  from: string;
  to: string;
  lineColor?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  speed?: number;
  className?: string;
}

export function StrikethroughReplace({
  from,
  to,
  lineColor = "#ef4444",
  fontSize = 44,
  color = "#171717",
  fontWeight = 800,
  fontFamily,
  speed = 1,
  className,
}: StrikethroughReplaceProps) {
  const frame = useCurrentFrame() * speed;
  const { durationInFrames } = useVideoConfig();

  const activeFont = getFontFamily(fontFamily || FONTS.bebasNeue);

  const maxLen = Math.max(from.length, to.length);
  let autoFontSize = fontSize;
  if (maxLen > 50) {
    autoFontSize = Math.round(fontSize * 0.65);
  } else if (maxLen > 30) {
    autoFontSize = Math.round(fontSize * 0.82);
  }

  const strikeEnd = durationInFrames * 0.4;
  const fadeStart = durationInFrames * 0.4;
  const fadeEnd = durationInFrames * 0.6;

  const linePct = interpolate(frame, [0, strikeEnd], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fromOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const toOpacity = interpolate(frame, [fadeStart, fadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toY = interpolate(frame, [fadeStart, fadeEnd], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textStyle: React.CSSProperties = {
    fontSize: `${autoFontSize}px`,
    fontWeight,
    color,
    letterSpacing: "1.5px",
    fontFamily: activeFont,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxWidth: "100%",
    lineHeight: 1.2,
  };

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
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        {/* from text with strikethrough line */}
        <span
          className={className}
          style={{
            ...textStyle,
            position: "absolute",
            opacity: fromOpacity,
          }}
        >
          {from}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: Math.max(3, Math.round(autoFontSize * 0.08)),
              width: `${linePct}%`,
              background: lineColor,
              transform: "translateY(-50%)",
              borderRadius: 3,
              boxShadow: `0 0 10px ${lineColor}88`,
            }}
          />
        </span>

        {/* to text */}
        <span
          className={className}
          style={{
            ...textStyle,
            opacity: toOpacity,
            transform: `translateY(${toY}px)`,
          }}
        >
          {to}
        </span>
      </div>
    </div>
  );
}
