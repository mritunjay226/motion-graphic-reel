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
  | "editorial_strikethrough_swap";

export const ALL_LAYOUT_TYPES: VoxLayoutType[] = [
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
];

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

  // Remocn presets
  matrix_scramble_hacker: Template13MatrixHacker,
  bento_grid_showcase: Template14BentoShowcase,
  ecosystem_integration_hub: Template15IntegrationConstellation,
  handwritten_roadmap_checklist: Template16RoadmapChecklist,
  editorial_strikethrough_swap: Template17EditorialCorrection,
};

const VISUAL_TYPE_LEGACY_MAP: Record<string, VoxLayoutType> = {
  center_cutout_hero: "center_hero_cutout",
  split_left_right: "split_left_cutout_right_memo",
  split_newspaper: "split_left_newspaper_right_cutout",
  revenue_stat_trend: "revenue_stat_trend",
  punchline_quote_hero: "punchline_quote_spotlight",
  infographic_bar: "infographic_bar_chart",
  matrix_hacker: "matrix_scramble_hacker",
  bento_showcase: "bento_grid_showcase",
  integration_hub: "ecosystem_integration_hub",
  roadmap_checklist: "handwritten_roadmap_checklist",
  editorial_correction: "editorial_strikethrough_swap",
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
