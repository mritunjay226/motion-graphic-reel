import React from "react";
import { Freeze, useCurrentFrame, Composition } from "remotion";
import { renderStill } from "@remotion/renderer";

const TestComponent = () => {
  const frame = useCurrentFrame();
  return <div id="test">Current frame is {frame}</div>;
};

const Wrapper = ({ globalFrame }: { globalFrame: number }) => {
  const sceneStart = 150;
  const sceneDuration = 120;
  const localFrame = Math.max(0, Math.min(sceneDuration, globalFrame - sceneStart));

  return (
    <Freeze frame={localFrame} active={true}>
      <TestComponent />
    </Freeze>
  );
};

console.log("Freeze test loaded successfully!");
