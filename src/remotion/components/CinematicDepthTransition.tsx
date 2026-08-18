import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { TornPaper } from "./TornPaper";

export type CinematicTransitionType =
  | "torn_paper_rip"
  | "depth_snap_whip"
  | "anamorphic_light_leak"
  | "film_shutter_snap"
  | "curve_velocity_cut";

interface CinematicDepthTransitionProps {
  /** Transition style */
  type?: CinematicTransitionType;
  /** Scene start frame */
  sceneStartFrame: number;
  /** Scene duration in frames */
  durationFrames: number;
  /** Transition window length in frames (default 7 frames) */
  transitionFrames?: number;
  children: React.ReactNode;
}

/**
 * Broadcast-Grade 2.5D Cinematic Depth Transition Engine.
 *
 * Delivers tangible physical depth, tactile paper tears, anamorphic film light leaks,
 * and snap-zoom transitions across scene boundaries.
 */
export const CinematicDepthTransition: React.FC<CinematicDepthTransitionProps> = ({
  type = "torn_paper_rip",
  sceneStartFrame,
  durationFrames,
  transitionFrames = 7,
  children,
}) => {
  const frame = useCurrentFrame();

  const isTransitioningIn = frame <= transitionFrames;
  const isTransitioningOut = frame >= durationFrames - transitionFrames;

  // ─── 1. TORN PAPER RIP (Signature 2.5D Physical Paper Tear) ───────────────
  if (type === "torn_paper_rip") {
    let paperOffset = 100;
    if (isTransitioningIn) {
      paperOffset = interpolate(frame, [0, transitionFrames], [0, -100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
    }

    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}

        {isTransitioningIn && (
          <AbsoluteFill
            style={{
              zIndex: 100,
              transform: `translateX(${paperOffset}%)`,
              pointerEvents: "none",
              boxShadow: "20px 0 60px rgba(0,0,0,0.65)",
            }}
          >
            <TornPaper
              borderWidth={8}
              borderColor="#FFFFFF"
              tornScale={18}
              tornFrequency={0.06}
              shadow={true}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "#FAF8F2",
              }}
            >
              <div style={{ width: "100%", height: "100%", background: "#FAF8F2" }} />
            </TornPaper>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    );
  }

  // ─── 2. DEPTH SNAP WHIP (High-Energy Depth Scale & Motion Blur) ───────────
  if (type === "depth_snap_whip") {
    let scale = 1;
    let translateX = 0;
    let opacity = 1;

    if (isTransitioningIn) {
      const p = interpolate(frame, [0, transitionFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      scale = interpolate(p, [0, 1], [0.91, 1]);
      translateX = interpolate(p, [0, 1], [120, 0]);
      opacity = interpolate(p, [0, 0.4, 1], [0.4, 0.9, 1]);
    } else if (isTransitioningOut) {
      const outFrame = frame - (durationFrames - transitionFrames);
      const p = interpolate(outFrame, [0, transitionFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      });
      scale = interpolate(p, [0, 1], [1, 1.12]);
      translateX = interpolate(p, [0, 1], [0, -120]);
      opacity = interpolate(p, [0, 0.7, 1], [1, 0.9, 0.4]);
    }

    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${translateX}px)`,
          opacity,
          overflow: "hidden",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // ─── 3. ANAMORPHIC LIGHT LEAK (Organic 35mm Optical Flare) ─────────────────
  if (type === "anamorphic_light_leak") {
    let flareOpacity = 0;
    let flareScale = 1;

    if (isTransitioningIn) {
      flareOpacity = interpolate(frame, [0, transitionFrames], [0.85, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.ease),
      });
      flareScale = interpolate(frame, [0, transitionFrames], [1.3, 1.0]);
    } else if (isTransitioningOut) {
      const outFrame = frame - (durationFrames - transitionFrames);
      flareOpacity = interpolate(outFrame, [0, transitionFrames], [0, 0.85], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.ease),
      });
      flareScale = interpolate(outFrame, [0, transitionFrames], [1.0, 1.3]);
    }

    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}

        {(isTransitioningIn || isTransitioningOut) && flareOpacity > 0.01 && (
          <AbsoluteFill
            style={{
              mixBlendMode: "screen",
              opacity: flareOpacity,
              pointerEvents: "none",
              zIndex: 90,
              transform: `scale(${flareScale})`,
              backgroundImage: `
                radial-gradient(ellipse at 85% 15%, rgba(255, 190, 80, 0.95) 0%, rgba(255, 90, 40, 0.6) 35%, transparent 70%),
                radial-gradient(ellipse at 15% 85%, rgba(0, 220, 255, 0.7) 0%, rgba(120, 0, 255, 0.4) 40%, transparent 75%)
              `,
            }}
          />
        )}
      </AbsoluteFill>
    );
  }

  // ─── 4. FILM SHUTTER SNAP (Photographic Aperture Snap & Flash) ────────────
  if (type === "film_shutter_snap") {
    let flashOpacity = 0;
    if (isTransitioningIn) {
      flashOpacity = interpolate(frame, [0, 1, transitionFrames], [0, 0.65, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}

        {isTransitioningIn && flashOpacity > 0.01 && (
          <AbsoluteFill
            style={{
              backgroundColor: "#FFFFFF",
              opacity: flashOpacity,
              pointerEvents: "none",
              zIndex: 95,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </AbsoluteFill>
    );
  }

  // ─── 5. DEFAULT: CURVE VELOCITY MATCHED CUT ───────────────────────────────
  let velocityX = 0;
  let scale = 1;

  if (isTransitioningOut) {
    const outFrame = frame - (durationFrames - transitionFrames);
    const p = interpolate(outFrame, [0, transitionFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.bezier(0.7, 0, 0.84, 0)),
    });
    velocityX = interpolate(p, [0, 1], [0, -110]);
    scale = interpolate(p, [0, 1], [1, 1.05]);
  } else if (isTransitioningIn) {
    const p = interpolate(frame, [0, transitionFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.bezier(0.16, 1, 0.3, 1)),
    });
    velocityX = interpolate(p, [0, 1], [110, 0]);
    scale = interpolate(p, [0, 1], [0.96, 1]);
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${velocityX}px) scale(${scale})`,
        overflow: "hidden",
        willChange: "transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
