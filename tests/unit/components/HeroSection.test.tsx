import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock framer-motion to render children directly
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...filterMotionProps(props)}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

function filterMotionProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (
      !["initial", "animate", "exit", "transition", "whileInView", "viewport", "variants"].includes(key)
    ) {
      filtered[key] = props[key];
    }
  }
  return filtered;
}

import { HeroSection } from "@/components/marketing/HeroSection";

describe("HeroSection", () => {
  it("renders hero title and subtitle", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/job-winning resume/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/create a powerful resume/i)
    ).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("link", { name: /create your resume/i })
    ).toBeInTheDocument();
  });

  it("CTA links to resume builder", () => {
    render(<HeroSection />);
    const ctaLink = screen.getByRole("link", {
      name: /create your resume/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/resume-builder");
  });

  it("renders 'No credit card required' text", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("No credit card required")
    ).toBeInTheDocument();
  });

  it("renders the H1 heading element", () => {
    render(<HeroSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/job-winning resume/i);
  });

  it("renders the resume preview placeholder", () => {
    const { container } = render(<HeroSection />);
    // The component renders a visual resume mock with skeleton bars
    // representing experience, skills, and education sections.
    // Verify the outer section and the mock exist.
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    // The mock resume contains rounded-full placeholder divs for skills
    const skillPills = container.querySelectorAll(".rounded-full");
    expect(skillPills.length).toBeGreaterThan(0);
  });

  it("renders the Cover Letter accent text", () => {
    render(<HeroSection />);
    expect(screen.getByText("Cover Letter")).toBeInTheDocument();
  });
});
