import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { mockTemplate, mockPremiumTemplate } from "../mocks/data";

describe("TemplateGrid", () => {
  const templates = [mockTemplate, mockPremiumTemplate];

  it("renders grid of templates", () => {
    render(<TemplateGrid templates={templates} />);
    expect(screen.getByText("Modern Professional")).toBeInTheDocument();
    expect(screen.getByText("Executive Suite")).toBeInTheDocument();
  });

  it("filters templates by category", () => {
    render(<TemplateGrid templates={templates} />);

    // Click "Modern" filter
    fireEvent.click(screen.getByText("Modern"));

    // Only the modern template should be visible
    expect(screen.getByText("Modern Professional")).toBeInTheDocument();
    expect(screen.queryByText("Executive Suite")).not.toBeInTheDocument();
  });

  it("shows all templates when 'All' filter is selected", () => {
    render(<TemplateGrid templates={templates} />);

    // First filter to modern
    fireEvent.click(screen.getByText("Modern"));
    expect(screen.queryByText("Executive Suite")).not.toBeInTheDocument();

    // Then click "All"
    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("Modern Professional")).toBeInTheDocument();
    expect(screen.getByText("Executive Suite")).toBeInTheDocument();
  });

  it("shows 'no results' message when no templates match filter", () => {
    render(<TemplateGrid templates={templates} />);

    // Click "Creative" filter — no templates have this category
    fireEvent.click(screen.getByText("Creative"));

    expect(
      screen.getByText("No templates found for this category.")
    ).toBeInTheDocument();
    expect(screen.getByText("View all templates")).toBeInTheDocument();
  });

  it("resets filter when 'View all templates' is clicked", () => {
    render(<TemplateGrid templates={templates} />);

    fireEvent.click(screen.getByText("Creative"));
    expect(
      screen.getByText("No templates found for this category.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("View all templates"));
    expect(screen.getByText("Modern Professional")).toBeInTheDocument();
    expect(screen.getByText("Executive Suite")).toBeInTheDocument();
  });
});
