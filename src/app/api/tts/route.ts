import { NextRequest, NextResponse } from "next/server";
import { getOrGenerateAudio } from "@/lib/cartesia";
import { getVoicePresetById } from "@/lib/voice-presets";

export { getOrGenerateAudio };

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get("text");
    const voiceId = searchParams.get("voiceId");
    const modelId = searchParams.get("modelId") || "sonic-3";
    const language = searchParams.get("language") || "en";
    const provider = searchParams.get("provider");

    if (!text) {
      return NextResponse.json({ error: "Missing 'text' parameter." }, { status: 400 });
    }

    const preset = voiceId ? getVoicePresetById(voiceId) : undefined;

    if (provider === "chatterbox" || preset) {
      const { generateChatterboxAudio } = await import("@/lib/chatterbox");
      const { audioUrl } = await generateChatterboxAudio({
        prompt: text,
        language: preset?.language || language,
        voiceClipUrl: preset?.clipUrl,
      });
      if (searchParams.get("format") === "json") {
        return NextResponse.json({ url: audioUrl });
      }
      return NextResponse.redirect(audioUrl, 302);
    }

    const isHi = language.toLowerCase() === "hi" || language.toLowerCase() === "hinglish";
    const defaultVoice = isHi ? "7e8cb11d-37af-476b-ab8f-25da99b18644" : "62ae83ad-4f6a-430b-af41-a9bede9286ca";
    const resolvedVoiceId = (voiceId && !voiceId.includes("_")) ? voiceId : defaultVoice;

    const audioBuffer = await getOrGenerateAudio(text, resolvedVoiceId, modelId, language);
    const totalSize = audioBuffer.byteLength;

    // Handle HTTP Range Requests for Remotion Seekable Media (206 Partial Content)
    const rangeHeader = req.headers.get("range");

    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunkSize = end - start + 1;
      const chunk = audioBuffer.slice(start, end + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": totalSize.toString(),
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("Cartesia GET Handler Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voiceId,
      modelId = "sonic-3",
      language = "en",
      provider,
    } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "A valid 'text' parameter is required." }, { status: 400 });
    }

    const preset = voiceId ? getVoicePresetById(voiceId) : undefined;

    if (provider === "chatterbox" || preset) {
      const { generateChatterboxAudio } = await import("@/lib/chatterbox");
      const { audioUrl } = await generateChatterboxAudio({
        prompt: text,
        language: preset?.language || language,
        voiceClipUrl: preset?.clipUrl,
      });
      return NextResponse.json({ url: audioUrl });
    }

    const isHi = language.toLowerCase() === "hi" || language.toLowerCase() === "hinglish";
    const defaultVoice = isHi ? "7e8cb11d-37af-476b-ab8f-25da99b18644" : "62ae83ad-4f6a-430b-af41-a9bede9286ca";
    const resolvedVoiceId = (voiceId && !voiceId.includes("_")) ? voiceId : defaultVoice;

    const audioBuffer = await getOrGenerateAudio(text, resolvedVoiceId, modelId, language);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("Cartesia POST Handler Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
