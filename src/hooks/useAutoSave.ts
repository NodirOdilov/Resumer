'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  type DraftRecord,
} from '@/lib/indexedDB';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseAutoSaveOptions<T> {
  data: T;
  saveFn: (data: T) => Promise<void>;
  /** Debounce delay in milliseconds. Default: 30 000 (30 seconds). */
  debounceMs?: number;
  /** Whether auto-save is enabled. Default: true. */
  enabled?: boolean;
  /**
   * Unique identifier for the document being edited.
   * Required so IndexedDB can store / retrieve drafts per-document.
   */
  documentId?: string | null;
  /**
   * Timestamp (epoch ms) of the last server-side save.
   * Used to decide whether a local IndexedDB draft is newer than the server
   * copy when the hook initialises.
   */
  serverUpdatedAt?: number | null;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSavedAt: Date | null;
  saveNow: () => Promise<void>;
  /**
   * If a newer local draft was discovered during initialisation, it is
   * exposed here so the calling component can prompt the user to restore it.
   */
  pendingLocalDraft: DraftRecord | null;
  /** Accept and clear the pending local draft. */
  acceptLocalDraft: () => void;
  /** Discard the pending local draft (deletes it from IndexedDB). */
  discardLocalDraft: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAutoSave<T>({
  data,
  saveFn,
  debounceMs = 30_000,
  enabled = true,
  documentId = null,
  serverUpdatedAt = null,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [pendingLocalDraft, setPendingLocalDraft] = useState<DraftRecord | null>(null);

  const dataRef = useRef(data);
  const saveFnRef = useRef(saveFn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const documentIdRef = useRef(documentId);

  // Keep refs fresh
  dataRef.current = data;
  saveFnRef.current = saveFn;
  documentIdRef.current = documentId;

  // ------------------------------------------------------------------
  // IndexedDB helpers (fire-and-forget; errors are swallowed)
  // ------------------------------------------------------------------

  const saveToIndexedDB = useCallback(async () => {
    const docId = documentIdRef.current;
    if (!docId) return;
    try {
      await saveDraft(docId, dataRef.current);
    } catch {
      // IndexedDB may be unavailable (e.g. private browsing) – ignore.
    }
  }, []);

  const syncIndexedDBToServer = useCallback(async () => {
    const docId = documentIdRef.current;
    if (!docId) return;

    let draft: DraftRecord | null = null;
    try {
      draft = await loadDraft(docId);
    } catch {
      return;
    }
    if (!draft) return;

    try {
      await saveFnRef.current(draft.data as T);
      await deleteDraft(docId);
    } catch {
      // Server is still unreachable – keep the local draft.
    }
  }, []);

  // ------------------------------------------------------------------
  // Core save logic
  // ------------------------------------------------------------------

  const performSave = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);

    try {
      await saveFnRef.current(dataRef.current);
      setLastSavedAt(new Date());

      // Server save succeeded – persist to IndexedDB as well and remove
      // any stale local-only draft.
      const docId = documentIdRef.current;
      if (docId) {
        try {
          await deleteDraft(docId);
        } catch {
          // non-critical
        }
      }
    } catch {
      // Network / API error – fall back to IndexedDB.
      await saveToIndexedDB();
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [saveToIndexedDB]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    await performSave();
  }, [performSave]);

  // ------------------------------------------------------------------
  // On init: check for a newer IndexedDB draft
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!documentId) return;
    let cancelled = false;

    (async () => {
      try {
        const draft = await loadDraft(documentId);
        if (cancelled || !draft) return;

        // If we have a server timestamp, only surface the draft if it is newer.
        if (serverUpdatedAt && draft.updatedAt <= serverUpdatedAt) {
          // Local draft is stale – clean it up silently.
          await deleteDraft(documentId);
          return;
        }

        setPendingLocalDraft(draft);
      } catch {
        // IndexedDB not available – nothing to do.
      }
    })();

    return () => {
      cancelled = true;
    };
    // Only run on mount / when documentId changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // ------------------------------------------------------------------
  // Accept / discard helpers for the pending local draft
  // ------------------------------------------------------------------

  const acceptLocalDraft = useCallback(() => {
    setPendingLocalDraft(null);
  }, []);

  const discardLocalDraft = useCallback(() => {
    const docId = documentIdRef.current;
    if (docId) {
      deleteDraft(docId).catch(() => {});
    }
    setPendingLocalDraft(null);
  }, []);

  // ------------------------------------------------------------------
  // Debounced auto-save when data changes
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    // Also persist to IndexedDB immediately so local copy is always fresh.
    saveToIndexedDB();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [data, debounceMs, enabled, performSave, saveToIndexedDB]);

  // ------------------------------------------------------------------
  // Save on visibility change & beforeunload
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        performSave();
      }
    }

    function handleBeforeUnload() {
      // Best-effort save to IndexedDB synchronously (API call is unreliable
      // in beforeunload). The async performSave is also attempted but may
      // not finish.
      saveToIndexedDB();
      performSave();
    }

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, performSave, saveToIndexedDB]);

  // ------------------------------------------------------------------
  // Re-sync when connectivity is restored
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    function handleOnline() {
      syncIndexedDBToServer();
    }

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [enabled, syncIndexedDBToServer]);

  // ------------------------------------------------------------------
  // Cleanup timer on unmount
  // ------------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSavedAt,
    saveNow,
    pendingLocalDraft,
    acceptLocalDraft,
    discardLocalDraft,
  };
}
