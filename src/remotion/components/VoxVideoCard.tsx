import React from "react";
import { useCurrentFrame, spring, useVideoConfig, OffthreadVideo } from "remotion";
import { CharacterBoil } from "./CharacterBoil";
import { getFontFamily, FONTS } from "../utils/fonts";
import { resolveAssetUrl } from "../utils/resolveAsset";
import type { VideoTheme } from "../utils/themes";

export interface VoxVideoCardProps {
  /** Video source URL (.mp4 stream) */
  videoUrl: string;
  /** Image thumbnail / fallback if video is loading */
  fallbackImageUrl?: string;
  /** Personality / Founder / Subject Cutout Image URL (Overlaps the video card corner) */
  personalityStickerUrl?: string;
  /** Personality label tag (e.g. "FOUNDER", "CEO", "KEY WITNESS") */
  personalityTag?: string;
  /** Brand / Corporate Logo URL */
  logoUrl?: string;
  /** Primary card title label (e.g. "HISTORICAL EVIDENCE" or "LEAKED SURVEILLANCE") */
  title?: string;
  /** Subtitle monospace badge below video */
  subtitle?: string;
  /** Card style preset: polaroid | crt_monitor | archival_plate | swiss_frame */
  variant?: "polaroid" | "crt_monitor" | "archival_plate" | "swiss_frame";
  /** Card rotation angle in degrees (default: -2) */
  rotationDeg?: number;
  /** Start frame for entrance spring animation */
  enterAtFrame?: number;
  /** Top-right badge tag */
  tagText?: string;
  /** Width of card in px (default: 860 for uncropped 16:9) */
  width?: number;
  /** Height of card in px */
  height?: number;
  theme?: VideoTheme;
  style?: React.CSSProperties;
}

const boilConfig = {
  rotationOscillation: { minDeg: -1.2, maxDeg: 1.2, periodFrames: 32 },
  scaleOscillation: { minScale: 0.994, maxScale: 1.008, periodFrames: 38 },
};

const personalityBoilConfig = {
  rotationOscillation: { minDeg: -1.8, maxDeg: 1.8, periodFrames: 28 },
  scaleOscillation: { minScale: 0.990, maxScale: 1.012, periodFrames: 34 },
};

/**
 * Premium 2.5D Vox 16:9 Video Card with Overlapping Personality & Logo Cutouts.
 *
 * Implements:
 * 1. True 16:9 Uncropped Video Viewport (860px × 484px)
 * 2. Overlapping 2.5D Personality Cutout / Brand Logo with Die-Cut Paper Border & Tag
 * 3. 2.5D Character Boil Wiggle
 * 4. Tape Badges, Archival Timecode & 4K Recording Indicators
 * 5. Strictly Muted OffthreadVideo (Zero Audio Leak)
 */
