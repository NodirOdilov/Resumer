import type { NextConfig } from "next";

// Allow images from the Railway backend by deriving its hostname from
// NEXT_PUBLIC_API_URL at build time. Falls back to a permissive Railway
// wildcard so previews still work.
function backendImagePatterns() {
  const patterns: Array<{
    protocol: "http" | "https";
    hostname: string;
    port?: string;
  }> = [
    { protocol: "https", hostname: "api.resumer.com" },
    { protocol: "https", hostname: "cdn.resumer.com" },
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    { protocol: "http", hostname: "localhost", port: "8000" },
    { protocol: "https", hostname: "**.up.railway.app" },
    { protocol: "https", hostname: "**.railway.app" },
    { protocol: "https", hostname: "**.s3.amazonaws.com" },
    { protocol: "https", hostname: "**.amazonaws.com" },
    { protocol: "https", hostname: "**.vercel.app" },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const { hostname, protocol } = new URL(apiUrl);
      patterns.push({
        protocol: protocol === "https:" ? "https" : "http",
        hostname,
      });
    } catch {
      // Ignore malformed URL; the wildcards above will cover Railway domains.
    }
  }
  return patterns;
}

const nextConfig: NextConfig = {
  // Tell Next not to walk into the sibling Python/Kubernetes/Terraform trees
  // that share the repo root. Without this it tries to fingerprint half a
  // gigabyte of unrelated files at build time.
  outputFileTracingExcludes: {
    "*": [
      "./.next/cache/**/*",
      "./node_modules/.cache/**/*",
      "./resumer/**/*",
      "./k8s/**/*",
      "./terraform/**/*",
      "./monitoring/**/*",
      "./nginx/**/*",
      "./.git/**/*",
      "./.github/**/*",
      "./scripts-frontend/**/*",
    ],
  },

  images: {
    remotePatterns: backendImagePatterns(),
  },

  // i18n is handled via middleware (App Router doesn't support next.config i18n)

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "framer-motion",
    ],
    // Workaround for Next 15.5 trace-collection bug on Windows.
    // No effect on Vercel's Linux build.
    workerThreads: false,
    cpus: 1,
  },

  reactStrictMode: true,

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirect older URL shapes that still appear in older indexed pages,
  // marketing copy, and the previously-deployed footer to their canonical
  // routes. 308 = permanent.
  async redirects() {
    return [
      // Builders
      { source: "/resume/builder", destination: "/resume-builder", permanent: true },
      { source: "/cv/builder", destination: "/cv-builder", permanent: true },
      { source: "/cover-letter/builder", destination: "/cover-letter-builder", permanent: true },

      // "How to write" alias
      { source: "/resume/how-to-write", destination: "/resume/how-to", permanent: true },
      { source: "/cv/how-to-write", destination: "/cv/how-to", permanent: true },
      { source: "/cover-letter/how-to-write", destination: "/cover-letter/how-to", permanent: true },

      // Free template aliases
      { source: "/resume-templates/free", destination: "/resume/free-templates", permanent: true },
      { source: "/cv-templates/free", destination: "/cv-templates", permanent: true },
      { source: "/cover-letter-templates/free", destination: "/cover-letter/free-templates-word", permanent: true },

      // Legal short URLs
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/cookies", destination: "/cookies-and-tracking", permanent: true },

      // Blog now exists as its own index page; only redirect deep blog/[slug]
      // to /career-advice as a graceful fallback for any old links.
      { source: "/blog/:slug*", destination: "/career-advice", permanent: false },

      // CV vs resume comparison page (we don't have it — send to CV hub)
      { source: "/cv/cv-vs-resume", destination: "/cv", permanent: true },

      // Cover letter aliases that don't have dedicated pages
      { source: "/cover-letter/resignation", destination: "/cover-letter", permanent: true },
      { source: "/cover-letter/thank-you", destination: "/cover-letter", permanent: true },

      // Legacy /interviews → /job-interviews (one-level)
      { source: "/interviews", destination: "/job-interviews", permanent: false },
      { source: "/interviews/:slug", destination: "/job-interviews/:slug", permanent: false },

      // Legacy /career → /career-advice (one-level)
      { source: "/career", destination: "/career-advice", permanent: false },
      { source: "/career/:slug", destination: "/career-advice/:slug", permanent: false },

      // App area aliases the older /app/... shape
      { source: "/app/resume/new", destination: "/build-resume", permanent: true },
      { source: "/app/cv/new", destination: "/build-cv", permanent: true },
      { source: "/app/cover-letter/new", destination: "/build-letter", permanent: true },
      // /pricing now exists as a real page — no redirect.

      // Marketing landing also links to /resume-builder via the hero CTA;
      // the demo build uses /build-resume in the (app) area for editing.
      // Both routes exist, so no redirect needed there.
    ];
  },
};

export default nextConfig;
