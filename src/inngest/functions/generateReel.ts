import { inngest } from "../client";
import { generateLLMStoryboard } from "@/lib/llm-storyboard";
import { transcribeAudioWithDeepgram } from "@/lib/deepgram";
import { uploadAudioToCloudinary } from "@/lib/cloudinary";
import { generateGeminiImage } from "@/lib/gemini-image";
import { fetchRealWorldAssetImage } from "@/lib/web-asset-fetcher";
import { generateSvgVectorStickerUrl } from "@/remotion/utils/vector-assets";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

// Base URL for absolute TTS audio URLs
const APP_URL = process.env.NEXT_PUBLIC_APP_URL 
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/**
 * Inngest Step-Function: Full 2.5D Vox Video Generation Pipeline with Strict Error Synchronization.
 *
 * Steps:
 * 1. Script Generation — Google Gemini 2.5 Director generates 6-scene documentary script & event timelines
 * 2. Image Prompt Collection — Single-subject cutout & event asset prompts
 * 3. Audio TTS Generation — Cartesia AI voice narration & Cloudinary CDN Upload
 * 4. Caption Transcription — Deepgram Nova-2 word-level tokens
 * 5. Image Generation — Google Gemini 2.5 Flash Image & ImageKit AI BG Removal
 * 6. Convex DB Sync — Assemble full storyboard & events and persist to database
 */
