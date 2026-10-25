import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Vercel sets VERCEL_ENV to "production", "preview", or "development".
// Anything that is not a production deploy must stay out of search results (NFR-12).
const isProduction = process.env.VERCEL_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

// Security headers on every response (PTR-33, ADR 0008). Everything is
// same-origin: fonts are self-hosted, analytics is served from /_vercel, and
// the contact form posts to its own page. 'unsafe-inline' is required for
// scripts because Next.js writes inline data scripts into prerendered pages
// and a nonce would force every page to render on request (ADR 0001).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Two years; browsers ignore it over plain HTTP, so local runs are unaffected.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: isProduction
          ? securityHeaders
          : [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
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
