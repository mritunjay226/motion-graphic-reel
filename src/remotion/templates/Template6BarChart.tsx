import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { VoxLeaderLine } from "../components/VoxLeaderLine";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { AnimatedBarChart } from "@/components/remocn/animated-bar-chart";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.04, periodFrames: 34 },
};

/**
 * TEMPLATE 6: `infographic_bar_chart`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 8: Left 3-Bar Financial Growth Chart grows Y (`bar_chart`, `left: 6%`, `width: 44%`, `top: 27%`)
 * - Frame 16: Right Subject Cutout Sticker slides from top-right (`slide_corner_top_right`, `left: 54%`, `width: 40%`)
 * - Frame 24: Dashed Leader Line badge points to peak $45B bar
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template6BarChart: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "COMPARATIVE FINANCIAL METRICS";

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
          highlightScale={1.35}
        />
      </AnimatedLayer>

      {/* 2. LEFT ZONE: Animated Spring Bar Chart (Remocn UI Block) */}
      <AnimatedLayer
        entrance="slide_up"
        enterAtFrame={8}
        position={{ top: "27%", left: "6%", width: "44%", height: "200px" }}
        zIndex={15}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <AnimatedBarChart
          data={[35, 60, 45, 80, 55, 70, 90]}
          labels={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
          barColor={theme?.captionHighlightBg || "#FFE600"}
          width={500}
          height={200}
          staggerFrames={4}
        />
      </AnimatedLayer>

      {/* 3. RIGHT ZONE: Subject Cutout Sticker (Frame 16) */}
      <AnimatedLayer
        entrance="slide_corner_top_right"
        enterAtFrame={16}
        position={{ top: "27%", left: "54%", width: "40%", height: "auto" }}
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

      {/* 4. LEADER LINE CALLOUT BADGE (Frame 24) */}
      <VoxLeaderLine
        label="PEAK REVENUE"
        value="$45 BILLION"
        top="56%"
        left="36%"
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
