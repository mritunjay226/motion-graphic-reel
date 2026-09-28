import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { VoxTypography } from "../components/VoxTypography";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { InteractiveBrowserMockup } from "../components/InteractiveBrowserMockup";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * TEMPLATE 18: `saas_product_hero`
 *
 * High-Fidelity 3D Perspective SaaS Browser & Interactive Click Choreography (Linear / Stripe style).
 *
 * Sequence Flow:
 * - Frame 2: Top tech kicker badge + Vox headline reveal
 * - Frame 6: 3D perspective browser mockup slides in with ambient glass sheen
 * - Frame 18: Animated cursor glides across dashboard toward CTA button
 * - Frame 42: Cursor clicks down with expanding radial shockwave ripple
 * - Frame 44: Action button illuminates emerald green with live deployment confirmation
 * - Synchronized bottom karaoke captions
 */
export const Template18SaaSHero: React.FC<TemplateProps> = ({ scene, theme }) => {
  const {
    sceneTitle,
    startFrame,
    durationFrames,
    whisperTokens,
    kineticCaptions,
    narrationLine,
  } = scene;

  const headlineText = sceneTitle
    ? sceneTitle.replace(/^SCENE \d+:\s*/i, "").toUpperCase()
    : narrationLine.toUpperCase();

  const highlightWords =
    kineticCaptions?.highlightWords && kineticCaptions.highlightWords.length > 0
      ? kineticCaptions.highlightWords
      : headlineText.split(/\s+/).slice(0, 2);

  return (
    <div
      style={{
        position: "relative",
        width: "1080px",
        height: "1920px",
        overflow: "hidden",
        backgroundColor: theme?.canvasBg || "#0F172A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ── TOP SECTION: TECHNICAL BADGE & HEADLINE (Y: 100px - 340px) ── */}
      <div
        style={{
          position: "absolute",
          top: "110px",
          width: "920px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {/* Monospace System Kicker Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            backgroundColor: "rgba(139, 92, 246, 0.15)",
            border: "1px solid rgba(139, 92, 246, 0.35)",
            color: "#A78BFA",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            marginBottom: "16px",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 8px #10B981" }} />
          SaaS Platform Architecture
        </div>

        {/* Dynamic Headline */}
        <VoxTypography
          text={headlineText}
          highlightWords={highlightWords}
          entrance="slide_up_word"
          fontSize={52}
          color="#FFFFFF"
          enterAtFrame={3}
        />
      </div>

      {/* ── CENTER SECTION: 3D PERSPECTIVE BROWSER MOCKUP (Y: 380px) ── */}
      <div
        style={{
          position: "absolute",
          top: "390px",
          width: "940px",
          height: "1100px",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <InteractiveBrowserMockup
          title="cloud.pipeline.io — Production Deploy"
          url="https://cloud.pipeline.io/clusters/production/deploy"
          themeMode="dark"
          perspectiveTilt={true}
          width={920}
          height={1080}
          badgeText="EDGE CLUSTER LIVE"
          badgeColor="#10B981"
          interactiveCursor={true}
          cursorConfig={{
            startPoint: { x: 740, y: 780 },
            targetPoint: { x: 460, y: 550 },
            startFrame: 16,
            moveDurationFrames: 26,
            clickAtFrame: 44,
            authorLabel: "Deployer",
            authorBadgeColor: "#8B5CF6",
            rippleColor: "#10B981",
          }}
        />
      </div>

      {/* ── BOTTOM SECTION: SYNCHRONIZED KARAOKE CAPTIONS (Y: 1560px) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "130px",
          width: "920px",
          zIndex: 40,
        }}
      >
        <WordByWordCaptions
          tokens={whisperTokens}
          themeHighlightColor="#10B981"
          themeTextColor="#FFFFFF"
        />
      </div>
    </div>
  );
};
