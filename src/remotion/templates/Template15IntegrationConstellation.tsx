import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { EcosystemConstellation } from "@/components/remocn/ecosystem-constellation";
import { Confetti } from "@/components/remocn/confetti";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.03, periodFrames: 34 },
};

/**
 * TEMPLATE 15: `ecosystem_integration_hub`
 *
 * Product Integration Ecosystem Hub & Celebration Payoff (2.5D Vox Styled):
 * - Frame 2: Top Vox Headline Typography
 * - Frame 6: Left 2.5D Subject Cutout Sticker
 * - Frame 10: Right Ecosystem Constellation Hub
 * - Frame 35: Confetti Burst Payoff
 */
export const Template15IntegrationConstellation: React.FC<TemplateProps> = ({ scene, theme }) => {
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

      {/* 2. LEFT ZONE: 2.5D HERO SUBJECT CUTOUT */}
      <AnimatedLayer
        entrance="slide_corner_bottom_left"
        enterAtFrame={6}
        position={{ top: "28%", left: "6%", width: "42%", height: "auto" }}
        zIndex={20}
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

      {/* 3. RIGHT ZONE: ECOSYSTEM CONSTELLATION HUB */}
      <AnimatedLayer
        entrance="fade_scale"
        enterAtFrame={10}
        position={{ top: "26%", left: "52%", width: "44%", height: "360px" }}
        zIndex={30}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "4px solid #111113",
            borderRadius: "24px",
            padding: "16px",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.22)",
            height: "100%",
          }}
        >
          <EcosystemConstellation
            satelliteCount={5}
            centerLabel="HUB"
            accentColor="#B4F500"
            speed={1.0}
          />
        </div>
      </AnimatedLayer>

      {/* 4. RUBBER STAMP SEAL */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="FULL INTEGRATION"
        enterAtFrame={18}
        style={{ top: "22%", right: "4%", width: "34%", height: "140px", zIndex: 35 }}
      />

      {/* 5. CONFETTI CELEBRATION BURST ON PAYOFF (FRAME 35) */}
      <Confetti
        startFrame={35}
        originX={0.5}
        originY={0.45}
        particleCount={100}
        seed={42}
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
