"use client";

import React from "react";
import { Img, OffthreadVideo } from "remotion";
import { resolveAssetUrl } from "../utils/resolveAsset";

interface NewsArticleClippingProps {
  headline?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
}

/**
 * NewsArticleClipping renders vintage newspaper clippings
 * with newspaper header, torn paper edges, image cutout, and news column layout.
 */
export const NewsArticleClipping: React.FC<NewsArticleClippingProps> = ({
  headline = "FINANCIAL CHRONICLE",
  content = "DVD STREAMING SURGES",
  imageUrl,
  videoUrl,
}) => {
  const [videoError, setVideoError] = React.useState(false);
  return (
    <div
      style={{
        position: "relative",
        background: "#FFFDF7",
        border: "3.5px solid #111111",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "12px 12px 0px #111111",
        transform: "rotate(-2deg)",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Red Rubber Stamp Slammed Over Card */}
      <div
        style={{
          position: "absolute",
          top: "-18px",
          right: "-14px",
          border: "4px double #D61C1C",
          borderRadius: "8px",
          padding: "6px 18px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          color: "#D61C1C",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "32px",
          fontWeight: 900,
          letterSpacing: "2px",
          transform: "rotate(-12deg)",
          boxShadow: "0 4px 14px rgba(214, 28, 28, 0.3)",
          zIndex: 30,
        }}
      >
        DISRUPTED
      </div>

      {/* Inner Newspaper Section */}
      <div style={{ backgroundColor: "#F4EFE6", border: "2px solid #111111", padding: "16px", borderRadius: "10px" }}>
        {/* Newspaper Masthead */}
        <div style={{ textAlign: "center", borderBottom: "3px double #111", paddingBottom: "6px", marginBottom: "10px" }}>
          <h4 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "1.5px", color: "#111", textTransform: "uppercase", margin: 0, textAlign: "center" }}>
            {headline}
          </h4>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "bold", color: "#444", marginTop: "4px", borderTop: "1px solid #AAA", paddingTop: "4px" }}>
            <span>VOL. CXXIV NO. 42</span>
            <span>● SPECIAL REPORT ●</span>
            <span>FIVE CENTS</span>
          </div>
        </div>

        {/* Headline & Media side-by-side */}
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "8px" }}>
          <h3 style={{ flex: 1, fontSize: "30px", fontWeight: 900, color: "#111", lineHeight: 1.18, margin: 0, textTransform: "uppercase" }}>
            {content}
          </h3>
          {(videoUrl || imageUrl) && (
            <div style={{ width: "130px", height: "105px", borderRadius: "6px", overflow: "hidden", border: "2px solid #111", flexShrink: 0, backgroundColor: "#000" }}>
              {videoUrl && !videoError ? (
                <OffthreadVideo
                  src={resolveAssetUrl(videoUrl)}
                  volume={0}
                  muted={true}
                  onError={(e) => {
                    console.warn("[NewsArticleClipping] Video load failed, fallback to image:", videoUrl, e);
                    setVideoError(true);
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Img
                  src={resolveAssetUrl(imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80")}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Caption Below Newspaper Inset */}
      <div style={{ marginTop: "14px" }}>
        <h4 style={{ margin: 0, fontSize: "26px", fontWeight: 400, color: "#111111", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}>
          DVD BY MAIL SURGES 300%
        </h4>
        <p style={{ margin: "4px 0 0 0", fontSize: "18px", color: "#444444", fontStyle: "italic", lineHeight: 1.3 }}>
          Subscribers flock to flat-rate monthly plans with zero late fees.
        </p>
      </div>
    </div>
  );
};
