import { Easing } from "remotion";
import type { Scene } from "../types";

export interface NodeSpatialPosition {
  sceneId: number;
  x: number;          // World X coordinate in px (relative to origin 0,0)
  y: number;          // World Y coordinate in px
  z: number;          // World Z offset in px
  rotationDeg: number;// Organic placement tilt on the desk surface
  scale: number;      // Document scale factor
  pinColor?: string;  // Push-pin accent color
}

export interface CameraFlightState {
  camX: number;
  camY: number;
  camZ: number;
  zoom: number;
  pitch: number; // rotateX in degrees
  yaw: number;   // rotateY in degrees
  roll: number;  // rotateZ (banking) in degrees
  activeSceneIndex: number;
  isTransitioning: boolean;
  transitionProgress: number; // 0..1 during flight
  targetSceneIndex: number;
  motionBlurPx: number; // Velocity-induced motion blur (0 to 3px)
}

/**
 * Deterministic spatial layout generator for investigative desk nodes.
 * Creates an organic serpentine flight path across a 10,000px x 14,000px virtual world.
 */
export function getNodeWorldCoordinates(scenes: Scene[]): NodeSpatialPosition[] {
  // Master placement pattern for the investigative desk
  const presetOffsets = [
    { x: 0,     y: 0,    rotationDeg: 0,    pinColor: "#E11D48" }, // Scene 1: The Center Hook
    { x: 1250,  y: 650,  rotationDeg: -3.5, pinColor: "#F59E0B" }, // Scene 2: Evidence memo right
    { x: -950,  y: 1850, rotationDeg: 2.8,  pinColor: "#10B981" }, // Scene 3: Stat trend swoop down-left
    { x: 900,   y: 2950, rotationDeg: -2.0, pinColor: "#3B82F6" }, // Scene 4: Deep dive chart right
    { x: -800,  y: 4100, rotationDeg: 3.2,  pinColor: "#8B5CF6" }, // Scene 5: Turning point left
    { x: 0,     y: 5250, rotationDeg: 0,    pinColor: "#E11D48" }, // Scene 6: Dramatic climax centered
  ];

  return scenes.map((scene, i) => {
    if (i < presetOffsets.length) {
      const p = presetOffsets[i];
      return {
        sceneId: scene.sceneId,
        x: p.x,
        y: p.y,
        z: 0,
        rotationDeg: p.rotationDeg,
        scale: 1.0,
        pinColor: p.pinColor,
      };
    }

    // Procedural alternating zigzag for any additional scenes beyond 6
    const isEven = i % 2 === 0;
    const x = isEven ? 850 + (i % 3) * 120 : -850 - (i % 3) * 120;
    const y = i * 1150;
    const rotationDeg = isEven ? -2.5 : 2.5;

    return {
      sceneId: scene.sceneId,
      x,
      y,
      z: 0,
      rotationDeg,
      scale: 1.0,
      pinColor: "#F59E0B",
    };
  });
}

/**
 * Smootherstep polynomial: zero velocity and zero acceleration at both t=0 and t=1.
 * Eliminates all jerky starts and stops.
 */
function smootherstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * Cinematic Flight Engine 2.0
 *
 * Implements:
 * 1. Curved Bézier Orbital Arcs (perpendicular bowing so the camera swoops organically).
 * 2. Damped Harmonic Inertial Settle (18px physical overshoot & elastic recoil on landing).
 * 3. Continuous C1 Altitude Spline (zero zoom pops/stutters at flight boundaries).
 * 4. Velocity-Coupled Aerodynamic Banking (roll and pitch tied to instantaneous flight velocity).
 * 5. Velocity Motion Blur (proportional streak during high-speed desk travel).
 */
