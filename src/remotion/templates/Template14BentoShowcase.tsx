import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { VoxVideoCard } from "../components/VoxVideoCard";
import { InfiniteBentoPan } from "@/components/remocn/infinite-bento-pan";
import { Reel } from "@/components/remocn/reel";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.03, periodFrames: 34 },
};

/**
 * TEMPLATE 14: `bento_grid_showcase`
 *
 * Ambient Vox Bento Grid & Product Reel (2.5D Styled):
 * - Frame 2: Vox Headline Typography
 * - Frame 6: Ambient Infinite Bento Pan background card
 * - Frame 10: Center 2.5D Hero Subject Cutout & Reel Showcase
 * - Frame 20: Vox Rubber Stamp Seal
 */
export const Template14BentoShowcase: React.FC<TemplateProps> = ({ scene, theme }) => {
  const {
    sceneTitle,
    startFrame,
    durationFrames,
    imageKitUrls,
    whisperTokens,
    kineticCaptions,
    narrationLine,
  } = scene;

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background || "/vox_subject_cutout.png";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  const sampleShots = [
    primaryStickerUrl,
    imageKitUrls.background || primaryStickerUrl,
  ].filter(Boolean);

  return (
    <>
      {/* 1. TOP ZONE: Vox Headline Typography */}
      <AnimatedLayer
        entrance="slide_down"
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
          highlightBg={theme?.captionHighlightBg || "#FFE600"}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.3}
        />
      </AnimatedLayer>

      {/* 2. AMBIENT BENTO GRID BACKGROUND LAYER */}
      <div style={{ position: "absolute", top: "25%", left: "5%", width: "90%", height: "45%", zIndex: 10, opacity: 0.25 }}>
        <InfiniteBentoPan
          panSpeed={0.8}
          accentColor="#FFE600"
        />
      </div>

      {/* 3. MEDIA CARD OR BENTO SHOWCASE (Frame 6) */}
      {(scene.videoUrl || scene.bRollUrl) ? (
        <div
          style={{
            position: "absolute",
            top: "26%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
          }}
        >
          <VoxVideoCard
            videoUrl={scene.videoUrl || scene.bRollUrl || ""}
            fallbackImageUrl={primaryStickerUrl}
            personalityStickerUrl={primaryStickerUrl}
            personalityTag="PRODUCT"
            title={sceneTitle ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").slice(0, 24) : "SYSTEM DEMO"}
            subtitle="● LIVE PRODUCT EVIDENCE"
            tagText="SHOWCASE"
            rotationDeg={-1.5}
            enterAtFrame={6}
            theme={theme}
            width={820}
          />
        </div>
      ) : (
        <>
          {/* CENTER LEFT: 2.5D HERO SUBJECT CUTOUT */}
          <AnimatedLayer
            entrance="slide_corner_top_left"
            enterAtFrame={6}
            position={{ top: "28%", left: "6%", width: "42%", height: "auto" }}
            zIndex={25}
            sceneStartFrame={startFrame}
            sceneDurationFrames={durationFrames}
          >
            <CharacterBoil config={boilConfig}>
              <PaperSticker
                src={primaryStickerUrl}
                rotationDeg={-2}
                isSingleSubject={false}
                width="100%"
                height="auto"
              />
            </CharacterBoil>
          </AnimatedLayer>

          {/* CENTER RIGHT: SCREENSHOT REEL CAROUSEL */}
          {sampleShots.length > 0 && (
            <AnimatedLayer
              entrance="fade_scale"
              enterAtFrame={12}
              position={{ top: "30%", left: "52%", width: "42%", height: "auto" }}
              zIndex={30}
              sceneStartFrame={startFrame}
              sceneDurationFrames={durationFrames}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "5px solid #111113",
                  borderRadius: "24px",
                  padding: "16px",
                  boxShadow: "0 16px 45px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Reel
                  images={sampleShots}
                  width={380}
                  height={260}
                  radius={12}
                  step={20}
                  reveal={12}
                />
              </div>
            </AnimatedLayer>
          )}
        </>
      )}

      {/* 5. TOP RIGHT STAMP SEAL */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#B4F500"
        label="FEATURE SPOTLIGHT"
        enterAtFrame={20}
        style={{ top: "22%", right: "4%", width: "34%", height: "140px", zIndex: 35 }}
      />

      {/* 6. KINETIC SUBTITLES */}
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
