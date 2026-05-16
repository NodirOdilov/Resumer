"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--brand-error)", opacity: 0.1 }}
        >
          <svg
            className="h-8 w-8"
            style={{ color: "var(--brand-error)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1
          className="mt-6 text-2xl font-semibold"
          style={{ color: "var(--brand-text)" }}
        >
          Something went wrong
        </h1>
        <p
          className="mt-2 max-w-md text-base"
          style={{ color: "var(--brand-text-secondary)" }}
        >
          An unexpected error occurred. Our team has been notified and is working
          on a fix. Please try again.
        </p>
        {error.digest && (
          <p
            className="mt-2 text-xs"
            style={{ color: "var(--brand-text-muted)" }}
          >
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--brand-border)",
              color: "var(--brand-text-secondary)",
            }}
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
