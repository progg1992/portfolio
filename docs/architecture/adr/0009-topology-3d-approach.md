# ADR 0009: CSS 3D hero for everyone; React Three Fiber in a desktop-only section below the fold

- **Status:** Proposed
- **Date:** 2026-11-04
- **Issue:** PTR-28 (spike), PTR-29, PTR-47; follows ADR 0004

## Context

ADR 0004 shipped a static SVG topology at launch and left the 3D version to a spike. The spike question was: can a React Three Fiber (R3F) topology load after first paint and still keep mobile Lighthouse Performance at 90 or above?

Three approaches were built as prototypes on the branch `spike/PTR-28-topology`, which is not merged:

- **A, R3F in the hero:** `three` 0.187.0 and `@react-three/fiber` 9.8.2, with an 8-node glTF model (25.6 KB, 7.8 KB gzip) generated from the SVG's layout. A client component waits for the `load` event and then for browser idle time. It checks for WebGL 2 and `prefers-reduced-motion`, and only then imports the scene. The static SVG stays in place until the scene is ready and remains the accessible image.
- **B, CSS 3D in the hero:** the existing SVG with `perspective`, a slow `rotateX`/`rotateY` sway and a pulsing core node, all in CSS. No JavaScript. It does not animate under `prefers-reduced-motion`.
- **C, hybrid:** B in the hero for every device, plus the R3F scene in its own section below the fold, on desktops only.
  - The section is hidden below 1024 px.
  - The loader requires a fine pointer with hover, WebGL 2, and no `prefers-reduced-motion`.
  - It imports the scene during idle time once the section is within one screen of the viewport.
  - Rendering pauses when the section is off screen or the tab is hidden.

C was added at the Client's request after A's results, to keep 3D on desktops without touching phones.

## Method

Each variant was built as a production build (`VERCEL_ENV=production`) and served with `next start`. All runs were on one machine on Nov 4, 2026. Absolute numbers run a little slower than CI (the static page's mobile LCP here is 2,551 ms against a CI budget of 2,500 ms). Compare the variants with each other, not with the CI budgets.

- **JavaScript weight:** every script and model file the home page fetched in Chromium at phone width. Sizes are split into what arrived before and after the `load` event, and measured as gzip level 9, the same measure as `scripts/check-js-budget.mjs`.
- **Lighthouse 12.6.1:** five runs on `/`, median reported.
  - Mobile used the settings in `lighthouserc.json`: simulated throttling and a 412 x 823 screen at 1.75x.
  - Desktop used Lighthouse's desktop preset.
- **Scrolling (C only):** Chromium at 1440 x 900, scrolling with the mouse wheel 100 px every 50 ms from the top to the section. Each scroll was followed by a 5 s wait, and the longest main-thread task after scrolling began was recorded. Three runs each at normal CPU speed and with the CPU slowed 4x.
- **Clicks during loading (C only):** the section was brought within one screen, then a control on screen was clicked 0, 100, 250 and 500 ms after the scene import began. The slowest interaction (input to next paint, from the Event Timing API) was recorded, at normal CPU speed and 4x slower.

Scripts: `scripts/spike/topology-glb.mjs`, `measure.mjs`, `interaction.mjs` and `run.sh`, with raw results in `scripts/spike/results/`, all on the spike branch.

Limit: headless Chromium renders WebGL in software (SwiftShader), which makes WebGL setup slower than on a real GPU. The scroll and click figures for C are therefore pessimistic.

## Results

### Lighthouse and weight

| Measure (median of 5)               | Static SVG (today) | B, CSS 3D | A, R3F in hero | C, hybrid |
| ----------------------------------- | ------------------ | --------- | -------------- | --------- |
| JS before `load`, gzip, phone width | 141.6 KB           | 141.6 KB  | 141.6 KB       | 141.9 KB  |
| JS and model after `load`, gzip     | 4.3 KB             | 4.3 KB    | 260.9 KB       | 4.3 KB    |
| Mobile Performance score            | 97                 | 97        | **72**         | 97        |
| Mobile Total Blocking Time          | 41 ms              | 42 ms     | 1,355 ms       | 42 ms     |
| Mobile LCP                          | 2,551 ms           | 2,571 ms  | 2,593 ms       | 2,578 ms  |
| Mobile CLS                          | 0                  | 0         | 0              | 0         |
| Desktop Performance score           | 100                | not run   | 84             | 100       |
| Desktop Total Blocking Time         | 0 ms               | not run   | 358 ms         | 0 ms      |

On C, the R3F chunk (248.8 KB gzip) loads only when a desktop visitor scrolls toward the section. Lighthouse does not scroll, so C's desktop score of 100 means the top of the page is free. It does not mean the scene is free. The scroll and click tests below measure the scene's cost.

### C: scrolling to the section and clicking while it loads

| Measure                                  | Normal CPU          | CPU 4x slower         |
| ---------------------------------------- | ------------------- | --------------------- |
| Longest main-thread task while scrolling | 112 to 121 ms       | 189 to 247 ms         |
| Long tasks per scroll                    | 1                   | 1                     |
| Scene import to first frame              | 2.6 to 3.0 s        | 3.4 to 3.7 s          |
| Slowest click at 0, 100, 250 and 500 ms  | 128, 72, 96, 120 ms | 192, 120, 176, 160 ms |

At normal speed, every click stays under the 200 ms interaction budget from PTR-32, and the one freeze while scrolling is about 120 ms. With the CPU slowed 4x, every click still stays under 200 ms, but only just (192 ms worst). The single freeze while scrolling reaches 247 ms, which a visitor on a slow laptop would feel as one stutter.

## Decision

The answer to the spike question is no: an R3F topology that loads on phones cannot keep mobile Performance at 90 (A scores 72).

PTR-29 builds C, the hybrid:

- **Hero:** the CSS 3D treatment of the existing SVG on every device (B). No added JavaScript, and the score is unchanged.
- **Below the fold:** a desktop-only section with the R3F scene. It loads during idle time once the section is within one screen, and pauses when off screen or in a background tab.

To bring the slow-laptop stutter under budget, PTR-29 adds one change to the measured prototype: the import waits until scrolling has stopped for 300 ms. The one long task then lands while the visitor is reading, not mid-scroll. PTR-29 must show that this works before it is accepted.

## Consequences

- `three` and `@react-three/fiber` become dependencies, but they never load on phones, on tablets without a fine pointer, without WebGL 2, or under `prefers-reduced-motion`.
- Some iPads with a trackpad report a fine pointer and will load the scene. They can handle it.
- The hero is the same for every visitor. The 3D model is a desktop extra, and the static SVG remains the fallback (ADR 0004).
- PTR-29 acceptance criteria:
  1. Mobile and desktop Lighthouse Performance unchanged from the static page within run-to-run noise.
  2. Initial JavaScript still under the 150 KB gzip budget.
  3. A Playwright test at 1440 px with the CPU slowed 4x, which scrolls to the section and fails on any interaction over 200 ms or any long task over 200 ms while scrolling.
  4. A desktop Lighthouse run added to CI, with a minimum score of 95.
  5. The scene has node labels and uses the site's color tokens.
  6. The section has an accessible name, and the canvas is hidden from assistive technology.
- The section needs a heading and short copy, for the Client to approve.
