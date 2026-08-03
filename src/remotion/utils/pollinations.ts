/**
 * Pollinations AI Image Generation Pipeline Helper
 * Generates direct image URLs via Pollinations.ai image endpoint.
 */

export interface PollinationsOptions {
  width?: number;
  height?: number;
  model?: "flux" | "flux-realism" | "turbo" | "sana";
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

/**
 * Builds a valid Pollinations AI image URL for a given prompt.
 *
 * Example URL:
 * https://image.pollinations.ai/prompt/a%20dramatic%20storefront?width=1080&height=1920&model=flux&nologo=true&seed=42
 */
export function getPollinationsImageUrl(
  prompt: string,
  options: PollinationsOptions = {}
): string {
  const {
    width = 1080,
    height = 1920,
    model = "flux",
    seed = 42,
    nologo = true,
    enhance = false,
  } = options;

  // Clean prompt and append quality keywords if needed
  let cleanedPrompt = prompt.trim();
  if (enhance) {
    cleanedPrompt += ", 8k resolution, cinematic lighting, masterpiece, hyperdetailed";
  }

  const encodedPrompt = encodeURIComponent(cleanedPrompt);

  const queryParams = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    model,
    seed: seed.toString(),
    nologo: nologo ? "true" : "false",
  });

  return `https://image.pollinations.ai/prompt/${encodedPrompt}?${queryParams.toString()}`;
}

/**
 * Available Pollinations AI models metadata
 */
export const POLLINATIONS_MODELS = [
  { id: "flux", name: "Flux (Default)", description: "High detail & prompt accuracy" },
  { id: "flux-realism", name: "Flux Realism", description: "Photorealistic cinematic look" },
  { id: "turbo", name: "Turbo (Fast)", description: "Ultra-fast generation speed" },
  { id: "sana", name: "Sana", description: "Vibrant high-contrast art style" },
] as const;
