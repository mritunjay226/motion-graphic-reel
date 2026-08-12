"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const MusicIcon = () => (
  <svg className="w-5 h-5 text-[#FFE600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const VolumeIcon = () => (
  <svg className="w-4 h-4 text-[#FFE600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export interface BgMusicTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  badge?: string;
}

export const PRESET_MUSIC_TRACKS: BgMusicTrack[] = [
  {
    id: "without_me",
    name: "Without Me (Documentary Beat)",
    artist: "Eminem Instrumental",
    url: "/music/without_me.mp3",
    badge: "DEFAULT",
  },
  {
    id: "none",
    name: "Mute (No Background Music)",
    artist: "Narration Only",
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
  currentBgMusicUrl = "/music/without_me.mp3",
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
          <MusicIcon />
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
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
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
                  <CheckIcon />
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
              <VolumeIcon />
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
