import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { VoxTypography } from "../components/VoxTypography";
import { WordByWordCaptions } from "../components/WordByWordCaptions";
import { KineticMarqueeRibbon } from "../components/typography/KineticMarqueeRibbon";
import { GhostedActCounter } from "../components/typography/GhostedActCounter";
import { TypographyWallpaperGrid } from "../components/typography/TypographyWallpaperGrid";
import { DocumentaryEvidenceCard } from "../components/tactile/DocumentaryEvidenceCard";
import { RubberStampInkBleed } from "../components/tactile/RubberStampInkBleed";

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

/**
 * TEMPLATE 22: `kinetic_typography_marquee`
 *
 * High-retention editorial & documentary kinetic typography layout (Vox, Johnny Harris, MagnatesMedia).
 *
 * Features:
 * - Subtle multi-row typography wallpaper grid
 * - Massive ghosted act counter numeral ("01" / "02") drifting with parallax scale in background
 * - Dual crossing kinetic marquee ribbons (angled filled/hazard & outlined)
 * - Pinned foreground evidence dossier card casting realistic contact shadow
 * - Forensic rubber stamp impact
 * - Clean vertical safe zones preserving word-by-word karaoke captions
 */
export const Template22KineticTypography: React.FC<TemplateProps> = ({ scene, theme }) => {
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

  // Derive chapter numeral from scene index or keywords
  const actNumeral = (scene as any).sceneIndex
    ? String((scene as any).sceneIndex).padStart(2, "0")
    : "01";

  const kickerLabel = `ACT ${actNumeral} // THE INVESTIGATION`;

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
      {/* ── LAYER 1: TYPOGRAPHY WALLPAPER GRID (FULL-BLEED BACKGROUND) ── */}
      <TypographyWallpaperGrid
        opacity={0.05}
        color="#0F172A"
        fontSize={44}
        rowGap={36}
      />

      {/* ── LAYER 2: MASSIVE GHOSTED ACT COUNTER ── */}
      <GhostedActCounter
        counterText={actNumeral}
        kickerText={kickerLabel}
        enterAtFrame={2}
        fontSize={360}
        color="#0F172A"
        opacity={0.11}
        top="460px"
      />

      {/* ── LAYER 3: DUAL CROSSING KINETIC MARQUEE RIBBONS ── */}
      {/* Ribbon A: Angled at -7deg, Hazard Caution Ribbon moving Left */}
      <KineticMarqueeRibbon
        items={[
          "CLASSIFIED DOSSIER",
          "UNRELEASED EVIDENCE",
          "FORENSIC AUDIT",
          "INTERNAL MEMO",
          "TOP SECRET",
        ]}
        speed={2.6}
        direction="left"
        rotationDeg={-7}
        variant="hazard"
        fontSize={34}
        top="540px"
        zIndex={12}
        opacity={0.92}
      />

      {/* Ribbon B: Angled at +5deg, Duo High-Fashion Tape moving Right */}
      <KineticMarqueeRibbon
        items={[
          "FINANCIAL CRIME TRAIL",
          "OFFSHORE WIRE TRANSFERS",
          "SUBPOENA SERVED",
          "SANCTION BREACH",
        ]}
        speed={1.8}
        direction="right"
        rotationDeg={5}
        variant="duo"
        color="#0F172A"
        fontSize={34}
        top="920px"
        zIndex={11}
        opacity={0.78}
      />

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
        {/* Archival Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "4px",
            backgroundColor: "#0F172A",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#FFE600",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: "#FFE600",
              textTransform: "uppercase",
            }}
          >
            CONFIDENTIAL ARCHIVE
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
          enterAtFrame={4}
        />
      </div>

      {/* ── LAYER 4: FOREGROUND PINNED EVIDENCE CARD (FOCAL SUBJECT) ── */}
      <div
        style={{
          position: "absolute",
          top: "620px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.22))",
        }}
      >
        <DocumentaryEvidenceCard
          title="EXHIBIT #409: THE TRANSCRIPT"
          subtitle="WIRE-TAP RECORDING: 02:44 AM"
          dymoLabel="VERIFIED EVIDENCE"
          handwrittenNote="Matched with Swiss transaction #84"
          pinType="crimson"
          showTape={true}
          showPaperclip={true}
          rotationDeg={-2}
          width={380}
          height={430}
          enterAtFrame={10}
          scale={0.96}
        />

        {/* Forensic Rubber Stamp Slam */}
        <div
          style={{
            position: "absolute",
            top: "160px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
          }}
        >
          <RubberStampInkBleed
            text="CLASSIFIED LEAK"
            subtext="SUBPOENA #892-A"
            impactFrame={26}
            rotationDeg={-12}
            color="#DC2626"
            scale={0.95}
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
