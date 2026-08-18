import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { VoxLeaderLine } from "../components/VoxLeaderLine";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { VoxPolaroidCard } from "../components/VoxPolaroidCard";
import { VoxVideoCard } from "../components/VoxVideoCard";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.03, periodFrames: 36 },
};

/**
 * TEMPLATE 1: `center_hero_cutout`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 0-4: Technical Grid Lines draw in background (opacity 0.18)
 * - Frame 2: Top Headline Typography slides up (`slide_up_word`) + red keyword scale pop at Frame 5
 * - Frame 6: Centered Hero Subject Cutout Sticker slides in from bottom-left corner (`slide_corner_bottom_left`)
 *            with cubic-bezier deceleration (Easing.bezier(0.16, 1, 0.3, 1)) & rotational settling (-10° -> 0°)
 * - Frame 16: Right Leader Line dashed callout extends (`lineWidth: 70px`) + info badge pops
 * - Frame 24: Rubber Stamp Seal / Accent Badge slams in top-right (`stamp_seal`)
 * - Frame 12+: Kinetic Subtitle Captions pop at bottom 140px
 */
export const Template1CenterHero: React.FC<TemplateProps> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  // Use primary generated image or fallback to foreground asset
  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background || "/vox_subject_cutout.png";

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  // Dynamic stamp label from scene properties or scene title
  const stampLabel = sceneTitle ? sceneTitle.split("—")[0].trim().toUpperCase() : "KEY EVIDENCE";

  return (
    <>
      {/* 1. NARRATIVE HEADER (Frame 2): Establishes topic focus immediately */}
      <AnimatedLayer
        entrance="slide_up"
        enterAtFrame={2}
        position={{ top: "7%", left: "4%", width: "92%", height: "auto" }}
        zIndex={50}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <VoxTypography
          text={headlineText}
          entrance="slide_up_word"
          enterAtFrame={2}
          fontSize={76}
          color={theme?.captionTextColor || "#111111"}
          fontFamily={theme?.fontFamily}
          highlightWords={highlightWords}
          highlightBg={theme?.captionHighlightBg}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.2}
        />
      </AnimatedLayer>

      {/* 2. TECHNICAL GRID LINES (Frame 4): Establishes documentary framing */}
      <GsapSvgGraphics
        type="grid_lines"
        label={`SCENE 0${sceneId}`}
        enterAtFrame={4}
        style={{ top: "24%", left: "5%", width: "90%", height: "42%", opacity: 0.14, zIndex: 5 }}
      />

      {/* 3. HERO SUBJECT CARD (Frame 6): Renders 2.5D Video Card or Polaroid Card */}
      <div
        style={{
          position: "absolute",
          top: "26%",
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
            personalityTag={headlineText ? headlineText.split(/\s+/)[0].slice(0, 10) : "EVIDENCE"}
            title={sceneTitle ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").slice(0, 24) : "PRIMARY EVIDENCE"}
            subtitle="● VERIFIED 4K ARCHIVE"
            tagText="HISTORICAL PROOF"
            rotationDeg={-2.5}
            enterAtFrame={6}
            theme={theme}
          />
        ) : (
          <VoxPolaroidCard
            imageUrl={primaryStickerUrl}
            title={sceneTitle ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").slice(0, 24) : "PRIMARY SUBJECT"}
            subtitle="DOCUMENTARY PROOF"
            cornerTag={scene.narrationLine ? scene.narrationLine.slice(0, 20).toUpperCase() : "VERIFIED PROOF"}
            stampText="EVIDENCE"
            rotationDeg={-3}
            enterAtFrame={6}
            theme={theme}
          />
        )}
      </div>

      {/* 4. DATA-DRIVEN RUBBER STAMP SEAL (Frame 18): Closes curiosity gap with explicit stamp text */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label={stampLabel}
        subtitle="DOCUMENTARY PROOF"
        enterAtFrame={18}
        style={{ top: "34%", right: "6%", width: "42%", height: "200px", zIndex: 25 }}
      />

      {/* 5. SYNCHRONIZED CAPTIONS (Frame 12+): Audio-visual alignment */}
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
