import React, { useState } from "react";
import { Play, Pause, MoreVertical, Plus } from "lucide-react";
import type { Song } from "../../types";
import { usePlayerStore } from "../../store/usePlayerStore";
import { AddToPlaylistModal } from "../modals/AddToPlaylistModal";

interface SongCardProps {
  song: Song;
  allSongs?: Song[];
}

export const SongCard: React.FC<SongCardProps> = ({ song, allSongs = [] }) => {
  const { currentSong, isPlaying, playSong, togglePlay, playAlbum } = usePlayerStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const isCurrent = currentSong?._id === song._id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      if (allSongs.length > 0) {
        const idx = allSongs.findIndex((s) => s._id === song._id);
        playAlbum(allSongs, idx !== -1 ? idx : 0);
      } else {
        playSong(song);
      }
    }
  };

  return (
    <>
      <div className="group relative p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-300 flex flex-col cursor-pointer">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-800 mb-3 shadow-lg">
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayClick}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl transition-all duration-300 ${
              isCurrent && isPlaying
                ? "opacity-100 scale-100"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            }`}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Equalizer when actively playing */}
          {isCurrent && isPlaying && (
            <div className="absolute top-2.5 left-2.5 flex items-end gap-0.5 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md">
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <h4
              className={`font-semibold text-sm truncate ${
                isCurrent ? "text-emerald-400" : "text-white"
              }`}
            >
              {song.title}
            </h4>
            <p className="text-xs text-zinc-400 truncate mt-0.5">{song.artist}</p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            title="Add to Playlist"
            className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-700/50 transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {song.genre && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
              {song.genre}
            </span>
          </div>
        )}
      </div>

      <AddToPlaylistModal
        song={song}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};
