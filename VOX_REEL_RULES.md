# Vox Documentary Reel — Project Architecture & Rules Guide

This document maintains the strict execution rules, design guidelines, and API conventions for building high-retention 2.5D Vox documentary reels using Remotion, Next.js, Cartesia AI, ImageKit, GSAP, Convex, Clerk, and Deepgram.

---

## 1. Core Visual Design & Component Rules

### Rule 1.1: Single Subject Background Removal with ImageKit
- When an asset image features a **single subject** (character cutout, executive portrait, product, logo, or isolated item), its background MUST be removed via ImageKit's AI engine (`e-bg-removal`).
- Route single subjects through ImageKit API (`/api/imagekit/upload`) or `PaperSticker` with `isSingleSubject={true}` / `transformOptions={{ removeBg: true }}`.
- Single subjects render as pure transparent cutouts standing cleanly in 2.5D space over the paper canvas, with a white paper drop shadow (`drop-shadow(0 0 4px #FFF) drop-shadow(...)`), eliminating solid rectangular background cards.

### Rule 1.2: Strict Layout Preset Templates & Deterministic Scaling
Every generated scene is assigned one of 5 strict Layout Presets that guarantee zero text collisions, perfect scaling, and broadcast-grade spatial positioning:
1. `side_by_side_infographic` (Headline Top, Left Image Cutout, Right GSAP Chart).
2. `center_cutout_hero` (Headline Top, Center Image Cutout, Top-Right Rubber Stamp).
3. `side_by_side_list` (Headline Top, Left 3-Bullet List, Right Image Cutout).
4. `revenue_stat_trend` (Big Stat Top, GSAP Trend Arrow Path, Center Cutout).
5. `punchline_quote_hero` (Closing Quote Top, Center Crown Cutout, GSAP Confetti Burst).

### Rule 1.3: Vox Documentary Video Pacing & Rhythmic Staggering
- **Audio-Driven Scene Duration**: Scene length is calculated directly from Cartesia audio duration (`audioDurationSec * 30 + 15 frames` padding).
- **Rhythmic 3-Beat Staggering**: Elements within a scene enter on a 3-beat pulse:
  - **Beat 1 (`frame 2`)**: Top Headline Typography & Yellow Pen Sweep.
  - **Beat 2 (`frame 6-8`)**: Single Subject Cutout Image corner-slides in.
  - **Beat 3 (`frame 10-14`)**: GSAP Motion Graphic (bar chart, trend arrow, rubber stamp) + Leader Line badge.
- **30-Second Story Arc**: 6 scenes × ~5s per scene = 30-second maximum retention reel.

### Rule 1.4: "Cutting the Curve" (Vox Velocity-Matched Scene Transitions) ([CurveCutTransition.tsx](file:///c:/Users/mk/Documents/motion-graphic-reels/src/remotion/components/CurveCutTransition.tsx))
- **Vox Secret Transition Technique**: Cuts between photos and scenes feel 100% seamless by matching motion velocity across scene boundaries:
  1. **Heavy Ease-In Acceleration**: Set outgoing keyframes with heavy cubic ease-in (`Easing.in(Easing.bezier(0.7, 0, 0.84, 0))`) accelerating to peak velocity at the scene exit frame.
  2. **Hard Cut at Velocity Peak**: Execute a hard cut straight into the next scene exactly at the moment of peak speed (`velocity max`, last 6 frames of the scene).
  3. **Inherited Ease-Out Deceleration**: Incoming scene objects parent/inherit the matching initial peak velocity (`velocity max`) and decelerate smoothly to rest (`Easing.out(Easing.bezier(0.16, 1, 0.3, 1))`).

### Rule 1.5: Vox Corner Slide Ease-In-Out Entrances ([ParallaxLayer.tsx](file:///c:/Users/mk/Documents/motion-graphic-reels/src/remotion/components/ParallaxLayer.tsx))
- Elements (paper cutouts, list blocks, leader lines) enter the screen from **sides and corners** with satisfying cubic-bezier ease-out deceleration curves (`Easing.bezier(0.16, 1, 0.3, 1)`) and rotational settling:
  - `slide_corner_top_left`: Slides from top-left (`translateX: -280px`, `translateY: -240px`, `rotation: -14deg → 0deg`).
  - `slide_corner_top_right`: Slides from top-right (`translateX: 280px`, `translateY: -240px`, `rotation: 14deg → 0deg`).
  - `slide_corner_bottom_left`: Slides from bottom-left (`translateX: -280px`, `translateY: 240px`, `rotation: -10deg → 0deg`).
  - `slide_corner_bottom_right`: Slides from bottom-right (`translateX: 280px`, `translateY: 240px`, `rotation: 10deg → 0deg`).

