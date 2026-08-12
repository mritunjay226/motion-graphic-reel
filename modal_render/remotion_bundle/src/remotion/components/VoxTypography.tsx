import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { getFontFamily, FONTS } from "../utils/fonts";

type TypoEntrance =
  | "typewriter"
  | "slide_up_word"
  | "pop_letters"
  | "fade_in"
  | "stamp_in";

interface VoxTypographyProps {
  /** Text to display */
  text: string;
  /** Subtitle / tagline below the main text */
  subtitle?: string;
  /** Entrance animation type */
  entrance?: TypoEntrance;
  /** Frame offset to begin entrance */
  enterAtFrame?: number;
  /** Font size in px */
  fontSize?: number;
  /** Subtitle font size in px */
  subtitleFontSize?: number;
  /** Text color */
  color?: string;
  /** Subtitle color */
  subtitleColor?: string;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: number;
  /** Letter spacing */
  letterSpacing?: string;
  /** Text alignment */
  align?: "center" | "left" | "right";
  /** Uppercase */
  uppercase?: boolean;
  /** Vox yellow highlight marker on specific words */
  highlightWords?: string[];
  /** Highlight background color (optional yellow marker sweep) */
  highlightBg?: string;
  /** Highlight word font color */
  highlightColor?: string;
  /** Highlight word scale multiplier */
  highlightScale?: number;
  /** Enable crisp text shadow for readability */
  textShadow?: string;
}

/**
 * Vox-style Smart Attention Typography Component.
 *
 * Directs viewer eye focus by dynamically scaling key emphasis terms (1.35x size, bold red/vibrant accent),
 * while keeping setup words clean, crisp, and beautifully styled with loaded Google Fonts.
 */
export const VoxTypography: React.FC<VoxTypographyProps> = ({
  text,
  subtitle,
  entrance = "slide_up_word",
  enterAtFrame = 0,
  fontSize = 76,
  subtitleFontSize = 24,
  color = "#111111",
  subtitleColor = "#444444",
  fontFamily = FONTS.bebasNeue,
  fontWeight = 900,
  letterSpacing = "2px",
  align = "center",
  uppercase = true,
  highlightWords = [],
  highlightBg = "#FFE500",
  highlightColor = "#D61C1C",
  highlightScale = 1.2,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - enterAtFrame;

  if (localFrame < 0) return null;

  const words = text.split(" ");
  const activeFontFamily = getFontFamily(fontFamily);

  // Scaled typography sizing to ensure high mobile readability
  const textLen = text.length;
  const maxWordLen = Math.max(...words.map((w) => w.length));
  
  let scaleMultiplier = 1.0;
  if (maxWordLen > 12 || textLen > 30) {
    scaleMultiplier = 0.82;
  } else if (maxWordLen > 8 || textLen > 18) {
    scaleMultiplier = 0.90;
  }

  const autoFontSize = Math.max(64, Math.round(fontSize * scaleMultiplier));

  // Smart high contrast text shadow default
  const defaultTextShadow =
    textShadow ||
    (color === "#FFFFFF" || color.startsWith("rgba(255")
      ? "0 4px 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9)"
      : "0 2px 10px rgba(0,0,0,0.12)");

  const renderWord = (word: string, index: number) => {
    const isHighlight = highlightWords.some(
      (hw) => word.replace(/[.,!?;:—$]/g, "").toLowerCase() === hw.toLowerCase()
    );

    // Per-word staggered entrance
    const wordDelay = index * 3;
    const wordLocalFrame = Math.max(0, localFrame - wordDelay);

    let wordOpacity = 1;
    let wordTranslateY = 0;
    let wordScale = 1;

    if (entrance === "slide_up_word") {
      const s = spring({ frame: wordLocalFrame, fps, config: { damping: 16, stiffness: 120 } });
      wordOpacity = interpolate(s, [0, 1], [0, 1]);
      wordTranslateY = interpolate(s, [0, 1], [40, 0]);
    } else if (entrance === "pop_letters") {
      const s = spring({ frame: wordLocalFrame, fps, config: { damping: 10, stiffness: 200 } });
      wordOpacity = interpolate(s, [0, 1], [0, 1]);
      wordScale = interpolate(s, [0, 1], [0.3, 1]);
    } else if (entrance === "stamp_in") {
      const s = spring({ frame: wordLocalFrame, fps, config: { damping: 8, stiffness: 300 } });
      wordOpacity = interpolate(s, [0, 1], [0, 1]);
      wordScale = interpolate(s, [0, 1], [3, 1]);
    } else if (entrance === "typewriter") {
      wordOpacity = wordLocalFrame >= 0 ? 1 : 0;
    } else {
      const s = spring({ frame: wordLocalFrame, fps, config: { damping: 14, stiffness: 100 } });
      wordOpacity = interpolate(s, [0, 1], [0, 1]);
    }

    const finalWordScale = isHighlight ? wordScale * highlightScale : wordScale;
    const isRedHighlight = highlightColor === "#D61C1C" || highlightColor === "#E50914";
    const boxBg = isHighlight ? (highlightBg || (isRedHighlight ? "#FFFFFF" : "#FFE600")) : "transparent";
    const finalWordColor = isHighlight
      ? (boxBg === "#FFFFFF" ? "#D61C1C" : "#111111")
      : color;

    return (
      <span
        key={`${word}-${index}`}
        style={{
          display: "inline-block",
          position: "relative",
          opacity: wordOpacity,
          transform: `translateY(${wordTranslateY}px) scale(${finalWordScale})`,
          transformOrigin: "center bottom",
          marginRight: "14px",
          padding: isHighlight ? "6px 20px" : "0",
          backgroundColor: isHighlight ? boxBg : "transparent",
          border: isHighlight ? "4.5px solid #111111" : "none",
          borderRadius: isHighlight ? "6px" : "0",
          boxShadow: isHighlight ? "8px 8px 0px #111111" : "none",
          color: finalWordColor,
          fontWeight: 900,
          lineHeight: 1.1,
          textShadow: isHighlight ? "none" : defaultTextShadow,
          willChange: "transform, opacity",
        }}
      >
        {uppercase ? word.toUpperCase() : word}
      </span>
    );
  };

  // Subtitle entrance
  const subtitleDelay = words.length * 3 + 5;
  const subtitleLocalFrame = Math.max(0, localFrame - subtitleDelay);
  const subtitleSpring = spring({
    frame: subtitleLocalFrame,
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        textAlign: align,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Main Headline */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "8px 14px",
          justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          fontFamily: activeFontFamily,
          fontSize: `${autoFontSize}px`,
          fontWeight,
          letterSpacing,
          lineHeight: 1.15,
          maxWidth: "100%",
          wordBreak: "break-word",
        }}
      >
        {words.map(renderWord)}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily: getFontFamily(FONTS.inter),
            fontSize: `${subtitleFontSize}px`,
            fontWeight: 600,
            color: subtitleColor,
            letterSpacing: "1px",
            marginTop: "10px",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textShadow: defaultTextShadow,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
