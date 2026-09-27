import React from "react";
import {
  RotateCcw,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";

interface TransportControlsProps {
  currentFrame: number;
  totalFrames: number;
  currentTimeSeconds: number;
  totalTimeSeconds: number;
  activeSceneIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  preloadStatus: {
    progressPercent: number;
  };
  onSeekFrame: (targetFrame: number) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSkipSeconds: (seconds: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  currentFrame,
  totalFrames,
  currentTimeSeconds,
  totalTimeSeconds,
  activeSceneIndex,
  isPlaying,
  isMuted,
  preloadStatus,
  onSeekFrame,
  onTogglePlay,
  onRestart,
  onSkipSeconds,
  onToggleMute,
  onToggleFullscreen,
}) => {
  return (
    <div className="mt-3.5 w-full bg-white/90 border border-black/[0.06] p-3 rounded-2xl flex flex-col gap-2.5 shadow-xs">
      {/* Timecode & Scene Index */}
      <div className="flex items-center justify-between text-xs font-mono text-[#86868B]">
        <span>
          {String(Math.floor(currentTimeSeconds / 60)).padStart(2, "0")}:{String(currentTimeSeconds % 60).padStart(2, "0")} / {String(Math.floor(totalTimeSeconds / 60)).padStart(2, "0")}:{String(totalTimeSeconds % 60).padStart(2, "0")}
        </span>
        <span className="font-sans text-[11px] font-medium text-[#1D1D1F]">
          Scene {activeSceneIndex + 1}
        </span>
      </div>

      {/* Scrubber Bar */}
      <div className="relative w-full h-3 flex items-center group/scrubber">
        <div className="absolute inset-x-0 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
          {/* Buffer Bar */}
          <div
            className="h-full bg-black/[0.12] transition-all duration-150"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  preloadStatus.progressPercent,
                  Math.round(((currentFrame + 45) / totalFrames) * 100)
                )
              )}%`,
            }}
          />
          {/* Active Progress */}
          <div
            className="absolute inset-y-0 left-0 bg-[#0071E3] transition-all duration-75"
            style={{
              width: `${Math.min(100, Math.round((currentFrame / totalFrames) * 100))}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => onSeekFrame(Number(e.target.value))}
          className="relative z-10 w-full h-3 opacity-0 cursor-pointer"
        />

        <div
          className="absolute w-3 h-3 bg-white border border-black/20 rounded-full pointer-events-none transform -translate-x-1/2 shadow-sm"
          style={{
            left: `${Math.min(100, Math.max(0, (currentFrame / totalFrames) * 100))}%`,
          }}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRestart}
            title="Restart"
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#1D1D1F] transition-colors cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSkipSeconds(-1)}
            title="-1s"
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#1D1D1F] transition-colors cursor-pointer active:scale-95"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Play / Pause Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-9 h-9 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSkipSeconds(1)}
            title="+1s"
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#1D1D1F] transition-colors cursor-pointer active:scale-95"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#1D1D1F] transition-colors cursor-pointer active:scale-95"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onToggleFullscreen}
            title="Fullscreen"
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#1D1D1F] transition-colors cursor-pointer active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
