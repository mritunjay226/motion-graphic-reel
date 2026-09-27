"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  X,
  CheckCircle2,
  FileText,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { StockVideoPickerModal } from "./StockVideoPickerModal";
import { TemplateSelector } from "./scene-editor/TemplateSelector";
import { SceneMediaInputs } from "./scene-editor/SceneMediaInputs";
import { TEMPLATE_OPTIONS, TemplateOption } from "./scene-editor/constants";

export type { TemplateOption };
export { TEMPLATE_OPTIONS };

export interface SceneEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  sceneIndex: number;
  scene: any;
  onSceneUpdated?: (updatedScene: any) => void;
}

export const SceneEditorModal: React.FC<SceneEditorModalProps> = ({
  isOpen,
  onClose,
  reelId,
  sceneIndex,
  scene,
  onSceneUpdated,
}) => {
  const updateSceneMutation = useMutation(api.reels.updateScene);

  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [narration, setNarration] = useState("");
  const [visualType, setVisualType] = useState("center_hero_cutout");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [resyncAudio, setResyncAudio] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStockPickerOpen, setIsStockPickerOpen] = useState(false);

  const hasNarrationChanged = Boolean(
    scene && narration.trim() !== (scene.narration || "").trim()
  );

  useEffect(() => {
    if (scene) {
      setHeadline(scene.headline || "");
      setSubtitle(scene.subtitle || "");
      setNarration(scene.narration || "");
      setVisualType(scene.visualType || scene.layoutType || "center_hero_cutout");
      setImageUrl(scene.imageUrl || scene.imageKitUrls?.foreground || "");
      setVideoUrl(scene.videoUrl || scene.bRollUrl || "");
      setSaveSuccess(false);
      setErrorMessage(null);
      setResyncAudio(true);
    }
  }, [scene, sceneIndex]);

  if (!isOpen || !scene) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const updated = await updateSceneMutation({
        reelId: reelId as Id<"reels">,
        sceneIndex,
        headline: headline.trim(),
        subtitle: subtitle.trim(),
        narration: narration.trim(),
        visualType,
        imageUrl: imageUrl.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
      });

      if (hasNarrationChanged && resyncAudio) {
        setIsResyncing(true);
        const res = await fetch("/api/reel/resync-scene", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reelId,
            sceneIndex,
            narration: narration.trim(),
            language: scene.language || "en",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to resync voiceover and captions");
        }
      }

      setSaveSuccess(true);
      if (onSceneUpdated) {
        onSceneUpdated(updated);
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Save scene error:", err);
      setErrorMessage(err.message || "Failed to save scene modifications.");
    } finally {
      setIsSaving(false);
      setIsResyncing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-[28px] sm:rounded-[32px] max-w-2xl w-full p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.2)] relative animate-in fade-in zoom-in-95 duration-200 my-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/[0.06] text-[#1D1D1F]">
                Scene {sceneIndex + 1}
              </span>
              <span className="text-sm font-semibold text-[#1D1D1F]">
                Edit Scene
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center text-[#1D1D1F] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            {/* 1. Template Visual Selector Component */}
            <TemplateSelector
              visualType={visualType}
              setVisualType={setVisualType}
            />

            {/* 2. Headline & Subtitle Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#1D1D1F]">
                  Scene headline
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="bg-neutral-50/70 border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-xl px-3.5 py-2 text-xs font-medium text-[#1D1D1F] placeholder-[#86868B] outline-none transition-all"
                  placeholder="e.g. Breakthrough moment"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#1D1D1F]">
                  Context tag / subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="bg-neutral-50/70 border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] placeholder-[#86868B] outline-none transition-all"
                  placeholder="e.g. November 2023"
                />
              </div>
            </div>

            {/* 3. Narration Script & Auto-Resync Notice */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#86868B]" />
                  <span>Narration script</span>
                </label>
                {hasNarrationChanged && (
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Modified
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                required
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="bg-neutral-50/70 border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 rounded-xl p-3 text-xs text-[#1D1D1F] placeholder-[#86868B] outline-none transition-all leading-relaxed"
                placeholder="The spoken voice narration for this scene..."
              />

              {hasNarrationChanged && (
                <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-normal">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Re-synthesize audio & sync word timestamps?</span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium select-none text-xs">
                    <input
                      type="checkbox"
                      checked={resyncAudio}
                      onChange={(e) => setResyncAudio(e.target.checked)}
                      className="rounded border-black/[0.15] text-[#0071E3] focus:ring-0"
                    />
                    <span>Re-sync</span>
                  </label>
                </div>
              )}
            </div>

            {/* 4. Media Asset URLs Component */}
            <SceneMediaInputs
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              onOpenStockPicker={() => setIsStockPickerOpen(true)}
            />

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || isResyncing}
                className={`px-5 py-2 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all ${saveSuccess
                    ? "bg-[#34C759]"
                    : "bg-[#0071E3] hover:bg-[#0077ED]"
                  }`}
              >
                {isSaving || isResyncing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isResyncing ? "Re-synthesizing..." : "Saving..."}</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Stock Video Picker Modal */}
      <StockVideoPickerModal
        isOpen={isStockPickerOpen}
        onClose={() => setIsStockPickerOpen(false)}
        initialQuery={headline || "documentary"}
        onSelectVideo={(video) => {
          setVideoUrl(video.videoUrl);
        }}
      />
    </>
  );
};
