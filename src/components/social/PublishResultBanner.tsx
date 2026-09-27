import React from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";

interface PublishResultBannerProps {
  publishSuccess: boolean | null;
  publishResultData: any;
  existingSocialPosts?: Array<{
    platform: string;
    accountId: string;
    accountName?: string;
    status: "pending" | "published" | "scheduled" | "failed";
    postUrl?: string;
    errorMessage?: string;
    publishedAt?: number;
  }>;
  publishError: string | null;
}

export const PublishResultBanner: React.FC<PublishResultBannerProps> = ({
  publishSuccess,
  publishResultData,
  existingSocialPosts,
  publishError,
}) => {
  return (
    <>
      {/* Success Banner */}
      {publishSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-emerald-300 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Video dispatched to selected platforms</span>
          </div>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Your reel is being uploaded and published directly to your connected channels.
          </p>
          {publishResultData?.platformResults && (
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {publishResultData.platformResults.map((pr: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="capitalize font-medium text-white">{pr.platform}</span>
                  {pr.postUrl ? (
                    <a
                      href={pr.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <span>View post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-emerald-400/80 text-[11px] capitalize">Status: {pr.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previous Publishing History on this Reel */}
      {existingSocialPosts && existingSocialPosts.length > 0 && (
        <div className="pt-2 border-t border-white/10 space-y-2">
          <label className="text-xs font-medium text-white/50">
            Publishing history
          </label>
          <div className="space-y-1.5">
            {existingSocialPosts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs bg-white/[0.04] p-2.5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      p.status === "published"
                        ? "bg-emerald-400"
                        : p.status === "failed"
                        ? "bg-red-400"
                        : "bg-blue-400 animate-pulse"
                    }`}
                  />
                  <span className="capitalize font-medium text-white/80">
                    {p.platform}
                  </span>
                </div>
                {p.postUrl ? (
                  <a
                    href={p.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium flex items-center gap-1"
                  >
                    <span>View post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-white/40 capitalize text-[11px]">{p.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {publishError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-red-300 text-xs">
          <span className="font-semibold">Error: </span>
          {publishError}
        </div>
      )}
    </>
  );
};
