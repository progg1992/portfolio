# ADR 0005: Internal styleguide route, blocked in production

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** PTR-14

## Context

PTR-14 is accepted on a Vercel preview, which means the Client needs to see every component in every state (default, hover, active, focus) on a real deployment. A tool like Storybook would add a second build and a second deployment for a handful of components.

## Decision

Add `/styleguide`, a page that renders every token and every component state. It is `noindex, nofollow` everywhere and calls `notFound()` when `VERCEL_ENV` is `production`, so the public site returns 404 for it. It is not one of the eight routes in scope; it is a review tool.

## Consequences

- Component acceptance happens on previews and staging, with no extra tooling.
- The page is covered by the same axe and layout checks as public routes, so components are tested for accessibility in every state.
- If the styleguide ever needs to be public, that is a change request.
