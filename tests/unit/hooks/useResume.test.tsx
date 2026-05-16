import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the api module
vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAccessToken: vi.fn(() => null),
  getRefreshToken: vi.fn(() => null),
  setTokens: vi.fn(),
  removeTokens: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

import api from "@/lib/api";
import {
  useResumes,
  useCreateResume,
  useUpdateResume,
  useDeleteResume,
} from "@/hooks/useResume";
import { mockResume, mockResumeListItem } from "../mocks/data";

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

describe("useResumes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns list of resumes", async () => {
    const paginatedResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [mockResumeListItem],
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: paginatedResponse });

    const { result } = renderHook(() => useResumes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(paginatedResponse);
    expect(result.current.data?.results).toHaveLength(1);
    expect(result.current.data?.results[0].title).toBe(
      "Software Engineer Resume"
    );
  });

  it("handles loading state", () => {
    vi.mocked(api.get).mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    const { result } = renderHook(() => useResumes(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("handles error state", async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useResumes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useCreateResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a resume", async () => {
    const createdResume = {
      ...mockResume,
      id: "resume-new",
      title: "My New Resume",
    };

    vi.mocked(api.post).mockResolvedValueOnce({ data: createdResume });

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        title: "My New Resume",
        document_type: "resume",
        template_id: "template-modern-1",
      });
    });

    expect(api.post).toHaveBeenCalledWith("/resumes/", {
      title: "My New Resume",
      document_type: "resume",
      template_id: "template-modern-1",
    });

    expect(result.current.data?.title).toBe("My New Resume");
  });
});

describe("useUpdateResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a resume", async () => {
    const updatedResume = {
      ...mockResume,
      title: "Updated Title",
    };

    vi.mocked(api.patch).mockResolvedValueOnce({ data: updatedResume });

    const { result } = renderHook(() => useUpdateResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        id: "resume-1",
        title: "Updated Title",
      });
    });

    expect(api.patch).toHaveBeenCalledWith("/resumes/resume-1/", {
      title: "Updated Title",
    });

    expect(result.current.data?.title).toBe("Updated Title");
  });
});

describe("useDeleteResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes a resume", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

    const { result } = renderHook(() => useDeleteResume(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("resume-1");
    });

    expect(api.delete).toHaveBeenCalledWith("/resumes/resume-1/");
    expect(result.current.isSuccess).toBe(true);
  });
});
