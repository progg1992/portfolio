# Design specification

The visual source of truth is the design canvas "Pierce Rogg Portfolio": artboards for every page at 1440 px, the home page at 768 and 375 px, and a components-and-states sheet. This document records what the build must match and where it deliberately differs.

## Direction

Dark, technical, and quiet. Rich dark surfaces instead of pure black, crisp white headings, muted gray body copy. Cyan and purple are reserved for active states, status indicators, network nodes, and calls to action. Monospace marks anything that reads as data: tags, metrics, paths, labels.

## Tokens

Defined once in `src/app/globals.css` under `@theme`. Contrast is enforced by `src/lib/tokens.test.ts`, which reads that file directly.

| Token                   | Value                       | Use                                   |
| ----------------------- | --------------------------- | ------------------------------------- |
| `obsidian`              | #09090B                     | Page background                       |
| `charcoal`              | #121214                     | Alternate section background          |
| `slate`                 | #18181B                     | Cards and inputs                      |
| `ink`                   | #FAFAFA                     | Headings and primary text             |
| `muted`                 | #A1A1AA                     | Body copy                             |
| `subtle`                | #8A8A93                     | Small labels, captions, placeholders  |
| `line` / `line-strong`  | #27272A / #3F3F46           | Decorative borders and rules          |
| `control`               | #6B6B75                     | Form control borders                  |
| `cyan`                  | #06B6D4                     | Primary CTA, active state, focus ring |
| `purple`                | #A855F7                     | Borders, dots, glows                  |
| `purple-text`           | #B17AF8                     | Purple text                           |
| `ok` / `warn` / `error` | #22C55E / #EAB308 / #F87171 | Status                                |

### Deviations from the brief

The brief required strict compliance with its palette. Three values failed WCAG 2.2 AA, which the SOW also requires, so accessibility wins:

| Brief value             | Problem                                      | Replacement                                                     |
| ----------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| #71717A for small text  | 3.67 to 4.12:1, under 4.5:1 on every surface | `subtle` #8A8A93, 5.18:1 or better                              |
| #A855F7 as text color   | 4.48:1 on slate                              | `purple-text` #B17AF8, 5.91:1. #A855F7 stays for non-text uses. |
| #3F3F46 as input border | 1.70:1, under the 3:1 non-text minimum       | `control` #6B6B75, 3.36:1 or better                             |

## Type

| Style   | Font           | Size                                                         | Weight     |
| ------- | -------------- | ------------------------------------------------------------ | ---------- |
| Display | Geist          | clamp(48 px, 7vw, 88 px), line height 0.98, tracking -0.04em | 700        |
| Heading | Geist          | clamp(30 px, 3.6vw, 44 px), tracking -0.03em                 | 700        |
| Title   | Geist          | 22 px                                                        | 600        |
| Body    | Geist          | 16 to 19 px                                                  | 400        |
| Mono    | JetBrains Mono | 12 to 14 px                                                  | 400 to 600 |

## Components and states

Every interactive component has default, hover, active, and focus states, shown on `/styleguide` (ADR 0005).

| Component          | File                                 | Notes                                                                        |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| Button, ButtonLink | `src/components/ui/button.tsx`       | Primary (cyan) and secondary. Navigation uses ButtonLink, so it is an `<a>`. |
| Tag, FilterButton  | `src/components/ui/tag.tsx`          | FilterButton exposes `aria-pressed`.                                         |
| StatusBadge        | `src/components/ui/status-badge.tsx` | The dot is decorative; the text carries meaning.                             |
| TextField          | `src/components/ui/text-field.tsx`   | Visible label, `aria-invalid`, message linked by `aria-describedby`.         |
| TerminalTab        | `src/components/ui/terminal-tab.tsx` | Roving tabindex; arrow-key handling lives in the terminal (PTR-25).          |

Focus is a 2 px cyan outline, offset 3 px, on every focusable element. Minimum target size is 44 by 44 px for primary controls.

## Breakpoints

Layouts are fluid between these widths, and are checked at each one:

| Width   | Behavior                                                              |
| ------- | --------------------------------------------------------------------- |
| 375 px  | Single column. Header links collapse into a menu button below 820 px. |
| 768 px  | Two-column grids where content allows.                                |
| 1440 px | Full layout; content max width 1240 px.                               |

No page may scroll horizontally at 320 px or at 200% zoom.

## Motion

| Effect                    | Spec                                                                                      | Reduced motion |
| ------------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| Cursor glow               | 280 px radial cyan at 8% opacity, follows the pointer inside cards; fades out over 200 ms | Off            |
| Page and tab transitions  | 160 ms cross-fade                                                                         | Instant        |
| Status dots               | Pulse once on first view                                                                  | Static         |
| 3D topology (post-launch) | Tilt up to 6 degrees toward the pointer, drift at 0.3x scroll                             | Static SVG     |

Motion never runs on touch devices and never causes layout shift.