### Rule 1.6: GSAP Vector Animation Suite ([GsapSvgGraphics.tsx](file:///c:/Users/mk/Documents/motion-graphic-reels/src/remotion/components/GsapSvgGraphics.tsx))
- Use GSAP (GreenSock Animation Platform) vector tweens (`greensock/gsap-skills@gsap-core`) synchronized with Remotion timeline frames: `grid_lines`, `bar_chart`, `pulse_nodes`, `stamp_seal`, `counter_ring`, `trend_arrow`, `confetti_burst`.

### Rule 1.7: Procedural Torn Paper Rip Wipe Transitions ([TransitionEffect.tsx](file:///c:/Users/mk/Documents/motion-graphic-reels/src/remotion/components/TransitionEffect.tsx))
- Transition between scenes using a **procedural torn paper rip wipe** (`<TornPaper>` filter primitive) sliding across the canvas to seamlessly reveal the next scene.

### Rule 1.8: Mandatory 1 Subject Cutout Image Per Scene
- **EVERY SINGLE SCENE MUST feature exactly 1 single subject cutout sticker image** (`primaryStickerUrl` in `PaperSticker`).

### Rule 1.9: Strict Vertical Spatial Layering (Zero Text-Image Collisions)
- **Top Zone (`top: 6%` to `22%`, `zIndex: 50`)**: Vox Headline Typography.
- **Middle Zone (`top: 25%` to `64%`, `height: 36%`, `zIndex: 10`)**: Scene Cutouts & Side-by-Side Infographics.
- **Bottom Zone (`bottom: 140px`, `zIndex: 50`)**: 1-2 Line Paged Kinetic Subtitles.

### Rule 1.10: Clean Paged Captions (Max 1-2 Lines Per Page)
- Subtitles chunked into 5-6 word paged groups using Deepgram timestamps.

### Rule 1.11: 39-Sound Tactile Foley Audio Suite ([sfxRegistry.ts](file:///c:/Users/mk/Documents/motion-graphic-reels/src/remotion/utils/sfxRegistry.ts))
- Every visual interaction is synchronized with authentic physical sound effects via `<TactileSfxLayer />`:
  - **Transitions (Frame 0)**: Paper rip on memo/editorial scenes, fast whip whoosh on dynamic scenes, sub-bass drop on hook/climax.
  - **Headline Sweep (Frame 3)**: Yellow highlighter marker squeak.
  - **Subject Landing (Frame 6-8)**: Crisp tactile pop card drop.
  - **Graphic Entrances**: Rubber stamp seal slam (`rubber_stamp`), camera shutter snap on polaroids (`camera_shutter`), cash register cha-ching on revenue (`cash_register`), typewriter typing on memos (`typewriter_key`), and mechanical keyboard on matrix hacker scenes (`keyboard_typing`).
- Mix hierarchy: Voiceover `0dB`, background music `-18dB`, tactile Foley `-14dB to -22dB`.

---

## 2. SaaS Database & Auth Architecture (Convex + Clerk + Deepgram)

### Rule 2.1: Clerk Middleware File Naming (`src/proxy.ts`)
- The middleware file is named **`src/proxy.ts`** ([proxy.ts](file:///c:/Users/mk/Documents/motion-graphic-reels/src/proxy.ts)).

### Rule 2.2: Convex Schema & Table Indexing ([convex/schema.ts](file:///c:/Users/mk/Documents/motion-graphic-reels/convex/schema.ts))
- Schema validation (`v.object`, `v.string`, `v.id`, `v.array`) with `.withIndex()` database queries.

### Rule 2.3: Automatic Clerk-Convex User Synchronization ([UserSync.tsx](file:///c:/Users/mk/Documents/motion-graphic-reels/src/components/UserSync.tsx))
- Runs inside `<ConvexClientProvider>` to sync user accounts.

### Rule 2.4: Deepgram Nova-2 Caption Transcription
- Transcribes Cartesia AI audio streams into high-precision word timestamps.

---

## 3. Maintenance & Updates
- This file MUST be updated whenever new design directives, component contracts, or API features are added.
