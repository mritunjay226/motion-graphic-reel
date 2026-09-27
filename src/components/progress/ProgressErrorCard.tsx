import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProgressErrorCardProps {
  status: string;
  isRenderFailure: boolean;
  errorMessage: string;
  onRetry?: () => void;
  onRetryRender?: () => void;
}

export const ProgressErrorCard: React.FC<ProgressErrorCardProps> = ({
  status,
  isRenderFailure,
  errorMessage,
  onRetry,
  onRetryRender,
}) => {
  if (status !== "failed") return null;

  return (
    <div className="mt-6 bg-red-50/80 border border-red-200/80 rounded-2xl p-5 relative z-10 text-red-900 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <h3 className="text-xs font-semibold">
          {isRenderFailure ? "Render error" : "Generation pipeline error"}
        </h3>
      </div>
      <p className="text-xs text-red-800/90 bg-white/80 p-3 rounded-xl border border-red-200 mb-3.5 leading-relaxed">
        {errorMessage || "An unexpected error occurred during video processing."}
      </p>
      {isRenderFailure ? (
        <button
          type="button"
          onClick={onRetryRender || onRetry}
          className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry render</span>
        </button>
      ) : onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry generation</span>
        </button>
      ) : null}
    </div>
  );
};
