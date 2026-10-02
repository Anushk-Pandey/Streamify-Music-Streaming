import React, { useEffect } from "react";
import { Play, Pause, Trash2, Clock, ListMusic, ArrowLeft } from "lucide-react";
import { useMusicStore } from "../store/useMusicStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { formatDuration } from "../lib/utils";
import type { Song } from "../types";

interface PlaylistPageProps {
  playlistId: string;
  onBack: () => void;
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({ playlistId, onBack }) => {
  const {
    currentPlaylist,
    fetchPlaylistById,
    removeSongFromPlaylist,
    deletePlaylist,
    isLoading,
  } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    fetchPlaylistById(playlistId);
  }, [playlistId]);

  if (isLoading || !currentPlaylist) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <ListMusic className="w-8 h-8 text-emerald-500 animate-pulse" />
          <p className="text-xs text-zinc-400">Loading playlist...</p>
        </div>
      </div>
    );
  }

  const isCurrentPlaylistPlaying =
    isPlaying && currentPlaylist.songs?.some((s: Song) => s._id === currentSong?._id);

  const handlePlayToggle = () => {
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else if (currentPlaylist.songs?.length > 0) {
      playAlbum(currentPlaylist.songs, 0);
    }
  };

  const handleDeletePlaylist = async () => {
    if (confirm(`Are you sure you want to delete "${currentPlaylist.title}"?`)) {
      await deletePlaylist(currentPlaylist._id);
      onBack();
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Header */}
      <div className="relative p-6 md:p-10 bg-gradient-to-b from-emerald-950/40 via-zinc-900/60 to-zinc-950 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 border-b border-zinc-800/80">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-all flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <img
          src={currentPlaylist.imageUrl}
          alt={currentPlaylist.title}
          className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-2xl border border-zinc-700/60 flex-shrink-0"
        />

        <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Playlist
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight truncate">
            {currentPlaylist.title}
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 line-clamp-2 max-w-xl">
            {currentPlaylist.description || "A personalized collection curated on Streamify."}
          </p>
          <p className="text-xs text-zinc-300">
            Created by <span className="font-semibold text-white">{currentPlaylist.userName}</span> •{" "}
            {currentPlaylist.songs?.length || 0} tracks
          </p>

          <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={handlePlayToggle}
              disabled={!currentPlaylist.songs || currentPlaylist.songs.length === 0}
              className="px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isCurrentPlaylistPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Play Playlist
                </>
              )}
            </button>

            <button
              onClick={handleDeletePlaylist}
              title="Delete Playlist"
              className="p-3 rounded-2xl bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        {currentPlaylist.songs?.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
              <ListMusic className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white">This playlist is empty</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Add songs from Home, Album pages, or Search by clicking the + button on any track.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 text-xs font-bold text-zinc-500 border-b border-zinc-800 pb-3 px-3 uppercase tracking-wider">
              <span className="col-span-1">#</span>
              <span className="col-span-7 md:col-span-8">Title</span>
              <span className="col-span-4 md:col-span-3 text-right flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="divide-y divide-zinc-900 mt-1">
              {currentPlaylist.songs?.map((song: Song, index: number) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <div
                    key={song._id}
                    onClick={() => playAlbum(currentPlaylist.songs, index)}
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

                    <div className="col-span-7 md:col-span-8 flex items-center gap-3 min-w-0 pr-2">
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

                    <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-3 text-right text-xs font-mono text-zinc-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSongFromPlaylist(currentPlaylist._id, song._id);
                        }}
                        title="Remove from playlist"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span>{formatDuration(song.duration)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
