import { staticFile } from "remotion";
import type { Scene, SfxEvent } from "../types";

export type SfxSoundId =
  // Paper & Texture
  | "paper_rip"
  | "paper_tear_heavy"
  | "paper_slide"
  | "paper_turn"
  | "paper_rustle"
  | "paper_tape"
  | "paper_staple"
  // Mechanical & Hardware
  | "rubber_stamp"
  | "camera_shutter"
  | "camera_flash"
  | "film_slate"
  | "typewriter_key"
  | "typewriter_bell"
  | "keyboard_typing"
  | "mechanical_click"
  | "mouse_click"
  | "switch_click"
  | "lamp_switch"
  // Motion & Cinematics
  | "whip_whoosh"
  | "whip_fast"
  | "cinematic_whoosh"
  | "light_swoosh"
  | "cinematic_sub_boom"
  | "cinematic_boom_heavy"
  | "tension_riser"
  // Accents & Dopamine Hits
  | "marker_highlighter"
  | "marker_stroke_long"
  | "tactile_pop"
  | "bubble_pop"
  | "cash_register"
  | "coin_clink"
  | "bell_ding"
  | "bell_desk"
  | "success_chime"
  | "record_scratch"
  | "tape_rewind"
  | "clock_ticking"
  | "digital_glitch"
  | "glass_shatter";

export interface SfxItemDef {
  id: SfxSoundId;
  fileName: string;
  defaultVolume: number;
  maxDurationFrames?: number;
  description: string;
}

/**
 * Master catalog of 39 broadcast-grade tactile sound effects.
 * Calibrated between -16dB and -22dB relative to dialogue (0dB)
 * to maintain 100% speech clarity with crisp physical texture.
 */
