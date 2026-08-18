/**
 * Zernio Unified Social Media Client & Viral AI Content Engine.
 *
 * Integrates with Zernio (https://zernio.com/api/v1) to fetch connected channels
 * (Instagram, YouTube, TikTok) and publish/schedule vertical video reels with
 * world-class viral hooks, SEO descriptions, tags, and algorithmic comment boosters.
 */

export interface ZernioAccount {
  id: string;
  platform: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface PublishPlatformConfig {
  platform: string;
  accountId: string;
  customTitle?: string;
  customCaption?: string;
  visibility?: "public" | "unlisted" | "private";
  firstComment?: string;
  thumbnailUrl?: string;
  thumbOffset?: number;
}

export interface PublishToZernioParams {
  videoUrl: string;
  caption: string;
  title?: string;
  tags?: string[];
  firstComment?: string;
  thumbnailUrl?: string;
  thumbOffset?: number;
  platforms: PublishPlatformConfig[];
  scheduledFor?: string;
}

export interface ZernioPublishResponse {
  success: boolean;
  postId?: string;
  data?: any;
  error?: string;
  platformResults?: Array<{
    platform: string;
    accountId: string;
    status: "published" | "scheduled" | "failed";
    postUrl?: string;
    error?: string;
  }>;
}

export interface SocialMetadataResult {
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeTags: string[];
  instagramCaption: string;
  instagramFirstComment: string;
  hashtags: string[];
}

const ZERNIO_BASE_URL = "https://zernio.com/api/v1";

/**
 * Fetch connected social accounts from Zernio.
 */
export async function getZernioAccounts(): Promise<ZernioAccount[]> {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    throw new Error("ZERNIO_API_KEY is not configured in environment variables.");
  }

