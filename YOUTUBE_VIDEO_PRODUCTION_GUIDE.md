# 🎬 Building an AI Motion Graphics SaaS with Google Antigravity
### *15–20 Minute YouTube Video Master Playbook & Detailed Prompt Suite*

---

## 📌 Executive Summary

* **Project**: **Vox Reel Engine 2.5D** (Automated 9:16 Vertical Documentary Video Generator)
* **Tech Stack**: Next.js 16 (App Router), Remotion 4, Convex DB (Real-time reactive engine), Inngest (Background pipeline), Gemini 2.5 (Storyboarding), Cartesia AI (Voiceover TTS), Deepgram Nova-2 (Word-level timestamps).
* **Target Audience**: Developers, AI builders, SaaS founders, content creators.
* **Video Goal**: Showcase building a full-stack, studio-grade video SaaS from scratch using **Google Antigravity IDE** in under 20 minutes.

---

## 🎯 YouTube Video Packaging (High CTR)

### 💡 Video Title Ideas
1. **"I Built a $10K/mo AI Video SaaS in 20 Minutes with Google Antigravity"** *(Best for CTR)*
2. **"How to Build a Vox-Style 2.5D Motion Graphics Engine with Antigravity (Step-by-Step)"**
3. **"Coding an Entire Video Generator with AI (Next.js 16 + Remotion + Convex)"**

### 🖼️ Thumbnail Concept
* **Left**: Creator looking surprised or focused next to Antigravity IDE with code generating in real time.
* **Right**: Split screenshot of the 9:16 vertical motion reel (vintage paper cutout + glowing yellow marker highlight + soundwave graphic).
* **Text Overlay**: *"BUILT IN 20 MIN"* or *"AI VIDEO SAAS"*.

### 📝 Video Description & Timestamps
```text
In this video, I build a complete AI-powered motion graphics SaaS styled after iconic documentary channels like Vox and Johnny Harris—using Google Antigravity IDE in just 20 minutes!

🔗 Links & Resources:
- Google Antigravity IDE
- Next.js 16 & Remotion 4
- Convex Real-Time Database
- Inngest Pipeline Orchestrator

⏱️ TIMESTAMPS:
00:00 - The Hook & Live Generated Reel Demo
01:45 - Architecture & Stack Breakdown
03:00 - Phase 1: Setup & Modern Clerk Proxy Auth
05:15 - Phase 2: Convex Real-Time Reactive Database
07:45 - Phase 3: Remotion 2.5D Rig & Film Treatments
10:30 - Phase 4: Tactile Foley Sound Engine & Templates
13:15 - Phase 5: Autonomous Multi-Stage AI Pipeline
15:45 - Phase 6: Kinetic Word-by-Word Captions
17:15 - Phase 7: Creation Studio & Real-Time Progress Bar
18:45 - Phase 8: Interactive Remotion Studio & Live Test
19:45 - Key Takeaways & Outro
```

---

## ⏱️ Video Timeline & Teleprompter / Script Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 00:00 - 01:45 │ The Hook & Final Video Showcase                             │
│ 01:45 - 03:00 │ The Architecture (Why Remotion + Convex + Antigravity)      │
│ 03:00 - 05:15 │ Phase 1: Scaffolding & Modern Clerk Proxy Auth              │
│ 05:15 - 07:45 │ Phase 2: Convex Real-Time Reactive Engine & Schema          │
│ 07:45 - 10:30 │ Phase 3: Remotion 2.5D MoSidd Parallax & Film Overlays      │
│ 10:30 - 13:15 │ Phase 4: 39-Sound Foley Suite & Archival Templates          │
│ 13:15 - 15:45 │ Phase 5: Inngest Multi-Stage AI Pipeline (Gemini + Cartesia)│
│ 15:45 - 17:15 │ Phase 6: Kinetic Word Captions Synced to Deepgram Tokens    │
│ 17:15 - 18:45 │ Phase 7: Creation Wizard UI & Convex Live Telemetry         │
│ 18:45 - 19:45 │ Phase 8: The Grand Finale — Live Generation Test on Camera  │
│ 19:45 - 20:30 │ Outro & Why Antigravity Changed the Game                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### [00:00 - 01:45] Segment 1: The Hook & Finished Reel Demo
* **On Screen**: Fullscreen 9:16 vertical reel playing at 60/30 FPS with desktop audio loud and crisp.
* **Script / Voiceover**:
  > *"What you're watching right now wasn't animated in After Effects. It wasn't manually edited by an agency over 3 days. This entire 2.5D motion graphic reel—complete with vintage paper cutouts, tactile paper rips, typewriter audio, and kinetic word captions—was generated entirely from code from a single topic prompt.*
  > 
  > *In this video, I'm going to challenge myself to build this entire AI video generation SaaS from scratch in under 20 minutes using Google Antigravity IDE. Let's dive in!"*

