import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { VoxTypography } from "../components/VoxTypography";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { GlowingSplineAreaChart } from "../components/dataviz/GlowingSplineAreaChart";
import { RadialProgressDonut } from "../components/dataviz/RadialProgressDonut";
import { FeatureComparisonMatrix } from "../components/dataviz/FeatureComparisonMatrix";

export type DataVizEngineType = "spline_area" | "radial_donut" | "comparison_matrix";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * Resolves the appropriate data visualization engine from scene props or keyword heuristics.
 */
function resolveVizEngine(scene: Scene): DataVizEngineType {
  const explicit = ((scene as any).vizType || (scene as any).visualType) as string | undefined;

  if (explicit) {
    if (explicit.includes("spline") || explicit.includes("area") || explicit.includes("curve") || explicit.includes("trend")) {
      return "spline_area";
    }
    if (explicit.includes("donut") || explicit.includes("radial") || explicit.includes("share") || explicit.includes("monopoly")) {
      return "radial_donut";
    }
    if (explicit.includes("matrix") || explicit.includes("comparison") || explicit.includes("versus") || explicit.includes("vs")) {
      return "comparison_matrix";
    }
  }

  const text = `${scene.sceneTitle || ""} ${scene.narrationLine || ""}`.toLowerCase();

  if (/share|percent|monopoly|portion|ratio|quota|dominance/.test(text)) {
    return "radial_donut";
  }
  if (/versus|vs|compare|rival|better|worse|advantage|showdown|audit/.test(text)) {
    return "comparison_matrix";
  }
  if (/growth|revenue|valuation|trend|curve|soar|billion|trillion|drop|crash|trajectory/.test(text)) {
    return "spline_area";
  }

  return "spline_area";
}

/**
 * TEMPLATE 20: `advanced_data_viz_suite`
 *
 * Broadcast-caliber data visualization for high-retention documentary explainer reels.
 * Intelligently switches between:
 * 1. Glowing Spline Area Chart (Valuation / Hockey-Stick / Revenue Trends)
 * 2. Concentric Radial Progress Donut (Market Share / Monopoly Audits)
 * 3. Feature Comparison Matrix (Direct Rivalry & Disruption Showdowns)
 */
export const Template20DataVizSuite: React.FC<TemplateProps> = ({ scene, theme }) => {
  const {
    sceneTitle,
    startFrame,
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

  const vizEngine = resolveVizEngine(scene);

  return (
    <div
      style={{
        position: "relative",
        width: "1080px",
        height: "1920px",
        overflow: "hidden",
        backgroundColor: theme?.canvasBg || "#FAF8F2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ── TOP SECTION: DOCUMENTARY KICKER & HEADLINE ── */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          width: "920px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        {/* Documentary Kicker Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "4px",
            backgroundColor: "#FAF5E8",
            border: "2px solid #854D0E",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#D97706",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#854D0E",
              textTransform: "uppercase",
            }}
          >
            {vizEngine === "spline_area" && "FINANCIAL TRAJECTORY AUDIT"}
            {vizEngine === "radial_donut" && "MARKET DOMINANCE METRICS"}
            {vizEngine === "comparison_matrix" && "DISRUPTION SHOWDOWN AUDIT"}
          </span>
        </div>

        {/* High-Retention Vox Typography Headline */}
        <VoxTypography
          text={headlineText}
          highlightWords={highlightWords}
          fontSize={74}
          fontFamily={theme?.fontFamily || "Bebas Neue"}
          color="#0F172A"
          highlightBg="#FFE600"
          highlightColor="#000000"
          enterAtFrame={6}
        />
      </div>

      {/* ── CENTER STAGE: ADVANCED DATA VISUALIZATION (Y: 410px - 1380px) ── */}
      <div
        style={{
          position: "absolute",
          top: "410px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        {vizEngine === "spline_area" && (
          <GlowingSplineAreaChart
            title="VALUATION SURGE"
            subtitle="HISTORICAL TRAJECTORY AUDIT"
            startFrame={8}
            aesthetic="documentary"
            scale={0.96}
          />
        )}

        {vizEngine === "radial_donut" && (
          <RadialProgressDonut
            title="GLOBAL MARKET MONOPOLY"
            subtitle="ADVANCED SEMICONDUCTOR FABRICATION"
            primaryPercentage={92.4}
            primaryLabel="GLOBAL CHIP SHARE"
            startFrame={6}
            aesthetic="documentary"
            scale={0.96}
          />
        )}

        {vizEngine === "comparison_matrix" && (
          <FeatureComparisonMatrix
            title="DISRUPTION SHOWDOWN"
            subtitle="THE STRUCTURAL SHIFT THAT KILLED AN EMPIRE"
            legacyName="BLOCKBUSTER (LEGACY)"
            winnerName="NETFLIX (DISRUPTOR)"
            startFrame={6}
            verdictBanner="VERDICT: 10X OPERATIONAL EFFICIENCY"
            aesthetic="documentary"
            scale={0.96}
          />
        )}
      </div>

      {/* ── BOTTOM SECTION: SYNCHRONIZED KARAOKE CAPTIONS ── */}
      {whisperTokens && whisperTokens.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "120px",
            width: "920px",
            display: "flex",
            justifyContent: "center",
            zIndex: 40,
          }}
        >
          <WordByWordCaptions
            tokens={whisperTokens}
            sceneStartFrame={startFrame}
            maxWordsPerPage={4}
            themeFontFamily={theme?.fontFamily || "Bebas Neue"}
            themeTextColor="#0F172A"
            themeHighlightBg="#FFE600"
            themeHighlightColor="#000000"
          />
        </div>
      )}
    </div>
  );
};
