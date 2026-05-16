import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

interface UiState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: Theme;
  previewZoom: number;
}

interface UiActions {
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: Theme) => void;
  setPreviewZoom: (zoom: number) => void;
}

export type UiStore = UiState & UiActions;

// ── Store ────────────────────────────────────────────────────────────────────

export const useUiStore = create<UiStore>()((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  theme: 'light',
  previewZoom: 100,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
    set({ theme });
  },

  setPreviewZoom: (zoom) =>
    set({ previewZoom: Math.max(25, Math.min(200, zoom)) }),
}));
