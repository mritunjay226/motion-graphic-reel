import React from "react";
import { SOCIAL_SAFE_ZONES, type SocialPlatform } from "../utils/safeZoneAudit";

export interface SocialSafeZoneOverlayProps {
  platform?: SocialPlatform;
  /** Opacity of danger zone shading (default 0.18) */
  shadingOpacity?: number;
  /** Whether to show platform UI buttons (like, comment, share, sound) */
  showPlatformUi?: boolean;
  /** Whether to show technical crosshairs & boundary guide lines */
  showGuides?: boolean;
}

export const SocialSafeZoneOverlay: React.FC<SocialSafeZoneOverlayProps> = ({
  platform = "all",
  shadingOpacity = 0.22,
  showPlatformUi = true,
  showGuides = true,
}) => {
  const bounds = SOCIAL_SAFE_ZONES[platform];

  const safeWidth = bounds.right - bounds.left;
  const safeHeight = bounds.bottom - bounds.top;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "1080px",
        height: "1920px",
        pointerEvents: "none",
        zIndex: 9999,
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      }}
    >
      {/* ── 1. TOP DANGER ZONE (0 to bounds.top) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1080px",
          height: `${bounds.top}px`,
          backgroundColor: `rgba(239, 68, 68, ${shadingOpacity})`,
          borderBottom: "2px dashed #EF4444",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "8px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#FFFFFF",
            backgroundColor: "#DC2626",
            padding: "2px 10px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          ⚠️ TOP DANGER ZONE (0 – {bounds.top}px) // APP HEADER & SEARCH
        </span>
      </div>

      {/* ── 2. BOTTOM DANGER ZONE (bounds.bottom to 1920px) ── */}
      <div
        style={{
          position: "absolute",
          top: `${bounds.bottom}px`,
          left: 0,
          width: "1080px",
          height: `${1920 - bounds.bottom}px`,
          backgroundColor: `rgba(239, 68, 68, ${shadingOpacity})`,
          borderTop: "2px dashed #EF4444",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "8px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#FFFFFF",
            backgroundColor: "#DC2626",
            padding: "2px 10px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            marginBottom: "12px",
          }}
        >
          ⚠️ BOTTOM DANGER ZONE ({bounds.bottom} – 1920px) // CAPTIONS, AUDIO & COMMENTS
        </span>

        {/* Realistic Mobile Caption & Audio Mockup */}
        {showPlatformUi && (
          <div
            style={{
              width: "720px",
              paddingLeft: "48px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignSelf: "flex-start",
              opacity: 0.85,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>
                @investigative.desk
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  padding: "1px 6px",
                  borderRadius: "2px",
                }}
              >
                FOLLOW
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#E2E8F0",
                lineHeight: 1.3,
                margin: 0,
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              The confidential money trail behind the shell corporation unsealed... #documentary #finance
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px" }}>♫</span>
              <span style={{ fontSize: "12px", color: "#CBD5E1" }}>
                Original Audio - Investigative Reels
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. RIGHT-SIDE ENGAGEMENT CLUSTER (bounds.right to 1080px) ── */}
      <div
        style={{
          position: "absolute",
          top: `${bounds.top}px`,
          left: `${bounds.right}px`,
          width: `${1080 - bounds.right}px`,
          height: `${safeHeight}px`,
          backgroundColor: `rgba(245, 158, 11, ${shadingOpacity * 0.9})`,
          borderLeft: "2px dashed #F59E0B",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "80px",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#FFFFFF",
            backgroundColor: "#D97706",
            padding: "8px 4px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          ⚠️ ENGAGEMENT CLUSTER ({bounds.right}px – 1080px)
        </span>

        {/* Realistic Mobile Engagement Button Stack Mockup */}
        {showPlatformUi && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "18px",
              opacity: 0.9,
            }}
          >
            {/* Profile Avatar with + badge */}
            <div style={{ position: "relative", width: "48px", height: "48px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #EF4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "14px",
                  color: "#0F172A",
                }}
              >
                ID
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </div>
            </div>

            {/* Like Heart */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", marginTop: "2px" }}>
                245.8K
              </span>
            </div>

            {/* Comment Bubble */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", marginTop: "2px" }}>
                1,894
              </span>
            </div>

            {/* Bookmark Star */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", marginTop: "2px" }}>
                32.1K
              </span>
            </div>

            {/* Share Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", marginTop: "2px" }}>
                12.4K
              </span>
            </div>

            {/* Rotating Audio Disc */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#1E293B",
                border: "4px solid #0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 4. PRIMARY SAFE ZONE BOUNDARY GUIDE (CENTER RETENTION STAGE) ── */}
      {showGuides && (
        <div
          style={{
            position: "absolute",
            top: `${bounds.top}px`,
            left: `${bounds.left}px`,
            width: `${safeWidth}px`,
            height: `${safeHeight}px`,
            border: "2px solid #10B981",
            boxSizing: "border-box",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "12px",
          }}
        >
          {/* Top Guide Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.14em",
                color: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              ⌜ PRIMARY SAFE CANVAS: {safeWidth} × {safeHeight}px
            </span>
            <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 800 }}>
              PLATFORM: {platform.toUpperCase()} ⌝
            </span>
          </div>

          {/* Center Crosshair Reference */}
          <div
            style={{
              alignSelf: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              opacity: 0.5,
            }}
          >
            <div style={{ width: "32px", height: "1px", backgroundColor: "#10B981" }} />
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#10B981", letterSpacing: "0.2em" }}>
              + RETENTION CENTER +
            </span>
            <div style={{ width: "32px", height: "1px", backgroundColor: "#10B981" }} />
          </div>

          {/* Bottom Guide Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.14em",
                color: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              ⌞ WORD CAPTIONS CLEARANCE SAFE ZONE
            </span>
            <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 800 }}>
              100% VISIBLE ⌟
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
