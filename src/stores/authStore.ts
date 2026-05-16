import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";
import api from "@/lib/api";
import {
  setTokens as storeTokens,
  removeTokens,
  getRefreshToken,
  refreshAccessToken,
} from "@/lib/auth";

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

interface AuthResponse {
  access?: string;
  refresh?: string;
  accessToken?: string;
  refreshToken?: string;
  user: User;
}

export type AuthStore = AuthState & AuthActions;

// ── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
        }),

      setTokens: (accessToken, refreshToken) => {
        storeTokens(accessToken, refreshToken);
        set({ accessToken, isAuthenticated: true });
      },

      login: async (email, password) => {
        const { data } = await api.post<AuthResponse>("/auth/login/", {
          email,
          password,
        });
        const access = data.access ?? data.accessToken ?? "";
        const refresh = data.refresh ?? data.refreshToken ?? "";
        storeTokens(access, refresh);
        set({
          user: data.user,
          accessToken: access,
          isAuthenticated: true,
        });
      },

      register: async (payload) => {
        const { data } = await api.post<AuthResponse>("/auth/register/", payload);
        const access = data.access ?? data.accessToken ?? "";
        const refresh = data.refresh ?? data.refreshToken ?? "";
        storeTokens(access, refresh);
        set({
          user: data.user,
          accessToken: access,
          isAuthenticated: true,
        });
      },

      logout: () => {
        removeTokens();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        // Notify any subscribed listeners (e.g. the QueryClient cleanup in
        // the root layout) so caches and provider state can be cleared
        // even when logout() is called outside of useAuth().
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }
      },

      refreshToken: async () => {
        try {
          const token = getRefreshToken();
          if (!token) {
            get().logout();
            return;
          }

          const newAccessToken = await refreshAccessToken();
          set({ accessToken: newAccessToken });
        } catch {
          get().logout();
        }
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get<User>("/auth/me/");
          set({ user: data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ isLoading: false });
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      // Only run persistence in the browser. zustand's createJSONStorage is
      // lazy, but explicit no-op storage keeps SSR + tests safe.
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      // Only persist the access token; the rest is derived/refetched on mount.
      partialize: (state) =>
        ({ accessToken: state.accessToken }) as Partial<AuthStore>,
    },
  ),
);
