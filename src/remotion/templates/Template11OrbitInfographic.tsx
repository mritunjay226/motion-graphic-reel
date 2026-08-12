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

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.04, periodFrames: 34 },
};

/**
 * TEMPLATE 11: `circular_orbit_infographic`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 6: Centered Subject Cutout Sticker pops in (`left: 32%`, `width: 36%`, `top: 27%`)
 * - Frame 12: SVG Orbit Ring draws 360° around subject (`pulse_nodes`)
 * - Frame 16-28: 4 Orbiting Data Callout Badges pop in around orbit ring
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template11OrbitInfographic: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "ECOSYSTEM DATA ORBIT";

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

      {/* 2. ORBITING SVG NODES (Frame 12) */}
      <GsapSvgGraphics
        type="pulse_nodes"
        color="#FFE600"
        enterAtFrame={12}
        style={{ top: "25%", left: "15%", width: "70%", height: "260px", zIndex: 10 }}
      />

      {/* 3. CENTER ZONE: Subject Cutout Sticker (Frame 6) */}
      <AnimatedLayer
        entrance="pop_in"
        enterAtFrame={6}
        position={{ top: "28%", left: "32%", width: "36%", height: "auto" }}
        zIndex={20}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        {primaryStickerUrl ? (
          <CharacterBoil config={boilConfig}>
            <PaperSticker
              src={primaryStickerUrl}
              rotationDeg={-2}
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
