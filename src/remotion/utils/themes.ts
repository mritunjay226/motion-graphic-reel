export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  canvasBg: string;
  captionTextColor: string;
  captionStrokeColor: string;
  captionHighlightColor: string;
  captionHighlightBg: string;
  captionShadowColor: string;
  accentBadge: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  orbitRingColor: string;
  previewColors: string[];
}

export interface VisualStyle {
  id: string;
  name: string;
  description: string;
  defaultPaletteId: string;
  fontFamily: string;
  frameStyle: "polaroid_2d" | "cyber_hud" | "cinematic_gold" | "swiss_hairline" | "torn_newsprint" | "terminal_window" | "neon_glow";
  filter: string;
  grainOpacity: number;
  scanlines: boolean;
  scanlineOpacity?: number;
  vignette: number;
  isVoxCutout?: boolean;
  bgStyle: "floating_card" | "full_bleed";
  showOrbitRing?: boolean;
  paperGrid?: boolean;
  paperGridOpacity?: number;
  paperGridSize?: number;
  paperTexture?: boolean;
  paperTextureType?: "studio_paper" | "vintage_fold" | "grunge_canvas" | "halftone_dots" | "paper_grid" | "tactical_topo" | "blueprint";
  paperTextureOpacity?: number;
  textureType?:
    | "clean_studio"
    | "vintage_grid"
    | "paper_fiber"
    | "crumbled_paper"
    | "crumpled_paper"
    | "aged_parchment"
    | "blueprint_grid"
    | "cyanotype_blueprint"
    | "newsprint_crease"
    | "vintage_newsprint"
    | "dark_charcoal"
    | "tactical_topo"
    | "tactical_topo_grid";
  showCreases?: boolean;
  dustAndScratches?: boolean;
  dustOpacity?: number;
  halftoneDots?: boolean;
  halftoneOpacity?: number;
}

export interface VideoTheme extends ColorPalette, Omit<VisualStyle, "id" | "name" | "description"> {
  themeId: string;
  styleId: string;
  paletteId: string;
  name: string;
  description: string;
}

