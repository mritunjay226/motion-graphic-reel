import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export interface DocumentaryEvidenceCardProps {
  /** Main evidence title or subject name */
  title: string;
  /** Subtitle or forensic date/location */
  subtitle?: string;
  /** Optional image URL or placeholder graphic */
  imageUrl?: string;
  /** Optional handwritten note or classification label */
  handwrittenNote?: string;
  /** Embossed DYMO label text (e.g. "EXHIBIT A", "DOCUMENT #402") */
  dymoLabel?: string;
  /** Pin style: "brass" or "crimson" or "none" */
  pinType?: "brass" | "crimson" | "none";
  /** Whether to show a corner scotch tape strip */
  showTape?: boolean;
  /** Whether to show a metallic paperclip */
  showPaperclip?: boolean;
  /** Card rotation angle in degrees (e.g. -4 to +4 deg) */
  rotationDeg?: number;
  /** Card width in pixels (default: 340) */
  width?: number;
  /** Card height in pixels (default: 420) */
  height?: number;
  /** Entrance frame offset */
  enterAtFrame?: number;
  /** Scale sizing factor */
  scale?: number;
  style?: React.CSSProperties;
}

/**
 * DOCUMENTARY EVIDENCE CARD (Tactile Documentary Props)
 *
 * Simulates a forensic evidence polaroid or case file card pinned to an investigative board.
 *
 * Features:
 * - 3D Brass or Crimson Push-Pin with specular highlights
 * - Translucent wrinkled scotch tape with adhesive glare
 * - Formed metallic steel paperclip
 * - Black embossed DYMO label maker tape
 * - Multi-tier archival paper drop shadow
 */
export const DocumentaryEvidenceCard: React.FC<DocumentaryEvidenceCardProps> = ({
  title,
  subtitle,
  imageUrl,
  handwrittenNote,
  dymoLabel = "EXHIBIT A",
  pinType = "brass",
  showTape = true,
  showPaperclip = false,
  rotationDeg = -3,
  width = 340,
  height = 420,
  enterAtFrame = 0,
  scale = 1.0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame: frame - enterAtFrame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale * entrance}) rotate(${rotationDeg}deg)`,
        transformOrigin: "center center",
        backgroundColor: "#FFFDF9",
        border: "1px solid #E5DECE",
        borderRadius: "4px",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(0, 0, 0, 0.16)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        ...style,
      }}
    >
      {/* ── 1. 3D BRASS OR CRIMSON PUSH-PIN (TOP CENTER) ── */}
      {pinType !== "none" && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "24px",
            height: "24px",
            zIndex: 40,
            pointerEvents: "none",
          }}
        >
          {/* Pin Shadow on Paper */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "4px",
              width: "28px",
              height: "14px",
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
              transform: "rotate(-20deg)",
              filter: "blur(2px)",
            }}
          />

          {/* Spherical Pin Head */}
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background:
                pinType === "brass"
                  ? "radial-gradient(circle at 35% 30%, #FEF08A 0%, #D97706 50%, #78350F 100%)"
                  : "radial-gradient(circle at 35% 30%, #FCA5A5 0%, #DC2626 50%, #7F1D1D 100%)",
              border: pinType === "brass" ? "1.5px solid #451A03" : "1.5px solid #450A0A",
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            }}
          >
            {/* Specular Highlight Dot */}
            <div
              style={{
                position: "absolute",
                top: "4px",
                left: "5px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.75)",
              }}
            />
          </div>
        </div>
      )}

      {/* ── 2. TRANSLUCENT WRINKLED SCOTCH TAPE (CORNER) ── */}
      {showTape && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            right: "-12px",
            width: "80px",
            height: "26px",
            backgroundColor: "rgba(254, 252, 232, 0.68)",
            border: "1px solid rgba(217, 119, 6, 0.2)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            transform: "rotate(24deg)",
            zIndex: 35,
            pointerEvents: "none",
            backdropFilter: "blur(1px)",
          }}
        />
      )}

      {/* ── 3. METALLIC STEEL PAPERCLIP (EDGE) ── */}
      {showPaperclip && (
        <div
          style={{
            position: "absolute",
            top: "-16px",
            left: "24px",
            width: "16px",
            height: "44px",
            borderRadius: "8px",
            border: "3px solid #94A3B8",
            boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
            zIndex: 35,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── 4. EMBOSSED DYMO LABEL MAKER TAPE ── */}
      {dymoLabel && (
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            backgroundColor: "#0F172A",
            border: "1px solid #334155",
            borderRadius: "2px",
            padding: "3px 10px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              color: "#F8FAFC",
              fontFamily: "'Space Grotesk', monospace",
              textTransform: "uppercase",
            }}
          >
            {dymoLabel}
          </span>
        </div>
      )}

      {/* ── 5. POLAROID / EVIDENCE PHOTO FRAME ── */}
      <div
        style={{
          width: "100%",
          height: "220px",
          marginTop: "32px",
          borderRadius: "2px",
          backgroundColor: "#1E293B",
          overflow: "hidden",
          border: "1px solid #CBD5E1",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          /* Forensic Blueprint / Grid Placeholder */
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at 50% 50%, #1E293B 0%, #0F172A 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "28px" }}>📁</span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#94A3B8",
                letterSpacing: "0.14em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ARCHIVAL DOSSIER
            </span>
          </div>
        )}
      </div>

      {/* ── 6. EVIDENCE TITLE & FORENSIC METADATA ── */}
      <div style={{ marginTop: "14px", display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "22px",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            color: "#0F172A",
            fontFamily: "'Bebas Neue', sans-serif",
            lineHeight: 1.1,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#64748B",
              fontFamily: "'Space Grotesk', sans-serif",
              marginTop: "2px",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* ── 7. HANDWRITTEN ANNOTATION OR BARCODE SLIP ── */}
      {handwrittenNote && (
        <div
          style={{
            marginTop: "auto",
            padding: "4px 8px",
            backgroundColor: "#FEF9C3",
            borderLeft: "3px solid #CA8A04",
            borderRadius: "2px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "#854D0E",
              fontFamily: "'Space Grotesk', cursive, sans-serif",
              fontStyle: "italic",
            }}
          >
            "{handwrittenNote}"
          </span>
        </div>
      )}
    </div>
  );
};
