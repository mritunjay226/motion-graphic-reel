import { ConvexHttpClient } from "convex/browser";
import { convertConvexReelToExecutionPlan } from "../src/remotion/data/execution-plan";
import { resolveAssetUrl } from "../src/remotion/utils/resolveAsset";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://festive-opossum-355.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

async function testModalRender() {
  const reelId = process.argv[2] || "j57cvehetxv18wft780gmsv73n8ckacf";
  console.log(`\n🎬 Fetching reel "${reelId}" from Convex DB (${convexUrl})...`);

  const reel: any = await convex.query("reels:getReelById" as any, { reelId });

  if (!reel) {
    console.error(`❌ Reel ${reelId} not found in Convex DB`);
    process.exit(1);
  }

  console.log(`✅ Found Reel: "${reel.title || reel.topic}" (${reel.storyboard?.length || 0} scenes)`);

  const executionPlan = convertConvexReelToExecutionPlan(reel);

  const inputProps = {
    plan: executionPlan,
    themeId: reel.themeId || "vox_explainer",
    enableAudio: true,
    enableSfx: true,
    sfxVolume: 1.0,
    bgMusicUrl: resolveAssetUrl(reel.bgMusicUrl || "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3"),
    bgMusicVolume: reel.bgMusicVolume ?? 0.15,
  };

  const modalEndpoint = "https://mishramritunjay45--vox-reels-renderer-render-endpoint.modal.run";
  console.log(`\n🚀 Triggering render on Modal endpoint:\n   ${modalEndpoint}\n`);

  const initialVideoUrl = reel.videoUrl;

  const res = await fetch(modalEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reelId,
      inputPropsJson: JSON.stringify(inputProps),
      compositionId: "BlockbusterNetflixReel",
      fps: executionPlan.projectMeta.fps || 30,
      width: executionPlan.projectMeta.width || 1080,
      height: executionPlan.projectMeta.height || 1920,
      secret: "vox-reels-render-secret-change-me",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ Modal endpoint error (${res.status}):`, errText);
    process.exit(1);
  }

  const data = await res.json();
  console.log(`✅ Modal Response:`, data);

  if (data.status === "rendering" || data.callId) {
    console.log(`\n⏳ Render task spawned on Modal. Call ID: ${data.callId}`);
    console.log(`   Polling Convex DB reactively for render completion...\n`);

    const startTime = Date.now();
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      const updated: any = await convex.query("reels:getReelById" as any, { reelId });
      console.log(`   [${elapsed}s] Status: ${updated?.status} | VideoUrl: ${updated?.videoUrl || "none"}`);

      if (updated?.status === "completed" && updated?.videoUrl && updated.videoUrl !== initialVideoUrl) {
        console.log(`\n🎉 RENDER SUCCESSFUL!`);
        console.log(`🎬 Cloudinary MP4 URL: ${updated.videoUrl}`);
        if (updated.renderDurationMs) {
          console.log(`⚡ Total Render Time: ${(updated.renderDurationMs / 1000).toFixed(1)}s`);
        }
        return;
      }

      if (updated?.status === "failed") {
        console.error(`\n❌ RENDER FAILED:`, updated.errorMessage || "Unknown error");
        process.exit(1);
      }
    }
    console.log("\n⚠️ Timed out waiting for render completion after 180s");
  }
}

testModalRender().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
