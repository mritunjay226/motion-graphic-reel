"use client";

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { getFontFamily, FONTS } from "@/remotion/utils/fonts";

export interface SoftBlurInProps {
  text: string;
  blur?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  speed?: number;
  className?: string;
}

export function SoftBlurIn({
  text,
  blur = 12,
  fontSize = 48,
  color = "#FFFFFF",
  fontWeight = 800,
  fontFamily,
  speed = 1,
  className,
}: SoftBlurInProps) {
  const frame = useCurrentFrame() * speed;

  const activeFont = getFontFamily(fontFamily || FONTS.montserrat);

  const textLen = text.length;
  let autoFontSize = fontSize;
  if (textLen > 40) {
    autoFontSize = Math.round(fontSize * 0.65);
  } else if (textLen > 24) {
    autoFontSize = Math.round(fontSize * 0.82);
  }

  const chars = Array.from(text);
  const charDurationFrames = 27;
  const charTravelFrames = 9;
  const staggerFrames = 1;

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
          color,
          letterSpacing: "1px",
          lineHeight: 1.2,
          textAlign: "center",
          fontFamily: activeFont,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxWidth: "100%",
          textShadow: "0 4px 18px rgba(0,0,0,0.8)",
        }}
      >
        {chars.map((char, i) => {
          const local = frame - i * staggerFrames;
          const easing = Easing.bezier(0.22, 1, 0.36, 1);
          const opacity = interpolate(local, [0, charDurationFrames], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing,
          });
          const y = interpolate(local, [0, charTravelFrames], [16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing,
          });
          const blurAmount = interpolate(
            local,
            [0, charDurationFrames],
            [blur, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
          );
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre-wrap",
                backfaceVisibility: "hidden",
                transformOrigin: "50% 55%",
                opacity,
                transform: `translateY(${y}px)`,
                filter: `blur(${blurAmount}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </div>
  );
}
