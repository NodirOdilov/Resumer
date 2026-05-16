/**
 * Mock API handlers — one function per logical resource. Each returns either
 * the response body (which gets wrapped into a 200 by the adapter) or a
 * `MockResponse` to set a non-200 status / different shape.
 */

import { dbAll, dbDelete, dbGet, dbPut, dbQuery, STORES } from "./db";
import { decodeDemoToken, makeDemoToken } from "./jwt";
import {
  DEMO_USERS,
  type DemoResume,
  type DemoUser,
} from "./seed-data";
import { generateAIContent, rewriteText } from "./ai-content";

const ACCESS_TTL = 60 * 60; // 1 hour
const REFRESH_TTL = 60 * 60 * 24 * 30; // 30 days

export class MockResponse {
  constructor(
    public status: number,
    public data: unknown,
  ) {}
}

// --------------------------------------------------------------------- helpers

function publicUser(u: DemoUser) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    fullName: `${u.firstName} ${u.lastName}`,
    isVerified: u.isVerified,
    isPremium: u.isPremium,
    createdAt: u.createdAt,
  };
}

function authTokensFor(u: DemoUser) {
  const access = makeDemoToken(
    { sub: u.id, email: u.email, name: `${u.firstName} ${u.lastName}` },
    ACCESS_TTL,
  );
  const refresh = makeDemoToken(
    { sub: u.id, email: u.email, name: `${u.firstName} ${u.lastName}` },
    REFRESH_TTL,
  );
  return {
    access,
    refresh,
    accessToken: access,
    refreshToken: refresh,
    user: publicUser(u),
  };
}

async function findUserByEmail(email: string): Promise<DemoUser | null> {
  const lc = email.toLowerCase();
  // Try DB first, fall back to seed list (in case IndexedDB unavailable).
  try {
    const dbUsers = await dbAll<DemoUser>(STORES.USERS);
    const found = dbUsers.find((u) => u.email.toLowerCase() === lc);
    if (found) return found;
  } catch {
    /* ignore */
  }
  return DEMO_USERS.find((u) => u.email.toLowerCase() === lc) ?? null;
}

function uidFromAuth(headers: Record<string, string>): string | null {
  const auth = headers["authorization"] || headers["Authorization"];
  if (!auth) return null;
  const match = /Bearer\s+(.+)/.exec(auth);
  if (!match) return null;
  const payload = decodeDemoToken(match[1]);
  return payload?.sub ?? null;
}

function storeForType(type: DemoResume["type"]) {
  switch (type) {
    case "cv":
      return STORES.CVS;
    case "cover_letter":
      return STORES.COVER_LETTERS;
    default:
      return STORES.RESUMES;
  }
}

// ------------------------------------------------------------------ AUTH

export async function login(body: {
  email?: string;
  password?: string;
}): Promise<unknown> {
  const user = await findUserByEmail(body.email || "");
  if (!user || user.password !== body.password) {
    return new MockResponse(401, {
      success: false,
      message: "Invalid credentials. Try demo@resumer.com / Demo2026!",
      code: "INVALID_CREDENTIALS",
    });
  }
  return authTokensFor(user);
}

export async function register(body: {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}): Promise<unknown> {
  const email = body.email || "";
  const password = body.password || "";
  if (!email || !password || password.length < 8) {
    return new MockResponse(400, {
      success: false,
      message: "Email and password (≥8 chars) are required.",
      code: "VALIDATION_ERROR",
    });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return new MockResponse(409, {
      success: false,
      message: "An account with that email already exists.",
      code: "EMAIL_TAKEN",
    });
  }

  const user: DemoUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    firstName: body.firstName || email.split("@")[0],
    lastName: body.lastName || "",
    isVerified: true, // skip verification for the demo
    isPremium: false,
    createdAt: new Date().toISOString(),
  };
  await dbPut(STORES.USERS, user);
  return authTokensFor(user);
}

export async function refreshTokens(body: { refresh?: string }): Promise<unknown> {
  const token = body.refresh || "";
  const payload = decodeDemoToken(token);
  if (!payload) {
    return new MockResponse(401, {
      success: false,
      message: "Invalid refresh token.",
      code: "INVALID_TOKEN",
    });
  }
  const user = await findUserByEmail(payload.email);
  if (!user) {
    return new MockResponse(401, {
      success: false,
      message: "Account no longer exists.",
      code: "USER_NOT_FOUND",
    });
  }
  return authTokensFor(user);
}

export async function getMe(headers: Record<string, string>): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) {
    return new MockResponse(401, {
      success: false,
      message: "Authentication required.",
      code: "UNAUTHENTICATED",
    });
  }
  const user = await dbGet<DemoUser>(STORES.USERS, uid);
  if (!user) {
    const seed = DEMO_USERS.find((u) => u.id === uid);
    if (seed) return publicUser(seed);
    return new MockResponse(404, {
      success: false,
      message: "User not found.",
      code: "USER_NOT_FOUND",
    });
  }
  return publicUser(user);
}

