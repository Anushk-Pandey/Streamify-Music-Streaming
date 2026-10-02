import { create } from "zustand";
import type { Song } from "../types";
import { axiosInstance } from "../lib/axios";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: boolean;

  // Actions
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 0.75,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isShuffle: false,
  isRepeat: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0] || null,
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex: number = 0) => {
    if (!songs.length) return;
    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
      currentTime: 0,
    });

    if (song?._id) {
      axiosInstance.post(`/songs/${song._id}/play`).catch(() => {});
    }
  },

  playSong: (song: Song) => {
    const { queue } = get();
    const existingIndex = queue.findIndex((s) => s._id === song._id);
    let newQueue = [...queue];
    let newIndex = existingIndex;

    if (existingIndex === -1) {
      newQueue = [song, ...queue];
      newIndex = 0;
    }

    set({
      currentSong: song,
      queue: newQueue,
      currentIndex: newIndex,
      isPlaying: true,
      currentTime: 0,
    });

    if (song?._id) {
      axiosInstance.post(`/songs/${song._id}/play`).catch(() => {});
    }
  },

  togglePlay: () => {
    const { isPlaying, currentSong, queue } = get();
    if (!currentSong && queue.length > 0) {
      set({ currentSong: queue[0], currentIndex: 0, isPlaying: true });
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  playNext: () => {
    const { queue, currentIndex, isShuffle, isRepeat, currentSong } = get();
    if (queue.length === 0) return;

    if (isRepeat && currentSong) {
      set({ currentTime: 0, isPlaying: true });
      return;
    }

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) nextIndex = 0; // loop queue
    }

    const nextSong = queue[nextIndex];
    set({
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true,
      currentTime: 0,
    });

    if (nextSong?._id) {
      axiosInstance.post(`/songs/${nextSong._id}/play`).catch(() => {});
    }
  },

  playPrevious: () => {
    const { queue, currentIndex, currentTime } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart the current song
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;

    const prevSong = queue[prevIndex];
    set({
      currentSong: prevSong,
      currentIndex: prevIndex,
      isPlaying: true,
      currentTime: 0,
    });
  },

  setVolume: (volume: number) => {
    set({ volume, isMuted: volume === 0 });
  },

  toggleMute: () => {
    set({ isMuted: !get().isMuted });
  },

  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDuration: (duration: number) => set({ duration }),
  toggleShuffle: () => set({ isShuffle: !get().isShuffle }),
  toggleRepeat: () => set({ isRepeat: !get().isRepeat }),
}));
