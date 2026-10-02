import { create } from "zustand";
import type { User } from "../types";
import { axiosInstance } from "../lib/axios";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  loginAsDemoUser: (role: "admin" | "user") => void;
  logout: () => void;
}

const DEFAULT_DEMO_USER: User = {
  clerkId: "demo_curator_101",
  fullName: "Alex Rivera",
  email: "alex@streamify.io",
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "admin",
};

export const useAuthStore = create<AuthState>((set) => {
  // Check local storage for persisted user
  let initialUser: User = DEFAULT_DEMO_USER;
  const stored = localStorage.getItem("streamify_user");
  if (stored) {
    try {
      initialUser = JSON.parse(stored);
    } catch (e) {}
  } else {
    localStorage.setItem("streamify_user", JSON.stringify(DEFAULT_DEMO_USER));
  }

  return {
    user: initialUser,
    isAdmin: initialUser?.role === "admin",
    isLoading: false,

    setUser: (user: User | null) => {
      if (user) {
        localStorage.setItem("streamify_user", JSON.stringify(user));
        set({ user, isAdmin: user.role === "admin" });
        // Sync with backend
        axiosInstance.post("/auth/callback", {
          id: user.clerkId,
          firstName: user.fullName.split(" ")[0],
          lastName: user.fullName.split(" ").slice(1).join(" "),
          imageUrl: user.imageUrl,
          email: user.email,
        }).catch(() => {});
      } else {
        localStorage.removeItem("streamify_user");
        set({ user: null, isAdmin: false });
      }
    },

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        if (res.data) {
          set({
            user: res.data,
            isAdmin: res.data.role === "admin",
          });
        }
      } catch (e) {}
    },

    loginAsDemoUser: (role: "admin" | "user") => {
      const demo: User = {
        clerkId: role === "admin" ? "admin_curator_01" : "listener_guest_02",
        fullName: role === "admin" ? "David Miller (Admin)" : "Elena Rostova (Listener)",
        email: role === "admin" ? "admin@streamify.com" : "elena@streamify.io",
        imageUrl:
          role === "admin"
            ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        role,
      };
      localStorage.setItem("streamify_user", JSON.stringify(demo));
      set({ user: demo, isAdmin: role === "admin" });
    },

    logout: () => {
      localStorage.removeItem("streamify_user");
      set({ user: null, isAdmin: false });
    },
  };
});
