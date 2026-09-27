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
    const assignedPaletteId = style.defaultPaletteId || DEFAULT_PALETTE_ID;
    setSelectedPaletteId(assignedPaletteId);
    persistThemeSelection(style.id, assignedPaletteId);
  };

  const handleSelectPalette = (palette: ColorPalette) => {
    setSelectedPaletteId(palette.id);
    persistThemeSelection(selectedStyleId, palette.id);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-5 shadow-xs font-sans text-[#1D1D1F]">
      {/* ── 1. HEADER & TAB NAVIGATION ── */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center text-[#1D1D1F]">
            <Sparkles className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-2">
              <span>Visual Style & Theme</span>
              {isUpdating && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-ping" />
              )}
            </h3>
            <p className="text-[11px] text-[#86868B]">
              Art direction and color palette
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-black/[0.04] p-1 rounded-full text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "style"
                ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F] font-medium"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Style</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("palette")}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "palette"
                ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F] font-medium"
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>Palette</span>
          </button>
        </div>
      </div>

      {/* ── 2. VISUAL STYLES TAB ── */}
      {activeTab === "style" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {ALL_VIDEO_STYLES.map((style) => {
              const isSelected = selectedStyleId === style.id;
              const assignedPalette = ALL_COLOR_PALETTES.find((p) => p.id === style.defaultPaletteId);

              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectStyle(style)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#0071E3] shadow-sm ring-2 ring-[#0071E3]/20"
                      : "bg-neutral-50/70 border-black/[0.04] hover:border-black/[0.1] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium capitalize px-2 py-0.5 rounded-full bg-black/[0.05] text-[#86868B]">
                      {style.frameStyle.replace("_", " ")}
                    </span>

                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-tight mb-0.5">
                      {style.name}
                    </h4>
                    <p className="text-[10px] text-[#86868B] line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-black/[0.04] flex items-center justify-between text-[10px]">
                    <span className="text-[#86868B]">Default palette:</span>
                    <div className="flex items-center gap-1 text-[#1D1D1F] font-medium">
                      <span>{assignedPalette?.name.split(" ")[0]}</span>
                      <div className="flex items-center -space-x-1">
                        {assignedPalette?.previewColors.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full border border-white"
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

      {/* ── 3. COLOR PALETTES TAB ── */}
      {activeTab === "palette" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {ALL_COLOR_PALETTES.map((palette) => {
              const isSelected = selectedPaletteId === palette.id;

              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => handleSelectPalette(palette)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#0071E3] shadow-sm ring-2 ring-[#0071E3]/20"
                      : "bg-neutral-50/70 border-black/[0.04] hover:border-black/[0.1] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center -space-x-1">
                      {palette.previewColors.map((color, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">
                      {palette.name}
                    </h4>
                    <p className="text-[10px] text-[#86868B] line-clamp-2 leading-relaxed mt-0.5">
                      {palette.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-black/[0.04] flex items-center justify-between text-[10px]">
                    <span className="text-[#86868B]">Highlight:</span>
                    <span
                      className="px-2 py-0.2 rounded-full text-black font-semibold text-[9px]"
                      style={{ backgroundColor: palette.captionHighlightBg }}
                    >
                      Text
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Summary */}
      <div className="mt-3.5 pt-3 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-[#86868B]">
        <span>Active theme:</span>
        <span className="text-[#1D1D1F] font-medium">
          {activeResolvedTheme.name}
        </span>
      </div>
    </div>
  );
};
