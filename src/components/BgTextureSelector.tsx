"use client";

import React, { useState } from "react";
import { Layers, Sliders, Check, Sparkles } from "lucide-react";
import Image from "next/image";

export interface BgTextureOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  imageSrc?: string;
  defaultOpacity: number;
}

export const PRESET_TEXTURES: BgTextureOption[] = [
  {
    id: "paper_fiber",
    name: "Studio Paper",
    description: "Subtle organic paper grain with fine micro-tooth",
    badge: "Default",
    imageSrc: "/textures/paper_fiber.jpg",
    defaultOpacity: 0.18,
  },
  {
    id: "vintage_newsprint",
    name: "Vintage Newsprint",
    description: "Archival newspaper print with tactile fiber specks",
    badge: "Archival",
    imageSrc: "/textures/vintage_newsprint.jpg",
    defaultOpacity: 0.22,
  },
  {
    id: "tactical_topo_grid",
    name: "Topo Grid",
    description: "Elevation contour lines with technical grid",
    badge: "Technical",
    imageSrc: "/textures/tactical_topo_grid.jpg",
    defaultOpacity: 0.25,
  },
  {
    id: "cyanotype_blueprint",
    name: "Blueprint",
    description: "Architectural blueprint weave and drafting texture",
    badge: "Draft",
    imageSrc: "/textures/cyanotype_blueprint.jpg",
    defaultOpacity: 0.25,
  },
  {
    id: "crumpled_paper",
    name: "Crumpled Paper",
    description: "Textured paper creases and folded wrinkles",
    badge: "Dossier",
    imageSrc: "/textures/crumpled_paper.jpg",
    defaultOpacity: 0.20,
  },
  {
    id: "clean_studio",
    name: "Clean Gradient",
    description: "Smooth radial lighting gradient with zero grain",
    badge: "Minimal",
    defaultOpacity: 0.0,
  },
];

interface BgTextureSelectorProps {
  currentTextureId?: string;
  currentOpacity?: number;
  onTextureChange?: (textureId: string, opacity: number) => void;
}

export const BgTextureSelector: React.FC<BgTextureSelectorProps> = ({
  currentTextureId = "paper_fiber",
  currentOpacity = 0.18,
  onTextureChange,
}) => {
  const [selectedTextureId, setSelectedTextureId] = useState<string>(currentTextureId);
  const [opacity, setOpacity] = useState<number>(currentOpacity);

  const handleSelectTexture = (tex: BgTextureOption) => {
    setSelectedTextureId(tex.id);
    const newOpacity = tex.id === "clean_studio" ? 0 : (opacity === 0 ? tex.defaultOpacity : opacity);
    setOpacity(newOpacity);
    onTextureChange?.(tex.id, newOpacity);
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    onTextureChange?.(selectedTextureId, newOpacity);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-5 shadow-xs font-sans text-[#1D1D1F]">
      {/* ── 1. HEADER ── */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center text-[#1D1D1F]">
            <Layers className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">
              Background Canvas
            </h3>
            <p className="text-[11px] text-[#86868B]">
              Tactile texture and tooth intensity
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-[#1D1D1F] bg-black/[0.04] px-2.5 py-0.5 rounded-full">
          {selectedTextureId === "clean_studio" ? "Clean" : `${Math.round(opacity * 100)}%`}
        </span>
      </div>

      {/* ── 2. TEXTURE GRID SELECTOR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {PRESET_TEXTURES.map((tex) => {
          const isSelected = selectedTextureId === tex.id;

          return (
            <button
              key={tex.id}
              type="button"
              onClick={() => handleSelectTexture(tex)}
              className={`group relative flex flex-col text-left rounded-xl border transition-all p-2.5 cursor-pointer overflow-hidden ${
                isSelected
                  ? "bg-white border-[#0071E3] shadow-sm ring-2 ring-[#0071E3]/20"
                  : "bg-neutral-50/70 border-black/[0.04] hover:border-black/[0.1] hover:bg-white"
              }`}
            >
              {/* Texture Thumbnail Preview */}
              <div className="relative w-full h-18 rounded-lg overflow-hidden mb-2 border border-black/[0.06] bg-neutral-100 flex items-center justify-center">
                {tex.imageSrc ? (
                  <Image
                    src={tex.imageSrc}
                    alt={tex.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white via-neutral-100 to-neutral-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-neutral-400" />
                  </div>
                )}

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0071E3] flex items-center justify-center text-white shadow-xs z-10">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Category Pill */}
                {tex.badge && (
                  <span className="absolute bottom-1 left-1 text-[8px] font-medium px-1.5 py-0.2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    {tex.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h4 className="text-xs font-semibold text-[#1D1D1F] leading-tight mb-0.5">
                {tex.name}
              </h4>
              <p className="text-[10px] text-[#86868B] font-normal line-clamp-2 leading-tight">
                {tex.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── 3. OPACITY FINE-TUNING SLIDER ── */}
      {selectedTextureId !== "clean_studio" && (
        <div className="pt-3 border-t border-black/[0.05] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#86868B]">
            <span className="flex items-center gap-1.5 text-[#1D1D1F]">
              <Sliders className="w-3 h-3 text-[#86868B]" />
              <span>Intensity</span>
            </span>
            <span className="text-[#1D1D1F] font-mono">
              {Math.round(opacity * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#86868B]">Subtle</span>
            <input
              type="range"
              min={0.02}
              max={0.60}
              step={0.02}
              value={opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-[#0071E3]"
            />
            <span className="text-[10px] text-[#86868B]">Heavy</span>
          </div>
        </div>
      )}
    </div>
  );
};
