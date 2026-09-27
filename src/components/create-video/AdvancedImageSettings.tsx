import React from "react";
import { Check } from "lucide-react";

interface AdvancedImageSettingsProps {
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  model: string;
  setModel: (model: string) => void;
}

const MODELS = [
  { id: "flux", name: "Flux.1 Schnell", desc: "Fastest 12-step documentary generator" },
  { id: "flux-realism", name: "Flux Realism", desc: "Photorealistic archival documentary" },
  { id: "turbo", name: "SDXL Turbo", desc: "Ultra fast preview generator" },
];

export const AdvancedImageSettings: React.FC<AdvancedImageSettingsProps> = ({
  showAdvanced,
  model,
  setModel,
}) => {
  if (!showAdvanced) return null;

  return (
    <div className="bg-black/[0.02] border border-black/[0.05] p-4 rounded-2xl flex flex-col gap-2.5 animate-in fade-in duration-150">
      <label className="text-xs font-semibold text-[#86868B]">
        AI Cutout Visual Engine
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {MODELS.map((m) => {
          const isSelected = model === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setModel(m.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                  ? "bg-white border-[#0071E3] ring-1 ring-[#0071E3] shadow-xs"
                  : "bg-white border-black/[0.06] hover:border-black/[0.12]"
                }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs font-semibold text-[#1D1D1F]">{m.name}</p>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0071E3]" />}
              </div>
              <p className="text-[11px] text-[#86868B]">{m.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
