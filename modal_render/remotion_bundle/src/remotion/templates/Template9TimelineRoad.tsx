import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { AnimatedLayer } from "../components/ParallaxLayer";
import { VoxTypography } from "../components/VoxTypography";
import { TypewriterParagraph } from "../components/TypewriterParagraph";
import { ExitAnimationWrapper } from "../components/ExitAnimationWrapper";
import { WordByWordCaptions } from "../components/WordByWordCaptions";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * TEMPLATE 9: `timeline_milestone_road`
 *
 * Meticulous 2.5D Spatial Math & Keyframe Staggering:
 * - Frame 2: Headline Typography enters (`slide_up_word`)
 * - Frame 6: Vertical dashed timeline line draws down (`left: 12%`, `top: 27%`)
 * - Frame 10, 18, 26: Milestone year nodes (`1997`, `2007`, `2024`) pop in along the line
 * - Frame 22: Right Typewriter Memo Document slides in (`left: 48%`, `width: 46%`, `top: 28%`)
 * - Frame 12+: Kinetic Subtitles at bottom 140px
 */
export const Template9TimelineRoad: React.FC<TemplateProps> = ({ scene, theme }) => {
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
  const memoEvent = events.find((e) => e.type === "typewriter_memo") || events[0];

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const subtitleText = narrationLine ? narrationLine.toUpperCase() : "HISTORICAL EVOLUTION TIMELINE";

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  const narrationYears = narrationLine.match(/\b(19\d\d|20\d\d)\b/g);
  const milestones = narrationYears && narrationYears.length >= 2
    ? narrationYears.slice(0, 3).map((yr, idx) => ({
        year: yr,
        label: `PHASE 0${idx + 1}`,
      }))
    : [
        { year: "01", label: "GENESIS PHASE" },
        { year: "02", label: "PIVOTAL SHIFT" },
        { year: "03", label: "CURRENT STATE" },
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

      {/* 2. LEFT ZONE: Milestone Timeline Path (Frames 6-26) */}
      <div style={{ position: "absolute", top: "27%", left: "8%", width: "36%", display: "flex", flexDirection: "column", gap: "20px", zIndex: 15 }}>
        {milestones.map((m, idx) => (
          <AnimatedLayer
            key={idx}
            entrance="pop_in"
            enterAtFrame={10 + idx * 8}
            sceneStartFrame={startFrame}
            sceneDurationFrames={durationFrames}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ padding: "6px 12px", backgroundColor: "#111111", borderRadius: "8px", border: "2px solid #333" }}>
                <span style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: "bold", color: "#FFE600" }}>
                  {m.year}
                </span>
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", fontWeight: 400, color: "#111111", letterSpacing: "1px" }}>
                {m.label}
              </span>
            </div>
          </AnimatedLayer>
        ))}
      </div>

      {/* 3. RIGHT ZONE: Typewriter Memo Document (Frame 22) */}
      <ExitAnimationWrapper
        startFrameOffset={22}
        durationFrames={durationFrames}
        exitAnimation="paper_tear_out"
        style={{
          position: "absolute",
          top: "28%",
          left: "48%",
          width: "46%",
          zIndex: 20,
        }}
      >
        <TypewriterParagraph
          headline={memoEvent?.headline || "EVOLUTION RECORD"}
          content={memoEvent?.content || narrationLine}
          startFrameOffset={0}
        />
      </ExitAnimationWrapper>

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
