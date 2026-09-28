import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  generateGeminiAudio,
  resolveGeminiVoiceName,
  resolveGeminiModel,
} from "@/lib/gemini-tts";
import { uploadAudioToCloudinary } from "@/lib/cloudinary";
import { transcribeAudioWithDeepgramDetailed } from "@/lib/deepgram";
import { getVoicePresetById, getDefaultVoiceForLanguage } from "@/lib/voice-presets";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

/**
 * POST /api/reel/resync-scene
 *
 * Re-synthesizes voiceover audio and re-transcribes frame-accurate captions
 * with Deepgram Nova-2 when scene narration text is edited.
 * Automatically updates Convex storyboard scene and re-computes timeline start frames.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reelId, sceneIndex, narration, language = "en", voiceId } = body;

    if (!reelId || sceneIndex === undefined || !narration) {
      return NextResponse.json(
        { error: "Missing required fields: reelId, sceneIndex, narration" },
        { status: 400 }
      );
    }

    const reel = await convex.query(api.reels.getReelById, {
      reelId: reelId as Id<"reels">,
    });

    if (!reel) {
      return NextResponse.json(
        { error: `Reel ${reelId} not found` },
        { status: 404 }
      );
    }

    const storyboard = reel.storyboard || [];
    if (sceneIndex < 0 || sceneIndex >= storyboard.length) {
      return NextResponse.json(
        { error: `Scene index ${sceneIndex} out of bounds` },
        { status: 400 }
      );
    }

    const cleanNarration = narration.trim();
    const selectedLanguage = language || reel.language || "en";
    const selectedPreset = getVoicePresetById(voiceId) || getDefaultVoiceForLanguage(selectedLanguage);
    const resolvedVoice = resolveGeminiVoiceName(selectedPreset?.geminiVoiceName || selectedPreset?.name || voiceId, selectedLanguage);
    const preferredModel = resolveGeminiModel(selectedPreset?.model || "gemini-3.8-flash-tts");

    let audioUrl = "";
    let buffer: Buffer | undefined;

    // Primary: Gemini 3.8 Flash TTS
    try {
      console.log(`[Resync Scene ${sceneIndex + 1}] Synthesizing with Gemini 3.8 Flash TTS (${selectedLanguage}) voice "${resolvedVoice}"...`);
      const geminiResult = await generateGeminiAudio({
        text: cleanNarration,
        voiceName: resolvedVoice,
        model: preferredModel,
        language: selectedLanguage,
      });
      buffer = geminiResult.buffer;
      const fileName = `resync_sc_${sceneIndex + 1}_${Date.now()}.wav`;

      try {
        audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
      } catch {
        audioUrl = `data:audio/wav;base64,${buffer.toString("base64")}`;
      }
    } catch (geminiErr: any) {
      console.warn(`[Resync Scene ${sceneIndex + 1} Gemini Fallback]`, geminiErr.message);

      // Fallback: Gemini 3.8 Flash Lite TTS
      try {
        const liteResult = await generateGeminiAudio({
          text: cleanNarration,
          voiceName: resolvedVoice,
          model: "gemini-3.8-flash-lite-tts",
          language: selectedLanguage,
        });
        buffer = liteResult.buffer;
        const fileName = `resync_sc_${sceneIndex + 1}_lite_${Date.now()}.wav`;

        try {
          audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
        } catch {
          audioUrl = `data:audio/wav;base64,${buffer.toString("base64")}`;
        }
      } catch (liteErr: any) {
        console.error(`[Resync Scene ${sceneIndex + 1} All Audio Failed]`, liteErr.message);
      }
    }

    // Deepgram Nova-2 Precise Transcription & Duration Measurement
    const targetSource = buffer || audioUrl;
    const { tokens, durationSec } = await transcribeAudioWithDeepgramDetailed(
      cleanNarration,
      targetSource,
      selectedLanguage
    );

    // Dynamic scene frame duration (fps = 30) + 6-frame breath tail
    const audioDurationFrames = Math.ceil(durationSec * 30);
    const lastToken = tokens[tokens.length - 1];
    const lastTokenEndFrame = lastToken
      ? (lastToken.endFrame || Math.ceil((lastToken.endMs || 0) / 33.33))
      : 0;

    const durationFrames = Math.max(audioDurationFrames, lastTokenEndFrame > 0 ? lastTokenEndFrame + 6 : 0, 45);

    // Sync to Convex DB & dynamically recalculate contiguous timeline startFrames
    const updatedScene = await convex.mutation(api.reels.updateSceneAudioAndTokens, {
      reelId: reelId as Id<"reels">,
      sceneIndex,
      narration: cleanNarration,
      audioUrl,
      audioDurationSec: durationSec,
      durationFrames,
      whisperTokens: tokens,
    });

    return NextResponse.json({
      success: true,
      updatedScene,
    });
  } catch (error: any) {
    console.error("[POST /api/reel/resync-scene Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to resync scene audio and captions" },
      { status: 500 }
    );
  }
}
