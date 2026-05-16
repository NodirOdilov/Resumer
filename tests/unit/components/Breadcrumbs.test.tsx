import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Override the usePathname mock for these tests
const mockUsePathname = vi.fn();
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => mockUsePathname(),
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  };
});

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders breadcrumb items for multi-segment path", () => {
    mockUsePathname.mockReturnValue("/resume-templates/modern-professional");
    render(<Breadcrumbs />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Resume Templates")).toBeInTheDocument();
    expect(screen.getByText("Modern Professional")).toBeInTheDocument();
  });

  it("shows current page as non-link", () => {
    mockUsePathname.mockReturnValue("/resume-templates/modern");
    render(<Breadcrumbs />);

    const currentPage = screen.getByText("Modern");
    expect(currentPage).toHaveAttribute("aria-current", "page");
    // Current page should not be a link
    expect(currentPage.tagName).not.toBe("A");
  });

  it("renders Home as a link", () => {
    mockUsePathname.mockReturnValue("/about");
    render(<Breadcrumbs />);

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders intermediate segments as links", () => {
    mockUsePathname.mockReturnValue("/dashboard/resumes/edit");
    render(<Breadcrumbs />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");

    const resumesLink = screen.getByText("Resumes").closest("a");
    expect(resumesLink).toHaveAttribute("href", "/dashboard/resumes");
  });

  it("returns null for root path", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<Breadcrumbs />);
    expect(container.innerHTML).toBe("");
  });

  it("supports custom homeLabel", () => {
    mockUsePathname.mockReturnValue("/about");
    render(<Breadcrumbs homeLabel="Start" />);
    expect(screen.getByText("Start")).toBeInTheDocument();
  });
});
