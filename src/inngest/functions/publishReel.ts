import { inngest } from "../client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { publishToZernio } from "@/lib/zernio";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

/**
 * Inngest Background Function: Handles durable social media video publishing via Zernio.
 *
 * Triggered by: `reel/publish.requested`
 * Flow:
 * 1. Fetch reel from Convex DB & verify videoUrl
 * 2. Send multi-platform post request to Zernio API
 * 3. Update Convex DB reel record with published post IDs & URLs
 */
export const publishReelPipeline = (inngest.createFunction as any)(
  {
    id: "publish-reel-pipeline",
    name: "Publish Video to Instagram & YouTube via Zernio",
    retries: 2,
    triggers: [{ event: "reel/publish.requested" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { reelId, platforms, caption, title, tags, scheduledFor } = event.data;

    // Step 1: Verify Reel in Convex DB
    const reel = await step.run("1-verify-reel", async () => {
      console.log(`[Publish Step 1] Fetching reel ${reelId} from Convex DB...`);
      const doc = await convex.query(api.reels.getReelById, {
        reelId: reelId as Id<"reels">,
      });

      if (!doc) {
        throw new Error(`Reel ${reelId} not found in Convex DB`);
      }

      if (!doc.videoUrl) {
        throw new Error(`Reel ${reelId} has no rendered videoUrl to publish`);
      }

      return doc;
    });

    // Step 2: Record initial pending status in Convex DB
    await step.run("2-record-pending-status", async () => {
      const initialPosts = platforms.map((p: any) => ({
        platform: p.platform,
        accountId: p.accountId,
        accountName: p.accountName,
        status: "pending" as const,
        publishedAt: Date.now(),
      }));

      await convex.mutation(api.reels.recordSocialPublish, {
        reelId: reelId as Id<"reels">,
        posts: initialPosts,
      });
    });

    // Step 3: Call Zernio API
    const publishResult = await step.run("3-call-zernio-publish", async () => {
      console.log(`[Publish Step 3] Posting to Zernio for reel ${reelId}...`);
      const result = await publishToZernio({
        videoUrl: reel.videoUrl!,
        caption: caption || reel.title,
        title: title || reel.title,
        tags: tags || [],
        platforms,
        scheduledFor,
      });

      if (!result.success) {
        throw new Error(`Zernio publishing failed: ${result.error}`);
      }

      return result;
    });

    // Step 4: Update Convex DB with finalized status
    await step.run("4-sync-convex-status", async () => {
      console.log(`[Publish Step 4] Syncing post status back to Convex DB...`);
      if (publishResult.platformResults) {
        for (const pr of publishResult.platformResults) {
          await convex.mutation(api.reels.updateSocialPostStatus, {
            reelId: reelId as Id<"reels">,
            platform: pr.platform,
            accountId: pr.accountId,
            status: pr.status,
            postId: publishResult.postId,
            postUrl: pr.postUrl,
            errorMessage: pr.error,
          });
        }
      }
    });

    return {
      status: "completed",
      reelId,
      postId: publishResult.postId,
      platformResults: publishResult.platformResults,
    };
  }
);
