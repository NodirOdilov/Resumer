import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAutoSave } from "@/hooks/useAutoSave";

describe("useAutoSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces save calls", () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);

    const { rerender } = renderHook(
      ({ data }) =>
        useAutoSave({ data, saveFn, debounceMs: 1000 }),
      { initialProps: { data: { name: "John" } } }
    );

    // Change data quickly
    rerender({ data: { name: "Jane" } });
    rerender({ data: { name: "Jake" } });

    // Save should not have been called yet
    expect(saveFn).not.toHaveBeenCalled();

    // Advance timer past debounce delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(saveFn).toHaveBeenCalledTimes(1);
  });

  it("saves on data change after debounce delay", () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useAutoSave({ data: { count: 1 }, saveFn, debounceMs: 500 })
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(saveFn).toHaveBeenCalledTimes(1);
  });

  it("reports saving state", async () => {
    let resolveSave: () => void;
    const saveFn = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        })
    );

    const { result } = renderHook(() =>
      useAutoSave({ data: "test", saveFn, debounceMs: 100 })
    );

    expect(result.current.isSaving).toBe(false);

    // Trigger the debounced save
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.isSaving).toBe(true);

    // Resolve the save
    await act(async () => {
      resolveSave!();
    });

    expect(result.current.isSaving).toBe(false);
    expect(result.current.lastSavedAt).toBeInstanceOf(Date);
  });

  it("saveNow triggers immediate save", async () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useAutoSave({ data: "test", saveFn, debounceMs: 30000 })
    );

    await act(async () => {
      await result.current.saveNow();
    });

    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(result.current.lastSavedAt).toBeInstanceOf(Date);
  });

  it("does not save when disabled", () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useAutoSave({ data: "test", saveFn, debounceMs: 100, enabled: false })
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(saveFn).not.toHaveBeenCalled();
  });
});
