import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { generateChatterboxAudio } from "@/lib/chatterbox";
import { getOrGenerateAudio } from "@/lib/cartesia";
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
    const voiceClipUrl = selectedPreset?.clipUrl;
    const baseExaggeration = selectedPreset?.recommendedExaggeration ?? 0.70;
    const baseCfgWeight = selectedPreset?.recommendedCfgWeight ?? 0.35;
    const isHook = sceneIndex === 0;

    let audioUrl = "";
    let buffer: Buffer | undefined;

    // Tier 1: Chatterbox Dual-Model TTS on Modal
    try {
      console.log(`[Resync Scene ${sceneIndex + 1}] Synthesizing with Chatterbox (${selectedLanguage})...`);
      const chatterboxResult = await generateChatterboxAudio({
        prompt: cleanNarration,
        language: selectedLanguage,
        voiceClipUrl,
        exaggeration: isHook ? Math.min(1.0, baseExaggeration + 0.05) : baseExaggeration,
        cfgWeight: isHook ? Math.min(1.0, baseCfgWeight + 0.05) : baseCfgWeight,
        isHookScene: isHook,
      });
      audioUrl = chatterboxResult.audioUrl;
    } catch (chatterboxErr: any) {
      console.warn(`[Resync Scene ${sceneIndex + 1} Chatterbox Fallback]`, chatterboxErr.message);

      // Tier 2: Cartesia Sonic-3
      const isHi = selectedLanguage.toLowerCase() === "hi" || selectedLanguage.toLowerCase() === "hinglish";
      const fallbackVoice = isHi ? "7e8cb11d-37af-476b-ab8f-25da99b18644" : "62ae83ad-4f6a-430b-af41-a9bede9286ca";
      const voice = (voiceId && !voiceId.includes("_")) ? voiceId : fallbackVoice;

      const arrayBuffer = await getOrGenerateAudio(cleanNarration, voice, "sonic-3", selectedLanguage);
      buffer = Buffer.from(arrayBuffer);
      const fileName = `resync_sc_${sceneIndex + 1}_${Date.now()}.mp3`;

      try {
        audioUrl = await uploadAudioToCloudinary(buffer, fileName, "vox-reels/audio");
      } catch {
        audioUrl = `data:audio/mp3;base64,${buffer.toString("base64")}`;
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
