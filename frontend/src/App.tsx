import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { AudioPlayer } from "./components/player/AudioPlayer";

import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { AlbumPage } from "./pages/AlbumPage";
import { PlaylistPage } from "./pages/PlaylistPage";
import { AdminPage } from "./pages/AdminPage";
import { ChatPage } from "./pages/ChatPage";

import { useMusicStore } from "./store/useMusicStore";
import { useAuthStore } from "./store/useAuthStore";
import { usePlayerStore } from "./store/usePlayerStore";
import { useChatStore } from "./store/useChatStore";

export function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    fetchSongs,
    fetchAlbums,
    fetchPlaylists,
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    songs,
  } = useMusicStore();

  const { user, checkAuth } = useAuthStore();
  const { initializeQueue, playSong } = usePlayerStore();
  const { initSocket, partySync, clearPartySync } = useChatStore();

  useEffect(() => {
    checkAuth();
    fetchSongs();
    fetchAlbums();
    fetchPlaylists();
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, []);

  useEffect(() => {
    if (songs.length > 0) initializeQueue(songs);
  }, [songs]);

  useEffect(() => {
    if (user) initSocket(user);
  }, [user]);

  const handleSelectAlbum = (id: string) => {
    setSelectedPlaylistId(null);
    setSelectedAlbumId(id);
    setCurrentTab("album");
  };

  const handleBackToHome = () => {
    setSelectedAlbumId(null);
    setSelectedPlaylistId(null);
    setCurrentTab("home");
  };

  const handleNavigateSearch = () => {
    setSelectedAlbumId(null);
    setSelectedPlaylistId(null);
    setCurrentTab("search");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-white font-sans">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-full transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setIsSidebarOpen(false);
          }}
          selectedPlaylistId={selectedPlaylistId}
          setSelectedPlaylistId={setSelectedPlaylistId}
          setSelectedAlbumId={setSelectedAlbumId}
        />
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateHome={handleBackToHome}
          onNavigateSearch={handleNavigateSearch}
        />

        {/* Live Party Sync Alert Toast */}
        {partySync && (
          <div className="mx-4 mt-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-400">
            <span>
              🎧 <strong>{partySync.hostName}</strong> is listening to <strong>"{partySync.song.title}"</strong>!
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playSong(partySync.song);
                  clearPartySync();
                }}
                className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded-lg"
              >
                Listen Along
              </button>
              <button onClick={clearPartySync} className="text-zinc-400 hover:text-white px-1">
                ✕
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-zinc-950">
          {currentTab === "home" && (
            <HomePage
              onSelectAlbum={handleSelectAlbum}
              onNavigateSearch={handleNavigateSearch}
            />
          )}

          {currentTab === "search" && <SearchPage />}

          {currentTab === "chat" && <ChatPage />}

          {currentTab === "album" && selectedAlbumId && (
            <AlbumPage albumId={selectedAlbumId} onBack={handleBackToHome} />
          )}

          {currentTab === "playlist" && selectedPlaylistId && (
            <PlaylistPage playlistId={selectedPlaylistId} onBack={handleBackToHome} />
          )}

          {currentTab === "admin" && <AdminPage />}
        </main>
      </div>

      {/* Persistent Audio Player */}
      <AudioPlayer />
    </div>
  );
}

export default App;
