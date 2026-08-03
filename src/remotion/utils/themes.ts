export interface VideoTheme {
  id: string;
  name: string;
  description: string;
  filter: string;
  fontFamily: string;
  captionTextColor: string;
  captionStrokeColor: string;
  captionHighlightColor: string;
  captionHighlightBg?: string; // Highlighter background color (Vox Style)
  captionShadowColor: string;
  grainOpacity: number;
  scanlines: boolean;
  vignette: number;
  accentBadge: string;
  isVoxCutout?: boolean; // Adds paper-stroke border to subjects
}

export const VIDEO_THEMES: Record<string, VideoTheme> = {
  vox_explainer: {
    id: "vox_explainer",
    name: "Vox Explainer",
    description: "Vox signature yellow marker highlighter & paper collage cutouts",
    filter: "contrast(1.15) saturate(1.2) brightness(1.03)",
    fontFamily: "Bebas Neue",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#000000",
    captionHighlightBg: "#FFE600",
    captionShadowColor: "rgba(0,0,0,0.8)",
    grainOpacity: 0.08,
    scanlines: false,
    vignette: 0.25,
    accentBadge: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    isVoxCutout: true,
  },
  cinematic_teal_orange: {
    id: "cinematic_teal_orange",
    name: "Teal & Orange",
    description: "MoSidd signature blockbuster documentary grade",
    filter: "contrast(1.12) saturate(1.2) sepia(0.08) hue-rotate(-8deg)",
    fontFamily: "Bebas Neue",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#FFD700",
    captionShadowColor: "rgba(0,0,0,0.8)",
    grainOpacity: 0.12,
    scanlines: true,
    vignette: 0.4,
    accentBadge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  cyberpunk_neon: {
    id: "cyberpunk_neon",
    name: "Cyberpunk Neon",
    description: "Electric magenta, cyan and high-tech glow",
    filter: "contrast(1.25) saturate(1.5) hue-rotate(180deg) brightness(1.05)",
    fontFamily: "Bebas Neue",
    captionTextColor: "#00FFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#FF007F",
    captionShadowColor: "rgba(255,0,127,0.6)",
    grainOpacity: 0.15,
    scanlines: true,
    vignette: 0.5,
    accentBadge: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40",
  },
  noir_dramatic: {
    id: "noir_dramatic",
    name: "High Contrast Noir",
    description: "Gritty monochromatic black & white crime thriller style",
    filter: "contrast(1.4) grayscale(1) brightness(0.95)",
    fontFamily: "Bebas Neue",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#000000",
    captionHighlightColor: "#FF3333",
    captionShadowColor: "rgba(255,0,0,0.7)",
    grainOpacity: 0.2,
    scanlines: true,
    vignette: 0.6,
    accentBadge: "bg-neutral-500/20 text-neutral-300 border-neutral-500/40",
  },
  vintage_70s: {
    id: "vintage_70s",
    name: "Vintage 70s Warm",
    description: "Nostalgic golden film stock with warm sepia tones",
    filter: "contrast(1.05) saturate(1.1) sepia(0.35) brightness(1.02)",
    fontFamily: "Bebas Neue",
    captionTextColor: "#FFFDD0",
    captionStrokeColor: "#3B2219",
    captionHighlightColor: "#FFA500",
    captionShadowColor: "rgba(59,34,25,0.7)",
    grainOpacity: 0.18,
    scanlines: false,
    vignette: 0.35,
    accentBadge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  },
  dark_matrix: {
    id: "dark_matrix",
    name: "Dark Matrix Slate",
    description: "Moody emerald dark tones with high shadow depth",
    filter: "contrast(1.2) saturate(0.9) hue-rotate(60deg) brightness(0.9)",
    fontFamily: "Bebas Neue",
    captionTextColor: "#FFFFFF",
    captionStrokeColor: "#003300",
    captionHighlightColor: "#00FF66",
    captionShadowColor: "rgba(0,255,102,0.5)",
    grainOpacity: 0.1,
    scanlines: true,
    vignette: 0.45,
    accentBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
};

export const DEFAULT_THEME_ID = "vox_explainer";
