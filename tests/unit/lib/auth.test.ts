import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  isAuthenticated,
  refreshAccessToken,
  getTokenExpirationDate,
  isTokenExpired,
} from "@/lib/auth";

// Mock axios for refreshAccessToken
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

import axios from "axios";

describe("auth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("stores and retrieves access token", () => {
    setTokens("my-access-token", "my-refresh-token");
    expect(getAccessToken()).toBe("my-access-token");
  });

  it("stores and retrieves refresh token", () => {
    setTokens("my-access-token", "my-refresh-token");
    expect(getRefreshToken()).toBe("my-refresh-token");
  });

  it("returns null when no token is stored", () => {
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("removes tokens on logout", () => {
    setTokens("access", "refresh");
    expect(getAccessToken()).toBe("access");

    removeTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("isAuthenticated returns true when access token exists", () => {
    setTokens("token", "refresh");
    expect(isAuthenticated()).toBe(true);
  });

  it("isAuthenticated returns false when no access token", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("refreshes access token", async () => {
    setTokens("old-access", "valid-refresh");

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresIn: 3600,
        tokenType: "Bearer",
      },
    });

    const newToken = await refreshAccessToken();

    expect(newToken).toBe("new-access-token");
    expect(getAccessToken()).toBe("new-access-token");
    expect(getRefreshToken()).toBe("new-refresh-token");
  });

  it("throws error when no refresh token available", async () => {
    // No tokens stored
    await expect(refreshAccessToken()).rejects.toThrow(
      "No refresh token available"
    );
  });

  it("removes tokens when refresh fails", async () => {
    setTokens("access", "refresh");

    vi.mocked(axios.post).mockRejectedValueOnce(new Error("Invalid token"));

    await expect(refreshAccessToken()).rejects.toThrow("Invalid token");
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("getTokenExpirationDate extracts exp from JWT", () => {
    // Create a JWT with exp claim (exp = 1700000000 => 2023-11-14T22:13:20.000Z)
    const payload = btoa(JSON.stringify({ sub: "user-1", exp: 1700000000 }));
    const token = `header.${payload}.signature`;

    const date = getTokenExpirationDate(token);
    expect(date).toBeInstanceOf(Date);
    expect(date!.getTime()).toBe(1700000000 * 1000);
  });

  it("getTokenExpirationDate returns null for invalid token", () => {
    expect(getTokenExpirationDate("invalid")).toBeNull();
  });

  it("isTokenExpired returns true for expired token", () => {
    // Token that expired in the past
    const payload = btoa(JSON.stringify({ exp: 1000000000 }));
    const token = `h.${payload}.s`;
    expect(isTokenExpired(token)).toBe(true);
  });

  it("isTokenExpired returns true for invalid token", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
  });
});
