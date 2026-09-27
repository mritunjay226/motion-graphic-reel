import React from "react";
import { Film, Palette, Layers, Music, Zap } from "lucide-react";

export type InspectorTab = "storyboard" | "style" | "canvas" | "audio" | "export";

interface StudioInspectorProps {
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;
  sceneCount?: number;
  children: React.ReactNode;
}

export const StudioInspector: React.FC<StudioInspectorProps> = ({
  activeTab,
  setActiveTab,
  sceneCount = 6,
  children,
}) => {
  return (
    <div className="apple-card rounded-3xl overflow-hidden flex flex-col">
      {/* Studio Inspector Tab Bar (Apple Segmented Style) */}
      <div className="p-3 border-b border-black/[0.06] bg-[#FBFBFD]">
        <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-2xl overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("storyboard")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeTab === "storyboard"
                ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Scenes ({sceneCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeTab === "style"
                ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("canvas")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeTab === "canvas"
                ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeTab === "audio"
                ? "bg-white text-[#1D1D1F] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio & SFX</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${activeTab === "export"
                ? "bg-white text-[#0071E3] font-semibold shadow-xs"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 overflow-y-auto max-h-[640px] custom-scrollbar bg-white">
        {children}
      </div>
    </div>
  );
};
