/**
 * Custom axios adapter that routes every API call to an in-browser handler
 * instead of hitting the network. Activated when NEXT_PUBLIC_DEMO_MODE=true.
 *
 * Why a custom adapter (rather than axios-mock-adapter)?
 *  - No new npm dependency.
 *  - Works identically in dev and production builds — MSW dev/prod parity is
 *    fragile when shipping to Vercel.
 *  - Lets us add realistic latency per route ("AI" endpoints feel like AI).
 */

import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { seedDemoDataOnce } from "./seed";
import {
  MockResponse,
  aiGenerate,
  aiRewrite,
  changePassword,
  createDocument,
  deleteDocument,
  getDocument,
  getMe,
  listDocuments,
  login,
  pdfDownload,
  refreshTokens,
  register,
  updateDocument,
  updateProfile,
} from "./handlers";

interface RouteContext {
  params: Record<string, string>;
  body: Record<string, unknown>;
  headers: Record<string, string>;
  query: URLSearchParams;
}

type RouteHandler = (
  ctx: RouteContext,
) => Promise<unknown> | unknown;

interface RouteDef {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
  /** Artificial latency in ms to make the response feel real. */
  latencyMs?: number;
}

function compile(method: string, path: string, handler: RouteHandler, latencyMs?: number): RouteDef {
  const paramNames: string[] = [];
  // Express-style: turn `/foo/:id/bar` into a regex with named captures.
  const regex = path
    .replace(/\/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return "/([^/]+)";
    })
    .replace(/\//g, "\\/");
  return {
    method: method.toUpperCase(),
    pattern: new RegExp(`^${regex}/?$`),
    paramNames,
    handler,
    latencyMs,
  };
}

// ------------------------------------------------------------- route table
//
// Paths are matched against the request URL with the API_BASE_URL prefix
// stripped (so handlers don't care whether it's `/auth/login/` or
// `https://api.example.com/api/v1/auth/login/`).

const ROUTES: RouteDef[] = [
  // Auth
  compile("post", "/auth/login/", ({ body }) => login(body), 250),
  compile("post", "/auth/register/", ({ body }) => register(body), 350),
  compile("post", "/auth/token/refresh/", ({ body }) => refreshTokens(body), 100),
  compile("post", "/auth/logout/", () => ({ success: true }), 100),
  compile("post", "/auth/password/reset/", () => ({
    success: true,
    message: "If that account exists, a reset link has been sent.",
  }), 300),
  compile("post", "/auth/password/reset/confirm/", () => ({ success: true }), 200),
  compile("post", "/auth/email/verify/", () => ({ success: true }), 100),
  compile("get", "/auth/me/", ({ headers }) => getMe(headers)),
  compile("get", "/users/me/", ({ headers }) => getMe(headers)),
  compile("get", "/profile/me/", ({ headers }) => getMe(headers)),

  // Resumes
  compile("get", "/resumes/", ({ headers }) => listDocuments("resume", headers)),
  compile("post", "/resumes/", ({ body, headers }) =>
    createDocument("resume", body, headers),
  ),
  compile("get", "/resumes/:id/", ({ params, headers }) =>
    getDocument("resume", params.id, headers),
  ),
  compile("patch", "/resumes/:id/", ({ params, body, headers }) =>
    updateDocument("resume", params.id, body, headers),
  ),
  compile("put", "/resumes/:id/", ({ params, body, headers }) =>
    updateDocument("resume", params.id, body, headers),
  ),
  compile("delete", "/resumes/:id/", ({ params, headers }) =>
    deleteDocument("resume", params.id, headers),
  ),
  compile("post", "/resumes/:id/download/", ({ body }) => pdfDownload(body)),
  // The builder hook fetches via GET; mirror it so both calling conventions
  // work without a network round-trip in demo mode.
  compile("get", "/resumes/:id/download/", ({ query }) =>
    pdfDownload({ format: query.get("format") }),
  ),
  compile("get", "/cvs/:id/download/", ({ query }) =>
    pdfDownload({ format: query.get("format") }),
  ),
  compile("get", "/cover-letters/:id/download/", ({ query }) =>
    pdfDownload({ format: query.get("format") }),
  ),
  compile("post", "/resumes/:id/duplicate/", async ({ params, headers }) => {
    const doc = await getDocument("resume", params.id, headers);
    if (doc instanceof MockResponse) return doc;
    return createDocument(
      "resume",
      {
        ...(doc as Record<string, unknown>),
        title: `${(doc as { title: string }).title} (Copy)`,
      } as never,
      headers,
    );
  }),

  // CVs
  compile("get", "/cvs/", ({ headers }) => listDocuments("cv", headers)),
  compile("post", "/cvs/", ({ body, headers }) =>
    createDocument("cv", body, headers),
  ),
  compile("get", "/cvs/:id/", ({ params, headers }) =>
    getDocument("cv", params.id, headers),
  ),
  compile("patch", "/cvs/:id/", ({ params, body, headers }) =>
    updateDocument("cv", params.id, body, headers),
  ),
  compile("delete", "/cvs/:id/", ({ params, headers }) =>
    deleteDocument("cv", params.id, headers),
  ),

  // Cover letters
  compile("get", "/cover-letters/", ({ headers }) =>
    listDocuments("cover_letter", headers),
  ),
  compile("post", "/cover-letters/", ({ body, headers }) =>
    createDocument("cover_letter", body, headers),
  ),
  compile("get", "/cover-letters/:id/", ({ params, headers }) =>
    getDocument("cover_letter", params.id, headers),
  ),
  compile("patch", "/cover-letters/:id/", ({ params, body, headers }) =>
    updateDocument("cover_letter", params.id, body, headers),
  ),
  compile("delete", "/cover-letters/:id/", ({ params, headers }) =>
    deleteDocument("cover_letter", params.id, headers),
  ),

  // AI — make it feel like AI by adding latency
  compile("post", "/builder/ai/rewrite/", ({ body }) => aiRewrite(body), 1200),
  compile("post", "/builder/ai/generate/", ({ body }) => aiGenerate(body), 1500),
  compile("post", "/suggestions/rewrite/", ({ body }) => aiRewrite(body), 1200),
  compile("post", "/suggestions/generate/", ({ body }) => aiGenerate(body), 1500),

  // Static / catalog endpoints — empty paginated result is fine, the UI
  // already loads templates/examples/articles from local data files.
  compile("get", "/templates/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/examples/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/content/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/content/articles/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/categories/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/reviews/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/notifications/", () => ({ count: 0, next: null, previous: null, results: [] })),
  compile("get", "/payments/subscription/", () => ({
    status: "trialing",
    plan: "trial",
    trial_end: new Date(Date.now() + 14 * 86400e3).toISOString(),
    current_period_end: new Date(Date.now() + 14 * 86400e3).toISOString(),
  })),

  // Suggestion catalog (autocomplete) — handled via static data at the call
  // site, but we still answer politely if anything calls it.
  compile("get", "/suggestions/job-titles/", () => ({ query: "", titles: [] })),
  compile("get", "/suggestions/skills/", () => ({ job_title: "", skills: [] })),
  compile("get", "/suggestions/companies/", () => ({ query: "", companies: [] })),

  // Account self-service endpoints (called via fetch() from a few pages)
  compile("patch", "/auth/profile/", ({ body, headers }) =>
    updateProfile(body, headers),
  ),
  compile("post", "/auth/change-password/", ({ body, headers }) =>
    changePassword(body, headers),
  ),
  compile("post", "/contact/", () => ({
    success: true,
    message: "Thanks — we'll get back to you within one business day.",
  })),
];

