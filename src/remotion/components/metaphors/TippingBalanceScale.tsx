import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

export interface TippingBalanceScaleProps {
  /** Label for left pan */
  leftLabel?: string;
  /** Primary metric value for left pan */
  leftValue?: string;
  /** Subtitle for left pan */
  leftSub?: string;
  /** Label for right pan */
  rightLabel?: string;
  /** Primary metric value for right pan */
  rightValue?: string;
  /** Subtitle for right pan */
  rightSub?: string;
  /** Which side tips downward under heavy weight */
  tiltDirection?: "left_down" | "right_down";
  /** Maximum tilt angle in degrees */
  maxTiltAngleDeg?: number;
  /** Frame when heavy weight starts falling from above */
  dropFrame?: number;
  /** Scale sizing factor (default: 1.0) */
  scale?: number;
}

/**
 * TIPPING BALANCE SCALE (Concrete Physical Metaphor)
 *
 * Designed exclusively for Vox/Documentary style reels (Vox, Johnny Harris, MagnatesMedia).
 * Renders an authentic cast-iron & brass mechanical fulcrum balance scale.
 *
 * Kinematics:
 * - Beam length 2L rotates about (x0, y0) by angle θ(t)
 * - True gravitational cable hanging: dish pans remain level with damped pendulum sway
 * - Heavy physical iron block drops with y(t) = y0 + 1/2 g t^2
 * - High-inertia underdamped spring tilt impact
 */
