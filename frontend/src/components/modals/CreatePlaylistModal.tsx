import React, { useState } from "react";
import { X, Plus, Music } from "lucide-react";
import { useMusicStore } from "../../store/useMusicStore";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPlaylist } = useMusicStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const newPl = await createPlaylist(title.trim(), description.trim());
    setIsSubmitting(false);

    if (newPl) {
      setTitle("");
      setDescription("");
      onClose();
      if (onCreated) onCreated(newPl._id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create New Playlist</h2>
            <p className="text-xs text-zinc-400">Curate your own sound experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Playlist Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late Night Synthwave"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a vibe or backstory..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
