import { NextResponse } from "next/server";
import { generateSocialMetadata } from "@/lib/zernio";

/**
 * POST /api/social/generate-caption
 *
 * Generates viral YouTube Shorts titles, Instagram captions, and hashtags.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, title, storyboardText } = body;

    if (!topic && !title) {
      return NextResponse.json(
        { error: "Topic or title is required." },
        { status: 400 }
      );
    }

    const metadata = await generateSocialMetadata({
      topic: topic || title,
      title,
      storyboardText,
    });

    return NextResponse.json(metadata, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/social/generate-caption] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to generate social copy." },
      { status: 500 }
    );
  }
}
