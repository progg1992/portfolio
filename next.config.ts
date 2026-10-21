import type { NextConfig } from "next";

// Vercel sets VERCEL_ENV to "production", "preview", or "development".
// Anything that is not a production deploy must stay out of search results (NFR-12).
const isProduction = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  async headers() {
    if (isProduction) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // Cache Components with Partial Prefetching, as recommended for Next.js 16.3+.
  // Every page on this site is static; nothing reads cookies or headers.
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
