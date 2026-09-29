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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b-2 border-[#111111]/15 relative z-10">
        <div className="flex items-center gap-2.5">
          <span
            className={`font-mono text-xs font-black uppercase px-3 py-1 rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 ${
              status === "completed"
                ? "bg-[#B5F500] text-[#111111]"
                : status === "failed"
                  ? "bg-red-500 text-white"
                  : "bg-[#FFE600] text-[#111111]"
            }`}
          >
            {status === "completed" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                <span>DIRECTOR READY</span>
              </>
            ) : status === "failed" ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 stroke-[3]" />
                <span>PROCESSING ERROR</span>
              </>
            ) : (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[3]" />
                <span>GENERATING REEL</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#555555] font-bold uppercase">
            <span>ELAPSED:</span>
            <span className="text-[#111111] font-black bg-white px-2 py-0.5 rounded border border-[#111111]">
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:{String(elapsedSeconds % 60).padStart(2, "0")}s
            </span>
          </div>
          <div className="text-[#111111] font-bebas text-3xl leading-none">
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Current Pipeline Status Sub-bar */}
      {dbProgressMessage && (
        <div className="flex items-center gap-2 mb-2.5 text-xs text-[#333333] font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-[#111111] animate-ping" />
          <span>{dbProgressMessage}</span>
        </div>
      )}

      {/* Vox Brutalist Progress Bar */}
      <div className="w-full bg-white border-2 border-[#111111] rounded-full h-3 mb-5 overflow-hidden relative z-10 shadow-[2px_2px_0px_#111111]">
        <div
          className={`h-full transition-all duration-500 ease-out border-r-2 border-[#111111] ${
            status === "failed"
              ? "bg-red-500"
              : status === "completed"
                ? "bg-[#B5F500]"
                : "bg-[#FFE600]"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

