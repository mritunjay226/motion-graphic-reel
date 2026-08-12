import React, { useMemo } from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import type { WhisperToken, KineticCaptionConfig } from "../types";
import { getFontFamily, FONTS } from "../utils/fonts";

interface WordByWordCaptionsProps {
  /** Whisper word tokens with frame timing */
  tokens: WhisperToken[];
  /** Kinetic caption styling config */
  config?: Partial<KineticCaptionConfig>;
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
  /** Max words per subtitle page (default 6 for 1-2 clean lines) */
  maxWordsPerPage?: number;
}

/**
 * Paged Word-by-Word Caption System (1-2 Clean Lines Max).
 *
 * Chunks narration tokens into clean 5-6 word pages that pop in and out,
 * ensuring subtitles NEVER accumulate into long 5-6 line blocks.
 * Rendered with loaded Google Fonts, high-contrast stroke outlines, and active word pop animations.
 */
export const WordByWordCaptions: React.FC<WordByWordCaptionsProps> = ({
  tokens,
  config = {},
  sceneStartFrame,
  themeFontFamily,
  themeTextColor,
  themeHighlightColor,
  themeHighlightBg,
  themeShadowColor,
  maxWordsPerPage = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame;

  const sampleText = useMemo(() => (tokens || []).map((t) => t.word).join(" "), [tokens]);
  const rawFontFamily = themeFontFamily || config.fontFamily || FONTS.bebasNeue;
  const activeFontFamily = getFontFamily(rawFontFamily, sampleText);
  const activeHighlightBg = themeHighlightBg || "#FFE500";
  const baseTextColor = themeTextColor || config.textColor || "#FFFFFF";
  const highlightTextColor = activeHighlightBg
    ? "#0C0C0E"
    : (themeHighlightColor || config.highlightColor || "#FF2D55");
  const shadowColor = themeShadowColor || config.shadowConfig?.color || "rgba(0, 0, 0, 0.85)";

  const fontSize = config.fontSize || 42;
  const fontWeight = config.fontWeight || 800;
  const highlightScale = config.highlightScale || 1.25;
  const highlightWords = config.highlightWords || [];

  const springDamping = config.springConfig?.damping ?? 14;
  const springStiffness = config.springConfig?.stiffness ?? 160;
  const springMass = config.springConfig?.mass ?? 0.5;

  const positionBottom = config.position?.bottom ?? 160;

  // Chunk Whisper tokens into clean 5-6 word subtitle pages
  const pages = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];

    const result: WhisperToken[][] = [];
    let currentChunk: WhisperToken[] = [];

    tokens.forEach((token, idx) => {
      currentChunk.push(token);
      const isPunctuationEnd = /[.?!;,—]$/.test(token.word);

      if (
        currentChunk.length >= maxWordsPerPage ||
        isPunctuationEnd ||
        idx === tokens.length - 1
      ) {
        result.push(currentChunk);
        currentChunk = [];
      }
    });

    return result;
  }, [tokens, maxWordsPerPage]);

  if (pages.length === 0) return null;

  // Find currently active page for localFrame
  const activePageIndex = pages.findIndex((page, pIdx) => {
    const pageStartFrame = page[0].startFrame;
    const nextPage = pages[pIdx + 1];
    const pageEndFrame = nextPage
      ? nextPage[0].startFrame - 1
      : page[page.length - 1].endFrame + 18;

    return localFrame >= pageStartFrame && localFrame <= pageEndFrame;
  });

  // Fallback to active page or last active page if in bounds
  const currentDisplayPage =
    activePageIndex !== -1
      ? pages[activePageIndex]
      : localFrame >= pages[0][0].startFrame
      ? pages[pages.length - 1]
      : null;

  if (!currentDisplayPage) return null;

  // Dynamic theme-aware card & typography colors
  const isDarkThemeText =
    themeTextColor === "#FFFFFF" ||
    themeTextColor === "#00FFFF" ||
    themeTextColor === "#FFFDD0" ||
    themeTextColor === "#00FF66";

  const containerBg = isDarkThemeText ? "rgba(10, 14, 22, 0.94)" : "#FFFFFF";
  const containerBorderColor = isDarkThemeText ? (themeTextColor || "#00FFFF") : "#111111";
  const wordBaseTextColor = isDarkThemeText ? "#FFFFFF" : (themeTextColor || "#111111");

  return (
    <div
      style={{
        position: "absolute",
        bottom: positionBottom || 140,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 16px",
        padding: "18px 32px",
        maxWidth: "92%",
        backgroundColor: containerBg,
        border: `4px solid ${containerBorderColor}`,
        borderRadius: "20px",
        boxShadow: `10px 10px 0px ${isDarkThemeText ? "rgba(0,0,0,0.8)" : "#111111"}`,
        zIndex: 100,
        boxSizing: "border-box",
      }}
    >
      {currentDisplayPage.map((token, i) => {
        const isVisible = localFrame >= token.startFrame;
        if (!isVisible) return null;

        const tokenLocalFrame = localFrame - token.startFrame;
        const cleanWord = token.word.replace(/[.,!?;:—$]/g, "").toLowerCase();
        
        const isHighlight =
          highlightWords.some(
            (hw) => cleanWord === hw.replace(/[.,!?;:—$]/g, "").toLowerCase()
          ) || (highlightWords.length === 0 && i === 0);

        // Spring animation for pop-in
        const popScale = spring({
          frame: tokenLocalFrame,
          fps,
          config: {
            damping: springDamping,
            stiffness: springStiffness,
            mass: springMass,
          },
        });

        const finalScale = isHighlight ? popScale * 1.08 : popScale;

        return (
          <span
            key={`${token.word}-${token.startFrame}-${i}`}
            style={{
              display: "inline-block",
              position: "relative",
              fontFamily: activeFontFamily,
              fontSize: "36px",
              fontWeight: activeFontFamily.toLowerCase().includes("bebas") ? 400 : (isHighlight ? 900 : 700),
              color: isHighlight ? (themeHighlightColor || (activeHighlightBg === "#FFE600" ? "#0C0C0E" : "#FFFFFF")) : wordBaseTextColor,
              transform: `scale(${finalScale})`,
              transformOrigin: "center bottom",
              padding: isHighlight ? "4px 12px" : "0 3px",
              backgroundColor: isHighlight ? activeHighlightBg : "transparent",
              border: isHighlight ? `2px solid ${containerBorderColor}` : "none",
              borderRadius: isHighlight ? "6px" : "0",
              boxShadow: isHighlight ? `3px 3px 0px ${isDarkThemeText ? "rgba(0,0,0,0.6)" : "#111111"}` : "none",
              letterSpacing: "0.2px",
              lineHeight: 1.25,
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
