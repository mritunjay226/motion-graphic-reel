import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all reels for a specific user ID.
 */
export const listUserReels = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const reels = await ctx.db
      .query("reels")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return reels;
  },
});

/**
 * List all generated reels in the database (ordered by creation date desc).
 */
export const listAllReels = query({
  args: {},
  handler: async (ctx) => {
    const reels = await ctx.db
      .query("reels")
      .order("desc")
      .collect();

    return reels;
  },
});


/**
 * Get reel by ID.
 */
export const getReelById = query({
  args: { reelId: v.id("reels") },
  handler: async (ctx, args) => {
    const reel = await ctx.db.get(args.reelId);
    return reel;
  },
});

/**
 * Create a new motion graphic reel project.
 */
export const createReel = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    topic: v.string(),
    storyboard: v.array(
      v.object({
        sceneId: v.number(),
        headline: v.string(),
        subtitle: v.optional(v.string()),
        narration: v.string(),
        imagePrompt: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        videoUrl: v.optional(v.string()),
        bRollUrl: v.optional(v.string()),
        isSingleSubject: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const reelId = await ctx.db.insert("reels", {
      userId: args.userId,
      title: args.title,
      topic: args.topic,
      status: "draft",
      storyboard: args.storyboard,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return reelId;
  },
});

/**
 * Create a new draft reel project from a topic and return the real Convex Id<"reels">.
 */
export const createReelFromTopic = mutation({
  args: {
    userId: v.string(),
    topic: v.string(),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const defaultStoryboard = buildDefaultStoryboardForTopic(args.topic);

    const reelId = await ctx.db.insert("reels", {
      userId: args.userId,
      title: args.topic.toUpperCase(),
      topic: args.topic,
      language: args.language || "en",
      status: "draft",
      currentStep: 1,
      progressPercent: 5,
      progressMessage: "Initializing video generation...",
      storyboard: defaultStoryboard,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return reelId;
  },
});

/**
 * Generates 6 dynamic documentary scenes for any topic string.
 */
function buildDefaultStoryboardForTopic(topic: string) {
  const tUpper = topic.toUpperCase();

  return [
    {
      sceneId: 1,
      headline: `THE ORIGIN OF ${tUpper.slice(0, 18)}`,
      subtitle: "HOW AN EMPIRE STARTED WITH A SINGLE IDEA",
      narration: `In the early days of ${topic}, a small team took a massive risk that changed the business landscape forever.`,
      imagePrompt: `Founder or key executive portrait cutout for ${topic}`,
      isSingleSubject: true,
    },
    {
      sceneId: 2,
      headline: "THE MULTI-MILLION BET",
      subtitle: "THE OFFER THAT CHANGED EVERYTHING",
      narration: `They pitched a revolutionary business model that investors initially questioned.`,
      imagePrompt: `Stack of investment cash money for ${topic}`,
      isSingleSubject: true,
    },
    {
      sceneId: 3,
      headline: "REVOLUTIONARY RULES",
      subtitle: "BREAKING INDUSTRY CONVENTIONS",
      narration: `By eliminating unnecessary overhead and putting customer experience first, they scaled exponentially.`,
      imagePrompt: `Modern tech server glowing network for ${topic}`,
      isSingleSubject: true,
    },
    {
      sceneId: 4,
      headline: "COMPETITORS SHUTDOWN",
      subtitle: "LEGACY COMPANIES FILED BANKRUPTCY",
      narration: `Traditional competitors refused to adapt, resulting in massive market shift and closures.`,
      imagePrompt: `Legacy store front representing competitors of ${topic}`,
      isSingleSubject: true,
    },
    {
      sceneId: 5,
      headline: "MULTI-BILLION REVENUE",
      subtitle: "DOMINATING THE GLOBAL MARKET TODAY",
      narration: `Today, this strategy generates multi-billion dollar annual returns across international markets.`,
      imagePrompt: `Golden trophy award for digital dominance in ${topic}`,
      isSingleSubject: true,
    },
    {
      sceneId: 6,
      headline: "THE GREATEST PIVOT",
      subtitle: "FROM A BOLD IDEA TO A GLOBAL EMPIRE",
      narration: `It stands as one of the most remarkable growth stories in modern business history.`,
      imagePrompt: `Royal gold crown symbol of victory for ${topic}`,
      isSingleSubject: true,
    },
  ];
}

/**
 * Update reel render status, video URL, and dynamic storyboard scenes.
 */
export const updateReelStatus = mutation({
  args: {
    reelId: v.id("reels"),
    status: v.union(
      v.literal("draft"),
      v.literal("rendering"),
      v.literal("completed"),
      v.literal("failed")
    ),
    storyboard: v.optional(
      v.array(
        v.object({
          sceneId: v.number(),
          headline: v.string(),
          subtitle: v.optional(v.string()),
          narration: v.string(),
          imagePrompt: v.optional(v.string()),
          imageUrl: v.optional(v.string()),
          bgImageUrl: v.optional(v.string()),
          isSingleSubject: v.optional(v.boolean()),
          whisperTokens: v.optional(v.any()),
          audioUrl: v.optional(v.string()),
          audioDurationSec: v.optional(v.number()),
          videoUrl: v.optional(v.string()),
          bRollUrl: v.optional(v.string()),
          visualType: v.optional(v.string()),
          gsapType: v.optional(v.string()),
          entranceType: v.optional(v.string()),
          startFrame: v.optional(v.number()),
          durationFrames: v.optional(v.number()),
          events: v.optional(v.any()),
        })
      )
    ),
    videoUrl: v.optional(v.string()),
    fullVoiceoverUrl: v.optional(v.string()),
    masterWhisperTokens: v.optional(v.any()),
    renderId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    failedStep: v.optional(v.string()),
    themeId: v.optional(v.string()),
    currentStep: v.optional(v.number()),
    progressPercent: v.optional(v.number()),
    progressMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patches: any = {
      status: args.status,
      updatedAt: Date.now(),
    };
    if (args.storyboard) patches.storyboard = args.storyboard;
    if (args.videoUrl) patches.videoUrl = args.videoUrl;
    if (args.fullVoiceoverUrl) patches.fullVoiceoverUrl = args.fullVoiceoverUrl;
    if (args.masterWhisperTokens) patches.masterWhisperTokens = args.masterWhisperTokens;
    if (args.renderId) patches.renderId = args.renderId;
    if (args.errorMessage !== undefined) patches.errorMessage = args.errorMessage;
    if (args.failedStep !== undefined) patches.failedStep = args.failedStep;
    if (args.themeId) patches.themeId = args.themeId;
    if (args.currentStep !== undefined) patches.currentStep = args.currentStep;
    if (args.progressPercent !== undefined) patches.progressPercent = args.progressPercent;
    if (args.progressMessage !== undefined) patches.progressMessage = args.progressMessage;

    await ctx.db.patch(args.reelId, patches);
  },
});

/**
 * Update real-time generation pipeline progress for a reel.
 */
export const updatePipelineProgress = mutation({
  args: {
    reelId: v.id("reels"),
    currentStep: v.number(),
    progressPercent: v.number(),
    progressMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      currentStep: args.currentStep,
      progressPercent: args.progressPercent,
      progressMessage: args.progressMessage,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Re-synchronize single scene audio, duration, and Deepgram whisper tokens,
 * and recompute contiguous startFrames for all scenes in the storyboard.
 */
export const updateSceneAudioAndTokens = mutation({
  args: {
    reelId: v.id("reels"),
    sceneIndex: v.number(),
    narration: v.string(),
    audioUrl: v.string(),
    audioDurationSec: v.number(),
    durationFrames: v.number(),
    whisperTokens: v.any(),
  },
  handler: async (ctx, args) => {
    const reel = await ctx.db.get(args.reelId);
    if (!reel) {
      throw new Error(`Reel ${args.reelId} not found`);
    }

    const storyboard = [...(reel.storyboard || [])];
    if (args.sceneIndex < 0 || args.sceneIndex >= storyboard.length) {
      throw new Error(`Scene index ${args.sceneIndex} out of bounds (0-${storyboard.length - 1})`);
    }

    const target = storyboard[args.sceneIndex];
    storyboard[args.sceneIndex] = {
      ...target,
      narration: args.narration,
      audioUrl: args.audioUrl,
      audioDurationSec: args.audioDurationSec,
      durationFrames: args.durationFrames,
      whisperTokens: args.whisperTokens,
    };

    // Recalculate contiguous timeline startFrame for every scene
    let currentStart = 0;
    for (let i = 0; i < storyboard.length; i++) {
      storyboard[i] = {
        ...storyboard[i],
        startFrame: currentStart,
        durationFrames: storyboard[i].durationFrames || Math.ceil((storyboard[i].audioDurationSec || 4) * 30),
      };
      currentStart += storyboard[i].durationFrames!;
    }

    await ctx.db.patch(args.reelId, {
      storyboard,
      updatedAt: Date.now(),
    });

    return storyboard[args.sceneIndex];
  },
});

/**
 * Update Background Music track URL and volume for a reel project.
 */
export const updateBgMusic = mutation({
  args: {
    reelId: v.id("reels"),
    bgMusicUrl: v.string(),
    bgMusicVolume: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      bgMusicUrl: args.bgMusicUrl,
      bgMusicVolume: args.bgMusicVolume ?? 0.15,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Update active Video Theme ID for a reel project.
 */
export const updateReelTheme = mutation({
  args: {
    reelId: v.id("reels"),
    themeId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      themeId: args.themeId,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Update a specific scene in a reel's storyboard (headline, subtitle, narration, visualType, imageUrl, videoUrl).
 */
export const updateScene = mutation({
  args: {
    reelId: v.id("reels"),
    sceneIndex: v.number(),
    headline: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    narration: v.optional(v.string()),
    visualType: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    bRollUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reel = await ctx.db.get(args.reelId);
    if (!reel) {
      throw new Error(`Reel ${args.reelId} not found`);
    }

    const storyboard = [...(reel.storyboard || [])];
    if (args.sceneIndex < 0 || args.sceneIndex >= storyboard.length) {
      throw new Error(`Scene index ${args.sceneIndex} out of bounds (0-${storyboard.length - 1})`);
    }

    const currentScene = storyboard[args.sceneIndex];
    storyboard[args.sceneIndex] = {
      ...currentScene,
      headline: args.headline !== undefined ? args.headline : currentScene.headline,
      subtitle: args.subtitle !== undefined ? args.subtitle : currentScene.subtitle,
      narration: args.narration !== undefined ? args.narration : currentScene.narration,
      visualType: args.visualType !== undefined ? args.visualType : currentScene.visualType,
      imageUrl: args.imageUrl !== undefined ? args.imageUrl : currentScene.imageUrl,
      videoUrl: args.videoUrl !== undefined ? args.videoUrl : currentScene.videoUrl,
      bRollUrl: args.bRollUrl !== undefined ? args.bRollUrl : (args.videoUrl !== undefined ? args.videoUrl : currentScene.bRollUrl),
    };

    await ctx.db.patch(args.reelId, {
      storyboard,
      updatedAt: Date.now(),
    });

    return storyboard[args.sceneIndex];
  },
});

/**
 * Delete a reel project by ID.
 */
export const deleteReel = mutation({
  args: {
    reelId: v.id("reels"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reelId);
  },
});

/**
 * Start a cloud render via Modal.com.
 * Called from the /api/render Next.js route after spawning the Modal job.
 */
export const startRender = mutation({
  args: {
    reelId: v.id("reels"),
    modalCallId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      status: "rendering",
      modalCallId: args.modalCallId,
      renderStartedAt: Date.now(),
      videoUrl: undefined,
      renderCompletedAt: undefined,
      renderDurationMs: undefined,
      errorMessage: undefined,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Complete a cloud render — sets videoUrl, timing, and status.
 * Called from the Convex HTTP callback endpoint (invoked by Modal on render success).
 */
export const completeRender = mutation({
  args: {
    reelId: v.id("reels"),
    videoUrl: v.string(),
    renderDurationMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      status: "completed",
      videoUrl: args.videoUrl,
      renderCompletedAt: Date.now(),
      renderDurationMs: args.renderDurationMs,
      errorMessage: undefined,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Fail a cloud render — records error message and marks reel as failed.
 * Called from the Convex HTTP callback endpoint (invoked by Modal on render failure).
 */
export const failRender = mutation({
  args: {
    reelId: v.id("reels"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reelId, {
      status: "failed",
      errorMessage: args.errorMessage,
      failedStep: "render",
      updatedAt: Date.now(),
    });
  },
});

/**
 * Record initial social media publishing request for a reel.
 */
export const recordSocialPublish = mutation({
  args: {
    reelId: v.id("reels"),
    posts: v.array(
      v.object({
        platform: v.string(),
        accountId: v.string(),
        accountName: v.optional(v.string()),
        postId: v.optional(v.string()),
        status: v.union(
          v.literal("pending"),
          v.literal("published"),
          v.literal("scheduled"),
          v.literal("failed")
        ),
        postUrl: v.optional(v.string()),
        errorMessage: v.optional(v.string()),
        publishedAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const reel = await ctx.db.get(args.reelId);
    if (!reel) {
      throw new Error(`Reel ${args.reelId} not found`);
    }

    const existingPosts = reel.socialPosts || [];
    // Merge or replace posts with new entries
    const updatedPosts = [...existingPosts];

    for (const newPost of args.posts) {
      const idx = updatedPosts.findIndex(
        (p) => p.platform === newPost.platform && p.accountId === newPost.accountId
      );
      if (idx >= 0) {
        updatedPosts[idx] = newPost;
      } else {
        updatedPosts.push(newPost);
      }
    }

    await ctx.db.patch(args.reelId, {
      socialPosts: updatedPosts,
      updatedAt: Date.now(),
    });

    return updatedPosts;
  },
});

/**
 * Update the status of a specific social post for a reel.
 */
export const updateSocialPostStatus = mutation({
  args: {
    reelId: v.id("reels"),
    platform: v.string(),
    accountId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("published"),
      v.literal("scheduled"),
      v.literal("failed")
    ),
    postId: v.optional(v.string()),
    postUrl: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reel = await ctx.db.get(args.reelId);
    if (!reel) return;

    const posts = reel.socialPosts || [];
    const updated = posts.map((post) => {
      if (post.platform === args.platform && post.accountId === args.accountId) {
        return {
          ...post,
          status: args.status,
          postId: args.postId || post.postId,
          postUrl: args.postUrl || post.postUrl,
          errorMessage: args.errorMessage,
          publishedAt: args.status === "published" ? Date.now() : post.publishedAt,
        };
      }
      return post;
    });

    await ctx.db.patch(args.reelId, {
      socialPosts: updated,
      updatedAt: Date.now(),
    });
  },
});

