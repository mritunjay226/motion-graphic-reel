const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "out", "BlockbusterNetflixReel", "RedBull_Empire_Master.mp4");
const destPublic = path.join(__dirname, "..", "public", "RedBull_Empire_Master.mp4");
const destArtifacts = "C:\\Users\\mk\\.gemini\\antigravity-ide\\brain\\19ab352d-706d-4c28-80fa-3c80c9e12ce2\\RedBull_Empire_Master.mp4";

if (fs.existsSync(src)) {
  fs.copyFileSync(src, destPublic);
  console.log(`✅ Copied to public: ${destPublic}`);

  const artifactDir = path.dirname(destArtifacts);
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(src, destArtifacts);
    console.log(`✅ Copied to artifacts: ${destArtifacts}`);
  }
} else {
  console.error(`❌ Source video not found at: ${src}`);
}