export function computeCameraFlightState(
  frame: number,
  scenes: Scene[],
  nodePositions: NodeSpatialPosition[],
  enableLoop: boolean = false
): CameraFlightState {
  if (scenes.length === 0 || nodePositions.length === 0) {
    return {
      camX: 0,
      camY: 0,
      camZ: 0,
      zoom: 1.0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      activeSceneIndex: 0,
      isTransitioning: false,
      transitionProgress: 0,
      targetSceneIndex: 0,
      motionBlurPx: 0,
    };
  }

  const FLIGHT_WINDOW = 30; // Frames in active flight (~1.0s at 30fps for buttery-smooth crane travel)
  const SETTLE_WINDOW = 12; // Frames for inertial damped harmonic recoil

  // 1. Detect if frame falls within ANY active transition flight window between consecutive scenes
  let activeFlight: {
    fromIndex: number;
    toIndex: number;
    flightStart: number;
    flightEnd: number;
  } | null = null;

  for (let k = 0; k < scenes.length - 1; k++) {
    const nextScene = scenes[k + 1];
    // Flight finishes smoothly exactly at nextScene.startFrame
    const flightEnd = nextScene.startFrame;
    const flightStart = flightEnd - FLIGHT_WINDOW;

    if (frame >= flightStart && frame <= flightEnd) {
      activeFlight = {
        fromIndex: k,
        toIndex: k + 1,
        flightStart,
        flightEnd,
      };
      break;
    }
  }

  // Loop closure flight at the end of the reel
  if (!activeFlight && enableLoop && scenes.length > 1) {
    const totalReelFrames = scenes.reduce(
      (max, s) => Math.max(max, s.startFrame + s.durationFrames),
      0
    );
    const loopFlightEnd = totalReelFrames;
    const loopFlightStart = loopFlightEnd - FLIGHT_WINDOW;

    if (frame >= loopFlightStart && frame <= loopFlightEnd) {
      activeFlight = {
        fromIndex: scenes.length - 1,
        toIndex: 0,
        flightStart: loopFlightStart,
        flightEnd: loopFlightEnd,
      };
    }
  }

  // ── A. ACTIVE SPATIAL FLIGHT (Bézier Arc + Banking + Altitude Lift) ──
  if (activeFlight) {
    const fromNode = nodePositions[activeFlight.fromIndex] || nodePositions[0];
    const targetNode = nodePositions[activeFlight.toIndex] || fromNode;
    const flightProgress = Math.min(
      1,
      Math.max(0, (frame - activeFlight.flightStart) / FLIGHT_WINDOW)
    );
    const t = smootherstep(flightProgress);

    // Vector from current node to target node
    const deltaX = targetNode.x - fromNode.x;
    const deltaY = targetNode.y - fromNode.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Unit normal vector perpendicular to flight direction
    const unitX = distance > 0 ? deltaX / distance : 0;
    const unitY = distance > 0 ? deltaY / distance : 1;
    // Rotate 90 degrees counter-clockwise for perpendicular bow
    const normX = -unitY;
    const normY = unitX;

    // Curved Bézier orbital arc: bow outward by 16% of flight distance (capped at 220px)
    const arcHeight = Math.min(220, distance * 0.16);
    // Alternate bow direction based on scene index for natural rhythmic S-curves
    const bowSign = activeFlight.fromIndex % 2 === 0 ? 1 : -1;
    const arcDisplacement = Math.sin(flightProgress * Math.PI) * arcHeight * bowSign;

    // Base position along curved orbital flight path
    const camX = fromNode.x + deltaX * t + normX * arcDisplacement;
    const camY = fromNode.y + deltaY * t + normY * arcDisplacement;

    // Continuous parabolic altitude shift (camera lifts up mid-flight to reveal the desk)
    const altitudeLift = Math.sin(flightProgress * Math.PI) * 0.13;
    // Smoothly blend from previous scene's settled zoom (1.035) down to base (1.00)
    const baseZoom = 1.035 * (1 - t) + 1.00 * t;
    const zoom = baseZoom - altitudeLift;

    // Velocity-coupled 3D aerodynamic banking into the turn
    const bankArc = Math.sin(flightProgress * Math.PI);
    const roll = -(unitX * 3.6 + (normX * bowSign) * 2.2) * bankArc;
    const yaw = unitX * -1.8 * bankArc;
    const pitch = 1.2 + bankArc * 2.6;

    // Velocity motion blur: streaks smoothly during peak flight speed
    const motionBlurPx = bankArc * 2.2;

    return {
      camX,
      camY,
      camZ: 0,
      zoom,
      pitch,
      yaw,
      roll,
      activeSceneIndex: activeFlight.fromIndex,
      isTransitioning: true,
      transitionProgress: flightProgress,
      targetSceneIndex: activeFlight.toIndex,
      motionBlurPx,
    };
  }

  // ── B. SCENE DWELL & INERTIAL SETTLE (Continuous Handheld Camera) ──
  let dwellIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (frame >= scenes[i].startFrame) {
      dwellIndex = i;
    }
  }

  const currentScene = scenes[dwellIndex];
  const currentNode = nodePositions[dwellIndex] || nodePositions[0];
  const sceneStart = currentScene.startFrame;
  const sceneDuration = Math.max(1, currentScene.durationFrames);
  const localFrame = Math.max(0, frame - sceneStart);

  // Recoil bounce after landing (damped harmonic recoil settle in first 12 frames)
  let settleOffsetX = 0;
  let settleOffsetY = 0;

  if (dwellIndex > 0 && localFrame < SETTLE_WINDOW) {
    const prevNode = nodePositions[dwellIndex - 1] || currentNode;
    const prevDeltaX = currentNode.x - prevNode.x;
    const prevDeltaY = currentNode.y - prevNode.y;
    const prevDist = Math.sqrt(prevDeltaX * prevDeltaX + prevDeltaY * prevDeltaY);
    const prevUnitX = prevDist > 0 ? prevDeltaX / prevDist : 0;
    const prevUnitY = prevDist > 0 ? prevDeltaY / prevDist : 1;

    const s = localFrame / SETTLE_WINDOW;
    // Damped harmonic oscillation: overshoots forward slightly and gently settles to rest
    const recoilMagnitude = Math.sin((1 - s) * Math.PI) * Math.exp(-s * 3.5) * 16;
    settleOffsetX = prevUnitX * recoilMagnitude;
    settleOffsetY = prevUnitY * recoilMagnitude;
  }

  // Continuous, slow authoritative push into the document (1.00 -> 1.035)
  const holdProgress = Math.min(1, localFrame / sceneDuration);
  const zoom = 1.00 + holdProgress * 0.035;

  // Handheld organic drift (smoothly eases out in the 6 frames before next flight)
  const nextSceneStart =
    dwellIndex < scenes.length - 1 ? scenes[dwellIndex + 1].startFrame : Infinity;
  const framesUntilNextFlight = (nextSceneStart - FLIGHT_WINDOW) - frame;

  let driftWeight = Math.min(1, localFrame / 10);
  if (framesUntilNextFlight < 6 && framesUntilNextFlight >= 0) {
    driftWeight *= framesUntilNextFlight / 6;
  }

  const driftX = (Math.sin(frame * 0.075) * 5.0 + Math.cos(frame * 0.032) * 2.5) * driftWeight;
  const driftY = (Math.cos(frame * 0.065) * 4.0 + Math.sin(frame * 0.038) * 2.0) * driftWeight;
  const driftRoll = (Math.sin(frame * 0.048) * 0.22) * driftWeight;

  return {
    camX: currentNode.x + settleOffsetX + driftX,
    camY: currentNode.y + settleOffsetY + driftY,
    camZ: 0,
    zoom,
    pitch: 1.2,
    yaw: -0.4,
    roll: driftRoll,
    activeSceneIndex: dwellIndex,
    isTransitioning: false,
    transitionProgress: 0,
    targetSceneIndex: dwellIndex,
    motionBlurPx: 0,
  };
}
