import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/layout/Footer";

describe("Footer", () => {
  it("renders 5 columns", () => {
    render(<Footer />);

    const columnTitles = [
      "Resume",
      "CV",
      "Cover Letter",
      "Support",
      "Choose a Region",
    ];

    columnTitles.forEach((title) => {
      expect(
        screen.getByRole("heading", { name: title })
      ).toBeInTheDocument();
    });
  });

  it("renders copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText(/2026 Resumer\. All rights reserved\./)
    ).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Footer />);

    // Spot-check key links from each column
    const expectedLinks = [
      { text: "Resume Builder", href: "/resume/builder" },
      { text: "Resume Templates", href: "/resume-templates" },
      { text: "CV Builder", href: "/cv/builder" },
      { text: "CV Templates", href: "/cv-templates" },
      { text: "Cover Letter Builder", href: "/cover-letter/builder" },
      { text: "About", href: "/about" },
      { text: "Contact", href: "/contact" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
    ];

    expectedLinks.forEach(({ text, href }) => {
      const link = screen.getByRole("link", { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
    });
  });

  it("renders language/region options", () => {
    render(<Footer />);

    const languages = [
      "English (US)",
      "English (UK)",
      "Espanol",
      "Francais",
      "Deutsch",
    ];

    languages.forEach((lang) => {
      expect(screen.getByText(lang)).toBeInTheDocument();
    });
  });

  it("renders certification badges", () => {
    render(<Footer />);
    expect(screen.getByText("NCDA Certified Partner")).toBeInTheDocument();
    expect(screen.getByText("PARWCC Member")).toBeInTheDocument();
  });
});
