import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateReelPipeline } from "@/inngest/functions/generateReel";
import { renderReelPipeline } from "@/inngest/functions/renderReel";
import { publishReelPipeline } from "@/inngest/functions/publishReel";

/**
 * Next.js App Router Inngest Endpoint.
 * Serves background functions to Inngest dev server (http://127.0.0.1:8288) & cloud webhooks.
 */
export const maxDuration = 60; // Max allowed serverless timeout on Vercel for pipeline steps

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateReelPipeline, renderReelPipeline, publishReelPipeline],
});

