import React from "react";
import { useCurrentFrame, spring, useVideoConfig, OffthreadVideo } from "remotion";
import { PaperSticker } from "./PaperSticker";
import { CharacterBoil } from "./CharacterBoil";
import { resolveAssetUrl } from "../utils/resolveAsset";
import { getFontFamily, FONTS } from "../utils/fonts";

import type { VideoTheme } from "../utils/themes";

interface VoxPolaroidCardProps {
  /** Image source URL */
  imageUrl?: string;
  /** Video source URL if playing footage inside frame */
  videoUrl?: string;
  /** Primary card title (e.g. "BLOCKBUSTER CEO" or "FOUNDER PORTRAIT") */
  title?: string;
  /** Monospace tag line below title (e.g. "REJECTED NETFLIX PITCH") */
  subtitle?: string;
  /** Top-right corner pill tag text (e.g. "PROPOSED BUYOUT") */
  cornerTag?: string;
  /** Optional rubber stamp text slammed over top-right (e.g. "DISRUPTED" or "BANKRUPT") */
  stampText?: string;
  /** Card rotation angle in degrees */
  rotationDeg?: number;
  /** Start frame for entrance animation */
  enterAtFrame?: number;
  /** Video Theme styling override */
  theme?: VideoTheme;
}

const boilConfig = {
  rotationOscillation: { minDeg: -1.5, maxDeg: 1.5, periodFrames: 30 },
  scaleOscillation: { minScale: 0.992, maxScale: 1.008, periodFrames: 35 },
};

/**
 * Broadcast 2.5D Vox Polaroid Card Component matching exact documentary reference styling
 */
