const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const convexUrl = "https://festive-opossum-355.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

async function main() {
  const reelId = "j575hy6y7fqr9ps7wctn1b0k218c41qx";
  const outputFile = "RedBull_Reel_Master.mp4";

  console.log(`fetching reel ${reelId}...`);
  const reel = await convex.query("reels:getReelById", { reelId });

  if (!reel) {
    console.error("Reel not found!");
    process.exit(1);
  }

  // Import execution plan converter
  const { convertConvexReelToExecutionPlan } = require("../src/remotion/data/execution-plan");
  const plan = convertConvexReelToExecutionPlan(reel);

  const inputProps = {
    plan,
    enableAudio: true,
    bgMusicUrl: reel.bgMusicUrl || "/music/without_me.mp3",
    bgMusicVolume: reel.bgMusicVolume ?? 0.15,
  };

  const propsPath = path.join(__dirname, "render_props.json");
  fs.writeFileSync(propsPath, JSON.stringify(inputProps, null, 2));

  const outPath = path.join(__dirname, "..", outputFile);
  console.log(`rendering to ${outPath}...`);

  const cmd = `npx remotion render src/remotion/index.ts BlockbusterNetflixReel "${outPath}" --props="${propsPath}" --concurrency=4`;
  execSync(cmd, { stdio: "inherit" });

  console.log(`SUCCESS! Saved video to ${outPath}`);
  if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
}

main().catch((err) => {
  console.error("Render script error:", err);
  process.exit(1);
});
