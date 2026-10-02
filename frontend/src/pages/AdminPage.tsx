import React, { useEffect, useState } from "react";
import {
  Upload,
  Music,
  Disc3,
  Users,
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { useMusicStore } from "../store/useMusicStore";
import { formatPlayCount } from "../lib/utils";
import type { Song, Album } from "../types";

export const AdminPage: React.FC = () => {
  const {
    songs,
    albums,
    stats,
    fetchStats,
    fetchSongs,
    fetchAlbums,
    createSong,
    deleteSong,
  } = useMusicStore();

  const [activeTab, setActiveTab] = useState<"songs" | "upload" | "albums">("songs");

  // Upload Form State
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("Synthwave");
  const [duration, setDuration] = useState("180");
  const [audioUrl, setAudioUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchStats();
    fetchSongs();
    fetchAlbums();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("artist", artist.trim());
    formData.append("genre", genre);
    formData.append("duration", duration);
    formData.append("audioUrl", audioUrl.trim());
    formData.append("imageUrl", imageUrl.trim());
    if (selectedAlbumId) formData.append("albumId", selectedAlbumId);

    const success = await createSong(formData);
    setIsSubmitting(false);

    if (success) {
      setSuccessMsg(`Successfully uploaded "${title}"!`);
      setTitle("");
      setArtist("");
      setAudioUrl("");
      setImageUrl("");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchSongs();
      fetchStats();
    }
  };

  const handleDelete = async (id: string, songTitle: string) => {
    if (confirm(`Are you sure you want to delete "${songTitle}"?`)) {
      await deleteSong(id);
      fetchStats();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-32">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Curator & Admin Portal</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Platform Dashboard
        </h2>
        <p className="text-sm text-zinc-400">
          Manage tracks, view platform telemetry, and upload new music
        </p>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Tracks</span>
            <Music className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">
            {stats?.totalSongs ?? songs.length}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Live catalog</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Albums</span>
            <Disc3 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">
            {stats?.totalAlbums ?? albums.length}
          </p>
          <span className="text-[11px] text-cyan-400 mt-1 block">Curated sets</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Active Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">
            {stats?.totalUsers ?? 42}
          </p>
          <span className="text-[11px] text-indigo-400 mt-1 block">Clerk listeners</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Streams</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">
            {formatPlayCount(stats?.totalStreams ?? 210380)}
          </p>
          <span className="text-[11px] text-amber-400 mt-1 block">Audio plays</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("songs")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "songs"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Music className="w-4 h-4" />
          Manage Songs ({songs.length})
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "upload"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Track
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab: Song Management */}
      {activeTab === "songs" && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 text-xs font-bold text-zinc-500 border-b border-zinc-800 p-4 uppercase tracking-wider">
            <span className="col-span-5 md:col-span-4">Track Title</span>
            <span className="col-span-3 md:col-span-3">Artist</span>
            <span className="hidden md:block col-span-2">Genre</span>
            <span className="hidden md:block col-span-2 text-right">Streams</span>
            <span className="col-span-4 md:col-span-1 text-right">Actions</span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {songs.map((song: Song) => (
              <div
                key={song._id}
                className="grid grid-cols-12 items-center p-3.5 hover:bg-zinc-800/40 transition-colors text-sm"
              >
                <div className="col-span-5 md:col-span-4 flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{song.title}</p>
                    <p className="text-xs text-zinc-400 md:hidden">{song.artist}</p>
                  </div>
                </div>

                <div className="col-span-3 md:col-span-3 text-zinc-300 text-xs truncate">
                  {song.artist}
                </div>

                <div className="hidden md:block col-span-2">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-medium">
                    {song.genre || "Pop"}
                  </span>
                </div>

                <div className="hidden md:block col-span-2 text-right text-xs text-zinc-400 font-mono">
                  {formatPlayCount(song.plays || 0)}
                </div>

                <div className="col-span-4 md:col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(song._id, song.title)}
                    title="Delete track"
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Upload Track Form */}
      {activeTab === "upload" && (
        <div className="max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 shadow-xl">
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Track Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Neon Horizon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Artist <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. Solar Echoes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Synthwave">Synthwave</option>
                  <option value="Lo-Fi">Lo-Fi</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Ambient">Ambient</option>
                  <option value="Indie Pop">Indie Pop</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Chillout">Chillout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Duration (Seconds)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Album (Optional)
                </label>
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="">Single (No Album)</option>
                  {albums.map((a: Album) => (
                    <option key={a._id} value={a._id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Audio Stream URL (.mp3 / Cloudinary)
              </label>
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://... audio file URL (leave empty for sample audio)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Cover Image URL (Unsplash / Cloudinary)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... cover artwork URL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !artist.trim()}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? "Publishing Track..." : "Publish Track to Streamify"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
