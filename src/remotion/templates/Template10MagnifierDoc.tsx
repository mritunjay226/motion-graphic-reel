import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { TypewriterParagraph } from "../components/TypewriterParagraph";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { ExitAnimationWrapper } from "../components/ExitAnimationWrapper";
import { WordByWordCaptions } from "../components/WordByWordCaptions";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * TEMPLATE 10: `spotlight_magnifier_document`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 6: Center Full Document Clipping enters (`left: 12%`, `width: 76%`, `top: 27%`)
 * - Frame 16: Circular Magnifying Lens Spotlight pops in with yellow ring focus (`left: 55%`, `top: 36%`)
 * - Frame 26: Rubber Stamp Seal slams in top-right (`stamp_seal`, `CONFIDENTIAL`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template10MagnifierDoc: React.FC<TemplateProps> = ({ scene, theme }) => {
  const {
    sceneId,
    sceneTitle,
    startFrame,
    durationFrames,
    whisperTokens,
    kineticCaptions,
    narrationLine,
  } = scene;

  const events: any[] = (scene as any).events || [];
  const docEvent = events.find((e) => e.type === "typewriter_memo") || events[0];

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "EVIDENCE DOCUMENT EXPOSED";

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

      {/* 2. CENTER ZONE: Document Clipping (Frame 6) */}
      <ExitAnimationWrapper
        startFrameOffset={6}
        durationFrames={durationFrames - 12}
        exitAnimation="fade_scale"
        style={{
          position: "absolute",
          top: "27%",
          left: "12%",
          width: "76%",
          zIndex: 15,
        }}
      >
        <TypewriterParagraph
          headline={docEvent?.headline || "EXPOSED LEAKED REPORT"}
          content={docEvent?.content || narrationLine}
          startFrameOffset={0}
        />
      </ExitAnimationWrapper>

      {/* 3. MAGNIFYING SPOTLIGHT LENS (Frame 16) */}
      <AnimatedLayer
        entrance="pop_in"
        enterAtFrame={16}
        position={{ top: "36%", left: "55%", width: "120px", height: "120px" }}
        zIndex={25}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: "4px solid #FFE600", boxShadow: "0 0 25px rgba(255,230,0,0.5), inset 0 0 15px rgba(255,230,0,0.3)", backgroundColor: "rgba(255,230,0,0.12)", backdropFilter: "brightness(1.2)" }} />
      </AnimatedLayer>

      {/* 4. TOP RIGHT STAMP SEAL (Frame 26) */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="EVIDENCE"
        enterAtFrame={26}
        style={{ top: "24%", right: "8%", width: "36%", height: "140px", zIndex: 30 }}
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
