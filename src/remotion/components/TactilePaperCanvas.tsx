import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export interface TactilePaperCanvasProps {
  /** Base background color (default: warm vintage off-white) */
  baseColor?: string;
  /** Texture preset */
  textureType?:
    | "vintage_grid"
    | "crumbled_paper"
    | "aged_parchment"
    | "blueprint_grid"
    | "newsprint_crease"
    | "dark_charcoal"
    | "tactical_topo";
  /** Vignette intensity (0.0 - 1.0, default 0.5) */
  vignetteStrength?: number;
  /** Grid opacity (default 0.22) */
  gridOpacity?: number;
  /** Grid cell size in px (default 36) */
  gridSize?: number;
  /** Include fine millimeter sub-grid */
  showSubGrid?: boolean;
  /** Include crumpled fold creases */
  showCreases?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * TactilePaperCanvas — Ultra-Realistic 2.5D Textured Paper Background Engine.
 *
 * Uses pre-baked 4K tactile texture bitmaps (paper fiber, crumpled folds,
 * vintage newsprint, tactical topo grid, cyanotype blueprint, dark charcoal)
 * rendered with hardware-accelerated GPU blend modes via Remotion <Img />.
 */
export const TactilePaperCanvas: React.FC<TactilePaperCanvasProps> = ({
  baseColor = "#FAF8F2",
  textureType = "vintage_grid",
  vignetteStrength = 0.15,
  gridOpacity = 0.08,
  gridSize = 36,
  showSubGrid = true,
  showCreases = true,
  style,
  children,
}) => {
  const isDark = textureType === "dark_charcoal";
  const effectiveBaseColor = isDark ? "#121316" : (textureType === "blueprint_grid" ? "#F5FAFD" : baseColor);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: effectiveBaseColor,
        ...style,
      }}
    >
      {/* ── 1. PRIMARY BASE TEXTURE ACCORDING TO PRESET ── */}
      {textureType === "dark_charcoal" && (
        <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.2 }}>
          <Img
            src={staticFile("textures/paper_fiber.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {textureType === "blueprint_grid" && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.40 }}>
          <Img
            src={staticFile("textures/cyanotype_blueprint.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {textureType === "tactical_topo" && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.35 }}>
          <Img
            src={staticFile("textures/tactical_topo_grid.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {textureType === "newsprint_crease" && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.30 }}>
          <Img
            src={staticFile("textures/vintage_newsprint.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {(textureType === "vintage_grid" || textureType === "crumbled_paper" || textureType === "aged_parchment") && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.20 }}>
          <Img
            src={staticFile("textures/paper_fiber.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* ── 2. 3D CRUMPLED PAPER FOLDS & CREASES (LIGHT & SUBTLE) ── */}
      {showCreases && textureType !== "blueprint_grid" && textureType !== "dark_charcoal" && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.12 }}>
          <Img
            src={staticFile("textures/crumpled_paper.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* ── 3. TECHNICAL BLUEPRINT GRAPH PAPER GRID + DOT MATRIX (LIGHT SLATE LINES) ── */}
      {gridOpacity > 0 && textureType !== "blueprint_grid" && textureType !== "tactical_topo" && (
        <AbsoluteFill
          style={{
            mixBlendMode: isDark ? "screen" : "multiply",
            opacity: isDark ? gridOpacity * 0.4 : gridOpacity,
            pointerEvents: "none",
            backgroundImage: showSubGrid
              ? `
                linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.25)" : "rgba(30, 35, 45, 0.12)"} 1px, transparent 1px),
                linear-gradient(to bottom, ${isDark ? "rgba(255,255,255,0.25)" : "rgba(30, 35, 45, 0.12)"} 1px, transparent 1px),
                linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.10)" : "rgba(30, 35, 45, 0.05)"} 0.5px, transparent 0.5px),
                linear-gradient(to bottom, ${isDark ? "rgba(255,255,255,0.10)" : "rgba(30, 35, 45, 0.05)"} 0.5px, transparent 0.5px),
                radial-gradient(${isDark ? "rgba(255,255,255,0.6)" : "rgba(25, 28, 38, 0.25)"} 1px, transparent 1px)
              `
              : `
                linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.2)" : "rgba(30, 35, 45, 0.10)"} 1px, transparent 1px),
                linear-gradient(to bottom, ${isDark ? "rgba(255,255,255,0.2)" : "rgba(30, 35, 45, 0.10)"} 1px, transparent 1px),
                radial-gradient(${isDark ? "rgba(255,255,255,0.6)" : "rgba(25, 28, 38, 0.25)"} 1px, transparent 1px)
              `,
            backgroundSize: showSubGrid
              ? `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${gridSize / 4}px ${gridSize / 4}px, ${gridSize / 4}px ${gridSize / 4}px, ${gridSize}px ${gridSize}px`
              : `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
            backgroundPosition: showSubGrid
              ? `0 0, 0 0, 0 0, 0 0, ${gridSize / 2}px ${gridSize / 2}px`
              : `0 0, 0 0, ${gridSize / 2}px ${gridSize / 2}px`,
          }}
        />
      )}

      {/* ── 4. LIGHT STUDIO SPOTLIGHT & SOFT WARM VIGNETTE (NON-DARK) ── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: isDark
            ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)`
            : `
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 255, 255, 0.55) 0%,
              rgba(250, 248, 242, 0) 60%,
              rgba(60, 50, 35, ${vignetteStrength * 0.2}) 88%,
              rgba(30, 24, 15, ${vignetteStrength * 0.4}) 100%
            )
          `,
        }}
      />

      {/* Render children inside canvas */}
      {children}
    </AbsoluteFill>
  );
};
