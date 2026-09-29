import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player, PlayerRef } from "@remotion/player";
import { BlockbusterNetflixReel } from "@/remotion/BlockbusterNetflixReel";
import { Eye, X, Share2, Check, Download, Layers, Volume2, Sparkles } from "lucide-react";

interface ReelPreviewModalProps {
  previewReel: any | null;
  previewInputProps: any;
  onClose: () => void;
  onNavigateToStudio: (reelId: string) => void;
}

export const ReelPreviewModal: React.FC<ReelPreviewModalProps> = ({
  previewReel,
  previewInputProps,
  onClose,
  onNavigateToStudio,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const scenes = previewReel?.storyboard || [];

  const handleSeekToScene = (index: number) => {
    setActiveSceneIndex(index);
    if (!playerRef.current || !scenes.length) return;
    const startFrame = scenes
      .slice(0, index)
      .reduce((acc: number, s: any) => acc + (s.durationFrames || 150), 0);
    playerRef.current.seekTo(startFrame);
  };

  const handleCopyLink = () => {
    if (!previewReel) return;
    const url = `${window.location.origin}/reel/${previewReel._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  return (
    <AnimatePresence>
      {previewReel && previewInputProps && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF7] border-3 border-[#111111] rounded-3xl p-5 sm:p-6 shadow-[12px_12px_0px_#111111] max-w-md w-full flex flex-col gap-4 relative my-auto max-h-[95vh] overflow-y-auto"
          >
            {/* 1. Modal Header Bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[#111111]/15">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#111111] bg-[#B5F500] px-2 py-0.2 rounded border border-[#111111]">
                    BROADCAST MONITOR
                  </span>
                  <span className="text-[9px] font-mono font-black text-[#555555]">
                    1080×1920 9:16
                  </span>
                </div>
                <h3 className="font-bebas text-2xl text-[#111111] truncate leading-tight uppercase">
                  {previewReel.topic || previewReel.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#FFE600] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 shrink-0"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* 2. Remotion Video Player Frame */}
            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden border-3 border-[#111111] bg-black relative shadow-[4px_4px_0px_#111111] max-h-[460px] mx-auto">
              <Player
                ref={playerRef}
                component={BlockbusterNetflixReel}
                inputProps={previewInputProps}
                durationInFrames={previewInputProps.plan?.projectMeta?.totalDurationFrames || 900}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                style={{ width: "100%", height: "100%" }}
                controls
                autoPlay
                loop
              />
            </div>

            {/* 3. Interactive Scene Jump Navigation */}
            {scenes.length > 0 && (
              <div className="w-full bg-white border-2 border-[#111111] rounded-2xl p-2.5 shadow-[2px_2px_0px_#111111] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase text-[#555555]">
                  <span className="flex items-center gap-1 text-[#111111]">
                    <Layers className="w-3.5 h-3.5" />
                    JUMP TO SCENE:
                  </span>
                  <span>
                    SCENE {activeSceneIndex + 1} OF {scenes.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {scenes.map((sc: any, idx: number) => {
                    const isCurrent = activeSceneIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSeekToScene(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase transition-all cursor-pointer border shrink-0 ${
                          isCurrent
                            ? "bg-[#FFE600] text-[#111111] border-[#111111] shadow-[2px_2px_0px_#111111]"
                            : "bg-[#F4F4F6] text-[#555555] border-neutral-300 hover:border-[#111111] hover:text-[#111111]"
                        }`}
                      >
                        0{idx + 1}
                      </button>
                    );
                  })}
                </div>

                {activeScene && (
                  <div className="text-[11px] font-mono font-bold text-[#111111] bg-[#F4F4F6] p-2 rounded-xl border border-neutral-200 truncate">
                    <span className="text-[#888888] font-black mr-1">
                      [0{activeSceneIndex + 1}]
                    </span>
                    {activeScene.headline || "Scene Headline"}
                  </div>
                )}
              </div>
            )}

            {/* 4. Audio Telemetry Strip */}
            <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase text-[#555555] px-1">
              <span className="flex items-center gap-1 text-[#111111]">
                <Volume2 className="w-3 h-3 text-[#B5F500] fill-current" />
                39-Sound Foley Suite
              </span>
              <span>● 30 FPS Spring Physics</span>
              <span>● ImageKit 2.5D Rig</span>
            </div>

            {/* 5. Director Action Footer */}
            <div className="w-full flex items-center gap-2 pt-1 border-t-2 border-[#111111]/10">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToStudio(previewReel._id);
                }}
                className="flex-1 py-3 rounded-xl bg-[#FFE600] hover:bg-[#ffd900] text-[#111111] text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Eye className="w-4 h-4 stroke-[2.5]" />
                <span>Open in Studio</span>
              </button>

              <button
                onClick={handleCopyLink}
                title={copied ? "Link Copied!" : "Copy Share Link"}
                className={`p-3 rounded-xl transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5 ${
                  copied
                    ? "bg-[#B5F500] text-[#111111]"
                    : "bg-white hover:bg-[#FFE600] text-[#111111]"
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 stroke-[3] text-[#111111]" />
                ) : (
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>

              {previewReel.videoUrl && (
                <a
                  href={previewReel.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`${previewReel.topic || "reel"}.mp4`}
                  title="Download MP4 Video"
                  className="p-3 rounded-xl bg-white hover:bg-[#B5F500] text-[#111111] transition-all cursor-pointer border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
