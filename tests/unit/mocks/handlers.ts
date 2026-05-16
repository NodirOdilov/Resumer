import { http, HttpResponse } from "msw";
import {
  mockUser,
  mockTokens,
  mockResume,
  mockResumeListItem,
  mockTemplate,
  mockPremiumTemplate,
  mockArticle,
  mockExample,
  makePaginatedResponse,
  makeApiResponse,
} from "./data";

const BASE_URL = "http://localhost:8000/api/v1";

export const handlers = [
  // ── Auth ────────────────────────────────────────────────────────────────

  http.post(`${BASE_URL}/auth/login/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    if (body.email === "wrong@example.com") {
      return HttpResponse.json(
        {
          success: false,
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
          statusCode: 401,
          errors: [],
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      ...makeApiResponse({
        user: mockUser,
        ...mockTokens,
      }),
    });
  }),

  http.post(`${BASE_URL}/auth/register/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json(
      makeApiResponse({
        user: {
          ...mockUser,
          email: body.email,
          firstName: body.first_name || body.firstName || "New",
          lastName: body.last_name || body.lastName || "User",
        },
        ...mockTokens,
      }),
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/auth/me/`, () => {
    return HttpResponse.json(makeApiResponse(mockUser));
  }),

  http.post(`${BASE_URL}/auth/token/refresh/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    if (!body.refresh) {
      return HttpResponse.json(
        {
          success: false,
          message: "Invalid refresh token",
          code: "INVALID_TOKEN",
          statusCode: 401,
          errors: [],
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }
    return HttpResponse.json(
      makeApiResponse({
        accessToken: "new-access-token-123",
        refreshToken: "new-refresh-token-456",
        expiresIn: 3600,
        tokenType: "Bearer",
      })
    );
  }),

  http.post(`${BASE_URL}/auth/password/reset/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json(
      makeApiResponse({
        message: `Password reset email sent to ${body.email}`,
      })
    );
  }),

  http.post(`${BASE_URL}/auth/logout/`, () => {
    return HttpResponse.json(makeApiResponse({ message: "Logged out" }));
  }),

  // ── Resumes ─────────────────────────────────────────────────────────────

  http.get(`${BASE_URL}/resumes/`, () => {
    return HttpResponse.json(
      makePaginatedResponse([mockResumeListItem], 1)
    );
  }),

  http.post(`${BASE_URL}/resumes/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json(
      makeApiResponse({
        ...mockResume,
        id: "resume-new",
        title: body.title || "New Resume",
        templateId: body.template_id || body.templateId || "template-modern-1",
      }),
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/resumes/:id/`, ({ params }) => {
    return HttpResponse.json(
      makeApiResponse({
        ...mockResume,
        id: params.id as string,
      })
    );
  }),

  http.patch(`${BASE_URL}/resumes/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      makeApiResponse({
        ...mockResume,
        id: params.id as string,
        ...body,
      })
    );
  }),

  http.delete(`${BASE_URL}/resumes/:id/`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE_URL}/resumes/:id/duplicate/`, ({ params }) => {
    return HttpResponse.json(
      makeApiResponse({
        ...mockResume,
        id: `${params.id}-copy`,
        title: `${mockResume.title} (Copy)`,
      }),
      { status: 201 }
    );
  }),

  // ── Templates ───────────────────────────────────────────────────────────

  http.get(`${BASE_URL}/templates/`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let templates = [mockTemplate, mockPremiumTemplate];
    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    return HttpResponse.json(makePaginatedResponse(templates));
  }),

  http.get(`${BASE_URL}/templates/:slug/`, ({ params }) => {
    const slug = params.slug as string;
    const template =
      slug === mockPremiumTemplate.slug ? mockPremiumTemplate : mockTemplate;
    return HttpResponse.json(makeApiResponse({ ...template, slug }));
  }),

  // ── Examples ────────────────────────────────────────────────────────────

  http.get(`${BASE_URL}/examples/resumes/`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let examples = [mockExample];
    if (category && category !== mockExample.category) {
      examples = [];
    }

    return HttpResponse.json(makePaginatedResponse(examples));
  }),

  http.get(`${BASE_URL}/examples/resumes/:slug/`, () => {
    return HttpResponse.json(makeApiResponse(mockExample));
  }),

  // ── Articles / Content ──────────────────────────────────────────────────

  http.get(`${BASE_URL}/content/articles/`, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let articles = [mockArticle];
    if (category && category !== mockArticle.category) {
      articles = [];
    }

    return HttpResponse.json(makePaginatedResponse(articles));
  }),

  http.get(`${BASE_URL}/content/articles/:slug/`, () => {
    return HttpResponse.json(makeApiResponse(mockArticle));
  }),
];
