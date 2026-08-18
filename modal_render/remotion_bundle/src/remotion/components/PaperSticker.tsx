import React, { useState } from "react";
import { buildImageKitUrl, ImageKitTransformOptions } from "../utils/imagekit";
import { TornPaper } from "./TornPaper";
import { resolveAssetUrl } from "../utils/resolveAsset";

interface PaperStickerProps {
  /** Image URL or path */
  src: string;
  /** Alt text */
  alt?: string;
  /** Width in px or string percentage */
  width?: string | number;
  /** Height in px or string percentage */
  height?: string | number;
  /** Object fit mode */
  objectFit?: "cover" | "contain" | "fill";
  /** Paper sticker rotation angle in degrees (e.g. -3, 2, 4) */
  rotationDeg?: number;
  /** Border thickness in px (default 6px) */
  borderWidth?: number;
  /** Corner radius in px (default 16px) */
  borderRadius?: number;
  /** CSS filter overrides */
  filter?: string;
  /** Additional container styles */
  style?: React.CSSProperties;
  /** ImageKit URL transformation & AI background removal options */
  transformOptions?: ImageKitTransformOptions;
  /** Enable procedural torn paper deckle edge filter (happy358/TornPaper) */
  tornEdge?: boolean;
  /** If true, applies torn paper border directly around the subject contour without a rectangular box */
  isSingleSubject?: boolean;
}

/**
 * Authentic Vox Paper Cutout Sticker & Contour Border Subject Component.
 *
 * Renders subject cutouts with a procedural torn paper border directly following the subject contour
 * (via happy358/TornPaper filter) with ZERO rectangular background boxes.
 */
export const PaperSticker: React.FC<PaperStickerProps> = ({
  src,
  alt = "",
  width = "100%",
  height = "100%",
  objectFit = "contain",
  rotationDeg = -2,
  borderWidth = 6,
  borderRadius = 16,
  filter,
  style = {},
  transformOptions = { removeBg: false },
  tornEdge = false,
  isSingleSubject = false,
}) => {
  const [useRawFallback, setUseRawFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Construct ImageKit URL (enable AI background removal by default for single subjects)
  const ikSrc = buildImageKitUrl(src, {
    removeBg: isSingleSubject,
    ...transformOptions,
  });

  // Use raw URL directly if fallback is needed, and resolve /cache/ paths
  const rawTarget = useRawFallback ? src : (src.startsWith("/cache/") ? src : ikSrc);
  const finalSrc = resolveAssetUrl(rawTarget);

  // Render isolated transparent single subject cutout or bordered paper sticker
  const renderImageContent = () => (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: isSingleSubject || tornEdge ? "0px" : `${borderRadius}px`,
        border: isSingleSubject || tornEdge ? "none" : `${borderWidth}px solid #FFFFFF`,
        boxShadow: isSingleSubject || tornEdge
          ? "none"
          : "0 14px 40px rgba(0, 0, 0, 0.22), 0 3px 10px rgba(0, 0, 0, 0.12)",
        backgroundColor: "transparent",
        overflow: isSingleSubject ? "visible" : "hidden",
        transform: tornEdge ? "none" : `rotate(${rotationDeg}deg)`,
        transition: "transform 0.3s ease-out",
        ...style,
      }}
    >
      {!isLoaded && !isSingleSubject && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              "linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 50%, #F5F5F5 100%)",
            zIndex: 1,
          }}
        />
      )}
      <img
        src={finalSrc}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!useRawFallback) {
            setUseRawFallback(true);
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          display: "block",
          // Use outline + boxShadow instead of drop-shadow filter chain for performance
          outline: isSingleSubject ? "3px solid #FFFFFF" : "none",
          outlineOffset: isSingleSubject ? "1px" : "0",
          boxShadow: isSingleSubject
            ? "0 12px 25px rgba(0, 0, 0, 0.35)"
            : "none",
          filter: isSingleSubject ? undefined : (filter || undefined),
          mixBlendMode: "normal",
          opacity: 1,
          transition: "opacity 0.3s ease-out",
        }}
      />
    </div>
  );

  // Wrap in SVG TornPaper filter ONLY when tornEdge is explicitly requested
  if (tornEdge) {
    return (
      <TornPaper
        borderWidth={borderWidth}
        borderColor="#FFFFFF"
        rotationDeg={rotationDeg}
        tornScale={14}
        tornFrequency={0.045}
        shadow={true}
        style={{ width, height }}
      >
        {renderImageContent()}
      </TornPaper>
    );
  }

  return renderImageContent();
};
