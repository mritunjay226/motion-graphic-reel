import React from "react";
import type { Scene } from "../types";
import type { VideoTheme } from "../utils/themes";

import { Template1CenterHero } from "./Template1CenterHero";
import { Template2SplitMemo } from "./Template2SplitMemo";
import { Template3NewspaperCutout } from "./Template3NewspaperCutout";
import { Template4StatTrend } from "./Template4StatTrend";
import { Template5QuoteSpotlight } from "./Template5QuoteSpotlight";
import { Template6BarChart } from "./Template6BarChart";
import { Template7DualVersus } from "./Template7DualVersus";
import { Template8BulletList } from "./Template8BulletList";
import { Template9TimelineRoad } from "./Template9TimelineRoad";
import { Template10MagnifierDoc } from "./Template10MagnifierDoc";
import { Template11OrbitInfographic } from "./Template11OrbitInfographic";
import { Template12BreakingTicker } from "./Template12BreakingTicker";

// Remocn-Powered High-Retention Layout Templates
import { Template13MatrixHacker } from "./Template13MatrixHacker";
import { Template14BentoShowcase } from "./Template14BentoShowcase";
import { Template15IntegrationConstellation } from "./Template15IntegrationConstellation";
import { Template16RoadmapChecklist } from "./Template16RoadmapChecklist";
import { Template17EditorialCorrection } from "./Template17EditorialCorrection";
import { Template18SaaSHero } from "./Template18SaaSHero";
import { Template19VisualMetaphors } from "./Template19VisualMetaphors";
import { Template20DataVizSuite } from "./Template20DataVizSuite";
import { Template21EvidenceBoard } from "./Template21EvidenceBoard";
import { Template22KineticTypography } from "./Template22KineticTypography";

export type VoxLayoutType =
  | "center_hero_cutout"
  | "split_left_cutout_right_memo"
  | "split_left_newspaper_right_cutout"
  | "revenue_stat_trend"
  | "punchline_quote_spotlight"
  | "infographic_bar_chart"
  | "dual_cutout_versus"
  | "list_bullets_left_cutout_right"
  | "timeline_milestone_road"
  | "spotlight_magnifier_document"
  | "circular_orbit_infographic"
  | "breaking_news_alert_ticker"
  | "matrix_scramble_hacker"
  | "bento_grid_showcase"
  | "ecosystem_integration_hub"
  | "handwritten_roadmap_checklist"
  | "editorial_strikethrough_swap"
  | "visual_metaphor_documentary"
  | "advanced_data_viz_suite"
  | "conspiracy_evidence_board"
  | "kinetic_typography_marquee"
  | "saas_product_hero";

/**
 * STRICT GENRE PARTITIONING:
 * Prevents cross-contamination between Documentary/Explainer reels and SaaS/Tech Product reels.
 */
export const DOCUMENTARY_LAYOUT_TYPES: VoxLayoutType[] = [
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
  "handwritten_roadmap_checklist",
  "editorial_strikethrough_swap",
  "visual_metaphor_documentary",
  "advanced_data_viz_suite",
  "conspiracy_evidence_board",
  "kinetic_typography_marquee",
];

export const SAAS_LAYOUT_TYPES: VoxLayoutType[] = [
  "saas_product_hero",
  "matrix_scramble_hacker",
  "bento_grid_showcase",
  "ecosystem_integration_hub",
];

/** Default rotation for documentary reels (strictly excludes SaaS-only UI layouts) */
export const ALL_LAYOUT_TYPES: VoxLayoutType[] = DOCUMENTARY_LAYOUT_TYPES;

interface TemplateProps {
  scene: Scene;
  theme?: VideoTheme;
}

export const TEMPLATE_MAP: Record<VoxLayoutType, React.FC<TemplateProps>> = {
  center_hero_cutout: Template1CenterHero,
  split_left_cutout_right_memo: Template2SplitMemo,
  split_left_newspaper_right_cutout: Template3NewspaperCutout,
  revenue_stat_trend: Template4StatTrend,
  punchline_quote_spotlight: Template5QuoteSpotlight,
  infographic_bar_chart: Template6BarChart,
  dual_cutout_versus: Template7DualVersus,
  list_bullets_left_cutout_right: Template8BulletList,
  timeline_milestone_road: Template9TimelineRoad,
  spotlight_magnifier_document: Template10MagnifierDoc,
  circular_orbit_infographic: Template11OrbitInfographic,
  breaking_news_alert_ticker: Template12BreakingTicker,
  handwritten_roadmap_checklist: Template16RoadmapChecklist,
  editorial_strikethrough_swap: Template17EditorialCorrection,
  visual_metaphor_documentary: Template19VisualMetaphors,
  advanced_data_viz_suite: Template20DataVizSuite,
  conspiracy_evidence_board: Template21EvidenceBoard,
  kinetic_typography_marquee: Template22KineticTypography,

  // Isolated SaaS & Tech Showcase templates
  matrix_scramble_hacker: Template13MatrixHacker,
  bento_grid_showcase: Template14BentoShowcase,
  ecosystem_integration_hub: Template15IntegrationConstellation,
  saas_product_hero: Template18SaaSHero,
};

