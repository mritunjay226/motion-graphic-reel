"use client";

import React, { useMemo } from "react";
import { Sequence, Audio } from "remotion";
import type { Scene, AudioPipeline, SfxEvent } from "../types";
import { computeSceneTactileCues, getSfxUrl, SFX_CATALOG, type SfxSoundId, type ComputedSfxCue } from "../utils/sfxRegistry";

export interface TactileSfxLayerProps {
  scenes: Scene[];
  audioPipeline?: AudioPipeline;
  sfxVolume?: number;
  enableAudio?: boolean;
  enableSfx?: boolean;
}

interface MergedSfxCue {
  id: string;
  soundId: SfxSoundId;
  url: string;
  frame: number;
  durationFrames: number;
  volume: number;
  label: string;
}

/**
 * TactileSfxLayer renders frame-accurate, velocity-matched Foley sound effects
 * directly synchronized with visual animations (paper rips, rubber stamps, polaroid shutters,
 * highlighter pen sweeps, cash registers, coin clinks, and sub-bass impacts).
 *
 * Includes automatic spatial deduplication to guarantee sounds never clash or play randomly.
 */
export const TactileSfxLayer: React.FC<TactileSfxLayerProps> = ({
  scenes,
  audioPipeline,
  sfxVolume = 1.0,
  enableAudio = true,
  enableSfx = true,
}) => {
  if (!enableAudio || !enableSfx || !scenes || scenes.length === 0) {
    return null;
  }

  // 1. Compute frame-accurate scene Foley cues
  const sceneCues = useMemo(() => {
    return scenes.flatMap((sc, idx) => computeSceneTactileCues(sc, idx, scenes.length));
  }, [scenes]);

  // 2. Extract and sanitize custom execution plan events
  const customEvents = useMemo(() => {
    if (!audioPipeline?.sfxEvents || !Array.isArray(audioPipeline.sfxEvents)) {
      return [];
    }

    // Filter out mock/fake placeholder URLs
    return audioPipeline.sfxEvents
      .filter((ev: SfxEvent) => typeof ev.frame === "number" && ev.frame >= 0)
      .map((ev: SfxEvent, i: number) => {
        let soundId: string = ev.type || "tactile_pop";
        if (soundId === "pop_in" || soundId === "pop_crisp") soundId = "tactile_pop";
        if (soundId === "whoosh" || soundId === "whoosh_heavy") soundId = "whip_whoosh";
        if (soundId === "whip_transition") soundId = "whip_whoosh";
        if (soundId === "boom_impact" || soundId === "boom_cinematic") soundId = "cinematic_sub_boom";
        if (soundId === "slam_impact") soundId = "rubber_stamp";
        if (soundId === "deep_riser") soundId = "tension_riser";
        if (soundId === "shimmer") soundId = "success_chime";
        if (soundId === "laugh_sfx") soundId = "record_scratch";

        const finalUrl = (ev.sfxUrl && !ev.sfxUrl.includes("cdn.saas.com"))
          ? getSfxUrl(ev.sfxUrl)
          : getSfxUrl(soundId);

        return {
          id: `custom-sfx-${i}-${ev.frame}`,
          soundId: soundId as SfxSoundId,
          url: finalUrl,
          frame: ev.frame,
          durationFrames: 24,
          volume: ev.volume ?? 0.25,
          label: `Custom SFX: ${ev.type || soundId}`,
        };
      });
  }, [audioPipeline?.sfxEvents]);

  // 3. Merge and deduplicate cues (prevents double-firing identical sounds within 4 frames)
  const masterTimelineCues = useMemo(() => {
    const rawList: MergedSfxCue[] = [];

    // Add all auto-generated scene cues
    sceneCues.forEach((c) => {
      rawList.push({
        id: c.id,
        soundId: c.soundId,
        url: getSfxUrl(c.soundId),
        frame: c.frame,
        durationFrames: c.durationFrames,
        volume: c.volume,
        label: c.label,
      });
    });

    // Add non-redundant custom cues
    customEvents.forEach((ce) => {
      const isDuplicate = rawList.some(
        (existing) => existing.soundId === ce.soundId && Math.abs(existing.frame - ce.frame) <= 4
      );
      if (!isDuplicate) {
        rawList.push(ce);
      }
    });

    // Sort chronologically by timeline frame
    rawList.sort((a, b) => a.frame - b.frame);

    // Filter duplicates within a 3-frame window of the exact same soundId
    const deduplicated: MergedSfxCue[] = [];
    rawList.forEach((cue) => {
      const alreadyHas = deduplicated.some(
        (d) => d.soundId === cue.soundId && Math.abs(d.frame - cue.frame) <= 3
      );
      if (!alreadyHas) {
        deduplicated.push(cue);
      }
    });

    // Limiter: Maximum 3 concurrent active Foley cues per 2-frame window to guarantee clean mix headroom
    const finalCues: MergedSfxCue[] = [];
    deduplicated.forEach((cue) => {
      const concurrentCount = finalCues.filter(
        (existing) => Math.abs(existing.frame - cue.frame) <= 2
      ).length;
      if (concurrentCount < 3) {
        finalCues.push(cue);
      }
    });

    return finalCues;
  }, [sceneCues, customEvents]);

  return (
    <React.Fragment>
      {masterTimelineCues.map((cue) => {
        const calibratedVolume = Math.min(1.0, Math.max(0, cue.volume * sfxVolume));

        return (
          <Sequence
            key={cue.id}
            from={cue.frame}
            durationInFrames={cue.durationFrames}
            name={`FOLEY: ${cue.label}`}
            layout="none"
          >
            <Audio
              src={cue.url}
              volume={calibratedVolume}
            />
          </Sequence>
        );
      })}
    </React.Fragment>
  );
};
