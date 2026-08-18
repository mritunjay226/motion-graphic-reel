import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { TypewriterParagraph } from "../components/TypewriterParagraph";
import { ExitAnimationWrapper } from "../components/ExitAnimationWrapper";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { VoxVideoCard } from "../components/VoxVideoCard";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.04, periodFrames: 34 },
};

/**
 * TEMPLATE 12: `breaking_news_alert_ticker`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 0: Red Alert Headline Ticker Banner slides in across top (`left: 0`, `top: 2%`, `width: 100%`)
 * - Frame 4: Headline Typography enters below ticker bar (`top: 10%`)
 * - Frame 10: Center News Photo Cutout Sticker slides from bottom-left (`left: 6%`, `width: 44%`, `top: 28%`)
 * - Frame 20: Right Typewriter Evidence Report Document slides in (`left: 54%`, `width: 40%`, `top: 28%`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template12BreakingTicker: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background;

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "CRITICAL DISRUPTION BULLETIN";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  return (
    <>
      {/* 1. TOP RED ALERT TICKER BANNER (Frame 0) */}
      <AnimatedLayer
        entrance="slide_right"
        enterAtFrame={0}
        position={{ top: "2%", left: "0%", width: "100%", height: "46px" }}
        zIndex={60}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <div style={{ backgroundColor: "#D61C1C", color: "#FFFFFF", padding: "8px 20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 4px 12px rgba(214,28,28,0.4)" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFFFFF", animation: "blink 1s infinite" }} />
          <span style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase" }}>
            ● BREAKING BULLETIN // DISRUPTION ALERT // SCENE {sceneId}
          </span>
        </div>
      </AnimatedLayer>

      {/* 2. TOP ZONE: Headline Typography (Frame 4) */}
      <AnimatedLayer
        entrance="slide_up"
        enterAtFrame={4}
        position={{ top: "10%", left: "6%", width: "88%", height: "auto" }}
        zIndex={50}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <VoxTypography
          text={headlineText}
          entrance="slide_up_word"
          enterAtFrame={4}
          fontSize={42}
          color={theme?.captionTextColor || "#1F1F1F"}
          fontFamily={theme?.fontFamily}
          highlightWords={highlightWords}
          highlightBg={theme?.captionHighlightBg}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.3}
        />
      </AnimatedLayer>

      {/* 3. MEDIA CARD OR SPLIT NEWS ITEM (Frame 10) */}
      {(scene.videoUrl || scene.bRollUrl) ? (
        <div
          style={{
            position: "absolute",
            top: "26%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          <VoxVideoCard
            videoUrl={scene.videoUrl || scene.bRollUrl || ""}
            fallbackImageUrl={primaryStickerUrl}
            personalityStickerUrl={primaryStickerUrl}
            personalityTag="DISPATCH"
            title={memoEvent?.headline || "BREAKING DISPATCH"}
            subtitle="● LIVE ARCHIVE FEED"
            tagText="DEVELOPING STORY"
            variant="crt_monitor"
            rotationDeg={-1.5}
            enterAtFrame={10}
            theme={theme}
            width={820}
          />
        </div>
      ) : (
        <>
          {/* LEFT ZONE: News Photo Cutout Sticker */}
          <AnimatedLayer
            entrance="slide_corner_bottom_left"
            enterAtFrame={10}
            position={{ top: "28%", left: "6%", width: "44%", height: "auto" }}
            zIndex={15}
            sceneStartFrame={startFrame}
            sceneDurationFrames={durationFrames}
          >
            {primaryStickerUrl ? (
              <CharacterBoil config={boilConfig}>
                <PaperSticker
                  src={primaryStickerUrl}
                  rotationDeg={-3}
                  isSingleSubject={true}
                  width="100%"
                  height="auto"
                  filter="grayscale(0.6) contrast(1.2)"
                />
              </CharacterBoil>
            ) : null}
          </AnimatedLayer>

          {/* RIGHT ZONE: Typewriter Evidence Report */}
          <ExitAnimationWrapper
            startFrameOffset={20}
            durationFrames={durationFrames}
            exitAnimation="paper_tear_out"
            style={{
              position: "absolute",
              top: "28%",
              left: "54%",
              width: "40%",
              zIndex: 20,
            }}
          >
            <TypewriterParagraph
              headline={memoEvent?.headline || "EVIDENCE LOG"}
              content={memoEvent?.content || narrationLine}
              startFrameOffset={0}
            />
          </ExitAnimationWrapper>
        </>
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
