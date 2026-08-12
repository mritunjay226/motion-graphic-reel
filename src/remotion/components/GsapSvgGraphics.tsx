import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import gsap from "gsap";

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
  /** Visual type of GSAP SVG motion graphic */
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
 * GSAP-Powered High-Impact Vector Animation Engine for Vox Reels.
 *
 * Provides broadcast-grade 2.5D visual components with dynamic scale & motion:
 * - `grid_lines`: Technical blueprint grid lines with corner crosshairs
 * - `bar_chart`: High-impact 3D paper bar chart with bold gold dollar badges
 * - `pulse_nodes`: Glowing node web ecosystem orbit connectors
 * - `stamp_seal`: Large rubber stamp seal badge ("APPROVED" / "CONFIDENTIAL")
 * - `counter_ring`: High-contrast circular metric loader ring filling 0 -> 100%
 * - `trend_arrow`: Upward exponential vector trend curve with elastic lead dot
 * - `confetti_burst`: 2.5D paper confetti celebration explosion
 * - `financial_ticker_tape`: Stock ticker bar (AAPL +14.2% ↑ | NASD -2.1% ↓)
 * - `leaked_evidence_dossier`: Top-Secret corporate dossier report card
 * - `magnifier_spotlight_lens`: 3D glass magnifying lens with glowing focus ring
 * - `polaroid_snapshot_cutout`: Vintage Polaroid photo frame with corner tape
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
  const containerRef = useRef<HTMLDivElement>(null);

  const localFrame = Math.max(0, frame - enterAtFrame);

  // Synchronize GSAP animations to Remotion frame timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const totalDurationSec = 1.5;
      const progress = Math.min(1, localFrame / (totalDurationSec * fps));

      const tl = gsap.timeline({ paused: true });

      if (type === "grid_lines") {
        tl.fromTo(
          ".gsap-line",
          { strokeDashoffset: 600, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.8, duration: 1, stagger: 0.12, ease: "power2.out" }
        );
      } else if (type === "bar_chart") {
        tl.fromTo(
          ".gsap-bar",
          { scaleY: 0, transformOrigin: "bottom center" },
          { scaleY: 1, duration: 1, stagger: 0.18, ease: "back.out(1.8)" }
        ).fromTo(
          ".gsap-bar-text",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: "power2.out" },
          "-=0.5"
        );
      } else if (type === "pulse_nodes") {
        tl.fromTo(
          ".gsap-node",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, stagger: 0.12, ease: "elastic.out(1, 0.5)" }
        );
      } else if (type === "stamp_seal") {
        tl.fromTo(
          ".gsap-seal",
          { scale: 2.8, rotation: -28, opacity: 0 },
          { scale: 1, rotation: -6, opacity: 1, duration: 0.9, ease: "back.out(2.2)" }
        );
      } else if (type === "counter_ring") {
        tl.fromTo(
          ".gsap-ring-circle",
          { strokeDashoffset: 440 },
          { strokeDashoffset: 50, duration: 1.2, ease: "power3.inOut" }
        ).fromTo(
          ".gsap-ring-text",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" },
          "-=0.6"
        );
      } else if (type === "trend_arrow") {
        tl.fromTo(
          ".gsap-arrow-path",
          { strokeDashoffset: 600 },
          { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }
        ).fromTo(
          ".gsap-arrow-dot",
          { scale: 0, opacity: 0 },
          { scale: 1.8, opacity: 1, duration: 0.4, ease: "elastic.out(1.2, 0.4)" },
          "-=0.3"
        );
      } else if (type === "confetti_burst") {
        tl.fromTo(
          ".gsap-confetti-particle",
          { scale: 0, opacity: 1, x: 0, y: 0, rotation: 0 },
          {
            scale: (i) => 1.0 + (i % 3) * 0.5,
            opacity: 0,
            x: (i) => Math.cos((i * 45 * Math.PI) / 180) * 180,
            y: (i) => Math.sin((i * 45 * Math.PI) / 180) * 180,
            rotation: (i) => (i % 2 === 0 ? 360 : -360),
            duration: 1.3,
            stagger: 0.03,
            ease: "power2.out",
          }
        );
      } else if (type === "financial_ticker_tape") {
        tl.fromTo(
          ".gsap-ticker-box",
          { x: -300, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9, ease: "back.out(1.4)" }
        );
      } else if (type === "leaked_evidence_dossier") {
        tl.fromTo(
          ".gsap-dossier-card",
          { y: 150, scale: 0.85, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" }
        ).fromTo(
          ".gsap-dossier-stamp",
          { scale: 3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "bounce.out" },
          "-=0.3"
        );
      } else if (type === "magnifier_spotlight_lens") {
        tl.fromTo(
          ".gsap-lens-ring",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
        );
      } else if (type === "polaroid_snapshot_cutout") {
        tl.fromTo(
          ".gsap-polaroid-frame",
          { rotation: -15, y: 100, opacity: 0 },
          { rotation: 3, y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.6)" }
        );
      }

      tl.progress(progress);
    }, containerRef);

    return () => ctx.revert();
  }, [localFrame, fps, type]);

  if (localFrame < 0) return null;

  return (
    <div
      ref={containerRef}
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
          <line className="gsap-line" x1="20" y1="60" x2="480" y2="60" stroke="#DDDDDD" strokeWidth="2" strokeDasharray="600" strokeDashoffset="600" />
          <line className="gsap-line" x1="20" y1="250" x2="480" y2="250" stroke={color} strokeWidth="3" strokeDasharray="600" strokeDashoffset="600" />
          <line className="gsap-line" x1="20" y1="440" x2="480" y2="440" stroke="#DDDDDD" strokeWidth="2" strokeDasharray="600" strokeDashoffset="600" />
          
          {/* Corner Crosshairs */}
          <path className="gsap-line" d="M 20 40 L 20 80 M 0 60 L 40 60" stroke="#111111" strokeWidth="2" />
          <path className="gsap-line" d="M 480 40 L 480 80 M 460 60 L 500 60" stroke="#111111" strokeWidth="2" />

          <text x="30" y="48" fill="#666666" fontSize="13" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
            ● TECHNICAL BLUEPRINT // {label}
          </text>
        </svg>
      )}

      {/* 2. BOLD 3D FINANCIAL BAR CHART */}
      {type === "bar_chart" && (
        <svg width="100%" height="100%" viewBox="0 0 380 260" style={{ overflow: "visible" }}>
          <line x1="20" y1="230" x2="360" y2="230" stroke="#111111" strokeWidth="4" />
          
          {/* Bar 1: $50M */}
          <rect className="gsap-bar" x="40" y="130" width="75" height="100" fill="#E0E0E0" stroke="#111111" strokeWidth="4" rx="8" />
          <text className="gsap-bar-text" x="52" y="115" fill="#555555" fontSize="18" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal">$50M</text>

          {/* Bar 2: $10B */}
          <rect className="gsap-bar" x="150" y="70" width="75" height="160" fill={color} stroke="#111111" strokeWidth="4" rx="8" />
          <text className="gsap-bar-text" x="162" y="55" fill="#111111" fontSize="22" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal">$10B</text>

          {/* Bar 3: $45B Peak */}
          <rect className="gsap-bar" x="260" y="20" width="75" height="210" fill="#111111" stroke={color} strokeWidth="4" rx="8" />
          <text className="gsap-bar-text" x="270" y="5" fill={color} fontSize="26" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal">$45B</text>
        </svg>
      )}

      {/* 3. GLOWING ECOSYSTEM ORBIT NODES */}
      {type === "pulse_nodes" && (
        <svg width="100%" height="100%" viewBox="0 0 360 360" style={{ overflow: "visible" }}>
          <circle cx="180" cy="180" r="130" fill="none" stroke={color} strokeWidth="3" strokeDasharray="14 10" opacity="0.6" />
          <line x1="70" y1="180" x2="180" y2="70" stroke={color} strokeWidth="3" opacity="0.7" />
          <line x1="180" y1="70" x2="290" y2="180" stroke={color} strokeWidth="3" opacity="0.7" />
          <line x1="180" y1="70" x2="180" y2="290" stroke={color} strokeWidth="3" opacity="0.7" />
          
          <circle className="gsap-node" cx="70" cy="180" r="22" fill="#111111" stroke={color} strokeWidth="4" />
          <circle className="gsap-node" cx="180" cy="70" r="30" fill={color} stroke="#111111" strokeWidth="5" />
          <circle className="gsap-node" cx="290" cy="180" r="22" fill="#111111" stroke={color} strokeWidth="4" />
          <circle className="gsap-node" cx="180" cy="290" r="24" fill="#111111" stroke="#FFFFFF" strokeWidth="4" />
        </svg>
      )}

      {/* 4. HIGH-IMPACT RUBBER STAMP SEAL */}
      {type === "stamp_seal" && (
        <div
          className="gsap-seal"
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            padding: "12px 24px",
            border: `6px solid ${color}`,
            borderRadius: "12px",
            backgroundColor: "#111111",
            boxShadow: `0 14px 40px rgba(0,0,0,0.4), 0 0 20px ${color}66`,
            transform: "rotate(-6deg)",
            maxWidth: "340px",
            wordBreak: "break-word",
            textAlign: "center",
            boxSizing: "border-box",
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
          <circle className="gsap-ring-circle" cx="120" cy="120" r="85" fill="none" stroke={color} strokeWidth="18" strokeDasharray="534" strokeDashoffset="534" strokeLinecap="round" transform="rotate(-90 120 120)" />
          <text className="gsap-ring-text" x="120" y="130" textAnchor="middle" fill="#111111" fontSize="34" fontFamily="'Bebas Neue', sans-serif" fontWeight="normal">
            {label}
          </text>
        </svg>
      )}

      {/* 6. EXPONENTIAL VECTOR TREND CURVE */}
      {type === "trend_arrow" && (
        <svg width="100%" height="100%" viewBox="0 0 380 240" style={{ overflow: "visible" }}>
          <path className="gsap-arrow-path" d="M 20 200 Q 140 180, 220 100 T 360 30" fill="none" stroke={color} strokeWidth="7" strokeDasharray="600" strokeDashoffset="600" strokeLinecap="round" />
          <circle className="gsap-arrow-dot" cx="360" cy="30" r="12" fill="#111111" stroke={color} strokeWidth="4" />
        </svg>
      )}

      {/* 7. 2.5D PAPER CONFETTI EXPLOSION BURST */}
      {type === "confetti_burst" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="gsap-confetti-particle"
              style={{
                position: "absolute",
                width: "16px",
                height: "16px",
                backgroundColor: i % 2 === 0 ? color : "#D61C1C",
                borderRadius: i % 3 === 0 ? "50%" : "3px",
                boxShadow: `0 6px 16px ${color}88`,
              }}
            />
          ))}
        </div>
      )}

      {/* 8. NEW: FINANCIAL STOCK TICKER TAPE */}
      {type === "financial_ticker_tape" && (
        <div className="gsap-ticker-box" style={{ position: "absolute", top: "10%", left: "5%", right: "5%", background: "#111111", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", border: "2px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

      {/* 9. NEW: TOP-SECRET CLASSIFIED DOSSIER REPORT */}
      {type === "leaked_evidence_dossier" && (
        <div className="gsap-dossier-card" style={{ position: "absolute", top: "25%", left: "10%", width: "80%", background: "#F5F1EA", border: "3px solid #111111", borderRadius: "12px", padding: "24px", boxShadow: "0 16px 45px rgba(0,0,0,0.3)" }}>
          <div className="gsap-dossier-stamp" style={{ position: "absolute", top: "-18px", right: "20px", background: "#D61C1C", color: "#FFFFFF", padding: "6px 16px", fontWeight: 400, fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "2px", transform: "rotate(-3deg)", borderRadius: "4px", boxShadow: "0 6px 16px rgba(214,28,28,0.4)" }}>
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

      {/* 10. NEW: 3D MAGNIFIER GLASS SPOTLIGHT LENS */}
      {type === "magnifier_spotlight_lens" && (
        <div className="gsap-lens-ring" style={{ position: "absolute", top: "30%", left: "40%", width: "160px", height: "160px", borderRadius: "50%", border: "5px solid #FFE600", boxShadow: "0 0 35px rgba(255,230,0,0.6), inset 0 0 20px rgba(255,230,0,0.3)", backgroundColor: "rgba(255,230,0,0.15)", backdropFilter: "brightness(1.3)" }}>
          <div style={{ position: "absolute", top: "50%", left: "-10px", right: "-10px", height: "2px", backgroundColor: "#FFE600", opacity: 0.7 }} />
          <div style={{ position: "absolute", left: "50%", top: "-10px", bottom: "-10px", width: "2px", backgroundColor: "#FFE600", opacity: 0.7 }} />
        </div>
      )}

      {/* 11. NEW: VINTAGE POLAROID SNAPSHOT FRAME */}
      {type === "polaroid_snapshot_cutout" && (
        <div className="gsap-polaroid-frame" style={{ position: "absolute", top: "22%", left: "15%", width: "70%", background: "#FFFFFF", padding: "14px 14px 44px 14px", border: "2px solid #DDDDDD", borderRadius: "4px", boxShadow: "0 18px 45px rgba(0,0,0,0.25)", transform: "rotate(3deg)" }}>
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
