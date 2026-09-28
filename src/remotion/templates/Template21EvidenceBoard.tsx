import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { VoxTypography } from "../components/VoxTypography";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { DocumentaryEvidenceCard } from "../components/tactile/DocumentaryEvidenceCard";
import { RedYarnConnector } from "../components/tactile/RedYarnConnector";
import { RubberStampInkBleed } from "../components/tactile/RubberStampInkBleed";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * TEMPLATE 21: `conspiracy_evidence_board`
 *
 * Dedicated to iconic investigative documentary conspiracy boards (Vox, Johnny Harris, MagnatesMedia).
 *
 * Features:
 * - 3 Asymmetric pinned evidence dossier cards
 * - Real physics-driven Red Yarn strings connecting pins with catenary sag & pluck vibration
 * - Slamming forensic rubber stamp with camera micro-shake kick
 * - Archival tags and synchronized karaoke captions
 */
export const Template21EvidenceBoard: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  // Pin Anchor Coordinates for the 3 Evidence Cards:
  // Card A: Center ~ (260, 560), Top Pin at (260, 380)
  // Card B: Center ~ (820, 580), Top Pin at (820, 400)
  // Card C: Center ~ (540, 970), Top Pin at (540, 780)
  const pinA = { x: 260, y: 380 };
  const pinB = { x: 820, y: 400 };
  const pinC = { x: 540, y: 780 };

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
      {/* ── TOP SECTION: ARCHIVAL DOSSIER KICKER & HEADLINE ── */}
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
              backgroundColor: "#DC2626",
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
            FORENSIC EVIDENCE TRAIL
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

      {/* ── CENTER STAGE: THE CONSPIRACY PIN BOARD ── */}
      {/* 1. Red Yarn Connectors Running Between the Push Pins */}
      {/* String 1: Pin A -> Pin B (Snaps at frame 12) */}
      <RedYarnConnector
        from={pinA}
        to={pinB}
        startFrame={12}
        sagAmount={28}
        pluckAmplitude={20}
        color="#DC2626"
        showPins={false}
      />

      {/* String 2: Pin B -> Pin C (Snaps at frame 18) */}
      <RedYarnConnector
        from={pinB}
        to={pinC}
        startFrame={18}
        sagAmount={26}
        pluckAmplitude={18}
        color="#DC2626"
        showPins={false}
      />

      {/* String 3: Pin C -> Pin A (Snaps at frame 24, completing conspiracy loop) */}
      <RedYarnConnector
        from={pinC}
        to={pinA}
        startFrame={24}
        sagAmount={28}
        pluckAmplitude={18}
        color="#B91C1C"
        showPins={false}
      />

      {/* 2. Pinned Evidence Cards */}
      {/* Card A: Top Left */}
      <div style={{ position: "absolute", left: "90px", top: "390px", zIndex: 20 }}>
        <DocumentaryEvidenceCard
          title="DELAWARE SHELL CORP"
          subtitle="REGISTERED: MARCH 1999"
          dymoLabel="EXHIBIT #01"
          handwrittenNote="Paper entity with $0 payroll"
          pinType="brass"
          showTape={true}
          showPaperclip={false}
          rotationDeg={-4}
          width={330}
          height={380}
          enterAtFrame={4}
          scale={0.96}
        />
      </div>

      {/* Card B: Top Right */}
      <div style={{ position: "absolute", right: "90px", top: "410px", zIndex: 20 }}>
        <DocumentaryEvidenceCard
          title="SWISS ESCROW VAULT"
          subtitle="ACCOUNT: #8492-CH"
          dymoLabel="EXHIBIT #02"
          handwrittenNote="Wire transfer routed via Zurich"
          pinType="brass"
          showTape={false}
          showPaperclip={true}
          rotationDeg={3}
          width={330}
          height={380}
          enterAtFrame={8}
          scale={0.96}
        />
      </div>

      {/* Card C: Bottom Center (The Smoking Gun) */}
      <div style={{ position: "absolute", left: "375px", top: "790px", zIndex: 22 }}>
        <DocumentaryEvidenceCard
          title="THE SECRET LEDGER"
          subtitle="CONFIDENTIAL INTERNAL AUDIT"
          dymoLabel="SMOKING GUN"
          handwrittenNote="Signed off by executive board"
          pinType="crimson"
          showTape={true}
          showPaperclip={true}
          rotationDeg={-1}
          width={330}
          height={390}
          enterAtFrame={14}
          scale={0.98}
        />


        {/* Slamming Rubber Stamp Impact on the Smoking Gun Card (Frame 34) */}
        <div
          style={{
            position: "absolute",
            top: "140px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
          }}
        >
          <RubberStampInkBleed
            text="FRAUD CONFIRMED"
            subtext="AUDIT VERDICT #849"
            impactFrame={32}
            rotationDeg={-14}
            color="#DC2626"
            scale={0.92}
          />
        </div>
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
