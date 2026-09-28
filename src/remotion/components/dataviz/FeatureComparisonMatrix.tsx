import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface ComparisonRow {
  feature: string;
  legacyValue: string;
  legacyPass: boolean;
  winnerValue: string;
  winnerPass: boolean;
}

export interface FeatureComparisonMatrixProps {
  title?: string;
  subtitle?: string;
  legacyName?: string;
  winnerName?: string;
  rows?: ComparisonRow[];
  startFrame?: number;
  verdictBanner?: string;
  aesthetic?: "documentary" | "tech";
  scale?: number;
}

const DEFAULT_ROWS: ComparisonRow[] = [
  { feature: "Late Fees Penalty", legacyValue: "$40 / Month Penalty", legacyPass: false, winnerValue: "$0 Forever", winnerPass: true },
  { feature: "Access Model", legacyValue: "Store Visit Required", legacyPass: false, winnerValue: "Instant Streaming", winnerPass: true },
  { feature: "Monthly Pricing", legacyValue: "$4.99 Per Rental", legacyPass: false, winnerValue: "$7.99 Unlimited", winnerPass: true },
  { feature: "Physical Overhead", legacyValue: "9,000 Retail Stores", legacyPass: false, winnerValue: "0 Stores (Pure Cloud)", winnerPass: true },
];

/**
 * FEATURE COMPARISON MATRIX (Advanced Data Visualization)
 *
 * Side-by-side rivalry audit matrix with staggered row reveals,
 * spring-stamped emerald checkmarks (✓) with impact scale recoil,
 * red strike-throughs (✕), and a final stamped verdict banner.
 */
export const FeatureComparisonMatrix: React.FC<FeatureComparisonMatrixProps> = ({
  title = "DISRUPTION AUDIT SHOWDOWN",
  subtitle = "THE STRUCTURAL SHIFT THAT KILLED AN EMPIRE",
  legacyName = "BLOCKBUSTER (LEGACY)",
  winnerName = "NETFLIX (DISRUPTOR)",
  rows = DEFAULT_ROWS,
  startFrame = 6,
  verdictBanner = "VERDICT: 10X OPERATIONAL EFFICIENCY",
  aesthetic = "documentary",
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDoc = aesthetic === "documentary";

  // Palette tokens
  const cardBg = isDoc ? "#FAF5E8" : "#0F172A";
  const cardBorder = isDoc ? "2px solid #D6CEBE" : "1px solid rgba(255,255,255,0.12)";
  const labelColor = isDoc ? "#5C5042" : "#94A3B8";

  // Master card entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Verdict banner spring at end of row stagger
  const verdictFrame = startFrame + rows.length * 8 + 6;
  const verdictSpring = spring({
    frame: frame - verdictFrame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "relative",
        width: "920px",
        height: "640px",
        transform: `scale(${scale * entrance})`,
        transformOrigin: "center center",
        backgroundColor: cardBg,
        border: cardBorder,
        borderRadius: isDoc ? "6px" : "16px",
        boxShadow: isDoc
          ? "0 16px 36px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)"
          : "0 24px 48px rgba(0,0,0,0.65), 0 0 30px rgba(16, 185, 129, 0.15)",
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* ── CARD HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.14em",
                color: "#DC2626",
                backgroundColor: isDoc ? "#FEF2F2" : "rgba(220, 38, 38, 0.15)",
                padding: "3px 8px",
                borderRadius: isDoc ? "3px" : "9999px",
                border: "1px solid #DC2626",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              SIDE-BY-SIDE FORENSIC AUDIT
            </span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: labelColor }}>
              {subtitle}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: isDoc ? "#1E293B" : "#F8FAFC",
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* ── TABLE COLUMN HEADERS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 1fr",
          gap: "12px",
          padding: "8px 12px",
          backgroundColor: isDoc ? "#F3ECE0" : "rgba(255,255,255,0.04)",
          borderRadius: "6px",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 800, color: labelColor, letterSpacing: "0.08em" }}>
          COMPARISON CRITERIA
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, color: "#DC2626", letterSpacing: "0.08em" }}>
          {legacyName}
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, color: "#10B981", letterSpacing: "0.08em" }}>
          {winnerName}
        </span>
      </div>

      {/* ── STAGGERED COMPARISON ROWS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {rows.map((row, idx) => {
          const rowDelay = startFrame + idx * 8;
          const rowProgress = spring({
            frame: frame - rowDelay,
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          const isVisible = frame >= rowDelay;
          if (!isVisible) return null;

          // Winner stamp recoil on impact
          const stampAge = frame - (rowDelay + 4);
          const stampRecoil = stampAge > 0 ? spring({ frame: stampAge, fps, config: { damping: 10, stiffness: 180 } }) : 0;
          const stampScale = interpolate(stampRecoil, [0, 1], [1.35, 1.0]);

          return (
            <div
              key={`cmp-row-${idx}`}
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr 1fr",
                gap: "12px",
                alignItems: "center",
                padding: "10px 12px",
                backgroundColor: isDoc ? "#FFFDF9" : "rgba(255,255,255,0.02)",
                border: isDoc ? "1px solid #E5DECE" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "6px",
                opacity: rowProgress,
                transform: `translateX(${(1 - rowProgress) * -20}px)`,
              }}
            >
              {/* Feature Name */}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: isDoc ? "#1E293B" : "#F8FAFC",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {row.feature}
              </span>

              {/* Legacy Loser Cell */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: row.legacyPass ? "rgba(16, 185, 129, 0.1)" : "rgba(220, 38, 38, 0.08)",
                  border: row.legacyPass ? "1px solid #10B981" : "1px dashed #DC2626",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 900, color: row.legacyPass ? "#10B981" : "#DC2626" }}>
                  {row.legacyPass ? "✓" : "✕"}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: row.legacyPass ? "#047857" : "#991B1B",
                    textDecoration: row.legacyPass ? "none" : "line-through",
                  }}
                >
                  {row.legacyValue}
                </span>
              </div>

              {/* Disruptor Winner Cell */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "2px solid #10B981",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
                  transform: `scale(${stampScale})`,
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: 900, color: "#10B981" }}>✓</span>
                <span style={{ fontSize: "13px", fontWeight: 900, color: "#065F46" }}>
                  {row.winnerValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FINAL VERDICT STAMP BANNER ── */}
      {frame >= verdictFrame && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: isDoc ? "#FEF3C7" : "rgba(245, 158, 11, 0.15)",
            border: "2px solid #F59E0B",
            boxShadow: "0 6px 14px rgba(245, 158, 11, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${verdictSpring})`,
            transformOrigin: "center center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              color: "#92400E",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {verdictBanner}
          </span>
        </div>
      )}
    </div>
  );
};
