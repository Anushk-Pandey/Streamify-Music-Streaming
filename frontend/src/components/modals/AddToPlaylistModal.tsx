import React, { useState } from "react";
import { X, Check, Plus, FolderPlus, ListMusic } from "lucide-react";
import type { Song } from "../../types";
import { useMusicStore } from "../../store/useMusicStore";

interface AddToPlaylistModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  song,
  isOpen,
  onClose,
}) => {
  const { playlists, addSongToPlaylist, createPlaylist } = useMusicStore();
  const [newTitle, setNewTitle] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [addedPlaylists, setAddedPlaylists] = useState<string[]>([]);

  if (!isOpen || !song) return null;

  const handleToggleAdd = async (playlistId: string) => {
    await addSongToPlaylist(playlistId, song._id);
    setAddedPlaylists((prev) => [...prev, playlistId]);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newPl = await createPlaylist(newTitle.trim());
    if (newPl) {
      await addSongToPlaylist(newPl._id, song._id);
      setAddedPlaylists((prev) => [...prev, newPl._id]);
      setNewTitle("");
      setShowNewInput(false);
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Add to Playlist</h3>
        <p className="text-xs text-zinc-400 mb-4 truncate">
          Select playlist for <span className="text-white font-medium">"{song.title}"</span>
        </p>

        <div className="max-h-60 overflow-y-auto space-y-2 mb-4 pr-1">
          {playlists.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">
              No playlists found. Create your first one below!
            </p>
          ) : (
            playlists.map((pl) => {
              const alreadyHasSong =
                pl.songs?.some((s) => s._id === song._id) || addedPlaylists.includes(pl._id);
              return (
                <button
                  key={pl._id}
                  onClick={() => !alreadyHasSong && handleToggleAdd(pl._id)}
                  disabled={alreadyHasSong}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    alreadyHasSong
                      ? "bg-zinc-800/40 border-zinc-800 text-zinc-500 cursor-default"
                      : "bg-zinc-800/70 hover:bg-zinc-800 border-zinc-700/60 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-700/60 flex items-center justify-center flex-shrink-0">
                      <ListMusic className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{pl.title}</p>
                      <p className="text-[11px] text-zinc-400">
                        {pl.songs?.length || 0} tracks
                      </p>
                    </div>
                  </div>
                  {alreadyHasSong ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <Check className="w-4 h-4" /> Added
                    </span>
                  ) : (
                    <Plus className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {showNewInput ? (
          <form onSubmit={handleCreateAndAdd} className="space-y-2">
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New playlist name..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all"
              >
                Create & Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewInput(false)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowNewInput(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-zinc-300 hover:text-emerald-400 flex items-center justify-center gap-2 text-xs font-medium transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            Create New Playlist
          </button>
        )}
      </div>
    </div>
  );
};
