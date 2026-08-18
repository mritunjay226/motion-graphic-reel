const { ConvexHttpClient } = require("convex/browser");
const convex = new ConvexHttpClient("https://festive-opossum-355.convex.cloud");

async function main() {
  const reel = await convex.query("reels:getReelById", { reelId: "j57cvehetxv18wft780gmsv73n8ckacf" });
  console.log("REEL TITLE:", reel.topic);
  console.log("REEL THEME:", reel.themeId);
  console.log("TOTAL STORYBOARD ITEMS:", reel.storyboard?.length);
  for (const item of (reel.storyboard || [])) {
    console.log("Item", item.sceneNumber, "layout:", item.layoutType || item.visualType, "bgUrl:", item.imageUrl, "videoUrl:", item.videoUrl, "bRollUrl:", item.bRollUrl);
  }
}
main();
