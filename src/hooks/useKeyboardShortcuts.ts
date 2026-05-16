'use client';

import { useCallback, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KeyboardShortcutCallbacks {
  /** Triggered by Ctrl+S / Cmd+S */
  onSave?: () => void;
  /** Triggered by Ctrl+Z / Cmd+Z */
  onUndo?: () => void;
  /** Triggered by Ctrl+Shift+Z / Cmd+Shift+Z */
  onRedo?: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Registers global keyboard shortcuts for the resume builder.
 *
 * Shortcuts are only active while the component that calls this hook is
 * mounted.  All default browser behaviour for the registered key combos is
 * suppressed so that the builder actions take precedence.
 */
export function useKeyboardShortcuts(callbacks: KeyboardShortcutCallbacks): void {
  const { onSave, onUndo, onRedo } = callbacks;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;

      if (!isMeta) return;

      switch (event.key.toLowerCase()) {
        case 's': {
          event.preventDefault();
          onSave?.();
          break;
        }

        case 'z': {
          event.preventDefault();
          if (event.shiftKey) {
            onRedo?.();
          } else {
            onUndo?.();
          }
          break;
        }

        default:
          break;
      }
    },
    [onSave, onUndo, onRedo],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