// ------------------------------------------------------------------ DOCUMENTS

export async function listDocuments(
  type: DemoResume["type"],
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const all = await dbQuery<DemoResume>(storeForType(type), (r) => r.userId === uid);
  return {
    count: all.length,
    next: null,
    previous: null,
    results: all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  };
}

export async function getDocument(
  type: DemoResume["type"],
  id: string,
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const doc = await dbGet<DemoResume>(storeForType(type), id);
  if (!doc || doc.userId !== uid) {
    return new MockResponse(404, { detail: "Not found." });
  }
  return doc;
}

export async function createDocument(
  type: DemoResume["type"],
  body: Partial<DemoResume>,
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const now = new Date().toISOString();
  const doc: DemoResume = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: uid,
    title: body.title || `Untitled ${type}`,
    type,
    templateId: body.templateId || "tpl-resume-1",
    templateSlug: body.templateSlug || "modern-professional",
    status: "draft",
    language: body.language || "en-us",
    content: body.content || {},
    settings: body.settings || {},
    createdAt: now,
    updatedAt: now,
  };
  await dbPut(storeForType(type), doc);
  return doc;
}

export async function updateDocument(
  type: DemoResume["type"],
  id: string,
  body: Partial<DemoResume>,
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const existing = await dbGet<DemoResume>(storeForType(type), id);
  if (!existing || existing.userId !== uid) {
    return new MockResponse(404, { detail: "Not found." });
  }
  const merged: DemoResume = {
    ...existing,
    ...body,
    id: existing.id,
    userId: existing.userId,
    type: existing.type,
    updatedAt: new Date().toISOString(),
  };
  await dbPut(storeForType(type), merged);
  return merged;
}

export async function deleteDocument(
  type: DemoResume["type"],
  id: string,
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const existing = await dbGet<DemoResume>(storeForType(type), id);
  if (!existing || existing.userId !== uid) {
    return new MockResponse(404, { detail: "Not found." });
  }
  await dbDelete(storeForType(type), id);
  return new MockResponse(204, null);
}

// ------------------------------------------------------------------ ACCOUNT

export async function updateProfile(
  body: Record<string, unknown>,
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const stored = await dbGet<DemoUser>(STORES.USERS, uid);
  const fallback = DEMO_USERS.find((u) => u.id === uid);
  const current = stored ?? fallback;
  if (!current) return new MockResponse(404, { detail: "Not found" });

  const updated: DemoUser = {
    ...current,
    firstName: typeof body.firstName === "string" ? body.firstName : current.firstName,
    lastName: typeof body.lastName === "string" ? body.lastName : current.lastName,
    email: typeof body.email === "string" ? body.email : current.email,
  };
  await dbPut(STORES.USERS, updated);
  return publicUser(updated);
}

export async function changePassword(
  body: Record<string, unknown>,
  headers: Record<string, string>,
): Promise<unknown> {
  const uid = uidFromAuth(headers);
  if (!uid) return new MockResponse(401, { detail: "Auth required" });
  const current = (body.currentPassword as string) || "";
  const next = (body.newPassword as string) || "";
  if (!next || next.length < 8) {
    return new MockResponse(400, {
      detail: "New password must be at least 8 characters.",
    });
  }
  const stored = await dbGet<DemoUser>(STORES.USERS, uid);
  const fallback = DEMO_USERS.find((u) => u.id === uid);
  const target = stored ?? fallback;
  if (!target) return new MockResponse(404, { detail: "Not found" });
  if (target.password !== current) {
    return new MockResponse(400, { detail: "Current password is incorrect." });
  }
  await dbPut(STORES.USERS, { ...target, password: next });
  return { success: true };
}

// ------------------------------------------------------------------ AI

export async function aiRewrite(body: { text?: string; section_type?: string }) {
  const text = (body.text || "").trim();
  const section = body.section_type || "summary";
  return {
    original_text: text,
    improved_text: rewriteText(text, section),
    section_type: section,
  };
}

export async function aiGenerate(body: {
  job_title?: string;
  section_type?: string;
}) {
  const sectionType = body.section_type || "summary";
  return {
    job_title: body.job_title || "",
    section_type: sectionType,
    generated_text: generateAIContent({
      sectionType,
      jobTitle: body.job_title || "professional",
    }),
  };
}

// ------------------------------------------------------------------ MISC

export async function pdfDownload(body: unknown): Promise<unknown> {
  // The real backend renders a PDF with WeasyPrint. In the demo, the frontend
  // calls window.print() instead, so this endpoint is a no-op success response
  // returned for any code path that still calls it.
  return {
    success: true,
    message: "PDF generation is handled client-side in demo mode.",
    body,
  };
}
