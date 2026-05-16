import { create } from "zustand";
import { authApi, clearTokens, saveTokens, hasToken } from "@/api/client";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_premium?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  hydrate: async () => {
    try {
      const tokenExists = await hasToken();
      if (!tokenExists) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      const { data } = await authApi.me();
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      await clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    await saveTokens(data.access, data.refresh);
    const me = await authApi.me();
    set({ user: me.data, isAuthenticated: true });
  },

  register: async (email, password, name) => {
    await authApi.register(email, password, name);
    const { data } = await authApi.login(email, password);
    await saveTokens(data.access, data.refresh);
    const me = await authApi.me();
    set({ user: me.data, isAuthenticated: true });
  },

  logout: async () => {
    await clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
