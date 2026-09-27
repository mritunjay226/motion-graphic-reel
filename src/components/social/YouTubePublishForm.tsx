import React from "react";
import { FileText, Search } from "lucide-react";
import { YoutubeIcon as Youtube } from "@/components/icons/BrandIcons";

interface YouTubePublishFormProps {
  ytTitle: string;
  setYtTitle: (val: string) => void;
  ytDescription: string;
  setYtDescription: (val: string) => void;
  ytTags: string;
  setYtTags: (val: string) => void;
  ytVisibility: "public" | "unlisted" | "private";
  setYtVisibility: (val: "public" | "unlisted" | "private") => void;
}

export const YouTubePublishForm: React.FC<YouTubePublishFormProps> = ({
  ytTitle,
  setYtTitle,
  ytDescription,
  setYtDescription,
  ytTags,
  setYtTags,
  ytVisibility,
  setYtVisibility,
}) => {
  return (
    <div className="space-y-3.5 animate-in fade-in bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/80 font-medium flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube Shorts title</span>
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
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3] font-medium"
        />
      </div>

      <div>
        <label className="text-xs text-white/80 font-medium flex items-center gap-1.5 mb-1">
          <FileText className="w-3.5 h-3.5 text-white/50" />
          <span>Description</span>
        </label>
        <textarea
          value={ytDescription}
          onChange={(e) => setYtDescription(e.target.value)}
          rows={3}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3] leading-relaxed resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/80 font-medium flex items-center gap-1.5 mb-1">
          <Search className="w-3.5 h-3.5 text-white/50" />
          <span>Tags (comma-separated)</span>
        </label>
        <input
          type="text"
          value={ytTags}
          onChange={(e) => setYtTags(e.target.value)}
          placeholder="documentary, business story, case study"
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3]"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="text-xs text-white/70 font-medium">Visibility:</label>
        <select
          value={ytVisibility}
          onChange={(e: any) => setYtVisibility(e.target.value)}
          className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0071E3] cursor-pointer"
        >
          <option value="public" className="bg-[#1C1C1E] text-white">Public</option>
          <option value="unlisted" className="bg-[#1C1C1E] text-white">Unlisted</option>
          <option value="private" className="bg-[#1C1C1E] text-white">Private</option>
        </select>
      </div>
    </div>
  );
};
