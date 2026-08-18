import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { publishToZernio } from "@/lib/zernio";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

/**
 * POST /api/social/publish
 *
 * Publishes a rendered video reel to Instagram Reels, YouTube Shorts, etc. via Zernio.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reelId, videoUrl, caption, title, tags, platforms, scheduledFor } = body;

    if (!reelId || !videoUrl) {
      return NextResponse.json(
        { error: "reelId and videoUrl are required." },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one target platform is required." },
        { status: 400 }
      );
    }

    console.log(`[API /api/social/publish] Publishing reel ${reelId} to ${platforms.length} platforms...`);

    // 1. Record pending status in Convex DB
    const initialPosts = platforms.map((p: any) => ({
      platform: p.platform,
      accountId: p.accountId,
      accountName: p.accountName,
      status: "pending" as const,
      publishedAt: Date.now(),
    }));

    try {
      await convex.mutation(api.reels.recordSocialPublish, {
        reelId: reelId as Id<"reels">,
        posts: initialPosts,
      });
    } catch (dbErr: any) {
      console.warn("[API /api/social/publish] Failed to record initial DB status:", dbErr.message);
    }

    // 2. Call Zernio API
    const result = await publishToZernio({
      videoUrl,
      caption: caption || title || "New Reel",
      title,
      tags,
      firstComment: body.firstComment,
      thumbnailUrl: body.thumbnailUrl,
      thumbOffset: body.thumbOffset,
      platforms,
      scheduledFor,
    });

    // 3. Update Convex DB with individual platform results
    if (result.success && result.platformResults) {
      for (const pr of result.platformResults) {
        try {
          await convex.mutation(api.reels.updateSocialPostStatus, {
            reelId: reelId as Id<"reels">,
            platform: pr.platform,
            accountId: pr.accountId,
            status: pr.status,
            postId: result.postId,
            postUrl: pr.postUrl,
            errorMessage: pr.error,
          });
        } catch (dbErr: any) {
          console.warn(`[API /api/social/publish] DB update error for ${pr.platform}:`, dbErr.message);
        }
      }
    } else if (!result.success) {
      // Mark all requested platforms as failed in Convex
      for (const p of platforms) {
        try {
          await convex.mutation(api.reels.updateSocialPostStatus, {
            reelId: reelId as Id<"reels">,
            platform: p.platform,
            accountId: p.accountId,
            status: "failed",
            errorMessage: result.error || "Publishing failed",
          });
        } catch (dbErr: any) {
          console.warn(`[API /api/social/publish] DB fail update error:`, dbErr.message);
        }
      }
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: any) {
    console.error("[API /api/social/publish] Unexpected error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to publish reel to social platforms." },
      { status: 500 }
    );
  }
}
