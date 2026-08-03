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
}

/**
 * Kinetic word-by-word caption system.
 *
 * Each word pops in at its startFrame using spring physics.
 * Highlight words receive a color boost and scale emphasis.
 * Words flow inline with automatic wrapping.
 */
export const WordByWordCaptions: React.FC<WordByWordCaptionsProps> = ({
  tokens,
  config,
  sceneStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = frame + sceneStartFrame;

  return (
    <div
      style={{
        position: "absolute",
        bottom: config.position.bottom,
        left: 0,
        right: 0,
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          config.position.horizontalAlign === "center" ? "center" : "flex-start",
        alignItems: "center",
        gap: "6px 10px",
        padding: "0 40px",
        zIndex: 100,
      }}
    >
      {tokens.map((token, i) => {
        const isVisible = absoluteFrame >= token.startFrame;
        if (!isVisible) return null;

        const localFrame = absoluteFrame - token.startFrame;
        const isHighlight = config.highlightWords.some(
          (hw) => token.word.replace(/[.,!?;:—]/g, "") === hw.replace(/[.,!?;:—]/g, "")
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

        const color = isHighlight ? config.highlightColor : config.textColor;

        return (
          <span
            key={`${token.word}-${i}`}
            style={{
              display: "inline-block",
              fontFamily: config.fontFamily,
              fontSize: config.fontSize,
              fontWeight: config.fontWeight,
              color,
              transform: `scale(${finalScale})`,
              transformOrigin: "center bottom",
              WebkitTextStroke: `${config.strokeWidth}px ${config.strokeColor}`,
              paintOrder: "stroke fill",
              textShadow: `${0}px ${config.shadowConfig.offsetY}px ${config.shadowConfig.blur}px ${config.shadowConfig.color}`,
              letterSpacing: "1px",
              lineHeight: 1.2,
              willChange: "transform",
            }}
          >
            {token.word}
          </span>
        );
      })}
    </div>
  );
};
