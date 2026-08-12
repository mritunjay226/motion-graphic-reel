import { mutation } from "./_generated/server";

export const seedWorkingReel = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get or create primary guest user
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", "user_guest"))
      .first();

    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        clerkId: "user_guest",
        email: "guest@voxreels.com",
        name: "Guest Creator",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(newUserId);
    }

    const userId = user!._id;

    // 2. Check if default blockbuster reel already exists
    const existingReel = await ctx.db
      .query("reels")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const svgSticker = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1400'><rect width='100%' height='100%' fill='%23111111'/><rect x='40' y='40' width='720' height='1320' fill='%23FFFFFF' rx='32'/><text x='400' y='700' font-size='48' font-weight='bold' text-anchor='middle' fill='%23111'>DOCUMENTARY CUTOUT</text></svg>";

    const sampleStoryboard = [
      {
        sceneId: 1,
        headline: "IN THE YEAR 2000",
        subtitle: "NETFLIX PITCHED BLOCKBUSTER",
        narration: "In the year 2000, a small startup called Netflix walked into Blockbuster's headquarters with a bold offer.",
        imagePrompt: "Vintage 2000 DVD rental store with neon signs",
        imageUrl: svgSticker,
        isSingleSubject: true,
      },
      {
        sceneId: 2,
        headline: "$50 MILLION",
        subtitle: "THE BUYOUT OFFER BLOCKBUSTER LAUGHED AT",
        narration: "They asked for fifty million dollars to become Blockbuster's online streaming arm.",
        imagePrompt: "Stack of 50 million dollars cash money",
        imageUrl: svgSticker,
        isSingleSubject: true,
      },
      {
        sceneId: 3,
        headline: "THE NETFLIX MODEL",
        subtitle: "THREE REVOLUTIONARY RULES",
        narration: "No late fees, no physical stores, and putting the customer experience first.",
        imagePrompt: "Streaming technology server network glow",
        imageUrl: svgSticker,
        isSingleSubject: true,
      },
      {
        sceneId: 4,
        headline: "1,000 STORES CLOSED",
        subtitle: "BLOCKBUSTER FILED BANKRUPTCY IN 2010",
        narration: "The Blockbuster executives literally laughed them out of the room. Within a decade, Blockbuster filed for bankruptcy in 2010.",
        imagePrompt: "Abandoned closed Blockbuster video store with dark windows",
        imageUrl: svgSticker,
        isSingleSubject: true,
      },
      {
        sceneId: 5,
        headline: "$45 BILLION",
        subtitle: "ANNUAL NETFLIX REVENUE TODAY",
        narration: "Today, Netflix generates over forty-five billion dollars in annual revenue.",
        imagePrompt: "Golden trophy award celebrating digital empire",
        imageUrl: svgSticker,
        isSingleSubject: true,
      },
      {
        sceneId: 6,
        headline: "THE MOST EXPENSIVE 'NO' IN HISTORY",
        subtitle: "FROM A $50M REJECTION TO A $200B EMPIRE",
        narration: "It remains the most expensive rejection in business history.",
        imagePrompt: "Gold crown over digital empire backdrop",
        imageUrl: svgSticker,
        isSingleSubject: true,
      },
    ];

    if (existingReel) {
      await ctx.db.patch(existingReel._id, {
        status: "completed",
        storyboard: sampleStoryboard,
        updatedAt: Date.now(),
      });

      return { status: "reseeded_working_reel", reelId: existingReel._id, userId };
    }

    const reelId = await ctx.db.insert("reels", {
      userId,
      title: "The $50M Mistake — How Blockbuster Rejected Netflix",
      topic: "The $50M Mistake — How Blockbuster Rejected Netflix",
      status: "completed",
      storyboard: sampleStoryboard,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { status: "reseeded_with_working_images", reelId, userId };
  },
});
