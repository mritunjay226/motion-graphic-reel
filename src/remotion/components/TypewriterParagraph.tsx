"use client";

import React from "react";
import { useCurrentFrame } from "remotion";
import { getFontFamily, FONTS } from "../utils/fonts";

interface TypewriterParagraphProps {
  headline?: string;
  content: string;
  startFrameOffset?: number;
  color?: string;
  maxHeight?: number;
}

/**
 * TypewriterParagraph renders confidential document report cards
 * with letter-by-letter typewriter typing animation.
 * Equipped with dynamic character-based font auto-scaling to prevent off-screen text overflow.
 */
export const TypewriterParagraph: React.FC<TypewriterParagraphProps> = ({
  headline = "CONFIDENTIAL REPORT",
  content,
  startFrameOffset = 0,
  color = "#111111",
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrameOffset);

  // Character-length based font scaling tuned for 1080px canvas
  const textLen = content.length;
  let fontSize = 38;
  let lineHeight = 1.38;
  if (textLen > 140) {
    fontSize = 30;
    lineHeight = 1.32;
  } else if (textLen > 90) {
    fontSize = 34;
    lineHeight = 1.34;
  } else if (textLen > 50) {
    fontSize = 36;
    lineHeight = 1.36;
  }

  // Typewriter effect speed: 1 character every 1.1 frames
  const charIndex = Math.min(
    content.length,
    Math.floor(localFrame / 1.1)
  );

  const visibleText = content.slice(0, charIndex);
  const isTyping = charIndex < content.length;

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "4.5px solid #111111",
        borderRadius: "20px",
        padding: "24px 28px",
        boxShadow: "12px 12px 0px #111111",
        borderLeft: "12px solid #FFE600",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: getFontFamily(FONTS.spaceGrotesk),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "2.5px dashed #CCCCCC", paddingBottom: "8px" }}>
        <span style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "2px", color: "#333333", textTransform: "uppercase" }}>
          ● {headline}
        </span>
        <span style={{ fontSize: "18px", color: "#666666", fontWeight: 900, letterSpacing: "1.5px" }}>
          CLASSIFIED REF-99
        </span>
      </div>

      <p
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          color,
          lineHeight,
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {visibleText}
        {isTyping && (
          <span style={{ opacity: Math.sin(localFrame * 0.4) > 0 ? 1 : 0, color: "#FFE600", marginLeft: "4px" }}>
            █
          </span>
        )}
      </p>
    </div>
  );
};
