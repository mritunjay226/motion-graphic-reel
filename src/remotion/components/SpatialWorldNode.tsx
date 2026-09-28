import React from "react";
import type { NodeSpatialPosition } from "../utils/cameraFlight";

export interface SpatialWorldNodeProps {
  position: NodeSpatialPosition;
  isActive: boolean;
  isNextOrPrev: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * SpatialWorldNode
 *
 * Wraps an individual scene's layout template as a physical document pinned
 * at exact (X, Y) coordinates on the giant 6000px x 8000px virtual desk.
 *
 * Features:
 * 1. Physical multi-layered drop shadow onto the desk surface.
 * 2. 3D Push-Pin with metallic specular highlight and radial shadow.
 * 3. Diagonal masking tape accent.
 * 4. Crisp 1080x1920 viewport container ensuring zero distortion on internal templates.
 */
export const SpatialWorldNode: React.FC<SpatialWorldNodeProps> = ({
  position,
  isActive,
  isNextOrPrev,
  children,
  style,
}) => {
  const pinColor = position.pinColor || "#E11D48";

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "1080px",
        height: "1920px",
        transformOrigin: "center center",
        transform: `rotate(${position.rotationDeg}deg) scale(${position.scale})`,
        borderRadius: "28px",
        backgroundColor: "#FAF8F2",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: isActive
          ? "0 45px 110px rgba(0, 0, 0, 0.35), 0 15px 40px rgba(0, 0, 0, 0.22)"
          : "0 30px 75px rgba(0, 0, 0, 0.26), 0 10px 25px rgba(0, 0, 0, 0.16)",
        overflow: "hidden",
        transition: "box-shadow 0.4s ease",
        willChange: "transform",
        ...style,
      }}
    >
      {/* ── 3D PHYSICAL PUSH-PIN (TOP-CENTER EVIDENCE ANCHOR) ── */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        {/* Pin Radial Drop Shadow onto Paper */}
        <div
          style={{
            position: "absolute",
            width: "32px",
            height: "16px",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
            top: "22px",
            left: "6px",
            transform: "rotate(-15deg)",
          }}
        />

        {/* 3D Pin Head */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${pinColor} 50%, #991B1B 100%)`,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255,255,255,0.6)",
            border: "1.5px solid rgba(255,255,255,0.4)",
          }}
        />
      </div>

      {/* ── CORNER SCOTCH TAPE STRIP (EVIDENCE DETAIL) ── */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: "40px",
          width: "80px",
          height: "28px",
          background: "rgba(255, 255, 255, 0.42)",
          backdropFilter: "blur(2px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          transform: "rotate(12deg)",
          zIndex: 55,
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          pointerEvents: "none",
        }}
      />

      {/* ── SCENE CONTENT TEMPLATE ── */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {children}
      </div>
    </div>
  );
};