// ─── 1. SEPARATE COLOR PALETTES ───
export const COLOR_PALETTES: Record<string, ColorPalette> = {
  vox_yellow: {
    id: "vox_yellow",
    name: "Vox Studio Yellow",
    description: "Signature Vox bright neutral studio canvas with yellow marker highlights and lime neon accents",
    canvasBg: "radial-gradient(circle at 50% 32%, #FFFFFF 0%, #FAF8F4 50%, #F3EEE4 100%)",
    captionTextColor: "#111111",
    captionStrokeColor: "#FFFFFF",
    captionHighlightColor: "#000000",
    captionHighlightBg: "#FFE600",
    captionShadowColor: "rgba(0,0,0,0.12)",
    accentBadge: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    badgeBg: "#FFE600",
    badgeText: "#111111",
    badgeBorder: "#111111",
    orbitRingColor: "#B5F500",
    previewColors: ["#FAF8F4", "#FFE600", "#B5F500", "#111111"],
  },
  cyber_neon: {
    id: "cyber_neon",
    name: "Cyber Neon Cyan",
    description: "High-voltage electric magenta, cyan neon glow, and dark obsidian studio backdrop",
    canvasBg: "radial-gradient(circle at 50% 38%, #161924 0%, #0B0D12 100%)",
    captionTextColor: "#00FFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#FFFFFF",
    captionHighlightBg: "#FF007F",
    captionShadowColor: "rgba(255,0,127,0.5)",
    accentBadge: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40",
    badgeBg: "#FF007F",
    badgeText: "#FFFFFF",
    badgeBorder: "#00FFFF",
    orbitRingColor: "#00FFFF",
    previewColors: ["#0B0D12", "#FF007F", "#00FFFF", "#8B5CF6"],
  },
  teal_orange: {
    id: "teal_orange",
    name: "Blockbuster Teal & Gold",
    description: "Rich documentary 35mm grade with gold captions and deep teal shadows",
    canvasBg: "radial-gradient(circle at 50% 38%, #1A242B 0%, #0D1317 100%)",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#000000",
    captionHighlightBg: "#F59E0B",
    captionShadowColor: "rgba(0,0,0,0.7)",
    accentBadge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    badgeBg: "#F59E0B",
    badgeText: "#000000",
    badgeBorder: "#06B6D4",
    orbitRingColor: "#06B6D4",
    previewColors: ["#0D1317", "#F59E0B", "#06B6D4", "#F3F4F6"],
  },
  vermillion_red: {
    id: "vermillion_red",
    name: "Swiss Vermillion Red",
    description: "Crisp vintage studio paper with bold charcoal typography and vermillion red accents",
    canvasBg: "radial-gradient(circle at 50% 32%, #FFFFFF 0%, #F8F6F1 50%, #EFEBE2 100%)",
    captionTextColor: "#0F172A",
    captionStrokeColor: "#FFFFFF",
    captionHighlightColor: "#FFFFFF",
    captionHighlightBg: "#DC2626",
    captionShadowColor: "rgba(15,23,42,0.12)",
    accentBadge: "bg-red-500/20 text-red-400 border-red-500/40",
    badgeBg: "#DC2626",
    badgeText: "#FFFFFF",
    badgeBorder: "#0F172A",
    orbitRingColor: "#DC2626",
    previewColors: ["#F8F6F1", "#DC2626", "#0F172A", "#64748B"],
  },
  sepia_gold: {
    id: "sepia_gold",
    name: "Vintage Sepia Gold",
    description: "Warm golden vintage film stock, sepia ambers, and deep coffee brown borders",
    canvasBg: "radial-gradient(circle at 50% 32%, #FFFEFA 0%, #F9F5EA 55%, #F0E9D8 100%)",
    captionTextColor: "#FFFDD0",
    captionStrokeColor: "#3B2219",
    captionHighlightColor: "#000000",
    captionHighlightBg: "#D97706",
    captionShadowColor: "rgba(59,34,25,0.6)",
    accentBadge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    badgeBg: "#D97706",
    badgeText: "#FFFDD0",
    badgeBorder: "#451A03",
    orbitRingColor: "#D97706",
    previewColors: ["#F9F5EA", "#D97706", "#78350F", "#FFFDD0"],
  },
  emerald_matrix: {
    id: "emerald_matrix",
    name: "Matrix Emerald Green",
    description: "Terminal code slate with mint green glow highlights and deep emerald shadows",
    canvasBg: "radial-gradient(circle at 50% 38%, #0D221C 0%, #06130F 100%)",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#003300",
    captionHighlightColor: "#000000",
    captionHighlightBg: "#10B981",
    captionShadowColor: "rgba(0,255,102,0.4)",
    accentBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    badgeBg: "#10B981",
    badgeText: "#022C22",
    badgeBorder: "#064E3B",
    orbitRingColor: "#34D399",
    previewColors: ["#06130F", "#10B981", "#34D399", "#ECFDF5"],
  },
  synthwave_pink: {
    id: "synthwave_pink",
    name: "Outrun Synthwave Pink",
    description: "Deep violet to warm amber sunset gradient with glowing hot pink accents",
    canvasBg: "linear-gradient(180deg, #181538 0%, #3B1670 50%, #681235 100%)",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#312E81",
    captionHighlightColor: "#FFFFFF",
    captionHighlightBg: "#EC4899",
    captionShadowColor: "rgba(236,72,153,0.6)",
    accentBadge: "bg-pink-500/20 text-pink-400 border-pink-500/40",
    badgeBg: "#EC4899",
    badgeText: "#FFFFFF",
    badgeBorder: "#F59E0B",
    orbitRingColor: "#F472B6",
    previewColors: ["#181538", "#EC4899", "#F59E0B", "#FFFFFF"],
  },
  monochrome_noir: {
    id: "monochrome_noir",
    name: "Stark Monochrome Noir",
    description: "Gritty 16mm high-contrast black & white thriller style with stark crimson accents",
    canvasBg: "radial-gradient(circle at 50% 38%, #1A1A1A 0%, #0D0D0D 100%)",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#FFFFFF",
    captionHighlightBg: "#FF3333",
    captionShadowColor: "rgba(255,0,0,0.6)",
    accentBadge: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
    badgeBg: "#FF3333",
    badgeText: "#FFFFFF",
    badgeBorder: "#FFFFFF",
    orbitRingColor: "#FF3333",
    previewColors: ["#0D0D0D", "#FF3333", "#FFFFFF", "#525252"],
  },
};

