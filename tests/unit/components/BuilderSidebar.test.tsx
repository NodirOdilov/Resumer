import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BuilderSidebar, SECTIONS } from "@/components/builder/BuilderSidebar";
import { useBuilderStore } from "@/stores/builderStore";

describe("BuilderSidebar", () => {
  beforeEach(() => {
    useBuilderStore.getState().resetBuilder();
  });

  it("renders all section items", () => {
    render(<BuilderSidebar />);
    for (const section of SECTIONS) {
      expect(screen.getByText(section.label)).toBeInTheDocument();
    }
  });

  it("highlights active section", () => {
    useBuilderStore.setState({ activeSection: "experience" });
    render(<BuilderSidebar />);

    const experienceButton = screen.getByText("Experience").closest("button")!;
    expect(experienceButton).toHaveClass("bg-[#0D47A1]");
    expect(experienceButton).toHaveClass("text-white");
  });

  it("handles section click", () => {
    render(<BuilderSidebar />);

    fireEvent.click(screen.getByText("Education"));

    const state = useBuilderStore.getState();
    expect(state.activeSection).toBe("education");
  });

  it("shows completion indicator for sections with content", () => {
    useBuilderStore.setState({
      content: {
        contact: { first_name: "John" },
        experience: [{ company: "Acme" }],
      },
    });

    const { container } = render(<BuilderSidebar />);
    // Completed sections should render checkmark icons (rounded-full elements)
    const checkmarks = container.querySelectorAll(".rounded-full");
    expect(checkmarks.length).toBeGreaterThanOrEqual(2);
  });

  it("default active section is contact", () => {
    render(<BuilderSidebar />);

    const contactButton = screen.getByText("Contact").closest("button")!;
    expect(contactButton).toHaveClass("bg-[#0D47A1]");
  });
});
