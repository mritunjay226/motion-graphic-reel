"use client";

import React, { useState, useEffect } from "react";
import { ZernioAccount } from "@/lib/zernio";
import {
  Share2,
  X,
  Sparkles,
  Hash,
  Send,
} from "lucide-react";
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from "@/components/icons/BrandIcons";

import { SocialAccountSelector } from "./social/SocialAccountSelector";
import { YouTubePublishForm } from "./social/YouTubePublishForm";
import { InstagramPublishForm } from "./social/InstagramPublishForm";
import { PublishResultBanner } from "./social/PublishResultBanner";

export interface SocialPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  videoUrl: string;
  topic: string;
  title: string;
  storyboardSummary?: string;
  heroImageUrl?: string;
  existingSocialPosts?: Array<{
    platform: string;
    accountId: string;
    accountName?: string;
    status: "pending" | "published" | "scheduled" | "failed";
    postUrl?: string;
    errorMessage?: string;
    publishedAt?: number;
  }>;
}

type PlatformTab = "all" | "youtube" | "instagram";

export function SocialPublishModal({
  isOpen,
  onClose,
  reelId,
  videoUrl,
  topic,
  title,
  storyboardSummary,
  heroImageUrl,
  existingSocialPosts,
}: SocialPublishModalProps) {
  const [activeTab, setActiveTab] = useState<PlatformTab>("all");
  const [accounts, setAccounts] = useState<ZernioAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Selected accounts map: accountId -> boolean
  const [selectedAccountIds, setSelectedAccountIds] = useState<Record<string, boolean>>({});

  // Manual fallback inputs (if user enters IDs manually)
  const [manualIgId, setManualIgId] = useState("");
  const [manualYtId, setManualYtId] = useState("");
  const [useManualMode, setUseManualMode] = useState(false);

  // ── YouTube Specific Metadata ──
  const [ytTitle, setYtTitle] = useState(`${topic} — Story Breakdown`);
  const [ytDescription, setYtDescription] = useState(
    `An in-depth documentary breakdown of ${topic}.\n\nMotion graphic story created with AI.`
  );
  const [ytTags, setYtTags] = useState(`${topic}, documentary, case study, motion graphics`);
  const [ytVisibility, setYtVisibility] = useState<"public" | "unlisted" | "private">("public");

  // ── Instagram Specific Metadata ──
  const [igCaption, setIgCaption] = useState(
    `The story of ${topic}.\n\nHow one decision changed everything. What would you have done in their position?\n\nFollow for more daily stories.`
  );
  const [igFirstComment, setIgFirstComment] = useState(`What do you think about this? Let us know below.`);
  const [hashtags, setHashtags] = useState("#shorts #reels #documentary #storytelling");
  const [useHeroThumbnail, setUseHeroThumbnail] = useState(Boolean(heroImageUrl));

  // AI Generation State
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  // Connecting State
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean | null>(null);
  const [publishResultData, setPublishResultData] = useState<any>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    setAccountError(null);
    try {
      const res = await fetch("/api/social/accounts");
      const data = await res.json();

      if (res.ok && data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
        const initialSelection: Record<string, boolean> = {};
        data.accounts.forEach((acc: ZernioAccount) => {
          initialSelection[acc.id] = true;
        });
        setSelectedAccountIds(initialSelection);
      } else {
        setAccounts([]);
        if (data.error) setAccountError(data.error);
      }
    } catch (err: any) {
      setAccountError(err.message || "Failed to load accounts.");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const handleConnect = async (platform: "youtube" | "instagram") => {
    setConnectingPlatform(platform);
    try {
      const res = await fetch(`/api/social/connect?platform=${platform}`);
      const data = await res.json();
      if (res.ok && data.authUrl) {
        window.open(data.authUrl, "_blank", "width=600,height=700");
      } else {
        alert(data.error || `Failed to start connection for ${platform}`);
      }
    } catch (err: any) {
      alert(err.message || "Failed to initiate connection");
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const res = await fetch("/api/social/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title,
          storyboardText: storyboardSummary,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.youtubeTitle) setYtTitle(data.youtubeTitle);
        if (data.youtubeDescription) setYtDescription(data.youtubeDescription);
        if (data.youtubeTags && Array.isArray(data.youtubeTags)) {
          setYtTags(data.youtubeTags.join(", "));
        }
        if (data.instagramCaption) setIgCaption(data.instagramCaption);
        if (data.instagramFirstComment) setIgFirstComment(data.instagramFirstComment);
        if (data.hashtags && Array.isArray(data.hashtags)) {
          setHashtags(data.hashtags.join(" "));
        }
      }
    } catch (err) {
      console.error("AI copy generation error:", err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(null);

    const parsedYtTags = ytTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const targetPlatforms: Array<{
      platform: string;
      accountId: string;
      accountName?: string;
      customTitle?: string;
      customCaption?: string;
      visibility?: "public" | "unlisted" | "private";
      firstComment?: string;
      thumbnailUrl?: string;
    }> = [];

    if (useManualMode) {
      if (manualYtId.trim()) {
        targetPlatforms.push({
          platform: "youtube",
          accountId: manualYtId.trim(),
          accountName: "YouTube Channel",
          customTitle: ytTitle,
          customCaption: `${ytDescription}\n\n${hashtags}`,
          visibility: ytVisibility,
        });
      }
      if (manualIgId.trim()) {
        targetPlatforms.push({
          platform: "instagram",
          accountId: manualIgId.trim(),
          accountName: "Instagram Account",
          customCaption: `${igCaption}\n\n${hashtags}`,
          firstComment: igFirstComment || undefined,
          thumbnailUrl: useHeroThumbnail && heroImageUrl ? heroImageUrl : undefined,
        });
      }
    } else {
      accounts.forEach((acc) => {
        if (selectedAccountIds[acc.id]) {
          const isYT = acc.platform.toLowerCase().includes("youtube");
          const isIG = acc.platform.toLowerCase().includes("instagram");
          targetPlatforms.push({
            platform: isYT ? "youtube" : isIG ? "instagram" : acc.platform,
            accountId: acc.id,
            accountName: acc.name,
            customTitle: isYT ? ytTitle : undefined,
            customCaption: isYT
              ? `${ytDescription}\n\n${hashtags}`
              : isIG
              ? `${igCaption}\n\n${hashtags}`
              : `${igCaption}\n\n${hashtags}`,
            visibility: isYT ? ytVisibility : undefined,
            firstComment: isIG ? igFirstComment : undefined,
            thumbnailUrl: isIG && useHeroThumbnail && heroImageUrl ? heroImageUrl : undefined,
          });
        }
      });
    }

    if (targetPlatforms.length === 0) {
      setPublishError("Please select or enter at least one target channel (Instagram or YouTube).");
      setIsPublishing(false);
      return;
    }

    try {
      const res = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId,
          videoUrl,
          title: ytTitle,
          caption: `${igCaption}\n\n${hashtags}`,
          tags: parsedYtTags,
          firstComment: igFirstComment,
          thumbnailUrl: useHeroThumbnail && heroImageUrl ? heroImageUrl : undefined,
          platforms: targetPlatforms,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPublishSuccess(true);
        setPublishResultData(data);
      } else {
        setPublishError(data.error || "Failed to publish to selected channels.");
      }
    } catch (err: any) {
      setPublishError(err.message || "Network error while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1C1C1E] border border-white/10 rounded-[28px] sm:rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden text-[#F5F5F7]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">
                Publish Reel
              </h3>
              <p className="text-[11px] text-white/50">
                Direct export to YouTube Shorts and Instagram Reels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Success Banner & Previous History */}
          <PublishResultBanner
            publishSuccess={publishSuccess}
            publishResultData={publishResultData}
            existingSocialPosts={existingSocialPosts}
            publishError={publishError}
          />

          {/* Section 1: Connected Channels Selector */}
          <SocialAccountSelector
            useManualMode={useManualMode}
            setUseManualMode={setUseManualMode}
            connectingPlatform={connectingPlatform}
            onConnect={handleConnect}
            onRefresh={fetchAccounts}
            manualYtId={manualYtId}
            setManualYtId={setManualYtId}
            manualIgId={manualIgId}
            setManualIgId={setManualIgId}
            loadingAccounts={loadingAccounts}
            accounts={accounts}
            accountError={accountError}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={(id) =>
              setSelectedAccountIds((prev) => ({
                ...prev,
                [id]: !prev[id],
              }))
            }
          />

          {/* Section 2: Platform Customization Tabs & AI Copy Generator */}
          <div className="space-y-3.5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-white/20 text-white font-semibold shadow-xs"
                      : "text-white/60 hover:text-white font-medium"
                  }`}
                >
                  All Channels
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("youtube")}
                  className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "youtube"
                      ? "bg-white/20 text-white font-semibold shadow-xs"
                      : "text-white/60 hover:text-white font-medium"
                  }`}
                >
                  <Youtube className="w-3 h-3 text-red-400" />
                  <span>YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("instagram")}
                  className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "instagram"
                      ? "bg-white/20 text-white font-semibold shadow-xs"
                      : "text-white/60 hover:text-white font-medium"
                  }`}
                >
                  <Instagram className="w-3 h-3 text-pink-400" />
                  <span>Instagram</span>
                </button>
              </div>

              {/* AI Copy Button */}
              <button
                type="button"
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingCopy ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-draft</span>
                  </>
                )}
              </button>
            </div>

            {/* TAB 1: ALL CHANNELS */}
            {activeTab === "all" && (
              <div className="space-y-3 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-white/80 font-medium flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-400" />
                      <span>YouTube title</span>
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">
                      {ytTitle.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    maxLength={100}
                    placeholder="Shorts title"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80 font-medium flex items-center gap-1.5 mb-1">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram caption</span>
                  </label>
                  <textarea
                    value={igCaption}
                    onChange={(e) => setIgCaption(e.target.value)}
                    rows={3}
                    placeholder="Reel caption..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3] leading-relaxed resize-none font-normal"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/80 font-medium flex items-center gap-1.5 mb-1">
                    <Hash className="w-3.5 h-3.5 text-white/50" />
                    <span>Hashtags</span>
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#shorts #reels #documentary"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: YOUTUBE SHORTS */}
            {activeTab === "youtube" && (
              <YouTubePublishForm
                ytTitle={ytTitle}
                setYtTitle={setYtTitle}
                ytDescription={ytDescription}
                setYtDescription={setYtDescription}
                ytTags={ytTags}
                setYtTags={setYtTags}
                ytVisibility={ytVisibility}
                setYtVisibility={setYtVisibility}
              />
            )}

            {/* TAB 3: INSTAGRAM REELS */}
            {activeTab === "instagram" && (
              <InstagramPublishForm
                igCaption={igCaption}
                setIgCaption={setIgCaption}
                igFirstComment={igFirstComment}
                setIgFirstComment={setIgFirstComment}
                heroImageUrl={heroImageUrl}
                useHeroThumbnail={useHeroThumbnail}
                setUseHeroThumbnail={setUseHeroThumbnail}
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
          >
            {isPublishing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