  try {
    const res = await fetch(`${ZERNIO_BASE_URL}/accounts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Zernio API error (${res.status}): ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    console.log("[Zernio] Successfully fetched accounts:", data);

    const rawAccounts = Array.isArray(data)
      ? data
      : data.accounts || data.data || [];

    return rawAccounts.map((acc: any) => ({
      id: acc._id || acc.id || acc.accountId || "",
      platform: (acc.platform || acc.provider || "").toLowerCase(),
      name: acc.name || acc.displayName || acc.username || acc.platform || "Connected Account",
      username: acc.username || acc.handle || undefined,
      avatarUrl: acc.avatarUrl || acc.picture || acc.profilePicture || undefined,
      isActive: acc.status === "active" || acc.active !== false,
    }));
  } catch (error: any) {
    console.error("[Zernio] Failed to fetch accounts:", error.message);
    throw error;
  }
}

/**
 * Generate OAuth authorization connect URL for a given platform (e.g. "youtube", "instagram").
 */
export async function getZernioConnectUrl(
  platform: string,
  redirectUrl?: string
): Promise<string> {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    throw new Error("ZERNIO_API_KEY is not configured.");
  }

  try {
    // 1. Fetch default profile
    const profilesRes = await fetch(`${ZERNIO_BASE_URL}/profiles`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const profilesData = await profilesRes.json();
    const profileId =
      profilesData.profiles?.[0]?._id || profilesData.profiles?.[0]?.id;

    if (!profileId) {
      throw new Error("No Zernio profile found for this API key.");
    }

    // 2. Fetch platform connect URL
    let connectUrl = `${ZERNIO_BASE_URL}/connect/${platform.toLowerCase()}?profileId=${profileId}`;
    if (redirectUrl) {
      connectUrl += `&redirect_url=${encodeURIComponent(redirectUrl)}`;
    }

    const res = await fetch(connectUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Zernio connect error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.authUrl;
  } catch (error: any) {
    console.error(`[Zernio] Failed to generate connect URL for ${platform}:`, error.message);
    throw error;
  }
}

/**
 * Publish or schedule a video reel to YouTube and Instagram via Zernio API.
 */
export async function publishToZernio(
  params: PublishToZernioParams
): Promise<ZernioPublishResponse> {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    throw new Error("ZERNIO_API_KEY is not configured.");
  }

  if (!params.videoUrl) {
    throw new Error("Missing videoUrl for publishing.");
  }

  if (!params.platforms || params.platforms.length === 0) {
    throw new Error("No platforms selected for publishing.");
  }

  // Format platforms for Zernio POST /v1/posts
  const formattedPlatforms = params.platforms.map((p) => {
    const isYouTube = p.platform.toLowerCase() === "youtube";
    const isInstagram = p.platform.toLowerCase() === "instagram";
    const title = p.customTitle || params.title || "New Motion Graphic Reel";

    let platformSpecificData: any = undefined;

    if (isYouTube) {
      platformSpecificData = {
        title: title.slice(0, 100),
        visibility: p.visibility || "public",
        tags: params.tags || [],
      };
    } else if (isInstagram) {
      platformSpecificData = {
        shareToFeed: true,
        firstComment: p.firstComment || params.firstComment || undefined,
        instagramThumbnail: p.thumbnailUrl || params.thumbnailUrl || undefined,
        thumbOffset: p.thumbOffset ?? params.thumbOffset ?? 0,
      };
    }

    return {
      platform: p.platform.toLowerCase(),
      accountId: p.accountId,
      platformSpecificData,
      customContent: p.customCaption || undefined,
    };
  });

  const payload: any = {
    content: params.caption,
    mediaItems: [
      {
        type: "video",
        url: params.videoUrl,
      },
    ],
    platforms: formattedPlatforms,
    publishNow: !params.scheduledFor,
  };

  if (params.scheduledFor) {
    payload.scheduledFor = params.scheduledFor;
  }

  try {
    console.log(`[Zernio] Publishing video to ${params.platforms.length} platforms...`);
    const res = await fetch(`${ZERNIO_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Zernio Error ${res.status}]`, errText);
      return {
        success: false,
        error: `Zernio API returned ${res.status}: ${errText.slice(0, 300)}`,
      };
    }

    const data = await res.json();
    console.log("[Zernio] ✅ Post created successfully:", data);

    const postId = data.id || data.postId || data._id;
    const rawPlatformResults = data.platforms || data.results || [];

    const platformResults = params.platforms.map((p) => {
      const match = rawPlatformResults.find(
        (r: any) => r.platform === p.platform || r.accountId === p.accountId
      );
      return {
        platform: p.platform,
        accountId: p.accountId,
        status: (match?.status || (params.scheduledFor ? "scheduled" : "published")) as "published" | "scheduled" | "failed",
        postUrl: match?.url || match?.postUrl || undefined,
        error: match?.error || undefined,
      };
    });

    return {
      success: true,
      postId,
      data,
      platformResults,
    };
  } catch (error: any) {
    console.error("[Zernio] Network or execution error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate viral, high-CTR social media metadata (YouTube Shorts title, SEO description,
 * Instagram scroll-stopper caption, algorithmic first comment, and tags) using Gemini.
 */
export async function generateSocialMetadata({
  topic,
  title,
  storyboardText,
}: {
  topic: string;
  title?: string;
  storyboardText?: string;
}): Promise<SocialMetadataResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are a legendary viral social media director who writes copy for top YouTube Shorts & Instagram Reels creators (Vox, MagnatesMedia, Johnny Harris, Ali Abdaal).
You specialize in business documentary, historical drama, and tech pivot reels that get millions of views.

Topic: "${topic}"
Project Title: "${title || topic}"
Storyboard / Script Context: "${storyboardText || topic}"

Generate psychological, high-retention, non-generic copy tailored for the 2026 algorithm:

1. "youtubeTitle":
   - Maximum 60-65 characters.
   - High-CTR curiosity gap formula (Must include 1 viral emoji, strong curiosity hook, and stakes).
   - Examples: "The $50M Mistake That Destroyed Blockbuster 🤯", "Why Netflix Paid $0 To Kill Their Biggest Rival 💀", "The 1 Decision That Made Them $10 Billion 📉".

2. "youtubeDescription":
   - 3-4 sentence high-SEO summary.
   - Opening suspense line that makes people watch till the end.
   - 2 key takeaway bullet points (⚡).
   - Clear CTA: "👉 Subscribe for daily 60-second business breakdowns & documentary stories."

3. "youtubeTags":
   - Array of 12-15 high-intent search tags (e.g. ["${topic} documentary", "${topic} story", "business breakdown", "motion graphics", "vox explainer", "case study", "entrepreneurship", "startup failure", "viral shorts"]).

4. "instagramCaption":
   - LINE 1: ALL-CAPS scroll-stopping hook with 🚨 or 🤯.
   - BODY: 3 captivating narrative bullet points using emojis (📌, ⚡, 📉).
   - ENGAGEMENT QUESTION: A polarizing debate question that forces viewers to argue in the comments (drives viral reach).
   - CTA: "Save this reel 🔖 & share with a friend who needs to hear this!"

5. "instagramFirstComment":
   - A strategic comment to boost algorithmic velocity (e.g., "Did they make the biggest mistake in history, or would you have done the same? Drop your thoughts below 👇").

6. "hashtags":
   - Array of 10-12 tiered hashtags:
     - 3 mega-viral tags: #shorts #reels #viral
     - 4 documentary/business tags: #businessdocumentary #startupstory #motiongraphics #casestudy
     - 3-4 topic-specific tags: #${topic.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()} #success #mindset

Output strictly valid JSON with this exact schema:
{
  "youtubeTitle": "string",
  "youtubeDescription": "string",
  "youtubeTags": ["tag1", "tag2", ...],
  "instagramCaption": "string",
  "instagramFirstComment": "string",
  "hashtags": ["#tag1", "#tag2", ...]
}`;

  if (geminiApiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json",
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            youtubeTitle: parsed.youtubeTitle || `The Crazy Untold Story of ${topic} 🤯`,
            youtubeDescription: parsed.youtubeDescription || `The shocking documentary breakdown of ${topic}.\n\n👉 Subscribe for daily business stories!`,
            youtubeTags: Array.isArray(parsed.youtubeTags) ? parsed.youtubeTags : [topic, "documentary", "business story", "case study"],
            instagramCaption: parsed.instagramCaption || `THE SHOCKING TRUTH ABOUT ${topic.toUpperCase()} 🚨\n\nDrop your thoughts in the comments! 👇`,
            instagramFirstComment: parsed.instagramFirstComment || `Did they make the right move? Let me know below! 👇`,
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ["#shorts", "#reels", "#viral", "#documentary"],
          };
        }
      }
    } catch (err: any) {
      console.warn("[Social Metadata] Gemini generation warning:", err.message);
    }
  }

  if (openRouterApiKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: systemPrompt }],
          temperature: 0.8,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            youtubeTitle: parsed.youtubeTitle || `The Crazy Untold Story of ${topic} 🤯`,
            youtubeDescription: parsed.youtubeDescription || `The shocking documentary breakdown of ${topic}.\n\n👉 Subscribe for daily business stories!`,
            youtubeTags: Array.isArray(parsed.youtubeTags) ? parsed.youtubeTags : [topic, "documentary", "business story", "case study"],
            instagramCaption: parsed.instagramCaption || `THE SHOCKING TRUTH ABOUT ${topic.toUpperCase()} 🚨\n\nDrop your thoughts in the comments! 👇`,
            instagramFirstComment: parsed.instagramFirstComment || `Did they make the right move? Let me know below! 👇`,
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ["#shorts", "#reels", "#viral", "#documentary"],
          };
        }
      }
    } catch (err: any) {
      console.warn("[Social Metadata] OpenRouter generation warning:", err.message);
    }
  }

  // Fallback defaults
  return {
    youtubeTitle: `The $50M Mistake That Changed ${topic} Forever 🤯`,
    youtubeDescription: `How a single bold move transformed ${topic} into a global powerhouse.\n\n⚡ 60-Second Documentary Breakdown\n👉 Subscribe for more viral business stories!`,
    youtubeTags: [topic, `${topic} documentary`, "business story", "case study", "motion graphics", "shorts", "success story"],
    instagramCaption: `THE CRAZY TRUTH ABOUT ${topic.toUpperCase()} 🚨\n\n📌 How one decision sparked an industry revolution.\n⚡ The risk that almost destroyed everything.\n\nDid they get lucky, or was it pure genius? Let me know below! 👇\n\nSave this reel 🔖 & follow for more!`,
    instagramFirstComment: `What would you have done in their shoes? Comment below 👇`,
    hashtags: ["#shorts", "#reels", "#viral", "#businessdocumentary", "#motiongraphics", "#entrepreneurship", `#${topic.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`],
  };
}
