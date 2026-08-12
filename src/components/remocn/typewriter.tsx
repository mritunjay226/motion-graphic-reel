"use client";

import React from "react";
import { Caret } from "@/components/remocn/caret";
import { useTypewriter } from "@/lib/remocn-ui";
import { getFontFamily, FONTS } from "@/remotion/utils/fonts";

export interface TypewriterProps {
  text: string;
  cursor?: boolean;
  charsPerSecond?: number;
  speed?: number;
  fontSize?: number;
  color?: string;
  cursorColor?: string;
  fontWeight?: number;
  fontFamily?: string;
  className?: string;
}

export function Typewriter({
  text,
  cursor = true,
  charsPerSecond = 22,
  speed = 1,
  fontSize = 32,
  color = "#171717",
  cursorColor = "#FFE600",
  fontWeight = 700,
  fontFamily,
  className,
}: TypewriterProps) {
  const tw = useTypewriter(text, { cps: charsPerSecond, speed });
  const activeFontFamily = getFontFamily(fontFamily || FONTS.spaceGrotesk);

  // Dynamic character-based font auto-scaling to prevent screen overflow
  const textLen = text.length;
  let autoFontSize = fontSize;
  if (textLen > 120) {
    autoFontSize = Math.round(fontSize * 0.55);
  } else if (textLen > 70) {
    autoFontSize = Math.round(fontSize * 0.72);
  } else if (textLen > 40) {
    autoFontSize = Math.round(fontSize * 0.86);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
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
          letterSpacing: "0.5px",
          lineHeight: 1.35,
          fontFamily: activeFontFamily,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxWidth: "100%",
        }}
      >
        {tw.text}
        {cursor && (
          <Caret
            color={cursorColor}
            blink={!tw.typing}
            speed={speed}
            radius={0}
            style={{
              width: "0.12em",
              height: "1em",
              marginLeft: "0.06em",
              verticalAlign: "text-bottom",
            }}
          />
        )}
      </span>
    </div>
  );
}
