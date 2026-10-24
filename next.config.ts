import createMDX from "@next/mdx";
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
  // Case studies are MDX modules imported by the /work routes (ADR 0007).
  pageExtensions: ["ts", "tsx", "mdx"],
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

const withMDX = createMDX({});

export default withMDX(nextConfig);
