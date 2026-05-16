import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBuilderStore } from "@/stores/builderStore";

// Mock all section components to avoid deep dependency tree
vi.mock("@/components/builder/sections/ContactSection", () => ({
  ContactSection: () => <div data-testid="section-contact">Contact Section</div>,
}));
vi.mock("@/components/builder/sections/SummarySection", () => ({
  SummarySection: () => <div data-testid="section-summary">Summary Section</div>,
}));
vi.mock("@/components/builder/sections/ExperienceSection", () => ({
  ExperienceSection: () => <div data-testid="section-experience">Experience Section</div>,
}));
vi.mock("@/components/builder/sections/EducationSection", () => ({
  EducationSection: () => <div data-testid="section-education">Education Section</div>,
}));
vi.mock("@/components/builder/sections/SkillsSection", () => ({
  SkillsSection: () => <div data-testid="section-skills">Skills Section</div>,
}));
vi.mock("@/components/builder/sections/LanguagesSection", () => ({
  LanguagesSection: () => <div data-testid="section-languages">Languages Section</div>,
}));
vi.mock("@/components/builder/sections/CertificatesSection", () => ({
  CertificatesSection: () => <div data-testid="section-certificates">Certificates Section</div>,
}));
vi.mock("@/components/builder/sections/ProjectsSection", () => ({
  ProjectsSection: () => <div data-testid="section-projects">Projects Section</div>,
}));
vi.mock("@/components/builder/sections/AwardsSection", () => ({
  AwardsSection: () => <div data-testid="section-awards">Awards Section</div>,
}));
vi.mock("@/components/builder/sections/VolunteerSection", () => ({
  VolunteerSection: () => <div data-testid="section-volunteer">Volunteer Section</div>,
}));
vi.mock("@/components/builder/sections/InterestsSection", () => ({
  InterestsSection: () => <div data-testid="section-hobbies">Hobbies Section</div>,
}));
vi.mock("@/components/builder/sections/CustomSection", () => ({
  CustomSection: () => <div data-testid="section-custom">Custom Section</div>,
}));

import { BuilderForm } from "@/components/builder/BuilderForm";

describe("BuilderForm", () => {
  beforeEach(() => {
    useBuilderStore.getState().resetBuilder();
  });

  it("renders current section form", () => {
    render(<BuilderForm />);
    // Default active section is "contact"
    expect(screen.getByTestId("section-contact")).toBeInTheDocument();
  });

  it("renders different section when activeSection changes", () => {
    useBuilderStore.setState({ activeSection: "experience" });
    render(<BuilderForm />);
    expect(screen.getByTestId("section-experience")).toBeInTheDocument();
  });

  it("shows Previous and Next buttons", () => {
    render(<BuilderForm />);
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("disables Previous button on first section", () => {
    render(<BuilderForm />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("navigates to next section on Next click", () => {
    render(<BuilderForm />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(useBuilderStore.getState().activeSection).toBe("summary");
  });

  it("shows Add Section button", () => {
    render(<BuilderForm />);
    expect(
      screen.getByRole("button", { name: /add section/i })
    ).toBeInTheDocument();
  });
});
