import React from "react";
import { Check, Sparkles } from "lucide-react";

interface AdvancedImageSettingsProps {
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  model: string;
  setModel: (model: string) => void;
}

const MODELS = [
  { id: "flux", name: "Flux.1 Schnell", desc: "Fastest 12-step documentary cutout engine" },
  { id: "flux-realism", name: "Flux Realism", desc: "Photorealistic archival investigation imagery" },
  { id: "turbo", name: "SDXL Turbo", desc: "Sub-second rapid prototype generation" },
];

export const AdvancedImageSettings: React.FC<AdvancedImageSettingsProps> = ({
  showAdvanced,
  model,
  setModel,
}) => {
  if (!showAdvanced) return null;

  return (
    <div className="bg-[#FFFDF7] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-4 sm:p-5 rounded-2xl flex flex-col gap-3 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#111111]/10">
        <label className="font-mono text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
          <span>Multi-Plane 2.5D Image Engine</span>
        </label>
        <span className="text-[9px] font-mono font-bold text-[#555555] uppercase">
          ImageKit Multi-Cutout Rig
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {MODELS.map((m) => {
          const isSelected = model === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setModel(m.id)}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#FFE600] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] -translate-y-0.5"
                  : "bg-white border-2 border-[#111111]/30 hover:border-[#111111] hover:shadow-[2px_2px_0px_#111111]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-black uppercase text-[#111111] tracking-wide">{m.name}</p>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#111111] stroke-[3]" />}
              </div>
              <p className="text-[11px] text-[#444444] font-medium leading-tight">{m.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

