/**
 * Central ImageKit Asset Ingestion & Background Removal Engine.
 *
 * Direct lib helper for both Inngest background workers and Next.js API routes.
 * Supports remote URLs, base64 data URLs, and pre-fetches image bytes.
 */

const uploadCache = new Map<string, string>();

export interface ImageKitUploadOptions {
  imageUrl: string;
  fileName?: string;
  folder?: string;
  removeBg?: boolean;
}

export interface ImageKitUploadResult {
  success: boolean;
  url: string;
  rawCdnUrl?: string;
  filePath?: string;
  fileId?: string;
  cached?: boolean;
  fallback?: boolean;
  warning?: string;
  error?: string;
}

export async function uploadImageToImageKit({
  imageUrl,
  fileName,
  folder = "/vox-reels",
  removeBg = true,
}: ImageKitUploadOptions): Promise<ImageKitUploadResult> {
  if (!imageUrl) {
    throw new Error("imageUrl parameter is required");
  }

  // Check in-memory cache first
  const cacheKey = `${imageUrl}_${removeBg}`;
  if (uploadCache.has(cacheKey)) {
    return {
      success: true,
      url: uploadCache.get(cacheKey)!,
      cached: true,
    };
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/hyoe84pe5";

  if (!privateKey) {
    // Return raw URL gracefully if IMAGEKIT_PRIVATE_KEY is missing
    return {
      success: true,
      url: imageUrl,
      fallback: true,
    };
  }

  let uploadPayload = imageUrl;

  // If imageUrl is an HTTP/HTTPS remote URL, pre-fetch binary bytes with 12s timeout
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const imgRes = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (imgRes.ok) {
        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = imgRes.headers.get("content-type") || "image/png";
        uploadPayload = `data:${contentType};base64,${buffer.toString("base64")}`;
      } else {
        console.warn(`[ImageKit Lib Pre-fetch Warning ${imgRes.status}] Passing raw URL directly.`);
      }
    } catch (fetchErr: any) {
      console.warn(`[ImageKit Lib Pre-fetch Warning]`, fetchErr.message);
    }
  }

  // Prepare Basic Auth token for ImageKit Upload API
  const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
  const cleanFileName = fileName || `vox_asset_${Date.now()}.png`;

  // ImageKit Upload API payload
  const formData = new FormData();
  formData.append("file", uploadPayload);
  formData.append("fileName", cleanFileName);
  formData.append("useUniqueFileName", "true");
  formData.append("folder", folder);

  try {
    const ikResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!ikResponse.ok) {
      const errorText = await ikResponse.text();
      console.warn(`[ImageKit Upload Warning ${ikResponse.status}]`, errorText);
      return {
        success: true,
        url: imageUrl,
        fallback: true,
        warning: errorText,
      };
    }

    const ikData = await ikResponse.json();
    const rawCdnUrl: string = ikData.url || `${urlEndpoint}${ikData.filePath}`;

    // Apply ImageKit AI Background Removal & WebP Optimization transformation query
    const transformQuery = removeBg
      ? "?tr=e-bg-removal,f-webp,q-90"
      : "?tr=f-webp,q-90";

    const transformedUrl = `${rawCdnUrl}${transformQuery}`;
    uploadCache.set(cacheKey, transformedUrl);

    return {
      success: true,
      url: transformedUrl,
      rawCdnUrl,
      filePath: ikData.filePath,
      fileId: ikData.fileId,
    };
  } catch (error: any) {
    console.error("[ImageKit Upload Lib Exception]", error);
    return {
      success: true,
      url: imageUrl,
      fallback: true,
      error: error.message,
    };
  }
}
