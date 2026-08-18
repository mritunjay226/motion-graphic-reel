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
import { MatrixDecode } from "@/components/remocn/matrix-decode";
import { Typewriter } from "@/components/remocn/typewriter";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.03, periodFrames: 34 },
};

/**
 * TEMPLATE 13: `matrix_scramble_hacker`
 *
 * Cyberpunk, Technical & Security Vox Scene (2.5D Styled):
 * - Frame 2: Top Vox Headline + MatrixDecode Scramble Effect
 * - Frame 6: Right 2.5D Subject Cutout Sticker (CharacterBoil)
 * - Frame 16: Left Terminal Memo Box with Typewriter text
 * - Frame 24: Technical Grid Lines + Stamp Seal
 */
export const Template13MatrixHacker: React.FC<TemplateProps> = ({ scene, theme }) => {
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
    : "SECURITY BREAKTHROUGH";

  const codeLineText = narrationLine
    ? narrationLine
    : "> authorization_status: GRANTED";

  const primaryStickerUrl = imageKitUrls.foreground || imageKitUrls.background || "/vox_subject_cutout.png";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  return (
    <>
      {/* 1. TOP ZONE: Headline Vox Typography */}
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

      {/* 2. TECHNICAL GRID LINES BACKGROUND */}
      <GsapSvgGraphics
        type="grid_lines"
        label="SYS_DECODE_01"
        enterAtFrame={4}
        style={{ top: "24%", left: "5%", width: "90%", height: "45%", opacity: 0.16, zIndex: 5 }}
      />

      {/* 3. LEFT ZONE: MATRIX TYPEWRITER CODE CARD */}
      <AnimatedLayer
        entrance="slide_left"
        enterAtFrame={12}
        position={{ top: "28%", left: "6%", width: "48%", height: "auto" }}
        zIndex={25}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <div
          style={{
            background: "#111113",
            border: "4px solid #FFFFFF",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div style={{ color: "#B4F500", fontFamily: "monospace", fontSize: "12px", fontWeight: "bold", marginBottom: "8px" }}>
            [SECURITY PROTOCOL LOG]
          </div>
          <MatrixDecode
            text={headlineText.slice(0, 24)}
            fontSize={24}
            color="#FFE600"
            revealDuration={30}
          />
          <div style={{ marginTop: "12px" }}>
            <Typewriter
              text={codeLineText.slice(0, 80)}
              fontSize={18}
              color="#A3E635"
              charsPerSecond={22}
            />
          </div>
        </div>
      </AnimatedLayer>

      {/* 4. RIGHT ZONE: 2.5D HERO SUBJECT CUTOUT */}
      <AnimatedLayer
        entrance="slide_corner_bottom_right"
        enterAtFrame={8}
        position={{ top: "26%", left: "56%", width: "38%", height: "auto" }}
        zIndex={20}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <CharacterBoil config={boilConfig}>
          <PaperSticker
            src={primaryStickerUrl}
            rotationDeg={3}
            isSingleSubject={false}
            width="100%"
            height="auto"
          />
        </CharacterBoil>
      </AnimatedLayer>

      {/* 5. RUBBER STAMP SEAL */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="VERIFIED"
        enterAtFrame={24}
        style={{ top: "22%", right: "4%", width: "32%", height: "140px", zIndex: 35 }}
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