// ─── 2. SEPARATE VISUAL MOTION GRAPHIC STYLES ───
export const VISUAL_STYLES: Record<string, VisualStyle> = {
  vox_documentary: {
    id: "vox_documentary",
    name: "Vox 2.5D Paper Explainer",
    description: "Signature Vox 2.5D polaroid card cutouts, smooth studio canvas, yellow marker sweeps & node orbit rings",
    defaultPaletteId: "vox_yellow",
    fontFamily: "Bebas Neue",
    frameStyle: "polaroid_2d",
    filter: "contrast(1.04) saturate(1.02) brightness(1.01)",
    grainOpacity: 0.02,
    scanlines: false,
    vignette: 0.05,
    isVoxCutout: true,
    bgStyle: "floating_card",
    showOrbitRing: true,
    paperGrid: false,
    paperGridOpacity: 0,
    paperGridSize: 32,
    paperTexture: true,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0.05,
    textureType: "clean_studio",
    showCreases: false,
    halftoneDots: false,
    halftoneOpacity: 0,
  },
  cyberpunk_hacker: {
    id: "cyberpunk_hacker",
    name: "Cyberpunk Glitch HUD",
    description: "High-tech matrix scanlines, CRT screen flicker, corner bracket HUD frames & electric neon glows",
    defaultPaletteId: "cyber_neon",
    fontFamily: "Bebas Neue",
    frameStyle: "cyber_hud",
    filter: "contrast(1.2) saturate(1.4) brightness(1.02)",
    grainOpacity: 0.08,
    scanlines: false,
    scanlineOpacity: 0,
    vignette: 0.25,
    bgStyle: "full_bleed",
    showOrbitRing: true,
    paperGrid: false,
    paperGridOpacity: 0,
    paperGridSize: 24,
    paperTexture: false,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0,
    textureType: "dark_charcoal",
    showCreases: false,
    halftoneDots: false,
    halftoneOpacity: 0,
  },
  cinematic_35mm: {
    id: "cinematic_35mm",
    name: "MoSidd 35mm Cinema",
    description: "Organic 35mm film ISO noise, jumping dust flecks & film scratches, deep vignette & warm film grade",
    defaultPaletteId: "teal_orange",
    fontFamily: "Bebas Neue",
    frameStyle: "cinematic_gold",
    filter: "contrast(1.08) saturate(1.15) sepia(0.04)",
    grainOpacity: 0.06,
    scanlines: false,
    scanlineOpacity: 0,
    vignette: 0.2,
    bgStyle: "full_bleed",
    dustAndScratches: false,
    dustOpacity: 0,
    paperTexture: true,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0.04,
    textureType: "clean_studio",
    showCreases: false,
  },
  swiss_magazine: {
    id: "swiss_magazine",
    name: "Swiss Editorial Magazine",
    description: "Clean minimalist typography grid, razor-sharp hairline borders, vermillion red highlight blocks & high contrast",
    defaultPaletteId: "vermillion_red",
    fontFamily: "Bebas Neue",
    frameStyle: "swiss_hairline",
    filter: "contrast(1.05) saturate(1.0) brightness(1.0)",
    grainOpacity: 0.02,
    scanlines: false,
    vignette: 0.06,
    bgStyle: "floating_card",
    paperGrid: false,
    paperGridOpacity: 0,
    paperGridSize: 40,
    paperTexture: true,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0.04,
    textureType: "clean_studio",
    showCreases: false,
  },
  vintage_newspaper: {
    id: "vintage_newspaper",
    name: "1970s Crime Archive",
    description: "Weathered archival feel, clean documentary studio tone, typewriter subtext & aged evidence cards",
    defaultPaletteId: "sepia_gold",
    fontFamily: "Bebas Neue",
    frameStyle: "torn_newsprint",
    filter: "contrast(1.05) saturate(1.08) sepia(0.12) brightness(1.01)",
    grainOpacity: 0.05,
    scanlines: false,
    vignette: 0.15,
    bgStyle: "full_bleed",
    paperTexture: true,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0.06,
    textureType: "clean_studio",
    showCreases: false,
    dustAndScratches: false,
    dustOpacity: 0,
  },
  matrix_terminal: {
    id: "matrix_terminal",
    name: "Dark Tech Terminal",
    description: "Hacker code prompt `> _`, emerald green data streams, dark slate terminal windows & monospace brackets",
    defaultPaletteId: "emerald_matrix",
    fontFamily: "Bebas Neue",
    frameStyle: "terminal_window",
    filter: "contrast(1.15) saturate(0.95) brightness(0.95)",
    grainOpacity: 0.06,
    scanlines: false,
    scanlineOpacity: 0,
    vignette: 0.25,
    bgStyle: "full_bleed",
    showOrbitRing: true,
    paperGrid: false,
    paperGridOpacity: 0,
    paperGridSize: 36,
    paperTexture: false,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0,
    textureType: "dark_charcoal",
    showCreases: false,
  },
  synthwave_80s: {
    id: "synthwave_80s",
    name: "80s Sunset Synthwave",
    description: "Outrun sunset horizon grid, glowing neon gradient backdrops, hot pink stickers & futuristic aesthetic",
    defaultPaletteId: "synthwave_pink",
    fontFamily: "Bebas Neue",
    frameStyle: "neon_glow",
    filter: "contrast(1.15) saturate(1.3) brightness(1.02)",
    grainOpacity: 0.06,
    scanlines: false,
    scanlineOpacity: 0,
    vignette: 0.18,
    bgStyle: "full_bleed",
    showOrbitRing: true,
    paperGrid: false,
    paperGridOpacity: 0,
    paperGridSize: 30,
    paperTexture: false,
    paperTextureType: "studio_paper",
    paperTextureOpacity: 0,
    textureType: "dark_charcoal",
    showCreases: false,
  },
};