---

### [01:45 - 03:00] Segment 2: The Tech Stack & System Architecture
* **On Screen**: Architecture diagram (Mermaid diagram or slide) on one side, Antigravity IDE on the other.
* **Script / Voiceover**:
  > *"To build an AI video SaaS, you need 4 core pillars:*
  > *1. **Frontend**: Next.js 16 App Router with Tailwind CSS for a sleek dark broadcast studio.*
  > *2. **Rendering Engine**: Remotion 4—it renders programmatic React components directly into 1080x1920 MP4 frames with spring physics.*
  > *3. **Real-time State**: Convex Database. Video rendering takes multi-stage steps; Convex gives us instant reactive updates on the frontend without polling.*
  > *4. **AI Pipeline**: Inngest running Gemini 2.5 for storyboards, Cartesia for ultra-realistic voiceover, and Deepgram Nova-2 to extract millisecond word timestamps.*
  > 
  > *Let's start feeding our architectural prompts into Antigravity."*

---

## 📋 The Detailed Master Prompt Suite

---

### 🔹 Phase 1: Project Scaffolding & Clerk Proxy Auth
**Timestamp**: `03:00 - 05:15`  
**Goal**: Initialize Next.js 16, dark studio aesthetics, and modern Clerk auth.

> **🎙️ Creator Talking Point**:
> *"Pay attention to this: in newer versions of Clerk, `middleware.ts` is deprecated in favor of `proxy.ts`. Many AI tools get stuck on this, but watch how Antigravity handles the exact modern specification."*

#### 📋 Prompt 1 (Copy & Paste):
```markdown
We are building "Vox Reel Engine", a full-stack SaaS for automated 2.5D documentary-style video generation (styled after Vox and Johnny Harris).

Please scaffold the foundation:
1. Setup Next.js App Router with TypeScript, Tailwind CSS v4, and Lucide icons.
2. Configure Clerk Authentication using the modern `src/proxy.ts` convention (note: `middleware.ts` is deprecated in newer Clerk versions).
   - Configure public routes: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/reel(.*)`, `/create-video(.*)`, and all `/api/(.*)` endpoints.
   - All other routes must require authentication via `await auth.protect()`.
3. Create `src/components/StudioNavbar.tsx`:
   - Sleek editorial broadcast header: Dark glassmorphism (`#0A0A0C` background, subtle border `#1F1F24`).
   - Left: Animated reel filmstrip logo with "VOX REEL 2.5D" badge.
   - Right: "Create Reel" action button, navigation links (Dashboard, Templates), and Clerk `<UserButton />`.
4. Style `src/app/layout.tsx` and `src/app/globals.css` with a high-retention dark editorial theme:
   - Fonts: Inter or Outfit.
   - Theme accents: Vibrant archival yellow `#FFE600`, broadcast cyan `#00F0FF`, and paper fiber textures.
```

---

### 🔹 Phase 2: Convex Real-Time Reactive Database Engine
**Timestamp**: `05:15 - 07:45`  
**Goal**: Strict schema validation, fast queries, and real-time generation state.

> **🎙️ Creator Talking Point**:
> *"Instead of polling an API route every 2 seconds to check if our video is done, Convex uses WebSockets. The second Gemini or Cartesia finishes a step, our UI updates instantaneously."*

#### 📋 Prompt 2 (Copy & Paste):
```markdown
Configure the Convex real-time database under `convex/`:

1. In `convex/schema.ts`, define strict validators (`v.object`, `v.string`, `v.array`, `v.union`):
   - `users` table: `clerkId`, `email`, `name`, `imageUrl`, indexed by `by_clerk_id`.
   - `reels` table:
     - `userId`: v.string()
     - `title`: v.string(), `topic`: v.string(), `language`: v.optional(v.string())
     - `status`: v.union(v.literal("draft"), v.literal("rendering"), v.literal("completed"), v.literal("failed"))
     - `storyboard`: v.array of scene objects containing: `sceneId`, `headline`, `subtitle`, `narration`, `imagePrompt`, `imageUrl`, `bgImageUrl`, `audioUrl`, `audioDurationSec`, `visualType`, `whisperTokens`, `startFrame`, `durationFrames`, `events`
     - `fullVoiceoverUrl`: v.optional(v.string())
     - `masterWhisperTokens`: v.optional(v.any())
     - `bgMusicUrl`: v.optional(v.string()), `themeId`: v.optional(v.string())
     - `progressPercent`: v.optional(v.number()), `progressMessage`: v.optional(v.string()), `currentStep`: v.optional(v.number())
     - Indexes: `.index("by_user", ["userId"])` and `.index("by_status", ["status"])`

2. In `convex/reels.ts`, implement:
   - `createDraftReel` (mutation): Creates a reel in "draft" state with user ID.
   - `updatePipelineProgress` (mutation): Updates `progressPercent` (0-100), `progressMessage`, and `currentStep`.
   - `saveGeneratedStoryboard` (mutation): Saves the complete AI scenes, audio URLs, and whisper tokens.
   - `getReelById` (query): Reactive query fetching a single reel by ID.
   - `listUserReels` (query): Fetches all reels for a specific user ordered descending.

Rule: Always await mutations and queries. Use ConvexError for user-facing errors.
```

---

### 🔹 Phase 3: Remotion 2.5D MoSidd Rig & Film Treatment
**Timestamp**: `07:45 - 10:30`  
**Goal**: 1080x1920 30FPS composition with film grain, scanlines, and parallax depth.

> **🎙️ Creator Talking Point**:
> *"Here is what separates amateur AI videos from broadcast quality: flat static images look cheap. We need continuous scale drift, character boil wiggles, and realistic 35mm film grain."*

#### 📋 Prompt 3 (Copy & Paste):
```markdown
Build the Remotion 2.5D video composition engine in `src/remotion/`:

1. `src/remotion/Root.tsx`:
   - Register `<Composition id="BlockbusterNetflixReel" />`.
   - Set 9:16 vertical resolution: 1080x1920 @ 30 FPS.
   - Dynamically calculate total duration in frames using `calculateMetadata` by summing scene duration frames.

2. `src/remotion/components/FilmTreatment.tsx`:
   - Create a documentary camera overlay:
   - SVG turbulence film grain filter with randomized frame offset (`frame % 10`).
   - CRT horizontal scanlines and viewport camera grid crosshairs.
   - Radial lens vignette (`rgba(0,0,0,0.6)` edges fading to transparent center).

3. `src/remotion/components/TactilePaperCanvas.tsx` & `VoxCameraRig.tsx`:
   - 2.5D MoSidd style parallax: Separate background archival texture from foreground cutouts.
   - Add continuous subtle scale drift and character boil wiggle using `spring({ fps, frame })` and `interpolate()` with smooth easing curves (NEVER use linear transitions).
   - Torn paper drop-shadows (`filter: drop-shadow(0px 15px 25px rgba(0,0,0,0.45))`).
```

---

### 🔹 Phase 4: 39-Sound Tactile Foley Suite & Archival Templates
**Timestamp**: `10:30 - 13:15`  
**Goal**: Synchronized physical sound effects and modular documentary scene layouts.

> **🎙️ Creator Talking Point**:
> *"Sound design is 60% of retention. Watch how we build a Foley sound layer that triggers a paper rip sound on transitions and a rubber stamp thud on key highlights."*

#### 📋 Prompt 4 (Copy & Paste):
```markdown
Implement the physical Foley sound engine and documentary templates:

1. `src/remotion/utils/sfxRegistry.ts`:
   - Define a registry of tactile sound effects categorized by physical event:
     - `paper_rip_fast` / `paper_slide` for scene transitions.
     - `rubber_stamp_thud` for archival stamp reveals.
     - `highlighter_marker_sweep` for keyword text highlights.
     - `camera_shutter_snap` for polaroid and photo popups.
     - `sub_bass_drop` for hook climax beats.

2. `src/remotion/components/TactileSfxLayer.tsx`:
   - Render Remotion `<Audio />` tags synced to exact scene keyframes.
   - Enforce mix hierarchy: Voiceover `0dB`, background music ducked to `-18dB`, tactile Foley at `-16dB`.

