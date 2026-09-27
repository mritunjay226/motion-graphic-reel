#!/usr/bin/env node
/**
 * Synchronizes the local Next.js Remotion source code into the Modal container bundle.
 * Ensures 100% byte-for-byte parity between the in-browser Remotion preview and Modal cloud renders.
 *
 * Usage:
 *   node scripts/sync-modal-bundle.mjs
 *   or: npm run sync:modal
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const BUNDLE_DIR = path.join(rootDir, "modal_render", "remotion_bundle");
const SRC_REMOTION = path.join(rootDir, "src", "remotion");
const SRC_LIB = path.join(rootDir, "src", "lib");
const SRC_COMPONENTS = path.join(rootDir, "src", "components");
const PUBLIC_DIR = path.join(rootDir, "public");

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
      copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log("🔄 [Modal Sync] Synchronizing Remotion compositions & assets into modal_render/remotion_bundle...");

// 1. Sync src/remotion
const destRemotion = path.join(BUNDLE_DIR, "src", "remotion");
if (fs.existsSync(destRemotion)) {
  fs.rmSync(destRemotion, { recursive: true, force: true });
}
copyRecursiveSync(SRC_REMOTION, destRemotion);
console.log("  ✅ Synced src/remotion -> modal_render/remotion_bundle/src/remotion");

// 2. Sync src/lib
const destLib = path.join(BUNDLE_DIR, "src", "lib");
if (fs.existsSync(destLib)) {
  fs.rmSync(destLib, { recursive: true, force: true });
}
copyRecursiveSync(SRC_LIB, destLib);
console.log("  ✅ Synced src/lib -> modal_render/remotion_bundle/src/lib");

// 3. Sync src/components
const destComponents = path.join(BUNDLE_DIR, "src", "components");
if (fs.existsSync(destComponents)) {
  fs.rmSync(destComponents, { recursive: true, force: true });
}
copyRecursiveSync(SRC_COMPONENTS, destComponents);
console.log("  ✅ Synced src/components -> modal_render/remotion_bundle/src/components");

// 4. Sync public assets (audio, music, textures)
const destPublic = path.join(BUNDLE_DIR, "public");
if (!fs.existsSync(destPublic)) {
  fs.mkdirSync(destPublic, { recursive: true });
}
copyRecursiveSync(PUBLIC_DIR, destPublic);
console.log("  ✅ Synced public -> modal_render/remotion_bundle/public");

// 5. Config files
const remotionConfig = path.join(rootDir, "remotion.config.ts");
if (fs.existsSync(remotionConfig)) {
  fs.copyFileSync(remotionConfig, path.join(BUNDLE_DIR, "remotion.config.ts"));
}

console.log("🎉 [Modal Sync] Complete! modal_render/remotion_bundle is now 100% in sync with workspace.\n");
