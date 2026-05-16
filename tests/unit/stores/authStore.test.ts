import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/authStore";
import { mockUser } from "../mocks/data";

// Mock the auth helpers
vi.mock("@/lib/auth", () => ({
  setTokens: vi.fn(),
  removeTokens: vi.fn(),
  getRefreshToken: vi.fn(() => null),
  refreshAccessToken: vi.fn(),
  getAccessToken: vi.fn(() => null),
}));

// Mock the api module
vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it("initial state is unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("setUser updates user", () => {
    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("setUser with null sets unauthenticated", () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("setTokens updates tokens", async () => {
    const { setTokens: storeTokensFn } = await import("@/lib/auth");

    useAuthStore.getState().setTokens("access-123", "refresh-456");

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe("access-123");
    expect(state.isAuthenticated).toBe(true);
    expect(storeTokensFn).toHaveBeenCalledWith("access-123", "refresh-456");
  });

  it("logout clears everything", async () => {
    const { removeTokens } = await import("@/lib/auth");

    // First set up an authenticated state
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setTokens("access-123", "refresh-456");

    // Then logout
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(removeTokens).toHaveBeenCalled();
  });

  it("persists to localStorage", () => {
    useAuthStore.getState().setTokens("access-persist", "refresh-persist");

    // Check that the store's persist mechanism wrote to localStorage
    const stored = localStorage.getItem("auth-storage");
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.accessToken).toBe("access-persist");
  });

  it("fetchCurrentUser sets user on success", async () => {
    const api = (await import("@/lib/api")).default;
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

    await useAuthStore.getState().fetchCurrentUser();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("fetchCurrentUser logs out on failure", async () => {
    const api = (await import("@/lib/api")).default;
    vi.mocked(api.get).mockRejectedValueOnce(new Error("Unauthorized"));

    // Set authenticated state first
    useAuthStore.setState({
      user: mockUser,
      accessToken: "token",
      isAuthenticated: true,
    });

    await useAuthStore.getState().fetchCurrentUser();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("refreshToken updates access token on success", async () => {
    const { getRefreshToken, refreshAccessToken } = await import(
      "@/lib/auth"
    );
    vi.mocked(getRefreshToken).mockReturnValue("valid-refresh");
    vi.mocked(refreshAccessToken).mockResolvedValueOnce("new-access-token");

    useAuthStore.setState({ accessToken: "old-token" });

    await useAuthStore.getState().refreshToken();

    expect(useAuthStore.getState().accessToken).toBe("new-access-token");
  });

  it("refreshToken logs out when no refresh token available", async () => {
    const { getRefreshToken } = await import("@/lib/auth");
    vi.mocked(getRefreshToken).mockReturnValue(null);

    useAuthStore.setState({
      user: mockUser,
      accessToken: "token",
      isAuthenticated: true,
    });

    await useAuthStore.getState().refreshToken();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
