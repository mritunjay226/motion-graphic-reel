import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { WordByWordCaptions } from "../components/WordByWordCaptions";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfigLeft = {
  rotationOscillation: { minDeg: -3.0, maxDeg: 1.0, periodFrames: 24 },
  scaleOscillation: { minScale: 0.98, maxScale: 1.03, periodFrames: 32 },
};

const boilConfigRight = {
  rotationOscillation: { minDeg: -1.0, maxDeg: 3.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.98, maxScale: 1.03, periodFrames: 36 },
};

/**
 * TEMPLATE 7: `dual_cutout_versus`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`pop_letters`)
 * - Frame 6: Left Subject Cutout slides from bottom-left (`slide_corner_bottom_left`, `left: 6%`, `width: 38%`)
 * - Frame 12: Right Subject Cutout slides from bottom-right (`slide_corner_bottom_right`, `left: 56%`, `width: 38%`)
 * - Frame 20: Central Rubber Stamp VS badge slams down between cutouts (`stamp_seal`, `left: 42%`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template7DualVersus: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const leftStickerUrl = imageKitUrls.props?.[0] || imageKitUrls.foreground || "/vox_subject_cutout.png";
  const rightStickerUrl = imageKitUrls.props?.[1] || imageKitUrls.background || "/vox_subject_cutout.png";

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "COMPETITION MARKET BATTLE";

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
          entrance="pop_letters"
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

      {/* 2. LEFT ZONE: Competitor Cutout Sticker (Frame 6) */}
      <AnimatedLayer
        entrance="slide_corner_bottom_left"
        enterAtFrame={6}
        position={{ top: "27%", left: "6%", width: "38%", height: "auto" }}
        zIndex={15}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        {leftStickerUrl ? (
          <CharacterBoil config={boilConfigLeft}>
            <PaperSticker
              src={leftStickerUrl}
              rotationDeg={-4}
              isSingleSubject={true}
              width="100%"
              height="auto"
            />
          </CharacterBoil>
        ) : null}
      </AnimatedLayer>

      {/* 3. RIGHT ZONE: Market Leader Cutout Sticker (Frame 12) */}
      <AnimatedLayer
        entrance="slide_corner_bottom_right"
        enterAtFrame={12}
        position={{ top: "27%", left: "56%", width: "38%", height: "auto" }}
        zIndex={15}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        {rightStickerUrl ? (
          <CharacterBoil config={boilConfigRight}>
            <PaperSticker
              src={rightStickerUrl}
              rotationDeg={4}
              isSingleSubject={true}
              width="100%"
              height="auto"
            />
          </CharacterBoil>
        ) : null}
      </AnimatedLayer>

      {/* 4. CENTER ZONE: Central VS Stamp Badge (Frame 20) */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="VS"
        enterAtFrame={20}
        style={{ top: "35%", left: "42%", width: "16%", height: "100px", zIndex: 30 }}
      />

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
