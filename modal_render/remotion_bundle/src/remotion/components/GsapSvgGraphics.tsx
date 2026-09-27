import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";

export type GsapAnimationType =
  | "grid_lines"
  | "bar_chart"
  | "pulse_nodes"
  | "stamp_seal"
  | "counter_ring"
  | "trend_arrow"
  | "confetti_burst"
  | "financial_ticker_tape"
  | "leaked_evidence_dossier"
  | "magnifier_spotlight_lens"
  | "polaroid_snapshot_cutout";

interface GsapSvgGraphicsProps {
  /** Visual type of SVG motion graphic */
  type: GsapAnimationType;
  /** Primary accent color */
  color?: string;
  /** Frame offset to trigger entrance */
  enterAtFrame?: number;
  /** Optional badge text / label */
  label?: string;
  /** Secondary subtitle / value */
  subtitle?: string;
  /** Image URL for snapshot frame */
  imageUrl?: string;
  /** Additional container inline styles */
  style?: React.CSSProperties;
}

/**
 * Pure Mathematical Vector Motion Graphics Engine for Vox Reels.
 * Built with zero DOM queries and pure Remotion springs/interpolations for maximum 60+ FPS rendering speed.
 */
export const GsapSvgGraphics: React.FC<GsapSvgGraphicsProps> = ({
  type,
  color = "#FFE600",
  enterAtFrame = 4,
  label = "100%",
  subtitle,
  imageUrl,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterAtFrame);
  if (localFrame < 0) return null;

  // 1. Grid lines math
  const lineDashoffset = interpolate(localFrame, [0, fps * 0.6], [600, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const lineOpacity = interpolate(localFrame, [0, fps * 0.3], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Bar chart math
  const bar1Scale = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 120 } });
  const bar2Scale = spring({ frame: Math.max(0, localFrame - 3), fps, config: { damping: 16, stiffness: 120 } });
  const bar3Scale = spring({ frame: Math.max(0, localFrame - 6), fps, config: { damping: 16, stiffness: 120 } });
  const barTextOpacity = interpolate(localFrame, [6, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3. Pulse nodes math
  const node1 = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 140 } });
  const node2 = spring({ frame: Math.max(0, localFrame - 3), fps, config: { damping: 16, stiffness: 140 } });
  const node3 = spring({ frame: Math.max(0, localFrame - 6), fps, config: { damping: 16, stiffness: 140 } });
  const node4 = spring({ frame: Math.max(0, localFrame - 9), fps, config: { damping: 16, stiffness: 140 } });

  // 4. Stamp seal math
  const sealSpring = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 140 } });
  const sealScale = interpolate(sealSpring, [0, 1], [1.6, 1]);
  const sealRot = interpolate(sealSpring, [0, 1], [-12, -4]);
  const sealOpacity = interpolate(sealSpring, [0, 0.2, 1], [0, 1, 1]);

  // 5. Counter ring math
  const ringDash = interpolate(localFrame, [0, fps * 0.8], [534, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ringTextScale = spring({ frame: Math.max(0, localFrame - 4), fps, config: { damping: 16, stiffness: 130 } });

  // 6. Trend arrow math
  const arrowDash = interpolate(localFrame, [0, fps * 0.8], [600, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dotScale = spring({ frame: Math.max(0, localFrame - 6), fps, config: { damping: 15, stiffness: 150 } });

  // 8. Ticker tape math
  const tickerSpring = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 120 } });
  const tickerX = interpolate(tickerSpring, [0, 1], [-200, 0]);
  const tickerOpacity = interpolate(tickerSpring, [0, 0.3, 1], [0, 1, 1]);

  // 9. Dossier card math
  const dossierSpring = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 110 } });
  const dossierY = interpolate(dossierSpring, [0, 1], [100, 0]);
  const dossierStampSpring = spring({ frame: Math.max(0, localFrame - 6), fps, config: { damping: 16, stiffness: 150 } });

  // 10. Magnifier lens math
  const lensSpring = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 130 } });

  // 11. Polaroid cutout math
  const polaroidSpring = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 110 } });
  const polaroidY = interpolate(polaroidSpring, [0, 1], [80, 0]);
  const polaroidRot = interpolate(polaroidSpring, [0, 1], [-8, 2]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 15,
        ...style,
      }}
    >
      {/* 1. GRID LINES WITH CORNER CROSSHAIRS */}
      {type === "grid_lines" && (
        <svg width="100%" height="100%" viewBox="0 0 500 500" style={{ overflow: "visible" }}>
          <line x1="20" y1="60" x2="480" y2="60" stroke="#DDDDDD" strokeWidth="2" strokeDasharray="600" strokeDashoffset={lineDashoffset} opacity={lineOpacity} />
          <line x1="20" y1="250" x2="480" y2="250" stroke={color} strokeWidth="3" strokeDasharray="600" strokeDashoffset={lineDashoffset} opacity={lineOpacity} />
          <line x1="20" y1="440" x2="480" y2="440" stroke="#DDDDDD" strokeWidth="2" strokeDasharray="600" strokeDashoffset={lineDashoffset} opacity={lineOpacity} />
          
          {/* Corner Crosshairs */}
          <path d="M 20 40 L 20 80 M 0 60 L 40 60" stroke="#111111" strokeWidth="2" opacity={lineOpacity} />
          <path d="M 480 40 L 480 80 M 460 60 L 500 60" stroke="#111111" strokeWidth="2" opacity={lineOpacity} />

          <text x="30" y="48" fill="#666666" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2" opacity={lineOpacity}>
            ● TECHNICAL BLUEPRINT // {label}
          </text>
        </svg>
      )}

      {/* 2. BOLD 3D FINANCIAL BAR CHART */}
      {type === "bar_chart" && (
        <svg width="100%" height="100%" viewBox="0 0 380 260" style={{ overflow: "visible" }}>
          <line x1="20" y1="230" x2="360" y2="230" stroke="#111111" strokeWidth="4" />
          
          {/* Bar 1: $50M */}
          <g transform={`scale(1, ${bar1Scale})`} style={{ transformOrigin: "bottom center" }}>
            <rect x="40" y="130" width="75" height="100" fill="#E0E0E0" stroke="#111111" strokeWidth="4" rx="8" />
          </g>
          <text x="52" y="115" fill="#555555" fontSize="18" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal" opacity={barTextOpacity}>$50M</text>

          {/* Bar 2: $10B */}
          <g transform={`scale(1, ${bar2Scale})`} style={{ transformOrigin: "bottom center" }}>
            <rect x="150" y="70" width="75" height="160" fill={color} stroke="#111111" strokeWidth="4" rx="8" />
          </g>
          <text x="162" y="55" fill="#111111" fontSize="22" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal" opacity={barTextOpacity}>$10B</text>

          {/* Bar 3: $45B Peak */}
          <g transform={`scale(1, ${bar3Scale})`} style={{ transformOrigin: "bottom center" }}>
            <rect x="260" y="20" width="75" height="210" fill="#111111" stroke={color} strokeWidth="4" rx="8" />
          </g>
          <text x="270" y="5" fill={color} fontSize="26" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal" opacity={barTextOpacity}>$45B</text>
        </svg>
      )}

      {/* 3. GLOWING ECOSYSTEM ORBIT NODES */}
      {type === "pulse_nodes" && (
        <svg width="100%" height="100%" viewBox="0 0 360 360" style={{ overflow: "visible" }}>
          <circle cx="180" cy="180" r="130" fill="none" stroke={color} strokeWidth="3" strokeDasharray="14 10" opacity="0.6" />
          <line x1="70" y1="180" x2="180" y2="70" stroke={color} strokeWidth="3" opacity="0.7" />
          <line x1="180" y1="70" x2="290" y2="180" stroke={color} strokeWidth="3" opacity="0.7" />
          <line x1="180" y1="70" x2="180" y2="290" stroke={color} strokeWidth="3" opacity="0.7" />
          
          <circle cx="70" cy="180" r={22 * node1} fill="#111111" stroke={color} strokeWidth="4" opacity={node1} />
          <circle cx="180" cy="70" r={30 * node2} fill={color} stroke="#111111" strokeWidth="5" opacity={node2} />
          <circle cx="290" cy="180" r={22 * node3} fill="#111111" stroke={color} strokeWidth="4" opacity={node3} />
          <circle cx="180" cy="290" r={24 * node4} fill="#111111" stroke="#FFFFFF" strokeWidth="4" opacity={node4} />
        </svg>
      )}

      {/* 4. HIGH-IMPACT RUBBER STAMP SEAL */}
      {type === "stamp_seal" && (
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            padding: "12px 24px",
            border: `6px solid ${color}`,
            borderRadius: "12px",
            backgroundColor: "#111111",
            boxShadow: `0 14px 40px rgba(0,0,0,0.4), 0 0 20px ${color}66`,
            transform: `scale(${sealScale}) rotate(${sealRot}deg)`,
            opacity: sealOpacity,
            maxWidth: "340px",
            wordBreak: "break-word",
            textAlign: "center",
            boxSizing: "border-box",
            willChange: "transform, opacity",
          }}
        >
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "34px", fontWeight: 400, color, letterSpacing: "3px", textTransform: "uppercase", display: "block", lineHeight: 1.0 }}>
            {label}
          </span>
          {subtitle && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "4px", display: "block" }}>
              {subtitle}
            </span>
          )}
        </div>
      )}

      {/* 5. METRIC LOADER COUNTER RING */}
      {type === "counter_ring" && (
        <svg width="100%" height="100%" viewBox="0 0 240 240" style={{ overflow: "visible" }}>
          <circle cx="120" cy="120" r="85" fill="none" stroke="#E0E0E0" strokeWidth="16" />
          <circle cx="120" cy="120" r="85" fill="none" stroke={color} strokeWidth="18" strokeDasharray="534" strokeDashoffset={ringDash} strokeLinecap="round" transform="rotate(-90 120 120)" />
          <text x="120" y="130" textAnchor="middle" fill="#111111" fontSize="34" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal" transform={`scale(${ringTextScale})`} style={{ transformOrigin: "120px 130px" }}>
            {label}
          </text>
        </svg>
      )}

      {/* 6. EXPONENTIAL VECTOR TREND CURVE */}
      {type === "trend_arrow" && (
        <svg width="100%" height="100%" viewBox="0 0 380 240" style={{ overflow: "visible" }}>
          <path d="M 20 200 Q 140 180, 220 100 T 360 30" fill="none" stroke={color} strokeWidth="7" strokeDasharray="600" strokeDashoffset={arrowDash} strokeLinecap="round" />
          <circle cx="360" cy="30" r={12 * dotScale} fill="#111111" stroke={color} strokeWidth="4" />
        </svg>
      )}

      {/* 7. 2.5D PAPER CONFETTI EXPLOSION BURST */}
      {type === "confetti_burst" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          {[...Array(12)].map((_, i) => {
            const pScale = interpolate(localFrame, [0, 8, 24], [0, 1.2 + (i % 3) * 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pDist = interpolate(localFrame, [0, 24], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
            const pAngle = (i * 45 * Math.PI) / 180;
            const pX = Math.cos(pAngle) * pDist;
            const pY = Math.sin(pAngle) * pDist;
            const pRot = interpolate(localFrame, [0, 24], [0, i % 2 === 0 ? 360 : -360]);

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "16px",
                  height: "16px",
                  backgroundColor: i % 2 === 0 ? color : "#D61C1C",
                  borderRadius: i % 3 === 0 ? "50%" : "3px",
                  boxShadow: `0 6px 16px ${color}88`,
                  transform: `translate(${pX}px, ${pY}px) scale(${pScale}) rotate(${pRot}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 8. FINANCIAL STOCK TICKER TAPE */}
      {type === "financial_ticker_tape" && (
        <div style={{ position: "absolute", top: "10%", left: "5%", right: "5%", background: "#111111", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", border: "2px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", transform: `translateX(${tickerX}px)`, opacity: tickerOpacity }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00E676", boxShadow: "0 0 10px #00E676" }} />
            <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", color: "#FFE600", letterSpacing: "1px" }}>
              AAPL +14.2% ↑
            </span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>
            NASD: $242.80 | VOL: 42M
          </span>
        </div>
      )}

      {/* 9. TOP-SECRET CLASSIFIED DOSSIER REPORT */}
      {type === "leaked_evidence_dossier" && (
        <div style={{ position: "absolute", top: "25%", left: "10%", width: "80%", background: "#F5F1EA", border: "3px solid #111111", borderRadius: "12px", padding: "24px", boxShadow: "0 16px 45px rgba(0,0,0,0.3)", transform: `translateY(${dossierY}px)` }}>
          <div style={{ position: "absolute", top: "-18px", right: "20px", background: "#D61C1C", color: "#FFFFFF", padding: "6px 16px", fontWeight: 400, fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "2px", transform: `scale(${interpolate(dossierStampSpring, [0, 1], [3, 1])}) rotate(-3deg)`, borderRadius: "4px", boxShadow: "0 6px 16px rgba(214,28,28,0.4)" }}>
            CLASSIFIED DOSSIER
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#888", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
            ● MEMO REF-99 // {label}
          </span>
          <p style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "18px", fontWeight: 800, color: "#111111", lineHeight: 1.3, margin: 0 }}>
            {subtitle || "INTERNAL PROJECTION: Loss estimated at $1.8 Billion. Urgent restructuring required."}
          </p>
        </div>
      )}

      {/* 10. 3D MAGNIFIER GLASS SPOTLIGHT LENS */}
      {type === "magnifier_spotlight_lens" && (
        <div style={{ position: "absolute", top: "30%", left: "40%", width: "160px", height: "160px", borderRadius: "50%", border: "5px solid #FFE600", boxShadow: "0 0 35px rgba(255,230,0,0.6), inset 0 0 20px rgba(255,230,0,0.3)", backgroundColor: "rgba(255,230,0,0.15)", transform: `scale(${lensSpring})` }}>
          <div style={{ position: "absolute", top: "50%", left: "-10px", right: "-10px", height: "2px", backgroundColor: "#FFE600", opacity: 0.7 }} />
          <div style={{ position: "absolute", left: "50%", top: "-10px", bottom: "-10px", width: "2px", backgroundColor: "#FFE600", opacity: 0.7 }} />
        </div>
      )}

      {/* 11. VINTAGE POLAROID SNAPSHOT FRAME */}
      {type === "polaroid_snapshot_cutout" && (
        <div style={{ position: "absolute", top: "22%", left: "15%", width: "70%", background: "#FFFFFF", padding: "14px 14px 44px 14px", border: "2px solid #DDDDDD", borderRadius: "4px", boxShadow: "0 18px 45px rgba(0,0,0,0.25)", transform: `translateY(${polaroidY}px) rotate(${polaroidRot}deg)` }}>
          <div style={{ position: "absolute", top: "-12px", left: "40%", width: "60px", height: "24px", backgroundColor: "rgba(255,230,0,0.65)", transform: "rotate(-4deg)" }} />
          {imageUrl ? (
            <img src={imageUrl} alt="Polaroid" style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "2px" }} />
          ) : (
            <div style={{ width: "100%", height: "220px", background: "#222222", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFE600", fontFamily: "monospace", fontWeight: "bold" }}>● HISTORICAL ARCHIVE</span>
            </div>
          )}
          <span style={{ position: "absolute", bottom: "12px", left: "20px", fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "#333333" }}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
};
