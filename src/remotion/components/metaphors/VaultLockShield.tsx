import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export interface VaultLockShieldProps {
  /** Top status label before lock */
  unlockedLabel?: string;
  /** Status label after deadbolts lock */
  lockedLabel?: string;
  /** Subtitle / cryptographic badge */
  securityBadge?: string;
  /** Frame when combination locks and bolts shoot outward */
  lockFrame?: number;
  /** Sizing factor (default: 1.0) */
  scale?: number;
}

/**
 * VAULT LOCK SHIELD (Concrete Physical Metaphor)
 *
 * Designed exclusively for Vox/Documentary style reels (Vox, Johnny Harris, MagnatesMedia).
 * Renders an authentic heavy cast-steel bank vault hatch with counter-rotating mechanical gears,
 * 8 radial solid-steel deadbolts snapping into perimeter sockets, and physical impact shockwave.
 */
export const VaultLockShield: React.FC<VaultLockShieldProps> = ({
  unlockedLabel = "VULNERABLE / UNENCRYPTED",
  lockedLabel = "MAXIMUM SECURITY VAULT",
  securityBadge = "256-BIT CRYPTOGRAPHIC LOCK",
  lockFrame = 24,
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Master entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const isLocked = frame >= lockFrame;

  // Counter-rotating gear dial rotations
  // Outer gear spins +180 deg then stops at lockFrame
  const outerGearRot = interpolate(frame, [0, lockFrame], [0, 180], {
    extrapolateRight: "clamp",
  });
  // Inner combination wheel spins -270 deg then stops
  const innerDialRot = interpolate(frame, [0, lockFrame], [0, -270], {
    extrapolateRight: "clamp",
  });
  // Spoke handle wheel spins +90 deg then snaps
  const spokeRot = interpolate(frame, [0, lockFrame], [0, 90], {
    extrapolateRight: "clamp",
  });

  // High-stiffness spring for 8 radial deadbolts shooting outward
  const boltProgress = spring({
    frame: frame - lockFrame,
    fps,
    config: { damping: 13, stiffness: 240, mass: 0.9 },
  });
  // Bolt extension distance in pixels: 0px (retracted) -> 44px (extended into sockets)
  const boltExtension = interpolate(boltProgress, [0, 1], [0, 44]);

  // Impact shockwave ring expanding across vault face
  const impactAge = frame - lockFrame;
  const shockScale = isLocked
    ? interpolate(impactAge, [0, 16], [0.4, 1.8], { extrapolateRight: "clamp" })
    : 0;
  const shockOpacity = isLocked
    ? interpolate(impactAge, [0, 16], [0.95, 0], { extrapolateRight: "clamp" })
    : 0;

  // Perimeter deadbolt angles (8 directions: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  const boltAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      style={{
        position: "relative",
        width: "820px",
        height: "820px",
        transform: `scale(${scale * entrance})`,
        transformOrigin: "center center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* ── BASE DESK CONTACT SHADOW ── */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "660px",
          height: "60px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0) 70%)",
          filter: "blur(8px)",
          zIndex: 1,
        }}
      />

      {/* ── IMPACT SHOCKWAVE EXPANDING RING ── */}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            width: "680px",
            height: "680px",
            borderRadius: "50%",
            border: "4px solid #10B981",
            boxShadow: "0 0 24px rgba(16, 185, 129, 0.6)",
            transform: `scale(${shockScale})`,
            opacity: shockOpacity,
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
      )}

      {/* ── SVG LAYER: STEEL VAULT HATCH & 8 RADIAL DEADBOLTS ── */}
      <svg
        width="820"
        height="820"
        viewBox="-410 -410 820 820"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          zIndex: 5,
        }}
      >
        <defs>
          {/* Cast Steel Hatch Radial Gradient */}
          <radialGradient id="steelVaultHatch" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="45%" stopColor="#1E293B" />
            <stop offset="85%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Heavy Steel Rim Gradient */}
          <linearGradient id="vaultRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="30%" stopColor="#334155" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Brass Combination Dial Gradient */}
          <linearGradient id="brassDial" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Solid Steel Deadbolt Cylinders */}
          <linearGradient id="deadboltSteel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="45%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Heavy Ambient Shadow Filter */}
          <filter id="vaultShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* ── 1. THE 8 RADIAL DEADBOLTS (EXTENDING INTO OUTER JAMBS) ── */}
        <g id="radialDeadbolts">
          {boltAngles.map((ang) => {
            const rad = (ang * Math.PI) / 180;
            // Base cylinder radius 280px + boltExtension
            const boltBaseRadius = 265;
            const currentBoltR = boltBaseRadius + boltExtension;
            const bX = Math.cos(rad) * currentBoltR;
            const bY = Math.sin(rad) * currentBoltR;

            return (
              <g
                key={`bolt-${ang}`}
                transform={`translate(${bX}, ${bY}) rotate(${ang})`}
                filter="url(#vaultShadow)"
              >
                {/* Heavy Cylindrical Steel Bolt */}
                <rect
                  x="-16"
                  y="-18"
                  width="70"
                  height="36"
                  rx="6"
                  fill="url(#deadboltSteel)"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
                {/* Bolt Chiseled Bevel Tip */}
                <polygon points="54,-18 68,-6 68,6 54,18" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.5" />
              </g>
            );
          })}
        </g>

        {/* ── 2. OUTER REINFORCED STEEL HATCH DOOR ── */}
        <circle
          cx="0"
          cy="0"
          r="290"
          fill="url(#steelVaultHatch)"
          stroke="url(#vaultRim)"
          strokeWidth="16"
          filter="url(#vaultShadow)"
        />

        {/* Outer Perimeter Rivets (16 heavy hex bolts) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 360) / 16;
          const r = 268;
          const rx = Math.cos((a * Math.PI) / 180) * r;
          const ry = Math.sin((a * Math.PI) / 180) * r;
          return (
            <circle
              key={`rivet-${i}`}
              cx={rx}
              cy={ry}
              r="7"
              fill="#64748B"
              stroke="#0F172A"
              strokeWidth="2"
            />
          );
        })}

        {/* ── 3. ROTATING GEAR TUMBLER RING (CLW 180 DEG) ── */}
        <g id="gearRing" transform={`rotate(${outerGearRot})`}>
          <circle
            cx="0"
            cy="0"
            r="205"
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeDasharray="16 10"
          />
          <circle cx="0" cy="0" r="195" fill="none" stroke="#64748B" strokeWidth="2" />
        </g>

        {/* ── 4. MIDDLE NUMBERED COMBINATION DIAL (CCW 270 DEG) ── */}
        <g id="combinationDial" transform={`rotate(${innerDialRot})`}>
          <circle
            cx="0"
            cy="0"
            r="150"
            fill="#1E293B"
            stroke="url(#brassDial)"
            strokeWidth="6"
          />
          {/* Engraved Dial Hash Marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const da = (i * 360) / 24;
            const isMajor = i % 2 === 0;
            const rIn = isMajor ? 124 : 134;
            const rOut = 144;
            const dRad = (da * Math.PI) / 180;
            return (
              <line
                key={`dial-hash-${i}`}
                x1={Math.cos(dRad) * rIn}
                y1={Math.sin(dRad) * rIn}
                x2={Math.cos(dRad) * rOut}
                y2={Math.sin(dRad) * rOut}
                stroke="#D97706"
                strokeWidth={isMajor ? 3 : 1.5}
              />
            );
          })}
        </g>

        {/* ── 5. CENTRAL CLUTCH SPOKE WHEEL (3-WAY TURNING SPOKES) ── */}
        <g id="spokeWheel" transform={`rotate(${spokeRot})`}>
          {/* 3 Heavy Chrome Spokes */}
          {[0, 120, 240].map((deg) => (
            <g key={`spoke-${deg}`} transform={`rotate(${deg})`}>
              <rect x="-10" y="-105" width="20" height="105" rx="5" fill="url(#deadboltSteel)" stroke="#0F172A" strokeWidth="2" />
              {/* Spherical Spoke End Handle Knob */}
              <circle cx="0" cy="-105" r="15" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
            </g>
          ))}
          {/* Center Hub Cap */}
          <circle cx="0" cy="0" r="42" fill={isLocked ? "#065F46" : "#7F1D1D"} stroke="#0F172A" strokeWidth="3" />
          <circle cx="0" cy="0" r="30" fill={isLocked ? "#10B981" : "#EF4444"} />
        </g>
      </svg>

      {/* ── 6. FLOATING STAMPED SECURITY EVIDENCE BADGES ── */}
      {/* Top Status Header */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: isLocked ? "#ECFDF5" : "#FEF2F2",
          border: isLocked ? "3px solid #10B981" : "3px solid #DC2626",
          borderRadius: "6px",
          padding: "8px 20px",
          boxShadow: isLocked ? "0 8px 20px rgba(16, 185, 129, 0.4)" : "0 8px 20px rgba(220, 38, 38, 0.4)",
          zIndex: 25,
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "0.14em",
            color: isLocked ? "#047857" : "#991B1B",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {isLocked ? "ACCESS SEALED & CERTIFIED" : "WARNING: PERIMETER OPEN"}
        </span>
        <span
          style={{
            fontSize: "26px",
            fontWeight: 900,
            color: isLocked ? "#065F46" : "#991B1B",
            fontFamily: "'Bebas Neue', sans-serif",
          }}
        >
          {isLocked ? lockedLabel : unlockedLabel}
        </span>
      </div>

      {/* Bottom Cryptographic Stamp Plate */}
      <div
        style={{
          position: "absolute",
          bottom: "55px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#FAF5E8",
          border: "2px solid #854D0E",
          borderRadius: "4px",
          padding: "8px 18px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
          zIndex: 25,
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: isLocked ? "#10B981" : "#EF4444",
            boxShadow: isLocked ? "0 0 8px #10B981" : "0 0 8px #EF4444",
          }}
        />
        <span
          style={{
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "#1E293B",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {securityBadge}
        </span>
      </div>
    </div>
  );
};
