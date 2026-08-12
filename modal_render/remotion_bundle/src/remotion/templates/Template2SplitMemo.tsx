import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { TypewriterParagraph } from "../components/TypewriterParagraph";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { ExitAnimationWrapper } from "../components/ExitAnimationWrapper";
import { WordByWordCaptions } from "../components/WordByWordCaptions";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.5, maxDeg: 2.5, periodFrames: 26 },
  scaleOscillation: { minScale: 0.98, maxScale: 1.03, periodFrames: 32 },
};

/**
 * TEMPLATE 2: `split_left_cutout_right_memo`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters with `pop_letters` spring effect
 * - Frame 6: Left Subject Cutout Sticker slides from top-left (`slide_corner_top_left`)
 *            Positioned cleanly at left: 6%, width: 38%, top: 28%
 * - Frame 18: Right Typewriter Report Memo slides in from right (`slide_left`)
 *             Positioned cleanly at left: 48%, width: 46%, top: 28%
 * - Frame 32: Rubber Stamp Seal slams onto the memo (`stamp_seal`, scale 2.5 -> 1.0, rot -25° -> -5°)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
import { VoxPolaroidCard } from "../components/VoxPolaroidCard";

export const Template2SplitMemo: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const events: any[] = (scene as any).events || [];
  const memoEvent = events.find((e) => e.type === "typewriter_memo") || events[0];

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background || "/vox_subject_cutout.png";

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
        position={{ top: "7%", left: "4%", width: "92%", height: "auto" }}
        zIndex={50}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <VoxTypography
          text={headlineText}
          entrance="pop_letters"
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

      {/* 2. CENTER HERO CARD (Frame 6) */}
      <div
        style={{
          position: "absolute",
          top: "23%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <VoxPolaroidCard
          imageUrl={primaryStickerUrl}
          title={memoEvent?.headline || "INTERNAL MEMO"}
          subtitle="CLASSIFIED DOCUMENTATION"
          cornerTag="EVIDENCE ITEM"
          stampText="CONFIDENTIAL"
          rotationDeg={-3}
          enterAtFrame={6}
          theme={theme}
        />
      </div>

      {/* 3. TYPEWRITER REPORT MEMO (Frame 18) - Cascades over card */}
      <ExitAnimationWrapper
        startFrameOffset={18}
        durationFrames={durationFrames - 24}
        exitAnimation="paper_tear_out"
        style={{
          position: "absolute",
          top: "54%",
          left: "50%",
          transform: "translateX(-50%) rotate(2deg)",
          width: "88%",
          zIndex: 35,
        }}
      >
        <TypewriterParagraph
          headline={memoEvent?.headline || "INTERNAL MEMORANDUM"}
          content={memoEvent?.content || narrationLine}
          startFrameOffset={0}
        />
      </ExitAnimationWrapper>

      {/* 4. TOP RIGHT STAMP SEAL (Frame 32) */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="CONFIDENTIAL"
        enterAtFrame={32}
        style={{ top: "20%", right: "6%", width: "32%", height: "140px", zIndex: 40 }}
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
