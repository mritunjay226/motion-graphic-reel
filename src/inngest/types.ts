/**
 * Inngest Event Payload Schemas for Reel Generation Workflow.
 */
export type ReelGenerateEvent = {
  name: "reel/generate.requested";
  data: {
    reelId: string;
    userId: string;
    topic: string;
    voiceId?: string;
  };
};

export type Events = {
  "reel/generate.requested": ReelGenerateEvent["data"];
};
