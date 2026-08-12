import type { ExecutionPlan } from "../types";

export interface ImageKitUploadResult {
  imageUrl: string;
  imageKitUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Uploads a single image URL to ImageKit CDN via /api/imagekit/upload and returns the transformed ImageKit URL.
 */
export async function uploadImageToImageKit(
  imageUrl: string,
  fileName?: string,
  removeBg = true
): Promise<string> {
  // If already an ImageKit URL, return with transformation params
  if (imageUrl.includes("ik.imagekit.io")) {
    const baseUrl = imageUrl.split("?")[0];
    const tr = removeBg ? "?tr=e-bg-removal,f-webp,q-90" : "?tr=f-webp,q-90";
    return `${baseUrl}${tr}`;
  }

  try {
    const response = await fetch("/api/imagekit/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, fileName, removeBg }),
    });

    if (!response.ok) {
      console.warn("ImageKit upload returned non-ok status, falling back to original URL.");
      return imageUrl;
    }

    const data = await response.json();
    if (data.success && data.url) {
      return data.url;
    }

    return imageUrl;
  } catch (err) {
    console.error("Error uploading image to ImageKit:", err);
    return imageUrl;
  }
}

/**
 * Batch uploads all scene assets in an ExecutionPlan to ImageKit CDN
 * and returns an updated ExecutionPlan with ImageKit CDN URLs.
 */
export async function uploadPlanAssetsToImageKit(
  plan: ExecutionPlan,
  onProgress?: (current: number, total: number, status: string) => void
): Promise<ExecutionPlan> {
  const updatedPlan: ExecutionPlan = JSON.parse(JSON.stringify(plan));
  let totalTasks = 0;
  let completedTasks = 0;

  // Calculate total images to upload
  for (const scene of updatedPlan.scenes) {
    if (scene.imageKitUrls.background) totalTasks++;
    if (scene.imageKitUrls.foreground) totalTasks++;
    if (scene.imageKitUrls.props) totalTasks += scene.imageKitUrls.props.length;
  }

  for (const scene of updatedPlan.scenes) {
    // 1. Upload background image
    if (scene.imageKitUrls.background) {
      onProgress?.(completedTasks, totalTasks, `Scene ${scene.sceneId}: Uploading Background...`);
      scene.imageKitUrls.background = await uploadImageToImageKit(
        scene.imageKitUrls.background,
        `scene_${scene.sceneId}_bg.png`,
        false
      );
      completedTasks++;
    }

    // 2. Upload foreground subject cutout with AI Background Removal
    if (scene.imageKitUrls.foreground) {
      onProgress?.(completedTasks, totalTasks, `Scene ${scene.sceneId}: Uploading & Removing BG for Subject...`);
      scene.imageKitUrls.foreground = await uploadImageToImageKit(
        scene.imageKitUrls.foreground,
        `scene_${scene.sceneId}_fg.png`,
        true
      );
      completedTasks++;
    }

    // 3. Upload props with AI Background Removal
    if (scene.imageKitUrls.props && scene.imageKitUrls.props.length > 0) {
      for (let i = 0; i < scene.imageKitUrls.props.length; i++) {
        onProgress?.(completedTasks, totalTasks, `Scene ${scene.sceneId}: Uploading Prop ${i + 1}...`);
        scene.imageKitUrls.props[i] = await uploadImageToImageKit(
          scene.imageKitUrls.props[i],
          `scene_${scene.sceneId}_prop_${i + 1}.png`,
          true
        );
        completedTasks++;
      }
    }
  }

  onProgress?.(completedTasks, totalTasks, "All assets uploaded to ImageKit successfully!");
  return updatedPlan;
}
