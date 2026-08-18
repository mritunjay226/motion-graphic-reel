import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate } from "remotion";
import { resolveAssetUrl } from "../utils/resolveAsset";

export interface RemotionVideoLayerProps {
  src: string;
  /** Opacity of the background video (default: 0.45 for atmospheric blend) */
  opacity?: number;
  /** Visual color grade filter */
  filter?: string;
  /** Start offset frame within local scene */
  startFromFrame?: number;
  /** If true, renders as a standalone 16:9 archival video plate with border and metadata badge */
  isArchivalPlate?: boolean;
  /** Archival label text e.g. "HISTORICAL B-ROLL" */
  archivalBadgeText?: string;
  style?: React.CSSProperties;
}

/**
 * High-performance 2.5D Remotion Video B-Roll Layer.
 *
 * Uses OffthreadVideo + local /cache/ resolution for instant zero-stall frame extraction.
 * Mutes embedded audio so voiceover/music remains clean and crisp.
 */
export const RemotionVideoLayer: React.FC<RemotionVideoLayerProps> = ({
  src,
  opacity = 0.92,
  startFromFrame = 0,
  isArchivalPlate = false,
  archivalBadgeText = "HISTORICAL ARCHIVE",
  style,
}) => {
  const frame = useCurrentFrame();

  if (!src) return null;

  const resolvedSrc = resolveAssetUrl(src);

  // Gentle smooth entrance fade
  const videoFadeIn = interpolate(frame, [0, 6], [0, opacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (isArchivalPlate) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "3.5px solid #111111",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.4)",
          backgroundColor: "#000000",
          ...style,
        }}
      >
        <OffthreadVideo
          src={resolvedSrc}
          volume={0}
          muted={true}
          startFrom={startFromFrame}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Vintage CRT Scanlines Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />

        {/* Archival Badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "rgba(17, 17, 17, 0.88)",
            color: "#FFE600",
            border: "1.5px solid #FFE600",
            padding: "4px 10px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: "bold",
            letterSpacing: "1.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 10,
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#D61C1C",
            }}
          />
          <span>● {archivalBadgeText}</span>
        </div>
      </div>
    );
  }

  // Cinematic Full Hero Video Layer (Broadcast Documentary Quality)
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        zIndex: 0,
        opacity: videoFadeIn,
        ...style,
      }}
    >
      <OffthreadVideo
        src={resolvedSrc}
        volume={0}
        muted={true}
        startFrom={startFromFrame}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Subtle Top & Bottom Gradient to keep Vox Headlines & Captions 100% readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