3. Create the motion templates under `src/remotion/templates/`:
   - `Template3NewspaperCutout.tsx`: Vintage archive newspaper clipping with animated yellow highlighter sweep over the key phrase.
   - `Template13MatrixHacker.tsx`: Dark cyber HUD telemetry grid, pulsing cyan coordinate lines, and dynamic ticker counters.
   - `Template1CenterHero.tsx`: Dramatic 2.5D cutout hero with floating badge elements and paper torn edge borders.
```

---

### 🔹 Phase 5: Autonomous Multi-Stage AI Pipeline (Inngest)
**Timestamp**: `13:15 - 15:45`  
**Goal**: Background worker function orchestrating Gemini 2.5, Cartesia, and Deepgram.

> **🎙️ Creator Talking Point**:
> *"Video pipelines fail if run inside a regular API route due to 10-second serverless timeouts. Inngest gives us durable execution: if a step fails, it retries automatically without restarting from scratch."*

#### 📋 Prompt 5 (Copy & Paste):
```markdown
Create the autonomous background generation pipeline in `src/inngest/functions/generateReel.ts` and `src/app/api/inngest/route.ts`:

1. Define the Inngest function `generateReelPipeline` listening to event `reel/generate.requested`.
2. Multi-step execution flow:
   - **Step 1 (`1-generate-script`)**: Call Gemini 2.5 with a structured JSON prompt:
     - Input: topic and language.
     - Output: Title, theme, and 4 to 6 scene storyboards (sceneId, headline, subtitle, narration, imagePrompt, visualType).
     - Update Convex progress to 20%: "Script & storyboards generated...".
   - **Step 2 (`2-generate-voiceover`)**:
     - Synthesize realistic voiceover audio using the Cartesia AI API.
     - Upload audio buffer and update Convex progress to 45%: "Voiceover synthesized...".
   - **Step 3 (`3-transcribe-timestamps`)**:
     - Send audio to Deepgram Nova-2 STT to extract exact word-level start/end millisecond timestamps (`whisperTokens`).
     - Calculate frame-accurate `startFrame` and `durationFrames` for each scene beat at 30 FPS.
     - Update Convex progress to 75%: "Syncing kinetic subtitles...".
   - **Step 4 (`4-finalize-assets`)**:
     - Save storyboard, audio URLs, and master whisper tokens to Convex DB.
     - Update status to "completed" and progress to 100%.
```

---

### 🔹 Phase 6: Kinetic Word-by-Word Captions Engine
**Timestamp**: `15:45 - 17:15`  
**Goal**: High-energy subtitle system driven by Deepgram's millisecond timestamps.

> **🎙️ Creator Talking Point**:
> *"Notice the captions on popular Reels—each word bumps up in size as the narrator says it. Let's make that happen dynamically using Remotion's frame clock."*

#### 📋 Prompt 6 (Copy & Paste):
```markdown
Build `<WordByWordCaptions />` in `src/remotion/components/WordByWordCaptions.tsx`:

1. Props: `tokens` (Deepgram whisper word tokens: { word, start, end }), `currentFrame` (number at 30 FPS), `theme` (styling configuration).
2. Logic:
   - Convert `currentFrame` to seconds: `currentTime = currentFrame / 30`.
   - Find active word where `currentTime >= token.start && currentTime <= token.end`.
   - Chunk captions into legible 3-4 word phrases so the screen isn't overwhelmed.
3. Animation & Typography:
   - Active spoken word pops with a spring scale bounce (`1.0 -> 1.18`).
   - Highlight active word in archival yellow `#FFE600` or electric cyan `#00F0FF`.
   - Heavy drop-shadow (`0 4px 12px rgba(0,0,0,0.8)`) and high-contrast bold font to guarantee legibility over busy 2.5D backgrounds.
```

---

### 🔹 Phase 7: Studio Video Creation Wizard & Live Telemetry
**Timestamp**: `17:15 - 18:45`  
**Goal**: User prompt input, voice audition player, and live Convex progress bar.

> **🎙️ Creator Talking Point**:
> *"Now we build the studio creator UI. Watch how clean Antigravity makes this: voice preview buttons, category chips, and a real-time progress monitor."*

#### 📋 Prompt 7 (Copy & Paste):
```markdown
Build the creation studio in `src/app/create-video/page.tsx`:

