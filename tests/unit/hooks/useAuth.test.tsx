import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the api module
vi.mock("@/lib/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  getAccessToken: vi.fn(() => null),
  getRefreshToken: vi.fn(() => null),
  setTokens: vi.fn(),
  removeTokens: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { mockUser, mockTokens } from "../mocks/data";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset zustand store
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("login sets user and tokens", async () => {
    const mockResponse = {
      data: {
        user: mockUser,
        access: mockTokens.accessToken,
        refresh: mockTokens.refreshToken,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login("john@example.com", "Password123!");
    });

    await waitFor(() => {
      const store = useAuthStore.getState();
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });
  });

  it("logout clears state", async () => {
    // Set initial authenticated state
    useAuthStore.setState({
      user: mockUser,
      accessToken: mockTokens.accessToken,
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.logout();
    });

    const store = useAuthStore.getState();
    expect(store.user).toBeNull();
    expect(store.accessToken).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("register creates user", async () => {
    const mockResponse = {
      data: {
        user: { ...mockUser, email: "new@example.com" },
        access: mockTokens.accessToken,
        refresh: mockTokens.refreshToken,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.register({
        email: "new@example.com",
        password: "StrongPass1!",
        first_name: "New",
        last_name: "User",
      });
    });

    await waitFor(() => {
      const store = useAuthStore.getState();
      expect(store.user?.email).toBe("new@example.com");
      expect(store.isAuthenticated).toBe(true);
    });
  });

  it("refreshToken updates access token", async () => {
    const { refreshAccessToken } = await import("@/lib/auth");

    useAuthStore.setState({
      user: mockUser,
      accessToken: "old-token",
      isAuthenticated: true,
    });

    vi.mocked(refreshAccessToken).mockResolvedValueOnce("new-access-token");
    const { getRefreshToken } = await import("@/lib/auth");
    vi.mocked(getRefreshToken).mockReturnValue("valid-refresh-token");

    const store = useAuthStore.getState();
    await store.refreshToken();

    expect(useAuthStore.getState().accessToken).toBe("new-access-token");
  });

  it("initial state shows unauthenticated", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("login mutation exposes error on failure", async () => {
    vi.mocked(api.post).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.login("wrong@example.com", "badpass");
      } catch {
        // expected
      }
    });

    expect(result.current.loginMutation.isError).toBe(true);
  });
});
