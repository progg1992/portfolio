# Test plan

Every requirement in the requirements specification is verified by at least one of the layers below. Automated layers run in CI on every pull request; manual layers run before a story is accepted and again before launch.

## Automated, every pull request

| Layer                    | Tool                                               | What it proves                                                                                              | Command                   |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------- |
| Static analysis          | ESLint (Next, TypeScript, jsx-a11y), zero warnings | Code and markup rules, common accessibility mistakes                                                        | `npm run lint`            |
| Types                    | TypeScript strict                                  | No type errors                                                                                              | `npm run typecheck`       |
| Format                   | Prettier                                           | Consistent formatting                                                                                       | `npm run format:check`    |
| Unit and component       | Vitest, Testing Library                            | Token contrast (33 pairs), component accessibility wiring, content schema                                   | `npm test`                |
| Build                    | `next build`                                       | Every route prerenders static; content validates                                                            | `npm run build`           |
| Accessibility and layout | Playwright, axe-core                               | Zero critical or serious WCAG 2.2 AA violations, no horizontal scroll, one h1, lang set, at 375 and 1440 px | `npm run test:a11y`       |
| Performance and quality  | Lighthouse CI, mobile, median of 3                 | Performance 90+; Accessibility, Best Practices, SEO 100; LCP under 2.5 s; CLS under 0.1                     | `npm run test:lighthouse` |

Run `npm run build` before `test:a11y` and `test:lighthouse`; both test the production build.

## Manual, before a story is accepted

On the Vercel preview, not on localhost:

- [ ] Every acceptance criterion on the PTR issue
- [ ] Layout at 375, 768, and 1440 px matches the design canvas
- [ ] Keyboard only: every control reachable, focus visible, no traps, Escape closes menus
- [ ] Figures in the copy match the resume and have a source in the content model

## Manual, before launch (PTR-31, PTR-32, PTR-33)

| Check            | How                                                             | Pass                                                                               |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Screen reader    | NVDA with Firefox on Windows; VoiceOver with Safari on iOS      | Headings, landmarks, tabs, filter, and form errors announced correctly             |
| Zoom and reflow  | 200% zoom at 1280 px; 320 px viewport                           | No lost content, no horizontal scroll                                              |
| Reduced motion   | OS setting on                                                   | No animation                                                                       |
| Cross-browser    | Chrome, Firefox, Safari (macOS and iOS), Edge, current versions | Layout and interaction correct                                                     |
| Security headers | securityheaders.com on the staging URL                          | Grade A or better                                                                  |
| Dependencies     | `npm audit --omit=dev`                                          | No high or critical findings                                                       |
| Contact form     | Production, end to end                                          | Message arrives; oversized input, header injection, and rapid repeats are rejected |
| Link previews    | LinkedIn Post Inspector                                         | Title, description, and image correct                                              |

## Defects

A failure found in any layer becomes a Bug in YouTrack, with Severity set and the failing check named. Critical and High severity bugs block the release; Medium and Low are triaged into the next sprint or the warranty period.
