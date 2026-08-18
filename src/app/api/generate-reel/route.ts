import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

/**
 * Trigger Inngest Video Generation Event API Endpoint.
 * Creates a real Convex DB entry and dispatches event to Inngest step functions.
 */
export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const { userId, topic, voiceId, language = "en" } = body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "Missing or invalid 'topic' parameter" }, { status: 400 });
    }

    // 1. Create or reset Convex reel record with safe fallback
    let reelId: string;
    if (body.reelId) {
      reelId = body.reelId;
      try {
        await convex.mutation(api.reels.updateReelStatus, {
          reelId: reelId as Id<"reels">,
          status: "draft",
          errorMessage: undefined,
        });
      } catch (dbErr: any) {
        console.warn("[Convex DB Reset Note] Failed to reset existing reel status:", dbErr?.message || dbErr);
      }
    } else {
      try {
        reelId = await convex.mutation(api.reels.createReelFromTopic, {
          userId: userId || "user_guest",
          topic: topic.trim(),
          language,
        });
      } catch (dbErr: any) {
        console.warn("[Convex DB Insert Note] Failed to insert initial reel record via Convex client, using local ID fallback:", dbErr?.message || dbErr);
        reelId = `reel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      }
    }

    // 2. Dispatch event to Inngest step-function pipeline
    try {
      await inngest.send({
        name: "reel/generate.requested",
        data: {
          reelId,
          userId: userId || "user_guest",
          topic: topic.trim(),
          voiceId: voiceId || "62ae83ad-4f6a-430b-af41-a9bede9286ca",
          language,
        },
      });
    } catch (inngestErr: any) {
      console.error("[Inngest Dispatch Error]", inngestErr);
      return NextResponse.json(
        {
          error: `Inngest dispatch failed: ${inngestErr?.message || "Missing INNGEST_EVENT_KEY or local Inngest dev server unreachable."}`,
          reelId,
          hint: "Ensure INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY are set in Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reelId,
      message: "Inngest reel generation event dispatched successfully.",
    });
  } catch (error: any) {
    console.error("[Generate Reel Route Error]", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error during reel generation dispatch.",
      },
      { status: 500 }
    );
  }
}
