import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMediaQuery } from "@/hooks/useMediaQuery";

describe("useMediaQuery", () => {
  let listeners: Map<string, (event: MediaQueryListEvent) => void>;

  beforeEach(() => {
    listeners = new Map();

    vi.mocked(window.matchMedia).mockImplementation((query: string) => {
      const mql = {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(
          (_event: string, handler: (event: MediaQueryListEvent) => void) => {
            listeners.set(query, handler);
          }
        ),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
      return mql;
    });
  });

  it("returns false when query does not match", () => {
    const { result } = renderHook(() =>
      useMediaQuery("(min-width: 1024px)")
    );
    expect(result.current).toBe(false);
  });

  it("returns true when query matches", () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() =>
      useMediaQuery("(min-width: 1024px)")
    );
    expect(result.current).toBe(true);
  });

  it("updates when media query changes", () => {
    const { result } = renderHook(() =>
      useMediaQuery("(min-width: 768px)")
    );

    expect(result.current).toBe(false);

    // Simulate media query change
    const handler = listeners.get("(min-width: 768px)");
    if (handler) {
      act(() => {
        handler({ matches: true } as MediaQueryListEvent);
      });
    }

    expect(result.current).toBe(true);
  });
});
