import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ProgressBar } from "@/components/builder/ProgressBar";
import { useBuilderStore } from "@/stores/builderStore";

describe("ProgressBar", () => {
  beforeEach(() => {
    useBuilderStore.getState().resetBuilder();
  });

  it("renders 0% when no sections are filled", () => {
    render(<ProgressBar />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders correct percentage for filled sections", () => {
    // The ProgressBar checks 12 sections. Fill 3 of them.
    useBuilderStore.getState().setContent({
      contact: { first_name: "John" },
      summary: "A summary paragraph",
      skills: [{ name: "TypeScript" }],
    });

    render(<ProgressBar />);

    // 3 / 12 = 25%
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("renders 100% when all sections are filled", () => {
    useBuilderStore.getState().setContent({
      contact: { first_name: "John" },
      summary: "A summary",
      experience: [{ company: "Acme" }],
      education: [{ institution: "MIT" }],
      skills: [{ name: "TS" }],
      languages: [{ name: "English" }],
      certificates: [{ name: "AWS" }],
      projects: [{ name: "Project" }],
      awards: [{ title: "Award" }],
      volunteer: [{ organization: "NGO" }],
      hobbies: [{ name: "Reading" }],
      custom_sections: [{ title: "Custom" }],
    });

    render(<ProgressBar />);

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("does not count empty strings as filled", () => {
    useBuilderStore.getState().setContent({
      summary: "   ",
    });

    render(<ProgressBar />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("does not count empty arrays as filled", () => {
    useBuilderStore.getState().setContent({
      experience: [],
    });

    render(<ProgressBar />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("counts objects with non-empty string values as filled", () => {
    useBuilderStore.getState().setContent({
      contact: { first_name: "John", last_name: "" },
    });

    render(<ProgressBar />);

    // 1 / 12 ≈ 8%
    expect(screen.getByText("8%")).toBeInTheDocument();
  });

  it("renders a progress bar element with correct width style", () => {
    useBuilderStore.getState().setContent({
      contact: { first_name: "John" },
      summary: "Summary",
      experience: [{ company: "Acme" }],
      education: [{ institution: "MIT" }],
      skills: [{ name: "TS" }],
      languages: [{ name: "En" }],
    });

    const { container } = render(<ProgressBar />);

    // 6 / 12 = 50%
    expect(screen.getByText("50%")).toBeInTheDocument();

    // The inner bar div should have width: 50%
    const innerBar = container.querySelector("[style]");
    expect(innerBar).toHaveStyle({ width: "50%" });
  });
});
