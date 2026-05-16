import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExampleCard } from "@/components/examples/ExampleCard";

describe("ExampleCard", () => {
  const defaultProps = {
    title: "Software Engineer Resume Example",
    slug: "software-engineer-resume-example",
    category: "technology",
    experienceLevel: "mid-level",
    thumbnail: "https://example.com/thumb.jpg",
    basePath: "/resume-examples",
  };

  it("renders example card with title and category", () => {
    render(<ExampleCard {...defaultProps} />);
    expect(
      screen.getByText("Software Engineer Resume Example")
    ).toBeInTheDocument();
    expect(screen.getByText("technology")).toBeInTheDocument();
  });

  it("renders as a link with correct href", () => {
    render(<ExampleCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "/resume-examples/software-engineer-resume-example"
    );
  });

  it("shows category badge", () => {
    render(<ExampleCard {...defaultProps} />);
    expect(screen.getByText("technology")).toBeInTheDocument();
  });

  it("shows experience level badge", () => {
    render(<ExampleCard {...defaultProps} />);
    expect(screen.getByText("mid-level")).toBeInTheDocument();
  });

  it("renders thumbnail image when provided", () => {
    render(<ExampleCard {...defaultProps} />);
    const img = screen.getByAltText(
      "Software Engineer Resume Example example preview"
    );
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
  });

  it("renders placeholder when no thumbnail is provided", () => {
    const { container } = render(
      <ExampleCard {...defaultProps} thumbnail={undefined} />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    // The placeholder div should still exist
    expect(container.querySelector(".aspect-\\[3\\/4\\]")).toBeInTheDocument();
  });
});