export const TippingBalanceScale: React.FC<TippingBalanceScaleProps> = ({
  leftLabel = "VALUE / REVENUE",
  leftValue = "$3.2M",
  leftSub = "Annual Run Rate",
  rightLabel = "TECHNICAL DEBT",
  rightValue = "$14.8M",
  rightSub = "Estimated Rewrite Cost",
  tiltDirection = "right_down",
  maxTiltAngleDeg = 15,
  dropFrame = 16,
  scale = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the entire apparatus
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Fulcrum Geometry Dimensions
  const halfBeamLength = 330;
  const cableLength = 170;
  const panWidth = 230;
  const panDepth = 38;

  // Impact frame when weight strikes the pan
  const impactFrame = dropFrame + 10;
  const isAfterImpact = frame >= impactFrame;

  // Beam tilt physics calculation
  let currentTiltAngle = 0;
  if (frame < impactFrame) {
    // Subtle idle equilibrium breathing (±0.8 deg)
    currentTiltAngle = Math.sin(frame * 0.16) * 0.8;
  } else {
    // Underdamped spring tilt on impact
    const tiltSpring = spring({
      frame: frame - impactFrame,
      fps,
      config: { damping: 9, stiffness: 68, mass: 1.3 },
    });
    const targetAngle = tiltDirection === "right_down" ? maxTiltAngleDeg : -maxTiltAngleDeg;
    currentTiltAngle = interpolate(tiltSpring, [0, 1], [0, targetAngle]);
  }

  const rad = (currentTiltAngle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  // Left and Right beam tip coordinates relative to fulcrum center (0, 0)
  const leftTipX = -halfBeamLength * cosA;
  const leftTipY = -halfBeamLength * sinA;

  const rightTipX = halfBeamLength * cosA;
  const rightTipY = halfBeamLength * sinA;

  // Pendulum counter-sway angle for hanging pans (damped oscillation)
  const swayElapsed = Math.max(0, frame - impactFrame);
  const swayDamping = Math.exp(-0.06 * swayElapsed);
  const swayAngle = isAfterImpact
    ? (tiltDirection === "right_down" ? -1 : 1) * Math.sin(swayElapsed * 0.32) * 5 * swayDamping
    : 0;

  // Falling weight kinematics (Right side receives weight by default)
  const isRightTipping = tiltDirection === "right_down";
  const dropElapsed = Math.max(0, frame - dropFrame);
  const dropProgress = Math.min(1, dropElapsed / 10);
  // Quadratic fall trajectory y(t)
  const weightFallY = interpolate(
    Math.pow(dropProgress, 2),
    [0, 1],
    [-340, rightTipY + cableLength - 28],
    { extrapolateRight: "clamp" }
  );
  const weightOpacity = interpolate(frame, [dropFrame - 2, dropFrame + 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Impact dust / flash shockwave on pan
  const impactAge = frame - impactFrame;
  const impactShockScale = isAfterImpact ? interpolate(impactAge, [0, 14], [0.6, 2.2], { extrapolateRight: "clamp" }) : 0;
  const impactShockOpacity = isAfterImpact ? interpolate(impactAge, [0, 14], [0.9, 0], { extrapolateRight: "clamp" }) : 0;

  return (
    <div
      style={{
        position: "relative",
        width: "900px",
        height: "720px",
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
          bottom: "30px",
          width: "580px",
          height: "44px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0) 70%)",
          filter: "blur(6px)",
          zIndex: 1,
        }}
      />

      {/* ── SVG LAYER: FULCRUM PILLAR, BEAM, & SUSPENSION CHAINS ── */}
      <svg
        width="900"
        height="720"
        viewBox="-450 -360 900 720"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          zIndex: 5,
        }}
      >
        <defs>
          {/* Cast Iron Stanchion Gradient */}
          <linearGradient id="ironGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="35%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Brass Crossbeam Gradient */}
          <linearGradient id="brassBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Gold Pan Gradient */}
          <linearGradient id="brassPan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Drop Shadow Filter */}
          <filter id="metalShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ── 1. CAST-IRON PEDESTAL & FULCRUM PILLAR ── */}
        <g id="stanchion" filter="url(#metalShadow)">
          {/* Broad Base Pedestal */}
          <path
            d="M -160 270 L 160 270 L 130 240 L -130 240 Z"
            fill="url(#ironGradient)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <ellipse cx="0" cy="270" rx="160" ry="12" fill="#0F172A" opacity="0.6" />

          {/* Stepped Column */}
          <rect x="-32" y="40" width="64" height="200" rx="4" fill="url(#ironGradient)" stroke="#0F172A" strokeWidth="2" />
          <rect x="-42" y="100" width="84" height="12" rx="2" fill="#D97706" />
          <rect x="-38" y="180" width="76" height="8" rx="2" fill="#D97706" />

          {/* Fulcrum Pivot Triangle Top */}
          <polygon points="0,-12 -28,40 28,40" fill="url(#ironGradient)" stroke="#0F172A" strokeWidth="2" />
          {/* Brass Center Bearing Boss */}
          <circle cx="0" cy="-6" r="16" fill="url(#brassBeam)" stroke="#451A03" strokeWidth="3" />
          <circle cx="0" cy="-6" r="6" fill="#0F172A" />
        </g>

        {/* ── 2. ROTATING BRASS CROSSBEAM ── */}
        <g id="crossbeam" filter="url(#metalShadow)">
          {/* Main Horizontal Beam Bar */}
          <line
            x1={leftTipX}
            y1={leftTipY}
            x2={rightTipX}
            y2={rightTipY}
            stroke="url(#brassBeam)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Center Reinforcing Truss Arch */}
          <path
            d={`M ${leftTipX * 0.45} ${leftTipY * 0.45} Q 0 ${-26} ${rightTipX * 0.45} ${rightTipY * 0.45}`}
            fill="none"
            stroke="url(#brassBeam)"
            strokeWidth="6"
          />
          {/* Left End Ring Terminal */}
          <circle cx={leftTipX} cy={leftTipY} r="10" fill="url(#brassBeam)" stroke="#451A03" strokeWidth="2" />
          {/* Right End Ring Terminal */}
          <circle cx={rightTipX} cy={rightTipY} r="10" fill="url(#brassBeam)" stroke="#451A03" strokeWidth="2" />
        </g>

        {/* ── 3. SUSPENSION CHAINS (CABLES) ── */}
        {/* Left Pan Chains (hang vertically from left tip) */}
        <g id="leftChains" opacity="0.9">
          <line
            x1={leftTipX}
            y1={leftTipY}
            x2={leftTipX - panWidth * 0.4}
            y2={leftTipY + cableLength}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <line
            x1={leftTipX}
            y1={leftTipY}
            x2={leftTipX + panWidth * 0.4}
            y2={leftTipY + cableLength}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <line
            x1={leftTipX}
            y1={leftTipY}
            x2={leftTipX}
            y2={leftTipY + cableLength}
            stroke="#B45309"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </g>

        {/* Right Pan Chains (hang vertically from right tip) */}
        <g id="rightChains" opacity="0.9">
          <line
            x1={rightTipX}
            y1={rightTipY}
            x2={rightTipX - panWidth * 0.4}
            y2={rightTipY + cableLength}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <line
            x1={rightTipX}
            y1={rightTipY}
            x2={rightTipX + panWidth * 0.4}
            y2={rightTipY + cableLength}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <line
            x1={rightTipX}
            y1={rightTipY}
            x2={rightTipX}
            y2={rightTipY + cableLength}
            stroke="#B45309"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </g>
      </svg>

      {/* ── 4. LEFT DISH PAN (HTML CONTAINER FOR RICH TACTILE METRICS) ── */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% + ${leftTipX}px - ${panWidth / 2}px)`,
          top: `calc(50% + ${leftTipY + cableLength}px - 20px)`,
          width: `${panWidth}px`,
          transform: `rotate(${swayAngle * 0.6}deg)`,
          transformOrigin: "top center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Physical Stacked Gold Coins / Value Ingot */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "flex-end",
            marginBottom: "-4px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "28px",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #FDE68A 0%, #D97706 70%, #92400E 100%)",
              border: "1px solid #78350F",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 900,
              color: "#78350F",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            VALUE
          </div>
          <div
            style={{
              width: "56px",
              height: "36px",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #FEF08A 0%, #F59E0B 60%, #B45309 100%)",
              border: "1px solid #78350F",
              boxShadow: "0 6px 8px rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 900,
              color: "#451A03",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            99.9%
          </div>
        </div>

        {/* Physical Brass Dish Shape */}
        <div
          style={{
            width: `${panWidth}px`,
            height: `${panDepth}px`,
            borderRadius: "0 0 115px 115px",
            background: "linear-gradient(180deg, #FEF3C7 0%, #F59E0B 40%, #B45309 85%, #78350F 100%)",
            border: "2px solid #451A03",
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255,255,255,0.6)",
          }}
        />

        {/* Physical Riveted Brass Label Plaque */}
        <div
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: "#FAF5E8",
            border: "2px solid #854D0E",
            boxShadow: "0 6px 12px rgba(0,0,0,0.35)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "#854D0E",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {leftLabel}
          </span>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#1E293B",
              fontFamily: "'Bebas Neue', sans-serif",
              lineHeight: 1.1,
            }}
          >
            {leftValue}
          </span>
          {leftSub && (
            <span
              style={{
                fontSize: "10px",
                color: "#64748B",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              {leftSub}
            </span>
          )}
        </div>
      </div>

      {/* ── 5. RIGHT DISH PAN & HEAVY FALLING WEIGHT ── */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% + ${rightTipX}px - ${panWidth / 2}px)`,
          top: `calc(50% + ${rightTipY + cableLength}px - 20px)`,
          width: `${panWidth}px`,
          transform: `rotate(${swayAngle}deg)`,
          transformOrigin: "top center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Dynamic Impact Shockwave Ripple on Pan Landing */}
        {isAfterImpact && (
          <div
            style={{
              position: "absolute",
              top: "0px",
              width: "120px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid #DC2626",
              transform: `scale(${impactShockScale})`,
              opacity: impactShockOpacity,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Heavy Cast Iron Block (Settled into Pan) */}
        {isAfterImpact && (
          <div
            style={{
              width: "110px",
              height: "70px",
              marginBottom: "-6px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #475569 0%, #1E293B 45%, #0B0F19 100%)",
              border: "3px solid #DC2626",
              boxShadow: "0 8px 16px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: "#F87171",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              HEAVY WEIGHT
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FFFFFF",
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              14.8 TONS
            </span>
          </div>
        )}

        {/* Physical Brass Dish Shape */}
        <div
          style={{
            width: `${panWidth}px`,
            height: `${panDepth}px`,
            borderRadius: "0 0 115px 115px",
            background: "linear-gradient(180deg, #FEF3C7 0%, #F59E0B 40%, #B45309 85%, #78350F 100%)",
            border: "2px solid #451A03",
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255,255,255,0.6)",
          }}
        />

        {/* Physical Stamped Red Hazard Label Plaque */}
        <div
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: isAfterImpact ? "#FEF2F2" : "#FAF5E8",
            border: isAfterImpact ? "2px solid #DC2626" : "2px solid #854D0E",
            boxShadow: isAfterImpact ? "0 8px 18px rgba(220, 38, 38, 0.35)" : "0 6px 12px rgba(0,0,0,0.35)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "background-color 0.2s ease",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: isAfterImpact ? "#DC2626" : "#854D0E",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {rightLabel}
          </span>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: isAfterImpact ? "#991B1B" : "#1E293B",
              fontFamily: "'Bebas Neue', sans-serif",
              lineHeight: 1.1,
            }}
          >
            {rightValue}
          </span>
          {rightSub && (
            <span
              style={{
                fontSize: "10px",
                color: isAfterImpact ? "#B91C1C" : "#64748B",
                fontWeight: 700,
                marginTop: "2px",
              }}
            >
              {rightSub}
            </span>
          )}
        </div>
      </div>

      {/* ── 6. FALLING WEIGHT IN TRANSIT (FRAMES dropFrame -> impactFrame) ── */}
      {frame >= dropFrame && frame < impactFrame && (
        <div
          style={{
            position: "absolute",
            left: `calc(50% + ${rightTipX}px - 55px)`,
            top: `calc(50% + ${weightFallY}px)`,
            width: "110px",
            height: "70px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #475569 0%, #1E293B 45%, #0B0F19 100%)",
            border: "3px solid #DC2626",
            boxShadow: "0 16px 28px rgba(0,0,0,0.7)",
            opacity: weightOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#F87171" }}>FALLING</span>
          <span style={{ fontSize: "18px", fontWeight: 900, color: "#FFF" }}>DEBT</span>
        </div>
      )}
    </div>
  );
};
