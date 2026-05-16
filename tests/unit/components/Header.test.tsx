import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "@/components/layout/Header";

// Mock the MegaMenu and MobileMenu components
vi.mock("@/components/layout/MegaMenu", () => ({
  MegaMenu: ({ item, onClose }: { item: string; onClose: () => void }) => (
    <div data-testid={`mega-menu-${item}`}>
      <span>MegaMenu for {item}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock("@/components/layout/MobileMenu", () => ({
  MobileMenu: ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="mobile-menu" role="dialog">
        <button onClick={onClose}>Close mobile menu</button>
      </div>
    ) : null,
}));

describe("Header", () => {
  it("renders logo with link to home", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: /resumer/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders navigation items", () => {
    render(<Header />);
    const navItems = [
      "Resume",
      "CV",
      "Cover Letter",
      "Job Search",
      "Job Interviews",
      "Career Advice",
      "About",
    ];
    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders My Account button", () => {
    render(<Header />);
    const accountLink = screen.getByRole("link", { name: /my account/i });
    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveAttribute("href", "/account");
  });

  it("mobile menu toggle works", () => {
    render(<Header />);

    // Mobile menu should not be visible initially
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    // Click the hamburger button
    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);

    // Mobile menu should now be visible
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

    // Close the mobile menu
    fireEvent.click(screen.getByText("Close mobile menu"));
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("shows mega menu on hover", () => {
    render(<Header />);

    const resumeButton = screen.getByText("Resume");
    fireEvent.mouseEnter(resumeButton.closest("div")!);

    expect(screen.getByTestId("mega-menu-Resume")).toBeInTheDocument();
    expect(screen.getByText("MegaMenu for Resume")).toBeInTheDocument();
  });

  it("hides mega menu on mouse leave", () => {
    render(<Header />);

    const resumeButton = screen.getByText("Resume");
    const container = resumeButton.closest("div")!;

    fireEvent.mouseEnter(container);
    expect(screen.getByTestId("mega-menu-Resume")).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    expect(screen.queryByTestId("mega-menu-Resume")).not.toBeInTheDocument();
  });

  it("renders mobile menu button with correct aria-label", () => {
    render(<Header />);
    const menuButton = screen.getByLabelText("Open menu");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton.tagName).toBe("BUTTON");
  });

  it("renders the logo text 'Resumer'", () => {
    render(<Header />);
    expect(screen.getByText("Resumer")).toBeInTheDocument();
  });

  it("renders the logo icon with letter R", () => {
    render(<Header />);
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("renders all seven navigation items", () => {
    render(<Header />);

    const navLabels = [
      "Resume", "CV", "Cover Letter", "Job Search",
      "Job Interviews", "Career Advice", "About",
    ];
    navLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    // Total buttons: 7 nav + 1 hamburger + 1 My Account button = 9
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
  });
});
