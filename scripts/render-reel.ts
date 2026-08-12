import { ConvexHttpClient } from "convex/browser";
import { convertConvexReelToExecutionPlan } from "../src/remotion/data/execution-plan";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://festive-opossum-355.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

async function main() {
  const reelId = process.argv[2] || "j575hy6y7fqr9ps7wctn1b0k218c41qx";
  const outputFileName = process.argv[3] || `Rendered_Reel_${reelId.slice(0, 8)}.mp4`;

  console.log(`\n🎬 Fetching reel document "${reelId}" from Convex DB (${convexUrl})...`);

  // Query to get reel document
  const reel: any = await convex.query("reels:getReelById" as any, { reelId });

  if (!reel) {
    console.error(`❌ Reel "${reelId}" not found in Convex DB!`);
    process.exit(1);
  }

  console.log(`✅ Found Reel: "${reel.title || reel.topic}" (${reel.storyboard?.length || 0} scenes, status: ${reel.status})`);

  const executionPlan = convertConvexReelToExecutionPlan(reel);

  const inputProps = {
    plan: executionPlan,
    enableAudio: true,
    bgMusicUrl: "http://localhost:3000/music/without_me.mp3",
    bgMusicVolume: reel.bgMusicVolume ?? 0.15,
  };

  const tempPropsPath = path.join(process.cwd(), "temp_props.json");
  fs.writeFileSync(tempPropsPath, JSON.stringify(inputProps, null, 2));

  const outputPath = path.join(process.cwd(), outputFileName);

  console.log(`\n⚡ Rendering Remotion composition "BlockbusterNetflixReel" to MP4...`);
  console.log(`   Output file: ${outputPath}`);

  const renderCmd = `npx remotion render src/remotion/index.ts BlockbusterNetflixReel ${outputFileName} --props=temp_props.json --concurrency=4`;

  try {
    execSync(renderCmd, { stdio: "inherit" });
    console.log(`\n🎉 SUCCESSFULLY RENDERED REEL VIDEO!`);
    console.log(`   Location: ${outputPath}`);
  } catch (err: any) {
    console.error(`❌ Rendering failed:`, err.message);
  } finally {
    if (fs.existsSync(tempPropsPath)) {
      fs.unlinkSync(tempPropsPath);
    }
  }
}

main();
