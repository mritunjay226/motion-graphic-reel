"use client";

import React from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { getFontFamily, FONTS } from "@/remotion/utils/fonts";

export interface MatrixDecodeProps {
  text: string;
  charset?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  revealDuration?: number;
  speed?: number;
  className?: string;
}

export function MatrixDecode({
  text,
  charset = "!@#$%^&*()_+-=<>?/\\|",
  fontSize = 44,
  color = "#22c55e",
  fontWeight = 800,
  fontFamily,
  revealDuration = 60,
  speed = 1,
  className,
}: MatrixDecodeProps) {
  const frame = useCurrentFrame() * speed;
  useVideoConfig();

  const activeFont = getFontFamily(fontFamily || FONTS.spaceGrotesk);

  // Dynamic character-based auto font scaling
  const textLen = text.length;
  let autoFontSize = fontSize;
  if (textLen > 60) {
    autoFontSize = Math.round(fontSize * 0.65);
  } else if (textLen > 35) {
    autoFontSize = Math.round(fontSize * 0.82);
  }

  let output = "";
  for (let i = 0; i < text.length; i++) {
    const revealFrame = (i / Math.max(text.length, 1)) * revealDuration;
    if (text[i] === " ") {
      output += " ";
    } else if (frame >= revealFrame) {
      output += text[i];
    } else {
      const r = random(`${i}-${Math.floor(frame / 2)}`);
      const ch = charset[Math.floor(r * charset.length)];
      output += ch;
    }
  }

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
          letterSpacing: "1.5px",
          lineHeight: 1.25,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxWidth: "100%",
          fontFamily: activeFont,
          textShadow: "0 0 16px rgba(34, 197, 94, 0.4)",
        }}
      >
        {output}
      </span>
    </div>
  );
}
