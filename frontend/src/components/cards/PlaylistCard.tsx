import React from "react";
import { Play, ListMusic } from "lucide-react";
import type { Playlist } from "../../types";
import { usePlayerStore } from "../../store/usePlayerStore";

interface PlaylistCardProps {
  playlist: Playlist;
  onSelect?: (id: string) => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect }) => {
  const { playAlbum } = usePlayerStore();

  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.songs && playlist.songs.length > 0) {
      playAlbum(playlist.songs, 0);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(playlist._id)}
      className="group relative p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-800 mb-3 shadow-lg">
        <img
          src={playlist.imageUrl}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          onClick={handlePlayPlaylist}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        </button>

        <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-zinc-300">
          <ListMusic className="w-3.5 h-3.5" />
        </div>
      </div>

      <h4 className="font-semibold text-sm text-white truncate">{playlist.title}</h4>
      <p className="text-xs text-zinc-400 truncate mt-0.5">
        By {playlist.userName || "Curator"}
      </p>
      <span className="text-[11px] text-zinc-500 mt-1">
        {playlist.songs?.length || 0} tracks
      </span>
    </div>
  );
};
