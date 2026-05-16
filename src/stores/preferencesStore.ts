import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Types ────────────────────────────────────────────────────────────────────

interface PreferencesState {
  language: string;
  region: string;
}

interface PreferencesActions {
  setLanguage: (language: string) => void;
  setRegion: (region: string) => void;
}

export type PreferencesStore = PreferencesState & PreferencesActions;

// ── Store ────────────────────────────────────────────────────────────────────

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      language: 'en-us',
      region: '',

      setLanguage: (language) => set({ language }),
      setRegion: (region) => set({ region }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