export const DEFAULT_STYLE_ID = "vox_documentary";
export const DEFAULT_PALETTE_ID = "vox_yellow";

// ─── 3. RESOLVER: COMBINES VISUAL STYLE + COLOR PALETTE ───
export function resolveVideoTheme(styleId?: string, paletteId?: string): VideoTheme {
  const activeStyle = VISUAL_STYLES[styleId || ""] || VISUAL_STYLES[DEFAULT_STYLE_ID];
  const targetPaletteId = paletteId || activeStyle.defaultPaletteId || DEFAULT_PALETTE_ID;
  const activePalette = COLOR_PALETTES[targetPaletteId] || COLOR_PALETTES[DEFAULT_PALETTE_ID];

  return {
    id: `${activeStyle.id}_${activePalette.id}`,
    themeId: `${activeStyle.id}_${activePalette.id}`,
    styleId: activeStyle.id,
    paletteId: activePalette.id,
    defaultPaletteId: activeStyle.defaultPaletteId,
    name: `${activeStyle.name} (${activePalette.name})`,
    description: `${activeStyle.description}. Styled with ${activePalette.name}.`,
    
    // Color Palette Tokens
    canvasBg: activePalette.canvasBg,
    captionTextColor: activePalette.captionTextColor,
    captionStrokeColor: activePalette.captionStrokeColor,
    captionHighlightColor: activePalette.captionHighlightColor,
    captionHighlightBg: activePalette.captionHighlightBg,
    captionShadowColor: activePalette.captionShadowColor,
    accentBadge: activePalette.accentBadge,
    badgeBg: activePalette.badgeBg,
    badgeText: activePalette.badgeText,
    badgeBorder: activePalette.badgeBorder,
    orbitRingColor: activePalette.orbitRingColor,
    previewColors: activePalette.previewColors,

    // Visual Style Tokens
    fontFamily: activeStyle.fontFamily,
    frameStyle: activeStyle.frameStyle,
    filter: activeStyle.filter,
    grainOpacity: activeStyle.grainOpacity,
    scanlines: activeStyle.scanlines,
    scanlineOpacity: activeStyle.scanlineOpacity,
    vignette: activeStyle.vignette,
    isVoxCutout: activeStyle.isVoxCutout,
    bgStyle: activeStyle.bgStyle,
    showOrbitRing: activeStyle.showOrbitRing,
    paperGrid: activeStyle.paperGrid,
    paperGridOpacity: activeStyle.paperGridOpacity,
    paperGridSize: activeStyle.paperGridSize,
    paperTexture: activeStyle.paperTexture,
    paperTextureType: activeStyle.paperTextureType,
    paperTextureOpacity: activeStyle.paperTextureOpacity,
    textureType: activeStyle.textureType,
    showCreases: activeStyle.showCreases,
    dustAndScratches: activeStyle.dustAndScratches,
    dustOpacity: activeStyle.dustOpacity,
    halftoneDots: activeStyle.halftoneDots,
    halftoneOpacity: activeStyle.halftoneOpacity,
  };
}