export const SFX_CATALOG: Record<SfxSoundId, SfxItemDef> = {
  // ── Paper & Texture ──
  paper_rip: {
    id: "paper_rip",
    fileName: "paper_rip.mp3",
    defaultVolume: 0.20,
    maxDurationFrames: 18,
    description: "Crisp paper tear wipe for scene transitions and cutout exits",
  },
  paper_tear_heavy: {
    id: "paper_tear_heavy",
    fileName: "paper_tear_heavy.mp3",
    defaultVolume: 0.22,
    maxDurationFrames: 30,
    description: "Heavy textured paper sheet tear",
  },
  paper_slide: {
    id: "paper_slide",
    fileName: "paper_slide.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 22,
    description: "Page flip and document slide into frame",
  },
  paper_turn: {
    id: "paper_turn",
    fileName: "paper_turn.mp3",
    defaultVolume: 0.15,
    maxDurationFrames: 20,
    description: "Manual page turn / dossier reveal",
  },
  paper_rustle: {
    id: "paper_rustle",
    fileName: "paper_rustle.mp3",
    defaultVolume: 0.15,
    maxDurationFrames: 25,
    description: "Newspaper clipping rustle and placement",
  },
  paper_tape: {
    id: "paper_tape",
    fileName: "paper_tape.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 16,
    description: "Masking tape stick on polaroids and clippings",
  },
  paper_staple: {
    id: "paper_staple",
    fileName: "paper_staple.wav",
    defaultVolume: 0.20,
    maxDurationFrames: 14,
    description: "Staple clamp for memos and evidence dossiers",
  },

  // ── Mechanical & Hardware ──
  rubber_stamp: {
    id: "rubber_stamp",
    fileName: "rubber_stamp.mp3",
    defaultVolume: 0.28,
    maxDurationFrames: 24,
    description: "Heavy rubber stamp seal impact (APPROVED / REJECTED)",
  },
  camera_shutter: {
    id: "camera_shutter",
    fileName: "camera_shutter.mp3",
    defaultVolume: 0.22,
    maxDurationFrames: 16,
    description: "Vintage SLR camera shutter snap for polaroid snapshots",
  },
  camera_flash: {
    id: "camera_flash",
    fileName: "camera_flash.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 20,
    description: "High-voltage camera flash recharge",
  },
  film_slate: {
    id: "film_slate",
    fileName: "film_slate.mp3",
    defaultVolume: 0.24,
    maxDurationFrames: 14,
    description: "Film clapper slate snap for cinematic director cuts",
  },
  typewriter_key: {
    id: "typewriter_key",
    fileName: "typewriter_key.mp3",
    defaultVolume: 0.12,
    maxDurationFrames: 24,
    description: "Vintage electric typewriter keystrokes",
  },
  typewriter_bell: {
    id: "typewriter_bell",
    fileName: "typewriter_bell.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 25,
    description: "Typewriter carriage return bell ding",
  },
  keyboard_typing: {
    id: "keyboard_typing",
    fileName: "keyboard_typing.mp3",
    defaultVolume: 0.10,
    maxDurationFrames: 28,
    description: "Rapid mechanical keyboard typing stream",
  },
  mechanical_click: {
    id: "mechanical_click",
    fileName: "mechanical_click.wav",
    defaultVolume: 0.16,
    maxDurationFrames: 12,
    description: "Crisp mechanical switch / key click",
  },
  mouse_click: {
    id: "mouse_click",
    fileName: "mouse_click.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 10,
    description: "Subtle mouse click / UI tap",
  },
  switch_click: {
    id: "switch_click",
    fileName: "switch_click.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 12,
    description: "Tactile toggle switch click",
  },
  lamp_switch: {
    id: "lamp_switch",
    fileName: "lamp_switch.mp3",
    defaultVolume: 0.20,
    maxDurationFrames: 16,
    description: "Overhead swinging lamp knob turn & click",
  },

  // ── Motion & Cinematics ──
  whip_whoosh: {
    id: "whip_whoosh",
    fileName: "whip_whoosh.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 18,
    description: "Fast whip whoosh for curve cuts and snap zooms",
  },
  whip_fast: {
    id: "whip_fast",
    fileName: "whip_fast.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 14,
    description: "Crisp speed whoosh for corner slide entrances",
  },
  cinematic_whoosh: {
    id: "cinematic_whoosh",
    fileName: "cinematic_whoosh.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 24,
    description: "Wide cinematic air whoosh for focal pans",
  },
  light_swoosh: {
    id: "light_swoosh",
    fileName: "light_swoosh.mp3",
    defaultVolume: 0.14,
    maxDurationFrames: 15,
    description: "Light swoosh for leader lines and trend arrow curves",
  },
  cinematic_sub_boom: {
    id: "cinematic_sub_boom",
    fileName: "cinematic_sub_boom.mp3",
    defaultVolume: 0.28,
    maxDurationFrames: 40,
    description: "Deep cinematic sub-bass impact for Scene 1 hook & climax",
  },
  cinematic_boom_heavy: {
    id: "cinematic_boom_heavy",
    fileName: "cinematic_boom_heavy.mp3",
    defaultVolume: 0.26,
    maxDurationFrames: 35,
    description: "Massive cinematic revelation boom",
  },
  tension_riser: {
    id: "tension_riser",
    fileName: "tension_riser.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 40,
    description: "Tension riser building up before big paradoxes and reveals",
  },

  // ── Accents & Dopamine Hits ──
  marker_highlighter: {
    id: "marker_highlighter",
    fileName: "marker_highlighter.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 16,
    description: "Signature yellow highlighter squeak across headlines",
  },
  marker_stroke_long: {
    id: "marker_stroke_long",
    fileName: "marker_stroke_long.mp3",
    defaultVolume: 0.16,
    maxDurationFrames: 22,
    description: "Extended marker stroke underline",
  },
  tactile_pop: {
    id: "tactile_pop",
    fileName: "tactile_pop.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 12,
    description: "Crisp tactile pop for bullet lists, sticker drops, and badges",
  },
  bubble_pop: {
    id: "bubble_pop",
    fileName: "bubble_pop.mp3",
    defaultVolume: 0.14,
    maxDurationFrames: 10,
    description: "Subtle bubble pop for secondary tags and nodes",
  },
  cash_register: {
    id: "cash_register",
    fileName: "cash_register.mp3",
    defaultVolume: 0.22,
    maxDurationFrames: 26,
    description: "Cash register cha-ching for revenue stats & dollar figures",
  },
  coin_clink: {
    id: "coin_clink",
    fileName: "coin_clink.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 14,
    description: "Coin clink on upward metrics & financial charts",
  },
  bell_ding: {
    id: "bell_ding",
    fileName: "bell_ding.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 22,
    description: "Elevator bell ding on key milestones and stat reveals",
  },
  bell_desk: {
    id: "bell_desk",
    fileName: "bell_desk.mp3",
    defaultVolume: 0.20,
    maxDurationFrames: 22,
    description: "Service desk bell ring",
  },
  success_chime: {
    id: "success_chime",
    fileName: "success_chime.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 18,
    description: "Positive confirmation chime for roadmap checkmarks",
  },
  record_scratch: {
    id: "record_scratch",
    fileName: "record_scratch.mp3",
    defaultVolume: 0.22,
    maxDurationFrames: 20,
    description: "Record scratch for counter-intuitive twists & 'Wait...' moments",
  },
  tape_rewind: {
    id: "tape_rewind",
    fileName: "tape_rewind.mp3",
    defaultVolume: 0.18,
    maxDurationFrames: 24,
    description: "Cassette tape rewind for flashback scenes",
  },
  clock_ticking: {
    id: "clock_ticking",
    fileName: "clock_ticking.mp3",
    defaultVolume: 0.12,
    maxDurationFrames: 35,
    description: "Urgent clock ticking for timeline roadmaps and deadlines",
  },
  digital_glitch: {
    id: "digital_glitch",
    fileName: "digital_glitch.mp3",
    defaultVolume: 0.14,
    maxDurationFrames: 14,
    description: "Digital telemetry glitch for matrix hacker & cyber themes",
  },
  glass_shatter: {
    id: "glass_shatter",
    fileName: "glass_shatter.mp3",
    defaultVolume: 0.20,
    maxDurationFrames: 22,
    description: "Glass shatter for failure, bankruptcy, and collapse beats",
  },
};

