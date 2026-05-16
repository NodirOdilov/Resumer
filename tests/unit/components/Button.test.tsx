import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[#0D47A1]");
  });

  it("renders all variants", () => {
    const variants = [
      { variant: "default" as const, expectedClass: "bg-[#0D47A1]" },
      { variant: "destructive" as const, expectedClass: "bg-red-600" },
      { variant: "outline" as const, expectedClass: "border" },
      { variant: "secondary" as const, expectedClass: "bg-gray-100" },
      { variant: "ghost" as const, expectedClass: "hover:bg-gray-100" },
      { variant: "link" as const, expectedClass: "underline-offset-4" },
    ];

    variants.forEach(({ variant, expectedClass }) => {
      const { unmount } = render(
        <Button variant={variant}>{variant}</Button>
      );
      const button = screen.getByRole("button", { name: variant });
      expect(button).toHaveClass(expectedClass);
      unmount();
    });
  });

  it("renders all sizes", () => {
    const sizes = [
      { size: "default" as const, expectedClass: "h-10" },
      { size: "sm" as const, expectedClass: "h-9" },
      { size: "lg" as const, expectedClass: "h-11" },
      { size: "icon" as const, expectedClass: "w-10" },
    ];

    sizes.forEach(({ size, expectedClass }) => {
      const { unmount } = render(
        <Button size={size}>btn-{size}</Button>
      );
      const button = screen.getByRole("button", { name: `btn-${size}` });
      expect(button).toHaveClass(expectedClass);
      unmount();
    });
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as child element when asChild", () => {
    render(
      <Button asChild variant="default">
        <a href="/test">Link button</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Link button" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("bg-[#0D47A1]");
    // Should not render a <button> element
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies className", () => {
    render(<Button className="my-custom-class">Styled</Button>);
    const button = screen.getByRole("button", { name: "Styled" });
    expect(button).toHaveClass("my-custom-class");
  });

  it("disables the button when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
  });

  it("renders with type submit", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });
});
