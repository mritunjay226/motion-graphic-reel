import React from "react";
import { useCurrentFrame } from "remotion";
import { getFontFamily, FONTS } from "../../utils/fonts";

export type MarqueeVariant = "filled" | "outlined" | "duo" | "hazard";

export interface KineticMarqueeRibbonProps {
  /** Array of words or phrases to repeat across the ribbon */
  items?: string[];
  /** Translation speed (pixels/percent per frame, default ~2.5) */
  speed?: number;
  /** Direction of movement */
  direction?: "left" | "right";
  /** Tilt angle in degrees (-15 to +15, e.g. -7 for Vox diagonal tape) */
  rotationDeg?: number;
  /** Visual styling mode */
  variant?: MarqueeVariant;
  /** Primary text or accent color */
  color?: string;
  /** Font size in pixels (default 42) */
  fontSize?: number;
  /** Glyph or symbol placed between items */
  separator?: string;
  /** Background bar color (optional, e.g. "rgba(0,0,0,0.06)" or "#FFE600") */
  backgroundColor?: string;
  /** Overall opacity of the ribbon (default 0.85, or 0.12 for subtle background wallpaper) */
  opacity?: number;
  /** Vertical center position (default "50%") */
  top?: string | number;
  /** Custom zIndex */
  zIndex?: number;
  /** Font family override */
  fontFamily?: string;
  /** Letter spacing */
  letterSpacing?: string;
}

const DEFAULT_ITEMS = [
  "CONFIDENTIAL",
  "INVESTIGATION",
  "CLASSIFIED",
  "EVIDENCE FILE",
  "UNRELEASED",
  "DOSSIER #849",
];

export const KineticMarqueeRibbon: React.FC<KineticMarqueeRibbonProps> = ({
  items = DEFAULT_ITEMS,
  speed = 2.4,
  direction = "left",
  rotationDeg = 0,
  variant = "filled",
  color = "#0F172A",
  fontSize = 38,
  separator = "✦",
  backgroundColor,
  opacity = 0.9,
  top = "50%",
  zIndex = 10,
  fontFamily,
  letterSpacing = "0.18em",
}) => {
  const frame = useCurrentFrame();

  const activeFont = fontFamily || getFontFamily(FONTS.bebasNeue);

  // Seamless Wrap Math:
  // We duplicate the items sequence twice. When translating by 50% of the total width,
  // the second half replaces the first half with zero visual difference.
  const offsetPercent = (frame * speed * 0.04) % 50;
  const translateX = direction === "left" ? -offsetPercent : -50 + offsetPercent;

  // Repeat sequence 4 times within each half to guarantee continuous coverage across 2800px width
  const repeatedItems = [...items, ...items, ...items, ...items];

  const isHazard = variant === "hazard";
  const barBg = isHazard
    ? "#FFE600"
    : backgroundColor || "transparent";
  const textColor = isHazard ? "#0F172A" : color;

  const renderItem = (text: string, idx: number) => {
    let itemStyle: React.CSSProperties = {
      fontFamily: activeFont,
      fontSize: `${fontSize}px`,
      fontWeight: 900,
      letterSpacing,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      lineHeight: 1.0,
      display: "inline-flex",
      alignItems: "center",
      gap: "18px",
      flexShrink: 0,
    };

    if (variant === "outlined") {
      itemStyle = {
        ...itemStyle,
        color: "transparent",
        WebkitTextStroke: `1.5px ${textColor}`,
      };
    } else if (variant === "duo") {
      if (idx % 2 === 1) {
        itemStyle = {
          ...itemStyle,
          color: "transparent",
          WebkitTextStroke: `1.5px ${textColor}`,
        };
      } else {
        itemStyle = {
          ...itemStyle,
          color: textColor,
        };
      }
    } else {
      itemStyle = {
        ...itemStyle,
        color: textColor,
      };
    }

    return (
      <span key={idx} style={itemStyle}>
        <span>{text}</span>
        <span
          style={{
            fontSize: `${Math.round(fontSize * 0.45)}px`,
            opacity: 0.6,
            display: "inline-block",
            transform: "translateY(-1px)",
            flexShrink: 0,
          }}
        >
          {separator}
        </span>
      </span>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        width: "3200px",
        marginLeft: "-1600px",
        transform: `rotate(${rotationDeg}deg)`,
        transformOrigin: "center center",
        overflow: "hidden",
        backgroundColor: barBg,
        padding: isHazard ? "10px 0" : "6px 0",
        borderTop: isHazard ? "3px solid #0F172A" : undefined,
        borderBottom: isHazard ? "3px solid #0F172A" : undefined,
        boxShadow: isHazard
          ? "0 8px 24px rgba(0,0,0,0.18)"
          : backgroundColor
          ? "0 4px 16px rgba(0,0,0,0.08)"
          : undefined,
        opacity,
        zIndex,
        pointerEvents: "none",
      }}
    >
      {/* 2-Part Container translating seamlessly */}
      <div
        style={{
          display: "flex",
          width: "max-content",
          transform: `translateX(${translateX}%)`,
          willChange: "transform",
        }}
      >
        {/* First Half */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            alignItems: "center",
            gap: "24px",
            paddingRight: "24px",
            boxSizing: "border-box",
          }}
        >
          {repeatedItems.map((item, idx) => renderItem(item, idx))}
        </div>

        {/* Second Half (Exact Duplicate) */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            alignItems: "center",
            gap: "24px",
            paddingRight: "24px",
            boxSizing: "border-box",
          }}
        >
          {repeatedItems.map((item, idx) => renderItem(item, idx + repeatedItems.length))}
        </div>
      </div>
    </div>
  );
};
