"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import themes, {
  ALL_VIDEO_STYLES,
  ALL_COLOR_PALETTES,
  DEFAULT_STYLE_ID,
  DEFAULT_PALETTE_ID,
  getVideoTheme,
  resolveVideoTheme,
  type VisualStyle,
  type ColorPalette,
} from "@/remotion/utils/themes";

const resolveTheme = resolveVideoTheme || themes?.resolveVideoTheme || getVideoTheme;
const fetchTheme = getVideoTheme || themes?.getVideoTheme;

import { Sparkles, Palette, Check } from "lucide-react";

interface ThemeSelectorProps {
  reelId?: Id<"reels">;
  currentThemeId?: string;
  onThemeChange?: (styleId: string, paletteId: string, fullThemeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  reelId,
  currentThemeId,
  onThemeChange,
}) => {
  const updateReelThemeMutation = useMutation(api.reels.updateReelTheme);
  const updateReelStatusMutation = useMutation(api.reels.updateReelStatus);

  // Initialize initial theme object from string or defaults
  const initialTheme = fetchTheme(currentThemeId);

  const [selectedStyleId, setSelectedStyleId] = useState<string>(initialTheme.styleId || DEFAULT_STYLE_ID);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(initialTheme.paletteId || DEFAULT_PALETTE_ID);
  const [activeTab, setActiveTab] = useState<"style" | "palette">("style");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Resolved active runtime theme object
  const activeResolvedTheme = resolveTheme(selectedStyleId, selectedPaletteId);

  const persistThemeSelection = async (styleId: string, paletteId: string) => {
    const combinedThemeId = `${styleId}_${paletteId}`;
    if (onThemeChange) {
      onThemeChange(styleId, paletteId, combinedThemeId);
    }

    if (!reelId) return;

    try {
      setIsUpdating(true);
      await updateReelThemeMutation({
        reelId,
        themeId: combinedThemeId,
      });
    } catch (err) {
      console.warn("Falling back to updateReelStatus for theme sync:", err);
      try {
        await updateReelStatusMutation({
          reelId,
          status: "completed",
          themeId: combinedThemeId,
        });
      } catch (fallbackErr) {
        console.error("Failed to persist theme selection in Convex:", fallbackErr);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectStyle = (style: VisualStyle) => {
    setSelectedStyleId(style.id);
    // Assign style's assigned default color palette when switching styles
    const assignedPaletteId = style.defaultPaletteId || DEFAULT_PALETTE_ID;
    setSelectedPaletteId(assignedPaletteId);

    persistThemeSelection(style.id, assignedPaletteId);
  };

  const handleSelectPalette = (palette: ColorPalette) => {
    setSelectedPaletteId(palette.id);
    persistThemeSelection(selectedStyleId, palette.id);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl font-sans">
      {/* ── 1. HEADER & TAB NAVIGATION ── */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <span>VISUAL STYLE & COLOR THEME</span>
              {isUpdating && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </h3>
            <p className="text-[11px] text-neutral-400 font-mono">
              Independent Art Direction & Palette System
            </p>
          </div>
        </div>

        {/* Tab Selector: Visual Styles vs Color Themes */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "style"
                ? "bg-amber-400 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Styles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("palette")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "palette"
                ? "bg-amber-400 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Palettes</span>
          </button>
        </div>
      </div>

      {/* ── 2. VISUAL STYLES TAB (7 Distinct Graphic Aesthetics) ── */}
      {activeTab === "style" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {ALL_VIDEO_STYLES.map((style) => {
              const isSelected = selectedStyleId === style.id;
              const assignedPalette = ALL_COLOR_PALETTES.find((p) => p.id === style.defaultPaletteId);

              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectStyle(style)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? "bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                      : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/40"
                  }`}
                >
                  {/* Top Badge & Check */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase bg-neutral-900 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded">
                      {style.frameStyle.replace("_", " ")}
                    </span>

                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        SELECT
                      </span>
                    )}
                  </div>

                  {/* Style Info */}
                  <div>
                    <h4 className="text-xs font-black text-white tracking-wide mb-0.5">
                      {style.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Default Palette Swatch Tag */}
                  <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[9px] font-mono">
                    <span className="text-neutral-400">Default Palette:</span>
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <span>{assignedPalette?.name.split(" ")[0]}</span>
                      <div className="flex items-center -space-x-1">
                        {assignedPalette?.previewColors.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-black"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. COLOR PALETTES TAB (8 Independent Color Themes) ── */}
      {activeTab === "palette" && (
        <div className="space-y-3">
          <p className="text-[11px] text-neutral-400 mb-2 font-mono">
            Override Color Theme for active style ({activeResolvedTheme.name}):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {ALL_COLOR_PALETTES.map((palette) => {
              const isSelected = selectedPaletteId === palette.id;

              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => handleSelectPalette(palette)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? "bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                      : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/40"
                  }`}
                >
                  {/* Swatches & Active Check */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center -space-x-1.5">
                      {palette.previewColors.map((color, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-neutral-900 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        APPLY
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-white tracking-wide">
                      {palette.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed mt-0.5">
                      {palette.description}
                    </p>
                  </div>

                  {/* Marker Sweep Swatch */}
                  <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[9px] font-mono">
                    <span className="text-neutral-400">Marker Highlight:</span>
                    <span
                      className="px-2 py-0.5 rounded text-black font-extrabold border border-black"
                      style={{ backgroundColor: palette.captionHighlightBg }}
                    >
                      TEXT
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Active Combination Summary */}
      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <span>Active Combo:</span>
        <span className="text-amber-400 font-bold">
          {activeResolvedTheme.name}
        </span>
      </div>
    </div>
  );
};
