"use client";

import React from "react";
import { Composition } from "remotion";
import "./utils/fonts";
import { BlockbusterNetflixReel } from "./BlockbusterNetflixReel";
import { executionPlan } from "./data/execution-plan";

import { Template18SaaSHero } from "./templates/Template18SaaSHero";
import { Template19VisualMetaphors } from "./templates/Template19VisualMetaphors";
import { Template20DataVizSuite } from "./templates/Template20DataVizSuite";
import { Template21EvidenceBoard } from "./templates/Template21EvidenceBoard";
import { Template22KineticTypography } from "./templates/Template22KineticTypography";



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

      {/* ── ISOLATED SAAS PRODUCT DEMO TEST COMPOSITION ── */}
      <Composition<any, any>
        id="SaaSHeroTest"
        component={Template18SaaSHero}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: executionPlan.scenes[0],
          theme: undefined,
        }}
      />

      {/* ── DOCUMENTARY VISUAL METAPHOR TEST COMPOSITIONS ── */}
      <Composition<any, any>
        id="MetaphorScaleTest"
        component={Template19VisualMetaphors}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "THE $14M TECHNICAL DEBT TRAP",
            narrationLine: "Every shortcut added interest until the cost of debt outweighed the entire business value.",
            visualType: "balance_scale",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="MetaphorFunnelTest"
        component={Template19VisualMetaphors}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "THE MASSIVE CHURN LEAK",
            narrationLine: "One hundred thousand visitors entered the top of the funnel, but eighty-eight percent leaked out.",
            visualType: "leaking_funnel",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="MetaphorVaultTest"
        component={Template19VisualMetaphors}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "MAXIMUM PERIMETER SECURITY",
            narrationLine: "Every customer database was locked down inside an air-gapped cryptographic vault.",
            visualType: "vault_shield",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="MetaphorSpeedometerTest"
        component={Template19VisualMetaphors}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "REDLINE ENGINE BENCHMARK",
            narrationLine: "The servers revved past ten thousand requests per second, straight into the danger zone.",
            visualType: "speedometer",
          } as any,
          theme: undefined,
        }}
      />

      {/* ── ADVANCED DATA VISUALIZATION TEST COMPOSITIONS ── */}
      <Composition<any, any>
        id="DataVizSplineTest"
        component={Template20DataVizSuite}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "NVIDIA $3 TRILLION SURGE",
            narrationLine: "In less than twenty-four months, market valuation surged past three trillion dollars.",
            visualType: "spline_area_chart",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="DataVizDonutTest"
        component={Template20DataVizSuite}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "THE 92% TSMC MONOPOLY",
            narrationLine: "TSMC secretly manufactures ninety-two percent of all advanced microchips on earth.",
            visualType: "radial_donut_progress",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="DataVizMatrixTest"
        component={Template20DataVizSuite}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "THE STREAMING SHOWDOWN",
            narrationLine: "Netflix eliminated every single bottleneck while traditional stores piled on late fees.",
            visualType: "comparison_matrix",
          } as any,
          theme: undefined,
        }}
      />

      {/* ── TACTILE DOCUMENTARY CONSPIRACY BOARD TEST COMPOSITION ── */}
      <Composition<any, any>
        id="EvidenceBoardTest"
        component={Template21EvidenceBoard}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneTitle: "THE SECRET PAPER TRAIL",
            narrationLine: "Investigators followed the money from the shell corporation straight to the secret Swiss account.",
            visualType: "conspiracy_evidence_board",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="KineticTypographyTest"
        component={Template22KineticTypography}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scene: {
            ...executionPlan.scenes[0],
            sceneIndex: 1,
            sceneTitle: "THE UNSEALED INDICTMENT",
            narrationLine: "Federal prosecutors unsealed the 400-page indictment revealing secret offshore accounts.",
            visualType: "kinetic_typography_marquee",
          } as any,
          theme: undefined,
        }}
      />

      <Composition<any, any>
        id="SafeZoneOverlayTest"
        component={BlockbusterNetflixReel}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          enableLoop: true,
          showSafeZones: true,
        }}
      />
    </>
  );
};



