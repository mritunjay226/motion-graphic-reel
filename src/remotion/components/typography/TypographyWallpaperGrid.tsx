import React from "react";
import { useCurrentFrame } from "remotion";
import { getFontFamily, FONTS } from "../../utils/fonts";

export interface TypographyWallpaperGridProps {
  /** Rows of words or phrases to repeat across the grid */
  rows?: string[][];
  /** Global opacity of the wallpaper (0.03 to 0.12, default 0.06) */
  opacity?: number;
  /** Primary text color */
  color?: string;
  /** Font size in pixels (default 48) */
  fontSize?: number;
  /** Font family override */
  fontFamily?: string;
  /** Vertical gap between rows in pixels (default 24) */
  rowGap?: number;
  /** CSS mix blend mode (default "multiply") */
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
}

const DEFAULT_ROWS: string[][] = [
  ["EXHIBIT A", "CLASSIFIED", "DOSSIER #402", "CONFIDENTIAL", "TRANSCRIPT"],
  ["FINANCIAL AUDIT", "INTERNAL MEMO", "EVIDENCE REEL", "SUBPOENA RECORD"],
  ["SWISS ESCROW", "HOLDING CORP", "OFFSHORE ROUTE", "SHELL ENTITY"],
  ["CRIMINAL STATUTE", "REGULATORY BREACH", "SANCTION VIOLATION", "FRAUD"],
  ["EXHIBIT B", "SMOKING GUN", "WHISTLEBLOWER", "INTERCEPT", "RECORDING"],
  ["UNSEALED INDICTMENT", "FORENSIC ACCOUNTING", "PAPER TRAIL", "VERDICT"],
];

export const TypographyWallpaperGrid: React.FC<TypographyWallpaperGridProps> = ({
  rows = DEFAULT_ROWS,
  opacity = 0.06,
  color = "#0F172A",
  fontSize = 46,
  fontFamily,
  rowGap = 28,
  mixBlendMode = "multiply",
}) => {
  const frame = useCurrentFrame();
  const activeFont = fontFamily || getFontFamily(FONTS.bebasNeue);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "1080px",
        height: "1920px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "80px 0",
        boxSizing: "border-box",
        opacity,
        mixBlendMode,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {rows.map((rowWords, rowIndex) => {
        const isOdd = rowIndex % 2 === 1;
        const speed = 1.2 + (rowIndex % 3) * 0.4;
        const direction = isOdd ? "right" : "left";

        const offsetPercent = (frame * speed * 0.03) % 50;
        const translateX = direction === "left" ? -offsetPercent : -50 + offsetPercent;

        // Repeat words to ensure full row coverage
        const repeated = [...rowWords, ...rowWords];

        return (
          <div
            key={rowIndex}
            style={{
              position: "relative",
              width: "3200px",
              left: "50%",
              marginLeft: "-1600px",
              overflow: "hidden",
              margin: `${rowGap / 2}px 0`,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "max-content",
                transform: `translateX(${translateX}%)`,
                willChange: "transform",
              }}
            >
              {/* Half 1 */}
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  alignItems: "center",
                  gap: "28px",
                  paddingRight: "28px",
                  boxSizing: "border-box",
                }}
              >
                {repeated.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    style={{
                      fontFamily: activeFont,
                      fontSize: `${fontSize}px`,
                      fontWeight: 900,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color,
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "20px",
                      flexShrink: 0,
                    }}
                  >
                    <span>{word}</span>
                    <span style={{ fontSize: `${fontSize * 0.35}px`, opacity: 0.5, flexShrink: 0 }}>
                      ✦
                    </span>
                  </span>
                ))}
              </div>

              {/* Half 2 (Exact Duplicate) */}
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  alignItems: "center",
                  gap: "28px",
                  paddingRight: "28px",
                  boxSizing: "border-box",
                }}
              >
                {repeated.map((word, wordIndex) => (
                  <span
                    key={wordIndex + repeated.length}
                    style={{
                      fontFamily: activeFont,
                      fontSize: `${fontSize}px`,
                      fontWeight: 900,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color,
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "20px",
                      flexShrink: 0,
                    }}
                  >
                    <span>{word}</span>
                    <span style={{ fontSize: `${fontSize * 0.35}px`, opacity: 0.5, flexShrink: 0 }}>
                      ✦
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
