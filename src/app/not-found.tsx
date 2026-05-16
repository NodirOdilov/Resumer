import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold" style={{ color: "var(--brand-primary)" }}>
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold" style={{ color: "var(--brand-text)" }}>
          Page not found
        </h2>
        <p
          className="mt-2 max-w-md text-base"
          style={{ color: "var(--brand-text-secondary)" }}
        >
          The page you are looking for does not exist or has been moved. Please
          check the URL or navigate back to the homepage.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--brand-border)",
              color: "var(--brand-text-secondary)",
            }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
