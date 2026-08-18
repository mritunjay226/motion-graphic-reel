import { staticFile } from "remotion";

/**
 * Normalizes an asset URL (video, image, audio) for Remotion:
 * - If it is a local path starting with "/", wraps it with staticFile() so Remotion serves it via localhost HTTP.
 * - If it is an HTTP/HTTPS URL, returns it as-is.
 */
export function resolveAssetUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/")) {
    try {
      return staticFile(url);
    } catch {
      return url;
    }
  }
  return url;
}
