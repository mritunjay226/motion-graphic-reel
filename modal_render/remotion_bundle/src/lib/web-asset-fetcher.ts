/**
 * Multi-Source Authentic Web Image & Archival Media Fetcher for Vox Reels.
 *
 * 100% Real-World Media Sourcing:
 * - Brand Logos via Clearbit & Logo.dev
 * - Famous People, Companies, Events & Objects via Wikipedia & Wikimedia REST APIs
 * - 4K Stock Photography via Pexels & Pixabay Photo APIs
 * - Clean 2.5D Vector Infographics via generateSvgVectorStickerUrl
 *
 * Replaces synthetic AI image generation with authentic internet media and vector graphics.
 */

import { generateSvgVectorStickerUrl } from "@/remotion/utils/vector-assets";

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
  lego: "lego.com",
  starwars: "starwars.com",
  "star wars": "starwars.com",
  disney: "disney.com",
  marvel: "marvel.com",
  nike: "nike.com",
  adidas: "adidas.com",
  rolex: "rolex.com",
  boeing: "boeing.com",
  spacex: "spacex.com",
  uber: "uber.com",
  airbnb: "airbnb.com",
  spotify: "spotify.com",
};

/**
 * Searches Pexels Photo API for high-resolution photography.
 */
async function searchPexelsPhotos(query: string): Promise<string | null> {
  const pexelsKey = process.env.PEXELS_API_KEY || "";
  if (!pexelsKey) return null;

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=square`;
    const res = await fetch(url, {
      headers: { Authorization: pexelsKey },
    });

    if (res.ok) {
      const data = await res.json();
      const photos: any[] = data.photos || [];
      if (photos.length > 0 && photos[0].src?.large) {
        return photos[0].src.large;
      }
    }
  } catch (err: any) {
    console.warn(`[Web Asset Fetcher] Pexels photo search warning:`, err.message);
  }
  return null;
}

/**
 * Searches Pixabay Photo API for royalty-free photography.
 */
async function searchPixabayPhotos(query: string): Promise<string | null> {
  const pixabayKey = process.env.PIXABAY_API_KEY || "";
  if (!pixabayKey) return null;

  try {
    const url = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`;
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      const hits: any[] = data.hits || [];
      if (hits.length > 0 && (hits[0].largeImageURL || hits[0].webformatURL)) {
        return hits[0].largeImageURL || hits[0].webformatURL;
      }
    }
  } catch (err: any) {
    console.warn(`[Web Asset Fetcher] Pixabay photo search warning:`, err.message);
  }
  return null;
}

/**
 * Searches Wikipedia REST API for lead images or search results.
 */
async function searchWikipediaImage(query: string): Promise<string | null> {
  try {
    // 1. Direct page summary
    const formattedTitle = encodeURIComponent(query.trim().replace(/\s+/g, "_"));
    const directUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`;

    const res = await fetch(directUrl, {
      headers: { "User-Agent": "VoxReelsBot/1.0 (https://voxreels.com; contact@voxreels.com)" },
    });

    if (res.ok) {
      const data = await res.json();
      const imageUrl = data.originalimage?.source || data.thumbnail?.source;
      if (imageUrl && imageUrl.startsWith("http")) {
        return imageUrl;
      }
    }

    // 2. Wikipedia OpenSearch for fuzzy topic matches
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);

    if (searchRes.ok) {
      const sData = await searchRes.json();
      const pages = sData.query?.pages;
      if (pages) {
        for (const pageId of Object.keys(pages)) {
          const page = pages[pageId];
          if (page.thumbnail?.source) {
            return page.thumbnail.source;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Web Asset Fetcher] Wikipedia lookup warning for "${query}":`, err.message);
  }

  return null;
}

/**
 * Searches Wikimedia Commons for public domain & royalty-free photos.
 */
