import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import type { WhisperToken, KineticCaptionConfig } from "../types";

interface WordByWordCaptionsProps {
  /** Whisper word tokens with frame timing */
  tokens: WhisperToken[];
  /** Kinetic caption styling config */
  config: KineticCaptionConfig;
  /** Scene start frame (absolute) — tokens use absolute frames */
  sceneStartFrame: number;
  /** Theme font family override */
  themeFontFamily?: string;
  /** Theme caption text color override */
  themeTextColor?: string;
  /** Theme caption highlight color override */
  themeHighlightColor?: string;
  /** Theme caption highlight background override (Vox Yellow Marker) */
  themeHighlightBg?: string;
  /** Theme shadow color override */
  themeShadowColor?: string;
}

/**
 * Kinetic word-by-word caption system with theme palette & Vox highlighter box integration.
 *
 * Each word pops in at its startFrame using spring physics.
 * Highlight words receive a Vox yellow marker box or scale/color emphasis.
 * Words are contained within a legible semi-transparent frosted container.
 */
export const WordByWordCaptions: React.FC<WordByWordCaptionsProps> = ({
  tokens,
  config,
  sceneStartFrame,
  themeFontFamily,
  themeTextColor,
  themeHighlightColor,
  themeHighlightBg,
  themeShadowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = frame + sceneStartFrame;

  const fontFamily = themeFontFamily || config.fontFamily;
  const baseTextColor = themeTextColor || config.textColor;
  const highlightTextColor = themeHighlightBg ? "#000000" : (themeHighlightColor || config.highlightColor);
  const shadowColor = themeShadowColor || config.shadowConfig.color;

  return (
    <div
      style={{
        position: "absolute",
        bottom: config.position.bottom || 240,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 12px",
        padding: "14px 28px",
        maxWidth: "92%",
        background: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        zIndex: 100,
      }}
    >
      {tokens.map((token, i) => {
        const isVisible = absoluteFrame >= token.startFrame;
        if (!isVisible) return null;

        const localFrame = absoluteFrame - token.startFrame;
        const isHighlight = config.highlightWords.some(
          (hw) => token.word.replace(/[.,!?;:—]/g, "").toLowerCase() === hw.replace(/[.,!?;:—]/g, "").toLowerCase()
        );

        // Spring animation for pop-in
        const popScale = spring({
          frame: localFrame,
          fps,
          config: {
            damping: config.springConfig.damping,
            stiffness: config.springConfig.stiffness,
            mass: config.springConfig.mass ?? 0.5,
          },
        });

        const finalScale = isHighlight
          ? popScale * config.highlightScale
          : popScale;

        const textColor = isHighlight ? highlightTextColor : baseTextColor;

        // Vox Yellow Highlighter Box style
        const highlightBgStyle: React.CSSProperties = isHighlight && themeHighlightBg
          ? {
              backgroundColor: themeHighlightBg,
              color: "#000000",
              padding: "2px 10px",
              borderRadius: "4px",
              boxShadow: "0 4px 14px rgba(255, 230, 0, 0.45)",
              WebkitTextStroke: "0px transparent",
            }
          : {
              WebkitTextStroke: `${config.strokeWidth}px ${config.strokeColor}`,
            };

        return (
          <span
            key={`${token.word}-${i}`}
            style={{
              display: "inline-block",
              fontFamily,
              fontSize: config.fontSize,
              fontWeight: config.fontWeight,
              color: textColor,
              transform: `scale(${finalScale})`,
              transformOrigin: "center bottom",
              paintOrder: "stroke fill",
              textShadow: isHighlight && themeHighlightBg ? "none" : `0px ${config.shadowConfig.offsetY}px ${config.shadowConfig.blur}px ${shadowColor}`,
              letterSpacing: "1px",
              lineHeight: 1.2,
              willChange: "transform",
              ...highlightBgStyle,
            }}
          >
            {token.word}
          </span>
        );
      })}
    </div>
  );
};
