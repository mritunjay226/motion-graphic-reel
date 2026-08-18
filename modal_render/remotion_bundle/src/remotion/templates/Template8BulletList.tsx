import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
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
 * TEMPLATE 8: `list_bullets_left_cutout_right`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 8, 15, 22: Left 3-Bullet Takeaways list items slide in sequentially (`slide_right`, `left: 6%`, `width: 46%`)
 * - Frame 10: Right Subject Cutout Sticker slides from top-right (`slide_corner_top_right`, `left: 56%`, `width: 38%`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template8BulletList: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "KEY STRATEGIC PRINCIPLES";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  const events: any[] = (scene as any).events || [];
  const eventBullets = events.map((e: any) => e.headline || e.content).filter(Boolean);

  const bullets = eventBullets.length >= 2
    ? eventBullets.slice(0, 3)
    : narrationLine
    ? narrationLine.split(/[.,!?—]\s+/).filter((s) => s.trim().length > 3).slice(0, 3).map((s) => s.toUpperCase())
    : [
        "KEY STRATEGY 01",
        "KEY STRATEGY 02",
        "KEY STRATEGY 03",
      ];

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

      {/* 2. LEFT ZONE: 3-Bullet Takeaways (Frames 8, 15, 22) */}
      <div
        style={{
          position: "absolute",
          top: "24%",
          left: "5%",
          width: "50%",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          zIndex: 25,
        }}
      >
        {bullets.map((bText, idx) => (
          <AnimatedLayer
            key={idx}
            entrance="slide_right"
            enterAtFrame={8 + idx * 6}
            sceneStartFrame={startFrame}
            sceneDurationFrames={durationFrames}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                padding: "16px 20px",
                borderRadius: "16px",
                border: "3.5px solid #111113",
                boxShadow: "6px 6px 0px #111113",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                boxSizing: "border-box",
              }}
            >
              {/* Number Badge Tag */}
              <div
                style={{
                  backgroundColor: theme?.captionHighlightBg || "#FFE600",
                  color: "#111113",
                  border: "2px solid #111113",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: "2px",
                  boxShadow: "2px 2px 0px #111113",
                }}
              >
                0{idx + 1}
              </div>

              {/* High-Readability Bold Bullet Text */}
              <span
                style={{
                  fontFamily: theme?.fontFamily || "'Space Grotesk', -apple-system, sans-serif",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#111113",
                  letterSpacing: "0.2px",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {bText}
              </span>
            </div>
          </AnimatedLayer>
        ))}
      </div>

      {/* 3. RIGHT ZONE: Subject Cutout Sticker inside Polaroid Frame (Frame 10) */}
      <AnimatedLayer
        entrance="slide_corner_top_right"
        enterAtFrame={10}
        position={{ top: "24%", left: "58%", width: "38%", height: "auto" }}
        zIndex={20}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        {primaryStickerUrl ? (
          <CharacterBoil config={boilConfig}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "4px solid #111113",
                borderRadius: "20px",
                padding: "10px",
                boxShadow: "10px 10px 0px #111113",
                transform: "rotate(3deg)",
              }}
            >
              <PaperSticker
                src={primaryStickerUrl}
                rotationDeg={0}
                isSingleSubject={true}
                width="100%"
                height="auto"
              />
              <div style={{ marginTop: "10px", textAlign: "center", borderTop: "2px dashed #CCCCCC", paddingTop: "6px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 900, color: "#111113", letterSpacing: "1px" }}>
                  EVIDENCE // 0{sceneId}
                </span>
              </div>
            </div>
          </CharacterBoil>
        ) : null}
      </AnimatedLayer>

      {/* 4. BOTTOM ZONE: Kinetic Subtitles */}
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
