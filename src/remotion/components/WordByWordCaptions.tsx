import React, { useMemo } from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import type { WhisperToken, KineticCaptionConfig } from "../types";
import { getFontFamily, FONTS } from "../utils/fonts";

export type CaptionAestheticStyle = "vox_marker" | "hormozi_glow" | "karaoke_fade";

interface WordByWordCaptionsProps {
  /** Whisper word tokens with frame timing relative to scene start (0-indexed) */
  tokens: WhisperToken[];
  /** Kinetic caption styling config */
  config?: Partial<KineticCaptionConfig>;
  /** Scene start frame (for absolute timeline context if needed) */
  sceneStartFrame?: number;
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
  /** Max words per subtitle page (default 4-5 words for fast, effortless reading) */
  maxWordsPerPage?: number;
  /** Visual aesthetic style (default vox_marker) */
  stylePreset?: CaptionAestheticStyle;
}

const KEYWORD_ICONS: Record<string, string> = {
  billion: "💰",
  million: "💵",
  money: "💸",
  revenue: "📊",
  profit: "📈",
  loss: "📉",
  collapse: "💥",
  bankrupt: "🛑",
  disrupted: "⚡",
  growth: "🚀",
  secret: "🔒",
  rejected: "❌",
  approved: "✅",
  warning: "⚠️",
  founder: "👤",
  ceo: "👔",
  deal: "🤝",
  pitch: "🎯",
  netflix: "🎬",
  blockbuster: "📼",
};

// High-Retention Sentiment & Entity Dictionaries for Dynamic Visual Highlights
const FINANCIAL_GROWTH_KEYWORDS = new Set([
  "billion", "million", "money", "revenue", "profit", "growth", "crore", "dollar", "dollars",
  "rich", "valuable", "cash", "fund", "scale", "scaleup", "10x", "2x", "5x", "roi", "approved", "win"
]);

const CRISIS_LOSS_KEYWORDS = new Set([
  "collapse", "bankrupt", "loss", "losses", "rejected", "warning", "mistake", "galti", "tabah",
  "fail", "failed", "scam", "died", "destroy", "destroyed", "crash", "dead", "crisis", "drop"
]);

/**
 * High-Readability, Zero-Layout-Shift Kinetic Caption System.
 *
 * 1. Automatic Timestamp Normalization: Ensures tokens are 100% frame-locked to scene local time.
 * 2. Continuous Visibility: Subtitle card stays smoothly present on screen with zero flashing.
 * 3. Exact Syllable Highlighting: Words highlight during their spoken acoustic window and relax afterwards.
 * 4. Zero Layout Shift: Fixed geometry on all words prevents reflow jumping.
 * 5. 9:16 Mobile Safe Zone: Positioned above 340px to clear TikTok/Instagram UI controls.
 * 6. Rapid Eye-Tracking: 2 to 3 word bursts maximize viewer watch-time retention.
 */
