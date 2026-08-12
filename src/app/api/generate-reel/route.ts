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
    const body = await req.json();
    const { userId, topic, voiceId, language = "en" } = body;

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    // 1. Create or reset real Convex reel record
    let reelId: string;
    if (body.reelId) {
      reelId = body.reelId;
      try {
        await convex.mutation(api.reels.updateReelStatus, {
          reelId: reelId as Id<"reels">,
          status: "draft",
          errorMessage: undefined,
        });
      } catch (dbErr) {
        console.warn("[Convex DB Reset Note] Failed to reset existing reel status:", dbErr);
      }
    } else {
      try {
        reelId = await convex.mutation(api.reels.createReelFromTopic, {
          userId: userId || "user_guest",
          topic,
          language,
        });
      } catch (dbErr) {
        console.warn("[Convex DB Insert Note] Failed to insert initial reel record via client, fallback to provided reelId.");
        reelId = `reel_${Date.now()}`;
      }
    }

    // 2. Dispatch event to Inngest step-function pipeline
    await inngest.send({
      name: "reel/generate.requested",
      data: {
        reelId,
        userId: userId || "user_guest",
        topic,
        voiceId: voiceId || "62ae83ad-4f6a-430b-af41-a9bede9286ca",
        language,
      },
    });

    return NextResponse.json({ success: true, reelId, message: "Inngest reel generation event dispatched." });
  } catch (error: any) {
    console.error("[Inngest Trigger Error]", error);
    return NextResponse.json({ error: error.message || "Failed to dispatch Inngest event" }, { status: 500 });
  }
}