// ------------------------------------------------------------- the adapter

function stripBasePrefix(url: string): string {
  // Accept both relative ("/auth/login/") and absolute URLs.
  let path = url;
  try {
    if (/^https?:\/\//.test(url)) {
      path = new URL(url).pathname;
    }
  } catch {
    // Fall through and use the raw URL.
  }
  // Strip "/api/v1" if present.
  return path.replace(/^\/api\/v1/, "");
}

function parseBody(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof data === "object") return data as Record<string, unknown>;
  return {};
}

function flattenHeaders(h: unknown): Record<string, string> {
  if (!h || typeof h !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
    else if (typeof v === "number" || typeof v === "boolean") out[k] = String(v);
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  // Make sure the demo data is loaded before any request resolves.
  await seedDemoDataOnce();

  const method = (config.method || "get").toUpperCase();
  const fullUrl = (config.baseURL || "") + (config.url || "");
  const stripped = stripBasePrefix(fullUrl);
  const [path, queryString = ""] = stripped.split("?");
  const query = new URLSearchParams(queryString);
  const headers = flattenHeaders(config.headers);
  const body = parseBody(config.data);

  for (const route of ROUTES) {
    if (route.method !== method) continue;
    const m = route.pattern.exec(path);
    if (!m) continue;

    const params: Record<string, string> = {};
    route.paramNames.forEach((name, idx) => {
      params[name] = decodeURIComponent(m[idx + 1] || "");
    });

    if (route.latencyMs) await sleep(route.latencyMs);

    let result: unknown;
    try {
      result = await route.handler({ params, body, headers, query });
    } catch (err) {
      const response: AxiosResponse = {
        data: {
          success: false,
          message: (err as Error).message || "Internal demo-mode error",
          code: "DEMO_ERROR",
        },
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config,
      };
      return Promise.reject({ ...new Error("Demo error"), response, config });
    }

    if (result instanceof MockResponse) {
      const response: AxiosResponse = {
        data: result.data,
        status: result.status,
        statusText: result.status === 204 ? "No Content" : "OK",
        headers: {},
        config,
      };
      if (result.status >= 400) {
        return Promise.reject({
          ...new Error(`Demo HTTP ${result.status}`),
          response,
          config,
        });
      }
      return response;
    }

    return {
      data: result,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }

  // No route matched — return an empty 200 to avoid blocking the UI on
  // tertiary endpoints we forgot to mock.
  // eslint-disable-next-line no-console
  console.warn(`[mock-api] Unhandled ${method} ${path} → returning empty 200`);
  return {
    data: { results: [], count: 0, next: null, previous: null },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
};

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