export const generateReelPipeline = (inngest.createFunction as any)(
  {
    id: "generate-reel-pipeline",
    name: "Generate 2.5D Vox Reel Pipeline",
    retries: 2,
    triggers: [{ event: "reel/generate.requested" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { reelId, userId, topic, voiceId, language = "en" } = event.data;

    try {
      // ─── Step 1: Script & Storyboard Generation via Gemini 2.5 ─────────
      const scriptScenes = await step.run("1-generate-script", async () => {
        console.log(`[Step 1] Generating LLM script via Gemini 2.5 for (${language}): "${topic}"`);
        try {
          return await generateLLMStoryboard(topic, language);
        } catch (err: any) {
          console.error(`[Step 1 Error] Script generation failed:`, err.message);
          throw err;
        }
      });

      // ─── Step 2: Image Prompt Collection (Scene & Event Prompts) ────────
      const imagePrompts = await step.run("2-generate-image-prompts", async () => {
        console.log(`[Step 2] Collecting cutout & event asset prompts across timelines`);
        const prompts: { sceneId: number; eventId?: string; prompt: string; removeBg: boolean }[] = [];

        scriptScenes.forEach((sc: any) => {
          if (sc.imagePrompt) {
            prompts.push({
              sceneId: sc.sceneId,
              prompt: sc.imagePrompt,
              removeBg: sc.removeBg ?? sc.isSingleSubject ?? true,
            });
          }
          if (sc.events && Array.isArray(sc.events)) {
            sc.events.forEach((ev: any) => {
              if (ev.imagePrompt) {
                prompts.push({
                  sceneId: sc.sceneId,
                  eventId: ev.id,
                  prompt: ev.imagePrompt,
                  removeBg: ev.removeBg ?? (ev.type === "sticker_cutout"),
                });
              }
            });
          }
        });

        return prompts;
      });

      // ─── Step 3: Audio TTS Generation & Cloudinary Upload ───────────────
      const audioData = await step.run("3-generate-audio-tts", async () => {
        console.log(`[Step 3] Generating Cartesia TTS master continuous voiceover & per-scene audio (${language})...`);
        const voice = voiceId || "62ae83ad-4f6a-430b-af41-a9bede9286ca";
        const results: { sceneId: number; narration: string; audioUrl: string }[] = [];
        let masterVoiceoverUrl = "";

        // 1. Synthesize Master Continuous Script for 100% Vocal Continuity
        const masterScript = scriptScenes.map((sc: any) => sc.narration.trim()).join(" ");
        try {
          const masterTtsRes = await fetch(`${APP_URL}/api/tts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: masterScript,
              voiceId: voice,
              modelId: "sonic-3",
              language,
            }),
          });

          if (masterTtsRes.ok) {
            const masterBuffer = Buffer.from(await masterTtsRes.arrayBuffer());
            const fileName = `master_voiceover_${Date.now()}.mp3`;
            masterVoiceoverUrl = await uploadAudioToCloudinary(masterBuffer, fileName, "vox-reels/audio");
            console.log(`[Step 3] ✅ Master continuous voiceover uploaded to Cloudinary: ${masterVoiceoverUrl}`);
          }
        } catch (masterErr: any) {
          console.warn(`[Step 3 Master Voiceover Warning] Failed to generate continuous master track:`, masterErr.message);
        }

        // 2. Synthesize Per-Scene Audio Chunks
        for (const sc of scriptScenes) {
          let audioUrl = "";
          try {
            const ttsRes = await fetch(`${APP_URL}/api/tts`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: sc.narration,
                voiceId: voice,
                modelId: "sonic-3",
                language,
              }),
            });

            if (ttsRes.ok) {
              const arrayBuffer = await ttsRes.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const fileName = `narration_sc_${sc.sceneId}_${Date.now()}.mp3`;

              audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
              console.log(`[Step 3] ✅ Scene ${sc.sceneId} audio uploaded to Cloudinary: ${audioUrl}`);
            }
          } catch (err: any) {
            console.warn(`[Step 3 Cloudinary Warning] Scene ${sc.sceneId} audio upload failed, fallback to local URL:`, err.message);
          }

          if (!audioUrl) {
            audioUrl = `${APP_URL}/api/tts?text=${encodeURIComponent(sc.narration)}&voiceId=${voice}&language=${language}`;
          }

          results.push({
            sceneId: sc.sceneId,
            narration: sc.narration,
            audioUrl,
          });
        }

        return { sceneResults: results, masterVoiceoverUrl };
      });

      // ─── Step 4: Caption Transcription via Deepgram Nova-2 ─────────────
      const captionsData = await step.run("4-deepgram-captions", async () => {
        console.log(`[Step 4] Generating Deepgram word-level captions (${language})`);
        const sceneAudios = audioData?.sceneResults || (Array.isArray(audioData) ? audioData : []);
        const masterVoiceoverUrl = audioData?.masterVoiceoverUrl || "";

        // 1. Per-scene caption tokens (scene-relative timestamps starting at 0ms each)
        const results: { sceneId: number; whisperTokens: any[] }[] = [];
        for (const sc of scriptScenes) {
          const audio = sceneAudios.find((a: any) => a.sceneId === sc.sceneId);
          const tokens = await transcribeAudioWithDeepgram(sc.narration, audio?.audioUrl, language);
          results.push({ sceneId: sc.sceneId, whisperTokens: tokens });
        }

        // 2. Master voiceover caption tokens (absolute timestamps across entire reel)
        let masterWhisperTokens: any[] = [];
        if (masterVoiceoverUrl) {
          try {
            const masterScript = scriptScenes.map((sc: any) => sc.narration.trim()).join(" ");
            masterWhisperTokens = await transcribeAudioWithDeepgram(masterScript, masterVoiceoverUrl, language);
            console.log(`[Step 4] ✅ Master voiceover transcribed: ${masterWhisperTokens.length} tokens`);
          } catch (masterErr: any) {
            console.warn(`[Step 4 Master Caption Warning] Falling back to per-scene tokens:`, masterErr.message);
          }
        }

        return { sceneResults: results, masterWhisperTokens };
      });

      // ─── Step 5: AI Image Generation (Gemini 2.5 Flash Image & Dynamic BG Removal) ───
      const imagesData = await step.run("5-generate-and-upload-images", async () => {
        console.log(`[Step 5] Generating AI images via Gemini 2.5 Flash Image for ${imagePrompts.length} prompts...`);
        const results: { sceneId: number; eventId?: string; imageUrl: string }[] = [];
        for (let i = 0; i < imagePrompts.length; i++) {
          const item = imagePrompts[i];
          let rawImageUrl = "";

          try {
            // First check if prompt is a real person, place, or logo from the web
            const webAssetUrl = await fetchRealWorldAssetImage(item.prompt);
            if (webAssetUrl) {
              rawImageUrl = webAssetUrl;
              console.log(`[Step 5 Web Fetcher] ✅ Using real-world web image for asset ${i + 1}: ${webAssetUrl}`);
            } else {
              rawImageUrl = await generateGeminiImage(item.prompt);
            }
          } catch (aiErr: any) {
            console.warn(`[Step 5 Gemini Image Warning] Asset ${i + 1} generation fallback to vector:`, aiErr.message);
            rawImageUrl = generateSvgVectorStickerUrl(item.prompt, `SCENE ${item.sceneId}`);
          }

          let finalUrl = "";

          try {
            const uploadRes = await fetch(`${APP_URL}/api/imagekit/upload`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: rawImageUrl,
                fileName: `asset_${item.sceneId}__${i}_${topic.replace(/\s+/g, "_").slice(0, 15)}.png`,
                folder: "/vox-reels",
                removeBg: item.removeBg,
              }),
            });

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData.url) {
                finalUrl = uploadData.url;
                console.log(`[Step 5] ✅ Asset ${i + 1} synced to ImageKit CDN: ${finalUrl.slice(0, 60)}...`);
              }
            }
          } catch (batchErr: any) {
            console.warn(`[Step 5 ImageKit Exception] Asset ${i + 1} upload error:`, batchErr.message);
          }

          if (!finalUrl) {
            finalUrl = rawImageUrl;
          }

          results.push({ sceneId: item.sceneId, eventId: item.eventId, imageUrl: finalUrl });
        }

        console.log(`[Step 5] ✅ All ${results.length} AI image assets generated and synced.`);
        return results;
      });

      // ─── Step 6: Assemble & Sync to Convex DB ──────────────────────────
      await step.run("6-convex-db-sync", async () => {
        console.log(`[Step 6] Assembling full storyboard & event timelines into Convex`);
        const sceneAudios = audioData?.sceneResults || (Array.isArray(audioData) ? audioData : []);
        const masterVoiceoverUrl = audioData?.masterVoiceoverUrl || "";
        const sceneCaptions = captionsData?.sceneResults || (Array.isArray(captionsData) ? captionsData : []);
        const masterWhisperTokens = captionsData?.masterWhisperTokens || [];

        // Compute 100% precise frame-locked scene boundaries from continuous master STT timestamps
        const masterTimings = computeMasterSceneTimings(scriptScenes, masterWhisperTokens);

        const fullStoryboard = scriptScenes.map((sc: any, idx: number) => {
          const audio = sceneAudios.find((a: any) => a.sceneId === sc.sceneId);
          const caption = sceneCaptions.find((c: any) => c.sceneId === sc.sceneId);
          const timing = masterTimings ? masterTimings[idx] : null;

          // Primary scene image
          const primaryImage = imagesData.find((img: any) => img.sceneId === sc.sceneId && !img.eventId);

          // Update event object image URLs
          const updatedEvents = (sc.events && Array.isArray(sc.events))
            ? sc.events.map((ev: any) => {
                const evImg = imagesData.find((img: any) => img.sceneId === sc.sceneId && img.eventId === ev.id);
                return {
                  ...ev,
                  imageUrl: evImg?.imageUrl || "",
                };
              })
            : [];

          return {
            sceneId: sc.sceneId,
            headline: sc.headline,
            subtitle: sc.subtitle || "",
            narration: sc.narration,
            imagePrompt: sc.imagePrompt || "",
            imageUrl: primaryImage?.imageUrl || "",
            audioUrl: audio?.audioUrl || "",
            isSingleSubject: true,
            whisperTokens: timing?.whisperTokens || caption?.whisperTokens || [],
            startFrame: timing?.startFrame,
            durationFrames: timing?.durationFrames,
            visualType: sc.visualType || "center_cutout_hero",
            gsapType: sc.gsapType || "grid_lines",
            entranceType: sc.entranceType || "slide_corner_bottom_left",
            events: updatedEvents,
          };
        });

        // Save storyboard + fullVoiceoverUrl + masterWhisperTokens in one call
        await convex.mutation(api.reels.updateReelStatus, {
          reelId: reelId as Id<"reels">,
          status: "completed",
          storyboard: fullStoryboard,
          fullVoiceoverUrl: masterVoiceoverUrl || undefined,
          masterWhisperTokens: masterWhisperTokens.length > 0 ? masterWhisperTokens : undefined,
        });

        console.log(`[Step 6] ✅ Reel ${reelId} completed: ${fullStoryboard.length} scenes, masterVoiceover: ${masterVoiceoverUrl ? 'YES' : 'NO'}, masterTokens: ${masterWhisperTokens.length}`);
      });

      return { status: "success", reelId, topic, scenesProcessed: scriptScenes.length };
    } catch (pipelineErr: any) {
      console.error(`❌ [Inngest Pipeline Failure] Marking reel ${reelId} as failed:`, pipelineErr.message);

      try {
        await convex.mutation(api.reels.updateReelStatus, {
          reelId: reelId as Id<"reels">,
          status: "failed",
          errorMessage: pipelineErr.message || "Video generation pipeline encountered an unrecoverable error.",
        });
      } catch (dbErr) {
        console.error(`[Convex DB Fail Update Error]`, dbErr);
      }

      throw pipelineErr;
    }
  }
);

/**
 * Computes 100% frame-locked scene boundaries and relative whisper tokens
 * from continuous master Deepgram STT timestamps.
 * Guarantees that ALL 6 scenes receive valid, non-overlapping timeline durations.
 */
function computeMasterSceneTimings(scriptScenes: any[], masterWhisperTokens: any[]) {
  if (!scriptScenes || !Array.isArray(scriptScenes) || scriptScenes.length === 0) {
    return null;
  }

  let currentFrameAcc = 0;
  let tokenPointer = 0;
  const numScenes = scriptScenes.length;

  return scriptScenes.map((sc, idx) => {
    const sceneWords = sc.narration.trim().split(/\s+/).filter(Boolean);
    const sceneTokens: any[] = [];

    if (masterWhisperTokens && Array.isArray(masterWhisperTokens)) {
      for (let i = 0; i < sceneWords.length && tokenPointer < masterWhisperTokens.length; i++) {
        sceneTokens.push(masterWhisperTokens[tokenPointer]);
        tokenPointer++;
      }
    }

    const startFrame = currentFrameAcc;

    let computedDuration = 150; // Default 5s per scene @ 30fps
    if (sceneTokens.length > 0) {
      const firstTokenStart = sceneTokens[0].startFrame || 0;
      const lastTokenEnd = sceneTokens[sceneTokens.length - 1].endFrame || (firstTokenStart + 120);
      computedDuration = Math.max(135, lastTokenEnd - firstTokenStart + 15);
    } else {
      computedDuration = Math.max(135, Math.ceil(sceneWords.length * 5.5) + 20);
    }

    const durationFrames = computedDuration;
    currentFrameAcc += durationFrames;

    // Relative tokens starting at frame 0 for WordByWordCaptions inside sequence
    const relativeTokens = sceneTokens.length > 0
      ? sceneTokens.map((t) => ({
          ...t,
          startFrame: Math.max(0, (t.startFrame || 0) - (sceneTokens[0].startFrame || 0)),
          endFrame: Math.max(1, (t.endFrame || 0) - (sceneTokens[0].startFrame || 0)),
        }))
      : [];

    return {
      startFrame,
      durationFrames,
      whisperTokens: relativeTokens,
    };
  });
}
