import { render, screen, fireEvent } from "@testing-library/react";
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

import { FAQSection } from "@/components/marketing/FAQSection";

const testFAQs = [
  { question: "What is a resume?", answer: "A resume is a document." },
  { question: "How long should it be?", answer: "Usually one page." },
  { question: "Do I need a cover letter?", answer: "It depends on the job." },
];

describe("FAQSection", () => {
  it("renders all FAQ items", () => {
    render(<FAQSection items={testFAQs} />);
    expect(screen.getByText("What is a resume?")).toBeInTheDocument();
    expect(screen.getByText("How long should it be?")).toBeInTheDocument();
    expect(screen.getByText("Do I need a cover letter?")).toBeInTheDocument();
  });

  it("renders the section title", () => {
    render(<FAQSection items={testFAQs} />);
    expect(
      screen.getByText("Frequently Asked Questions")
    ).toBeInTheDocument();
  });

  it("supports custom title", () => {
    render(<FAQSection title="Help Center" items={testFAQs} />);
    expect(screen.getByText("Help Center")).toBeInTheDocument();
  });

  it("first item is open by default", () => {
    render(<FAQSection items={testFAQs} />);
    // The first answer should be visible (first FAQ is expanded by default)
    const firstButton = screen.getByText("What is a resume?").closest("button")!;
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles answer visibility on click", () => {
    render(<FAQSection items={testFAQs} />);

    // Click second question to open it
    const secondButton = screen.getByText("How long should it be?").closest("button")!;
    expect(secondButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(secondButton);
    expect(secondButton).toHaveAttribute("aria-expanded", "true");

    // First item should now be closed
    const firstButton = screen.getByText("What is a resume?").closest("button")!;
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes an open item when clicking it again", () => {
    render(<FAQSection items={testFAQs} />);

    const firstButton = screen.getByText("What is a resume?").closest("button")!;
    expect(firstButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders default FAQs when no items prop provided", () => {
    render(<FAQSection />);
    expect(screen.getByText("What is a resume builder?")).toBeInTheDocument();
    expect(screen.getByText("How do I make a resume?")).toBeInTheDocument();
  });
});
