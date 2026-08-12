import type { ExecutionPlan, WhisperToken } from "../types";
import { generateSvgVectorStickerUrl } from "../utils/vector-assets";

export interface PipelineOptions {
  model?: "flux" | "flux-realism" | "turbo" | "sana";
  seed?: number;
  quality?: "preview" | "hd";
}

/**
 * Base execution plan template.
 */
export const baseExecutionPlan: ExecutionPlan = {
  projectMeta: {
    title: "The $50M Mistake — How Blockbuster Rejected Netflix",
    slug: "blockbuster-rejected-netflix",
    fps: 30,
    width: 1080,
    height: 1920,
    totalDurationFrames: 900,
    totalDurationSeconds: 30,
    aspectRatio: "9:16",
    colorGrade: "cinematic_teal_orange",
    fontStack: ["Bebas Neue", "Inter", "Anton"],
  },

  audioPipeline: {
    narrationScript:
      "In the year 2000, a small startup called Netflix walked into Blockbuster's headquarters with a bold offer. They asked for fifty million dollars to become Blockbuster's online streaming arm. The Blockbuster executives literally laughed them out of the room, calling the idea a joke. What they didn't realize is they had just sealed their own fate. Within a decade, Netflix was worth over a hundred billion dollars. And Blockbuster? They filed for bankruptcy in 2010 — the most expensive rejection in business history.",
    voiceConfig: {
      provider: "cartesia",
      voiceId: "62ae83ad-4f6a-430b-af41-a9bede9286ca",
      voiceName: "Vox High-Retention Explainer",
      modelId: "sonic-3",
      language: "en",
      sampleRate: 44100,
    },
    bgMusicTrack: {
      name: "cinematic_history_strings",
      url: "https://cdn.saas.com/audio/cinematic_history_strings.mp3",
      volume: 0.18,
      fadeInFrames: 30,
      fadeOutFrames: 45,
    },
    sfxEvents: [
      { frame: 0, type: "deep_riser", sfxUrl: "https://cdn.saas.com/sfx/deep_riser_intro.mp3", volume: 0.6 },
      { frame: 1, type: "whoosh", sfxUrl: "https://cdn.saas.com/sfx/whoosh_heavy.mp3", volume: 0.5 },
      { frame: 45, type: "pop_in", sfxUrl: "https://cdn.saas.com/sfx/pop_crisp.mp3", volume: 0.4 },
      { frame: 145, type: "whip_transition", sfxUrl: "https://cdn.saas.com/sfx/whip_whoosh.mp3", volume: 0.55 },
      { frame: 150, type: "boom_impact", sfxUrl: "https://cdn.saas.com/sfx/boom_cinematic.mp3", volume: 0.5 },
      { frame: 195, type: "pop_in", sfxUrl: "https://cdn.saas.com/sfx/pop_crisp.mp3", volume: 0.4 },
      { frame: 295, type: "whip_transition", sfxUrl: "https://cdn.saas.com/sfx/whip_whoosh.mp3", volume: 0.55 },
      { frame: 300, type: "slam_impact", sfxUrl: "https://cdn.saas.com/sfx/slam_impact.mp3", volume: 0.5 },
      { frame: 345, type: "laugh_sfx", sfxUrl: "https://cdn.saas.com/sfx/subtle_laugh.mp3", volume: 0.3 },
      { frame: 445, type: "whip_transition", sfxUrl: "https://cdn.saas.com/sfx/whip_whoosh.mp3", volume: 0.55 },
      { frame: 450, type: "dark_reveal", sfxUrl: "https://cdn.saas.com/sfx/dark_reveal.mp3", volume: 0.5 },
      { frame: 595, type: "tension_riser", sfxUrl: "https://cdn.saas.com/sfx/tension_riser.mp3", volume: 0.45 },
      { frame: 600, type: "cash_register", sfxUrl: "https://cdn.saas.com/sfx/cash_register.mp3", volume: 0.5 },
      { frame: 650, type: "shimmer", sfxUrl: "https://cdn.saas.com/sfx/shimmer_success.mp3", volume: 0.35 },
      { frame: 745, type: "whip_transition", sfxUrl: "https://cdn.saas.com/sfx/whip_whoosh.mp3", volume: 0.55 },
      { frame: 750, type: "glass_shatter", sfxUrl: "https://cdn.saas.com/sfx/glass_shatter.mp3", volume: 0.55 },
      { frame: 870, type: "final_boom", sfxUrl: "https://cdn.saas.com/sfx/final_boom_reverb.mp3", volume: 0.6 },
    ],
  },

  filmTreatment: {
    grainOpacity: 0.14,
    grainBlendMode: "overlay",
    grainAnimated: true,
    grainFps: 10,
    scanlines: true,
    scanlineWidth: 1.6,
    scanlineOpacity: 0.16,
    scanlineBlendMode: "multiply",
    vignette: 0.38,
    vignetteBlendMode: "multiply",
    cornerBlur: true,
    cornerBlurRadius: 12,
    cornerBlurSpread: 180,
    colorGradeLut: "teal_orange_cinematic",
    letterboxOpacity: 0.0,
    paperGrid: true,
    paperGridOpacity: 0.12,
    paperGridSize: 32,
    paperTexture: true,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0.1,
    dustAndScratches: true,
    dustOpacity: 0.1,
  },

  scenes: [
    {
      sceneId: 1,
      sceneTitle: "The Hook — Year 2000",
      startFrame: 0,
      endFrame: 150,
      durationFrames: 150,
      durationSeconds: 5.0,
      narrationLine:
        "In the year 2000, a small startup called Netflix walked into Blockbuster's headquarters with a bold offer.",
      whisperTokens: [
        { word: "In", startMs: 0, endMs: 120, startFrame: 0, endFrame: 4 },
        { word: "the", startMs: 120, endMs: 220, startFrame: 4, endFrame: 7 },
        { word: "year", startMs: 220, endMs: 420, startFrame: 7, endFrame: 13 },
        { word: "2000,", startMs: 420, endMs: 780, startFrame: 13, endFrame: 23 },
        { word: "a", startMs: 820, endMs: 880, startFrame: 25, endFrame: 26 },
        { word: "small", startMs: 880, endMs: 1100, startFrame: 26, endFrame: 33 },
        { word: "startup", startMs: 1100, endMs: 1450, startFrame: 33, endFrame: 44 },
        { word: "called", startMs: 1450, endMs: 1650, startFrame: 44, endFrame: 50 },
        { word: "Netflix", startMs: 1650, endMs: 2100, startFrame: 50, endFrame: 63 },
        { word: "walked", startMs: 2150, endMs: 2400, startFrame: 65, endFrame: 72 },
        { word: "into", startMs: 2400, endMs: 2550, startFrame: 72, endFrame: 77 },
        { word: "Blockbuster's", startMs: 2550, endMs: 3050, startFrame: 77, endFrame: 92 },
        { word: "headquarters", startMs: 3050, endMs: 3550, startFrame: 92, endFrame: 107 },
        { word: "with", startMs: 3600, endMs: 3750, startFrame: 108, endFrame: 113 },
        { word: "a", startMs: 3750, endMs: 3830, startFrame: 113, endFrame: 115 },
        { word: "bold", startMs: 3830, endMs: 4150, startFrame: 115, endFrame: 125 },
        { word: "offer.", startMs: 4150, endMs: 4600, startFrame: 125, endFrame: 138 },
      ],
      assetPrompts: {
        backgroundPrompt:
          "A dramatic exterior of a massive Blockbuster Video store at night, year 2000, neon blue and yellow signage glowing, wet parking lot reflecting lights, 35mm Kodak film stock look, cinematic wide angle, volumetric fog, moody teal and orange color grading",
        foregroundCutoutPrompt:
          "A young confident tech entrepreneur in a dark blazer and open-collar shirt, holding a red DVD mailer envelope, determined expression, full body shot, isolated on transparent background, PNG cutout, soft studio lighting, photorealistic",
        propsOverlays: [
          "Floating red Netflix DVD mailer envelope, slightly tilted, glowing soft red rim light, transparent background PNG",
          "Scattered VHS tape cassettes falling in the air, nostalgic 2000s aesthetic, transparent background PNG",
          "Subtle golden dust particles floating upward, cinematic atmosphere overlay",
        ],
      },
      imageKitUrls: {
        background: "/vox_documentary_bg.png",
        foreground: "/vox_subject_cutout.png",
        props: [
          "/vox_newspaper_clipping.png",
        ],
      },
      animationRules: {
        backgroundMotion: {
          type: "parallax_zoom_in_slow",
          scaleInterpolation: { inputRange: [0, 150], outputRange: [1.0, 1.05], easing: "easeInOutCubic" },
          panX: { inputRange: [0, 150], outputRange: [0, -15] },
        },
        foregroundMotion: {
          type: "character_boil_and_entrance",
          entrance: {
            type: "spring_scale_up",
            triggerFrame: 15,
            springConfig: { damping: 14, stiffness: 120, mass: 0.8 },
            fromScale: 0.3,
            toScale: 1.0,
            fromTranslateY: 200,
            toTranslateY: 0,
          },
          boil: {
            rotationOscillation: { minDeg: -0.8, maxDeg: 0.8, periodFrames: 18 },
            scaleOscillation: { minScale: 0.995, maxScale: 1.005, periodFrames: 22 },
          },
          scaleDrift: { inputRange: [0, 150], outputRange: [1.0, 1.08] },
        },
        projectedShadow: {
          enabled: true,
          skewX: "-35deg",
          translateY: 40,
          opacity: 0.3,
          blur: 8,
          color: "rgba(0,0,0,0.35)",
        },
        propsAnimations: [
          {
            propIndex: 0,
            motion: "float_orbit",
            startFrame: 30,
            orbitRadius: 40,
            orbitSpeed: 0.02,
            scale: { inputRange: [30, 45], outputRange: [0, 1] },
            springConfig: { damping: 10, stiffness: 80 },
          },
          {
            propIndex: 1,
            motion: "scatter_fall",
            startFrame: 50,
            gravity: 0.3,
            rotationRange: [-45, 45],
            opacity: { inputRange: [50, 60, 140, 150], outputRange: [0, 0.7, 0.7, 0] },
          },
          {
            propIndex: 2,
            motion: "constant_rise",
            startFrame: 0,
            blendMode: "screen",
            opacity: 0.35,
            translateY: { inputRange: [0, 150], outputRange: [50, -100] },
          },
        ],
        overlayFx: {
          type: "rising_smoke",
          src: "https://cdn.saas.com/fx/rising_smoke_loop.mp4",
          blendMode: "screen",
          opacity: 0.25,
          loop: true,
        },
        transitionOut: {
          type: "whip_zoom_motion_blur",
          triggerFrame: 142,
          durationFrames: 8,
          motionBlurSamples: 5,
          zoomTarget: 3.5,
          directionDeg: 90,
          easing: "easeInExpo",
        },
      },
      kineticCaptions: {
        style: "word_by_word_pop",
        position: { bottom: 320, horizontalAlign: "center" },
        fontFamily: "Bebas Neue",
        fontSize: 64,
        fontWeight: 800,
        textColor: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 3,
        highlightWords: ["Netflix", "Blockbuster's"],
        highlightColor: "#E50914",
        highlightScale: 1.15,
        springConfig: { damping: 12, stiffness: 100, mass: 0.5 },
        shadowConfig: { color: "rgba(0,0,0,0.6)", blur: 8, offsetY: 4 },
      },
    },

    {
      sceneId: 2,
      sceneTitle: "The Pitch — $50 Million Ask",
      visualType: "editorial_strikethrough_swap",
      startFrame: 150,
      endFrame: 300,
      durationFrames: 150,
      durationSeconds: 5.0,
      narrationLine: "They asked for fifty million dollars to become Blockbuster's online streaming arm.",
      whisperTokens: [
        { word: "They", startMs: 0, endMs: 180, startFrame: 150, endFrame: 155 },
        { word: "asked", startMs: 180, endMs: 450, startFrame: 155, endFrame: 164 },
        { word: "for", startMs: 450, endMs: 580, startFrame: 164, endFrame: 167 },
        { word: "fifty", startMs: 580, endMs: 900, startFrame: 167, endFrame: 177 },
        { word: "million", startMs: 900, endMs: 1250, startFrame: 177, endFrame: 188 },
        { word: "dollars", startMs: 1250, endMs: 1650, startFrame: 188, endFrame: 200 },
        { word: "to", startMs: 1700, endMs: 1800, startFrame: 201, endFrame: 204 },
        { word: "become", startMs: 1800, endMs: 2100, startFrame: 204, endFrame: 213 },
        { word: "Blockbuster's", startMs: 2100, endMs: 2700, startFrame: 213, endFrame: 231 },
        { word: "online", startMs: 2700, endMs: 3050, startFrame: 231, endFrame: 242 },
        { word: "streaming", startMs: 3050, endMs: 3500, startFrame: 242, endFrame: 255 },
        { word: "arm.", startMs: 3500, endMs: 3900, startFrame: 255, endFrame: 267 },
      ],
      assetPrompts: {
        backgroundPrompt:
          "Interior of a corporate boardroom in the year 2000, long mahogany conference table, dim warm tungsten lighting, large windows with city skyline, 35mm film grain, teal and amber color grading, cinematic depth of field",
        foregroundCutoutPrompt:
          "Two business executives sitting at a boardroom table facing camera, one presenting with open hands in a pitching gesture, professional attire, photorealistic, isolated on transparent background, PNG cutout",
        propsOverlays: [
          "Floating 3D text '$50,000,000' in metallic gold, slight perspective tilt, glowing edges, transparent background PNG",
          "Stack of business documents and a laptop from the year 2000, floating slightly above table level, transparent background PNG",
          "Subtle lens flare streaking diagonally, warm orange-gold tone, transparent background PNG",
        ],
      },
      imageKitUrls: {
        background:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/bg_scene2_boardroom.png?tr=w-1080,h-1920,fo-auto,f-webp,q-85",
        foreground:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/fg_scene2_executives_cutout.png?tr=w-900,h-1300,fo-face,f-webp,q-90",
        props: [
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_50m_text.png?tr=w-600,f-webp,q-90",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_documents.png?tr=w-400,f-webp,q-85",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/overlay_lens_flare.png?tr=w-1080,f-webp,q-80",
        ],
      },
      animationRules: {
        backgroundMotion: {
          type: "slow_push_in",
          scaleInterpolation: { inputRange: [150, 300], outputRange: [1.0, 1.04], easing: "easeOutSine" },
          panX: { inputRange: [150, 300], outputRange: [10, -5] },
        },
        foregroundMotion: {
          type: "character_boil_and_entrance",
          entrance: {
            type: "slide_up_with_spring",
            triggerFrame: 155,
            springConfig: { damping: 15, stiffness: 110, mass: 0.7 },
            fromScale: 0.85,
            toScale: 1.0,
            fromTranslateY: 100,
            toTranslateY: 0,
          },
          boil: {
            rotationOscillation: { minDeg: -0.6, maxDeg: 0.6, periodFrames: 20 },
            scaleOscillation: { minScale: 0.997, maxScale: 1.003, periodFrames: 24 },
          },
          scaleDrift: { inputRange: [150, 300], outputRange: [1.0, 1.06] },
        },
        projectedShadow: {
          enabled: true,
          skewX: "-30deg",
          translateY: 35,
          opacity: 0.28,
          blur: 10,
          color: "rgba(0,0,0,0.3)",
        },
        propsAnimations: [
          {
            propIndex: 0,
            motion: "slam_in_from_top",
            startFrame: 167,
            springConfig: { damping: 8, stiffness: 180 },
            fromTranslateY: -400,
            toTranslateY: 0,
            shakeAfterImpact: { amplitude: 6, decayFrames: 15 },
          },
          {
            propIndex: 1,
            motion: "gentle_float",
            startFrame: 180,
            translateY: { inputRange: [180, 300], outputRange: [0, -20] },
            opacity: { inputRange: [180, 195, 280, 300], outputRange: [0, 0.8, 0.8, 0] },
          },
          {
            propIndex: 2,
            motion: "diagonal_sweep",
            startFrame: 150,
            blendMode: "screen",
            opacity: 0.4,
            translateX: { inputRange: [150, 300], outputRange: [-200, 200] },
          },
        ],
        overlayFx: {
          type: "light_flares",
          src: "https://cdn.saas.com/fx/warm_light_flares_loop.mp4",
          blendMode: "screen",
          opacity: 0.2,
          loop: true,
        },
        transitionOut: {
          type: "whip_zoom_motion_blur",
          triggerFrame: 292,
          durationFrames: 8,
          motionBlurSamples: 5,
          zoomTarget: 3.0,
          directionDeg: -90,
          easing: "easeInExpo",
        },
      },
      kineticCaptions: {
        style: "word_by_word_pop",
        position: { bottom: 320, horizontalAlign: "center" },
        fontFamily: "Bebas Neue",
        fontSize: 64,
        fontWeight: 800,
        textColor: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 3,
        highlightWords: ["fifty", "million", "dollars"],
        highlightColor: "#FFD700",
        highlightScale: 1.2,
        springConfig: { damping: 12, stiffness: 100, mass: 0.5 },
        shadowConfig: { color: "rgba(0,0,0,0.6)", blur: 8, offsetY: 4 },
      },
    },

    {
      sceneId: 3,
      sceneTitle: "The Rejection — Laughed Out",
      visualType: "matrix_scramble_hacker",
      startFrame: 300,
      endFrame: 450,
      durationFrames: 150,
      durationSeconds: 5.0,
      narrationLine:
        "The Blockbuster executives literally laughed them out of the room, calling the idea a joke.",
      whisperTokens: [
        { word: "The", startMs: 0, endMs: 140, startFrame: 300, endFrame: 304 },
        { word: "Blockbuster", startMs: 140, endMs: 650, startFrame: 304, endFrame: 320 },
        { word: "executives", startMs: 650, endMs: 1200, startFrame: 320, endFrame: 336 },
        { word: "literally", startMs: 1250, endMs: 1650, startFrame: 338, endFrame: 350 },
        { word: "laughed", startMs: 1650, endMs: 2050, startFrame: 350, endFrame: 362 },
        { word: "them", startMs: 2050, endMs: 2250, startFrame: 362, endFrame: 368 },
        { word: "out", startMs: 2250, endMs: 2500, startFrame: 368, endFrame: 375 },
        { word: "of", startMs: 2500, endMs: 2600, startFrame: 375, endFrame: 378 },
        { word: "the", startMs: 2600, endMs: 2720, startFrame: 378, endFrame: 382 },
        { word: "room,", startMs: 2720, endMs: 3100, startFrame: 382, endFrame: 393 },
        { word: "calling", startMs: 3150, endMs: 3450, startFrame: 395, endFrame: 404 },
        { word: "the", startMs: 3450, endMs: 3560, startFrame: 404, endFrame: 407 },
        { word: "idea", startMs: 3560, endMs: 3850, startFrame: 407, endFrame: 416 },
        { word: "a", startMs: 3850, endMs: 3950, startFrame: 416, endFrame: 419 },
        { word: "joke.", startMs: 3950, endMs: 4500, startFrame: 419, endFrame: 435 },
      ],
      assetPrompts: {
        backgroundPrompt:
          "Same corporate boardroom but now shot from a low dramatic angle looking up at laughing executives, harsh overhead fluorescent lighting mixed with warm window light, 35mm film grain, desaturated teal shadows, cinematic tension composition",
        foregroundCutoutPrompt:
          "A corporate executive in a power suit leaning back in chair laughing condescendingly, pointing finger forward mockingly, dramatic low angle, photorealistic, isolated on transparent background, PNG cutout",
        propsOverlays: [
          "Bold red text stamp saying 'REJECTED' at an angle, cracked edges, grunge texture, transparent background PNG",
          "Crumpled business proposal papers scattered, transparent background PNG",
          "Dark moody dust particles floating slowly, sparse, transparent background PNG",
        ],
      },
      imageKitUrls: {
        background:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/bg_scene3_boardroom_dramatic.png?tr=w-1080,h-1920,fo-auto,f-webp,q-85",
        foreground:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/fg_scene3_laughing_exec.png?tr=w-850,h-1350,fo-face,f-webp,q-90",
        props: [
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_rejected_stamp.png?tr=w-500,f-webp,q-90",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_crumpled_papers.png?tr=w-450,f-webp,q-85",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/overlay_dark_dust.png?tr=w-1080,f-webp,q-80",
        ],
      },
      animationRules: {
        backgroundMotion: {
          type: "parallax_zoom_in_tense",
          scaleInterpolation: { inputRange: [300, 450], outputRange: [1.0, 1.06], easing: "easeInOutQuad" },
          panY: { inputRange: [300, 450], outputRange: [0, -20] },
        },
        foregroundMotion: {
          type: "character_boil_and_shake",
          entrance: {
            type: "slam_in_from_right",
            triggerFrame: 305,
            springConfig: { damping: 10, stiffness: 150, mass: 0.9 },
            fromTranslateX: 400,
            toTranslateX: 0,
            fromScale: 1.3,
            toScale: 1.0,
          },
          boil: {
            rotationOscillation: { minDeg: -1.0, maxDeg: 1.0, periodFrames: 14 },
            scaleOscillation: { minScale: 0.994, maxScale: 1.006, periodFrames: 18 },
          },
          scaleDrift: { inputRange: [300, 450], outputRange: [1.0, 1.12] },
          shakeEffect: { triggerFrame: 350, amplitude: 4, durationFrames: 20, frequency: 3 },
        },
        projectedShadow: {
          enabled: true,
          skewX: "-40deg",
          translateY: 45,
          opacity: 0.35,
          blur: 6,
          color: "rgba(0,0,0,0.4)",
        },
        propsAnimations: [
          {
            propIndex: 0,
            motion: "slam_rotate_in",
            startFrame: 380,
            fromRotation: 45,
            toRotation: -12,
            fromScale: 3.0,
            toScale: 1.0,
            springConfig: { damping: 8, stiffness: 200 },
            shakeAfterImpact: { amplitude: 8, decayFrames: 12 },
          },
          {
            propIndex: 1,
            motion: "scatter_explode",
            startFrame: 340,
            velocityRange: { x: [-3, 3], y: [-5, -1] },
            gravity: 0.15,
            rotationRange: [-90, 90],
            opacity: { inputRange: [340, 355, 430, 450], outputRange: [0, 0.7, 0.5, 0] },
          },
          {
            propIndex: 2,
            motion: "constant_drift",
            startFrame: 300,
            blendMode: "screen",
            opacity: 0.2,
            translateY: { inputRange: [300, 450], outputRange: [30, -60] },
          },
        ],
        overlayFx: {
          type: "dust_particles",
          src: "https://cdn.saas.com/fx/dark_dust_particles_loop.mp4",
          blendMode: "screen",
          opacity: 0.18,
          loop: true,
        },
        transitionOut: {
          type: "whip_zoom_motion_blur",
          triggerFrame: 443,
          durationFrames: 7,
          motionBlurSamples: 6,
          zoomTarget: 4.0,
          directionDeg: 0,
          easing: "easeInExpo",
        },
      },
      kineticCaptions: {
        style: "word_by_word_pop",
        position: { bottom: 320, horizontalAlign: "center" },
        fontFamily: "Bebas Neue",
        fontSize: 64,
        fontWeight: 800,
        textColor: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 3,
        highlightWords: ["laughed", "joke"],
        highlightColor: "#FF3333",
        highlightScale: 1.25,
        springConfig: { damping: 10, stiffness: 130, mass: 0.4 },
        shadowConfig: { color: "rgba(0,0,0,0.7)", blur: 10, offsetY: 5 },
      },
    },

    {
      sceneId: 4,
      sceneTitle: "The Irony — Sealed Their Fate",
      visualType: "infographic_bar_chart",
      startFrame: 450,
      endFrame: 600,
      durationFrames: 150,
      durationSeconds: 5.0,
      narrationLine: "What they didn't realize is they had just sealed their own fate.",
      whisperTokens: [
        { word: "What", startMs: 0, endMs: 200, startFrame: 450, endFrame: 456 },
        { word: "they", startMs: 200, endMs: 380, startFrame: 456, endFrame: 461 },
        { word: "didn't", startMs: 380, endMs: 650, startFrame: 461, endFrame: 470 },
        { word: "realize", startMs: 650, endMs: 1100, startFrame: 470, endFrame: 483 },
        { word: "is", startMs: 1150, endMs: 1280, startFrame: 485, endFrame: 488 },
        { word: "they", startMs: 1280, endMs: 1450, startFrame: 488, endFrame: 494 },
        { word: "had", startMs: 1450, endMs: 1650, startFrame: 494, endFrame: 500 },
        { word: "just", startMs: 1650, endMs: 1900, startFrame: 500, endFrame: 507 },
        { word: "sealed", startMs: 1900, endMs: 2350, startFrame: 507, endFrame: 521 },
        { word: "their", startMs: 2350, endMs: 2550, startFrame: 521, endFrame: 527 },
        { word: "own", startMs: 2550, endMs: 2800, startFrame: 527, endFrame: 534 },
        { word: "fate.", startMs: 2800, endMs: 3400, startFrame: 534, endFrame: 552 },
      ],
      assetPrompts: {
        backgroundPrompt:
          "A dark, ominous corridor of a massive corporate building at night, long perspective, flickering fluorescent lights casting dramatic shadows, rain on windows reflecting city lights, cinematic 35mm film look, heavy teal color grading with dark shadows",
        foregroundCutoutPrompt:
          "Silhouette of a person walking away down a corridor, dramatic backlighting creating rim light, briefcase in hand, foreboding atmosphere, photorealistic, isolated on transparent background, PNG cutout",
        propsOverlays: [
          "A ticking analog clock with hands approaching midnight, dramatic lighting, transparent background PNG",
          "Thin wisps of dark fog/mist creeping along the bottom, cinematic atmosphere, transparent background PNG",
          "Faint ghostly reflection of the Blockbuster logo, slightly distorted, transparent background PNG",
        ],
      },
      imageKitUrls: {
        background:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/bg_scene4_dark_corridor.png?tr=w-1080,h-1920,fo-auto,f-webp,q-85",
        foreground:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/fg_scene4_silhouette_cutout.png?tr=w-700,h-1400,fo-auto,f-webp,q-90",
        props: [
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_clock.png?tr=w-350,f-webp,q-85",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/overlay_dark_fog.png?tr=w-1080,h-400,f-webp,q-80",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_ghost_logo.png?tr=w-500,f-webp,q-75",
        ],
      },
      animationRules: {
        backgroundMotion: {
          type: "slow_dolly_forward",
          scaleInterpolation: { inputRange: [450, 600], outputRange: [1.0, 1.08], easing: "easeInOutSine" },
        },
        foregroundMotion: {
          type: "character_walk_recede",
          entrance: {
            type: "fade_in_with_scale",
            triggerFrame: 455,
            springConfig: { damping: 12, stiffness: 80, mass: 1.0 },
            durationFrames: 20,
            fromOpacity: 0,
            toOpacity: 1.0,
            fromScale: 1.1,
            toScale: 1.0,
          },
          boil: {
            rotationOscillation: { minDeg: -0.4, maxDeg: 0.4, periodFrames: 25 },
            scaleOscillation: { minScale: 0.998, maxScale: 1.002, periodFrames: 30 },
          },
          scaleDrift: { inputRange: [450, 600], outputRange: [1.0, 0.92] },
        },
        projectedShadow: {
          enabled: true,
          skewX: "-25deg",
          translateY: 50,
          opacity: 0.4,
          blur: 12,
          color: "rgba(0,0,0,0.45)",
        },
        propsAnimations: [
          {
            propIndex: 0,
            motion: "slow_rotate_tick",
            startFrame: 460,
            rotationPerFrame: 0.2,
            position: { top: 100, right: 80 },
            scale: { inputRange: [460, 475], outputRange: [0, 1] },
            springConfig: { damping: 12, stiffness: 90 },
          },
          {
            propIndex: 1,
            motion: "creep_upward",
            startFrame: 450,
            blendMode: "screen",
            opacity: 0.3,
            translateY: { inputRange: [450, 600], outputRange: [100, -30] },
          },
          {
            propIndex: 2,
            motion: "pulse_fade",
            startFrame: 500,
            blendMode: "overlay",
            opacity: { inputRange: [500, 530, 560, 590], outputRange: [0, 0.25, 0.15, 0.3] },
            scale: { inputRange: [500, 600], outputRange: [0.9, 1.1] },
          },
        ],
        overlayFx: {
          type: "flickering_light",
          src: "https://cdn.saas.com/fx/flicker_light_loop.mp4",
          blendMode: "overlay",
          opacity: 0.15,
          loop: true,
        },
        transitionOut: {
          type: "hard_cut_flash",
          triggerFrame: 598,
          flashColor: "#FFFFFF",
          flashOpacity: 0.8,
          flashDurationFrames: 4,
        },
      },
      kineticCaptions: {
        style: "word_by_word_pop",
        position: { bottom: 320, horizontalAlign: "center" },
        fontFamily: "Bebas Neue",
        fontSize: 64,
        fontWeight: 800,
        textColor: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 3,
        highlightWords: ["sealed", "fate"],
        highlightColor: "#8B0000",
        highlightScale: 1.3,
        springConfig: { damping: 11, stiffness: 120, mass: 0.45 },
        shadowConfig: { color: "rgba(0,0,0,0.7)", blur: 10, offsetY: 5 },
      },
    },

    {
      sceneId: 5,
      sceneTitle: "The Rise — Netflix Soars Past $100B",
      visualType: "ecosystem_integration_hub",
      startFrame: 600,
      endFrame: 750,
      durationFrames: 150,
      durationSeconds: 5.0,
      narrationLine: "Within a decade, Netflix was worth over a hundred billion dollars.",
      whisperTokens: [
        { word: "Within", startMs: 0, endMs: 320, startFrame: 600, endFrame: 610 },
        { word: "a", startMs: 320, endMs: 400, startFrame: 610, endFrame: 612 },
        { word: "decade,", startMs: 400, endMs: 850, startFrame: 612, endFrame: 626 },
        { word: "Netflix", startMs: 900, endMs: 1350, startFrame: 627, endFrame: 641 },
        { word: "was", startMs: 1350, endMs: 1500, startFrame: 641, endFrame: 645 },
        { word: "worth", startMs: 1500, endMs: 1800, startFrame: 645, endFrame: 654 },
        { word: "over", startMs: 1800, endMs: 2050, startFrame: 654, endFrame: 662 },
        { word: "a", startMs: 2050, endMs: 2130, startFrame: 662, endFrame: 664 },
        { word: "hundred", startMs: 2130, endMs: 2500, startFrame: 664, endFrame: 675 },
        { word: "billion", startMs: 2500, endMs: 2950, startFrame: 675, endFrame: 689 },
        { word: "dollars.", startMs: 2950, endMs: 3500, startFrame: 689, endFrame: 705 },
      ],
      assetPrompts: {
        backgroundPrompt:
          "A futuristic digital stock market trading floor, massive LED screens showing Netflix stock chart going parabolic upward, green candlestick charts, holographic data visualizations, deep blue and electric green color grading, cinematic 35mm film look, volumetric light beams",
        foregroundCutoutPrompt:
          "The Netflix logo in 3D, large and imposing, glowing red with lens flare, slight upward angle making it look powerful and dominant, photorealistic, isolated on transparent background, PNG cutout",
        propsOverlays: [
          "Floating 3D text '$100,000,000,000' in glowing electric green, slight perspective rotation, transparent background PNG",
          "Rising green stock chart arrows flying upward, multiple sizes, dynamic composition, transparent background PNG",
          "Flying dollar bills and gold coins scattered in the air, motion blur on edges, transparent background PNG",
        ],
      },
      imageKitUrls: {
        background:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/bg_scene5_stock_market.png?tr=w-1080,h-1920,fo-auto,f-webp,q-85",
        foreground:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/fg_scene5_netflix_logo.png?tr=w-700,h-600,fo-auto,f-webp,q-90",
        props: [
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_100b_text.png?tr=w-600,f-webp,q-90",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_stock_arrows.png?tr=w-500,f-webp,q-85",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_money_flying.png?tr=w-600,f-webp,q-85",
        ],
      },
      animationRules: {
        backgroundMotion: {
          type: "energy_zoom_in",
          scaleInterpolation: { inputRange: [600, 750], outputRange: [1.0, 1.1], easing: "easeOutCubic" },
          brightnessShift: { inputRange: [600, 750], outputRange: [0.85, 1.15] },
        },
        foregroundMotion: {
          type: "hero_logo_reveal",
          entrance: {
            type: "scale_up_with_glow",
            triggerFrame: 610,
            springConfig: { damping: 12, stiffness: 100, mass: 1.0 },
            fromScale: 0.1,
            toScale: 1.0,
            glowColor: "#E50914",
            glowExpand: { inputRange: [610, 640], outputRange: [0, 30] },
          },
          boil: {
            rotationOscillation: { minDeg: -0.5, maxDeg: 0.5, periodFrames: 16 },
            scaleOscillation: { minScale: 0.996, maxScale: 1.004, periodFrames: 20 },
          },
          scaleDrift: { inputRange: [600, 750], outputRange: [1.0, 1.15] },
        },
        projectedShadow: { enabled: false },
        propsAnimations: [
          {
            propIndex: 0,
            motion: "counter_roll_in",
            startFrame: 640,
            springConfig: { damping: 10, stiffness: 160 },
            fromTranslateY: 300,
            toTranslateY: 0,
            fromOpacity: 0,
            toOpacity: 1.0,
            pulseGlow: { color: "#00FF66", periodFrames: 20, maxSpread: 15 },
          },
          {
            propIndex: 1,
            motion: "continuous_rise",
            startFrame: 620,
            translateY: { inputRange: [620, 750], outputRange: [200, -300] },
            opacity: { inputRange: [620, 640, 730, 750], outputRange: [0, 0.8, 0.8, 0] },
            scale: { inputRange: [620, 750], outputRange: [0.8, 1.2] },
          },
          {
            propIndex: 2,
            motion: "explosion_scatter",
            startFrame: 650,
            velocityRange: { x: [-4, 4], y: [-6, -2] },
            gravity: 0.08,
            rotationRange: [-180, 180],
            opacity: { inputRange: [650, 665, 730, 750], outputRange: [0, 0.9, 0.6, 0] },
          },
        ],
        overlayFx: {
          type: "ember_sparks",
          src: "https://cdn.saas.com/fx/ember_sparks_green_loop.mp4",
          blendMode: "screen",
          opacity: 0.3,
          loop: true,
        },
        transitionOut: {
          type: "whip_zoom_motion_blur",
          triggerFrame: 743,
          durationFrames: 7,
          motionBlurSamples: 5,
          zoomTarget: 3.5,
          directionDeg: 180,
          easing: "easeInExpo",
        },
      },
      kineticCaptions: {
        style: "word_by_word_pop",
        position: { bottom: 320, horizontalAlign: "center" },
        fontFamily: "Bebas Neue",
        fontSize: 68,
        fontWeight: 800,
        textColor: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 3,
        highlightWords: ["Netflix", "hundred", "billion"],
        highlightColor: "#00FF66",
        highlightScale: 1.2,
        springConfig: { damping: 11, stiffness: 110, mass: 0.5 },
        shadowConfig: { color: "rgba(0,0,0,0.6)", blur: 8, offsetY: 4 },
      },
    },

    {
      sceneId: 6,
      sceneTitle: "The Fall — Blockbuster's Bankruptcy",
      visualType: "handwritten_roadmap_checklist",
      startFrame: 750,
      endFrame: 900,
      durationFrames: 150,
      durationSeconds: 5.0,
      narrationLine:
        "And Blockbuster? They filed for bankruptcy in 2010 — the most expensive rejection in business history.",
      whisperTokens: [
        { word: "And", startMs: 0, endMs: 150, startFrame: 750, endFrame: 755 },
        { word: "Blockbuster?", startMs: 150, endMs: 700, startFrame: 755, endFrame: 771 },
        { word: "They", startMs: 750, endMs: 900, startFrame: 773, endFrame: 777 },
        { word: "filed", startMs: 900, endMs: 1200, startFrame: 777, endFrame: 786 },
        { word: "for", startMs: 1200, endMs: 1350, startFrame: 786, endFrame: 791 },
        { word: "bankruptcy", startMs: 1350, endMs: 1950, startFrame: 791, endFrame: 809 },
        { word: "in", startMs: 1950, endMs: 2050, startFrame: 809, endFrame: 812 },
        { word: "2010", startMs: 2050, endMs: 2550, startFrame: 812, endFrame: 827 },
        { word: "—", startMs: 2600, endMs: 2650, startFrame: 828, endFrame: 830 },
        { word: "the", startMs: 2650, endMs: 2780, startFrame: 830, endFrame: 833 },
        { word: "most", startMs: 2780, endMs: 3050, startFrame: 833, endFrame: 842 },
        { word: "expensive", startMs: 3050, endMs: 3500, startFrame: 842, endFrame: 855 },
        { word: "rejection", startMs: 3500, endMs: 4050, startFrame: 855, endFrame: 872 },
        { word: "in", startMs: 4050, endMs: 4150, startFrame: 872, endFrame: 875 },
        { word: "business", startMs: 4150, endMs: 4500, startFrame: 875, endFrame: 885 },
        { word: "history.", startMs: 4500, endMs: 4950, startFrame: 885, endFrame: 899 },
      ],
      assetPrompts: {
        backgroundPrompt:
          "An abandoned Blockbuster store exterior at dusk, shattered windows, faded peeling signage, overgrown weeds in cracked parking lot, a single flickering fluorescent light, rain falling, desolate and haunting, 35mm film grain, cold desaturated blue-gray color grading, cinematic wide shot",
        foregroundCutoutPrompt:
          "A large weathered 'STORE CLOSING — EVERYTHING MUST GO' banner hanging crooked across a storefront, torn edges, faded red and white, photorealistic, isolated on transparent background, PNG cutout",
        propsOverlays: [
          "Bold stamp text 'BANKRUPT' in deep blood-red with distressed grunge texture, cracking edges, transparent background PNG",
          "Old broken VHS tapes and empty DVD cases scattered on the ground, dusty and abandoned, transparent background PNG",
          "Heavy cinematic rain drops and streaks falling, atmospheric overlay, transparent background PNG",
        ],
      },
      imageKitUrls: {
        background:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/bg_scene6_abandoned_store.png?tr=w-1080,h-1920,fo-auto,f-webp,q-85",
        foreground:
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/fg_scene6_closing_banner.png?tr=w-800,h-500,fo-auto,f-webp,q-90",
        props: [
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_bankrupt_stamp.png?tr=w-550,f-webp,q-90",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/prop_broken_vhs.png?tr=w-500,f-webp,q-85",
          "https://ik.imagekit.io/motionreels/blockbuster-netflix/overlay_rain.png?tr=w-1080,h-1920,f-webp,q-80",
        ],
      },
      animationRules: {
        backgroundMotion: {
          type: "slow_dolly_back_reveal",
          scaleInterpolation: { inputRange: [750, 900], outputRange: [1.08, 1.0], easing: "easeOutSine" },
          desaturation: { inputRange: [750, 900], outputRange: [0, 0.3] },
        },
        foregroundMotion: {
          type: "banner_drop_sway",
          entrance: {
            type: "drop_from_top_with_swing",
            triggerFrame: 760,
            springConfig: { damping: 8, stiffness: 60, mass: 1.2 },
            fromTranslateY: -500,
            toTranslateY: 0,
            swingAmplitude: 8,
            swingDecayFrames: 40,
          },
          boil: {
            rotationOscillation: { minDeg: -1.5, maxDeg: 1.5, periodFrames: 30 },
            scaleOscillation: { minScale: 0.998, maxScale: 1.002, periodFrames: 35 },
          },
          scaleDrift: { inputRange: [750, 900], outputRange: [1.0, 1.03] },
        },
        projectedShadow: { enabled: false },
        propsAnimations: [
          {
            propIndex: 0,
            motion: "slam_stamp_in",
            startFrame: 800,
            fromScale: 5.0,
            toScale: 1.0,
            fromOpacity: 0,
            toOpacity: 1.0,
            springConfig: { damping: 6, stiffness: 220 },
            screenShake: { amplitude: 10, decayFrames: 15 },
            position: { top: "40%", centerX: true },
          },
          {
            propIndex: 1,
            motion: "static_ground_scatter",
            startFrame: 755,
            opacity: { inputRange: [755, 780], outputRange: [0, 0.6] },
            position: { bottom: 200, spread: 400 },
          },
          {
            propIndex: 2,
            motion: "continuous_fall",
            startFrame: 750,
            blendMode: "screen",
            opacity: 0.35,
            loop: true,
            translateY: { inputRange: [0, 30], outputRange: [-1920, 1920], loop: true },
          },
        ],
        overlayFx: {
          type: "rain_heavy",
          src: "https://cdn.saas.com/fx/heavy_rain_loop.mp4",
          blendMode: "screen",
          opacity: 0.28,
          loop: true,
        },
        transitionOut: {
          type: "tv_power_off",
          triggerFrame: 880,
          durationFrames: 20,
        },
      },
      kineticCaptions: {
        style: "word_by_word_pop",
        position: { bottom: 320, horizontalAlign: "center" },
        fontFamily: "Bebas Neue",
        fontSize: 64,
        fontWeight: 800,
        textColor: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 3,
        highlightWords: ["Blockbuster?", "bankruptcy", "expensive", "rejection"],
        highlightColor: "#CC0000",
        highlightScale: 1.2,
        springConfig: { damping: 12, stiffness: 100, mass: 0.5 },
        shadowConfig: { color: "rgba(0,0,0,0.7)", blur: 10, offsetY: 5 },
      },
    },
  ],

  globalAnimationDefaults: {
    characterBoil: {
      rotationOscillation: { minDeg: -0.8, maxDeg: 0.8, periodFrames: 18 },
      scaleOscillation: { minScale: 0.996, maxScale: 1.004, periodFrames: 22 },
    },
    projectedShadow: {
      skewX: "-35deg",
      translateY: 40,
      opacity: 0.35,
      blur: 8,
      color: "rgba(0,0,0,0.35)",
    },
    parallaxDepthRatio: { background: 1.0, foreground: 2.5, props: 1.8 },
    kineticCaptionDefaults: {
      fontFamily: "Bebas Neue",
      fontSize: 64,
      fontWeight: 800,
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      strokeWidth: 3,
      springConfig: { damping: 12, stiffness: 100, mass: 0.5 },
    },
    transitionDefaults: {
      whipZoomDuration: 8,
      motionBlurSamples: 5,
      defaultZoomTarget: 3.5,
    },
  },

  renderConfig: {
    codec: "h264",
    pixelFormat: "yuv420p",
    crf: 18,
    audioBitrate: "320k",
    imageFormat: "jpeg",
    jpegQuality: 90,
    concurrency: 4,
    everyNthFrame: 1,
    outputFile: "blockbuster_rejected_netflix_reel.mp4",
  },
};