/**
 * Resolves static URL for any SFX sound ID
 */
export function getSfxUrl(soundId: SfxSoundId | string): string {
  const sound = SFX_CATALOG[soundId as SfxSoundId];
  if (sound) {
    return staticFile(`/sfx/${sound.fileName}`);
  }
  if (typeof soundId === "string" && (soundId.startsWith("/") || soundId.startsWith("http"))) {
    return soundId.startsWith("/") ? staticFile(soundId) : soundId;
  }
  return staticFile("/sfx/tactile_pop.mp3");
}

export interface ComputedSfxCue {
  id: string;
  soundId: SfxSoundId;
  frame: number;
  durationFrames: number;
  volume: number;
  label: string;
}

const ALL_LAYOUT_ORDER: string[] = [
  "center_hero_cutout",
  "split_left_cutout_right_memo",
  "split_left_newspaper_right_cutout",
  "revenue_stat_trend",
  "punchline_quote_spotlight",
  "infographic_bar_chart",
  "dual_cutout_versus",
  "list_bullets_left_cutout_right",
  "timeline_milestone_road",
  "spotlight_magnifier_document",
  "circular_orbit_infographic",
  "breaking_news_alert_ticker",
  "matrix_scramble_hacker",
  "bento_grid_showcase",
  "ecosystem_integration_hub",
  "handwritten_roadmap_checklist",
  "editorial_strikethrough_swap",
  "visual_metaphor_documentary",
  "advanced_data_viz_suite",
  "conspiracy_evidence_board",
  "kinetic_typography_marquee",
];

