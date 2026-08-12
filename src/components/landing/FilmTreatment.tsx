"use client";

import React from "react";

interface FilmTreatmentProps {
  grainOpacity?: number;
  scanlines?: boolean;
  vignette?: boolean;
  className?: string;
}

export default function FilmTreatment({
  grainOpacity = 0.12,
  scanlines = true,
  vignette = true,
  className = "",
}: FilmTreatmentProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-20 overflow-hidden ${className}`}>
      {/* SVG Grain Noise Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay">
        <filter id="film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
      </svg>

      {/* CRT Scanline Overlay */}
      {scanlines && (
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.4))",
            backgroundSize: "100% 4px",
          }}
        />
      )}

      {/* Radial Editorial Vignette */}
      {vignette && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 50%, rgba(12, 12, 14, 0.35) 100%)",
          }}
        />
      )}
    </div>
  );
}
