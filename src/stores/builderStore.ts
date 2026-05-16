import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  DocumentType,
  DocumentTemplate,
  DocumentSettings,
  ResumeVersion,
} from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

export type BuilderStep = 1 | 2 | 3;

/** Maximum number of history entries retained for undo / redo. */
const MAX_HISTORY_LENGTH = 50;

interface BuilderState {
  documentType: DocumentType;
  documentId: string | null;
  activeStep: BuilderStep;
  activeSection: string;
  template: DocumentTemplate | null;
  content: Record<string, unknown>;
  settings: DocumentSettings;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  versions: ResumeVersion[];

  // History for undo / redo
  history: Record<string, unknown>[];
  historyIndex: number;
}

interface BuilderActions {
  setTemplate: (template: DocumentTemplate) => void;
  updateContent: (section: string, data: unknown) => void;
  updateSettings: (partial: Partial<DocumentSettings>) => void;
  setActiveSection: (section: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBuilder: () => void;
  markSaved: () => void;
  setDocumentId: (id: string | null) => void;
  setDocumentType: (type: DocumentType) => void;
  addVersion: (version: ResumeVersion) => void;
  setContent: (content: Record<string, unknown>) => void;
  setVersions: (versions: ResumeVersion[]) => void;
  setIsSaving: (saving: boolean) => void;

  // History actions
  pushHistory: (state: Record<string, unknown>) => void;
  undo: () => void;
  redo: () => void;
}

export type BuilderStore = BuilderState & BuilderActions;

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: DocumentSettings = {
  color: '#2563eb',
  font: 'Inter',
  fontSize: 14,
  lineSpacing: 1.5,
  margins: { top: 24, right: 24, bottom: 24, left: 24 },
};

const INITIAL_STATE: BuilderState = {
  documentType: 'resume',
  documentId: null,
  activeStep: 1,
  activeSection: 'contact',
  template: null,
  content: {},
  settings: DEFAULT_SETTINGS,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  versions: [],
  history: [],
  historyIndex: -1,
};

// ── Store ────────────────────────────────────────────────────────────────────

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setTemplate: (template) =>
        set({ template, isDirty: true }),

      updateContent: (section, data) =>
        set((state) => {
          const newContent = { ...state.content, [section]: data };

          // Push previous content onto history stack (truncate any "future" entries)
          const trimmedHistory = state.history.slice(
            0,
            state.historyIndex + 1,
          );
          const updatedHistory = [...trimmedHistory, state.content].slice(
            -MAX_HISTORY_LENGTH,
          );

          return {
            content: newContent,
            isDirty: true,
            history: updatedHistory,
            historyIndex: updatedHistory.length - 1,
          };
        }),

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
          isDirty: true,
        })),

      setActiveSection: (section) =>
        set({ activeSection: section }),

      nextStep: () =>
        set((state) => ({
          activeStep: Math.min(state.activeStep + 1, 3) as BuilderStep,
        })),

      prevStep: () =>
        set((state) => ({
          activeStep: Math.max(state.activeStep - 1, 1) as BuilderStep,
        })),

      resetBuilder: () => set(INITIAL_STATE),

      markSaved: () =>
        set({
          isDirty: false,
          isSaving: false,
          lastSavedAt: new Date(),
        }),

      setDocumentId: (id) =>
        set({ documentId: id }),

      setDocumentType: (type) =>
        set({ documentType: type }),

      addVersion: (version) =>
        set((state) => ({
          versions: [...state.versions, version],
        })),

      setContent: (content) =>
        set({ content }),

      setVersions: (versions) =>
        set({ versions }),

      setIsSaving: (saving) =>
        set({ isSaving: saving }),

      // ── History ──────────────────────────────────────────────────────────

      pushHistory: (snapshot) =>
        set((state) => {
          const trimmedHistory = state.history.slice(
            0,
            state.historyIndex + 1,
          );
          const updatedHistory = [...trimmedHistory, snapshot].slice(
            -MAX_HISTORY_LENGTH,
          );

          return {
            history: updatedHistory,
            historyIndex: updatedHistory.length - 1,
          };
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex < 0) return state;

          const previousContent = state.history[state.historyIndex];
          const newIndex = state.historyIndex - 1;

          // If we are at the tip, push the current content so redo can restore it
          let updatedHistory = state.history;
          if (state.historyIndex === state.history.length - 1) {
            updatedHistory = [...state.history, state.content].slice(
              -MAX_HISTORY_LENGTH,
            );
          }

          return {
            content: previousContent,
            isDirty: true,
            history: updatedHistory,
            historyIndex: newIndex,
          };
        }),

      redo: () =>
        set((state) => {
          const nextIndex = state.historyIndex + 1;
          if (nextIndex >= state.history.length) return state;

          const nextContent = state.history[nextIndex];

          return {
            content: nextContent,
            isDirty: true,
            historyIndex: nextIndex,
          };
        }),
    }),
    {
      name: 'builder-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        },
      ),
      partialize: (state) =>
        ({
          documentType: state.documentType,
          documentId: state.documentId,
          activeStep: state.activeStep,
          activeSection: state.activeSection,
          template: state.template,
          content: state.content,
          settings: state.settings,
          versions: state.versions,
          // Persist history so undo survives page refreshes within the session
          history: state.history,
          historyIndex: state.historyIndex,
        }) as Partial<BuilderStore>,
    },
  ),
);
