import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { AnimatedCursor, AnimatedCursorProps } from "./AnimatedCursor";

export interface InteractiveBrowserMockupProps {
  /** Page title for window tab */
  title?: string;
  /** Display URL in address bar */
  url?: string;
  /** UI theme mode (dark, light, glassmorphic) */
  themeMode?: "dark" | "light" | "glassmorphic";
  /** Whether to tilt window at 3D isometric perspective */
  perspectiveTilt?: boolean;
  /** Container explicit width in px */
  width?: number;
  /** Container explicit height in px */
  height?: number;
  /** Optional badge text on top right */
  badgeText?: string;
  /** Badge accent color */
  badgeColor?: string;
  /** Enable choreographed mouse cursor */
  interactiveCursor?: boolean;
  /** Custom cursor configuration overrides */
  cursorConfig?: Partial<AnimatedCursorProps>;
  /** Render default SaaS interactive dashboard if no children provided */
  showDefaultDashboard?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * InteractiveBrowserMockup
 *
 * Broadcast-Grade 3D Perspective Browser Frame with macOS window controls,
 * glassmorphic address bar, and integrated interactive click choreography.
 */
export const InteractiveBrowserMockup: React.FC<InteractiveBrowserMockupProps> = ({
  title = "linear.app — Cycle 24 Overview",
  url = "https://linear.app/team/growth/cycles/24",
  themeMode = "dark",
  perspectiveTilt = true,
  width = 960,
  height = 1120,
  badgeText = "ACTIVE v2.4",
  badgeColor = "#10B981",
  interactiveCursor = true,
  cursorConfig = {},
  showDefaultDashboard = true,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = themeMode === "dark" || themeMode === "glassmorphic";

  const clickFrame = cursorConfig.clickAtFrame ?? 42;
  const isClicked = frame >= clickFrame;
  const localClickFrame = Math.max(0, frame - clickFrame);

  // Button state reaction upon click
  const buttonSpring = spring({
    frame: localClickFrame,
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.5 },
  });

  const buttonScale = isClicked ? interpolate(buttonSpring, [0, 1], [0.92, 1.0]) : 1.0;

  // 3D Perspective Tilt Matrix
  const tiltStyle: React.CSSProperties = perspectiveTilt
    ? {
        transform: "perspective(1400px) rotateX(8deg) rotateY(-9deg) rotateZ(1.8deg)",
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      }
    : {};

  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: isDark ? "#09090B" : "#FFFFFF",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: isDark
          ? "0 35px 100px rgba(0, 0, 0, 0.65), 0 10px 30px rgba(0, 0, 0, 0.35)"
          : "0 35px 90px rgba(0, 0, 0, 0.18), 0 10px 25px rgba(0, 0, 0, 0.08)",
        ...tiltStyle,
        ...style,
      }}
    >
      {/* ── MACOS TITLE BAR WITH TRAFFIC LIGHTS ── */}
      <div
        style={{
          height: "48px",
          backgroundColor: isDark ? "#121215" : "#F4F4F6",
          borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: "14px",
          position: "relative",
          zIndex: 40,
        }}
      >
        {/* Authentic Traffic Light Buttons */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF5F56", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FFBD2E", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27C93F", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }} />
        </div>

        {/* Centered Glassmorphic Address Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: "520px",
            margin: "0 auto",
            height: "30px",
            borderRadius: "8px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            fontSize: "12px",
            color: isDark ? "#A1A1AA" : "#71717A",
            fontFamily: "monospace",
          }}
        >
          {/* Padlock Icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
        </div>

        {/* Right Status Pill Badge */}
        {badgeText && (
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "6px",
              backgroundColor: `${badgeColor}22`,
              color: badgeColor,
              border: `1px solid ${badgeColor}44`,
              letterSpacing: "0.5px",
            }}
          >
            {badgeText}
          </div>
        )}
      </div>

      {/* ── BROWSER VIEWPORT BODY ── */}
      <div style={{ position: "relative", width: "100%", height: "calc(100% - 48px)", overflow: "hidden" }}>
        {children ? (
          children
        ) : showDefaultDashboard ? (
          /* Default Linear/Stripe Dashboard Simulation */
          <div
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Header Title & Subtitle */}
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#8B5CF6", letterSpacing: "1px", textTransform: "uppercase" }}>
                AUTOMATION SUITE
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: isDark ? "#FFFFFF" : "#09090B", margin: "4px 0 0 0", letterSpacing: "-0.5px" }}>
                Production Deployment
              </h2>
            </div>

            {/* Metric KPI Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div style={{ backgroundColor: isDark ? "#18181B" : "#F4F4F6", borderRadius: "12px", padding: "16px", border: isDark ? "1px solid #27272A" : "1px solid #E4E4E7" }}>
                <div style={{ fontSize: "12px", color: isDark ? "#71717A" : "#A1A1AA", fontWeight: 600 }}>BUILD STATUS</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#10B981", marginTop: "4px" }}>READY</div>
                <div style={{ fontSize: "11px", color: "#10B981", marginTop: "2px" }}>✓ 0 Errors</div>
              </div>

              <div style={{ backgroundColor: isDark ? "#18181B" : "#F4F4F6", borderRadius: "12px", padding: "16px", border: isDark ? "1px solid #27272A" : "1px solid #E4E4E7" }}>
                <div style={{ fontSize: "12px", color: isDark ? "#71717A" : "#A1A1AA", fontWeight: 600 }}>LATENCY</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: isDark ? "#FAFAFA" : "#09090B", marginTop: "4px" }}>12ms</div>
                <div style={{ fontSize: "11px", color: "#3B82F6", marginTop: "2px" }}>Global Edge</div>
              </div>

              <div style={{ backgroundColor: isDark ? "#18181B" : "#F4F4F6", borderRadius: "12px", padding: "16px", border: isDark ? "1px solid #27272A" : "1px solid #E4E4E7" }}>
                <div style={{ fontSize: "12px", color: isDark ? "#71717A" : "#A1A1AA", fontWeight: 600 }}>SCALE TARGET</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: isDark ? "#FAFAFA" : "#09090B", marginTop: "4px" }}>10,000 req/s</div>
                <div style={{ fontSize: "11px", color: "#8B5CF6", marginTop: "2px" }}>Auto-Scale</div>
              </div>
            </div>

            {/* Interactive Deployment Card with Click Target */}
            <div
              style={{
                backgroundColor: isDark ? "#121215" : "#FAFAFA",
                borderRadius: "16px",
                border: isDark ? "1px solid #27272A" : "1px solid #E4E4E7",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "18px",
                flex: 1,
                boxShadow: isClicked ? "0 0 30px rgba(16, 185, 129, 0.2)" : "none",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: isClicked ? "#10B981" : "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.3s ease" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                  {isClicked ? <path d="M20 6L9 17l-5-5" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
                </svg>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: isDark ? "#FFFFFF" : "#09090B" }}>
                  {isClicked ? "Deployed to Production" : "Ready to Deploy"}
                </div>
                <div style={{ fontSize: "13px", color: isDark ? "#A1A1AA" : "#71717A", marginTop: "4px" }}>
                  {isClicked ? "Commit 8f19da verified on 32 global edge nodes." : "Click below to trigger automatic instant global rollout."}
                </div>
              </div>

              {/* Click Target Button */}
              <div
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  backgroundColor: isClicked ? "#10B981" : "#3B82F6",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 700,
                  transform: `scale(${buttonScale})`,
                  boxShadow: isClicked
                    ? "0 0 24px rgba(16, 185, 129, 0.45)"
                    : "0 8px 20px rgba(59, 130, 246, 0.35)",
                  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isClicked ? "✓ Production Live" : "Deploy to Production"}
              </div>
            </div>
          </div>
        ) : null}

        {/* ── ANIMATED BÉZIER CURSOR LAYER ── */}
        {interactiveCursor && (
          <AnimatedCursor
            startPoint={cursorConfig.startPoint ?? { x: 720, y: 780 }}
            targetPoint={cursorConfig.targetPoint ?? { x: 480, y: 550 }}
            startFrame={cursorConfig.startFrame ?? 14}
            moveDurationFrames={cursorConfig.moveDurationFrames ?? 26}
            clickAtFrame={clickFrame}
            clickDurationFrames={cursorConfig.clickDurationFrames ?? 16}
            authorLabel={cursorConfig.authorLabel ?? "Deployer"}
            authorBadgeColor={cursorConfig.authorBadgeColor ?? "#3B82F6"}
            rippleColor={cursorConfig.rippleColor ?? (isClicked ? "#10B981" : "#3B82F6")}
          />
        )}
      </div>
    </div>
  );
};
