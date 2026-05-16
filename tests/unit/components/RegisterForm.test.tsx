import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterForm } from "@/components/forms/RegisterForm";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => ({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/signup",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  };
});

// Mock fetch for registration
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: "1" } }),
    });
  });

  function fillForm(overrides: Partial<Record<string, string>> = {}) {
    const defaults = {
      "First name": "John",
      "Last name": "Doe",
      "Email address": "john@example.com",
      Password: "StrongPass1!",
      "Confirm password": "StrongPass1!",
    };

    const values = { ...defaults, ...overrides };

    if (values["First name"]) {
      fireEvent.change(screen.getByPlaceholderText("John"), {
        target: { value: values["First name"] },
      });
    }
    if (values["Last name"]) {
      fireEvent.change(screen.getByPlaceholderText("Doe"), {
        target: { value: values["Last name"] },
      });
    }
    if (values["Email address"]) {
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
        target: { value: values["Email address"] },
      });
    }
    if (values["Password"]) {
      fireEvent.change(
        screen.getByPlaceholderText("At least 8 characters"),
        { target: { value: values["Password"] } }
      );
    }
    if (values["Confirm password"]) {
      fireEvent.change(
        screen.getByPlaceholderText("Repeat your password"),
        { target: { value: values["Confirm password"] } }
      );
    }
  }

  it("renders all form fields", () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("At least 8 characters")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Repeat your password")
    ).toBeInTheDocument();
  });

  it("validates password match", async () => {
    render(<RegisterForm />);

    fillForm({ "Confirm password": "DifferentPass1!" });

    const termsCheckbox = screen.getByRole("checkbox");
    fireEvent.click(termsCheckbox);

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("validates password strength (min 8 characters)", async () => {
    render(<RegisterForm />);

    fillForm({ Password: "short", "Confirm password": "short" });

    const termsCheckbox = screen.getByRole("checkbox");
    fireEvent.click(termsCheckbox);

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  it("renders terms checkbox", () => {
    render(<RegisterForm />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(
      screen.getByText(/I agree to the/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Terms of Service" })
    ).toHaveAttribute("href", "/terms-of-service");
    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy-policy");
  });

  it("all fields required - shows errors when empty", async () => {
    render(<RegisterForm />);

    // Submit without filling anything
    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("First name is required")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Last name is required")
      ).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(
        screen.getByText("You must agree to the terms")
      ).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<RegisterForm />);

    fillForm({ "Email address": "not-an-email" });

    const termsCheckbox = screen.getByRole("checkbox");
    fireEvent.click(termsCheckbox);

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("Enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  it("submits successfully and redirects to verify email", async () => {
    render(<RegisterForm />);

    fillForm();
    const termsCheckbox = screen.getByRole("checkbox");
    fireEvent.click(termsCheckbox);

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          password: "StrongPass1!",
        }),
      });
      expect(mockPush).toHaveBeenCalledWith(
        "/verify-email?email=john%40example.com"
      );
    });
  });

  it("shows server error on failed registration", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({ detail: "Email already in use" }),
    });

    render(<RegisterForm />);

    fillForm();
    const termsCheckbox = screen.getByRole("checkbox");
    fireEvent.click(termsCheckbox);

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("Email already in use")
      ).toBeInTheDocument();
    });
  });

  it("renders OAuth buttons", () => {
    render(<RegisterForm />);
    expect(
      screen.getByRole("button", { name: /google/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /github/i })
    ).toBeInTheDocument();
  });

  it("renders sign in link", () => {
    render(<RegisterForm />);
    const signinLink = screen.getByRole("link", { name: /sign in/i });
    expect(signinLink).toBeInTheDocument();
    expect(signinLink).toHaveAttribute("href", "/signin");
  });

  it("clears field error when user types", async () => {
    render(<RegisterForm />);

    // Submit empty to get errors
    fireEvent.submit(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("First name is required")
      ).toBeInTheDocument();
    });

    // Type in the first name field
    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "Jane" },
    });

    // Error should be cleared
    expect(
      screen.queryByText("First name is required")
    ).not.toBeInTheDocument();
  });
});
