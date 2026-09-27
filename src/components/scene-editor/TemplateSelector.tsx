import React from "react";
import { Layers } from "lucide-react";
import { TEMPLATE_OPTIONS } from "./constants";

interface TemplateSelectorProps {
  visualType: string;
  setVisualType: (type: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  visualType,
  setVisualType,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#86868B]" />
          <span>Motion Graphic Template</span>
        </label>
        <span className="text-[11px] font-medium text-[#0071E3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          {TEMPLATE_OPTIONS.find((t) => t.id === visualType)?.badge || "Custom"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 border border-black/[0.06] p-2 rounded-2xl bg-neutral-50/70">
        {TEMPLATE_OPTIONS.map((tpl) => {
          const isSelected = visualType === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setVisualType(tpl.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none ${isSelected
                  ? "bg-white text-[#1D1D1F] border-[#0071E3] shadow-xs ring-2 ring-[#0071E3]/20"
                  : "bg-white/80 text-[#1D1D1F] border-black/[0.05] hover:border-black/[0.12]"
                }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold leading-tight truncate">
                  {tpl.name}
                </span>
                <span
                  className={`text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0 ${isSelected
                      ? "bg-[#0071E3] text-white"
                      : "bg-black/[0.05] text-[#86868B]"
                    }`}
                >
                  {tpl.badge}
                </span>
              </div>
              <p className="text-[10px] text-[#86868B] leading-normal line-clamp-2">
                {tpl.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
