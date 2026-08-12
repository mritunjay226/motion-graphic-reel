import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import type { FilmTreatmentConfig } from "../types";
import type { VideoTheme } from "../utils/themes";

interface FilmTreatmentProps {
  config: FilmTreatmentConfig;
  theme?: VideoTheme;
}

/**
 * The "Texture Sandwich" — Comprehensive Cinematic & Tactile Texture Overlay Engine.
 * 
 * Multi-layered texture stack:
 * 1. Procedural Animated SVG Film Grain (35mm / 16mm ISO noise)
 * 2. Blueprint Paper Grid / Graph Lines (Vox Infographic Grid)
 * 3. Studio Paper & Vintage Fold Creases (Paper Fiber Texture)
 * 4. Halftone Stipple Mesh (Retro Newsprint Screen)
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
  const filterIdSuffix = useId().replace(/:/g, "_");

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
  const grainFps = config.grainFps || 10;
  const grainSeed = config.grainAnimated
    ? Math.floor(frame / (fps / grainFps))
    : 0;

  // Fast procedural dust particle seed (jumps every 2 frames for film reel flicker)
  const dustSeed = Math.floor(frame / 2);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      {/* ── 1. BLUEPRINT PAPER GRID / GRAPH PAPER OVERLAY ── */}
      {paperGrid && paperGridOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: "multiply",
            opacity: paperGridOpacity,
            backgroundImage: `
              linear-gradient(to right, rgba(20, 20, 25, 0.22) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20, 20, 25, 0.22) 1px, transparent 1px),
              radial-gradient(circle at center, rgba(0,0,0,0.3) 1.5px, transparent 1.5px)
            `,
            backgroundSize: `${paperGridSize}px ${paperGridSize}px, ${paperGridSize}px ${paperGridSize}px, ${paperGridSize}px ${paperGridSize}px`,
          }}
        />
      )}

      {/* ── 2. STUDIO PAPER FIBERS & VINTAGE CREASE TEXTURE ── */}
      {paperTexture && paperTextureOpacity > 0 && (
        <PaperFiberOverlay
          type={paperTextureType}
          opacity={paperTextureOpacity}
          seed={grainSeed}
          filterId={`paper_fiber_${filterIdSuffix}`}
        />
      )}

      {/* ── 3. HALFTONE STIPPLE DOT MESH (RETRO NEWSPRINT) ── */}
      {halftoneDots && halftoneOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: "overlay",
            opacity: halftoneOpacity,
            backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.8) 1px, transparent 0)",
            backgroundSize: "6px 6px",
            backgroundPosition: "0 0, 3px 3px",
          }}
        />
      )}

      {/* ── 4. PROCEDURAL ANIMATED SVG FILM GRAIN ── */}
      {grainOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: (config.grainBlendMode as React.CSSProperties["mixBlendMode"]) || "overlay",
            opacity: grainOpacity,
          }}
        >
          <svg width="100%" height="100%" style={{ display: "block" }}>
            <filter id={`film_grain_svg_${filterIdSuffix}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="3"
                seed={grainSeed + 100}
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"
              />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#film_grain_svg_${filterIdSuffix})`}
            />
          </svg>
        </AbsoluteFill>
      )}

      {/* ── 5. ANIMATED DUST & SCRATCHES FILM FLECKS ── */}
      {dustAndScratches && dustOpacity > 0 && (
        <DustAndScratchesOverlay
          opacity={dustOpacity}
          seed={dustSeed}
          width={width}
          height={height}
        />
      )}

      {/* ── 6. CRT SCANLINES LAYER ── */}
      {hasScanlines && scanlineOpacity > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: (config.scanlineBlendMode as React.CSSProperties["mixBlendMode"]) || "multiply",
            opacity: scanlineOpacity,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${config.scanlineWidth || 1.6}px,
              rgba(0, 0, 0, 0.9) ${config.scanlineWidth || 1.6}px,
              rgba(0, 0, 0, 0.9) ${(config.scanlineWidth || 1.6) * 2}px
            )`,
            backgroundSize: `100% ${(config.scanlineWidth || 1.6) * 2}px`,
          }}
        />
      )}

      {/* ── 7. CINEMATIC VIGNETTE ── */}
      {vignetteAmount > 0 && (
        <AbsoluteFill
          style={{
            mixBlendMode: (config.vignetteBlendMode as React.CSSProperties["mixBlendMode"]) || "multiply",
            background: `radial-gradient(
              ellipse at center,
              transparent 45%,
              rgba(0, 0, 0, ${vignetteAmount * 0.7}) 75%,
              rgba(0, 0, 0, ${vignetteAmount}) 100%
            )`,
          }}
        />
      )}

      {/* ── 8. CORNER BLUR ── */}
      {config.cornerBlur && (
        <AbsoluteFill
          style={{
            boxShadow: `inset 0 0 ${config.cornerBlurSpread || 180}px ${config.cornerBlurRadius || 12}px rgba(0, 0, 0, 0.35)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Paper Fiber & Crease Texture component using SVG turbulence and gradient maps.
 */
