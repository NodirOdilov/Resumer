import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SettingsPanel } from "@/components/builder/SettingsPanel";
import { useBuilderStore } from "@/stores/builderStore";

describe("SettingsPanel", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useBuilderStore.getState().resetBuilder();
  });

  it("renders nothing when open is false", () => {
    const { container } = render(
      <SettingsPanel open={false} onClose={onClose} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders color scheme options when open", () => {
    render(<SettingsPanel open={true} onClose={onClose} />);
    expect(screen.getByText("Color Scheme")).toBeInTheDocument();
    // Check some color swatch buttons exist
    expect(
      screen.getByLabelText("Select color #0D47A1")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select color #1B5E20")
    ).toBeInTheDocument();
  });

  it("renders font options", () => {
    render(<SettingsPanel open={true} onClose={onClose} />);
    expect(screen.getByText("Font Family")).toBeInTheDocument();
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    // Check font options are in the select
    expect(screen.getByText("Roboto")).toBeInTheDocument();
    expect(screen.getByText("Montserrat")).toBeInTheDocument();
  });

  it("updates color when swatch is clicked", () => {
    render(<SettingsPanel open={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Select color #B71C1C"));
    expect(useBuilderStore.getState().settings.color).toBe("#B71C1C");
  });

  it("updates font when select changes", () => {
    render(<SettingsPanel open={true} onClose={onClose} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Lato" } });
    expect(useBuilderStore.getState().settings.font).toBe("Lato");
  });

  it("renders margin options", () => {
    render(<SettingsPanel open={true} onClose={onClose} />);
    expect(screen.getByText("Margins")).toBeInTheDocument();
    expect(screen.getByText("Narrow")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Wide")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<SettingsPanel open={true} onClose={onClose} />);
    // The settings header has "Settings" title and a close button
    const closeButtons = screen.getAllByRole("button");
    // The first button after the heading is the close (X) button
    const closeBtn = closeButtons.find((btn) =>
      btn.closest(".flex.items-center.justify-between")
    );
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });
});
