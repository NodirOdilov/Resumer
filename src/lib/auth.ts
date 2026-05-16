import axios from "axios";
import { API_BASE_URL } from "./constants";
import { isDemoMode, mockAdapter } from "./mock-api/adapter";
import type { AuthTokens } from "@/types/api";

const ACCESS_TOKEN_KEY = "resumer_access_token";
const REFRESH_TOKEN_KEY = "resumer_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    console.error("Failed to store auth tokens");
  }
}

export function removeTokens(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    console.error("Failed to remove auth tokens");
  }
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    removeTokens();
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post<AuthTokens & { access?: string; refresh?: string }>(
      `${API_BASE_URL}/auth/token/refresh/`,
      { refresh: refreshToken },
      isDemoMode() ? { adapter: mockAdapter } : undefined,
    );

    // The real backend returns { access, refresh }; the mock returns both
    // shapes for compatibility. Accept whichever is present.
    const access = response.data.accessToken ?? response.data.access ?? "";
    const refresh = response.data.refreshToken ?? response.data.refresh ?? refreshToken;

    if (!access) throw new Error("No access token in refresh response");

    setTokens(access, refresh);
    return access;
  } catch (error) {
    removeTokens();
    throw error;
  }
}

export function getTokenExpirationDate(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    return null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expirationDate = getTokenExpirationDate(token);
  if (!expirationDate) return true;
  const bufferMs = 60 * 1000;
  return expirationDate.getTime() - bufferMs < Date.now();
}