/**
 * Backward-compatible single theme ID resolver.
 * Parses legacy theme IDs (e.g., "vox_explainer", "cyberpunk_neon") or combined strings ("vox_documentary_vox_yellow").
 */
export function getVideoTheme(themeId?: string): VideoTheme {
  if (!themeId) return resolveVideoTheme(DEFAULT_STYLE_ID, DEFAULT_PALETTE_ID);

  // 1. Legacy Theme ID map
  const legacyMap: Record<string, { styleId: string; paletteId: string }> = {
    vox_explainer: { styleId: "vox_documentary", paletteId: "vox_yellow" },
    cyberpunk_neon: { styleId: "cyberpunk_hacker", paletteId: "cyber_neon" },
    cinematic_teal_orange: { styleId: "cinematic_35mm", paletteId: "teal_orange" },
    minimal_editorial: { styleId: "swiss_magazine", paletteId: "vermillion_red" },
    vintage_70s: { styleId: "vintage_newspaper", paletteId: "sepia_gold" },
    dark_matrix: { styleId: "matrix_terminal", paletteId: "emerald_matrix" },
    sunset_synthwave: { styleId: "synthwave_80s", paletteId: "synthwave_pink" },
  };

  if (legacyMap[themeId]) {
    return resolveVideoTheme(legacyMap[themeId].styleId, legacyMap[themeId].paletteId);
  }

  // 2. Direct Visual Style ID match
  if (VISUAL_STYLES[themeId]) {
    return resolveVideoTheme(themeId);
  }

  // 3. Direct Color Palette ID match
  if (COLOR_PALETTES[themeId]) {
    return resolveVideoTheme(DEFAULT_STYLE_ID, themeId);
  }

  // 4. Combined styleId_paletteId parsing
  for (const styleKey of Object.keys(VISUAL_STYLES)) {
    if (themeId.startsWith(styleKey + "_")) {
      const candidatePaletteId = themeId.slice(styleKey.length + 1);
      if (COLOR_PALETTES[candidatePaletteId]) {
        return resolveVideoTheme(styleKey, candidatePaletteId);
      }
    }
  }

  return resolveVideoTheme(DEFAULT_STYLE_ID, DEFAULT_PALETTE_ID);
}

export const ALL_VIDEO_STYLES = Object.values(VISUAL_STYLES);
export const ALL_COLOR_PALETTES = Object.values(COLOR_PALETTES);

const themes = {
  resolveVideoTheme,
  getVideoTheme,
  COLOR_PALETTES,
  VISUAL_STYLES,
  ALL_VIDEO_STYLES,
  ALL_COLOR_PALETTES,
  DEFAULT_STYLE_ID,
  DEFAULT_PALETTE_ID,
};

export default themes;
