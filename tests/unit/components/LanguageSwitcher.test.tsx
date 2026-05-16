import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("renders language options trigger button", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("English (US)")).toBeInTheDocument();
  });

  it("shows dropdown when button is clicked", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText("English (US)"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
    expect(screen.getByText("German")).toBeInTheDocument();
  });

  it("handles language change", () => {
    const onLanguageChange = vi.fn();
    render(
      <LanguageSwitcher
        currentLanguage="en-us"
        onLanguageChange={onLanguageChange}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("English (US)"));
    // Select Spanish
    fireEvent.click(screen.getByText("Spanish"));

    expect(onLanguageChange).toHaveBeenCalledWith("es");
  });

  it("shows the currently selected language", () => {
    render(<LanguageSwitcher currentLanguage="fr" />);
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("marks selected language in the dropdown", () => {
    render(<LanguageSwitcher currentLanguage="en-us" />);
    fireEvent.click(screen.getByText("English (US)"));

    const selectedOption = screen.getByRole("option", { selected: true });
    expect(selectedOption).toHaveTextContent("English (US)");
  });

  it("closes dropdown after selection", () => {
    const onLanguageChange = vi.fn();
    render(
      <LanguageSwitcher
        currentLanguage="en-us"
        onLanguageChange={onLanguageChange}
      />
    );

    fireEvent.click(screen.getByText("English (US)"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByText("German"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
