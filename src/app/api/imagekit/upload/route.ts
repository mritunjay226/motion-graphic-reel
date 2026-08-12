import { NextRequest, NextResponse } from "next/server";

/** In-memory cache to prevent uploading the same image multiple times */
const uploadCache = new Map<string, string>();

/**
 * POST /api/imagekit/upload
 *
 * Pre-fetches binary image data into Base64 (if remote URL) and uploads directly
 * into the user's ImageKit media library using IMAGEKIT_PRIVATE_KEY.
 *
 * Returns the permanent ImageKit CDN URL with AI Background Removal (?tr=e-bg-removal) applied.
 * Gracefully falls back to raw URL if ImageKit API fails so 400 errors never block the pipeline.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, fileName, folder = "/vox-reels", removeBg = true } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl parameter is required" },
        { status: 400 }
      );
    }

    // Check in-memory cache first
    const cacheKey = `${imageUrl}_${removeBg}`;
    if (uploadCache.has(cacheKey)) {
      return NextResponse.json({
        success: true,
        url: uploadCache.get(cacheKey),
        cached: true,
      });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/hyoe84pe5";

    if (!privateKey) {
      // Return raw URL gracefully if IMAGEKIT_PRIVATE_KEY is missing
      return NextResponse.json({
        success: true,
        url: imageUrl,
        fallback: true,
      });
    }

    let uploadPayload = imageUrl;

    // If imageUrl is an HTTP/HTTPS remote URL, pre-fetch binary bytes with 12s timeout
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      try {
        console.log(`[ImageKit Route] Pre-fetching image bytes from: ${imageUrl.slice(0, 80)}...`);
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
          console.log(`[ImageKit Route] Successfully converted image to base64 (${buffer.length} bytes)`);
        } else {
          console.warn(`[ImageKit Route Pre-fetch Warning ${imgRes.status}] Could not pre-fetch image bytes, passing raw URL.`);
        }
      } catch (fetchErr: any) {
        console.warn(`[ImageKit Route Pre-fetch Error]`, fetchErr.message);
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
      // Return raw URL gracefully so pipeline never fails with 400
      return NextResponse.json({
        success: true,
        url: imageUrl,
        fallback: true,
        warning: errorText,
      });
    }

    const ikData = await ikResponse.json();
    const rawCdnUrl: string = ikData.url || `${urlEndpoint}${ikData.filePath}`;

    // Apply ImageKit AI Background Removal & WebP Optimization transformation query
    const transformQuery = removeBg
      ? "?tr=e-bg-removal,f-webp,q-90"
      : "?tr=f-webp,q-90";

    const transformedUrl = `${rawCdnUrl}${transformQuery}`;

    // Store in cache
    uploadCache.set(cacheKey, transformedUrl);

    return NextResponse.json({
      success: true,
      url: transformedUrl,
      rawCdnUrl,
      filePath: ikData.filePath,
      fileId: ikData.fileId,
    });
  } catch (error: any) {
    console.error("ImageKit Upload exception:", error);
    // Graceful fallback to raw image URL or placeholder
    return NextResponse.json({
      success: true,
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1400'><rect width='100%' height='100%' fill='%23111'/></svg>",
      fallback: true,
      error: error.message,
    });
  }
}
