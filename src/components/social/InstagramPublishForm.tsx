import React from "react";
import { MessageSquare } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/BrandIcons";

interface InstagramPublishFormProps {
  igCaption: string;
  setIgCaption: (val: string) => void;
  igFirstComment: string;
  setIgFirstComment: (val: string) => void;
  heroImageUrl?: string;
  useHeroThumbnail: boolean;
  setUseHeroThumbnail: (val: boolean) => void;
}

export const InstagramPublishForm: React.FC<InstagramPublishFormProps> = ({
  igCaption,
  setIgCaption,
  igFirstComment,
  setIgFirstComment,
  heroImageUrl,
  useHeroThumbnail,
  setUseHeroThumbnail,
}) => {
  return (
    <div className="space-y-3.5 animate-in fade-in bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
      <div>
        <label className="text-xs text-white/80 font-medium flex items-center gap-1.5 mb-1">
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <span>Instagram Reel caption</span>
        </label>
        <textarea
          value={igCaption}
          onChange={(e) => setIgCaption(e.target.value)}
          rows={4}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3] leading-relaxed resize-none font-normal"
        />
      </div>

      <div>
        <label className="text-xs text-white/80 font-medium flex items-center gap-1.5 mb-1">
          <MessageSquare className="w-3.5 h-3.5 text-white/50" />
          <span>First comment (auto-posted)</span>
        </label>
        <input
          type="text"
          value={igFirstComment}
          onChange={(e) => setIgFirstComment(e.target.value)}
          placeholder="Drop your thoughts below"
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0071E3]"
        />
        <p className="text-[11px] text-white/40 mt-1">
          Posted immediately with the video.
        </p>
      </div>

      {heroImageUrl && (
        <div className="flex items-center justify-between p-3 bg-white/[0.04] rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={heroImageUrl}
              alt="Hero Thumbnail"
              className="w-9 h-9 rounded-lg object-cover border border-white/10"
            />
            <div>
              <p className="text-xs font-medium text-white">Scene cover thumbnail</p>
              <p className="text-[10px] text-white/50">Use scene 1 cutout image as cover</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useHeroThumbnail}
            onChange={(e) => setUseHeroThumbnail(e.target.checked)}
            className="w-4 h-4 accent-[#0071E3] rounded cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
