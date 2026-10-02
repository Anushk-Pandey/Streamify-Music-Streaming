import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import type { Song, User } from "../types";

export interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  sharedSong?: Song;
  createdAt: string;
}

interface ChatState {
  socket: Socket | null;
  onlineUsers: string[];
  messages: Message[];
  partySync: { hostName: string; song: Song } | null;
  initSocket: (user: User) => void;
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string, sharedSong?: Song) => void;
  syncPartyTrack: (song: Song) => void;
  clearPartySync: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  messages: [],
  partySync: null,

  initSocket: (user: User) => {
    if (get().socket) return;
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.MODE === "development" ? "http://localhost:5000" : window.location.origin);
    const socket = io(socketUrl, {
      query: { userId: user.clerkId, userName: user.fullName },
    });

    socket.on("get_online_users", (onlineUsers: string[]) => set({ onlineUsers }));
    socket.on("receive_message", (message: Message) => set({ messages: [...get().messages, message] }));
    socket.on("party_sync_received", (partySync) => set({ partySync }));

    set({ socket });
  },

  fetchMessages: async () => {
    try {
      const res = await axiosInstance.get("/users/messages/community");
      set({ messages: res.data });
    } catch (e) { }
  },

  sendMessage: (content: string, sharedSong?: Song) => {
    const { socket } = get();
    const stored = localStorage.getItem("streamify_user");
    let user = { clerkId: "guest", fullName: "Listener", imageUrl: "" };
    if (stored) try { user = JSON.parse(stored); } catch (e) { }

    const payload = {
      senderId: user.clerkId,
      senderName: user.fullName,
      senderAvatar: user.imageUrl,
      receiverId: "community",
      content,
      sharedSong,
    };

    if (socket?.connected) {
      socket.emit("send_message", payload);
    }
  },

  syncPartyTrack: (song: Song) => {
    const { socket } = get();
    const stored = localStorage.getItem("streamify_user");
    let hostName = "Friend";
    if (stored) try { hostName = JSON.parse(stored).fullName || hostName; } catch (e) { }
    if (socket?.connected) {
      socket.emit("party_sync_track", { song, hostName });
    }
  },

  clearPartySync: () => set({ partySync: null }),
}));
