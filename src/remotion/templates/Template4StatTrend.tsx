import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { VoxRollingNumberTicker } from "../components/VoxKineticTypographySuite";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { VoxVideoCard } from "../components/VoxVideoCard";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.04, periodFrames: 34 },
};

/**
 * TEMPLATE 4: `revenue_stat_trend`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters with `stamp_in` slam effect
 * - Frame 6: Big Stat Badge pops in (`left: 8%`, `width: 44%`, `top: 27%`) with elastic spring
 * - Frame 12: GSAP Vector Trend Arrow draws upward (`left: 54%`, `width: 40%`, `top: 27%`)
 * - Frame 22: Evidence Subject Cutout Sticker slides from bottom-right (`slide_corner_bottom_right`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template4StatTrend: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "EXPONENTIAL FINANCIAL GROWTH";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

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
          entrance="stamp_in"
          enterAtFrame={2}
          fontSize={44}
          color={theme?.captionTextColor || "#1F1F1F"}
          fontFamily={theme?.fontFamily}
          highlightWords={highlightWords}
          highlightBg={theme?.captionHighlightBg}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.35}
        />
      </AnimatedLayer>

      {/* 2. UPPER-MID ZONE: Rolling Number Ticker Typography (Frame 6) */}
      <AnimatedLayer
        entrance="pop_in"
        enterAtFrame={6}
        position={{ top: "20%", left: "6%", width: "44%", height: "auto" }}
        zIndex={15}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <VoxRollingNumberTicker
          prefix="+"
          targetValue={340}
          suffix="%"
          label="ANNUAL REVENUE SURGE"
          enterAtFrame={6}
          color="#FFE600"
        />
      </AnimatedLayer>

      {/* 3. UPPER-MID RIGHT: GSAP Upward Trend Arrow (Frame 12) */}
      <GsapSvgGraphics
        type="trend_arrow"
        color="#FFE600"
        enterAtFrame={12}
        style={{ top: "20%", right: "6%", width: "42%", height: "160px", zIndex: 15 }}
      />

      {/* 4. CENTER HERO: 2.5D Video Card or Cutout Sticker (Frame 20) */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        {scene.videoUrl || scene.bRollUrl ? (
          <VoxVideoCard
            videoUrl={scene.videoUrl || scene.bRollUrl || ""}
            fallbackImageUrl={primaryStickerUrl}
            personalityStickerUrl={primaryStickerUrl}
            personalityTag="GROWTH"
            title={sceneTitle ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").slice(0, 24) : "GROWTH PROOF"}
            subtitle="● VERIFIED FINANCIAL DATA"
            tagText="+340% SURGE"
            rotationDeg={-1.5}
            enterAtFrame={16}
            theme={theme}
            width={820}
          />
        ) : primaryStickerUrl ? (
          <CharacterBoil config={boilConfig}>
            <PaperSticker
              src={primaryStickerUrl}
              rotationDeg={-2}
              isSingleSubject={true}
              width="550px"
              height="auto"
            />
          </CharacterBoil>
        ) : null}
      </div>

      {/* 5. BOTTOM ZONE: Kinetic Subtitles */}
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
