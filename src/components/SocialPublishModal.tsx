"use client";

import React, { useState, useEffect } from "react";
import { ZernioAccount } from "@/lib/zernio";
import {
  Rocket,
  X,
  CheckCircle2,
  RefreshCw,
  Zap,
  Sparkles,
  Hash,
  FileText,
  Search,
  MessageSquare,
  Send,
  ExternalLink,
  Globe,
} from "lucide-react";
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from "@/components/icons/BrandIcons";

interface SocialPublishModalProps {
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
  const [ytTitle, setYtTitle] = useState(`The $50M Mistake That Changed ${topic} Forever 🤯`);
  const [ytDescription, setYtDescription] = useState(
    `The shocking untold documentary breakdown of ${topic}.\n\n⚡ 60-Second Business Story\n👉 Subscribe for daily motion-graphic breakdowns!`
  );
  const [ytTags, setYtTags] = useState(`${topic}, business documentary, case study, startup failure, motion graphics, viral shorts`);
  const [ytVisibility, setYtVisibility] = useState<"public" | "unlisted" | "private">("public");

  // ── Instagram Specific Metadata ──
  const [igCaption, setIgCaption] = useState(
    `THE CRAZY TRUTH ABOUT ${topic.toUpperCase()} 🚨\n\n📌 How one decision sparked an industry revolution.\n⚡ The multi-million risk that almost destroyed everything.\n\nDid they make the right move, or was it pure luck? Let me know below! 👇\n\nSave this reel 🔖 & follow for more!`
  );
  const [igFirstComment, setIgFirstComment] = useState(`What would you have done in their position? Comment below 👇`);
  const [hashtags, setHashtags] = useState("#shorts #reels #viral #businessdocumentary #motiongraphics #mindset");
  const [shareToFeed, setShareToFeed] = useState(true);
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

  // Fetch connected accounts on open
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

  // AI generate viral copy handler
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

