import React from "react";
import { RefreshCw, Globe } from "lucide-react";
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from "@/components/icons/BrandIcons";
import { ZernioAccount } from "@/lib/zernio";

interface SocialAccountSelectorProps {
  useManualMode: boolean;
  setUseManualMode: (val: boolean) => void;
  connectingPlatform: string | null;
  onConnect: (platform: "youtube" | "instagram") => void;
  onRefresh: () => void;
  manualYtId: string;
  setManualYtId: (val: string) => void;
  manualIgId: string;
  setManualIgId: (val: string) => void;
  loadingAccounts: boolean;
  accounts: ZernioAccount[];
  accountError: string | null;
  selectedAccountIds: Record<string, boolean>;
  onToggleAccount: (id: string) => void;
}

export const SocialAccountSelector: React.FC<SocialAccountSelectorProps> = ({
  useManualMode,
  setUseManualMode,
  connectingPlatform,
  onConnect,
  onRefresh,
  manualYtId,
  setManualYtId,
  manualIgId,
  setManualIgId,
  loadingAccounts,
  accounts,
  accountError,
  selectedAccountIds,
  onToggleAccount,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white/70">
          Target Channels
        </label>
        <button
          type="button"
          onClick={() => setUseManualMode(!useManualMode)}
          className="text-[11px] text-[#2997FF] hover:underline font-medium cursor-pointer"
        >
          {useManualMode ? "Switch to connected accounts" : "Enter IDs manually"}
        </button>
      </div>

      {/* Connect Buttons & Refresh */}
      {!useManualMode && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onConnect("youtube")}
            disabled={connectingPlatform === "youtube"}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {connectingPlatform === "youtube" ? (
              <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Youtube className="w-3.5 h-3.5 text-red-400" />
            )}
            <span>Connect YouTube</span>
          </button>

          <button
            type="button"
            onClick={() => onConnect("instagram")}
            disabled={connectingPlatform === "instagram"}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {connectingPlatform === "instagram" ? (
              <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
            )}
            <span>Connect Instagram</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh accounts"
            className="p-2 rounded-xl text-xs bg-white/[0.06] hover:bg-white/[0.1] text-white/70 transition-colors flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {useManualMode ? (
        <div className="space-y-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
          <div>
            <label className="text-xs text-white/70 font-medium mb-1 flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>YouTube Channel ID:</span>
            </label>
            <input
              type="text"
              value={manualYtId}
              onChange={(e) => setManualYtId(e.target.value)}
              placeholder="e.g. UCxxxxxx"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3]"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 font-medium mb-1 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Instagram Account ID:</span>
            </label>
            <input
              type="text"
              value={manualIgId}
              onChange={(e) => setManualIgId(e.target.value)}
              placeholder="e.g. 178414xxxxxx"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3]"
            />
          </div>
        </div>
      ) : loadingAccounts ? (
        <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/50 text-xs">
          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          Checking connected channels...
        </div>
      ) : accounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {accounts.map((acc) => {
            const isSelected = Boolean(selectedAccountIds[acc.id]);
            const isYT = acc.platform.includes("youtube");
            const isIG = acc.platform.includes("instagram");

            return (
              <div
                key={acc.id}
                onClick={() => onToggleAccount(acc.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-white/[0.08] border-[#0071E3] ring-1 ring-[#0071E3]/30"
                    : "bg-white/[0.03] border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs">
                    {isYT ? <Youtube className="w-3.5 h-3.5 text-red-400" /> : isIG ? <Instagram className="w-3.5 h-3.5 text-pink-400" /> : <Globe className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-[140px]">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-white/50 capitalize">
                      {acc.platform}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#0071E3] rounded cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-1">
          <p className="text-xs text-white/80 font-medium">
            {accountError || "No channels connected yet."}
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed">
            Click Connect YouTube or Connect Instagram above to link your social accounts.
          </p>
        </div>
      )}
    </div>
  );
};
