/**
 * Normalizes an asset URL (video, image, audio) for Remotion:
 * - Automatically heals broken third-party domains (e.g. mixkit.co, gtv-videos-bucket) that return 403 Forbidden S3 XML.
 * - If it is a local path starting with "/", wraps it with staticFile() when in Remotion runtime.
 * - Safe for both Next.js server runtime (API routes, Inngest) and client components.
 */
const BROKEN_URL_MAP: Record<string, string> = {
  "mixkit-server-room": "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/cld-sample-video.mp4",
  "mixkit-circuit-board": "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/sea_turtle.mp4",
  "mixkit-stock-market": "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/snow_horses.mp4",
  "mixkit-hands-of-a-businessman": "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/elephants.mp4",
  "mixkit-business-people": "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/dog.mp4",
  "mixkit-printing-machine": "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/kitten_fighting.mp4",
};

export const PRESET_MUSIC_URL_MAP: Record<string, string> = {
  "/music/documentary_pulse.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
  "documentary_pulse.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
  "/music/tech_explainer.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713682/vox-reels/music/tech_explainer.mp3",
  "tech_explainer.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713682/vox-reels/music/tech_explainer.mp3",
  "/music/cyber_beat.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713674/vox-reels/music/cyber_beat.mp3",
  "cyber_beat.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713674/vox-reels/music/cyber_beat.mp3",
  "/music/chill_lofi.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713666/vox-reels/music/chill_lofi.mp3",
  "chill_lofi.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713666/vox-reels/music/chill_lofi.mp3",
  "/music/cinematic_strings.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713668/vox-reels/music/cinematic_strings.mp3",
  "cinematic_strings.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713668/vox-reels/music/cinematic_strings.mp3",
  "/music/dark_suspense.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713676/vox-reels/music/dark_suspense.mp3",
  "dark_suspense.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713676/vox-reels/music/dark_suspense.mp3",
  "/music/curious_explainer.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713671/vox-reels/music/curious_explainer.mp3",
  "curious_explainer.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713671/vox-reels/music/curious_explainer.mp3",
  "/music/without_me.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713683/vox-reels/music/without_me.mp3",
  "without_me.mp3": "https://res.cloudinary.com/diah8zonu/video/upload/v1788713683/vox-reels/music/without_me.mp3",
};

export function resolveAssetUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";

  // Auto-resolve local preset music paths to permanent Cloudinary CDN URLs
  for (const [key, cdnUrl] of Object.entries(PRESET_MUSIC_URL_MAP)) {
    if (url === key || url.endsWith(key)) {
      return cdnUrl;
    }
  }

  // Auto-heal broken/blocked domains (e.g. mixkit blocks hotlinking with 403 S3 XML)
  if (url.includes("mixkit.co") || url.includes("gtv-videos-bucket")) {
    for (const [key, replacement] of Object.entries(BROKEN_URL_MAP)) {
      if (url.includes(key)) return replacement;
    }
    return "https://res.cloudinary.com/demo/video/upload/c_scale,w_1280/cld-sample-video.mp4";
  }

  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/")) {
    try {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const remotion = require("remotion");
        if (typeof remotion.staticFile === "function") {
          return remotion.staticFile(url);
        }
      }
      return url;
    } catch {
      return url;
    }
  }
  return url;
}