  // Publish handler
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-amber-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-fuchsia-500/25">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Viral Social Studio
                <span className="text-[10px] font-mono font-bold bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30 px-2.5 py-0.5 rounded-full">
                  INSTAGRAM & YOUTUBE
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                1-Click auto-upload, viral hook optimization & SEO tags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Success Banner */}
          {publishSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-emerald-300 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Video Dispatched to Social Platforms!</span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                The social auto-publisher is now transcoding, applying your custom hooks, and publishing directly to your connected channels.
              </p>
              {publishResultData?.platformResults && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {publishResultData.platformResults.map((pr: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="font-mono uppercase font-bold text-white">{pr.platform}</span>
                      {pr.postUrl ? (
                        <a
                          href={pr.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 underline hover:text-emerald-300 font-bold flex items-center gap-1"
                        >
                          <span>Live Post</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-emerald-400 font-mono font-semibold">Status: {pr.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 1: Channel Connection & Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <span>1.</span> Connected Channels
              </label>
              <button
                type="button"
                onClick={() => setUseManualMode(!useManualMode)}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                {useManualMode ? "Switch to Auto-Detected Channels" : "Custom Account IDs Mode"}
              </button>
            </div>

            {/* 1-Click Connect Buttons & Refresh */}
            {!useManualMode && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleConnect("youtube")}
                  disabled={connectingPlatform === "youtube"}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {connectingPlatform === "youtube" ? (
                    <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Youtube className="w-4 h-4" />
                  )}
                  <span>Connect YouTube Channel</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleConnect("instagram")}
                  disabled={connectingPlatform === "instagram"}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-fuchsia-600/10 hover:bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {connectingPlatform === "instagram" ? (
                    <span className="w-3.5 h-3.5 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Instagram className="w-4 h-4" />
                  )}
                  <span>Connect Instagram Reel</span>
                </button>

                <button
                  type="button"
                  onClick={fetchAccounts}
                  title="Refresh connected channels"
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            )}

            {useManualMode ? (
              <div className="space-y-3 bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                <div>
                  <label className="text-xs text-neutral-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>YouTube Account / Channel ID:</span>
                  </label>
                  <input
                    type="text"
                    value={manualYtId}
                    onChange={(e) => setManualYtId(e.target.value)}
                    placeholder="e.g. UCxxxxxx or Channel ID"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-fuchsia-500" />
                    <span>Instagram Account ID:</span>
                  </label>
                  <input
                    type="text"
                    value={manualIgId}
                    onChange={(e) => setManualIgId(e.target.value)}
                    placeholder="e.g. 178414xxxxxx or Instagram ID"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ) : loadingAccounts ? (
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center gap-2 text-neutral-400 text-xs font-mono">
                <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                Fetching connected social channels...
              </div>
            ) : accounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {accounts.map((acc) => {
                  const isSelected = Boolean(selectedAccountIds[acc.id]);
                  const isYT = acc.platform.includes("youtube");
                  const isIG = acc.platform.includes("instagram");

                  return (
                    <div
                      key={acc.id}
                      onClick={() =>
                        setSelectedAccountIds((prev) => ({
                          ...prev,
                          [acc.id]: !prev[acc.id],
                        }))
                      }
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-neutral-800/90 border-amber-400 shadow-lg shadow-amber-400/10"
                          : "bg-neutral-950 border-neutral-800 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isYT
                              ? "bg-red-600/20 text-red-400 border border-red-500/30"
                              : isIG
                              ? "bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30"
                              : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {isYT ? <Youtube className="w-4 h-4" /> : isIG ? <Instagram className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[150px]">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono capitalize">
                            {acc.platform}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-1.5">
                <p className="text-xs text-amber-300 font-semibold">
                  {accountError || "No channels connected yet."}
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Click the <strong>Connect YouTube</strong> or <strong>Connect Instagram</strong> buttons above to authenticate in 1 click!
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Platform Customization Tabs & AI Copy Generator */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              {/* Platform Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "all"
                      ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>All Channels</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("youtube")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "youtube"
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube Shorts</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("instagram")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "instagram"
                      ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-600/20"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram Reels</span>
                </button>
              </div>

              {/* AI Copy Button */}
              <button
                type="button"
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy}
                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-neutral-950 hover:opacity-90 transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGeneratingCopy ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Generating Viral Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Draft with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* ─── TAB 1: ALL CHANNELS SYNCED ─── */}
            {activeTab === "all" && (
              <div className="space-y-4 animate-in fade-in">
                {/* YouTube Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-neutral-300 font-bold flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      <span>YouTube Shorts Title (High-CTR Hook)</span>
                    </label>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {ytTitle.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    maxLength={100}
                    placeholder="The $50M Mistake That Changed Everything"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                {/* Instagram Caption */}
                <div>
                  <label className="text-xs text-neutral-300 font-bold flex items-center gap-1.5 mb-1.5">
                    <Instagram className="w-3.5 h-3.5 text-fuchsia-500" />
                    <span>Instagram Reel Caption & Story Hook</span>
                  </label>
                  <textarea
                    value={igCaption}
                    onChange={(e) => setIgCaption(e.target.value)}
                    rows={4}
                    placeholder="THE SHOCKING TRUTH BEHIND..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 leading-relaxed resize-none font-medium"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="text-xs text-neutral-300 font-bold flex items-center gap-1.5 mb-1.5">
                    <Hash className="w-3.5 h-3.5 text-amber-400" />
                    <span>Viral Hashtags</span>
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#shorts #reels #viral #businessdocumentary"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-300 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* ─── TAB 2: YOUTUBE SHORTS ─── */}
            {activeTab === "youtube" && (
              <div className="space-y-4 animate-in fade-in bg-red-950/10 border border-red-500/20 p-4 rounded-2xl">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-red-300 font-bold flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-400" />
                      <span>YouTube Shorts Title</span>
                    </label>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {ytTitle.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    maxLength={100}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs text-red-300 font-bold flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>YouTube Description & SEO Summary</span>
                  </label>
                  <textarea
                    value={ytDescription}
                    onChange={(e) => setYtDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-400 leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-red-300 font-bold flex items-center gap-1.5 mb-1.5">
                    <Search className="w-3.5 h-3.5 text-red-400" />
                    <span>Search & SEO Tags (Comma Separated)</span>
                  </label>
                  <input
                    type="text"
                    value={ytTags}
                    onChange={(e) => setYtTags(e.target.value)}
                    placeholder="documentary, business story, case study, viral"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs text-neutral-300 font-semibold">YouTube Visibility:</label>
                  <select
                    value={ytVisibility}
                    onChange={(e: any) => setYtVisibility(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-red-400 font-mono"
                  >
                    <option value="public">Public (Instant Live)</option>
                    <option value="unlisted">Unlisted (Share via Link)</option>
                    <option value="private">Private (Draft)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ─── TAB 3: INSTAGRAM REELS ─── */}
            {activeTab === "instagram" && (
              <div className="space-y-4 animate-in fade-in bg-fuchsia-950/10 border border-fuchsia-500/20 p-4 rounded-2xl">
                <div>
                  <label className="text-xs text-fuchsia-300 font-bold flex items-center gap-1.5 mb-1.5">
                    <Instagram className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Instagram Reel Caption</span>
                  </label>
                  <textarea
                    value={igCaption}
                    onChange={(e) => setIgCaption(e.target.value)}
                    rows={4}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-400 leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-fuchsia-300 font-bold flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Algorithmic First Comment (Auto-Posted)</span>
                  </label>
                  <input
                    type="text"
                    value={igFirstComment}
                    onChange={(e) => setIgFirstComment(e.target.value)}
                    placeholder="Did they make the biggest mistake in history? Drop your thoughts below"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Auto-posted immediately to trigger comment velocity & algorithmic reach.
                  </p>
                </div>

                {heroImageUrl && (
                  <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={heroImageUrl}
                        alt="Hero Thumbnail"
                        className="w-10 h-10 rounded-lg object-cover border border-neutral-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">AI Hero Scene Thumbnail</p>
                        <p className="text-[10px] text-neutral-400">Use Scene 1 high-res cutout as cover</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useHeroThumbnail}
                      onChange={(e) => setUseHeroThumbnail(e.target.checked)}
                      className="w-4 h-4 accent-fuchsia-500 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Previous Publishing History on this Reel */}
          {existingSocialPosts && existingSocialPosts.length > 0 && (
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Publishing History on this Reel
              </label>
              <div className="space-y-1.5">
                {existingSocialPosts.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.status === "published"
                            ? "bg-emerald-400"
                            : p.status === "failed"
                            ? "bg-red-400"
                            : "bg-amber-400 animate-pulse"
                        }`}
                      />
                      <span className="capitalize font-bold text-neutral-300">
                        {p.platform}
                      </span>
                    </div>
                    {p.postUrl ? (
                      <a
                        href={p.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>View Live Post</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-neutral-500 uppercase">{p.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {publishError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-300 text-xs">
              <span className="font-bold">Error: </span>
              {publishError}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Publishing to Social Channels...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish to Selected Channels</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
