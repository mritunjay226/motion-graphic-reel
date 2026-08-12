import { inngest } from "../client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { convertConvexReelToExecutionPlan } from "@/remotion/data/execution-plan";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(convexUrl);

/**
 * Inngest Background Function: Handles durable video rendering requests.
 *
 * Triggered by: `reel/render.requested`
 * Flow:
 * 1. Fetch reel from Convex DB & build Remotion ExecutionPlan
 * 2. POST to Modal cloud render endpoint
 * 3. Update Convex DB status to "rendering" with Modal callId
 */
export const renderReelPipeline = (inngest.createFunction as any)(
  {
    id: "render-reel-pipeline",
    name: "Render Video via Modal Cloud Backend",
    retries: 2,
    triggers: [{ event: "reel/render.requested" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { reelId, themeId, bgMusicUrl, bgMusicVolume } = event.data;

    // Step 1: Fetch reel from Convex DB & prepare ExecutionPlan
    const { executionPlan, reel } = await step.run("1-fetch-reel", async () => {
      console.log(`[Render Step 1] Fetching reel ${reelId} from Convex DB...`);
      const reelDoc = await convex.query(api.reels.getReelById, {
        reelId: reelId as Id<"reels">,
      });

      if (!reelDoc) {
        throw new Error(`Reel ${reelId} not found in Convex DB`);
      }
      if (!reelDoc.storyboard || reelDoc.storyboard.length === 0) {
        throw new Error(`Reel ${reelId} has no storyboard data`);
      }

      const plan = convertConvexReelToExecutionPlan(reelDoc);
      return { executionPlan: plan, reel: reelDoc };
    });

    // Step 2: Trigger Modal cloud render endpoint
    const modalData = await step.run("2-call-modal-render", async () => {
      console.log(`[Render Step 2] Calling Modal HTTP endpoint for reel ${reelId}...`);
      const modalEndpoint = process.env.MODAL_RENDER_ENDPOINT;
      if (!modalEndpoint) {
        throw new Error("MODAL_RENDER_ENDPOINT is not configured.");
      }

      const inputProps = {
        plan: executionPlan,
        themeId: themeId || reel.themeId || "vox_explainer",
        enableAudio: true,
        bgMusicUrl: bgMusicUrl || reel.bgMusicUrl || "/music/without_me.mp3",
        bgMusicVolume: bgMusicVolume ?? reel.bgMusicVolume ?? 0.15,
      };

      const renderSecret = process.env.RENDER_SECRET || "";

      const modalResponse = await fetch(modalEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId,
          inputPropsJson: JSON.stringify(inputProps),
          compositionId: "BlockbusterNetflixReel",
          fps: executionPlan.projectMeta.fps,
          width: executionPlan.projectMeta.width,
          height: executionPlan.projectMeta.height,
          secret: renderSecret,
        }),
      });

      if (!modalResponse.ok) {
        const errorText = await modalResponse.text();
        throw new Error(`Modal render endpoint error (${modalResponse.status}): ${errorText.slice(0, 200)}`);
      }

      return await modalResponse.json();
    });

    // Step 3: Update Convex status to "rendering"
    await step.run("3-update-convex-rendering", async () => {
      console.log(`[Render Step 3] Updating Convex reel ${reelId} status to 'rendering', callId: ${modalData?.callId}`);
      await convex.mutation(api.reels.startRender, {
        reelId: reelId as Id<"reels">,
        modalCallId: modalData?.callId || "",
      });
    });

    return { status: "rendering", reelId, callId: modalData?.callId };
  }
);
