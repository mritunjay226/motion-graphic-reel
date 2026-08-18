import { inngest } from "../client";
import { generateLLMStoryboard } from "@/lib/llm-storyboard";
import { transcribeAudioWithDeepgram } from "@/lib/deepgram";
import { uploadAudioToCloudinary } from "@/lib/cloudinary";
import { fetchRealWorldAssetImage } from "@/lib/web-asset-fetcher";
import { fetchVerifiedVideoBRoll } from "@/lib/video-fetcher";
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
 * Inngest Step-Function: Full 2.5D Vox Video Generation Pipeline with In-Memory Audio Buffers & Deepgram STT.
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

      // ─── Step 3: Audio TTS Generation (Direct In-Memory Buffers + Cloudinary) ───
      const audioData = await step.run("3-generate-audio-tts", async () => {
        console.log(`[Step 3] Generating Cartesia TTS master continuous voiceover & per-scene audio (${language})...`);
        const voice = voiceId || "62ae83ad-4f6a-430b-af41-a9bede9286ca";
        const results: { sceneId: number; narration: string; audioUrl: string; bufferBase64: string; audioDurationSec?: number }[] = [];
        let masterVoiceoverUrl = "";
        let masterBufferBase64 = "";

        // 1. Synthesize Master Continuous Script
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
            const masterArrayBuffer = await masterTtsRes.arrayBuffer();
            const masterBuffer = Buffer.from(masterArrayBuffer);
            masterBufferBase64 = masterBuffer.toString("base64");
            const fileName = `master_voiceover_${Date.now()}.mp3`;
            try {
              masterVoiceoverUrl = await uploadAudioToCloudinary(masterBuffer, fileName, "vox-reels/audio");
              console.log(`[Step 3] ✅ Master continuous voiceover uploaded to Cloudinary: ${masterVoiceoverUrl}`);
            } catch (cErr: any) {
              masterVoiceoverUrl = `data:audio/mp3;base64,${masterBufferBase64}`;
            }
          }
        } catch (masterErr: any) {
          console.warn(`[Step 3 Master Voiceover Warning]`, masterErr.message);
        }

        // 2. Synthesize Per-Scene Audio Chunks
        for (const sc of scriptScenes) {
          let audioUrl = "";
          let bufferBase64 = "";

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
              bufferBase64 = buffer.toString("base64");
              const fileName = `narration_sc_${sc.sceneId}_${Date.now()}.mp3`;
              // 128kbps Cartesia MP3 = 16000 bytes/sec exact duration
              const durationSec = Math.round((buffer.length / 16000) * 100) / 100;

              try {
                audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
                console.log(`[Step 3] ✅ Scene ${sc.sceneId} audio uploaded (${durationSec}s): ${audioUrl}`);
              } catch (cErr: any) {
                audioUrl = `data:audio/mp3;base64,${bufferBase64}`;
              }
            }
          } catch (err: any) {
            console.warn(`[Step 3 Scene Audio Warning] Scene ${sc.sceneId}:`, err.message);
          }

          if (!audioUrl && bufferBase64) {
            audioUrl = `data:audio/mp3;base64,${bufferBase64}`;
          }

          const wordCount = sc.narration.trim().split(/\s+/).filter(Boolean).length;
          const fallbackDurationSec = Math.max(2.5, wordCount * 0.35);
          const finalDurationSec = bufferBase64
            ? Math.round((Buffer.from(bufferBase64, "base64").length / 16000) * 100) / 100
            : fallbackDurationSec;

          results.push({
            sceneId: sc.sceneId,
            narration: sc.narration,
            audioUrl,
            bufferBase64,
            audioDurationSec: finalDurationSec,
          });
        }

        return { sceneResults: results, masterVoiceoverUrl, masterBufferBase64 };
      });

      // ─── Step 4: Deepgram Nova-2 Transcription directly from Audio Buffers ───
      const captionsData = await step.run("4-deepgram-captions", async () => {
        console.log(`[Step 4] Generating Deepgram word-level captions directly from in-memory audio buffers (${language})`);
        const sceneAudios = audioData?.sceneResults || (Array.isArray(audioData) ? audioData : []);

        const results: { sceneId: number; whisperTokens: any[] }[] = [];
        for (const sc of scriptScenes) {
          const audioItem = sceneAudios.find((a: any) => a.sceneId === sc.sceneId);
          let tokens: any[] = [];

          if (audioItem?.bufferBase64) {
            const buffer = Buffer.from(audioItem.bufferBase64, "base64");
            tokens = await transcribeAudioWithDeepgram(sc.narration, buffer, language, audioItem?.audioDurationSec);
          } else {
            tokens = await transcribeAudioWithDeepgram(sc.narration, audioItem?.audioUrl, language, audioItem?.audioDurationSec);
          }

          results.push({ sceneId: sc.sceneId, whisperTokens: tokens });
        }

        return { sceneResults: results };
      });

      // ─── Step 5: Tri-Media Sourcing (Verified 4K Video B-Roll + Real Archival Cutouts) ───
      const mediaData = await step.run("5-generate-and-upload-images", async () => {
        console.log(`[Step 5] Sourcing verified 4K B-Roll videos & real archival photo cutouts for ${scriptScenes.length} scenes...`);

        // 1. Fetch Verified 4K B-Roll Videos for each scene
        const bRollResults: { sceneId: number; videoUrl: string; bRollConfidence: number }[] = [];
        for (const sc of scriptScenes) {
          const bQuery = (sc as any).bRollQuery || `${sc.headline} documentary ${topic}`;
          try {
            const bRoll = await fetchVerifiedVideoBRoll(bQuery, sc.narration);
            if (bRoll && bRoll.videoUrl) {
              bRollResults.push({
                sceneId: sc.sceneId,
                videoUrl: bRoll.videoUrl,
                bRollConfidence: bRoll.confidenceScore || 8,
              });
            }
          } catch (vErr: any) {
            console.warn(`[Step 5 Video Warning] Scene ${sc.sceneId} B-roll error:`, vErr.message);
          }
        }

        // 2. Fetch Foreground Subject Cutouts & Event Assets
        const results: { sceneId: number; eventId?: string; imageUrl: string }[] = [];
        for (let i = 0; i < imagePrompts.length; i++) {
          const item = imagePrompts[i];
          let rawImageUrl = "";

          try {
            rawImageUrl = await fetchRealWorldAssetImage(item.prompt);
          } catch (err: any) {
            console.warn(`[Step 5 Asset Warning] Asset ${i + 1} fallback to vector:`, err.message);
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

        console.log(`[Step 5] ✅ Tri-Media sourcing complete: ${results.length} cutouts, ${bRollResults.length} verified B-roll clips.`);
        return { images: results, bRolls: bRollResults };
      });

      // ─── Step 6: Assemble & Sync to Convex DB ──────────────────────────
      await step.run("6-convex-db-sync", async () => {
        console.log(`[Step 6] Assembling full storyboard & event timelines into Convex`);
        const sceneAudios = audioData?.sceneResults || (Array.isArray(audioData) ? audioData : []);
        const masterVoiceoverUrl = audioData?.masterVoiceoverUrl || "";
        const sceneCaptions = captionsData?.sceneResults || (Array.isArray(captionsData) ? captionsData : []);

        const imageAssets = (mediaData as any)?.images || (Array.isArray(mediaData) ? mediaData : []);
        const bRollAssets = (mediaData as any)?.bRolls || [];

        let currentFrameAcc = 0;

        const fullStoryboard = scriptScenes.map((sc: any) => {
          const audio = sceneAudios.find((a: any) => a.sceneId === sc.sceneId);
          const caption = sceneCaptions.find((c: any) => c.sceneId === sc.sceneId);
          const sceneTokens = caption?.whisperTokens || [];

          // Primary scene image & verified B-roll video
          const primaryImage = imageAssets.find((img: any) => img.sceneId === sc.sceneId && !img.eventId);
          const bRollItem = bRollAssets.find((b: any) => b.sceneId === sc.sceneId);
          const videoUrl = bRollItem?.videoUrl || "";

          // Update event object image URLs
          const updatedEvents = (sc.events && Array.isArray(sc.events))
            ? sc.events.map((ev: any) => {
                const evImg = imageAssets.find((img: any) => img.sceneId === sc.sceneId && img.eventId === ev.id);
                return {
                  ...ev,
                  imageUrl: evImg?.imageUrl || "",
                };
              })
            : [];

          // Dynamic scene duration derived directly from audio playback length
          const audioDurationFrames = audio?.audioDurationSec ? Math.ceil(audio.audioDurationSec * 30) : 0;
          const lastToken = sceneTokens[sceneTokens.length - 1];
          const lastTokenEndFrame = lastToken
            ? (lastToken.endFrame || Math.ceil((lastToken.endMs || 0) / 33.33))
            : 0;

          const durationFrames = audioDurationFrames > 0
            ? audioDurationFrames
            : (lastTokenEndFrame > 0 ? lastTokenEndFrame : (sc.durationFrames || 90));

          const startFrame = currentFrameAcc;
          currentFrameAcc += durationFrames;

          return {
            sceneId: sc.sceneId,
            headline: sc.headline,
            subtitle: sc.subtitle || "",
            narration: sc.narration,
            imagePrompt: sc.imagePrompt || "",
            imageUrl: primaryImage?.imageUrl || "",
            audioUrl: audio?.audioUrl || "",
            audioDurationSec: audio?.audioDurationSec,
            videoUrl: videoUrl || undefined,
            bRollUrl: videoUrl || undefined,
            isSingleSubject: true,
            whisperTokens: sceneTokens,
            startFrame,
            durationFrames,
            visualType: sc.visualType || "center_cutout_hero",
            gsapType: sc.gsapType || "grid_lines",
            entranceType: sc.entranceType || "slide_corner_bottom_left",
            events: updatedEvents,
          };
        });

        // Save storyboard in Convex
        await convex.mutation(api.reels.updateReelStatus, {
          reelId: reelId as Id<"reels">,
          status: "completed",
          storyboard: fullStoryboard,
          fullVoiceoverUrl: masterVoiceoverUrl || undefined,
        });

        console.log(`[Step 6] ✅ Reel ${reelId} completed: ${fullStoryboard.length} scenes, totalFrames: ${currentFrameAcc}`);
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
