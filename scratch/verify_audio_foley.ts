import fs from "fs";
import path from "path";
import { executionPlan } from "../src/remotion/data/execution-plan";
import { computeSceneTactileCues, getSfxUrl, SFX_CATALOG } from "../src/remotion/utils/sfxRegistry";

const scenes = executionPlan.scenes;
console.log(`=== AUDITING TACTILE FOLEY & AUDIO SUITE ACROSS ALL ${scenes.length} SCENES ===\n`);

let totalCues = 0;
const allCues: any[] = [];
const missingFiles: string[] = [];
const sfxDir = path.join(process.cwd(), "public/sfx");

scenes.forEach((sc, idx) => {
  const cues = computeSceneTactileCues(sc, idx, scenes.length);
  totalCues += cues.length;
  console.log(`--- Scene ${sc.sceneId} (startFrame=${sc.startFrame}, duration=${sc.durationFrames}) [${cues.length} cues] ---`);

  cues.forEach((c) => {
    const item = SFX_CATALOG[c.soundId];
    const filePath = path.join(sfxDir, item.fileName);
    const exists = fs.existsSync(filePath);

    if (!exists) {
      missingFiles.push(`${c.soundId} (${item.fileName})`);
    }

    console.log(
      `  F ${c.frame.toString().padStart(3, " ")}: [${c.soundId}] vol=${c.volume.toFixed(2)} dur=${c.durationFrames}f - ${c.label} (${exists ? "EXISTS" : "MISSING!"})`
    );
    allCues.push(c);
  });
});

console.log(`\nTotal scene cues generated: ${totalCues}`);

// 1. Verify 3D Spatial Flight Triplet for all transitions (Scenes 1 to 5)
console.log("\n=== VERIFYING 3D SPATIAL FLIGHT CHOREOGRAPHY ===");
for (let i = 1; i < scenes.length; i++) {
  const sc = scenes[i];
  const targetStart = sc.startFrame;

  const takeoffCue = allCues.find(c => c.id === `flight-takeoff-${sc.sceneId}`);
  const swoopCue = allCues.find(c => c.id === `flight-swoop-${sc.sceneId}`);
  const landingCue = allCues.find(c => c.id === `flight-landing-${sc.sceneId}` || c.id === `climax-boom-${sc.sceneId}`);

  console.log(`Transition to Scene ${sc.sceneId} (T=${targetStart}):`);
  console.log(`  Takeoff (T-26 = ${targetStart - 26}): ${takeoffCue ? `PASS (${takeoffCue.soundId} at F${takeoffCue.frame})` : "MISSING!"}`);
  console.log(`  Mid-Air Swoop (T-15 = ${targetStart - 15}): ${swoopCue ? `PASS (${swoopCue.soundId} at F${swoopCue.frame})` : "MISSING!"}`);
  console.log(`  Touchdown (T = ${targetStart}): ${landingCue ? `PASS (${landingCue.soundId} at F${landingCue.frame})` : "MISSING!"}`);
}

// 2. Verify Yellow Marker Highlight Sweeps
console.log("\n=== VERIFYING HEADLINE MARKER HIGHLIGHT ACCENTS ===");
scenes.forEach((sc) => {
  const markerCue = allCues.find(c => c.id === `highlight-marker-${sc.sceneId}`);
  console.log(`Scene ${sc.sceneId}: ${markerCue ? `PASS (${markerCue.soundId} at F${markerCue.frame})` : "MISSING!"}`);
});

// 3. Verify Missing Physical Sound Files
console.log("\n=== PHYSICAL ASSET INTEGRITY ===");
if (missingFiles.length === 0) {
  console.log(">>> [PASS] All referenced Foley sound files physically exist on disk!");
} else {
  console.error(">>> [FAIL] Missing physical sound files:", missingFiles);
}

// 4. Verify Master Concurrency (No more than 3 cues within a 2-frame window)
let concurrencyViolations = 0;
for (let f = 0; f < 900; f++) {
  const count = allCues.filter(c => Math.abs(c.frame - f) <= 2).length;
  if (count > 3) {
    concurrencyViolations++;
    console.warn(`Concurrency warning at Frame ${f}: ${count} active cues`);
  }
}
console.log(`Concurrency headroom violations: ${concurrencyViolations} (Target: 0)`);

console.log("\n>>> FOLEY AUDIT COMPLETE <<<");
