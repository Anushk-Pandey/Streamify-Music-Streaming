import { create } from "zustand";
import type { Song, Album, Playlist, Stats } from "../types";
import { axiosInstance } from "../lib/axios";

interface MusicState {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  currentAlbum: Album | null;
  currentPlaylist: Playlist | null;
  stats: Stats | null;
  searchResults: Song[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  searchSongs: (query: string) => Promise<void>;
  createPlaylist: (title: string, description?: string) => Promise<Playlist | null>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<boolean>;
  deleteSong: (id: string) => Promise<boolean>;
  deleteAlbum: (id: string) => Promise<boolean>;
  createSong: (formData: FormData) => Promise<boolean>;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  songs: [],
  albums: [],
  playlists: [],
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  currentAlbum: null,
  currentPlaylist: null,
  stats: null,
  searchResults: [],
  isLoading: false,
  error: null,

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/songs");
      set({ songs: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    try {
      const res = await axiosInstance.get("/albums");
      set({ albums: res.data });
    } catch (err: any) {
      console.error("Failed to fetch albums:", err);
    }
  },

  fetchPlaylists: async () => {
    try {
      const res = await axiosInstance.get("/playlists/user");
      set({ playlists: res.data });
    } catch (err: any) {
      console.error("Failed to fetch playlists:", err);
    }
  },

  fetchFeaturedSongs: async () => {
    try {
      const res = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: res.data });
    } catch (err: any) {
      console.error("Failed to fetch featured songs:", err);
    }
  },

  fetchMadeForYouSongs: async () => {
    try {
      const res = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: res.data });
    } catch (err: any) {
      console.error("Failed to fetch made for you:", err);
    }
  },

  fetchTrendingSongs: async () => {
    try {
      const res = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: res.data });
    } catch (err: any) {
      console.error("Failed to fetch trending:", err);
    }
  },

  fetchAlbumById: async (id: string) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (id: string) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: res.data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await axiosInstance.get("/stats");
      set({ stats: res.data });
    } catch (err: any) {
      console.error("Failed to fetch stats:", err);
    }
  },

  searchSongs: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    try {
      const res = await axiosInstance.get(`/songs/search?q=${encodeURIComponent(query)}`);
      set({ searchResults: res.data });
    } catch (err: any) {
      console.error("Search failed:", err);
    }
  },

  createPlaylist: async (title: string, description: string = "") => {
    try {
      const res = await axiosInstance.post("/playlists", { title, description });
      const newPlaylist = res.data;
      set({ playlists: [newPlaylist, ...get().playlists] });
      return newPlaylist;
    } catch (err) {
      console.error("Failed to create playlist:", err);
      return null;
    }
  },

  addSongToPlaylist: async (playlistId: string, songId: string) => {
    try {
      const res = await axiosInstance.post("/playlists/add-song", { playlistId, songId });
      const updated = res.data;
      set({
        playlists: get().playlists.map((p) => (p._id === playlistId ? updated : p)),
        currentPlaylist: get().currentPlaylist?._id === playlistId ? updated : get().currentPlaylist,
      });
    } catch (err) {
      console.error("Failed to add song to playlist:", err);
    }
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    try {
      const res = await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
      const updated = res.data;
      set({
        playlists: get().playlists.map((p) => (p._id === playlistId ? updated : p)),
        currentPlaylist: get().currentPlaylist?._id === playlistId ? updated : get().currentPlaylist,
      });
    } catch (err) {
      console.error("Failed to remove song from playlist:", err);
    }
  },

  deletePlaylist: async (id: string) => {
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set({
        playlists: get().playlists.filter((p) => p._id !== id),
        currentPlaylist: get().currentPlaylist?._id === id ? null : get().currentPlaylist,
      });
      return true;
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      return false;
    }
  },

  deleteSong: async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set({
        songs: get().songs.filter((s) => s._id !== id),
        featuredSongs: get().featuredSongs.filter((s) => s._id !== id),
        trendingSongs: get().trendingSongs.filter((s) => s._id !== id),
      });
      return true;
    } catch (err) {
      console.error("Failed to delete song:", err);
      return false;
    }
  },

  deleteAlbum: async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set({
        albums: get().albums.filter((a) => a._id !== id),
      });
      return true;
    } catch (err) {
      console.error("Failed to delete album:", err);
      return false;
    }
  },

  createSong: async (formData: FormData) => {
    try {
      const res = await axiosInstance.post("/admin/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ songs: [res.data, ...get().songs] });
      return true;
    } catch (err) {
      console.error("Failed to upload song:", err);
      return false;
    }
  },
}));