export const WordByWordCaptions: React.FC<WordByWordCaptionsProps> = ({
  tokens,
  config = {},
  themeFontFamily,
  themeTextColor,
  themeHighlightColor,
  themeHighlightBg,
  themeShadowColor,
  maxWordsPerPage = 3,
  stylePreset = "vox_marker",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sampleText = useMemo(() => (tokens || []).map((t) => t.word).join(" "), [tokens]);
  const rawFontFamily = themeFontFamily || config.fontFamily || FONTS.bebasNeue;
  const activeFontFamily = getFontFamily(rawFontFamily, sampleText);
  const activeHighlightBg = themeHighlightBg || "#FFE500";
  const baseTextColor = themeTextColor || config.textColor || "#FFFFFF";

  // Mobile Safe Zone: Default bottom offset 340px clears TikTok/Reels sound/description overlays
  const positionBottom = config.position?.bottom ?? 340;

  // ─── 0. AUTOMATIC TIMECODE NORMALIZATION (0-RELATIVE TO SCENE) ─────────────
  const normalizedTokens = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];
    
    // Filter out blank tokens
    const valid = tokens.filter(
      (t) => t.word && t.word.trim().length > 0 && t.word.trim() !== "—" && t.word.trim() !== "-"
    );
    if (valid.length === 0) return [];

    // If tokens are absolute (e.g. minStart >= 30 from timeline offset), normalize to 0-start
    const minStart = Math.min(...valid.map((t) => t.startFrame ?? 0));
    const offset = minStart >= 30 ? minStart : 0;

    return valid.map((t) => {
      const sFrame = Math.max(0, (t.startFrame ?? 0) - offset);
      const eFrame = Math.max(sFrame + 2, (t.endFrame ?? (sFrame + 4)) - offset);
      return {
        ...t,
        startFrame: sFrame,
        endFrame: eFrame,
      };
    });
  }, [tokens]);

  // ─── 1. SMART CHUNKING (SEAMLESS MULTI-WORD PAGES) ─────────────────────────
  const pages = useMemo(() => {
    if (!normalizedTokens || normalizedTokens.length === 0) return [];

    const result: { tokens: WhisperToken[]; startFrame: number; endFrame: number }[] = [];
    let currentChunk: WhisperToken[] = [];

    normalizedTokens.forEach((token, idx) => {
      currentChunk.push(token);

      const isPunctuationEnd = /[.?!]$/.test(token.word);
      const isLastToken = idx === normalizedTokens.length - 1;
      const isChunkFull = currentChunk.length >= maxWordsPerPage;

      if (isChunkFull || isPunctuationEnd || isLastToken) {
        // First page starts at frame 0 so captions are visible immediately
        const chunkStart = result.length === 0 ? 0 : (currentChunk[0].startFrame || 0);
        const chunkLast = currentChunk[currentChunk.length - 1];
        const rawEnd = (chunkLast.endFrame || chunkStart + 20);

        result.push({
          tokens: [...currentChunk],
          startFrame: chunkStart,
          endFrame: rawEnd,
        });

        currentChunk = [];
      }
    });

    // Seamless back-to-back transitions without blank gaps between pages
    for (let i = 0; i < result.length - 1; i++) {
      result[i].endFrame = result[i + 1].startFrame;
    }
    if (result.length > 0) {
      result[result.length - 1].endFrame = 9999;
    }

    return result;
  }, [normalizedTokens, maxWordsPerPage]);

  if (pages.length === 0) return null;

  // Find currently active page for frame
  const activePageIndex = pages.findIndex((page) => {
    return frame >= page.startFrame && frame < page.endFrame;
  });

  const activePage =
    activePageIndex !== -1
      ? pages[activePageIndex]
      : pages[pages.length - 1];

  if (!activePage) return null;

  // Smooth page fade in (2-frame ease)
  const pageAge = frame - activePage.startFrame;
  const pageOpacity = interpolate(pageAge, [0, 2], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── 2. STYLISTIC CONFIGURATION (VOX MARKER / HORMOZI / KARAOKE) ──────────
  const isDarkText =
    baseTextColor === "#FFFFFF" ||
    baseTextColor === "#00FFFF" ||
    baseTextColor === "#FFFDD0" ||
    baseTextColor === "#00FF66";

  let containerStyle: React.CSSProperties = {};

  if (stylePreset === "vox_marker") {
    containerStyle = {
      backgroundColor: isDarkText ? "rgba(12, 14, 20, 0.94)" : "#FFFFFF",
      border: `3.5px solid ${isDarkText ? "#00FFFF" : "#111111"}`,
      borderRadius: "18px",
      boxShadow: `8px 8px 0px ${isDarkText ? "rgba(0,0,0,0.8)" : "#111111"}`,
      padding: "16px 28px",
    };
  } else if (stylePreset === "hormozi_glow") {
    containerStyle = {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      padding: "8px 16px",
    };
  } else {
    // karaoke_fade
    containerStyle = {
      backgroundColor: "rgba(0, 0, 0, 0.88)",
      border: "1.5px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "14px",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
      padding: "14px 24px",
    };
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: positionBottom,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px 12px",
        maxWidth: "92%",
        zIndex: 100,
        boxSizing: "border-box",
        opacity: pageOpacity,
        willChange: "opacity",
        ...containerStyle,
      }}
    >
      {activePage.tokens.map((token, i) => {
        const wordEnd = (token.endFrame || token.startFrame + 5) + 1;
        const isSpoken = frame >= token.startFrame;
        const isCurrentlyActive = frame >= token.startFrame && frame <= wordEnd;

        const tokenLocalFrame = Math.max(0, frame - token.startFrame);

        // Smooth in-place spring pop (transforms without pushing neighbor words)
        const popScale = isCurrentlyActive
          ? spring({
              frame: tokenLocalFrame,
              fps,
              config: { damping: 14, stiffness: 220, mass: 0.45 },
            }) * 1.08
          : 1.0;

        // ─── WORD RENDERING BASED ON AESTHETIC STYLE ────────────────────────
        let wordColor = "#FFFFFF";
        let wordBg = "transparent";
        let wordShadow = "none";
        let textStroke = "none";
        let wordBorder = "2.5px solid transparent"; // Fixed border thickness prevents layout shift!

        const cleanWord = token.word.replace(/[.,!?;:—$]/g, "").toLowerCase();
        const iconBadge = isCurrentlyActive ? KEYWORD_ICONS[cleanWord] : null;

        const isFinancial = FINANCIAL_GROWTH_KEYWORDS.has(cleanWord) || /^\$?\d+([kmb]|cr)?$/i.test(cleanWord);
        const isCrisis = CRISIS_LOSS_KEYWORDS.has(cleanWord);

        let activeMarkerBg = activeHighlightBg;
        let activeMarkerColor = "#0C0C0E";
        let activeGlowColor = "#FFE600";

        if (isFinancial) {
          activeMarkerBg = "#00FF66"; // Neon Emerald for revenue / profit / millions
          activeMarkerColor = "#04200E";
          activeGlowColor = "#00FF66";
        } else if (isCrisis) {
          activeMarkerBg = "#FF2E54"; // Crimson Warning for bankrupt / loss / collapse
          activeMarkerColor = "#FFFFFF";
          activeGlowColor = "#FF2E54";
        }

        if (stylePreset === "vox_marker") {
          if (isCurrentlyActive) {
            wordColor = activeMarkerColor;
            wordBg = activeMarkerBg;
            wordBorder = "2.5px solid #111111";
            wordShadow = "3px 3px 0px #111111";
          } else if (isSpoken) {
            wordColor = isDarkText ? "#FFFFFF" : "#111111";
            wordBg = "transparent";
          } else {
            wordColor = isDarkText ? "rgba(255, 255, 255, 0.45)" : "rgba(17, 17, 17, 0.45)";
            wordBg = "transparent";
          }
        } else if (stylePreset === "hormozi_glow") {
          textStroke = "3.5px #000000";
          if (isCurrentlyActive) {
            wordColor = activeGlowColor;
            wordShadow = `0 0 16px ${activeGlowColor}`;
          } else if (isSpoken) {
            wordColor = "#FFFFFF";
          } else {
            wordColor = "rgba(255, 255, 255, 0.5)";
          }
        } else {
          // karaoke_fade
          if (isCurrentlyActive) {
            wordColor = activeGlowColor;
            wordShadow = `0 0 12px ${activeGlowColor}`;
          } else if (isSpoken) {
            wordColor = "#FFFFFF";
          } else {
            wordColor = "rgba(255, 255, 255, 0.4)";
          }
        }

        return (
          <span
            key={`${token.word}-${token.startFrame}-${i}`}
            style={{
              display: "inline-block",
              position: "relative",
              fontFamily: activeFontFamily,
              fontSize: "48px",
              fontWeight: activeFontFamily.toLowerCase().includes("bebas") ? 400 : 800,
              color: wordColor,
              backgroundColor: wordBg,
              border: wordBorder,
              borderRadius: "10px",
              boxShadow: wordShadow,
              WebkitTextStroke: textStroke,
              transform: `scale(${popScale})`,
              transformOrigin: "center center",
              // FIXED PADDING & MARGIN = ZERO LAYOUT SHIFT
              padding: "6px 14px",
              margin: "3px 4px",
              letterSpacing: "1px",
              lineHeight: 1.2,
              willChange: "transform, background-color, color",
              transition: "background-color 0.1s ease-out, color 0.1s ease-out",
            }}
          >
            {iconBadge && (
              <span
                style={{
                  position: "absolute",
                  top: "-24px",
                  left: "50%",
                  transform: "translateX(-50%) scale(1.1)",
                  fontSize: "20px",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                  pointerEvents: "none",
                }}
              >
                {iconBadge}
              </span>
            )}
            {token.word}
          </span>
        );
      })}
    </div>
  );
};
