import React, { useState } from "react";
import {
  Home,
  Search,
  Plus,
  ShieldCheck,
  Disc,
  ListMusic,
  UserCheck,
  Radio,
} from "lucide-react";
import { useMusicStore } from "../../store/useMusicStore";
import { useAuthStore } from "../../store/useAuthStore";
import { CreatePlaylistModal } from "../modals/CreatePlaylistModal";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  setSelectedAlbumId: (id: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  selectedPlaylistId,
  setSelectedPlaylistId,
  setSelectedAlbumId,
}) => {
  const { playlists } = useMusicStore();
  const { user, isAdmin, loginAsDemoUser } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNav = (tab: string) => {
    setSelectedPlaylistId(null);
    setSelectedAlbumId(null);
    setCurrentTab(tab);
  };

  const handleSelectPlaylist = (id: string) => {
    setSelectedAlbumId(null);
    setSelectedPlaylistId(id);
    setCurrentTab("playlist");
  };

  return (
    <>
      <aside className="w-64 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col h-full flex-shrink-0 z-20">
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-zinc-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
            <Disc className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white">STREAMIFY</h1>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                MUSIC
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Audio Streaming</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          <button
            onClick={() => handleNav("home")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === "home" && !selectedPlaylistId
                ? "bg-zinc-800 text-emerald-400 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => handleNav("search")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === "search"
                ? "bg-zinc-800 text-emerald-400 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Search className="w-4 h-4" />
            Search & Explore
          </button>

          <button
            onClick={() => handleNav("chat")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === "chat"
                ? "bg-zinc-800 text-emerald-400 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Radio className="w-4 h-4" />
            Live Listening
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav("admin")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentTab === "admin"
                  ? "bg-zinc-800 text-emerald-400 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Playlists & Library Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col min-h-0 border-t border-zinc-800/80">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Your Playlists
            </span>
            <button
              onClick={() => setShowCreateModal(true)}
              title="Create Playlist"
              className="p-1 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto pr-1">
            {playlists.length === 0 ? (
              <p className="text-xs text-zinc-500 px-2 py-4">No playlists yet. Click + to create!</p>
            ) : (
              playlists.map((pl) => {
                const isSelected = selectedPlaylistId === pl._id;
                return (
                  <button
                    key={pl._id}
                    onClick={() => handleSelectPlaylist(pl._id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <ListMusic className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{pl.title}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* User Role Quick Switcher */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={
                user?.imageUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={user?.fullName || "User"}
              className="w-8 h-8 rounded-full object-cover border border-zinc-700"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.fullName || "Listener"}
              </p>
              <p className="text-[10px] text-zinc-400 capitalize flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-amber-400" : "bg-emerald-400"}`} />
                {user?.role || "Listener"} Mode
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 pt-1">
            <button
              onClick={() => loginAsDemoUser(isAdmin ? "user" : "admin")}
              className="w-full py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <UserCheck className="w-3 h-3 text-emerald-400" />
              Switch to {isAdmin ? "Listener" : "Admin"}
            </button>
          </div>
        </div>
      </aside>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(id) => handleSelectPlaylist(id)}
      />
    </>
  );
};
