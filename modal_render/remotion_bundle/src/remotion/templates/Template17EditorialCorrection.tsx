import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { StrikethroughReplace } from "@/components/remocn/strikethrough-replace";
import { MarkerHighlight } from "@/components/remocn/marker-highlight";
import { RollingNumber } from "@/components/remocn/rolling-number";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.03, periodFrames: 34 },
};

/**
 * TEMPLATE 17: `editorial_strikethrough_swap`
 *
 * Dynamic Editorial Correction & Insight Scene (2.5D Styled):
 * - Frame 2: Top Strikethrough Correction / Vox Headline
 * - Frame 6: 2.5D Hero Subject Cutout Sticker
 * - Frame 14: Marker Highlight / Stat counter overlay
 * - Frame 22: Vox Rubber Stamp Seal
 */
export const Template17EditorialCorrection: React.FC<TemplateProps> = ({ scene, theme }) => {
  const {
    sceneTitle,
    startFrame,
    durationFrames,
    imageKitUrls,
    whisperTokens,
    kineticCaptions,
    narrationLine,
  } = scene;

  const events: any[] = (scene as any).events || [];
  const correctionEvent = events.find((e) => e.type === "editorial_correction" || e.type === "strikethrough");
  const statEvent = events.find((e) => e.type === "stat" || e.numericValue);

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background || "/vox_subject_cutout.png";

  return (
    <>
      {/* 1. TOP DYNAMIC HEADLINE WITH STRIKETHROUGH CORRECTION */}
      <AnimatedLayer
        entrance="slide_down"
        enterAtFrame={2}
        position={{ top: "8%", left: "6%", width: "88%", height: "auto" }}
        zIndex={50}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        {correctionEvent ? (
          <div
            style={{
              background: theme?.bgStyle === "full_bleed" ? "#0F172A" : "#FFFFFF",
              border: `4px solid ${theme?.badgeBorder || "#111113"}`,
              borderRadius: "20px",
              padding: "16px 24px",
              boxShadow: `0 12px 35px ${theme?.captionShadowColor || "rgba(0, 0, 0, 0.22)"}`,
            }}
          >
            <StrikethroughReplace
              from={correctionEvent.oldText || "MYTH: BANKRUPTCY"}
              to={correctionEvent.newText || "REALITY: $45B EMPIRE"}
              fontSize={36}
              color="#111113"
              lineColor="#D61C1C"
            />
          </div>
        ) : (
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
        )}
      </AnimatedLayer>

      {/* 2. LEFT ZONE: 2.5D HERO SUBJECT CUTOUT STICKER */}
      <AnimatedLayer
        entrance="slide_corner_top_left"
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

      {/* 3. RIGHT ZONE: MARKER HIGHLIGHT INSIGHT / STAT COUNTER */}
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
            border: "4px solid #111113",
            borderRadius: "24px",
            padding: "20px",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.22)",
          }}
        >
          {statEvent && statEvent.numericValue ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#666666", textTransform: "uppercase", marginBottom: "8px" }}>
                VERIFIED METRIC
              </div>
              <RollingNumber
                from={0}
                to={Number(statEvent.numericValue)}
                fontSize={56}
                color="#D61C1C"
              />
            </div>
          ) : (
            <MarkerHighlight
              before={narrationLine.slice(0, 40)}
              highlight={highlightWords.join(" ") || "KEY FACT"}
              after={narrationLine.slice(40, 80)}
              fontSize={24}
              baseColor="#111113"
              markerColor="#FFE600"
            />
          )}
        </div>
      </AnimatedLayer>

      {/* 4. RUBBER STAMP SEAL */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="EDITORIAL CORRECTION"
        enterAtFrame={22}
        style={{ top: "22%", right: "4%", width: "34%", height: "140px", zIndex: 35 }}
      />

      {/* 5. KINETIC SUBTITLES */}
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
