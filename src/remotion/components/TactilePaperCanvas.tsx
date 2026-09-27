import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export type BackgroundPaperTextureType =
  | "paper_fiber"
  | "vintage_newsprint"
  | "tactical_topo_grid"
  | "tactical_topo"
  | "cyanotype_blueprint"
  | "blueprint_grid"
  | "crumpled_paper"
  | "crumbled_paper"
  | "vintage_grid"
  | "dark_charcoal"
  | "clean_studio"
  | "none"
  | string;

export interface TactilePaperCanvasProps {
  /** Base background color or gradient (default: smooth luxury studio cream) */
  baseColor?: string;
  /** Background texture preset */
  textureType?: BackgroundPaperTextureType;
  /** Custom texture image URL override */
  customTextureUrl?: string;
  /** Micro paper tooth / texture opacity (0.0 - 1.0, default: 0.18) */
  paperTextureOpacity?: number;
  /** Soft studio vignette intensity (0.0 - 1.0, default 0.08) */
  vignetteStrength?: number;
  /** Grid opacity (default 0 for clean modern studio) */
  gridOpacity?: number;
  /** Grid cell size in px */
  gridSize?: number;
  /** Include fine millimeter sub-grid */
  showSubGrid?: boolean;
  /** Include 3D crumpled fold creases (default false for clean canvas) */
  showCreases?: boolean;
  /** Creases layer opacity */
  creasesOpacity?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function resolveTextureFileUrl(textureType: string, customUrl?: string): string | null {
  if (customUrl) {
    return customUrl.startsWith("/") ? staticFile(customUrl.replace(/^\//, "")) : customUrl;
  }
  const norm = textureType.toLowerCase().trim();
  switch (norm) {
    case "paper_fiber":
      return staticFile("textures/paper_fiber.jpg");
    case "vintage_newsprint":
    case "newsprint_crease":
      return staticFile("textures/vintage_newsprint.jpg");
    case "tactical_topo_grid":
    case "tactical_topo":
      return staticFile("textures/tactical_topo_grid.jpg");
    case "cyanotype_blueprint":
    case "blueprint_grid":
      return staticFile("textures/cyanotype_blueprint.jpg");
    case "crumpled_paper":
    case "crumbled_paper":
      return staticFile("textures/crumpled_paper.jpg");
    case "clean_studio":
    case "none":
    case "dark_charcoal":
      return null;
    default:
      if (norm.startsWith("/") || norm.startsWith("http")) {
        return norm.startsWith("/") ? staticFile(norm.replace(/^\//, "")) : norm;
      }
      return staticFile("textures/paper_fiber.jpg");
  }
}

/**
 * TactilePaperCanvas — Dynamic Studio & Custom Background Texture Engine.
 *
 * Supports 1-click runtime switching between:
 * 1. Clean Studio (Zero texture, pure luxury radial gradient)
 * 2. Paper Fiber (Subtle studio paper grain)
 * 3. Vintage Newsprint (Archival newspaper print with fiber specks)
 * 4. Tactical Topo Grid (Contour elevation lines with military grid overlay)
 * 5. Cyanotype Blueprint (Architectural blueprint weave)
 * 6. Crumpled Paper (3D textured paper creases and folded wrinkles)
 */
export const TactilePaperCanvas: React.FC<TactilePaperCanvasProps> = ({
  baseColor = "radial-gradient(circle at 50% 32%, #FFFFFF 0%, #FAF8F4 50%, #F3EEE4 100%)",
  textureType = "paper_fiber",
  customTextureUrl,
  paperTextureOpacity = 0.18,
  vignetteStrength = 0.08,
  gridOpacity = 0,
  gridSize = 36,
  showSubGrid = false,
  showCreases = false,
  creasesOpacity = 0.06,
  style,
  children,
}) => {
  const isDark =
    textureType === "dark_charcoal" ||
    (baseColor &&
      (baseColor.includes("#0") ||
        baseColor.includes("#1") ||
        baseColor.includes("rgb(0") ||
        baseColor.includes("rgb(1") ||
        baseColor.includes("rgb(2")));

  const effectiveBaseBg =
    baseColor ||
    (isDark
      ? "radial-gradient(circle at 50% 35%, #181A22 0%, #0E1015 100%)"
      : "radial-gradient(circle at 50% 32%, #FFFFFF 0%, #FAF8F4 50%, #F3EEE4 100%)");

  const textureSrc = resolveTextureFileUrl(textureType, customTextureUrl);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: effectiveBaseBg,
        ...style,
      }}
    >
      {/* ── 1. ACTIVE TEXTURE LAYER (DYNAMICALLY APPLIED FROM /textures/) ── */}
      {textureSrc && paperTextureOpacity > 0 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            mixBlendMode: isDark ? "overlay" : "multiply",
            opacity: paperTextureOpacity,
          }}
        >
          <Img
            src={textureSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: isDark ? "contrast(1.1) brightness(0.9)" : "contrast(0.98) brightness(1.02)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* ── 2. OPTIONAL SOFT CREASES (ONLY WHEN EXPLICITLY ENABLED) ── */}
      {showCreases && creasesOpacity > 0 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            mixBlendMode: isDark ? "overlay" : "multiply",
            opacity: creasesOpacity,
          }}
        >
          <Img
            src={staticFile("textures/crumpled_paper.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* ── 3. OPTIONAL MINIMAL GRAPH GRID (ONLY IF GRID OPACITY > 0) ── */}
      {gridOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: isDark ? "screen" : "multiply",
            opacity: gridOpacity,
            pointerEvents: "none",
            backgroundImage: `
              linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.08)" : "rgba(30, 35, 45, 0.05)"} 1px, transparent 1px),
              linear-gradient(to bottom, ${isDark ? "rgba(255,255,255,0.08)" : "rgba(30, 35, 45, 0.05)"} 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}

      {/* ── 4. SOFT STUDIO SPOTLIGHT ILLUMINATION ── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: isDark
            ? `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 65%, rgba(0,0,0,${vignetteStrength * 2}) 100%)`
            : `radial-gradient(ellipse at 50% 28%, rgba(255, 255, 255, 0.6) 0%, transparent 60%, rgba(40, 30, 20, ${vignetteStrength * 0.8}) 100%)`,
        }}
      />

      {/* Render children inside canvas */}
      {children}
    </AbsoluteFill>
  );
};
