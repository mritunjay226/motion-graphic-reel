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
    <div className="bg-[#FFFDF7] border-3 border-[#111111] rounded-3xl shadow-[6px_6px_0px_#111111] overflow-hidden flex flex-col select-none">
      {/* Studio Inspector Tab Bar */}
      <div className="p-3 sm:p-3.5 border-b-2 border-[#111111] bg-white">
        <div className="flex items-center gap-1.5 bg-[#F4F4F6] p-1.5 rounded-xl border border-[#111111] overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("storyboard")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "storyboard"
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-white"
            }`}
          >
            <Film className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Scenes ({sceneCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "style"
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("canvas")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "canvas"
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "audio"
                ? "bg-[#FFE600] text-[#111111] shadow-[2px_2px_0px_#111111] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-white"
            }`}
          >
            <Music className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Audio & SFX</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "export"
                ? "bg-[#111111] text-[#FFE600] shadow-[2px_2px_0px_#FFE600] border border-[#111111]"
                : "text-[#555555] hover:text-[#111111] hover:bg-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 overflow-y-auto max-h-[640px] custom-scrollbar bg-[#FFFDF7]">
        {children}
      </div>
    </div>
  );
};
