import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import type { WhisperToken, SpatialCameraConfig, CameraTrajectoryMode } from "../types";

export interface ContinuousSpatialCameraProps {
  /** Scene index (0-indexed) */
  sceneIndex?: number;
  /** Total scenes in composition */
  totalScenes?: number;
  /** Scene duration in frames */
  durationFrames: number;
  /** Layout type string to inform smart camera choreography */
  layoutType?: string;
  /** Optional word tokens from STT for punch impact sync */
  tokens?: WhisperToken[];
  /** Optional custom spatial camera configuration */
  config?: SpatialCameraConfig;
  /** Whether the incoming cut was a match-cut dive from the previous scene */
  isMatchCutEntry?: boolean;
  /** Whether the exit cut should dive into the next scene's focal point */
  isMatchCutExit?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * ContinuousSpatialCamera
 *
 * Broadcast-Grade 3D Continuous Spatial Camera Engine (Johnny Harris / Vox / MagnatesMedia style).
 *
 * Capabilities:
 * 1. 3D Perspective Matrix (perspective 1200px with linked pitch/yaw orbital gimbal physics).
 * 2. Match-Cut Portal Dives: Accellerates into focal point at scene tail, inherits zoom at scene head.
 * 3. Infinite Desk Glide: Continuous trajectory across scenes without abrupt hard stops.
 * 4. Organic Steadicam Breathing: Natural floating camera micro-drift on dual sine/cosine axes.
 */
export const ContinuousSpatialCamera: React.FC<ContinuousSpatialCameraProps> = ({
  sceneIndex = 0,
  totalScenes = 6,
  durationFrames,
  layoutType = "center_hero_cutout",
  tokens = [],
  config = {},
  isMatchCutEntry = false,
  isMatchCutExit = false,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeDuration = Math.max(1, durationFrames);

  // ─── 1. RESOLVE ACTIVE TRAJECTORY MODE ───────────────────────────────────
  let trajectoryMode: CameraTrajectoryMode = config.trajectoryMode || "smart_continuous";

  if (trajectoryMode === "smart_continuous") {
    const norm = (layoutType || "").toLowerCase();
    if (norm.includes("split") || norm.includes("dual") || norm.includes("versus")) {
      trajectoryMode = "orbital_gimbal_3d";
    } else if (norm.includes("newspaper") || norm.includes("memo") || norm.includes("document")) {
      trajectoryMode = "portal_dive_matchcut";
    } else if (norm.includes("timeline") || norm.includes("road") || norm.includes("checklist")) {
      trajectoryMode = "infinite_desk_glide";
    } else if (norm.includes("stat") || norm.includes("chart") || norm.includes("matrix")) {
      trajectoryMode = "punch_rack_focus";
    } else {
      // Default rotating pattern across the narrative arc
      const sequenceModes: CameraTrajectoryMode[] = [
        "portal_dive_matchcut", // Scene 1: Authoritative hook dive
        "orbital_gimbal_3d",     // Scene 2: 3D perspective scan
        "infinite_desk_glide",   // Scene 3: Wide desk glide
        "punch_rack_focus",      // Scene 4: Impact evidence punch
        "orbital_gimbal_3d",     // Scene 5: Angled contrast view
        "portal_dive_matchcut",  // Scene 6: Dramatic climax push
      ];
      trajectoryMode = sequenceModes[sceneIndex % sequenceModes.length];
    }
  }

  // ─── 2. CALCULATE CAMERA POSITIONS & 3D ROTATIONS ────────────────────────
  let currentScale = 1.0;
  let panX = 0;
  let panY = 0;
  let panZ = 0;
  let pitch = 0; // rotateX (tilt)
  let yaw = 0;   // rotateY (pan angle)
  let roll = 0;  // rotateZ (dutch tilt)

  const focalOffsetX = config.focalTarget?.x ?? 0;
  const focalOffsetY = config.focalTarget?.y ?? 0;

  switch (trajectoryMode) {
    // ── MODE A: 3D ORBITAL GIMBAL (Spatial Perspective Pan) ───────────────
    case "orbital_gimbal_3d": {
      const isEven = sceneIndex % 2 === 0;
      const startX = isEven ? 55 : -55;
      const endX = isEven ? -55 : 55;

      panX = interpolate(frame, [0, safeDuration], [startX, endX], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

      panY = interpolate(frame, [0, safeDuration], [-12, 14], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      currentScale = interpolate(frame, [0, safeDuration], [1.02, 1.12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

      // Genuine 3D perspective yaw and pitch linked to spatial movement
      yaw = panX * -0.038 + (config.yawDeg ?? 0);
      pitch = panY * 0.045 + (config.pitchDeg ?? (isEven ? 1.5 : -1.5));
      roll = (panX / 55) * 0.6;
      break;
    }

    // ── MODE B: MATCH-CUT PORTAL DIVE (Seamless Object Hand-off) ───────────
    case "portal_dive_matchcut": {
      const diveWindow = 12; // Frames for tail dive
      const entryWindow = 14; // Frames for head ease-out

      const entryScale = config.entryScale ?? 1.38;
      const settledScale = 1.04;
      const exitTargetScale = config.exitScale ?? 1.42;

      if (isMatchCutEntry && frame < entryWindow) {
        // Inherit high zoom from previous scene, smoothly decelerating
        currentScale = interpolate(frame, [0, entryWindow], [entryScale, settledScale], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        panY = interpolate(frame, [0, entryWindow], [-28, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else if ((isMatchCutExit || frame >= safeDuration - diveWindow) && safeDuration > diveWindow * 2) {
        // Accelerate zoom deep into target object in final frames
        const diveProgress = frame - (safeDuration - diveWindow);
        currentScale = interpolate(diveProgress, [0, diveWindow], [settledScale + 0.04, exitTargetScale], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.33, 0, 0.67, 1),
        });
        panX = interpolate(diveProgress, [0, diveWindow], [0, focalOffsetX * 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        panY = interpolate(diveProgress, [0, diveWindow], [0, focalOffsetY * 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else {
        // Steady continuous documentary push in the body of the scene
        currentScale = interpolate(frame, [0, safeDuration], [settledScale, settledScale + 0.06], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.linear,
        });
        panY = interpolate(frame, [0, safeDuration], [0, -18], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }

      yaw = interpolate(frame, [0, safeDuration], [-1.2, 1.2]);
      pitch = interpolate(frame, [0, safeDuration], [1.8, 0.2]);
      break;
    }

    // ── MODE C: INFINITE DESK GLIDE (Smooth Multi-Axis Traverse) ───────────
    case "infinite_desk_glide": {
      // Long sweeping diagonal glide simulating a camera tracking across a desk table
      panX = interpolate(frame, [0, safeDuration], [-70, 70], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });

      panY = interpolate(frame, [0, safeDuration], [25, -25], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });

      currentScale = interpolate(frame, [0, safeDuration], [1.08, 1.02], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      yaw = panX * -0.025;
      pitch = -1.2;
      roll = interpolate(frame, [0, safeDuration], [-0.5, 0.5]);
      break;
    }

    // ── MODE D: PUNCH RACK FOCUS (High-Energy Beat Impact) ─────────────────
    case "punch_rack_focus": {
      const punchSpring = spring({
        frame,
        fps,
        config: { damping: 13, stiffness: 210, mass: 0.5 },
      });

      const punchScale = interpolate(punchSpring, [0, 1], [0.96, 1.15]);
      const continuousPush = interpolate(frame, [0, safeDuration], [0, 0.05], {
        extrapolateRight: "clamp",
      });

      currentScale = punchScale + continuousPush;

      panY = interpolate(punchSpring, [0, 1], [15, -10]);
      pitch = interpolate(punchSpring, [0, 1], [3.0, 0.5]);
      break;
    }

    default:
      break;
  }

  // ─── 3. ORGANIC STEADICAM BREATHING (Micro Handheld Noise) ───────────────
  const enableWiggle = config.enableHandheldWiggle ?? true;
  let handheldX = 0;
  let handheldY = 0;
  let handheldRoll = 0;

  if (enableWiggle) {
    // Dual out-of-phase trigonometric oscillators for realistic floating camera drift
    handheldX = Math.sin(frame * 0.082) * 1.6 + Math.cos(frame * 0.035) * 0.8;
    handheldY = Math.cos(frame * 0.068) * 1.3 + Math.sin(frame * 0.042) * 0.6;
    handheldRoll = Math.sin(frame * 0.05) * 0.22;
  }

  // Final composite camera coordinates
  const finalPanX = (panX + focalOffsetX + handheldX).toFixed(2);
  const finalPanY = (panY + focalOffsetY + handheldY).toFixed(2);
  const finalPanZ = panZ.toFixed(2);
  const finalPitch = (pitch).toFixed(3);
  const finalYaw = (yaw).toFixed(3);
  const finalRoll = (roll + handheldRoll).toFixed(3);
  const finalScale = currentScale.toFixed(4);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        perspective: "1200px",
        perspectiveOrigin: "center center",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translate3d(${finalPanX}px, ${finalPanY}px, ${finalPanZ}px) rotateX(${finalPitch}deg) rotateY(${finalYaw}deg) rotateZ(${finalRoll}deg) scale(${finalScale})`,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          willChange: "transform",
          ...style,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
