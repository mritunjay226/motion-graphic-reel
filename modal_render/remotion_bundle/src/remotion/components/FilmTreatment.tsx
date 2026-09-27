import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, random, staticFile } from "remotion";
import type { FilmTreatmentConfig } from "../types";
import type { VideoTheme } from "../utils/themes";

interface FilmTreatmentProps {
  config: FilmTreatmentConfig;
  theme?: VideoTheme;
}

/**
 * The "Texture Sandwich" — Comprehensive Cinematic & Tactile Texture Overlay Engine.
 * 
 * Uses pre-baked 4K photographic texture overlays (35mm film grain + paper fiber)
 * with GPU-accelerated blend modes and frame-based animated grain boil.
 *
 * Multi-layered texture stack:
 * 1. Blueprint Paper Grid / Graph Lines (Vox Infographic Grid)
 * 2. Studio Paper & Vintage Fold Creases (Pre-baked Paper Fiber)
 * 3. Halftone Stipple Mesh (Retro Newsprint Screen)
 * 4. Animated 35mm Film Grain & Silver Halide Noise (Photographic Bitmap)
 * 5. Animated Dust & Scratches (Film Flecks & Hair Particles)
 * 6. CRT Scanlines (Digital Mesh)
 * 7. Cinematic Radial Vignette & Corner Blur
 */
export const FilmTreatment: React.FC<FilmTreatmentProps> = ({
  config,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Determine active parameters from theme preset (with config overrides)
  const grainOpacity = theme?.grainOpacity ?? config.grainOpacity;
  const hasScanlines = theme?.scanlines ?? config.scanlines;
  const scanlineOpacity = theme ? 0.16 : config.scanlineOpacity;
  const vignetteAmount = theme?.vignette ?? config.vignette;

  // Tactile texture flags & opacities
  const paperGrid = theme?.paperGrid ?? config.paperGrid ?? false;
  const paperGridOpacity = theme?.paperGridOpacity ?? config.paperGridOpacity ?? 0.12;
  const paperGridSize = theme?.paperGridSize ?? config.paperGridSize ?? 32;

  const paperTexture = theme?.paperTexture ?? config.paperTexture ?? false;
  const paperTextureType = theme?.paperTextureType ?? config.paperTextureType ?? "studio_paper";
  const paperTextureOpacity = theme?.paperTextureOpacity ?? config.paperTextureOpacity ?? 0.1;

  const dustAndScratches = theme?.dustAndScratches ?? config.dustAndScratches ?? false;
  const dustOpacity = theme?.dustOpacity ?? config.dustOpacity ?? 0.12;

  const halftoneDots = theme?.halftoneDots ?? config.halftoneDots ?? false;
  const halftoneOpacity = theme?.halftoneOpacity ?? config.halftoneOpacity ?? 0.06;

  // Frame seeds for animated noise & jumping film flecks (changes every N frames)
  const grainFps = config.grainFps || 12;
  const grainSeed = config.grainAnimated
    ? Math.floor(frame / (fps / grainFps))
    : 0;

  // Fast procedural dust particle seed (jumps every 2 frames for film reel flicker)
  const dustSeed = Math.floor(frame / 2);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 0 }}>
      {/* ── 1. OPTIONAL MINIMAL STUDIO PAPER TOOTH ── */}
      {paperTexture && paperTextureOpacity > 0 && (
        <PaperFiberOverlay
          type={paperTextureType}
          opacity={paperTextureOpacity * 0.5}
        />
      )}

      {/* ── 4. REAL 35MM CINEMATIC FILM GRAIN (Photographic Bitmap with Stop-Motion Boil) ── */}
      {grainOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: (config.grainBlendMode as React.CSSProperties["mixBlendMode"]) || "overlay",
            opacity: grainOpacity * 1.2,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-20%",
              transform: `translate(${(grainSeed * 127) % 256}px, ${(grainSeed * 179) % 256}px)`,
              willChange: "transform",
            }}
          >
            <Img
              src={staticFile("textures/film_grain.jpg")}
              style={{ width: "140%", height: "140%", objectFit: "cover" }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── 5. REAL 16MM ARCHIVAL FILM SCRATCHES & DUST OVERLAY ── */}
      {dustAndScratches && dustOpacity > 0 && (
        <DustAndScratchesOverlay
          opacity={dustOpacity}
          seed={dustSeed}
        />
      )}

      {/* ── 6. 1980S RETRO CRT PHOSPHOR TERMINAL & SCANLINES ── */}
      {hasScanlines && scanlineOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: scanlineOpacity,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Green/Amber phosphor raster lines */}
          <AbsoluteFill
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                rgba(0, 255, 120, 0.12) 0px,
                rgba(0, 255, 120, 0.12) 1.5px,
                transparent 1.5px,
                transparent 4px
              )`,
              backgroundSize: "100% 4px",
            }}
          />
          {/* Subtle curved glass tube reflection & barrel vignette */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0, 30, 10, 0.6) 100%)`,
              boxShadow: "inset 0 0 100px 20px rgba(0, 255, 120, 0.15)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* ── 7. CINEMATIC VIGNETTE (SOFT WARM LIGHT RIM, NON-DARK) ── */}
      {vignetteAmount > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: (config.vignetteBlendMode as React.CSSProperties["mixBlendMode"]) || "multiply",
            background: `radial-gradient(
              ellipse at center,
              transparent 55%,
              rgba(35, 28, 20, ${vignetteAmount * 0.25}) 80%,
              rgba(20, 15, 10, ${vignetteAmount * 0.45}) 100%
            )`,
          }}
        />
      )}

      {/* ── 8. CORNER BLUR ── */}
      {config.cornerBlur && (
        <AbsoluteFill
          style={{
            boxShadow: `inset 0 0 ${config.cornerBlurSpread || 180}px ${config.cornerBlurRadius || 12}px rgba(0, 0, 0, 0.15)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Paper Fiber & Crease Texture component using high-res texture bitmaps.
 */
const PaperFiberOverlay: React.FC<{
  type: string;
  opacity: number;
}> = ({ type, opacity }) => {
  if (type === "vintage_fold" || type === "crumpled") {
    return (
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: opacity * 0.7 }}>
        <Img
          src={staticFile("textures/crumpled_paper.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: opacity * 0.7 }}>
      <Img
        src={staticFile("textures/paper_fiber.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

/**
 * Real Archival Film Scratches & Emulsion Dust Overlay
 */
const DustAndScratchesOverlay: React.FC<{
  opacity: number;
  seed: number;
}> = ({ opacity, seed }) => {
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: opacity * 0.7,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          transform: `translate(${(seed * 137) % 64}px, ${(seed * 193) % 64}px)`,
          willChange: "transform",
        }}
      >
        <Img
          src={staticFile("textures/archival_film_scratches.jpg")}
          style={{ width: "120%", height: "120%", objectFit: "cover" }}
        />
      </div>
    </AbsoluteFill>
  );
};
