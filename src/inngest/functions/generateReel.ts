import { inngest } from "../client";
import { generateLLMStoryboard } from "@/lib/llm-storyboard";
import { transcribeAudioWithDeepgram, transcribeAudioWithDeepgramDetailed } from "@/lib/deepgram";
import { uploadAudioToCloudinary } from "@/lib/cloudinary";
import { fetchRealWorldAssetImage } from "@/lib/web-asset-fetcher";
import { fetchVerifiedVideoBRoll } from "@/lib/video-fetcher";
import { generateGeminiImage } from "@/lib/gemini-image";
import { generateSvgVectorStickerUrl } from "@/remotion/utils/vector-assets";
import {
  generateGeminiAudio,
  resolveGeminiVoiceName,
  resolveGeminiModel,
} from "@/lib/gemini-tts";
import { getVoicePresetById, getDefaultVoiceForLanguage } from "@/lib/voice-presets";
import { uploadImageToImageKit } from "@/lib/imagekit";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

/**
 * Inngest Step-Function: High-Speed Parallel 2.5D Vox Video Generation Pipeline
 * with Direct In-Memory Audio Buffers, Deepgram STT, and Gemini Image Fallbacks.
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
          const scenes = await generateLLMStoryboard(topic, language);
          try {
            await convex.mutation(api.reels.updatePipelineProgress, {
              reelId: reelId as Id<"reels">,
              currentStep: 2,
              progressPercent: 20,
              progressMessage: "Script generated. Synthesizing voiceover audio...",
            });
          } catch (pErr) {
            console.warn(`[Progress Update Warning]`, pErr);
          }
          return scenes;
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

      // ─── Step 3: High-Speed Parallel Audio TTS Generation (Gemini 3.8 Flash TTS & Flash Lite) ───
      const audioData = await step.run("3-generate-audio-tts", async () => {
        const selectedPreset = getVoicePresetById(voiceId) || getDefaultVoiceForLanguage(language);
        const resolvedVoice = resolveGeminiVoiceName(selectedPreset?.geminiVoiceName || selectedPreset?.name || voiceId, language);
        const preferredModel = resolveGeminiModel(selectedPreset?.model || "gemini-3.8-flash-tts");

        console.log(`[Step 3] Generating voiceover via Gemini 3.8 Flash TTS (${language}) with voice: "${resolvedVoice}" (${preferredModel})...`);
        let masterVoiceoverUrl = "";

        // 1. Synthesize Master Continuous Script (prioritize Devanagari narrationTts for authentic Hindi pronunciation)
        const masterScript = scriptScenes.map((sc: any) => (sc.narrationTts || sc.narration).trim()).join(" ");

        try {
          // Primary: Gemini 3.8 Flash TTS (or preset specified model) with documentary directing
          const geminiMaster = await generateGeminiAudio({
            text: masterScript,
            voiceName: resolvedVoice,
            model: preferredModel,
            language,
            style: "investigative",
            temperature: 0.35,
          });

          const masterBuffer = geminiMaster.buffer;
          const fileName = `master_voiceover_${Date.now()}.wav`;

          try {
            masterVoiceoverUrl = await uploadAudioToCloudinary(masterBuffer, fileName, "vox-reels/audio");
            console.log(`[Step 3] ✅ Master continuous voiceover synthesized via ${geminiMaster.model} [${resolvedVoice}] & uploaded to Cloudinary: ${masterVoiceoverUrl}`);
          } catch (cloudErr: any) {
            console.error(`[Step 3 Cloudinary Master Upload Error]`, cloudErr.message);
          }
        } catch (geminiMasterErr: any) {
          console.warn(`[Step 3 Gemini Flash Master Fallback]`, geminiMasterErr.message);
          // Fallback: Gemini 3.8 Flash Lite TTS
          try {
            const liteMaster = await generateGeminiAudio({
              text: masterScript,
              voiceName: resolvedVoice,
              model: "gemini-3.8-flash-lite-tts",
              language,
              style: "investigative",
              temperature: 0.35,
            });
            const masterBuffer = liteMaster.buffer;
            const fileName = `master_voiceover_lite_${Date.now()}.wav`;
            try {
              masterVoiceoverUrl = await uploadAudioToCloudinary(masterBuffer, fileName, "vox-reels/audio");
            } catch (cloudErr: any) {
              console.error(`[Step 3 Cloudinary Lite Master Upload Error]`, cloudErr.message);
            }
          } catch (liteErr: any) {
            console.error(`[Step 3 Gemini Flash Lite Master Error]`, liteErr.message);
          }
        }

        // 2. Synthesize Per-Scene Audio Chunks in Parallel Batches
        const processSceneAudio = async (sc: any) => {
          let audioUrl = "";
          const ttsPrompt = (sc.narrationTts || sc.narration).trim();

          try {
            // Tier 1: Gemini 3.8 Flash TTS with documentary directing
            const geminiResult = await generateGeminiAudio({
              text: ttsPrompt,
              voiceName: resolvedVoice,
              model: preferredModel,
              language,
              style: "investigative",
              temperature: 0.35,
            });

            const buffer = geminiResult.buffer;
            const fileName = `narration_sc_${sc.sceneId}_${Date.now()}.wav`;
            const durationSec = geminiResult.durationSec;

            try {
              audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
              console.log(`[Step 3] ✅ Scene ${sc.sceneId} audio generated via ${geminiResult.model} [${resolvedVoice}] (${durationSec}s): ${audioUrl}`);
            } catch (cloudErr: any) {
              console.error(`[Step 3 Scene ${sc.sceneId} Cloudinary Error]`, cloudErr.message);
            }

            return {
              sceneId: sc.sceneId,
              narration: sc.narration,
              audioUrl,
              audioDurationSec: durationSec,
            };
          } catch (sceneErr: any) {
            console.warn(`[Step 3 Scene Fallback] Scene ${sc.sceneId}: ${sceneErr.message}. Trying Flash Lite...`);
            try {
              const liteResult = await generateGeminiAudio({
                text: ttsPrompt,
                voiceName: resolvedVoice,
                model: "gemini-3.8-flash-lite-tts",
                language,
              });

              const buffer = liteResult.buffer;
              const fileName = `narration_sc_${sc.sceneId}_lite_${Date.now()}.wav`;
              const durationSec = liteResult.durationSec;

              try {
                audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
              } catch (cloudErr: any) {
                console.error(`[Step 3 Scene ${sc.sceneId} Lite Cloudinary Error]`, cloudErr.message);
              }

              return {
                sceneId: sc.sceneId,
                narration: sc.narration,
                audioUrl,
                audioDurationSec: durationSec,
              };
            } catch (liteErr: any) {
              console.error(`[Step 3 All Audio Failed] Scene ${sc.sceneId}:`, liteErr.message);
              const wordCount = sc.narration.trim().split(/\s+/).filter(Boolean).length;
              const estimatedDurationSec = Math.max(2.5, Math.round(wordCount * 0.38 * 10) / 10);
              return {
                sceneId: sc.sceneId,
                narration: sc.narration,
                audioUrl: "",
                audioDurationSec: estimatedDurationSec,
              };
            }
          }
        };

        const sceneResults: any[] = [];
        const BATCH_SIZE = 3;
        for (let i = 0; i < scriptScenes.length; i += BATCH_SIZE) {
          const batch = scriptScenes.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(batch.map((sc: any) => processSceneAudio(sc)));
          sceneResults.push(...batchResults);
        }

        try {
          await convex.mutation(api.reels.updatePipelineProgress, {
            reelId: reelId as Id<"reels">,
            currentStep: 3,
            progressPercent: 45,
            progressMessage: "Voiceover synthesized via Gemini 3.8 Flash TTS. Aligning captions...",
          });
        } catch (pErr) {
          console.warn(`[Progress Update Warning]`, pErr);
        }

        return { sceneResults, masterVoiceoverUrl };
      });

      // ─── Step 4: Parallel Deepgram Nova-2 Transcription ────────────────
      const captionsData = await step.run("4-deepgram-captions", async () => {
        console.log(`[Step 4] Transcribing word-level captions concurrently from audio URLs (${language})`);
        const sceneAudios = audioData?.sceneResults || (Array.isArray(audioData) ? audioData : []);

        const captionPromises = scriptScenes.map(async (sc: any) => {
          const audioItem = sceneAudios.find((a: any) => a.sceneId === sc.sceneId);
          const result = await transcribeAudioWithDeepgramDetailed(
            sc.narration,
            audioItem?.audioUrl,
            language,
            audioItem?.audioDurationSec
          );

          return {
            sceneId: sc.sceneId,
            whisperTokens: result.tokens,
            measuredAudioDurationSec: result.durationSec,
          };
        });

        const sceneResults = await Promise.all(captionPromises);

        try {
          await convex.mutation(api.reels.updatePipelineProgress, {
            reelId: reelId as Id<"reels">,
            currentStep: 4,
            progressPercent: 65,
            progressMessage: "Captions synchronized. Sourcing 4K B-roll & visual assets...",
          });
        } catch (pErr) {
          console.warn(`[Progress Update Warning]`, pErr);
        }

        return { sceneResults };
      });

      // ─── Step 5: Tri-Media Sourcing (Parallel 4K B-Roll & Gemini Image Fallbacks) ───
      const mediaData = await step.run("5-generate-and-upload-images", async () => {
        console.log(`[Step 5] Sourcing verified 4K B-Roll & archival cutouts concurrently for ${scriptScenes.length} scenes...`);

        // 1. Fetch Verified 4K B-Roll Videos concurrently
        const bRollPromises = scriptScenes.map(async (sc: any) => {
          const bQuery = (sc as any).bRollQuery || `${sc.headline} documentary ${topic}`;
          try {
            const bRoll = await fetchVerifiedVideoBRoll(bQuery, sc.narration);
            if (bRoll && bRoll.videoUrl) {
              return {
                sceneId: sc.sceneId,
                videoUrl: bRoll.videoUrl,
                bRollConfidence: bRoll.confidenceScore || 8,
              };
            }
          } catch (vErr: any) {
            console.warn(`[Step 5 Video Warning] Scene ${sc.sceneId} B-roll error:`, vErr.message);
          }
          return null;
        });

        // 2. Fetch Foreground Subject Cutouts & Event Assets in parallel batches of 3
        const processAssetItem = async (item: typeof imagePrompts[0], index: number) => {
          let rawImageUrl = "";
          let isAiGenerated = false;

          // Tier 1: Real-world authentic web image / logo / Wikipedia
          try {
            rawImageUrl = await fetchRealWorldAssetImage(item.prompt);
          } catch (err: any) {
            console.warn(`[Step 5 Asset Web Fetch Note] Asset ${index + 1}: ${err.message}`);
          }

          // Tier 2: Gemini 2.5 Flash Photorealistic Image Generation Fallback
          if (!rawImageUrl || rawImageUrl.includes("data:image/svg+xml")) {
            try {
              console.log(`[Step 5 Asset AI Gen] Generating photorealistic cutout via Gemini 2.5 Flash for Asset ${index + 1}...`);
              rawImageUrl = await generateGeminiImage(item.prompt);
              isAiGenerated = true;
            } catch (aiErr: any) {
              console.warn(`[Step 5 Asset AI Gen Warning] Asset ${index + 1} Gemini fallback error: ${aiErr.message}`);
            }
          }

          // Tier 3: Clean SVG Vector Sticker Fallback
          if (!rawImageUrl) {
            rawImageUrl = generateSvgVectorStickerUrl(item.prompt, `SCENE ${item.sceneId}`);
          }

          // Upload to ImageKit with AI background removal
          let finalUrl = rawImageUrl;
          try {
            const cleanFileName = `asset_${item.sceneId}__${index}_${topic.replace(/\s+/g, "_").slice(0, 15)}.png`;
            const uploadResult = await uploadImageToImageKit({
              imageUrl: rawImageUrl,
              fileName: cleanFileName,
              folder: "/vox-reels",
              removeBg: item.removeBg,
            });

            if (uploadResult && uploadResult.url) {
              finalUrl = uploadResult.url;
              console.log(`[Step 5] ✅ Asset ${index + 1} (${isAiGenerated ? "AI Gemini" : "Web Asset"}) synced to ImageKit CDN`);
            }
          } catch (ikErr: any) {
            console.warn(`[Step 5 ImageKit Warning] Asset ${index + 1}:`, ikErr.message);
          }

          return { sceneId: item.sceneId, eventId: item.eventId, imageUrl: finalUrl };
        };

        // Bounded concurrency batch execution for images
        const imageResults: { sceneId: number; eventId?: string; imageUrl: string }[] = [];
        const BATCH_SIZE = 3;
        for (let i = 0; i < imagePrompts.length; i += BATCH_SIZE) {
          const batch = imagePrompts.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(
            batch.map((item: any, idx: number) => processAssetItem(item, i + idx))
          );
          imageResults.push(...batchResults);
        }

        const rawBRolls = await Promise.all(bRollPromises);
        const bRollResults = rawBRolls.filter((b): b is { sceneId: number; videoUrl: string; bRollConfidence: number } => Boolean(b));

        console.log(`[Step 5] ✅ Tri-Media sourcing complete: ${imageResults.length} cutouts, ${bRollResults.length} verified B-roll clips.`);

        try {
          await convex.mutation(api.reels.updatePipelineProgress, {
            reelId: reelId as Id<"reels">,
            currentStep: 5,
            progressPercent: 85,
            progressMessage: "Visual assets ready. Assembling timelines in database...",
          });
        } catch (pErr) {
          console.warn(`[Progress Update Warning]`, pErr);
        }

        return { images: imageResults, bRolls: bRollResults };
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
          const actualAudioDurationSec = caption?.measuredAudioDurationSec || audio?.audioDurationSec || 0;

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

          // Dynamic scene duration derived directly from measured audio playback length + 6-frame breath tail
          const audioDurationFrames = actualAudioDurationSec > 0 ? Math.ceil(actualAudioDurationSec * 30) : 0;
          const lastToken = sceneTokens[sceneTokens.length - 1];
          const lastTokenEndFrame = lastToken
            ? (lastToken.endFrame || Math.ceil((lastToken.endMs || 0) / 33.33))
            : 0;

          const naturalSpeechEnd = Math.max(audioDurationFrames, lastTokenEndFrame > 0 ? lastTokenEndFrame + 6 : 0);
          const durationFrames = naturalSpeechEnd > 0 ? naturalSpeechEnd : (sc.durationFrames || 90);

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
            audioDurationSec: actualAudioDurationSec || undefined,
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
          currentStep: 6,
          progressPercent: 100,
          progressMessage: "Generation complete! Ready to edit and render.",
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
          currentStep: 1,
          progressPercent: 0,
          progressMessage: pipelineErr.message || "Video generation pipeline encountered an unrecoverable error.",
          errorMessage: pipelineErr.message || "Video generation pipeline encountered an unrecoverable error.",
        });
      } catch (dbErr) {
        console.error(`[Convex DB Fail Update Error]`, dbErr);
      }

      throw pipelineErr;
    }
  }
);
