import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renders email input", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("validates email format via input type", () => {
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders submit button", () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByRole("button", { name: "Send reset link" })
    ).toBeInTheDocument();
  });

  it("email input is required", () => {
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    expect(emailInput).toBeRequired();
  });

  it("handles form submission successfully", async () => {
    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Email sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "john@example.com" }),
    });
  });

  it("shows error on failed submission", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ detail: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "unknown@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });

  it("renders back to sign in link", () => {
    render(<ForgotPasswordForm />);
    const link = screen.getByRole("link", { name: /back to sign in/i });
    expect(link).toHaveAttribute("href", "/signin");
  });
});
