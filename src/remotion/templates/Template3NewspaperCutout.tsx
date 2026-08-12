import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { NewsArticleClipping } from "../components/NewsArticleClipping";
import { ExitAnimationWrapper } from "../components/ExitAnimationWrapper";
import { VoxLeaderLine } from "../components/VoxLeaderLine";
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
 * TEMPLATE 3: `split_left_newspaper_right_cutout`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 6: Left Vintage Newspaper Clipping slides from bottom-left (`slide_corner_bottom_left`)
 *            Positioned cleanly at left: 6%, width: 44%, top: 27%
 * - Frame 14: Right Subject Cutout Sticker slides from top-right (`slide_corner_top_right`)
 *             Positioned cleanly at left: 54%, width: 40%, top: 27%
 * - Frame 24: Dashed Leader Line callout badge points from right to left to news headline
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template3NewspaperCutout: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const events: any[] = (scene as any).events || [];
  const newsEvent = events.find((e) => e.type === "news_article") || events[0];

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background || "/vox_newspaper_clipping.png";
  const cutoutStickerUrl = imageKitUrls.foreground || "/vox_subject_cutout.png";

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

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
          fontSize={44}
          color={theme?.captionTextColor || "#1F1F1F"}
          fontFamily={theme?.fontFamily}
          highlightWords={highlightWords}
          highlightBg={theme?.captionHighlightBg}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.3}
        />
      </AnimatedLayer>

      {/* 2. LEFT ZONE: Vintage Newspaper Clipping (Frame 6) */}
      <ExitAnimationWrapper
        startFrameOffset={6}
        durationFrames={durationFrames - 12}
        exitAnimation="slide_left"
        style={{
          position: "absolute",
          top: "27%",
          left: "6%",
          width: "44%",
          zIndex: 15,
        }}
      >
        <NewsArticleClipping
          headline={newsEvent?.headline || "DAILY FINANCIAL TIMES"}
          content={newsEvent?.content || headlineText}
          imageUrl={primaryStickerUrl}
        />
      </ExitAnimationWrapper>

      {/* 3. RIGHT ZONE: Subject Cutout Sticker (Frame 14) */}
      <AnimatedLayer
        entrance="slide_corner_top_right"
        enterAtFrame={14}
        position={{ top: "27%", left: "54%", width: "40%", height: "auto" }}
        zIndex={20}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <CharacterBoil config={boilConfig}>
          <PaperSticker
            src={cutoutStickerUrl}
            rotationDeg={3}
            isSingleSubject={false}
            width="100%"
            height="auto"
          />
        </CharacterBoil>
      </AnimatedLayer>

      {/* 4. LEADER LINE CALLOUT (Frame 24) */}
      <VoxLeaderLine
        label="BREAKING HEADLINE"
        value="PRESS REPORT"
        top="58%"
        left="38%"
        lineWidth={60}
        direction="left"
        enterAtFrame={24}
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
