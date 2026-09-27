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
            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${isCurrent
                ? "bg-white border-[#0071E3] shadow-xs ring-2 ring-[#0071E3]/20"
                : isCompleted
                  ? "bg-neutral-50/70 border-black/[0.04]"
                  : "bg-neutral-50/30 border-black/[0.03] opacity-60"
              }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${isCompleted
                  ? "bg-[#34C759] text-white"
                  : isCurrent
                    ? "bg-[#0071E3] text-white"
                    : "bg-black/[0.05] text-[#86868B]"
                }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <StageIcon className="w-3.5 h-3.5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#1D1D1F] truncate">
                  {st.title}
                </h4>
                {isCurrent && (
                  <span className="text-[9px] font-semibold text-[#0071E3] bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-100">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#86868B] truncate">
                {st.engine}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
