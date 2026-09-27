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
    name: "Volatile Pulse (Investigative Vox)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3",
    badge: "INVESTIGATIVE",
  },
  {
    id: "tech_explainer",
    name: "Screen Saver (Modular Tech Arp)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713682/vox-reels/music/tech_explainer.mp3",
    badge: "TECH / SAAS",
  },
  {
    id: "cyber_beat",
    name: "Urban Gauntlet (Fast Cyber Beat)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713674/vox-reels/music/cyber_beat.mp3",
    badge: "RETENTION HOOK",
  },
  {
    id: "chill_lofi",
    name: "Cool Vibes (Late Night Lo-Fi)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713666/vox-reels/music/chill_lofi.mp3",
    badge: "LO-FI / HABITS",
  },
  {
    id: "cinematic_strings",
    name: "Impact Moderato (Cinematic Strings)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713668/vox-reels/music/cinematic_strings.mp3",
    badge: "CINEMATIC",
  },
  {
    id: "dark_suspense",
    name: "Darkling (Ominous Mystery)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713676/vox-reels/music/dark_suspense.mp3",
    badge: "MYSTERY",
  },
  {
    id: "curious_explainer",
    name: "Industrious Ferret (Curious Explainer)",
    artist: "Kevin MacLeod • CC-BY 4.0",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713671/vox-reels/music/curious_explainer.mp3",
    badge: "ANALYTICAL",
  },
  {
    id: "without_me",
    name: "Without Me (Beat Instrumental)",
    artist: "Eminem Instrumental Cover",
    url: "https://res.cloudinary.com/diah8zonu/video/upload/v1788713683/vox-reels/music/without_me.mp3",
    badge: "LEGACY",
  },
  {
    id: "none",
    name: "Mute (No Background Music)",
    artist: "Narration & Tactile Foley Only",
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
    <div className="bg-[#111111] text-white p-5 rounded-2xl border border-gray-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#FFE600]" />
          <h3 className="text-base font-extrabold tracking-wide uppercase text-white">
            Background Music Selector
          </h3>
        </div>
        {isUpdating && (
          <span className="text-xs font-mono text-[#FFE600] animate-pulse">
            SAVING TRACK...
          </span>
        )}
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {PRESET_MUSIC_TRACKS.map((track) => {
          const isSelected = selectedUrl === track.url;
          const isPlaying = playingTrackUrl === track.url;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track.url)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "bg-gray-800/90 border-2 border-[#FFE600]"
                  : "bg-gray-900/60 border border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreviewAudio(track.url);
                  }}
                  disabled={!track.url}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-[#FFE600] text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{track.name}</p>
                    {track.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#FFE600] text-black rounded-full">
                        {track.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono">
                    {track.artist}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-[#FFE600] text-black flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Volume Slider */}
      {selectedUrl && (
        <div className="pt-2 border-t border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#FFE600]" />
              <span>MUSIC VOLUME DUCKING</span>
            </div>
            <span className="font-bold text-[#FFE600]">
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
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#FFE600]"
          />
        </div>
      )}
    </div>
  );
};
