import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactForm } from "@/components/forms/ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renders form fields", () => {
    render(<ContactForm />);
    expect(screen.getByText("Your name")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("validates required fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("John Doe")).toBeRequired();
    expect(screen.getByPlaceholderText("you@example.com")).toBeRequired();
    expect(screen.getByPlaceholderText("How can we help?")).toBeRequired();
    expect(
      screen.getByPlaceholderText(
        "Tell us more about your question or feedback..."
      )
    ).toBeRequired();
  });

  it("renders submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: "Send message" })
    ).toBeInTheDocument();
  });

  it("handles successful submission", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("How can we help?"), {
      target: { value: "General inquiry" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Tell us more about your question or feedback..."
      ),
      { target: { value: "Hello, I have a question." } }
    );

    fireEvent.submit(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(screen.getByText("Message sent!")).toBeInTheDocument();
    });
  });

  it("shows error on failed submission", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("How can we help?"), {
      target: { value: "Bug" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Tell us more about your question or feedback..."
      ),
      { target: { value: "Something broke." } }
    );

    fireEvent.submit(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to send message. Please try again or email us directly."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows send another message button after success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("How can we help?"), {
      target: { value: "Hi" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Tell us more about your question or feedback..."
      ),
      { target: { value: "Hello" } }
    );

    fireEvent.submit(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Send another message" })
      ).toBeInTheDocument();
    });
  });
});
