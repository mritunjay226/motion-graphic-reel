import { NextRequest, NextResponse } from "next/server";
import {
  generateGeminiAudio,
  getOrGenerateGeminiAudio,
  resolveGeminiModel,
  resolveGeminiVoiceName,
} from "@/lib/gemini-tts";
import { getVoicePresetById } from "@/lib/voice-presets";

export { getOrGenerateGeminiAudio };

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get("text");
    const voiceId = searchParams.get("voiceId") || searchParams.get("voice") || "Fola";
    const modelParam = searchParams.get("model") || searchParams.get("modelId") || "gemini-3.8-flash-tts";
    const language = searchParams.get("language") || "en";
    const provider = searchParams.get("provider");

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Missing 'text' parameter." }, { status: 400 });
    }

    const preset = getVoicePresetById(voiceId);


    // Default & Primary: Gemini 3.8 Flash TTS / Flash Lite TTS
    const model = resolveGeminiModel(preset?.model || modelParam);
    const voiceName = resolveGeminiVoiceName(preset?.geminiVoiceName || preset?.name || voiceId, language);

    const audioResult = await generateGeminiAudio({
      text,
      voiceName,
      model,
      language,
    });

    const audioBuffer = audioResult.buffer;
    const totalSize = audioBuffer.byteLength;

    // Handle HTTP Range Requests for Remotion Player Seekable Audio (206 Partial Content)
    const rangeHeader = req.headers.get("range");

    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = end - start + 1;
      const chunk = audioBuffer.subarray(start, end + 1);

      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": "audio/wav",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-TTS-Model": audioResult.model,
          "X-TTS-Voice": audioResult.voiceName,
        },
      });
    }

    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": totalSize.toString(),
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=86400",
        "X-TTS-Model": audioResult.model,
        "X-TTS-Voice": audioResult.voiceName,
      },
    });
  } catch (err: any) {
    console.error("[Gemini TTS GET Handler Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voiceId = "Fola",
      voice,
      model = "gemini-3.8-flash-tts",
      modelId,
      language = "en",
      provider,
    } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "A valid 'text' parameter is required." }, { status: 400 });
    }

    const resolvedVoiceId = voice || voiceId;
    const preset = getVoicePresetById(resolvedVoiceId);


    // Default & Primary: Gemini 3.8 Flash TTS / Flash Lite TTS
    const resolvedModel = resolveGeminiModel(preset?.model || modelId || model);
    const voiceName = resolveGeminiVoiceName(preset?.geminiVoiceName || preset?.name || resolvedVoiceId, language);

    const audioResult = await generateGeminiAudio({
      text,
      voiceName,
      model: resolvedModel,
      language,
    });

    return new NextResponse(new Uint8Array(audioResult.buffer), {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": audioResult.buffer.byteLength.toString(),
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=86400",
        "X-TTS-Model": audioResult.model,
        "X-TTS-Voice": audioResult.voiceName,
        "X-Audio-Duration": audioResult.durationSec.toString(),
      },
    });
  } catch (err: any) {
    console.error("[Gemini TTS POST Handler Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