export const VoxPolaroidCard: React.FC<VoxPolaroidCardProps> = ({
  imageUrl,
  videoUrl,
  title = "PRIMARY SUBJECT",
  subtitle = "DOCUMENTARY PROOF",
  cornerTag,
  stampText = "DISRUPTED",
  rotationDeg = -3,
  enterAtFrame = 6,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - enterAtFrame);

  // Entrance spring animation
  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Stamp slam spring animation
  const stampSpring = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: { damping: 10, stiffness: 220 },
  });

  const frameStyle = theme?.frameStyle || "polaroid_2d";
  const isDarkCard = theme?.bgStyle === "full_bleed" || theme?.captionTextColor === "#FFFFFF" || theme?.captionTextColor === "#00FFFF";
  const cardBg = isDarkCard ? "rgba(12, 17, 26, 0.94)" : "#FFFFFF";
  const cardBorder = theme?.badgeBorder || "#111111";
  const titleColor = isDarkCard ? "#FFFFFF" : (theme?.captionTextColor || "#111111");
  const fontFamilyName = getFontFamily(theme?.fontFamily || FONTS.bebasNeue);

  // Dynamic frame styling parameters based on frameStyle
  const borderRadius =
    frameStyle === "swiss_hairline"
      ? "4px"
      : frameStyle === "cyber_hud" || frameStyle === "terminal_window"
      ? "16px"
      : "28px";

  const borderThickness =
    frameStyle === "swiss_hairline" ? "2px" : "4.5px";

  const shadowStyle =
    frameStyle === "neon_glow"
      ? `0 0 25px ${theme?.orbitRingColor || "#EC4899"}, 8px 8px 0px #000000`
      : frameStyle === "cyber_hud"
      ? `0 0 20px ${theme?.orbitRingColor || "#00FFFF"}, 10px 10px 0px #000000`
      : `14px 14px 0px ${isDarkCard ? "rgba(0,0,0,0.85)" : "#111111"}`;

  return (
    <CharacterBoil config={boilConfig}>
      <div
        style={{
          position: "relative",
          width: "650px",
          backgroundColor: cardBg,
          border: `${borderThickness} solid ${cardBorder}`,
          borderRadius,
          boxShadow: shadowStyle,
          padding: frameStyle === "terminal_window" ? "40px 24px 24px 24px" : "24px 24px 30px 24px",
          transform: `scale(${cardSpring}) rotate(${rotationDeg}deg)`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Terminal Header Bar for terminal_window & cyber_hud */}
        {frameStyle === "terminal_window" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "32px",
              backgroundColor: "rgba(0,0,0,0.6)",
              borderBottom: `2px solid ${cardBorder}`,
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: theme?.orbitRingColor || "#10B981",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>
            <span>SYS_STREAM // TERMINAL_V2</span>
          </div>
        )}

        {/* Cyber HUD Corner Brackets */}
        {frameStyle === "cyber_hud" && (
          <>
            <div style={{ position: "absolute", top: "6px", left: "6px", width: "16px", height: "16px", borderTop: `3px solid ${theme?.orbitRingColor || "#00FFFF"}`, borderLeft: `3px solid ${theme?.orbitRingColor || "#00FFFF"}` }} />
            <div style={{ position: "absolute", top: "6px", right: "6px", width: "16px", height: "16px", borderTop: `3px solid ${theme?.orbitRingColor || "#00FFFF"}`, borderRight: `3px solid ${theme?.orbitRingColor || "#00FFFF"}` }} />
            <div style={{ position: "absolute", bottom: "6px", left: "6px", width: "16px", height: "16px", borderBottom: `3px solid ${theme?.orbitRingColor || "#00FFFF"}`, borderLeft: `3px solid ${theme?.orbitRingColor || "#00FFFF"}` }} />
            <div style={{ position: "absolute", bottom: "6px", right: "6px", width: "16px", height: "16px", borderBottom: `3px solid ${theme?.orbitRingColor || "#00FFFF"}`, borderRight: `3px solid ${theme?.orbitRingColor || "#00FFFF"}` }} />
          </>
        )}
        {/* Top-Right Pill Tag Attached to Card Edge */}
        {cornerTag && (
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "32px",
              backgroundColor: theme?.badgeBg || "#111111",
              border: `3px solid ${cardBorder}`,
              borderRadius: "8px",
              padding: "6px 18px",
              color: theme?.badgeText || theme?.captionHighlightColor || "#FFE600",
              fontFamily: fontFamilyName,
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
              zIndex: 30,
            }}
          >
            {cornerTag.toUpperCase()}
          </div>
        )}

        {/* Rubber Stamp Slammed Over Card (Only if short authentic stamp word) */}
        {stampText && stampText.length <= 15 && localFrame >= 10 && (
          <div
            style={{
              position: "absolute",
              top: "-28px",
              right: "-28px",
              border: "5px double #D61C1C",
              borderRadius: "10px",
              padding: "8px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#D61C1C",
              fontFamily: getFontFamily(FONTS.bebasNeue),
              fontSize: "40px",
              fontWeight: 900,
              letterSpacing: "3px",
              transform: `scale(${stampSpring}) rotate(-14deg)`,
              boxShadow: "0 6px 18px rgba(214, 28, 28, 0.35)",
              zIndex: 40,
            }}
          >
            {stampText.toUpperCase()}
          </div>
        )}

        {/* Inner Photo or Video Inset Frame */}
        <div
          style={{
            width: "100%",
            height: "380px",
            backgroundColor: "#0C0C0E",
            border: "3px solid #111111",
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {videoUrl ? (
            <OffthreadVideo
              src={resolveAssetUrl(videoUrl)}
              volume={0}
              muted={true}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <PaperSticker
              src={imageUrl || "/vox_subject_cutout.png"}
              rotationDeg={0}
              isSingleSubject={false}
              width="100%"
              height="100%"
              style={{ objectFit: "contain" }}
            />
          )}
        </div>

        {/* Card Title & Subtitle Below Photo */}
        <div style={{ marginTop: "22px", textAlign: "center" }}>
          <h3
            style={{
              margin: 0,
              fontFamily: fontFamilyName,
              fontSize: "48px",
              fontWeight: 900,
              color: titleColor,
              letterSpacing: "2px",
              lineHeight: 1.1,
            }}
          >
            {title.toUpperCase()}
          </h3>
          {subtitle && (
            <p
              style={{
                margin: "8px 0 0 0",
                fontFamily: "Courier New, monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: "#666666",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </CharacterBoil>
  );
};
