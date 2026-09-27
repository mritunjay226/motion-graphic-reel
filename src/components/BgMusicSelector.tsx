"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

import { Music, Volume2, Play, Pause, Check } from "lucide-react";

export interface BgMusicTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  badge?: string;
}

export const PRESET_MUSIC_TRACKS: BgMusicTrack[] = [
  {
    id: "documentary_pulse",
    name: "Volatile Pulse",
    artist: "Investigative documentary",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
    badge: "Recommended",
  },
  {
    id: "tech_explainer",
    name: "Screen Saver",
    artist: "Modular tech arpeggio",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713682/vox-reels/music/tech_explainer.mp3",
    badge: "Tech",
  },
  {
    id: "cyber_beat",
    name: "Urban Gauntlet",
    artist: "Fast kinetic rhythm",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713674/vox-reels/music/cyber_beat.mp3",
    badge: "Fast",
  },
  {
    id: "chill_lofi",
    name: "Cool Vibes",
    artist: "Late night lo-fi",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713666/vox-reels/music/chill_lofi.mp3",
    badge: "Lo-Fi",
  },
  {
    id: "cinematic_strings",
    name: "Impact Moderato",
    artist: "Cinematic orchestral strings",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713668/vox-reels/music/cinematic_strings.mp3",
    badge: "Cinematic",
  },
  {
    id: "dark_suspense",
    name: "Darkling",
    artist: "Ominous suspense",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713676/vox-reels/music/dark_suspense.mp3",
    badge: "Mystery",
  },
  {
    id: "curious_explainer",
    name: "Industrious Ferret",
    artist: "Curious storytelling",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713671/vox-reels/music/curious_explainer.mp3",
    badge: "Explainer",
  },
  {
    id: "none",
    name: "No Music",
    artist: "Voice and Foley sound effects only",
    url: "",
  },
];

interface BgMusicSelectorProps {
  reelId: Id<"reels">;
  currentBgMusicUrl?: string;
  currentBgMusicVolume?: number;
  onBgMusicChange?: (url: string, volume: number) => void;
}

export const BgMusicSelector: React.FC<BgMusicSelectorProps> = ({
  reelId,
  currentBgMusicUrl = "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
  currentBgMusicVolume = 0.15,
  onBgMusicChange,
}) => {
  const updateBgMusic = useMutation(api.reels.updateBgMusic);

  const [selectedUrl, setSelectedUrl] = useState<string>(currentBgMusicUrl);
  const [volume, setVolume] = useState<number>(currentBgMusicVolume);
  const [playingTrackUrl, setPlayingTrackUrl] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleSelectTrack = async (url: string) => {
    setSelectedUrl(url);
    if (onBgMusicChange) onBgMusicChange(url, volume);

    try {
      setIsUpdating(true);
      await updateBgMusic({
        reelId,
        bgMusicUrl: url,
        bgMusicVolume: volume,
      });
    } catch (err) {
      console.error("Failed to update background music:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVolumeChange = async (newVol: number) => {
    setVolume(newVol);
    if (onBgMusicChange) onBgMusicChange(selectedUrl, newVol);

    if (audioRef) {
      audioRef.volume = newVol;
    }

    try {
      await updateBgMusic({
        reelId,
        bgMusicUrl: selectedUrl,
        bgMusicVolume: newVol,
      });
    } catch (err) {
      console.error("Failed to update music volume:", err);
    }
  };

  const togglePreviewAudio = (url: string) => {
    if (!url) return;

    if (playingTrackUrl === url && audioRef) {
      audioRef.pause();
      setPlayingTrackUrl(null);
    } else {
      if (audioRef) audioRef.pause();
      const newAudio = new Audio(url);
      newAudio.volume = volume;
      newAudio.play();
      setAudioRef(newAudio);
      setPlayingTrackUrl(url);

      newAudio.onended = () => setPlayingTrackUrl(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-5 shadow-xs font-sans text-[#1D1D1F] space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center text-[#1D1D1F]">
            <Music className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">
              Background Score
            </h3>
            <p className="text-[11px] text-[#86868B]">
              Soundtrack selection and ducking level
            </p>
          </div>
        </div>
        {isUpdating && (
          <span className="text-[11px] text-[#0071E3] font-medium animate-pulse">
            Saving...
          </span>
        )}
      </div>

      {/* Track List */}
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {PRESET_MUSIC_TRACKS.map((track) => {
          const isSelected = selectedUrl === track.url;
          const isPlaying = playingTrackUrl === track.url;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track.url)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "bg-white border-[#0071E3] shadow-xs ring-2 ring-[#0071E3]/20 border"
                  : "bg-neutral-50/70 border border-black/[0.04] hover:bg-white hover:border-black/[0.1]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreviewAudio(track.url);
                  }}
                  disabled={!track.url}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-[#0071E3] text-white"
                      : "bg-black/[0.05] text-[#1D1D1F] hover:bg-black/[0.1]"
                  }`}
                >
                  {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[#1D1D1F]">{track.name}</p>
                    {track.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-medium bg-black/[0.05] text-[#86868B] rounded-full">
                        {track.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#86868B]">
                    {track.artist}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Volume Slider */}
      {selectedUrl && (
        <div className="pt-3 border-t border-black/[0.05] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#86868B] font-medium">
            <div className="flex items-center gap-1.5 text-[#1D1D1F]">
              <Volume2 className="w-3.5 h-3.5 text-[#86868B]" />
              <span>Music ducking volume</span>
            </div>
            <span className="font-mono text-[#1D1D1F]">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-[#0071E3]"
          />
        </div>
      )}
    </div>
  );
};
