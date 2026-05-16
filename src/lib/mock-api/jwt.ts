/**
 * Tiny JWT-like token implementation for the frontend-only demo.
 *
 * Real cryptographic signatures are not needed: the demo has no backend that
 * could be compromised. We only mimic the JWT shape so the existing decode
 * logic in `lib/auth.ts` (which calls `atob(token.split('.')[1])`) keeps
 * working unchanged.
 */

interface DemoJwtPayload {
  sub: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

function base64UrlEncode(input: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  let padded = input.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) padded += "=";
  if (typeof window === "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }
  return atob(padded);
}

export function makeDemoToken(payload: Omit<DemoJwtPayload, "iat" | "exp">, ttlSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: DemoJwtPayload = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(fullPayload));
  // The signature is a constant placeholder; we never validate it client-side.
  const signature = base64UrlEncode("demo-signature");
  return `${header}.${body}.${signature}`;
}

export function decodeDemoToken(token: string): DemoJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1])) as DemoJwtPayload;
  } catch {
    return null;
  }
}
