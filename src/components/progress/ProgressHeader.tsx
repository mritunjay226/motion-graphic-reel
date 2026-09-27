import React from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ProgressHeaderProps {
  status: string;
  elapsedSeconds: number;
  progressPercent: number;
  dbProgressMessage?: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  status,
  elapsedSeconds,
  progressPercent,
  dbProgressMessage,
}) => {
  return (
    <div>
      {/* Top Status & Elapsed Timer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-black/[0.06] relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${status === "completed" ? "bg-[#34C759]" : status === "failed" ? "bg-red-500" : "bg-[#0071E3]"
              }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === "completed" ? "bg-[#34C759]" : status === "failed" ? "bg-red-500" : "bg-[#0071E3]"
              }`} />
          </span>

          <span className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
            {status === "completed" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Generation complete</span>
              </>
            ) : status === "failed" ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Processing error</span>
              </>
            ) : (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#0071E3] animate-spin" />
                <span>Generating video...</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#86868B] font-medium">
            <span>Elapsed:</span>
            <span className="text-[#1D1D1F] font-mono text-xs">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:{String(elapsedSeconds % 60).padStart(2, "0")}s
            </span>
          </div>
          <div className="text-[#1D1D1F] font-semibold text-lg tracking-tight">
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Current Pipeline Status Sub-bar */}
      {dbProgressMessage && (
        <div className="flex items-center gap-2 mb-2.5 text-xs text-[#86868B] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
          <span>{dbProgressMessage}</span>
        </div>
      )}

      {/* Sleek Progress Bar */}
      <div className="w-full bg-black/[0.04] rounded-full h-1.5 mb-6 overflow-hidden relative z-10">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${status === "failed"
              ? "bg-red-500"
              : status === "completed"
                ? "bg-[#34C759]"
                : "bg-[#0071E3]"
            }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
