import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { VoxTypography } from "../components/VoxTypography";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { TippingBalanceScale } from "../components/metaphors/TippingBalanceScale";
import { LeakingConversionFunnel } from "../components/metaphors/LeakingConversionFunnel";
import { VaultLockShield } from "../components/metaphors/VaultLockShield";
import { SpeedometerRedline } from "../components/metaphors/SpeedometerRedline";

export type ConcreteMetaphorType = "balance_scale" | "leaking_funnel" | "vault_shield" | "speedometer";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * Deterministically resolves the appropriate physical metaphor from scene keywords or explicit props.
 */
function resolveMetaphorType(scene: Scene): ConcreteMetaphorType {
  const explicit = ((scene as any).metaphorType || (scene as any).visualType) as string | undefined;
  if (explicit) {
    if (explicit.includes("balance") || explicit.includes("scale") || explicit.includes("debt")) {
      return "balance_scale";
    }
    if (explicit.includes("funnel") || explicit.includes("leak") || explicit.includes("churn")) {
      return "leaking_funnel";
    }
    if (explicit.includes("vault") || explicit.includes("lock") || explicit.includes("shield") || explicit.includes("secur")) {
      return "vault_shield";
    }
    if (explicit.includes("speed") || explicit.includes("tachometer") || explicit.includes("redline") || explicit.includes("gauge")) {
      return "speedometer";
    }
  }

  // Keyword heuristic search across narration & sceneTitle
  const text = `${scene.sceneTitle || ""} ${scene.narrationLine || ""}`.toLowerCase();

  if (/churn|leak|drop|funnel|bounce|retention|traffic loss/.test(text)) {
    return "leaking_funnel";
  }
  if (/secur|vault|lock|encrypt|protect|theft|fraud|hack|privacy|breach/.test(text)) {
    return "vault_shield";
  }
  if (/speed|fast|rpm|redline|throttle|latency|overload|benchmark|throughput|velocity/.test(text)) {
    return "speedometer";
  }
  if (/cost|debt|weigh|scale|balance|tradeoff|burn|value|roi|loss|versus/.test(text)) {
    return "balance_scale";
  }

  return "balance_scale";
}

/**
 * TEMPLATE 19: `visual_metaphor_documentary`
 *
 * Dedicated to high-retention documentary explainer reels (Vox, Johnny Harris, MagnatesMedia).
 * Renders concrete, physical mechanical metaphors (scales, leaking funnels, bank vaults, tachometers)
 * to make abstract concepts visually visceral.
 *
 * Strictly free of digital SaaS UI components (no browsers, no mouse pointers).
 */
export const Template19VisualMetaphors: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  const metaphorType = resolveMetaphorType(scene);

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
        {/* Archival Evidence Tag / Kicker Badge */}
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
            {metaphorType === "balance_scale" && "ECONOMIC EQUILIBRIUM"}
            {metaphorType === "leaking_funnel" && "PIPELINE ATTRITION AUDIT"}
            {metaphorType === "vault_shield" && "PERIMETER HARDENING"}
            {metaphorType === "speedometer" && "THROUGHPUT STRESS TEST"}
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

      {/* ── CENTER STAGE: CONCRETE MECHANICAL METAPHOR (Y: 410px - 1380px) ── */}
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
        {metaphorType === "balance_scale" && (
          <TippingBalanceScale
            leftLabel="VALUE / REVENUE"
            leftValue="$3.2M"
            leftSub="Annual Run Rate"
            rightLabel="TECH DEBT"
            rightValue="$14.8M"
            rightSub="Estimated Impact"
            tiltDirection="right_down"
            maxTiltAngleDeg={16}
            dropFrame={16}
            scale={0.94}
          />
        )}

        {metaphorType === "leaking_funnel" && (
          <LeakingConversionFunnel
            topLabel="100,000 VISITS"
            topMetric="TOP OF FUNNEL"
            midLabel="12,000 SIGNUPS"
            midMetric="TRIAL ACTIVATION"
            bottomLabel="450 CUSTOMERS"
            bottomMetric="NET RETENTION"
            leakStartFrame={14}
            scale={0.92}
          />
        )}

        {metaphorType === "vault_shield" && (
          <VaultLockShield
            unlockedLabel="UNPROTECTED ASSETS"
            lockedLabel="AIR-GAPPED VAULT"
            securityBadge="AES-256 ENCRYPTED LOCK"
            lockFrame={22}
            scale={0.92}
          />
        )}

        {metaphorType === "speedometer" && (
          <SpeedometerRedline
            valueDisplay="14,850"
            unitLabel="REQUESTS / SEC"
            title="SYSTEM LIMIT OVERLOAD"
            warningLabel="REV-LIMITER ENGAGED (10X LOAD)"
            revFrame={14}
            scale={0.92}
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

