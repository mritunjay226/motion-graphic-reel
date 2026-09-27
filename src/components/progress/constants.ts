import { FileText, Mic, Clock, Video, ScanEye, Layers, LucideIcon } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "ai" | "media" | "warn";
  tag: string;
  message: string;
}

export interface PipelineStage {
  step: number;
  title: string;
  engine: string;
  desc: string;
  icon: LucideIcon;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    title: "Documentary Scripting",
    engine: "Narrative Story AI",
    desc: "Crafting 6-scene story arc, curiosity gap hooks, and scene visual prompts",
    icon: FileText,
  },
  {
    step: 2,
    title: "Master Audio Synthesis",
    engine: "Studio Voice Synth",
    desc: "Generating continuous high-fidelity studio voiceover & scene tracks",
    icon: Mic,
  },
  {
    step: 3,
    title: "Sub-Second Word Sync",
    engine: "Kinetic Word Sync",
    desc: "Transcribing millisecond-precise kinetic captions directly from audio buffer",
    icon: Clock,
  },
  {
    step: 4,
    title: "4K B-Roll Video Fetch",
    engine: "4K Cinematic Archive",
    desc: "Retrieving verified 1080p/4K cinematic video streams and archival media",
    icon: Video,
  },
  {
    step: 5,
    title: "Vision Quality QA",
    engine: "Vision Quality Filter",
    desc: "Inspecting video preview thumbnails in <200ms to guarantee zero irrelevant clips",
    icon: ScanEye,
  },
  {
    step: 6,
    title: "2.5D Motion Assembly",
    engine: "2.5D Motion Engine",
    desc: "Compositing paper stickers, Steadicam choreography, and Foley SFX layers",
    icon: Layers,
  },
];
