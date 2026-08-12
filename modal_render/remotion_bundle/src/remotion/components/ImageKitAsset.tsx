import React, { useState } from "react";
import { buildImageKitUrl, ImageKitTransformOptions } from "../utils/imagekit";

export type ImageMaskType = "none" | "radial_soft" | "oval_cutout" | "paper_card" | "circle_badge";

interface ImageKitAssetProps {
  /** Full URL (Pollinations/ImageKit) or relative asset path */
  src: string;
  /** CSS object-fit mode */
  objectFit?: "cover" | "contain" | "fill";
  /** CSS object-position */
  objectPosition?: string;
  /** Alt text */
  alt?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Additional className */
  className?: string;
  /** ImageKit transformation filters & AI background removal options */
  transformOptions?: ImageKitTransformOptions;
  /** Vox cutout mask style — eliminates dark rectangular boxes */
  maskType?: ImageMaskType;
}

/**
 * Smart image component powered by ImageKit.io CDN & Vox Cutout Masking.
 *
 * Prevents raw square/rectangular images from showing dark rectangular borders:
 * - `radial_soft`: Fades rectangular edges into transparent vignette
 * - `oval_cutout`: Smooth oval cutout for character portraits
 * - `paper_card`: Polished white paper sticker card with shadow
 * - `circle_badge`: Clean circular cutout badge
 */
export const ImageKitAsset: React.FC<ImageKitAssetProps> = ({
  src,
  objectFit = "cover",
  objectPosition = "center",
  alt = "",
  style = {},
  className,
  transformOptions,
  maskType = "radial_soft",
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Apply ImageKit transformations if options are provided
  const finalSrc = transformOptions
    ? buildImageKitUrl(src, transformOptions)
    : src;

  if (hasError) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(145deg, #1a0a2e 0%, #0d1117 40%, #162447 70%, #0a1628 100%)",
          ...style,
        }}
      />
    );
  }

  // Determine mask & container styles based on maskType
  const getMaskStyle = (): React.CSSProperties => {
    switch (maskType) {
      case "radial_soft":
        return {
          maskImage: "radial-gradient(ellipse at center, black 60%, transparent 98%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 98%)",
        };
      case "oval_cutout":
        return {
          maskImage: "radial-gradient(ellipse 48% 48% at 50% 50%, black 75%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 48% 48% at 50% 50%, black 75%, transparent 100%)",
        };
      case "paper_card":
        return {
          borderRadius: "20px",
          border: "4px solid #FFFFFF",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        };
      case "circle_badge":
        return {
          borderRadius: "50%",
          border: "4px solid #FFFFFF",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.22)",
          overflow: "hidden",
        };
      case "none":
      default:
        return {};
    }
  };

  const maskStyle = getMaskStyle();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...maskStyle,
        ...style,
      }}
    >
      {/* Loading shimmer overlay */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              "linear-gradient(135deg, rgba(230,230,230,0.8) 0%, rgba(200,200,200,0.9) 50%, rgba(230,230,230,0.8) 100%)",
            zIndex: 1,
          }}
        />
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={className}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition,
          display: "block",
          opacity: 1,
          transition: "opacity 0.4s ease-out",
        }}
      />
    </div>
  );
};
