import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBuilderStore } from "@/stores/builderStore";
import { useUiStore } from "@/stores/uiStore";

// Mock TemplateSelector to avoid deep dependency
vi.mock("@/components/builder/TemplateSelector", () => ({
  TemplateSelector: () => <div data-testid="template-selector">Template Selector</div>,
}));

// Mock useDebounce to return value immediately
vi.mock("@/hooks/useDebounce", () => ({
  useDebouncedValue: <T,>(value: T) => value,
}));

import { LivePreview } from "@/components/builder/LivePreview";

describe("LivePreview", () => {
  beforeEach(() => {
    useBuilderStore.getState().resetBuilder();
    useUiStore.setState({ previewZoom: 100 });
  });

  it("renders preview container", () => {
    render(<LivePreview />);
    const iframe = screen.getByTitle("Resume Preview");
    expect(iframe).toBeInTheDocument();
  });

  it("renders zoom controls", () => {
    render(<LivePreview />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("handles zoom out", () => {
    render(<LivePreview />);

    // Find the zoom out button (first icon button)
    const buttons = screen.getAllByRole("button");
    // First button is zoom out
    const zoomOutButton = buttons[0];
    fireEvent.click(zoomOutButton);

    expect(useUiStore.getState().previewZoom).toBe(90);
  });

  it("handles zoom in", () => {
    render(<LivePreview />);

    const buttons = screen.getAllByRole("button");
    // Second button is zoom in
    const zoomInButton = buttons[1];
    fireEvent.click(zoomInButton);

    expect(useUiStore.getState().previewZoom).toBe(110);
  });

  it("renders Change Template button", () => {
    render(<LivePreview />);
    expect(
      screen.getByRole("button", { name: /change template/i })
    ).toBeInTheDocument();
  });

  it("applies zoom transform to preview", () => {
    useUiStore.setState({ previewZoom: 80 });
    const { container } = render(<LivePreview />);

    const previewDiv = container.querySelector("[style*='transform']");
    expect(previewDiv).toBeTruthy();
    expect(previewDiv!.getAttribute("style")).toContain("scale(0.8)");
  });
});
