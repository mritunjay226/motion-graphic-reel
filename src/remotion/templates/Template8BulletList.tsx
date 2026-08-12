import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { WordByWordCaptions } from "../components/WordByWordCaptions";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.04, periodFrames: 34 },
};

/**
 * TEMPLATE 8: `list_bullets_left_cutout_right`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 8, 15, 22: Left 3-Bullet Takeaways list items slide in sequentially (`slide_right`, `left: 6%`, `width: 46%`)
 * - Frame 10: Right Subject Cutout Sticker slides from top-right (`slide_corner_top_right`, `left: 56%`, `width: 38%`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template8BulletList: React.FC<TemplateProps> = ({ scene, theme }) => {
  const {
    sceneId,
    sceneTitle,
    startFrame,
    durationFrames,
    imageKitUrls,
    whisperTokens,
    kineticCaptions,
    narrationLine,
  } = scene;

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background;

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "KEY STRATEGIC PRINCIPLES";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  const bullets = [
    "ELIMINATE UNNECESSARY OVERHEAD",
    "AUTOMATE DISTRIBUTION CHANNELS",
    "SCALE CUSTOMER RETENTION +340%",
  ];

  return (
    <>
      {/* 1. TOP ZONE: Headline Typography (Frame 2) */}
      <AnimatedLayer
        entrance="slide_up"
        enterAtFrame={2}
        position={{ top: "8%", left: "6%", width: "88%", height: "auto" }}
        zIndex={50}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <VoxTypography
          text={headlineText}
          entrance="slide_up_word"
          enterAtFrame={2}
          fontSize={42}
          color={theme?.captionTextColor || "#1F1F1F"}
          fontFamily={theme?.fontFamily}
          highlightWords={highlightWords}
          highlightBg={theme?.captionHighlightBg}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.3}
        />
      </AnimatedLayer>

      {/* 2. LEFT ZONE: 3-Bullet Takeaways (Frames 8, 15, 22) */}
      <div style={{ position: "absolute", top: "27%", left: "6%", width: "46%", display: "flex", flexDirection: "column", gap: "12px", zIndex: 15 }}>
        {bullets.map((bText, idx) => (
          <AnimatedLayer
            key={idx}
            entrance="slide_right"
            enterAtFrame={8 + idx * 7}
            sceneStartFrame={startFrame}
            sceneDurationFrames={durationFrames}
          >
            <div style={{ background: "#FFFFFF", padding: "12px 16px", borderRadius: "10px", border: "2px solid #111111", boxShadow: "0 6px 18px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFE600", border: "2px solid #111", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", fontWeight: 400, color: "#111111", letterSpacing: "1px", lineHeight: 1.1 }}>
                {bText}
              </span>
            </div>
          </AnimatedLayer>
        ))}
      </div>

      {/* 3. RIGHT ZONE: Subject Cutout Sticker (Frame 10) */}
      <AnimatedLayer
        entrance="slide_corner_top_right"
        enterAtFrame={10}
        position={{ top: "27%", left: "56%", width: "38%", height: "auto" }}
        zIndex={20}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        {primaryStickerUrl ? (
          <CharacterBoil config={boilConfig}>
            <PaperSticker
              src={primaryStickerUrl}
              rotationDeg={3}
              isSingleSubject={true}
              width="100%"
              height="auto"
            />
          </CharacterBoil>
        ) : null}
      </AnimatedLayer>

      {/* 4. BOTTOM ZONE: Kinetic Subtitles */}
      {whisperTokens && whisperTokens.length > 0 && (
        <WordByWordCaptions
          tokens={whisperTokens}
          config={kineticCaptions}
          sceneStartFrame={startFrame}
          themeFontFamily={theme?.fontFamily}
          themeTextColor={theme?.captionTextColor}
          themeHighlightColor={theme?.captionHighlightColor}
          themeHighlightBg={theme?.captionHighlightBg}
          themeShadowColor={theme?.captionShadowColor}
        />
      )}
    </>
  );
};
