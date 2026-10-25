# Architecture overview

The site is a set of statically prerendered pages served from Vercel's edge, with one server action for the contact form. There is no database, no CMS, and no server to maintain.

```
Visitor
  │  HTTPS
  ▼
Vercel edge (TLS, CDN cache, security headers)
  │
  ├── Static HTML, CSS, fonts, images        every route, prerendered at build
  │
  └── Server action: contact form            the only code that runs per request
        │  validate, rate limit, honeypot
        ▼
      Transactional email provider  ──►  Client's inbox
```

## What runs where

| Concern      | Where                                                                                              | Notes                                                      |
| ------------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Pages        | Built once by `next build`, served as static files                                                 | CI fails if any route renders dynamically                  |
| Case studies | MDX files in `src/content/work/`, validated at build                                               | Invalid frontmatter or an unsourced metric fails the build |
| Contact form | Next.js server action on Vercel                                                                    | Re-validates every field; nothing is stored                |
| Analytics    | Vercel Web Analytics: cookieless page-view counts; Vercel builds only (Hobby has no custom events) | No personal data, no consent banner needed                 |
| Fonts        | Self-hosted woff2 in `src/fonts`                                                                   | No third-party requests at build or run time               |

## Environments

| Environment | Branch           | URL                                  | Indexed |
| ----------- | ---------------- | ------------------------------------ | ------- |
| Preview     | any pull request | Vercel preview URL, posted on the PR | No      |
| Staging     | `staging`        | Stable Vercel staging URL            | No      |
| Production  | `main`           | Custom domain (PTR-10)               | Yes     |

## Decisions

Each significant choice has an ADR in `adr/`. Status values: Proposed, Accepted, Superseded.

| ADR                                           | Decision                                                     | Status   |
| --------------------------------------------- | ------------------------------------------------------------ | -------- |
| [0001](adr/0001-static-nextjs-on-vercel.md)   | Static Next.js on Vercel                                     | Accepted |
| [0002](adr/0002-no-database.md)               | No database; form submissions are emailed                    | Accepted |
| [0003](adr/0003-contact-form-delivery.md)     | Contact form via server action and a transactional email API | Proposed |
| [0004](adr/0004-static-topology-at-launch.md) | Static SVG topology at launch; 3D after launch               | Accepted |
| [0005](adr/0005-styleguide-route.md)          | Internal styleguide route, blocked in production             | Accepted |
| [0006](adr/0006-self-hosted-fonts.md)         | Self-hosted fonts                                            | Accepted |
| [0007](adr/0007-case-study-content-model.md)  | MDX case studies with schema-validated metadata              | Accepted |
| [0008](adr/0008-security-headers.md)          | Security headers; static-compatible CSP                      | Accepted |
