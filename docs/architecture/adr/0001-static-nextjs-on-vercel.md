# ADR 0001: Static Next.js on Vercel

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** PTR-12, PTR-13

## Context

The site has eight routes, no logged-in users, and content that changes a few times a year. It must score 90+ on mobile Lighthouse Performance, cost little to run, and be maintainable by one person with 5 to 10 hours a week.

## Decision

Build with Next.js 16.4 (App Router) and prerender every route at build time. Host on Vercel with a preview deployment per pull request, a stable staging deployment from `staging`, and production from `main`.

Cache Components and Partial Prefetching are enabled, as Next.js recommends from 16.3. No route reads cookies, headers, or other request data, so every route stays static.

## Consequences

- Pages are served from the CDN with no server work, which keeps performance high and the attack surface small.
- The one dynamic piece, the contact form, is a server action (ADR 0003).
- The root layout sets `ensureStatic = "navigation"`, so Next.js fails the build if any route needs request-time rendering. CI also checks the build output.
- The same setting makes an unknown dynamic param wait for its complete static result, so a bad `/work` URL returns a real 404. Without it, Partial Prerendering sent the fallback shell with a 200 on the first request (found by e2e/not-found.spec.ts).
- Vercel's Hobby plan is for non-commercial use. Whether consulting calls-to-action fit it is tracked as risk PTR-44; the Pro plan or a different static host are the fallbacks, and nothing in the build depends on Vercel-only features.
