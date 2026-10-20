import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