1. `TopicPromptBar`:
   - Hero prompt input with quick-start starter chips ("How Netflix Beat Blockbuster", "The Secret of the Golden Arches", "The 1970s CIA Acoustic Kitty").
   - "Generate 2.5D Reel" submit button with glowing pulse effect.
2. `NarratorVoiceGrid`:
   - Selection grid of Cartesia narrator voices (e.g., Editorial Documentary, British Historian, Energetic Explainer).
   - Audition button on each card allowing the user to preview the voice audio before generating.
3. Real-Time Generation Modal (`ReelGenerationProgress.tsx`):
   - When submitted, call Convex mutation `createDraftReel` and trigger Inngest event `/api/inngest`.
   - Subscribe via Convex reactive query: `useQuery(api.reels.getReelById, { reelId })`.
   - Display a live progress bar (0% to 100%) with animated pulsating step dots and current step message ("Analyzing topic with Gemini 2.5...", "Generating Foley sound effects...").
   - Auto-redirect to `/reel/${reelId}` when status reaches "completed".
```

---

### 🔹 Phase 8: Interactive Remotion Player & Live Test
**Timestamp**: `18:45 - 19:45`  
**Goal**: Full video player with timeline scrubber, audio mixer, and export triggers.

> **🎙️ Creator Talking Point**:
> *"Finally, the interactive player studio. We use Remotion's Player with memoized props so scrubbing is buttery smooth without lag."*

#### 📋 Prompt 8 (Copy & Paste):
```markdown
Implement the full video editor playback monitor in `src/app/reel/[reelId]/page.tsx`:

1. Integrate `@remotion/player`:
   - Center a 9:16 vertical video player (1080x1920 aspect ratio) with glassmorphism backdrop.
   - CRITICAL: Wrap `inputProps` inside React `useMemo()` to prevent unnecessary component re-renders during playback scrubbing.
2. `TransportControls`:
   - Play/Pause toggle with spacebar shortcut.
   - Current frame / total duration timecode display (e.g., `00:04:12 / 00:30:00`).
   - Frame step forward/backward buttons.
3. `SceneTimelineStrip`:
   - Horizontal thumbnail strip showing each storyboard scene beat.
   - Clicking a scene jumps the player directly to that scene's `startFrame`.
4. Inspector Drawer Tabs:
   - Storyboard Tab: Edit scene headlines and narration in real time.
   - Audio & Themes Tab: Switch background music tracks, change color themes, adjust Foley volume.
   - Export Tab: "Render 1080x1920 MP4" button triggering serverless rendering.
```

---

## 🚀 The Live Demo Test on Camera (The "Climax" Moment)

When you're ready to show the live test on camera, go to `http://localhost:3000/create-video` and use this exact test prompt:

```text
Topic: How the Netflix red envelope killed Blockbuster's $800M late-fee empire
Narrator: Brian (Documentary Explainer)
Theme: Vox 2.5D Archival Cutout
```

### What viewers will see live:
1. **0 to 5s**: Inngest terminal kicks off `1-generate-script` using Gemini 2.5.
2. **5 to 10s**: Convex progress bar jumps to 45% as Cartesia delivers the audio.
3. **10 to 15s**: Deepgram extracts word timestamps; progress hits 75%.
4. **15 to 18s**: Auto-redirects to `/reel/[id]`.
5. **Playback**: You press **Play** $\rightarrow$ Viewer hears paper rips, vinyl crackle, narrator voiceover, and sees yellow highlighter lines sweeping across the screen!

---

## 🖨️ How to Export this Guide to PDF

1. **Option A (Via Browser / Chrome / Edge)**:
   - Open the companion file [`YOUTUBE_VIDEO_GUIDE.html`](file:///c:/Users/mk/Documents/motion-graphic-reels/YOUTUBE_VIDEO_GUIDE.html) in any web browser.
   - Press `Ctrl + P` (or `Cmd + P` on Mac).
   - Set Destination to **"Save as PDF"**.
   - Ensure **"Background graphics"** is checked.
   - Click **Save** to get a formatted, print-ready PDF!

2. **Option B (Via VS Code / Antigravity)**:
   - Right-click this `.md` file in your editor and select **"Markdown PDF: Export (pdf)"** or print via your browser preview.
