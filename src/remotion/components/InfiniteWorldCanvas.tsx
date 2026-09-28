import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, Freeze } from "remotion";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";
import { getLayoutTemplate } from "../templates/layouts";
import {
  getNodeWorldCoordinates,
  computeCameraFlightState,
  NodeSpatialPosition,
} from "../utils/cameraFlight";
import { SpatialWorldNode } from "./SpatialWorldNode";

export interface InfiniteWorldCanvasProps {
  scenes: Scene[];
  theme?: VideoTheme;
  canvasBg?: string;
  enableConnectors?: boolean;
  enableLoop?: boolean;
}

/**
 * InfiniteWorldCanvas
 *
 * True Infinite Spatial Canvas & Global Camera Flight Engine (Johnny Harris / Vox / MagnatesMedia).
 *
 * Architecture:
 * 1. World Coordinate Plane: 10,000px x 14,000px physical investigative desk surface.
 * 2. Continuous Camera Flight: Moves smoothly across the desk from document to document.
 * 3. Real Catenary Red Yarn Connectors: Physically connects evidence pins in world space.
 * 4. Ambient Blueprint/Parchment Grid: Coordinate ticks and crosshairs spanning the universe.
 */
export const InfiniteWorldCanvas: React.FC<InfiniteWorldCanvasProps> = ({
  scenes,
  theme,
  canvasBg = "#FAF8F2",
  enableConnectors = true,
  enableLoop = false,
}) => {
  const frame = useCurrentFrame();

  // 1. Calculate deterministic world positions for all scenes
  const nodePositions = useMemo(() => getNodeWorldCoordinates(scenes), [scenes]);

  // 2. Compute camera flight state for current frame
  const camera = computeCameraFlightState(frame, scenes, nodePositions, enableLoop);

  const screenCenterX = 1080 / 2;
  const screenCenterY = 1920 / 2;

  // Camera world transform:
  // Maps the active camera coordinate directly to the screen center with 3D banking, pitch, and altitude zoom
  const cameraTransform = `
    translate3d(${screenCenterX}px, ${screenCenterY}px, 0px)
    rotateX(${camera.pitch.toFixed(3)}deg)
    rotateY(${camera.yaw.toFixed(3)}deg)
    rotateZ(${camera.roll.toFixed(3)}deg)
    scale(${camera.zoom.toFixed(4)})
    translate3d(${(-camera.camX - screenCenterX).toFixed(2)}px, ${(-camera.camY - screenCenterY).toFixed(2)}px, 0px)
  `;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: canvasBg,
        perspective: "1400px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* ── 3D GLOBAL CAMERA WORLD STAGE ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "1080px",
          height: "1920px",
          transformOrigin: "0 0",
          transform: cameraTransform,
          transformStyle: "preserve-3d",
          filter: camera.motionBlurPx > 0.15 ? `blur(${camera.motionBlurPx.toFixed(2)}px)` : undefined,
          willChange: "transform, filter",
        }}
      >
        {/* ── AMBIENT INVESTIGATIVE DESK BACKGROUND PLANE & GRID ── */}
        <div
          style={{
            position: "absolute",
            left: "-4000px",
            top: "-3000px",
            width: "10000px",
            height: "14000px",
            backgroundColor: canvasBg,
            backgroundImage: `
              radial-gradient(circle, rgba(30, 41, 59, 0.16) 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(30, 41, 59, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(30, 41, 59, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px, 300px 300px, 300px 300px",
            pointerEvents: "none",
          }}
        />

        {/* ── SPATIAL EVIDENCE CONNECTORS (CONSPIRACY RED YARN) ── */}
        {enableConnectors && (
          <svg
            style={{
              position: "absolute",
              left: "-4000px",
              top: "-3000px",
              width: "10000px",
              height: "14000px",
              overflow: "visible",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            {nodePositions.map((pos, i) => {
              if (i === nodePositions.length - 1) return null;
              const nextPos = nodePositions[i + 1];

              // Offsets relative to the SVG top-left origin (-4000, -3000)
              const svgOffsetX = 4000;
              const svgOffsetY = 3000;

              // Pin location on card: top center (X + 540, Y + 28)
              const x1 = pos.x + 540 + svgOffsetX;
              const y1 = pos.y + 28 + svgOffsetY;
              const x2 = nextPos.x + 540 + svgOffsetX;
              const y2 = nextPos.y + 28 + svgOffsetY;

              // Realistic catenary curve dip (slight gravity sag)
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 + 100;

              const pathData = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

              return (
                <g key={`connector-${i}`}>
                  {/* Drop shadow on desk surface */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ transform: "translate(10px, 20px)" }}
                  />
                  {/* Primary crimson red yarn thread */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="8 2"
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* ── SPATIAL DOCUMENT NODES (ALL SCENES PERSISTENTLY PINNED TO THE DESK) ── */}
        {scenes.map((scene, i) => {
          const pos = nodePositions[i];
          if (!pos) return null;

          const LayoutTemplate = getLayoutTemplate(scene, scene.sceneId);

          const isCurrentActive =
            camera.isTransitioning
              ? camera.targetSceneIndex === i || camera.activeSceneIndex === i
              : camera.activeSceneIndex === i;
          const isNextOrPrev =
            camera.activeSceneIndex === i - 1 || camera.activeSceneIndex === i + 1;

          // Local frame progression inside the document:
          // Before scene startFrame: frozen at frame 0 (resting pristine on desk)
          // During scene: 0 to scene.durationFrames (kinetic elements & captions animate live)
          // After scene ends: frozen at scene.durationFrames (stamped, highlighted, completed document)
          const isBeforeScene = frame < scene.startFrame;
          const isAfterScene = frame >= scene.startFrame + scene.durationFrames;
          const localFrame = isBeforeScene
            ? 0
            : isAfterScene
            ? scene.durationFrames
            : frame - scene.startFrame;

          return (
            <SpatialWorldNode
              key={`spatial-node-${scene.sceneId}`}
              position={pos}
              isActive={isCurrentActive}
              isNextOrPrev={isNextOrPrev}
            >
              <Freeze frame={localFrame} active={true}>
                <div style={{ width: "1080px", height: "1920px", position: "relative" }}>
                  <LayoutTemplate scene={scene} theme={theme} />
                </div>
              </Freeze>
            </SpatialWorldNode>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
