import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => <div className={className}>{children}</div>,
  },
}));

import { StepsSection } from "@/components/marketing/StepsSection";

describe("StepsSection", () => {
  it("renders all 3 steps", () => {
    render(<StepsSection />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows step titles", () => {
    render(<StepsSection />);
    expect(
      screen.getByText("Fill in the blanks and see results in real-time.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Give your document a professional and elegant look.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Download your resume, apply, get more interviews.")
    ).toBeInTheDocument();
  });

  it("shows step descriptions", () => {
    render(<StepsSection />);
    expect(
      screen.getByText(/resumer makes it easy to create a resume/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/choose from dozens of professionally-designed/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/export your finished resume as a pdf/i)
    ).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<StepsSection />);
    expect(
      screen.getByText(/create your resume in just/i)
    ).toBeInTheDocument();
    expect(screen.getByText("3 steps")).toBeInTheDocument();
  });
});
