import React from "react";
import { Check } from "lucide-react";
import { PIPELINE_STAGES } from "./constants";

interface ProgressStageStepperProps {
  currentStep: number;
  status: string;
}

export const ProgressStageStepper: React.FC<ProgressStageStepperProps> = ({
  currentStep,
  status,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 relative z-10 my-3">
      {PIPELINE_STAGES.map((st) => {
        const isCompleted = currentStep > st.step || status === "completed";
        const isCurrent = currentStep === st.step && status !== "completed";
        const StageIcon = st.icon;

        return (
          <div
            key={st.step}
            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
              isCurrent
                ? "bg-[#FFFDF7] border-[#111111] shadow-[3px_3px_0px_#FFE600] -translate-y-0.5"
                : isCompleted
                  ? "bg-white border-[#111111] shadow-[2px_2px_0px_#B5F500]"
                  : "bg-white/60 border-neutral-300 opacity-60"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg border-2 border-[#111111] flex items-center justify-center text-xs shrink-0 transition-colors shadow-xs ${
                isCompleted
                  ? "bg-[#B5F500] text-[#111111]"
                  : isCurrent
                    ? "bg-[#FFE600] text-[#111111] animate-pulse"
                    : "bg-neutral-100 text-[#777777]"
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <StageIcon className="w-4 h-4 stroke-[2.5]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-black uppercase text-[#111111] truncate">
                  {st.title}
                </h4>
                {isCurrent && (
                  <span className="text-[9px] font-mono font-black uppercase text-[#111111] bg-[#FFE600] px-1.5 py-0.2 rounded border border-[#111111]">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono font-semibold text-[#555555] truncate">
                {st.engine}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
