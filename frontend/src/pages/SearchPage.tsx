import React, { useState } from "react";
import { Search as SearchIcon, Music, Sparkles } from "lucide-react";
import { useMusicStore } from "../store/useMusicStore";
import { SongCard } from "../components/cards/SongCard";
import type { Song } from "../types";

const GENRES = ["All", "Synthwave", "Lo-Fi", "Electronic", "Ambient", "Indie Pop", "Hip-Hop", "Chillout"];

export const SearchPage: React.FC = () => {
  const { songs, searchResults, searchSongs } = useMusicStore();
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    searchSongs(val);
  };

  // Determine songs to show
  let displayedSongs: Song[] = query.trim() ? searchResults : songs;

  if (selectedGenre !== "All") {
    displayedSongs = displayedSongs.filter(
      (s: Song) => s.genre?.toLowerCase() === selectedGenre.toLowerCase()
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-32">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Explore & Search</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Search over tracks, artists, and ambient soundscapes
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by song name, artist, or genre..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-xl text-sm"
        />
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search Results / Catalog */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-emerald-400" />
            {query.trim()
              ? `Results for "${query}" (${displayedSongs.length})`
              : `${selectedGenre} Catalog (${displayedSongs.length})`}
          </h3>
        </div>

        {displayedSongs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white">No tracks found</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Try searching with another keyword like "synth", "lofi", or switch genre filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedSongs.map((song: Song) => (
              <SongCard key={song._id} song={song} allSongs={displayedSongs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
