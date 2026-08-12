"use client";

import React from "react";
import { Composition } from "remotion";
import "./utils/fonts";
import { BlockbusterNetflixReel } from "./BlockbusterNetflixReel";
import { executionPlan } from "./data/execution-plan";

export const Root: React.FC = () => {
  const { projectMeta } = executionPlan;

  return (
    <>
      <Composition
        id="BlockbusterNetflixReel"
        component={BlockbusterNetflixReel}
        durationInFrames={projectMeta.totalDurationFrames}
        fps={projectMeta.fps}
        width={projectMeta.width}
        height={projectMeta.height}
        defaultProps={{}}
      />
    </>
  );
};
