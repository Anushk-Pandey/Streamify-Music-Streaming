import React from "react";
import { Play, Sparkles, Flame, Disc3, Search } from "lucide-react";
import { useMusicStore } from "../store/useMusicStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { SongCard } from "../components/cards/SongCard";
import { AlbumCard } from "../components/cards/AlbumCard";
import type { Song, Album } from "../types";

interface HomePageProps {
  onSelectAlbum: (id: string) => void;
  onNavigateSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectAlbum, onNavigateSearch }) => {
  const { songs, albums, featuredSongs, madeForYouSongs, trendingSongs } = useMusicStore();
  const { playSong, currentSong, isPlaying } = usePlayerStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const topSongs = featuredSongs.length > 0 ? featuredSongs.slice(0, 6) : songs.slice(0, 6);

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto pb-32">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-10 border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Fidelity Audio Streaming</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {getGreeting()}, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-emerald-400">
              Ready to explore sound?
            </span>
          </h2>

          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            Stream studio-grade audio, explore curated albums, and craft your own custom playlists anytime.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => topSongs[0] && playSong(topSongs[0])}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Featured Track
            </button>

            <button
              onClick={onNavigateSearch}
              className="px-5 py-3 rounded-2xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Explore Music Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Quick Play Grid */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4">Quick Picks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topSongs.map((song: Song) => {
            const isCurrent = currentSong?._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => playSong(song)}
                className="group relative flex items-center gap-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700/80 rounded-2xl p-2.5 cursor-pointer transition-all duration-300 shadow-sm"
              >
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isCurrent ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{song.artist}</p>
                </div>
                <div
                  className={`w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center flex-shrink-0 mr-1 shadow-lg transition-all ${
                    isCurrent && isPlaying
                      ? "opacity-100 scale-100"
                      : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                  }`}
                >
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Made For You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Made For You</h3>
            <p className="text-xs text-zinc-400">Curated rhythms for flow and focus</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(madeForYouSongs.length > 0 ? madeForYouSongs : songs.slice(0, 4)).map((song: Song) => (
            <SongCard key={song._id} song={song} allSongs={songs} />
          ))}
        </div>
      </section>

      {/* Popular Albums */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-emerald-400" />
              Featured Albums
            </h3>
            <p className="text-xs text-zinc-400">Explore complete album records</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {albums.map((album: Album) => (
            <AlbumCard key={album._id} album={album} onSelect={onSelectAlbum} />
          ))}
        </div>
      </section>

      {/* Trending Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Trending Worldwide
            </h3>
            <p className="text-xs text-zinc-400">Most streamed songs this week</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(trendingSongs.length > 0 ? trendingSongs : songs.slice(4, 8)).map((song: Song) => (
            <SongCard key={song._id} song={song} allSongs={songs} />
          ))}
        </div>
      </section>
    </div>
  );
};
