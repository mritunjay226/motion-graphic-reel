import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

/**
 * POST /api/render
 *
 * Triggers a cloud render via Modal.com for a completed reel.
 *
 * Body:
 * {
 *   "reelId": "convex_id_string",
 *   "themeId": "vox_explainer",        // optional
 *   "bgMusicUrl": "/music/track.mp3",  // optional
 *   "bgMusicVolume": 0.15              // optional
 * }
 *
 * Flow:
 * 1. Fetch reel from Convex
 * 2. Convert to ExecutionPlan
 * 3. Serialize inputProps
 * 4. POST to Modal HTTP endpoint (spawns async render)
 * 5. Update Convex status to "rendering"
 * 6. Return { status, callId } to frontend
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reelId, themeId, bgMusicUrl, bgMusicVolume } = body;

    if (!reelId) {
      return NextResponse.json(
        { error: "Missing reelId" },
        { status: 400 }
      );
    }

    // ── 1. Fetch reel from Convex ──────────────────────────────────────
    const reel = await convex.query(api.reels.getReelById, {
      reelId: reelId as Id<"reels">,
    });

    if (!reel) {
      return NextResponse.json(
        { error: `Reel ${reelId} not found` },
        { status: 404 }
      );
    }

    if (!reel.storyboard || reel.storyboard.length === 0) {
      return NextResponse.json(
        { error: "Reel has no storyboard data. Generate the reel first." },
        { status: 400 }
      );
    }

    // Prevent duplicate renders
    if (reel.status === "rendering") {
      return NextResponse.json(
        { error: "Reel is already being rendered", callId: reel.modalCallId },
        { status: 409 }
      );
    }

    // ── 2. Dispatch durable background render event to Inngest ───────
    const { inngest } = await import("@/inngest/client");
    
    await inngest.send({
      name: "reel/render.requested",
      data: {
        reelId,
        themeId: themeId || reel.themeId || "vox_explainer",
        bgMusicUrl: bgMusicUrl || reel.bgMusicUrl || "/music/without_me.mp3",
        bgMusicVolume: bgMusicVolume ?? reel.bgMusicVolume ?? 0.15,
      },
    });

    // Optimistically update DB status to rendering so UI responds immediately
    await convex.mutation(api.reels.startRender, {
      reelId: reelId as Id<"reels">,
      modalCallId: "queued_inngest",
    });

    console.log(`[/api/render] ✅ Render event 'reel/render.requested' dispatched to Inngest for reel ${reelId}`);

    // ── 3. Return immediate queued status to frontend ─────────────────
    return NextResponse.json({
      status: "rendering",
      reelId,
      message: "Render job queued via Inngest durable background pipeline",
    });
  } catch (err: any) {
    console.error("[/api/render] Unexpected error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