function resolveLayout(scene: Scene, sceneIndex: number): string {
  const raw = String((scene as any).layoutType || (scene as any).visualType || "").toLowerCase();
  if (raw) {
    if (raw.includes("conspiracy") || raw.includes("evidence") || raw.includes("yarn") || raw.includes("board")) return "conspiracy_evidence_board";
    if (raw.includes("metaphor") || raw.includes("scale") || raw.includes("funnel") || raw.includes("vault") || raw.includes("speedometer")) return "visual_metaphor_documentary";
    if (raw.includes("data_viz") || raw.includes("spline") || raw.includes("donut") || raw.includes("matrix_table") || raw.includes("feature_matrix")) return "advanced_data_viz_suite";
    if (raw.includes("marquee") || raw.includes("typography_marquee") || raw.includes("wallpaper")) return "kinetic_typography_marquee";
    if (raw.includes("saas") || raw.includes("product_hero") || raw.includes("browser")) return "saas_product_hero";
    if (raw.includes("split_left_right") || raw.includes("memo")) return "split_left_cutout_right_memo";
    if (raw.includes("newspaper")) return "split_left_newspaper_right_cutout";
    if (raw.includes("stat") || raw.includes("trend") || raw.includes("revenue")) return "revenue_stat_trend";
    if (raw.includes("quote") || raw.includes("spotlight")) return "punchline_quote_spotlight";
    if (raw.includes("bar") || raw.includes("chart")) return "infographic_bar_chart";
    if (raw.includes("versus") || raw.includes("dual")) return "dual_cutout_versus";
    if (raw.includes("bullet") || raw.includes("list")) return "list_bullets_left_cutout_right";
    if (raw.includes("timeline") || raw.includes("road")) return "timeline_milestone_road";
    if (raw.includes("magnifier") || raw.includes("lens")) return "spotlight_magnifier_document";
    if (raw.includes("orbit") || raw.includes("circular")) return "circular_orbit_infographic";
    if (raw.includes("ticker") || raw.includes("alert")) return "breaking_news_alert_ticker";
    if (raw.includes("matrix") || raw.includes("hacker") || raw.includes("code")) return "matrix_scramble_hacker";
    if (raw.includes("bento")) return "bento_grid_showcase";
    if (raw.includes("constellation") || raw.includes("integration")) return "ecosystem_integration_hub";
    if (raw.includes("checklist") || raw.includes("roadmap")) return "handwritten_roadmap_checklist";
    if (raw.includes("editorial") || raw.includes("correction") || raw.includes("strikethrough")) return "editorial_strikethrough_swap";
    if (raw.includes("hero") || raw.includes("center")) return "center_hero_cutout";
  }

  const normalizedIndex = Math.max(0, sceneIndex - 1);
  return ALL_LAYOUT_ORDER[normalizedIndex % ALL_LAYOUT_ORDER.length];
}

/**
 * Computes elegant, restrained, broadcast-quality tactile Foley sound cues.
 * Follows the 1-Transition + 1-Accent + 1-PreRiser hierarchy
 * to maintain 100% speech clarity with physical texture.
 */
