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
        durationInFrames={projectMeta.totalDurationFrames || 900}
        fps={projectMeta.fps || 30}
        width={projectMeta.width || 1080}
        height={projectMeta.height || 1920}
        defaultProps={{}}
        calculateMetadata={({ props }: { props: any }) => {
          const plan = props?.plan || executionPlan;
          const scenes = plan?.scenes || [];
          const calculatedFrames = scenes.reduce(
            (acc: number, sc: any) => Math.max(acc, (sc.startFrame || 0) + (sc.durationFrames || 0)),
            0
          );
          const finalDuration = calculatedFrames > 0 ? calculatedFrames : (plan?.projectMeta?.totalDurationFrames || 900);

          return {
            durationInFrames: finalDuration,
            fps: plan?.projectMeta?.fps || 30,
            width: plan?.projectMeta?.width || 1080,
            height: plan?.projectMeta?.height || 1920,
          };
        }}
      />
    </>
  );
};
