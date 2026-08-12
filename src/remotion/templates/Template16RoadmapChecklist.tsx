import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { PaperSticker } from "../components/PaperSticker";
import { CharacterBoil } from "../components/CharacterBoil";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { CheckList } from "@/components/remocn/check-list";
import { PaperWobble } from "@/components/remocn/paper-wobble";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -2.0, maxDeg: 2.0, periodFrames: 28 },
  scaleOscillation: { minScale: 0.99, maxScale: 1.03, periodFrames: 34 },
};

/**
 * TEMPLATE 16: `handwritten_roadmap_checklist`
 *
 * Dynamic Vox Roadmap Checklist & 2.5D Cutout (2.5D Styled):
 * - Frame 2: Top Vox Headline Typography
 * - Frame 6: Left Handwritten Checklist in Paper Wobble Card
 * - Frame 10: Right 2.5D Subject Cutout Sticker
 * - Frame 20: Vox Rubber Stamp Seal
 */
import { VoxPolaroidCard } from "../components/VoxPolaroidCard";

export const Template16RoadmapChecklist: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const events: any[] = (scene as any).events || [];
  const listEvent = events.find((e) => e.type === "bullet_list" || e.bullets);

  const rawBullets: string[] = listEvent?.bullets || narrationLine.split(/[.,;!]/).filter((s) => s.trim().length > 5);
  
  const checklistItems = rawBullets.length >= 2
    ? rawBullets.slice(0, 3).map((item) => ({
        text: item.trim().slice(0, 42),
        checked: true,
      }))
    : [
        { text: "Primary Evidence Verified", checked: true },
        { text: "Core Data Metric Confirmed", checked: true },
        { text: "Strategic Execution Plan", checked: true },
      ];

  return (
    <>
      {/* 1. TOP ZONE: Vox Headline Typography (Frame 2) */}
      <AnimatedLayer
        entrance="slide_down"
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
          highlightBg={theme?.captionHighlightBg || "#FFE600"}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.2}
        />
      </AnimatedLayer>

      {/* 2. CENTER ZONE: HANDWRITTEN CHECKLIST PAPER CARD (Frame 6) */}
      <AnimatedLayer
        entrance="slide_left"
        enterAtFrame={6}
        position={{ top: "23%", left: "6%", width: "88%", height: "auto" }}
        zIndex={30}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
      >
        <PaperWobble seed={`roadmap_card_${scene.sceneId}`} amp={1.0} rotAmp={0.2}>
          <div
            style={{
              background: "#FFFFFF",
              border: "4.5px solid #111113",
              borderRadius: "24px",
              padding: "28px 32px",
              boxShadow: "12px 12px 0px #111113",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div style={{ color: "#111113", fontFamily: "sans-serif", fontSize: "24px", fontWeight: 900, marginBottom: "20px", borderBottom: "3px solid #111113", paddingBottom: "10px", letterSpacing: "1px" }}>
              📋 VERIFIED ROADMAP FINDINGS
            </div>
            <CheckList
              items={checklistItems}
              width={640}
              fontSize={36}
              color="#111113"
              tickColor="#B4F500"
              delay={0}
            />
          </div>
        </PaperWobble>
      </AnimatedLayer>

      {/* 3. HERO SUBJECT CUTOUT CARD (Frame 10) - Cascades Over Checklist */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translateX(-50%) rotate(3deg)",
          zIndex: 35,
        }}
      >
        <VoxPolaroidCard
          imageUrl={primaryStickerUrl}
          title="PRIMARY EVIDENCE"
          subtitle="AUDITED ROADMAP FINDINGS"
          cornerTag="VERIFIED"
          stampText="AUDITED"
          rotationDeg={3}
          enterAtFrame={10}
          theme={theme}
        />
      </div>

      {/* 4. RUBBER STAMP SEAL */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label="AUDITED"
        enterAtFrame={20}
        style={{ top: "18%", right: "6%", width: "32%", height: "140px", zIndex: 40 }}
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
