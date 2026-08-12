import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { getFontFamily, FONTS } from "../utils/fonts";

/**
 * 1. REDACTED TAPE REVEAL HEADLINE
 * Renders a black electrical tape strip over secret text that slides away to reveal crimson text.
 */
export const VoxRedactedRevealText: React.FC<{
  prefixText: string;
  secretWord: string;
  suffixText?: string;
  enterAtFrame?: number;
  fontSize?: number;
}> = ({ prefixText, secretWord, suffixText, enterAtFrame = 4, fontSize = 48 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterAtFrame);

  const tapeSlide = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const tapeX = interpolate(tapeSlide, [0, 1], [0, 110]);
  const tapeOpacity = interpolate(tapeSlide, [0, 1], [1, 0]);

  const activeFontFamily = getFontFamily(FONTS.bebasNeue);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: activeFontFamily, fontSize: `${fontSize}px`, fontWeight: 900, color: "#1F1F1F", letterSpacing: "2px" }}>
        {prefixText.toUpperCase()}
      </span>

      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={{ fontFamily: activeFontFamily, fontSize: `${fontSize * 1.3}px`, fontWeight: 900, color: "#D61C1C", letterSpacing: "2.5px", textShadow: "0 2px 10px rgba(214,28,28,0.3)" }}>
          {secretWord.toUpperCase()}
        </span>

        {/* Black Redacted Tape Strip */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "-6px",
            right: "-6px",
            bottom: "-4px",
            backgroundColor: "#111111",
            borderRadius: "4px",
            transform: `translateX(${tapeX}%)`,
            opacity: tapeOpacity,
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: getFontFamily(FONTS.spaceGrotesk), fontSize: "12px", color: "#FFE600", letterSpacing: "2px" }}>
            [REDACTED]
          </span>
        </div>
      </div>

      {suffixText && (
        <span style={{ fontFamily: activeFontFamily, fontSize: `${fontSize}px`, fontWeight: 900, color: "#1F1F1F", letterSpacing: "2px" }}>
          {suffixText.toUpperCase()}
        </span>
      )}
    </div>
  );
};

/**
 * 2. ANIMATED ROLLING NUMBER TICKER TYPOGRAPHY
 * Counts up dynamically from 0 to target value ($50M / +340% / 1,000 STORES).
 */
export const VoxRollingNumberTicker: React.FC<{
  prefix?: string;
  targetValue: number;
  suffix?: string;
  label?: string;
  enterAtFrame?: number;
  color?: string;
}> = ({ prefix = "$", targetValue, suffix = "M", label, enterAtFrame = 4, color = "#FFE600" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterAtFrame);

  const countSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const currentValue = Math.floor(interpolate(countSpring, [0, 1], [0, targetValue]));

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", background: "#111111", padding: "16px 24px", borderRadius: "14px", borderLeft: `8px solid ${color}`, boxShadow: "0 14px 40px rgba(0,0,0,0.4)" }}>
      {label && (
        <span style={{ fontFamily: getFontFamily(FONTS.spaceGrotesk), fontSize: "12px", fontWeight: "bold", color: color, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
          ● {label}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: getFontFamily(FONTS.bebasNeue), fontSize: "56px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "2.5px", lineHeight: 1.0, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>
          {prefix}{currentValue.toLocaleString()}{suffix}
        </span>
      </div>
    </div>
  );
};

/**
 * 3. KINETIC PAPER STICKER BADGE HEADLINE
 * Renders bold headline phrase on an angled yellow paper sticker badge with gold drop shadow.
 */
export const VoxStickerBadgeHeadline: React.FC<{
  text: string;
  badgeTag?: string;
  enterAtFrame?: number;
  rotationDeg?: number;
}> = ({ text, badgeTag = "KEY FINDING", enterAtFrame = 4, rotationDeg = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterAtFrame);

  const popSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.3, 1]);

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotationDeg}deg) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          background: "#FFE600",
          color: "#111111",
          padding: "16px 28px",
          borderRadius: "8px",
          border: "3px solid #111111",
          boxShadow: "0 12px 35px rgba(255,230,0,0.5), 0 4px 12px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-12px",
            left: "16px",
            background: "#111111",
            color: "#FFE600",
            padding: "2px 10px",
            borderRadius: "4px",
            fontFamily: getFontFamily(FONTS.spaceGrotesk),
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "1.5px",
          }}
        >
          ● {badgeTag}
        </span>

        <span style={{ fontFamily: getFontFamily(FONTS.bebasNeue), fontSize: "44px", fontWeight: 900, letterSpacing: "2.5px", lineHeight: 1.0, display: "block" }}>
          {text.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
