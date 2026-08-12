#!/bin/bash
# ─── Vox Reels — Modal Rendering Backend Deployment ─────────────────────────
# 
# Prerequisites:
#   1. pip install modal
#   2. modal setup  (authenticate with Modal.com)
#   3. Create secrets:
#      modal secret create vox-reels-secrets \
#        CLOUDINARY_CLOUD_NAME=your_cloud_name \
#        CLOUDINARY_API_KEY=your_api_key \
#        CLOUDINARY_API_SECRET=your_api_secret \
#        CONVEX_URL=https://your-deployment.convex.cloud \
#        RENDER_SECRET=a_strong_shared_secret
#
# Usage:
#   ./modal_render/deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo "🔧 Preparing Remotion bundle for Modal container..."

# Copy Remotion source files into the bundle directory
BUNDLE_DIR="modal_render/remotion_bundle"
SRC_REMOTION="src/remotion"

# Clean previous bundle source
rm -rf "$BUNDLE_DIR/src"
mkdir -p "$BUNDLE_DIR/src/remotion"

# Copy Remotion composition code
cp -r "$SRC_REMOTION/." "$BUNDLE_DIR/src/remotion/"

# Copy remotion config
cp remotion.config.ts "$BUNDLE_DIR/"

# Copy tsconfig for the bundle
cp tsconfig.json "$BUNDLE_DIR/"

# Copy shared lib & component utilities needed by compositions
mkdir -p "$BUNDLE_DIR/src/lib"
if [ -d "src/lib" ]; then
  cp -r src/lib/. "$BUNDLE_DIR/src/lib/"
fi
if [ -d "src/components" ]; then
  mkdir -p "$BUNDLE_DIR/src/components"
  cp -r src/components/. "$BUNDLE_DIR/src/components/"
fi

# Copy public assets (music, fonts, etc.)
if [ -d "public" ]; then
  cp -r public "$BUNDLE_DIR/"
fi

echo "✅ Remotion bundle prepared"
echo ""
echo "🚀 Deploying Modal rendering function..."

modal deploy modal_render/app.py

echo ""
echo "✅ Modal deployment complete!"
echo "📋 Your render endpoint URL will be printed above by Modal."
echo "   Copy it and add it to your .env.local as MODAL_RENDER_ENDPOINT"
