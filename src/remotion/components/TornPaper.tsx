import React, { useId } from "react";

export interface TornPaperProps {
  /** Filter ID suffix or custom name */
  filterId?: string;
  /** Random noise seed */
  seed?: number;
  /** Coarseness of torn edge displacement (default 0.04) */
  tornFrequency?: number;
  /** Displacement scale / roughness for torn edge (default 14) */
  tornScale?: number;
  /** Grunge paper texture frequency (default 0.03) */
  grungeFrequency?: number;
  /** Grunge texture scale (default 3) */
  grungeScale?: number;
  /** Optional torn paper white border width in px (default 0) */
  borderWidth?: number;
  /** Border color (default #FFFFFF) */
  borderColor?: string;
  /** Enable realistic paper drop shadow */
  shadow?: boolean;
  /** Organic paper rotation angle in degrees */
  rotationDeg?: number;
  /** Container style overrides */
  style?: React.CSSProperties;
  /** Children element(s) wrapped in torn paper effect */
  children: React.ReactNode;
}

/**
 * TornPaper Component based on happy358/TornPaper SVG filter algorithm.
 *
 * Uses SVG `<feTurbulence>` + `<feDisplacementMap>` + `<feBlend>` to generate
 * procedural torn edges, deckled paper borders, and grunge paper textures dynamically.
 */
export const TornPaper: React.FC<TornPaperProps> = ({
  filterId,
  seed = 42,
  tornFrequency = 0.04,
  tornScale = 14,
  grungeFrequency = 0.03,
  borderWidth = 0,
  borderColor = "#FFFFFF",
  shadow = true,
  rotationDeg = 0,
  style = {},
  children,
}) => {
  const generatedId = useId().replace(/:/g, "_");
  const id = filterId || `torn_paper_${generatedId}`;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: rotationDeg ? `rotate(${rotationDeg}deg)` : "none",
        filter: shadow
          ? "drop-shadow(0 14px 35px rgba(0, 0, 0, 0.25)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))"
          : "none",
        ...style,
      }}
    >
      {/* SVG Filter Definitions */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={id}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            filterUnits="objectBoundingBox"
          >
            {/* Edge displacement turbulence for torn paper deckle */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={tornFrequency}
              numOctaves="4"
              seed={seed}
              result="torn_noise"
            />

            {/* Edge displacement map */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="torn_noise"
              scale={tornScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced_graphic"
            />

            {/* Optional grunge paper grain overlay */}
            {grungeFrequency > 0 ? (
              <>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={grungeFrequency}
                  numOctaves="3"
                  seed={seed + 1}
                  result="grunge_noise"
                />
                <feColorMatrix
                  type="matrix"
                  values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.15 0"
                  in="grunge_noise"
                  result="grunge_texture"
                />
                <feBlend
                  mode="multiply"
                  in="displaced_graphic"
                  in2="grunge_texture"
                  result="final_torn_paper"
                />
              </>
            ) : (
              <feMerge>
                <feMergeNode in="displaced_graphic" />
              </feMerge>
            )}
          </filter>
        </defs>
      </svg>

      {/* Outer Paper Border Container (if borderWidth > 0) */}
      {borderWidth > 0 ? (
        <div
          style={{
            padding: `${borderWidth}px`,
            backgroundColor: borderColor,
            filter: `url(#${id})`,
            display: "inline-block",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {children}
          </div>
        </div>
      ) : (
        <div
          style={{
            filter: `url(#${id})`,
            display: "inline-block",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
