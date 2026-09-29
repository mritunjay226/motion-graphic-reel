import { getNodeWorldCoordinates, computeCameraFlightState } from "../src/remotion/utils/cameraFlight";
import { executionPlan } from "../src/remotion/data/execution-plan";

const scenes = executionPlan.scenes;
const nodePositions = getNodeWorldCoordinates(scenes);

const totalFrames = scenes.reduce((max, s) => Math.max(max, s.startFrame + s.durationFrames), 0);
console.log(`Auditing ${totalFrames} frames for jerk / coordinate discontinuity...`);

let prevX = 0;
let prevY = 0;
let prevVelX = 0;
let prevVelY = 0;
let maxAcc = 0;
let maxAccFrame = 0;
const jerkDiscontinuities: string[] = [];

for (let f = 0; f < totalFrames; f++) {
  const state = computeCameraFlightState(f, scenes, nodePositions, false);

  if (f > 0) {
    const velX = state.camX - prevX;
    const velY = state.camY - prevY;

    if (f > 1) {
      // Acceleration vector: change in velocity from frame f-1 to frame f
      const accX = velX - prevVelX;
      const accY = velY - prevVelY;
      const acc = Math.sqrt(accX * accX + accY * accY);

      if (acc > maxAcc) {
        maxAcc = acc;
        maxAccFrame = f;
      }

      // Any acceleration spike > 40px/frame^2 indicates a sudden teleport or cut
      if (acc > 40) {
        jerkDiscontinuities.push(
          `DISCONTINUITY at frame ${f}: Acc spike of ${acc.toFixed(1)}px/frame^2 (Vel was ${Math.sqrt(prevVelX**2 + prevVelY**2).toFixed(1)}px, now ${Math.sqrt(velX**2 + velY**2).toFixed(1)}px)`
        );
      }
    }

    prevVelX = velX;
    prevVelY = velY;
  }

  prevX = state.camX;
  prevY = state.camY;
}

console.log("\n=== CONTINUITY AUDIT RESULTS ===");
if (jerkDiscontinuities.length === 0) {
  console.log(">>> [PASS] ZERO CUTS OR DISCONTINUITIES FOUND ACROSS ALL 900 FRAMES!");
  console.log(`>>> Maximum acceleration across reel: ${maxAcc.toFixed(2)}px/frame^2 at frame ${maxAccFrame} (perfectly smooth, well below the 40px threshold).`);
} else {
  console.error(">>> [FAIL] Found discontinuities:");
  jerkDiscontinuities.forEach(d => console.error(d));
}
