"use client";

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { executionPlan as defaultPlan } from "./data/execution-plan";
import type { ExecutionPlan } from "./types";
import { SceneRenderer } from "./SceneRenderer";
import { FilmTreatment } from "./components/FilmTreatment";
import { VIDEO_THEMES, DEFAULT_THEME_ID } from "./utils/themes";

export interface BlockbusterNetflixReelProps {
  plan?: ExecutionPlan;
  voiceId?: string;
  themeId?: string;
}

/**
 * Main Remotion composition component for the 2.5D documentary reel.
 * Sequentially renders each scene with auto-attached Cartesia voice audio,
 * dynamic Video Theme color grading & typography, and wraps the output in
 * the global <FilmTreatment /> overlay (The "Texture Sandwich").
 */
export const BlockbusterNetflixReel: React.FC<BlockbusterNetflixReelProps> = ({
  plan = defaultPlan,
  voiceId = "5ee9feff-1265-424a-9d7f-8e4d431a12c7",
  themeId = DEFAULT_THEME_ID,
}) => {
  const activePlan = plan || defaultPlan;
  const activeTheme = VIDEO_THEMES[themeId] || VIDEO_THEMES[DEFAULT_THEME_ID];
  const { scenes, filmTreatment } = activePlan;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Scene Sequence Stack */}
      {scenes.map((scene) => (
        <Sequence
          key={`scene-${scene.sceneId}`}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={scene.sceneTitle}
        >
          <SceneRenderer scene={scene} voiceId={voiceId} theme={activeTheme} />
        </Sequence>
      ))}

      {/* Global Cinematic Film Treatment Overlay ("Texture Sandwich") */}
      <FilmTreatment config={filmTreatment} theme={activeTheme} />
    </AbsoluteFill>
  );
};