export function computeSceneTactileCues(scene: Scene, sceneIndex: number, totalScenes: number = 6): ComputedSfxCue[] {
  const cues: ComputedSfxCue[] = [];
  const sceneStart = scene.startFrame;
  const layout = resolveLayout(scene, sceneIndex);
  const headline = String((scene as any).headline || scene.sceneTitle || "").toLowerCase();
  const narration = String((scene as any).narration || scene.narrationLine || "").toLowerCase();
  const explicitCue = (scene as any).sfxCue as SfxSoundId | undefined;

  // ── 0. PRE-TRANSITION TENSION RISER (Begins 15 frames before scene cut) ──
  if (sceneIndex < totalScenes - 1 && scene.durationFrames >= 24) {
    const riserStart = sceneStart + scene.durationFrames - 15;
    cues.push({
      id: `riser-${scene.sceneId}`,
      soundId: "tension_riser",
      frame: riserStart,
      durationFrames: 15,
      volume: 0.16,
      label: `Scene ${scene.sceneId} Pre-Transition Tension Riser`,
    });
  }

  // ── 1. TRANSITION & 3D SPATIAL FLIGHT FOLEY ──
  if (sceneIndex === 0) {
    // Scene 1 Hook: Cinematic Sub Boom
    cues.push({
      id: `hook-sub-${scene.sceneId}`,
      soundId: "cinematic_sub_boom",
      frame: sceneStart,
      durationFrames: 35,
      volume: 0.28,
      label: "Scene 1 Hook Sub Bass Drop",
    });
  } else {
    // 3D Spatial Camera Flight Triplet:
    // Flight occurs over the 30-frame window [sceneStart - 30, sceneStart]

    // A. Takeoff Document Release (T - 26): Paper lifts off desk
    if (sceneStart >= 26) {
      cues.push({
        id: `flight-takeoff-${scene.sceneId}`,
        soundId: "paper_slide",
        frame: sceneStart - 26,
        durationFrames: 18,
        volume: 0.16,
        label: `Scene ${scene.sceneId} 3D Crane Takeoff Document Slide`,
      });
    }

    // B. Peak Mid-Air 3D Velocity Swoop (T - 15): Aerodynamic air whoosh
    if (sceneStart >= 15) {
      cues.push({
        id: `flight-swoop-${scene.sceneId}`,
        soundId: "cinematic_whoosh",
        frame: sceneStart - 15,
        durationFrames: 22,
        volume: 0.22,
        label: `Scene ${scene.sceneId} 3D Camera Velocity Whoosh`,
      });
    }

    // C. Document Touchdown & Tape / Pin Anchor (T): Tangible physical contact
    const isPaperTheme =
      layout.includes("memo") ||
      layout.includes("newspaper") ||
      layout.includes("editorial") ||
      layout.includes("document") ||
      layout.includes("evidence") ||
      layout.includes("conspiracy");

    if (sceneIndex === totalScenes - 1) {
      // Climax Revelation Boom on arrival
      cues.push({
        id: `climax-boom-${scene.sceneId}`,
        soundId: "cinematic_boom_heavy",
        frame: sceneStart,
        durationFrames: 35,
        volume: 0.26,
        label: "Climax Revelation Sub Boom",
      });
    } else {
      cues.push({
        id: `flight-landing-${scene.sceneId}`,
        soundId: isPaperTheme ? "paper_tape" : "tactile_pop",
        frame: sceneStart,
        durationFrames: 16,
        volume: 0.20,
        label: `Scene ${scene.sceneId} Document Touchdown Anchor`,
      });
    }
  }

  // ── 2. HEADLINE YELLOW HIGHLIGHTER SQUEAK (Frame 6) ──
  // Timed to signature Vox yellow highlight sweep across the headline keyword
  if (scene.durationFrames >= 20) {
    cues.push({
      id: `highlight-marker-${scene.sceneId}`,
      soundId: "marker_highlighter",
      frame: sceneStart + 6,
      durationFrames: 16,
      volume: 0.16,
      label: `Scene ${scene.sceneId} Yellow Marker Sweep`,
    });
  }

  // ── 3. CONTEXTUAL ACTION ACCENT FOLEY (Keyframe-locked & Composite Stacks) ──
  if (explicitCue && SFX_CATALOG[explicitCue]) {
    // Explicit AI-assigned cue
    cues.push({
      id: `accent-explicit-${scene.sceneId}`,
      soundId: explicitCue,
      frame: sceneStart + 12,
      durationFrames: SFX_CATALOG[explicitCue].maxDurationFrames || 20,
      volume: SFX_CATALOG[explicitCue].defaultVolume,
      label: `Scene ${scene.sceneId} Accent: ${explicitCue}`,
    });
    return cues;
  }

  const isTwist = headline.includes("mistake") || headline.includes("galti") || headline.includes("rejected") || headline.includes("bankrupt") || headline.includes("fail") || headline.includes("warning");
  const isFinancial = headline.includes("$") || headline.includes("m") || headline.includes("b") || headline.includes("revenue") || headline.includes("loss") || headline.includes("profit") || narration.includes("dollar") || narration.includes("crore") || narration.includes("million") || narration.includes("billion");

  if (layout === "conspiracy_evidence_board") {
    // Conspiracy Board: String connection at frame 12, Rubber stamp impact at frame 32
    cues.push({
      id: `accent-yarn-${scene.sceneId}`,
      soundId: "paper_tape",
      frame: sceneStart + 12,
      durationFrames: 16,
      volume: 0.18,
      label: `Scene ${scene.sceneId} Red Yarn Pin Snap`,
    });
    cues.push({
      id: `accent-stamp-${scene.sceneId}`,
      soundId: "rubber_stamp",
      frame: sceneStart + 32,
      durationFrames: 22,
      volume: 0.28,
      label: `Scene ${scene.sceneId} Forensic Stamp Slam`,
    });
    cues.push({
      id: `accent-stamp-boom-${scene.sceneId}`,
      soundId: "cinematic_sub_boom",
      frame: sceneStart + 32,
      durationFrames: 20,
      volume: 0.14,
      label: `Scene ${scene.sceneId} Stamp Sub Weight`,
    });
  } else if (layout === "visual_metaphor_documentary") {
    const isScale = headline.includes("scale") || headline.includes("cost") || headline.includes("balance") || headline.includes("weigh");
    const isFunnel = headline.includes("funnel") || headline.includes("leak") || headline.includes("churn") || headline.includes("drop");
    const isVault = headline.includes("vault") || headline.includes("lock") || headline.includes("security") || headline.includes("safe");

    if (isScale) {
      cues.push({
        id: `accent-scale-coin-${scene.sceneId}`,
        soundId: "coin_clink",
        frame: sceneStart + 14,
        durationFrames: 18,
        volume: 0.22,
        label: `Scene ${scene.sceneId} Scale Weight Drop`,
      });
      cues.push({
        id: `accent-scale-thud-${scene.sceneId}`,
        soundId: "rubber_stamp",
        frame: sceneStart + 28,
        durationFrames: 20,
        volume: 0.20,
        label: `Scene ${scene.sceneId} Balance Scale Tilt Impact`,
      });
    } else if (isFunnel) {
      cues.push({
        id: `accent-funnel-bubble-${scene.sceneId}`,
        soundId: "bubble_pop",
        frame: sceneStart + 16,
        durationFrames: 12,
        volume: 0.20,
        label: `Scene ${scene.sceneId} Funnel Churn Bubble`,
      });
      cues.push({
        id: `accent-funnel-drip-${scene.sceneId}`,
        soundId: "paper_slide",
        frame: sceneStart + 26,
        durationFrames: 16,
        volume: 0.16,
        label: `Scene ${scene.sceneId} Funnel Fluid Fill`,
      });
    } else if (isVault) {
      cues.push({
        id: `accent-vault-click-${scene.sceneId}`,
        soundId: "mechanical_click",
        frame: sceneStart + 12,
        durationFrames: 16,
        volume: 0.22,
        label: `Scene ${scene.sceneId} Vault Tumbler Click`,
      });
      cues.push({
        id: `accent-vault-lock-${scene.sceneId}`,
        soundId: "cinematic_sub_boom",
        frame: sceneStart + 30,
        durationFrames: 24,
        volume: 0.24,
        label: `Scene ${scene.sceneId} Vault Deadbolt Lock Slam`,
      });
    } else {
      // Speedometer
      cues.push({
        id: `accent-speed-needle-${scene.sceneId}`,
        soundId: "tension_riser",
        frame: sceneStart + 8,
        durationFrames: 18,
        volume: 0.18,
        label: `Scene ${scene.sceneId} Tachometer Rev Riser`,
      });
      cues.push({
        id: `accent-speed-pop-${scene.sceneId}`,
        soundId: "tactile_pop",
        frame: sceneStart + 26,
        durationFrames: 10,
        volume: 0.18,
        label: `Scene ${scene.sceneId} Redline Rev Limiter Bounce`,
      });
    }
  } else if (layout === "advanced_data_viz_suite") {
    const isDonut = headline.includes("donut") || headline.includes("percent") || headline.includes("gauge") || headline.includes("share");
    const isMatrix = headline.includes("matrix") || headline.includes("versus") || headline.includes("comparison") || headline.includes("audit");

    if (isDonut) {
      cues.push({
        id: `accent-donut-click-${scene.sceneId}`,
        soundId: "mechanical_click",
        frame: sceneStart + 14,
        durationFrames: 16,
        volume: 0.20,
        label: `Scene ${scene.sceneId} Radial Donut Gauge Tick`,
      });
      cues.push({
        id: `accent-donut-ding-${scene.sceneId}`,
        soundId: "bell_ding",
        frame: sceneStart + 26,
        durationFrames: 20,
        volume: 0.22,
        label: `Scene ${scene.sceneId} Donut Target Reached`,
      });
    } else if (isMatrix) {
      cues.push({
        id: `accent-matrix-staple-${scene.sceneId}`,
        soundId: "paper_staple",
        frame: sceneStart + 14,
        durationFrames: 16,
        volume: 0.20,
        label: `Scene ${scene.sceneId} Matrix Row Audit Check`,
      });
      cues.push({
        id: `accent-matrix-stamp-${scene.sceneId}`,
        soundId: "rubber_stamp",
        frame: sceneStart + 32,
        durationFrames: 22,
        volume: 0.26,
        label: `Scene ${scene.sceneId} Matrix Verdict Stamp`,
      });
    } else {
      // Spline Area Graph
      cues.push({
        id: `accent-spline-swoosh-${scene.sceneId}`,
        soundId: "light_swoosh",
        frame: sceneStart + 12,
        durationFrames: 16,
        volume: 0.18,
        label: `Scene ${scene.sceneId} Spline Path Draw`,
      });
      cues.push({
        id: `accent-spline-chime-${scene.sceneId}`,
        soundId: "success_chime",
        frame: sceneStart + 28,
        durationFrames: 20,
        volume: 0.20,
        label: `Scene ${scene.sceneId} Spline Value Peak Chime`,
      });
    }
  } else if (layout === "kinetic_typography_marquee") {
    cues.push({
      id: `accent-marquee-slide-${scene.sceneId}`,
      soundId: "paper_slide",
      frame: sceneStart + 8,
      durationFrames: 18,
      volume: 0.16,
      label: `Scene ${scene.sceneId} Marquee Ribbon Drift`,
    });
    cues.push({
      id: `accent-marquee-stamp-${scene.sceneId}`,
      soundId: "rubber_stamp",
      frame: sceneStart + 26,
      durationFrames: 22,
      volume: 0.24,
      label: `Scene ${scene.sceneId} Evidence Stamp Impact`,
    });
  } else if (layout === "saas_product_hero") {
    cues.push({
      id: `accent-saas-click-${scene.sceneId}`,
      soundId: "mouse_click",
      frame: sceneStart + 18,
      durationFrames: 12,
      volume: 0.24,
      label: `Scene ${scene.sceneId} Cursor Click Impact`,
    });
    cues.push({
      id: `accent-saas-ripple-${scene.sceneId}`,
      soundId: "bubble_pop",
      frame: sceneStart + 22,
      durationFrames: 10,
      volume: 0.16,
      label: `Scene ${scene.sceneId} Click Ripple Pop`,
    });
  } else if (isTwist && sceneIndex > 0 && sceneIndex < totalScenes - 1) {
    // Dramatic narrative reversal / mistake
    cues.push({
      id: `accent-twist-${scene.sceneId}`,
      soundId: "record_scratch",
      frame: sceneStart + 10,
      durationFrames: 20,
      volume: 0.22,
      label: `Scene ${scene.sceneId} Twist Record Scratch`,
    });
  } else if (isFinancial || layout === "revenue_stat_trend" || layout === "infographic_bar_chart") {
    // Financial revenue / stat peak (Composite: register + tactile pop)
    cues.push({
      id: `accent-stat-${scene.sceneId}`,
      soundId: isFinancial ? "cash_register" : "coin_clink",
      frame: sceneStart + 14,
      durationFrames: 24,
      volume: 0.22,
      label: `Scene ${scene.sceneId} Financial Revenue Ding`,
    });
    cues.push({
      id: `accent-stat-pop-${scene.sceneId}`,
      soundId: "tactile_pop",
      frame: sceneStart + 15,
      durationFrames: 10,
      volume: 0.14,
      label: `Scene ${scene.sceneId} Stat Pop Accent`,
    });
  } else if (layout === "punchline_quote_spotlight") {
    // Polaroid photo snapshot + flash snap
    cues.push({
      id: `accent-shutter-${scene.sceneId}`,
      soundId: "camera_shutter",
      frame: sceneStart + 8,
      durationFrames: 16,
      volume: 0.22,
      label: `Scene ${scene.sceneId} Polaroid Shutter Snap`,
    });
  } else if (layout === "matrix_scramble_hacker") {
    // Cyber matrix decode
    cues.push({
      id: `accent-glitch-${scene.sceneId}`,
      soundId: "digital_glitch",
      frame: sceneStart + 8,
      durationFrames: 14,
      volume: 0.16,
      label: `Scene ${scene.sceneId} Cyber Matrix Glitch`,
    });
  } else if (layout === "handwritten_roadmap_checklist") {
    // Checklist milestone confirmation
    cues.push({
      id: `accent-chime-${scene.sceneId}`,
      soundId: "success_chime",
      frame: sceneStart + 14,
      durationFrames: 18,
      volume: 0.18,
      label: `Scene ${scene.sceneId} Roadmap Success Chime`,
    });
  } else if (layout === "editorial_strikethrough_swap" || layout === "center_hero_cutout") {
    // Composite Heavy Stamp: rubber stamp at keyframe 18 + subtle sub boom for tactile weight
    cues.push({
      id: `accent-stamp-${scene.sceneId}`,
      soundId: "rubber_stamp",
      frame: sceneStart + 18,
      durationFrames: 22,
      volume: 0.26,
      label: `Scene ${scene.sceneId} Keyframe-18 Rubber Stamp Impact`,
    });
    cues.push({
      id: `accent-stamp-boom-${scene.sceneId}`,
      soundId: "cinematic_sub_boom",
      frame: sceneStart + 18,
      durationFrames: 24,
      volume: 0.14,
      label: `Scene ${scene.sceneId} Stamp Sub-Weight`,
    });
  } else if (layout === "split_left_cutout_right_memo" || layout === "spotlight_magnifier_document") {
    // Document / memo paper slide
    cues.push({
      id: `accent-paper-${scene.sceneId}`,
      soundId: "paper_slide",
      frame: sceneStart + 8,
      durationFrames: 18,
      volume: 0.16,
      label: `Scene ${scene.sceneId} Memo Document Slide`,
    });
  } else {
    // Clean subtle physical card drop
    cues.push({
      id: `accent-pop-${scene.sceneId}`,
      soundId: "tactile_pop",
      frame: sceneStart + 7,
      durationFrames: 12,
      volume: 0.18,
      label: `Scene ${scene.sceneId} Tactile Card Pop`,
    });
  }

  return cues;
}
