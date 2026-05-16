import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebouncedValue } from "@/hooks/useDebounce";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("returns debounced value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "hello" } }
    );

    // Update value
    rerender({ value: "world" });

    // Before delay, still returns old value
    expect(result.current).toBe("hello");

    // Advance timer past delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now returns new value
    expect(result.current).toBe("world");
  });

  it("resets timer on value change", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "a" } }
    );

    // Change value after 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ value: "b" });

    // After another 300ms (600ms total), the timer was reset so should still be "a"
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("a");

    // After 500ms from last change, should update to "b"
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("b");
  });

  it("works with number values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 0 } }
    );

    rerender({ value: 42 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(42);
  });
});
