import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema for Motion Graphic Reels SaaS.
 *
 * Enforces strict validators for user accounts, reels, and storyboard scenes.
 */
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  reels: defineTable({
    userId: v.string(), // Clerk User ID
    title: v.string(),
    topic: v.string(),
    language: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("rendering"),
      v.literal("completed"),
      v.literal("failed")
    ),
    storyboard: v.array(
      v.object({
        sceneId: v.number(),
        headline: v.string(),
        subtitle: v.optional(v.string()),
        narration: v.string(),
        imagePrompt: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        bgImageUrl: v.optional(v.string()),
        audioUrl: v.optional(v.string()),
        audioDurationSec: v.optional(v.number()),
        videoUrl: v.optional(v.string()),
        bRollUrl: v.optional(v.string()),
        isSingleSubject: v.optional(v.boolean()),
        whisperTokens: v.optional(v.any()),
        visualType: v.optional(v.string()),
        gsapType: v.optional(v.string()),
        entranceType: v.optional(v.string()),
        startFrame: v.optional(v.number()),
        durationFrames: v.optional(v.number()),
        events: v.optional(v.any()),
      })
    ),
    bgMusicUrl: v.optional(v.string()),
    bgMusicVolume: v.optional(v.number()),
    themeId: v.optional(v.string()),
    fullVoiceoverUrl: v.optional(v.string()),
    masterWhisperTokens: v.optional(v.any()),
    videoUrl: v.optional(v.string()),
    renderId: v.optional(v.string()),
    modalCallId: v.optional(v.string()),
    renderStartedAt: v.optional(v.number()),
    renderCompletedAt: v.optional(v.number()),
    renderDurationMs: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
    failedStep: v.optional(v.string()),
    currentStep: v.optional(v.number()),
    progressPercent: v.optional(v.number()),
    progressMessage: v.optional(v.string()),
    socialPosts: v.optional(
      v.array(
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
      )
    ),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
});