async function searchWikimediaCommonsImage(query: string): Promise<string | null> {
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query + " filetype:bitmap")}&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
    const res = await fetch(commonsUrl);

    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        for (const pageId of Object.keys(pages)) {
          const page = pages[pageId];
          const imageInfo = page.imageinfo?.[0];
          const thumbUrl = imageInfo?.thumburl || imageInfo?.url;
          if (thumbUrl && (thumbUrl.endsWith(".jpg") || thumbUrl.endsWith(".png") || thumbUrl.endsWith(".webp") || thumbUrl.includes("/thumb/"))) {
            return thumbUrl;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Web Asset Fetcher] Wikimedia Commons search warning:`, err.message);
  }

  return null;
}

/**
 * Cleans prompt into clean search keywords (removes filler terms like "isolated single subject on white background").
 */
function cleanPromptForSearch(prompt: string): string {
  return prompt
    .replace(/(?:isolated|single subject|on solid white background|clean sticker|png sticker|portrait cutout|cutout of|photo of|image of|picture of|detailed cutout|representing|related to)/gi, "")
    .replace(/,.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches an authentic real-world asset image (Logo, Wikipedia photo, Pexels/Pixabay photo, or 2.5D Vector).
 * Guaranteed to NEVER return null or make synthetic AI hallucination calls.
 */
export async function fetchRealWorldAssetImage(prompt: string): Promise<string> {
  const cleanPrompt = cleanPromptForSearch(prompt);
  const lowerPrompt = prompt.toLowerCase();

  console.log(`[Web Asset Fetcher] 🌐 Sourcing authentic web asset for: "${cleanPrompt}"...`);

  // 1. Check Brand / Company Logo Matches
  for (const [brand, domain] of Object.entries(LOGO_DOMAIN_MAP)) {
    if (lowerPrompt.includes(brand)) {
      const clearbitUrl = `https://logo.clearbit.com/${domain}?size=800`;
      try {
        const checkRes = await fetch(clearbitUrl, { method: "HEAD" });
        if (checkRes.ok) {
          console.log(`[Web Asset Fetcher] ✅ Retrieved official brand logo for "${brand}": ${clearbitUrl}`);
          return clearbitUrl;
        }
      } catch {
        // Continue
      }
    }
  }

  // 2. Check Wikipedia & Wikimedia for historical entities, people, products, companies
  if (cleanPrompt.length >= 3) {
    const wikiPhoto = await searchWikipediaImage(cleanPrompt);
    if (wikiPhoto) {
      console.log(`[Web Asset Fetcher] ✅ Retrieved Wikipedia photo for "${cleanPrompt}": ${wikiPhoto.slice(0, 60)}...`);
      return wikiPhoto;
    }

    const commonsPhoto = await searchWikimediaCommonsImage(cleanPrompt);
    if (commonsPhoto) {
      console.log(`[Web Asset Fetcher] ✅ Retrieved Wikimedia Commons photo for "${cleanPrompt}": ${commonsPhoto.slice(0, 60)}...`);
      return commonsPhoto;
    }
  }

  // 3. Search Pexels Photo API (HD 4K stock photography)
  const pexelsPhoto = await searchPexelsPhotos(cleanPrompt);
  if (pexelsPhoto) {
    console.log(`[Web Asset Fetcher] ✅ Retrieved Pexels 4K photo for "${cleanPrompt}": ${pexelsPhoto.slice(0, 60)}...`);
    return pexelsPhoto;
  }

  // 4. Search Pixabay Photo API
  const pixabayPhoto = await searchPixabayPhotos(cleanPrompt);
  if (pixabayPhoto) {
    console.log(`[Web Asset Fetcher] ✅ Retrieved Pixabay photo for "${cleanPrompt}": ${pixabayPhoto.slice(0, 60)}...`);
    return pixabayPhoto;
  }

  // 5. Instant 2.5D Vector Infographic Graphic (0ms, 0 cost, crisp Vox aesthetic)
  console.log(`[Web Asset Fetcher] 🎨 Rendering instant 2.5D Vox Vector graphic for "${cleanPrompt}"`);
  return generateSvgVectorStickerUrl(cleanPrompt, "VOX EVIDENCE");
}
