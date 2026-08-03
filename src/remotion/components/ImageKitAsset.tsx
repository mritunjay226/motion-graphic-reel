import React, { useState } from "react";

interface ImageKitAssetProps {
  /** Full URL (Pollinations/ImageKit) or local path */
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
}

/**
 * Smart image component for Pollinations AI & ImageKit assets.
 *
 * - Loads direct image streams with smooth fade-in
 * - Shows an animated loading shimmer while fetching AI assets
 * - Displays a styled dark fallback gradient on network error
 */
export const ImageKitAsset: React.FC<ImageKitAssetProps> = ({
  src,
  objectFit = "cover",
  objectPosition = "center",
  alt = "",
  style = {},
  className,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      {/* Loading shimmer overlay */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(30,20,50,0.8) 0%, rgba(15,25,45,0.9) 50%, rgba(30,20,50,0.8) 100%)",
            zIndex: 1,
          }}
        />
      )}
      <img
        src={src}
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
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease-out",
        }}
      />
    </div>
  );
};
