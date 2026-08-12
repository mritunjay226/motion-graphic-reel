"use client";

import React from "react";
import { random, useCurrentFrame } from "remotion";
import { getFontFamily, FONTS } from "@/remotion/utils/fonts";

export interface RGBGlitchTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  glitchAt?: number;
  glitchDuration?: number;
  intensity?: number;
  seed?: string;
  speed?: number;
  className?: string;
}

export function RGBGlitchText({
  text,
  fontSize = 54,
  color = "#FFFFFF",
  fontWeight = 900,
  fontFamily,
  glitchAt = 20,
  glitchDuration = 8,
  intensity = 6,
  seed = "glitch",
  speed = 1,
  className,
}: RGBGlitchTextProps) {
  const frame = useCurrentFrame() * speed;

  const activeFont = getFontFamily(fontFamily || FONTS.bebasNeue);

  const textLen = text.length;
  let autoFontSize = fontSize;
  if (textLen > 40) {
    autoFontSize = Math.round(fontSize * 0.65);
  } else if (textLen > 24) {
    autoFontSize = Math.round(fontSize * 0.82);
  }

  const isGlitching = frame >= glitchAt && frame < glitchAt + glitchDuration;

  const offset = (axisSeed: string, scale: number) =>
    (random(`${seed}-${axisSeed}-${frame}`) * 2 - 1) * scale;

  const rX = isGlitching ? offset("r-x", intensity) : 0;
  const rY = isGlitching ? offset("r-y", intensity * 0.4) : 0;
  const gX = isGlitching ? offset("g-x", intensity) : 0;
  const gY = isGlitching ? offset("g-y", intensity * 0.4) : 0;
  const bX = isGlitching ? offset("b-x", intensity) : 0;
  const bY = isGlitching ? offset("b-y", intensity * 0.4) : 0;

  const copyOpacity = isGlitching ? 1 : 0;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    fontSize: `${autoFontSize}px`,
    fontWeight,
    letterSpacing: "2px",
    fontFamily: activeFont,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxWidth: "100%",
    lineHeight: 1.15,
    mixBlendMode: "screen",
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
        className={className}
        style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}
      >
        <span
          style={{
            position: "relative",
            fontSize: `${autoFontSize}px`,
            fontWeight,
            color,
            letterSpacing: "2px",
            lineHeight: 1.15,
            fontFamily: activeFont,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {text}
        </span>
        <span
          style={{
            ...baseStyle,
            color: "#ff0040",
            opacity: copyOpacity,
            transform: `translateX(${rX}px) translateY(${rY}px)`,
          }}
        >
          {text}
        </span>
        <span
          style={{
            ...baseStyle,
            color: "#00ff80",
            opacity: copyOpacity,
            transform: `translateX(${gX}px) translateY(${gY}px)`,
          }}
        >
          {text}
        </span>
        <span
          style={{
            ...baseStyle,
            color: "#0080ff",
            opacity: copyOpacity,
            transform: `translateX(${bX}px) translateY(${bY}px)`,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
