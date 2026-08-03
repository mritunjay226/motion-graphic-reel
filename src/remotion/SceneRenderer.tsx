"use client";

import React from "react";
import { AbsoluteFill, Audio } from "remotion";
import type { Scene } from "./types";
import type { VideoTheme } from "./utils/themes";
import { ParallaxLayer } from "./components/ParallaxLayer";
import { OverlayFx } from "./components/OverlayFx";
import { ProjectedShadow } from "./components/ProjectedShadow";
import { CharacterBoil } from "./components/CharacterBoil";
import { SpringEntrance } from "./components/SpringEntrance";
import { ImageKitAsset } from "./components/ImageKitAsset";
import { PropAnimator } from "./components/PropAnimator";
import { WordByWordCaptions } from "./components/WordByWordCaptions";
import { TransitionEffect } from "./components/TransitionEffect";
import { SwingingOverheadLamp } from "./components/SwingingOverheadLamp";

interface SceneRendererProps {
  scene: Scene;
  voiceId?: string;
  theme?: VideoTheme;
  enableAudio?: boolean;
}

/**
 * SceneRenderer orchestrates the layer hierarchy for a single scene:
 * Non-blocking Audio Track (pauseWhenBuffering={false})
 * Layer 1: Background (Parallax Layer + Theme Color Filter)
 * Layer 2: Atmospheric Overlay FX
 * Layer 3: Dynamic Projected Floor Shadow
 * Layer 4: Foreground Subject (Character Boil + Spring Entrance)
 * Layer 5: Non-blocking Prop Animations
 * Layer 6: Legible Kinetic Captions with Theme Palette
 * Layer 7: Frame-Accurate Scene Transitions
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  voiceId = "5ee9feff-1265-424a-9d7f-8e4d431a12c7",
  theme,
  enableAudio = false,
}) => {
  const {
    startFrame,
    durationFrames,
    imageKitUrls,
    animationRules,
    whisperTokens,
    kineticCaptions,
    narrationLine,
  } = scene;

  // Auto-generate Cartesia AI TTS audio stream URL for this scene's narration line
  const narrationAudioUrl = `/api/tts?text=${encodeURIComponent(
    narrationLine
  )}&voiceId=${voiceId}`;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Optional Cartesia Voice Track (configured with pauseWhenBuffering={false} so network audio never freezes video playback) */}
      {enableAudio && narrationLine && (
        <Audio
          src={narrationAudioUrl}
          volume={1.0}
          pauseWhenBuffering={false}
          acceptableTimeDifferenceInSeconds={1.5}
        />
      )}

      {/* Layer 1: Background (Parallax Zoom + Theme Filter) */}
      <ParallaxLayer
        backgroundUrl={imageKitUrls.background}
        backgroundMotion={animationRules.backgroundMotion}
        sceneStartFrame={startFrame}
        sceneDurationFrames={durationFrames}
        themeFilter={theme?.filter}
      >
        {/* Layer 2: Overlay FX */}
        {animationRules.overlayFx && (
          <OverlayFx config={animationRules.overlayFx} />
        )}

        {/* Vox Signature Swinging Overhead Lamp & Flickering Desk Light */}
        {(scene.sceneId === 5 || animationRules.overlayFx?.type === "flickering_light") && (
          <SwingingOverheadLamp />
        )}

        {/* Layer 3: Projected Shadow */}
        {animationRules.projectedShadow?.enabled && (
          <ProjectedShadow
            config={animationRules.projectedShadow}
            foregroundUrl={imageKitUrls.foreground}
          />
        )}

        {/* Layer 4: Foreground Subject (Center-Bottom Alignment) */}
        {imageKitUrls.foreground && (
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: theme?.filter || undefined,
              zIndex: 10,
            }}
          >
            <SpringEntrance
              config={animationRules.foregroundMotion.entrance}
              sceneStartFrame={startFrame}
            >
              <CharacterBoil config={animationRules.foregroundMotion.boil}>
                <ImageKitAsset
                  src={imageKitUrls.foreground}
                  objectFit="contain"
                  style={{
                    maxHeight: "75%",
                    maxWidth: "75%",
                    margin: "auto",
                  }}
                />
              </CharacterBoil>
            </SpringEntrance>
          </AbsoluteFill>
        )}

        {/* Layer 5: Non-blocking Prop Animations */}
        {imageKitUrls.props?.map((propUrl, idx) => {
          const propAnimConfig = animationRules.propsAnimations?.find(
            (p) => p.propIndex === idx
          ) ?? {
            propIndex: idx,
            motion: "gentle_float",
            startFrame: startFrame + 10,
          };

          return (
            <PropAnimator
              key={`prop-${idx}`}
              propUrl={propUrl}
              config={propAnimConfig}
              sceneStartFrame={startFrame}
            />
          );
        })}

        {/* Layer 6: Legible Kinetic Captions with Theme Styling */}
        {whisperTokens && whisperTokens.length > 0 && (
          <WordByWordCaptions
            tokens={whisperTokens}
            config={kineticCaptions}
            sceneStartFrame={startFrame}
            themeFontFamily={theme?.fontFamily}
            themeTextColor={theme?.captionTextColor}
            themeHighlightColor={theme?.captionHighlightColor}
            themeHighlightBg={theme?.captionHighlightBg}
            themeShadowColor={theme?.captionShadowColor}
          />
        )}

        {/* Layer 7: Transition Out */}
        {animationRules.transitionOut && (
          <TransitionEffect
            config={animationRules.transitionOut}
            sceneStartFrame={startFrame}
          />
        )}
      </ParallaxLayer>
    </AbsoluteFill>
  );
};