/**
 * Resolves the execution plan with dynamically generated Pollinations AI image URLs.
 */
export function getResolvedExecutionPlan(options: PipelineOptions = {}): ExecutionPlan {
  const model = options.model || "flux";
  const seedBase = options.seed || 42;
  const isHd = options.quality === "hd";

  const bgWidth = isHd ? 1080 : 540;
  const bgHeight = isHd ? 1920 : 960;
  const fgWidth = isHd ? 800 : 400;
  const fgHeight = isHd ? 1400 : 700;

  return {
    ...baseExecutionPlan,
    scenes: baseExecutionPlan.scenes.map((scene) => {
      const bgUrl = generateSvgVectorStickerUrl(scene.assetPrompts.backgroundPrompt, `BACKGROUND ${scene.sceneId}`);
      const fgUrl = generateSvgVectorStickerUrl(scene.assetPrompts.foregroundCutoutPrompt, `CUTOUT ${scene.sceneId}`);
      const propUrls = scene.assetPrompts.propsOverlays.map((propPrompt) =>
        generateSvgVectorStickerUrl(propPrompt, `PROP ${scene.sceneId}`)
      );

      return {
        ...scene,
        imageKitUrls: {
          background: bgUrl,
          foreground: fgUrl,
          props: propUrls,
        },
      };
    }),
  };
}

