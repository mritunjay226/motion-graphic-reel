/**
 * Smart Internet Asset Fetcher for Vox Video Reels SaaS.
 *
 * Automatically detects if an image prompt refers to a real-world:
 * 1. Person (e.g. Sam Altman, Elon Musk, Stewart Butterfield, Steve Jobs, Jensen Huang)
 * 2. Brand / Company Logo (e.g. OpenAI, Netflix, Nvidia, Apple, Slack, Red Bull, McDonald's)
 * 3. Famous Place or Historical Object (e.g. Concorde, Wall Street, Silicon Valley)
 *
 * Fetches real high-resolution authentic photos & logos directly from Wikipedia API,
 * Clearbit Logo CDN, and Wikimedia Commons before routing to ImageKit for AI background removal.
 */

const LOGO_DOMAIN_MAP: Record<string, string> = {
  openai: "openai.com",
  netflix: "netflix.com",
  nvidia: "nvidia.com",
  apple: "apple.com",
  slack: "slack.com",
  mcdonalds: "mcdonalds.com",
  "mcdonald's": "mcdonalds.com",
  redbull: "redbull.com",
  "red bull": "redbull.com",
  blockbuster: "blockbuster.com",
  google: "google.com",
  microsoft: "microsoft.com",
  meta: "meta.com",
  facebook: "facebook.com",
  amazon: "amazon.com",
  tesla: "tesla.com",
  bitcoin: "bitcoin.org",
  pixar: "pixar.com",
};

interface RealWorldAssetMatch {
  type: "person" | "logo" | "place";
  entityName: string;
  sourceUrl?: string;
}

/**
 * Detects if prompt contains a real-world entity and fetches authentic internet imagery.
 */
export async function fetchRealWorldAssetImage(prompt: string): Promise<string | null> {
  const cleanPrompt = prompt.trim();
  const lowerPrompt = cleanPrompt.toLowerCase();

  // 1. Check for Company / Brand Logo matches
  for (const [brand, domain] of Object.entries(LOGO_DOMAIN_MAP)) {
    if (lowerPrompt.includes(brand)) {
      console.log(`[Web Asset Fetcher] 🏷️ Detected Brand/Logo match: "${brand}" -> Domain: ${domain}`);
      const clearbitUrl = `https://logo.clearbit.com/${domain}?size=800`;
      
      try {
        const checkRes = await fetch(clearbitUrl, { method: "HEAD" });
        if (checkRes.ok) {
          console.log(`[Web Asset Fetcher] ✅ Retrieved official brand logo from Clearbit: ${clearbitUrl}`);
          return clearbitUrl;
        }
      } catch (e) {
        console.warn(`[Web Asset Fetcher Warning] Clearbit check failed for ${domain}`);
      }
    }
  }

  // 2. Extract potential famous person or place entity name
  const entityName = extractEntityNameFromPrompt(cleanPrompt);

  if (entityName) {
    console.log(`[Web Asset Fetcher] 👤 Identified entity candidate: "${entityName}". Querying Wikipedia API...`);
    const wikiImageUrl = await fetchWikipediaEntityImage(entityName);
    if (wikiImageUrl) {
      console.log(`[Web Asset Fetcher] ✅ Retrieved authentic Wikipedia image for "${entityName}": ${wikiImageUrl}`);
      return wikiImageUrl;
    }
  }

  return null;
}

/**
 * Queries Wikipedia REST API for official lead article image of famous people, places, or landmarks.
 */
async function fetchWikipediaEntityImage(entityName: string): Promise<string | null> {
  try {
    const formattedTitle = encodeURIComponent(entityName.replace(/\s+/g, "_"));
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`;

    const res = await fetch(wikiUrl, {
      headers: { "User-Agent": "VoxReelsBot/1.0 (https://voxreels.com; contact@voxreels.com)" },
    });

    if (res.ok) {
      const data = await res.json();
      const imageUrl = data.originalimage?.source || data.thumbnail?.source;
      if (imageUrl && imageUrl.startsWith("http")) {
        return imageUrl;
      }
    }
  } catch (err: any) {
    console.warn(`[Web Asset Fetcher] Wikipedia API lookup failed for "${entityName}":`, err.message);
  }

  return null;
}

/**
 * Parses image prompt to extract proper names of people or famous landmarks.
 */
function extractEntityNameFromPrompt(prompt: string): string | null {
  // Regex to match proper names like "Sam Altman", "Stewart Butterfield", "Steve Jobs", "Elon Musk", "Concorde"
  const namePatterns = [
    /(?:portrait|cutout|photo|image|picture)\s+(?:of\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
    /(?:Stewart Butterfield|Sam Altman|Elon Musk|Steve Jobs|Bill Gates|Jensen Huang|Satya Nadella|Mark Zuckerberg|Jeff Bezos|Satoshi Nakamoto|Concorde|Wall Street)/i,
  ];

  for (const pattern of namePatterns) {
    const match = prompt.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return null;
}
