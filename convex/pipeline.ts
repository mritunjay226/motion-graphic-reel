import { action, mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Convex One-Shot Voiceover & Timestamp Pipeline
 */

/**
 * Internal query to fetch a reel doc for pipeline actions.
 */
export const getReelInternal = internalQuery({
  args: { reelId: v.id("reels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reelId);
  },
});

/**
 * Internal mutation to save master fullVoiceoverUrl.
 */
export const updateFullVoiceoverInternal = internalMutation({
  args: {
    reelId: v.id("reels"),
    fullVoiceoverUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      fullVoiceoverUrl: args.fullVoiceoverUrl,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Internal mutation to save masterWhisperTokens.
 */
export const updateMasterTokensInternal = internalMutation({
  args: {
    reelId: v.id("reels"),
    masterWhisperTokens: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      masterWhisperTokens: args.masterWhisperTokens,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Action: Synthesizes full script as ONE continuous voiceover audio file.
 */
export const generateFullVoiceover = action({
  args: {
    reelId: v.id("reels"),
    voiceId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ masterScript: string; audioUrl: string }> => {
    const reel = await ctx.runQuery((internal as any).pipeline.getReelInternal, { reelId: args.reelId });

    if (!reel) {
      throw new Error(`Reel ${args.reelId} not found`);
    }

    // Combine all storyboard scene narrations into one master script
    const masterScript = (reel.storyboard || [])
      .map((scene: { narration: string }) => scene.narration.trim())
      .join(" ");

    const selectedVoiceId = args.voiceId || "5ee9feff-1265-424a-9d7f-8e4d431a12c7";

    // Call TTS API endpoint (e.g. Cartesia or ElevenLabs or internal TTS service)
    const ttsResponse = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CARTESIA_API_KEY || "",
        "Cartesia-Version": "2024-06-10",
      },
      body: JSON.stringify({
        model_id: "sonic-3",
        transcript: masterScript,
        voice: {
          mode: "id",
          id: selectedVoiceId,
        },
        output_format: {
          container: "mp3",
          bit_rate: 128000,
          sample_rate: 44100,
        },
      }),
    }).catch(() => null);

    let audioUrl = "";

    if (ttsResponse && ttsResponse.ok) {
      const blob = await ttsResponse.blob();
      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);
      audioUrl = url || "";
    } else {
      // Fallback: build TTS proxy URL for continuous stream
      audioUrl = `/api/tts?text=${encodeURIComponent(masterScript)}&voiceId=${selectedVoiceId}`;
    }

    // Update reel record with master fullVoiceoverUrl
    await ctx.runMutation((internal as any).pipeline.updateFullVoiceoverInternal, {
      reelId: args.reelId,
      fullVoiceoverUrl: audioUrl,
    });

    return { masterScript, audioUrl };
  },
});

/**
 * Action: Run Deepgram forced alignment on the master voiceover audio to extract word timestamps.
 */
export const extractMasterTimestamps = action({
  args: {
    reelId: v.id("reels"),
    audioUrl: v.string(),
  },
  handler: async (ctx, args): Promise<any[]> => {
    const deepgramKey = process.env.DEEPGRAM_API_KEY;

    let masterTokens: Array<{
      word: string;
      startMs: number;
      endMs: number;
      startFrame: number;
      endFrame: number;
    }> = [];

    if (deepgramKey) {
      const dgResponse = await fetch(
        "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${deepgramKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: args.audioUrl }),
        }
      ).catch(() => null);

      if (dgResponse && dgResponse.ok) {
        const dgData = await dgResponse.json();
        const words =
          dgData.results?.channels?.[0]?.alternatives?.[0]?.words || [];

        masterTokens = words.map((w: any) => {
          const startMs = Math.round(w.start * 1000);
          const endMs = Math.round(w.end * 1000);
          const startFrame = Math.floor((w.start * 30));
          const endFrame = Math.ceil((w.end * 30));
          return {
            word: w.punctuated_word || w.word,
            startMs,
            endMs,
            startFrame,
            endFrame,
          };
        });
      }
    }

    // Fallback: If Deepgram is offline or not configured, generate linear frame estimates
    if (masterTokens.length === 0) {
      const reel = await ctx.runQuery((internal as any).pipeline.getReelInternal, { reelId: args.reelId });
      if (reel) {
        let currentFrame = 0;
        (reel.storyboard || []).forEach((sc: { narration: string }) => {
          const words = sc.narration.split(/\s+/).filter(Boolean);
          const framesPerWord = 6;
          words.forEach((w: string) => {
            const startFrame = currentFrame;
            const endFrame = currentFrame + framesPerWord;
            masterTokens.push({
              word: w,
              startMs: Math.round((startFrame / 30) * 1000),
              endMs: Math.round((endFrame / 30) * 1000),
              startFrame,
              endFrame,
            });
            currentFrame += framesPerWord;
          });
        });
      }
    }

    // Update reel with masterWhisperTokens
    await ctx.runMutation((internal as any).pipeline.updateMasterTokensInternal, {
      reelId: args.reelId,
      masterWhisperTokens: masterTokens,
    });

    return masterTokens;
  },
});

/**
 * Mutation: Segment master timestamps into scene time windows and assign Remocn templates.
 */
export const segmentAndAssignRemocnTemplates = mutation({
  args: {
    reelId: v.id("reels"),
  },
  handler: async (ctx, args) => {
    const reel = await ctx.db.get(args.reelId);
    if (!reel || !reel.storyboard) return;

    const masterTokens = (reel.masterWhisperTokens as any[]) || [];
    let currentFrameAcc = 0;
    let tokenIndex = 0;

    const updatedStoryboard = reel.storyboard.map((scene: any, idx: number) => {
      const sceneWords = scene.narration.split(/\s+/).filter(Boolean);
      const sceneTokens: any[] = [];

      for (let i = 0; i < sceneWords.length && tokenIndex < masterTokens.length; i++) {
        sceneTokens.push(masterTokens[tokenIndex]);
        tokenIndex++;
      }

      const startFrame = currentFrameAcc;
      let durationFrames = 150;

      if (sceneTokens.length > 0) {
        const firstStart = sceneTokens[0]?.startFrame || 0;
        const lastEnd = sceneTokens[sceneTokens.length - 1]?.endFrame || (firstStart + 120);
        durationFrames = Math.max(135, lastEnd - firstStart + 15);
      } else {
        durationFrames = Math.max(135, Math.ceil(sceneWords.length * 5.5) + 20);
      }

      currentFrameAcc += durationFrames;
      const endFrame = startFrame + durationFrames;

      // Available Remocn layout presets
      const remocnPresets = [
        "matrix_scramble_hacker",
        "bento_grid_showcase",
        "ecosystem_integration_hub",
        "handwritten_roadmap_checklist",
        "editorial_strikethrough_swap",
        "center_hero_cutout",
        "infographic_bar_chart",
        "revenue_stat_trend",
      ];

      const assignedLayout = scene.visualType || remocnPresets[idx % remocnPresets.length];

      return {
        ...scene,
        whisperTokens: sceneTokens,
        visualType: assignedLayout,
        startFrame,
        endFrame,
        durationFrames,
      };
    });

    await ctx.db.patch(args.reelId, {
      storyboard: updatedStoryboard as any,
      updatedAt: Date.now(),
    });

    return updatedStoryboard;
  },
});
