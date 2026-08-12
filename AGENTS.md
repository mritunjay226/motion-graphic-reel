<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# AGENTS.md — SaaS Execution & Rules Guide

You are an AI Software Engineer & Motion Graphic Director building a high-retention video generation SaaS.
Follow these rules strictly. Do NOT deviate or hallucinate dependencies.

---

## 1. TECH STACK & BOUNDARIES
- **Frontend**: Next.js (App Router, Tailwind CSS, `@remotion/player`)
- **Backend / Database**: Convex (Real-time reactivity, mutations, queries, schemas, internal functions)
- **Composition Runtime**: Remotion (React-based video framework)
- **Image CDN**: ImageKit.io (URL transformation engine for crops, blurs, and scaling)
- **Orchestrator LLMs**: Gemini 2.5 Pro / Flash (Scripting, vision QA) & GLM 5.2 via OpenRouter (Code generation)
- **Cloud Rendering**: Remotion Lambda (`@remotion/lambda`)

---

## 2. CONVEX DATABASE BEST PRACTICES
1. **Schema Validation**: Define explicit validators (`v.object`, `v.string`, `v.id`) for all args and return types in `convex/schema.ts`. NEVER write unvalidated functions.
2. **Indexing**: Always use `.withIndex()` for queries on user IDs or render statuses. NEVER use `.filter()` over unbounded query collections.
3. **Promise Awaiting**: ALWAYS `await` all DB mutations, patches, and internal scheduler calls (`await ctx.db.patch(...)`, `await ctx.scheduler.runAfter(...)`).
4. **User-Facing Errors**: Use `throw new ConvexError({ code, message })` for expected user-facing errors.

---

## 3. REMOTION & MOTION GRAPHICS BEST PRACTICES
1. **No Flat Animations**: Never use linear transitions for graphics. Use `spring({ fps, frame, config: { damping, stiffness } })` or `interpolate()` with easing.
2. **Layering & Depth (MoSidd 2.5D Style)**:
   - Separate background and foreground cutouts.
   - Apply continuous scale-drift or wiggle to subjects (`character boil`).
   - Wrap scenes in a global `<FilmTreatment />` overlay (grain, scanlines, vignette).
3. **ImageKit Optimization**: Wrap image components using pre-optimized ImageKit URLs instead of raw heavy uploads.
   Example query parameter format: `?tr=w-1080,h-1080,fo-auto,f-webp`.
4. **Audio & Frame Sync**: Trigger sound effects (pop, whoosh, click) on exact keyframe numbers matching element entrances.

---

## 4. NEXT.JS APP ROUTER RULES
1. **Directory Structure**: Put public pages under `app/`, components under `components/`, and Remotion compositions under `src/remotion/`.
2. **Player Optimization**: When rendering `<Player />` from `@remotion/player`, memoize `inputProps` using `useMemo()` to prevent unnecessary component re-renders.
3. **Server Actions / API Routes**: Route heavy background pipeline requests to Convex internal actions or HTTP endpoints rather than blocking Next.js API routes.

---

## 5. REUSABLE COMPONENT CONTRACTS

When building video scenes, assemble pre-built helper components instead of writing custom raw CSS from scratch:
- `<FilmTreatment grain={0.12} scanlines={true} vignette={0.4} />`
- `<ParallaxLayer backgroundUrl={...} foregroundUrl={...} depth={1.2} />`
- `<WordByWordCaptions tokens={whisperTokens} currentFrame={frame} />`
- `<ImageKitAsset path="..." transformations="tr=w-800,fo-auto" />`
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
