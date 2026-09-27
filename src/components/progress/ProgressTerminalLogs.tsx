import React, { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LogEntry } from "./constants";

interface ProgressTerminalLogsProps {
  logs: LogEntry[];
}

export const ProgressTerminalLogs: React.FC<ProgressTerminalLogsProps> = ({ logs }) => {
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="mt-6 pt-5 border-t border-black/[0.06] relative z-10">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className="text-xs font-semibold text-[#1D1D1F] ml-1">
            Console
          </span>
        </div>
        <span className="text-[11px] text-[#86868B] font-medium">
          Live generation stream
        </span>
      </div>

      <div className="bg-[#18181A] rounded-2xl p-4 font-mono text-xs text-neutral-300 h-36 overflow-y-auto flex flex-col gap-2 shadow-inner">
        {logs.length === 0 ? (
          <div className="text-neutral-500 flex items-center gap-2 text-xs">
            <Loader2 className="w-3 h-3 animate-spin text-neutral-400" />
            <span>Initializing pipeline...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed text-[11px]">
              <span className="text-neutral-500 shrink-0 text-[10px]">{log.timestamp}</span>
              <span
                className={`px-1.5 py-0.2 text-[8px] rounded font-semibold shrink-0 uppercase ${log.type === "ai"
                    ? "bg-purple-900/60 text-purple-300 border border-purple-700/40"
                    : log.type === "media"
                      ? "bg-amber-900/60 text-amber-300 border border-amber-700/40"
                      : log.type === "success"
                        ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/40"
                        : "bg-blue-900/60 text-blue-300 border border-blue-700/40"
                  }`}
              >
                {log.tag}
              </span>
              <span className="text-neutral-200">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
