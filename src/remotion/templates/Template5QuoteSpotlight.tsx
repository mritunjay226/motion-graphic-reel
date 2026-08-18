import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { GsapSvgGraphics } from "../components/GsapSvgGraphics";
import { ExitAnimationWrapper } from "../components/ExitAnimationWrapper";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { VoxVideoCard } from "../components/VoxVideoCard";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * TEMPLATE 5: `punchline_quote_spotlight`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 8: Dark Spotlight Quote Card enters (`left: 10%`, `width: 80%`, `top: 27%`) with fade scale
 * - Frame 24: Rubber Stamp Seal slams in top-right (`stamp_seal`, scale 2.5 -> 1.0, rot -5°)
 * - Frame 26: 2.5D Paper Confetti burst explodes outward (`confetti_burst`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template5QuoteSpotlight: React.FC<TemplateProps> = ({ scene, theme }) => {
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
  const quoteEvent = events.find((e) => e.type === "quote_card") || events[0];
  const primaryStickerUrl = (scene as any).imageUrl || scene.imageKitUrls?.foreground || scene.imageKitUrls?.props?.[0] || "";

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "KEY NARRATIVE PAYOFF";

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
          fontSize={44}
          color={theme?.captionTextColor || "#1F1F1F"}
          fontFamily={theme?.fontFamily}
          highlightWords={highlightWords}
          highlightBg={theme?.captionHighlightBg}
          highlightColor={theme?.captionHighlightColor || "#D61C1C"}
          highlightScale={1.35}
        />
      </AnimatedLayer>

      {/* 2. MEDIA CARD (Frame 6) */}
      {(scene.videoUrl || scene.bRollUrl) && (
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 15,
          }}
        >
          <VoxVideoCard
            videoUrl={scene.videoUrl || scene.bRollUrl || ""}
            fallbackImageUrl={primaryStickerUrl}
            personalityStickerUrl={primaryStickerUrl}
            personalityTag="SPEAKER"
            title={scene.sceneTitle ? scene.sceneTitle.replace(/^SCENE \d+:\s*/i, "").slice(0, 24) : "INSIGHT PROOF"}
            subtitle="● KEY PAYOFF"
            tagText="MOMENT OF TRUTH"
            rotationDeg={-1}
            enterAtFrame={6}
            theme={theme}
            width={820}
          />
        </div>
      )}

      {/* 3. CENTER ZONE: Spotlight Quote Card (Frame 8) */}
      <ExitAnimationWrapper
        startFrameOffset={8}
        durationFrames={durationFrames}
        exitAnimation="fade_scale"
        style={{
          position: "absolute",
          top: (scene.videoUrl || scene.bRollUrl) ? "54%" : "30%",
          left: "8%",
          width: "84%",
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(12, 12, 14, 0.96)",
            color: "#FFFFFF",
            border: "3.5px solid #FFE600",
            padding: "20px 26px",
            borderRadius: "20px",
            borderLeft: "10px solid #FFE600",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            position: "relative",
          }}
        >
          <span style={{ fontSize: "36px", fontFamily: "Georgia, serif", color: "#FFE600", lineHeight: 0.6, display: "block", marginBottom: "8px" }}>
            “
          </span>
          <p style={{ fontFamily: theme?.fontFamily || "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: 800, margin: 0, lineHeight: 1.3, letterSpacing: "0.5px", color: "#FFFFFF" }}>
            {quoteEvent?.content || narrationLine}
          </p>
        </div>
      </ExitAnimationWrapper>

      {/* 3. TOP RIGHT STAMP SEAL (Frame 24) */}
      <GsapSvgGraphics
        type="stamp_seal"
        color="#FFE600"
        label={scene.sceneTitle ? scene.sceneTitle.replace(/^SCENE \d+:\s*/i, "").slice(0, 16).toUpperCase() : "KEY INSIGHT"}
        enterAtFrame={24}
        style={{ top: "24%", right: "8%", width: "36%", height: "140px", zIndex: 30 }}
      />

      {/* 4. CONFETTI BURST (Frame 26) */}
      <GsapSvgGraphics
        type="confetti_burst"
        color="#FFE600"
        enterAtFrame={26}
        style={{ top: "35%", left: "50%", zIndex: 40 }}
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
