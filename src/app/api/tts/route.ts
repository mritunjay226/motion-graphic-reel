import { NextRequest, NextResponse } from "next/server";

// In-memory cache for generated TTS audio to make seeking instant and avoid re-fetching
const audioCache = new Map<string, ArrayBuffer>();

async function getOrGenerateAudio(text: string, voiceId: string, modelId: string): Promise<ArrayBuffer> {
  const cacheKey = `${voiceId}_${modelId}_${text}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey) {
    throw new Error("CARTESIA_API_KEY is not configured in environment variables.");
  }

  const response = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Cartesia-Version": "2026-03-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: modelId,
      transcript: text,
      voice: {
        mode: "id",
        id: voiceId,
      },
      output_format: {
        container: "mp3",
        bit_rate: 128000,
        sample_rate: 44100,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cartesia API error (${response.status}): ${errorText}`);
  }

  const buffer = await response.arrayBuffer();
  audioCache.set(cacheKey, buffer);
  return buffer;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get("text");
    const voiceId = searchParams.get("voiceId") || "5ee9feff-1265-424a-9d7f-8e4d431a12c7";
    const modelId = searchParams.get("modelId") || "sonic-3";

    if (!text) {
      return NextResponse.json({ error: "Missing 'text' parameter." }, { status: 400 });
    }

    const audioBuffer = await getOrGenerateAudio(text, voiceId, modelId);
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
          "Cache-Control": "public, max-age=86400",
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
      voiceId = "5ee9feff-1265-424a-9d7f-8e4d431a12c7",
      modelId = "sonic-3",
    } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "A valid 'text' parameter is required." }, { status: 400 });
    }

    const audioBuffer = await getOrGenerateAudio(text, voiceId, modelId);

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
