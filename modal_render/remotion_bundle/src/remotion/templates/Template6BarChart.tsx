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
import { VoxBarChartCard } from "../components/VoxBarChartCard";

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
 * Broadcast-grade 2.5D Animated Bar Chart Dossier:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 8: Prominent Vox Bar Chart Card with spring-growth animation, real narration data, and big value counters
 * - Frame 16: Subject Cutout Sticker / Brand Logo layers over top-right corner
 * - Frame 12+: Kinetic Subtitles at bottom
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

  const primaryStickerUrl = (scene as any).imageUrl || imageKitUrls.foreground || imageKitUrls.background;

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
          highlightScale={1.35}
        />
      </AnimatedLayer>

      {/* 2. CENTER ZONE: Vox Animated Bar Chart Card (Frame 8) */}
      <div
        style={{
          position: "absolute",
          top: "23%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
        }}
      >
        <VoxBarChartCard
          title={headlineText.slice(0, 22)}
          subtitle="● VERIFIED FINANCIAL AUDIT"
          narrationContext={narrationLine}
          width={860}
          height={480}
          highlightColor={theme?.captionHighlightBg || "#FFE600"}
          rotationDeg={-1}
          enterAtFrame={8}
        />
      </div>

      {/* 3. OVERLAPPING STICKER CUTOUT (Frame 16) */}
      {primaryStickerUrl && (
        <AnimatedLayer
          entrance="slide_corner_top_right"
          enterAtFrame={16}
          position={{ top: "18%", right: "3%", width: "240px", height: "auto" }}
          zIndex={25}
          sceneStartFrame={startFrame}
          sceneDurationFrames={durationFrames}
        >
          <CharacterBoil config={boilConfig}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "3.5px solid #111113",
                borderRadius: "18px",
                padding: "8px",
                boxShadow: "8px 8px 0px #111113",
                transform: "rotate(6deg)",
              }}
            >
              <PaperSticker
                src={primaryStickerUrl}
                rotationDeg={0}
                isSingleSubject={true}
                width="100%"
                height="auto"
              />
            </div>
          </CharacterBoil>
        </AnimatedLayer>
      )}

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
