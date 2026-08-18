/**
 * ImageKit URL Transformation & Real-Time AI Background Removal Helper
 */

export interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  cropMode?: "maintain_ratio" | "force" | "at_max" | "at_least" | "extract";
  focus?: "auto" | "face" | "center";
  format?: "webp" | "png" | "jpg" | "auto";
  quality?: number;
  removeBg?: boolean; // Appends e-bg-removal for ImageKit AI Background Removal
  contrast?: boolean;
  sharpen?: boolean;
  blur?: number;
  grayscale?: boolean;
}

/**
 * Transforms any image URL or path through ImageKit's real-time AI background removal engine.
 *
 * Example Proxy Output:
 * https://ik.imagekit.io/motionreels/tr:e-bg-removal,f-webp/https://example.com/asset.png
 */
export function buildImageKitUrl(
  imagePathOrUrl: string,
  options: ImageKitTransformOptions = {}
): string {
  if (!imagePathOrUrl) return "";

  // If already a local cache path, localhost URL, or data URI, do not proxy through ImageKit
  if (
    imagePathOrUrl.startsWith("/cache/") ||
    imagePathOrUrl.startsWith("http://localhost") ||
    imagePathOrUrl.startsWith("data:") ||
    imagePathOrUrl.startsWith("file:")
  ) {
    return imagePathOrUrl;
  }

  const urlEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    "https://ik.imagekit.io/motionreels";

  const {
    width = 1080,
    height = 1920,
    format = "webp",
    quality = 90,
    removeBg = true, // Always execute AI background removal by default
    contrast = false,
    grayscale = false,
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w-${width}`);
  if (height) transforms.push(`h-${height}`);
  if (format) transforms.push(`f-${format}`);
  if (quality) transforms.push(`q-${quality}`);

  // ImageKit AI Background Removal Filter Syntax
  if (removeBg) {
    transforms.push("e-bg-removal");
  }

  if (contrast) transforms.push("e-contrast");
  if (grayscale) transforms.push("e-grayscale");

  const transformString = transforms.length > 0 ? `tr:${transforms.join(",")}` : "";

  // Handle direct ImageKit CDN URLs
  if (imagePathOrUrl.includes("ik.imagekit.io")) {
    const baseUrl = imagePathOrUrl.split("?")[0];
    return `${baseUrl}?tr=${transforms.join(",")}`;
  }

  // Proxy external HTTP image URLs through ImageKit's AI BG Removal pipeline
  if (imagePathOrUrl.startsWith("http://") || imagePathOrUrl.startsWith("https://")) {
    return `${urlEndpoint}/${transformString}/${imagePathOrUrl}`;
  }

  const cleanPath = imagePathOrUrl.startsWith("/") ? imagePathOrUrl.slice(1) : imagePathOrUrl;
  return `${urlEndpoint}/${cleanPath}?tr=${transforms.join(",")}`;
}