const PaperFiberOverlay: React.FC<{
  type: string;
  opacity: number;
  seed: number;
  filterId: string;
}> = ({ type, opacity, seed, filterId }) => {
  if (type === "vintage_fold") {
    return (
      <AbsoluteFill
        style={{
          mixBlendMode: "multiply",
          opacity: opacity,
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.12) 0%, transparent 8%, transparent 42%, rgba(0,0,0,0.08) 50%, transparent 58%, transparent 92%, rgba(0,0,0,0.12) 100%),
            linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.15) 50%, transparent 52%)
          `,
        }}
      />
    );
  }

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: type === "grunge_canvas" ? "multiply" : "overlay",
        opacity: opacity,
      }}
    >
      <svg width="100%" height="100%" style={{ display: "block" }}>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={type === "grunge_canvas" ? "0.03" : "0.05"}
            numOctaves="4"
            seed={seed}
            result="paper_noise"
          />
          <feDiffuseLighting
            in="paper_noise"
            lightingColor="#ffffff"
            surfaceScale="1.8"
            result="light"
          >
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feBlend mode="multiply" in="SourceGraphic" in2="light" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} fill="#F5F5F0" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Animated Film Dust & Vertical Hair Scratches Overlay
 * Generates jumping dust motes and vertical scratches per frame seed.
 */
const DustAndScratchesOverlay: React.FC<{
  opacity: number;
  seed: number;
  width: number;
  height: number;
}> = ({ opacity, seed, width, height }) => {
  const dustParticles: Array<{ x: number; y: number; r: number; opacity: number }> = [];
  const scratches: Array<{ x: number; height: number; opacity: number }> = [];

  // Generate 8 jumping dust specks per seed
  for (let i = 0; i < 8; i++) {
    dustParticles.push({
      x: random(`dust-x-${seed}-${i}`) * width,
      y: random(`dust-y-${seed}-${i}`) * height,
      r: 1 + random(`dust-r-${seed}-${i}`) * 2.5,
      opacity: 0.3 + random(`dust-o-${seed}-${i}`) * 0.7,
    });
  }

  // Generate 1-2 occasional vertical scratch lines
  const scratchCount = Math.floor(random(`scratch-cnt-${seed}`) * 2.2);
  for (let i = 0; i < scratchCount; i++) {
    scratches.push({
      x: random(`scratch-x-${seed}-${i}`) * width,
      height: 80 + random(`scratch-h-${seed}-${i}`) * 300,
      opacity: 0.2 + random(`scratch-o-${seed}-${i}`) * 0.5,
    });
  }

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: opacity,
      }}
    >
      <svg width="100%" height="100%" style={{ display: "block" }}>
        {/* Dust Specks */}
        {dustParticles.map((pt, idx) => (
          <circle
            key={`dust-${idx}`}
            cx={pt.x}
            cy={pt.y}
            r={pt.r}
            fill="#FFFFFF"
            opacity={pt.opacity}
          />
        ))}

        {/* Vertical Scratch Lines */}
        {scratches.map((sc, idx) => (
          <line
            key={`scratch-${idx}`}
            x1={sc.x}
            y1={100}
            x2={sc.x + (random(`sc-dx-${seed}-${idx}`) * 4 - 2)}
            y2={100 + sc.height}
            stroke="#FFFFFF"
            strokeWidth={1}
            opacity={sc.opacity}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

