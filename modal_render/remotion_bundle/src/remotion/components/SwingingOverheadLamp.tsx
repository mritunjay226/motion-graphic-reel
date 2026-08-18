import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Vox Signature Swinging Overhead Lamp & Flickering Desk Light.
 *
 * Implements a swinging pendulum lamp with a conical tungsten light beam
 * and desk highlight flicker using hold/sinusoidal frame keyframes.
 */
export const SwingingOverheadLamp: React.FC = () => {
  const frame = useCurrentFrame();

  // Pendulum swing angle
  const swingRotation = Math.sin(frame * 0.1) * 7;

  // Lamp flickering intensity
  const flickerOpacity = 0.22 + Math.sin(frame * 0.5) * 0.06;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 15 }}>
      {/* Swinging Lamp Cord & Cone Fixture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "200px",
          height: "600px",
          transformOrigin: "top center",
          transform: `translateX(-50%) rotate(${swingRotation}deg)`,
        }}
      >
        {/* Lamp Cord */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "3px",
            height: "180px",
            backgroundColor: "#222",
            transform: "translateX(-50%)",
          }}
        />

        {/* Lamp Shade Shade */}
        <div
          style={{
            position: "absolute",
            top: "180px",
            left: "50%",
            width: "70px",
            height: "40px",
            backgroundColor: "#111",
            borderBottom: "2px solid #FFA500",
            borderRadius: "10px 10px 0 0",
            transform: "translateX(-50%)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.8)",
          }}
        />

        {/* Conical Light Beam with Native Soft Gradient Falloff */}
        <div
          style={{
            position: "absolute",
            top: "220px",
            left: "50%",
            width: "600px",
            height: "1200px",
            transform: "translateX(-50%)",
            backgroundImage:
              "linear-gradient(180deg, rgba(255, 220, 130, 0.42) 0%, rgba(255, 180, 50, 0.04) 75%, transparent 100%)",
            clipPath: "polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%)",
            opacity: flickerOpacity,
          }}
        />
      </div>

      {/* Desk Spot Highlight with Smooth Radial Gradient */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          width: "450px",
          height: "180px",
          transform: `translateX(-50%) rotate(${swingRotation * 0.3}deg)`,
          background:
            "radial-gradient(ellipse at center, rgba(255, 230, 150, 0.22) 0%, rgba(255, 230, 150, 0.08) 45%, transparent 70%)",
          opacity: flickerOpacity * 1.5,
        }}
      />
    </AbsoluteFill>
  );
};
