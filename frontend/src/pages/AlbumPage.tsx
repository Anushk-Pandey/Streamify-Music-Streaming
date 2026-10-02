import React, { useEffect, useState } from "react";
import { Play, Pause, Clock, Plus, Disc3, ArrowLeft } from "lucide-react";
import { useMusicStore } from "../store/useMusicStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { formatDuration, formatPlayCount } from "../lib/utils";
import { AddToPlaylistModal } from "../components/modals/AddToPlaylistModal";
import type { Song } from "../types";

interface AlbumPageProps {
  albumId: string;
  onBack: () => void;
}

export const AlbumPage: React.FC<AlbumPageProps> = ({ albumId, onBack }) => {
  const { currentAlbum, fetchAlbumById, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  useEffect(() => {
    fetchAlbumById(albumId);
  }, [albumId]);

  if (isLoading || !currentAlbum) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Disc3 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-zinc-400">Loading album details...</p>
        </div>
      </div>
    );
  }

  const isCurrentAlbumPlaying =
    isPlaying && currentAlbum.songs?.some((s: Song) => s._id === currentSong?._id);

  const handlePlayAlbumToggle = () => {
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else if (currentAlbum.songs?.length > 0) {
      playAlbum(currentAlbum.songs, 0);
    }
  };

  const totalDurationSeconds =
    currentAlbum.songs?.reduce((acc: number, song: Song) => acc + (song.duration || 0), 0) || 0;

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Header */}
      <div className="relative p-6 md:p-10 bg-gradient-to-b from-zinc-800/80 via-zinc-900/60 to-zinc-950 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 border-b border-zinc-800/80">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-all flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <img
          src={currentAlbum.imageUrl}
          alt={currentAlbum.title}
          className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-2xl border border-zinc-700/60 flex-shrink-0"
        />

        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Album
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {currentAlbum.title}
          </h1>
          <p className="text-sm text-zinc-300">
            <span className="font-semibold text-white">{currentAlbum.artist}</span> •{" "}
            {currentAlbum.releaseYear} • {currentAlbum.songs?.length || 0} songs,{" "}
            {Math.round(totalDurationSeconds / 60)} min
          </p>

          <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={handlePlayAlbumToggle}
              className="px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              {isCurrentAlbumPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  Pause Album
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Play Album
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 text-xs font-bold text-zinc-500 border-b border-zinc-800 pb-3 px-3 uppercase tracking-wider">
          <span className="col-span-1">#</span>
          <span className="col-span-6 md:col-span-6">Title</span>
          <span className="hidden md:block col-span-3 text-right">Plays</span>
          <span className="col-span-5 md:col-span-2 text-right flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="divide-y divide-zinc-900 mt-1">
          {currentAlbum.songs?.map((song: Song, index: number) => {
            const isCurrent = currentSong?._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => playAlbum(currentAlbum.songs, index)}
                className={`grid grid-cols-12 items-center px-3 py-3 rounded-xl cursor-pointer group transition-all ${
                  isCurrent
                    ? "bg-zinc-800/80 text-emerald-400"
                    : "hover:bg-zinc-900/80 text-zinc-300"
                }`}
              >
                <div className="col-span-1 text-xs text-zinc-500 font-mono">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end gap-0.5">
                      <span className="eq-bar !h-3" />
                      <span className="eq-bar !h-2" />
                    </div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="col-span-6 md:col-span-6 flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="truncate">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isCurrent ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="hidden md:block col-span-3 text-right text-xs text-zinc-400 font-mono">
                  {formatPlayCount(song.plays || 0)}
                </div>

                <div className="col-span-5 md:col-span-2 flex items-center justify-end gap-3 text-right text-xs font-mono text-zinc-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSongForPlaylist(song);
                    }}
                    title="Add to Playlist"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:text-white transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span>{formatDuration(song.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={Boolean(selectedSongForPlaylist)}
        onClose={() => setSelectedSongForPlaylist(null)}
      />
    </div>
  );
};