export const VoxVideoCard: React.FC<VoxVideoCardProps> = ({
  videoUrl,
  fallbackImageUrl,
  personalityStickerUrl,
  personalityTag,
  logoUrl,
  title = "DOCUMENTARY EVIDENCE",
  subtitle = "● VERIFIED 4K ARCHIVE",
  variant = "polaroid",
  rotationDeg = -2.0,
  enterAtFrame = 4,
  tagText = "HISTORICAL FOOTAGE",
  width = 860,
  theme,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [videoError, setVideoError] = React.useState(false);
  const localFrame = Math.max(0, frame - enterAtFrame);

  // Card entrance spring
  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Personality sticker entrance spring (enters 4 frames later with bounce)
  const personalitySpring = spring({
    frame: Math.max(0, localFrame - 4),
    fps,
    config: { damping: 11, stiffness: 140 },
  });

  const fontFamilyName = getFontFamily(theme?.fontFamily || FONTS.bebasNeue);
  const videoViewportHeight = Math.round((width - 40) * (9 / 16)); // Exact 16:9 ratio

  // ─── VARIANT 1: RETRO CRT SURVEILLANCE MONITOR ───
  if (variant === "crt_monitor") {
    return (
      <div style={{ position: "relative", width: `${width}px`, ...style }}>
        <CharacterBoil config={boilConfig}>
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#16161A",
              border: "5px solid #000000",
              borderRadius: "24px",
              boxShadow: "14px 14px 0px rgba(0, 0, 0, 0.8), 0 20px 50px rgba(0,0,0,0.5)",
              padding: "20px 20px 22px 20px",
              transform: `scale(${cardSpring}) rotate(${rotationDeg}deg)`,
            }}
          >
            {/* Top Monitor Bezel Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                padding: "0 6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#D61C1C",
                    boxShadow: "0 0 8px #D61C1C",
                  }}
                />
                <span style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 900, color: "#FFE600", letterSpacing: "1.5px" }}>
                  REC ● 4K 24FPS
                </span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 700, color: "#AAAAAA" }}>
                CH-01 [ARCHIVE]
              </span>
            </div>

            {/* True 16:9 CRT Screen Viewport */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: `${videoViewportHeight}px`,
                backgroundColor: "#000000",
                borderRadius: "16px",
                overflow: "hidden",
                border: "3px solid #333338",
              }}
            >
              {videoUrl && !videoError ? (
                <OffthreadVideo
                  src={resolveAssetUrl(videoUrl)}
                  volume={0}
                  muted={true}
                  onError={(e) => {
                    console.warn("[VoxVideoCard] Video playback error, falling back to image:", videoUrl, e);
                    setVideoError(true);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (fallbackImageUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80") ? (
                <img
                  src={resolveAssetUrl(fallbackImageUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80")}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}

              {/* CRT Scanlines */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%)",
                  backgroundSize: "100% 4px",
                  pointerEvents: "none",
                  opacity: 0.7,
                }}
              />

              {/* Glass Glare */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 45%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Bottom Monitor Tag */}
            <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
              <span style={{ fontFamily: fontFamilyName, fontSize: "36px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "1px" }}>
                {title.toUpperCase()}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "18px", color: "#FFE600", fontWeight: "bold" }}>
                {subtitle}
              </span>
            </div>
          </div>
        </CharacterBoil>

        {/* ── OVERLAPPING PERSONALITY / FOUNDER / LOGO CUTOUT ── */}
        {(personalityStickerUrl || logoUrl) && (
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              right: "-20px",
              zIndex: 40,
              transform: `scale(${personalitySpring}) rotate(4deg)`,
              pointerEvents: "none",
            }}
          >
            <CharacterBoil config={personalityBoilConfig}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "220px",
                    height: "220px",
                    borderRadius: "20px",
                    backgroundColor: "#FFFFFF",
                    border: "4px solid #111113",
                    boxShadow: "10px 10px 0px #111113",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "6px",
                  }}
                >
                  <img
                    src={personalityStickerUrl || logoUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: logoUrl ? "contain" : "cover",
                      borderRadius: "14px",
                    }}
                  />
                </div>

                {/* Personality Badge Tag */}
                {personalityTag && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#FFE600",
                      color: "#111113",
                      border: "2.5px solid #111113",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      fontFamily: fontFamilyName,
                      fontSize: "18px",
                      fontWeight: 900,
                      letterSpacing: "1px",
                      boxShadow: "3px 3px 0px #111113",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {personalityTag.toUpperCase()}
                  </div>
                )}
              </div>
            </CharacterBoil>
          </div>
        )}
      </div>
    );
  }

  // ─── VARIANT 2: SIGNATURE 16:9 VOX POLAROID FRAME WITH PERSONALITY CUTOUT ───
  return (
    <div style={{ position: "relative", width: `${width}px`, ...style }}>
      <CharacterBoil config={boilConfig}>
        <div
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "4.5px solid #111113",
            borderRadius: "24px",
            boxShadow: "16px 16px 0px #111113, 0 24px 60px rgba(0, 0, 0, 0.15)",
            padding: "24px 22px 20px 22px",
            transform: `scale(${cardSpring}) rotate(${rotationDeg}deg)`,
            boxSizing: "border-box",
          }}
        >
          {/* Top-Right Angled Tape Badge */}
          {tagText && (
            <div
              style={{
                position: "absolute",
                top: "-18px",
                right: "32px",
                backgroundColor: "#FFE600",
                color: "#111113",
                border: "3px solid #111113",
                borderRadius: "8px",
                padding: "6px 18px",
                fontFamily: fontFamilyName,
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "1.5px",
                boxShadow: "4px 4px 0px #111113",
                zIndex: 30,
                transform: "rotate(3deg)",
              }}
            >
              {tagText.toUpperCase()}
            </div>
          )}

          {/* Top-Left Red Recording Dot */}
          <div
            style={{
              position: "absolute",
              top: "-14px",
              left: "28px",
              backgroundColor: "#111113",
              color: "#FFFFFF",
              border: "2.5px solid #111113",
              borderRadius: "6px",
              padding: "4px 14px",
              fontFamily: "monospace",
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "1.2px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 30,
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#D61C1C",
              }}
            />
            <span>● 4K ARCHIVE</span>
          </div>

          {/* True 16:9 Video Inset Screen */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: `${videoViewportHeight}px`,
              backgroundColor: "#0C0C0E",
              border: "3.5px solid #111113",
              borderRadius: "18px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "inset 0 4px 14px rgba(0, 0, 0, 0.45)",
            }}
          >
            {videoUrl && !videoError ? (
              <OffthreadVideo
                src={resolveAssetUrl(videoUrl)}
                volume={0}
                muted={true}
                onError={(e) => {
                  console.warn("[VoxVideoCard] Video playback error, falling back to image:", videoUrl, e);
                  setVideoError(true);
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (fallbackImageUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80") ? (
              <img
                src={resolveAssetUrl(fallbackImageUrl || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80")}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : null}

            {/* Subtle Video Vignette */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.38) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Card Title & Monospace Subtitle Below Video */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <h3
              style={{
                margin: 0,
                fontFamily: fontFamilyName,
                fontSize: "48px",
                fontWeight: 900,
                color: "#111113",
                letterSpacing: "2px",
                lineHeight: 1.1,
              }}
            >
              {title.toUpperCase()}
            </h3>
            <p
              style={{
                margin: "6px 0 0 0",
                fontFamily: "Courier New, monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: "#444444",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </CharacterBoil>

      {/* ── OVERLAPPING 2.5D PERSONALITY / LOGO CUTOUT STICKER ── */}
      {(personalityStickerUrl || logoUrl) && (
        <div
          style={{
            position: "absolute",
            bottom: "-35px",
            right: "-25px",
            zIndex: 40,
            transform: `scale(${personalitySpring}) rotate(4.5deg)`,
            pointerEvents: "none",
          }}
        >
          <CharacterBoil config={personalityBoilConfig}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "230px",
                  height: "230px",
                  borderRadius: "22px",
                  backgroundColor: "#FFFFFF",
                  border: "4.5px solid #111113",
                  boxShadow: "10px 10px 0px #111113",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px",
                }}
              >
                <img
                  src={personalityStickerUrl || logoUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: logoUrl ? "contain" : "cover",
                    borderRadius: "16px",
                  }}
                />
              </div>

              {/* Personality Badge Tag */}
              {personalityTag && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#FFE600",
                    color: "#111113",
                    border: "2.5px solid #111113",
                    borderRadius: "6px",
                    padding: "4px 14px",
                    fontFamily: fontFamilyName,
                    fontSize: "18px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    boxShadow: "3px 3px 0px #111113",
                    whiteSpace: "nowrap",
                  }}
                >
                  {personalityTag.toUpperCase()}
                </div>
              )}
            </div>
          </CharacterBoil>
        </div>
      )}
    </div>
  );
};
