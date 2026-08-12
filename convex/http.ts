import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

/**
 * POST /api/render-callback
 *
 * HTTP endpoint called by Modal.com after a render completes (success or failure).
 * Validates a shared secret, then updates the reel document via the appropriate mutation.
 *
 * Expected JSON body:
 * {
 *   "reelId": "convex_id_string",
 *   "status": "completed" | "failed",
 *   "secret": "shared_render_secret",
 *   "videoUrl": "https://...",          // only on success
 *   "renderDurationMs": 85000,          // only on success
 *   "errorMessage": "..."               // only on failure
 * }
 */
http.route({
  path: "/api/render-callback",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    if (typeof body !== "object" || body === null) {
      return new Response(
        JSON.stringify({ error: "Body must be a JSON object" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = body as Record<string, unknown>;

    // Validate shared secret
    const expectedSecret = process.env.RENDER_SECRET;
    if (expectedSecret && data.secret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const reelId = data.reelId;
    const status = data.status;

    if (typeof reelId !== "string" || !reelId) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid reelId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (status !== "completed" && status !== "failed") {
      return new Response(
        JSON.stringify({ error: "Status must be 'completed' or 'failed'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      if (status === "completed") {
        const videoUrl = data.videoUrl;
        if (typeof videoUrl !== "string" || !videoUrl) {
          return new Response(
            JSON.stringify({ error: "Missing videoUrl for completed status" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const renderDurationMs = typeof data.renderDurationMs === "number"
          ? data.renderDurationMs
          : undefined;

        await ctx.runMutation(api.reels.completeRender, {
          reelId: reelId as Id<"reels">,
          videoUrl,
          renderDurationMs,
        });
      } else {
        const errorMessage = typeof data.errorMessage === "string"
          ? data.errorMessage
          : "Unknown render error";

        await ctx.runMutation(api.reels.failRender, {
          reelId: reelId as Id<"reels">,
          errorMessage,
        });
      }

      return new Response(
        JSON.stringify({ ok: true, reelId, status }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      console.error("[render-callback] Mutation error:", err.message);
      return new Response(
        JSON.stringify({ error: "Mutation failed", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
