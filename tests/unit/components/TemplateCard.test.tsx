import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { mockTemplate, mockPremiumTemplate } from "../mocks/data";

describe("TemplateCard", () => {
  it("renders template name", () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText("Modern Professional")).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText("modern")).toBeInTheDocument();
  });

  it("renders NEW badge when isNew is true", () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("does not render NEW badge when isNew is false", () => {
    render(<TemplateCard template={mockPremiumTemplate} />);
    expect(screen.queryByText("NEW")).not.toBeInTheDocument();
  });

  it("renders PRO badge when isPremium is true", () => {
    render(<TemplateCard template={mockPremiumTemplate} />);
    expect(screen.getByText("PRO")).toBeInTheDocument();
  });

  it("does not render PRO badge when isPremium is false", () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.queryByText("PRO")).not.toBeInTheDocument();
  });

  it("hover shows overlay button with correct link", () => {
    render(<TemplateCard template={mockTemplate} />);
    const link = screen.getByRole("link", { name: /use this template/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      `/resume-builder?template=${mockTemplate.slug}`
    );
  });

  it("uses custom basePath for link", () => {
    render(<TemplateCard template={mockTemplate} basePath="/cv-builder" />);
    const link = screen.getByRole("link", { name: /use this template/i });
    expect(link).toHaveAttribute(
      "href",
      `/cv-builder?template=${mockTemplate.slug}`
    );
  });

  it("renders template thumbnail image", () => {
    render(<TemplateCard template={mockTemplate} />);
    const img = screen.getByAltText(
      `${mockTemplate.name} template preview`
    );
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockTemplate.thumbnail);
  });

  it("renders rating when greater than zero", () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText("4.8")).toBeInTheDocument();
  });

  it("does not render rating when zero", () => {
    const noRatingTemplate = { ...mockTemplate, rating: 0 };
    render(<TemplateCard template={noRatingTemplate} />);
    expect(screen.queryByText("0.0")).not.toBeInTheDocument();
  });
});