export const executionPlan = getResolvedExecutionPlan();

/**
 * Converts a Convex reel database document into a fully hydrated ExecutionPlan.
 * Dynamically builds scenes, whisper caption tokens, narration lines, single-subject cutouts,
 * and Remotion timeline durations from convexReel.storyboard.
 */
export function convertConvexReelToExecutionPlan(convexReel: any): ExecutionPlan {
  const resolvedPlan = getResolvedExecutionPlan();

  if (!convexReel || !convexReel.storyboard || !Array.isArray(convexReel.storyboard) || convexReel.storyboard.length === 0) {
    return resolvedPlan;
  }

  const hasMasterVoiceover = Boolean(
    convexReel.fullVoiceoverUrl &&
    typeof convexReel.fullVoiceoverUrl === "string" &&
    convexReel.fullVoiceoverUrl.length > 10 &&
    !convexReel.fullVoiceoverUrl.includes("cdn.saas.com")
  );

  let currentFrameAcc = 0;

  const dynamicScenes = convexReel.storyboard.map((dbScene: any, index: number) => {
    const sceneId = dbScene.sceneId || index + 1;
    const narration = dbScene.narration || "";

    // Extract real Whisper tokens from DB (Deepgram STT) or generate fallback tokens
    const rawWhisperTokens = (dbScene.whisperTokens && Array.isArray(dbScene.whisperTokens) && dbScene.whisperTokens.length > 0)
      ? dbScene.whisperTokens
      : generateTokensFromText(narration, 0);

    const lastToken = rawWhisperTokens[rawWhisperTokens.length - 1];
    const lastTokenEndFrame = lastToken
      ? (lastToken.endFrame || Math.ceil((lastToken.endMs || 0) / 33.33))
      : 0;

    const baseDuration = dbScene.durationFrames || (dbScene.audioDurationSec ? Math.ceil(dbScene.audioDurationSec * 30) : 0);
    const durationFrames = Math.max(135, baseDuration, lastTokenEndFrame + 15);

    const startFrame = (typeof dbScene.startFrame === "number" && dbScene.startFrame >= currentFrameAcc)
      ? dbScene.startFrame
      : currentFrameAcc;

    const whisperTokens = rawWhisperTokens;

    currentFrameAcc = startFrame + durationFrames;

    const endFrame = startFrame + durationFrames;
    const durationSeconds = Math.round((durationFrames / 30) * 10) / 10;

    const baseScene = resolvedPlan.scenes[index % resolvedPlan.scenes.length];

    // Collect all generated image URLs for this scene (primary image + event images)
    const primaryImg = (dbScene.imageUrl && typeof dbScene.imageUrl === "string" && dbScene.imageUrl.length > 5)
      ? dbScene.imageUrl
      : "";

    const eventsList = (dbScene.events && Array.isArray(dbScene.events))
      ? dbScene.events
      : [];

    const eventImages = eventsList
      .map((ev: any) => ev.imageUrl)
      .filter((url: any) => typeof url === "string" && url.length > 5);

    const propUrls = eventImages.length > 0
      ? eventImages
      : (baseScene.imageKitUrls.props || []);

    const foregroundUrl = primaryImg || (eventImages[0] || baseScene.imageKitUrls.foreground);
    const bgUrl = (dbScene.bgImageUrl && typeof dbScene.bgImageUrl === "string" && dbScene.bgImageUrl.length > 5)
      ? dbScene.bgImageUrl
      : baseScene.imageKitUrls.background;

    const headlineWords = dbScene.headline ? dbScene.headline.split(/\s+/) : baseScene.kineticCaptions.highlightWords;

    return {
      ...baseScene,
      sceneId,
      sceneTitle: `SCENE ${sceneId}: ${dbScene.headline || baseScene.sceneTitle}`,
      startFrame,
      endFrame,
      durationFrames,
      durationSeconds,
      narrationLine: narration,
      visualType: dbScene.visualType || (baseScene as any).visualType || "center_cutout_hero",
      gsapType: dbScene.gsapType || (baseScene as any).gsapType || "grid_lines",
      entranceType: dbScene.entranceType || (baseScene as any).entranceType || "slide_corner_bottom_left",
      events: eventsList,
      whisperTokens,
      audioUrl: dbScene.audioUrl || "",
      imageKitUrls: {
        background: bgUrl,
        foreground: foregroundUrl,
        props: propUrls,
      },
      kineticCaptions: {
        ...baseScene.kineticCaptions,
        highlightWords: headlineWords,
      },
    };
  });

  const totalFrames = Math.max(900, currentFrameAcc);
  const totalSeconds = Math.round((totalFrames / 30) * 10) / 10;

  return {
    ...resolvedPlan,
    projectMeta: {
      ...resolvedPlan.projectMeta,
      title: convexReel.title || convexReel.topic || resolvedPlan.projectMeta.title,
      totalDurationFrames: totalFrames,
      totalDurationSeconds: totalSeconds,
    },
    audioPipeline: {
      ...resolvedPlan.audioPipeline,
      fullVoiceoverUrl: convexReel.fullVoiceoverUrl || "",
      masterWhisperTokens: convexReel.masterWhisperTokens || [],
    },
    scenes: dynamicScenes,
  };
}

/**
 * Generate Whisper token timestamps for narration text relative to scene startFrame.
 */
function generateTokensFromText(text: string, sceneStartFrame: number): WhisperToken[] {
  const words = text.split(/\s+/).filter(Boolean);
  // Cartesia TTS sonic-3 speech pace: ~180ms per word (5.4 frames/word @ 30 FPS)
  const durationPerWordMs = 180;

  return words.map((word, idx) => {
    const startMs = idx * durationPerWordMs;
    const endMs = (idx + 1) * durationPerWordMs;
    const wordStartFrame = sceneStartFrame + Math.floor(startMs / 33.33);
    const wordEndFrame = sceneStartFrame + Math.max(1, Math.ceil(endMs / 33.33));

    return {
      word,
      startMs,
      endMs,
      startFrame: wordStartFrame,
      endFrame: wordEndFrame,
    };
  });
}