const VISUAL_TYPE_LEGACY_MAP: Record<string, VoxLayoutType> = {
  center_cutout_hero: "center_hero_cutout",
  split_left_right: "split_left_cutout_right_memo",
  split_newspaper: "split_left_newspaper_right_cutout",
  revenue_stat_trend: "revenue_stat_trend",
  punchline_quote_hero: "punchline_quote_spotlight",
  infographic_bar: "infographic_bar_chart",
  roadmap_checklist: "handwritten_roadmap_checklist",
  editorial_correction: "editorial_strikethrough_swap",

  // Visual Metaphor aliases
  visual_metaphor: "visual_metaphor_documentary",
  visual_metaphor_documentary: "visual_metaphor_documentary",
  balance_scale: "visual_metaphor_documentary",
  metaphor_balance_scale: "visual_metaphor_documentary",
  leaking_funnel: "visual_metaphor_documentary",
  metaphor_leaking_funnel: "visual_metaphor_documentary",
  vault_shield: "visual_metaphor_documentary",
  metaphor_vault_shield: "visual_metaphor_documentary",
  speedometer: "visual_metaphor_documentary",
  metaphor_speedometer: "visual_metaphor_documentary",

  // Advanced Data Viz aliases
  advanced_data_viz: "advanced_data_viz_suite",
  advanced_data_viz_suite: "advanced_data_viz_suite",
  spline_area_chart: "advanced_data_viz_suite",
  glowing_area_chart: "advanced_data_viz_suite",
  area_chart: "advanced_data_viz_suite",
  radial_donut_progress: "advanced_data_viz_suite",
  donut_chart: "advanced_data_viz_suite",
  comparison_matrix: "advanced_data_viz_suite",
  feature_matrix: "advanced_data_viz_suite",
  versus_matrix: "advanced_data_viz_suite",

  // Tactile Evidence Board aliases
  conspiracy_evidence_board: "conspiracy_evidence_board",
  conspiracy_board: "conspiracy_evidence_board",
  evidence_board: "conspiracy_evidence_board",
  conspiracy_wall: "conspiracy_evidence_board",
  red_string_board: "conspiracy_evidence_board",
  polaroid_pins: "conspiracy_evidence_board",

  // Kinetic Typography & Marquee aliases
  kinetic_typography_marquee: "kinetic_typography_marquee",
  kinetic_typography: "kinetic_typography_marquee",
  kinetic_marquee: "kinetic_typography_marquee",
  typography_marquee: "kinetic_typography_marquee",
  editorial_marquee: "kinetic_typography_marquee",
  wallpaper_typography: "kinetic_typography_marquee",
  ghosted_counter: "kinetic_typography_marquee",
  act_counter: "kinetic_typography_marquee",

  // SaaS aliases
  matrix_hacker: "matrix_scramble_hacker",
  bento_showcase: "bento_grid_showcase",
  integration_hub: "ecosystem_integration_hub",
  saas_hero: "saas_product_hero",
  saas_product_hero: "saas_product_hero",
};



/**
 * Returns the assigned or deterministically calculated layout template for a given scene.
 */
export function getLayoutTemplate(scene: Scene, sceneIndex: number): React.FC<TemplateProps> {
  const explicitLayout = ((scene as any).layoutType || (scene as any).visualType) as string | undefined;
  
  if (explicitLayout) {
    if (TEMPLATE_MAP[explicitLayout as VoxLayoutType]) {
      return TEMPLATE_MAP[explicitLayout as VoxLayoutType];
    }
    if (VISUAL_TYPE_LEGACY_MAP[explicitLayout]) {
      return TEMPLATE_MAP[VISUAL_TYPE_LEGACY_MAP[explicitLayout]];
    }
  }

  // Deterministic 0-indexed rotation ensuring no consecutive scenes use the same layout
  const normalizedIndex = Math.max(0, sceneIndex - 1);
  const layoutIndex = normalizedIndex % ALL_LAYOUT_TYPES.length;
  const layoutType = ALL_LAYOUT_TYPES[layoutIndex];
  return TEMPLATE_MAP[layoutType] || Template1CenterHero;
}

