export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 px-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div
            className="h-8 w-32 animate-pulse rounded-md"
            style={{ backgroundColor: "var(--brand-divider)" }}
          />
          <div className="flex gap-3">
            <div
              className="h-8 w-20 animate-pulse rounded-md"
              style={{ backgroundColor: "var(--brand-divider)" }}
            />
            <div
              className="h-8 w-20 animate-pulse rounded-md"
              style={{ backgroundColor: "var(--brand-divider)" }}
            />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="space-y-4">
          <div
            className="h-10 w-3/4 animate-pulse rounded-md"
            style={{ backgroundColor: "var(--brand-divider)" }}
          />
          <div
            className="h-6 w-1/2 animate-pulse rounded-md"
            style={{ backgroundColor: "var(--brand-divider)" }}
          />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border p-6"
              style={{ borderColor: "var(--brand-border)" }}
            >
              <div
                className="mb-4 h-40 rounded-md"
                style={{ backgroundColor: "var(--brand-divider)" }}
              />
              <div
                className="mb-2 h-5 w-3/4 rounded"
                style={{ backgroundColor: "var(--brand-divider)" }}
              />
              <div
                className="h-4 w-1/2 rounded"
                style={{ backgroundColor: "var(--brand-divider)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
