import { Inngest } from "inngest";

/**
 * Inngest Client Instance for Vox Video Generation SaaS.
 * Explicitly configured for local dev server (http://127.0.0.1:8288).
 */
const isDev =
  process.env.NODE_ENV !== "production" ||
  process.env.INNGEST_DEV === "1" ||
  !process.env.INNGEST_EVENT_KEY;

export const inngest = new Inngest({
  id: "vox-reels-saas",
  name: "Vox 2.5D Motion Graphic Reels SaaS",
  eventKey: process.env.INNGEST_EVENT_KEY || "local",
  isDev,
  baseUrl: process.env.INNGEST_BASE_URL || (isDev ? "http://127.0.0.1:8288" : undefined),
});
