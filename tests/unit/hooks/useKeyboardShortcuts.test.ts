import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function fireKeyDown(key: string, modifiers: Partial<KeyboardEventInit> = {}) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  window.dispatchEvent(event);
}

describe("useKeyboardShortcuts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Ctrl+S triggers onSave", () => {
    const onSave = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onSave }));

    act(() => {
      fireKeyDown("s", { ctrlKey: true });
    });

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("Cmd+S triggers onSave (macOS)", () => {
    const onSave = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onSave }));

    act(() => {
      fireKeyDown("s", { metaKey: true });
    });

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("Ctrl+Z triggers onUndo", () => {
    const onUndo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onUndo }));

    act(() => {
      fireKeyDown("z", { ctrlKey: true });
    });

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("Ctrl+Shift+Z triggers onRedo", () => {
    const onRedo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onRedo }));

    act(() => {
      fireKeyDown("z", { ctrlKey: true, shiftKey: true });
    });

    expect(onRedo).toHaveBeenCalledTimes(1);
  });

  it("Ctrl+Shift+Z does not trigger onUndo", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onUndo, onRedo }));

    act(() => {
      fireKeyDown("z", { ctrlKey: true, shiftKey: true });
    });

    expect(onUndo).not.toHaveBeenCalled();
    expect(onRedo).toHaveBeenCalledTimes(1);
  });

  it("does not fire when meta/ctrl is not held", () => {
    const onSave = vi.fn();
    const onUndo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onSave, onUndo }));

    act(() => {
      fireKeyDown("s");
      fireKeyDown("z");
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(onUndo).not.toHaveBeenCalled();
  });

  it("does not fire for unregistered keys", () => {
    const onSave = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onSave }));

    act(() => {
      fireKeyDown("a", { ctrlKey: true });
      fireKeyDown("x", { ctrlKey: true });
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("unregisters event listener on unmount", () => {
    const onSave = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcuts({ onSave }));

    unmount();

    act(() => {
      fireKeyDown("s", { ctrlKey: true });
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("works with uppercase key (case-insensitive)", () => {
    const onSave = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onSave }));

    act(() => {
      fireKeyDown("S", { ctrlKey: true });
    });

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("handles missing callbacks gracefully", () => {
    // Should not throw when callbacks are undefined
    renderHook(() => useKeyboardShortcuts({}));

    expect(() => {
      act(() => {
        fireKeyDown("s", { ctrlKey: true });
        fireKeyDown("z", { ctrlKey: true });
        fireKeyDown("z", { ctrlKey: true, shiftKey: true });
      });
    }).not.toThrow();
  });
});
