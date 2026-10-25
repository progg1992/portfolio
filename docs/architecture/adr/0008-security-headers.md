# ADR 0008: Security headers and a static-compatible Content Security Policy

- **Status:** Accepted
- **Date:** 2026-10-24
- **Issue:** PTR-33

## Context

The launch checklist requires a Content Security Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`, with a securityheaders.com grade of A or better. Every page on this site is prerendered (ADR 0001).

Next.js offers two strict CSP routes. Nonces require every page to render on request, because the nonce is written into the HTML per response; that gives up static rendering and Partial Prerendering. Subresource Integrity (experimental) hashes script files, but prerendered pages still carry inline data scripts that a strict `script-src` would block.

## Decision

Set the headers in `next.config.ts` on every response:

| Header                      | Value                                                                                                                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | `default-src 'self'`; scripts and styles `'self' 'unsafe-inline'`; images `'self' data: blob:`; fonts and connections `'self'`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains`                                                                                                                                                                                  |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                                                                                                              |
| `X-Frame-Options`           | `DENY`                                                                                                                                                                                                                 |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                                                                                                                                                                      |
| `Permissions-Policy`        | camera, microphone, geolocation, payment, USB, and browsing topics all off                                                                                                                                             |

No third-party origin is allowed anywhere. Fonts are self-hosted (ADR 0006), analytics is served from the site's own `/_vercel` path (PTR-35), and the contact form posts to its own page (ADR 0003).

## Consequences

- `'unsafe-inline'` for scripts is the cost of keeping every page static. The risk it leaves is script injection through content, and the site renders no user-supplied content: the only input is the contact form, which is emailed and never displayed. Same-origin-only sources still block loading scripts from anywhere else.
- `includeSubDomains` applies HSTS to every subdomain of the production domain, including ones added later. Each one must serve HTTPS. Do not add `preload` without a separate decision; it is hard to undo.
- Adding any third-party service (a font CDN, an embed, a script) requires a CSP change in the same pull request. `e2e/security.spec.ts` fails if a page triggers a CSP violation or if the policy names an external origin.
- If the site ever renders user content, revisit this ADR and move to nonces.
