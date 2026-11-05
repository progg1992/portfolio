# ADR 0009: CSS 3D for the hero topology, not React Three Fiber

- **Status:** Proposed
- **Date:** 2026-11-04
- **Issue:** PTR-28 (spike), PTR-29, PTR-47; follows ADR 0004

## Context

ADR 0004 shipped a static SVG topology at launch and left the 3D version to a spike. The spike question was: can a React Three Fiber (R3F) topology load after first paint and still keep mobile Lighthouse Performance at 90 or above?

Two approaches were built as prototypes on the branch `spike/PTR-28-topology`, which is not merged:

- **A, R3F:** `three` 0.187.0 and `@react-three/fiber` 9.8.2, with an 8-node glTF model (25.6 KB, 7.8 KB gzip) generated from the SVG's layout. A client component waits for the `load` event, then for browser idle time, checks for WebGL 2 and `prefers-reduced-motion`, and only then imports the scene. The static SVG stays in place until the scene is ready and remains the accessible image.
- **B, CSS 3D:** the existing SVG with `perspective`, a slow `rotateX`/`rotateY` sway and a pulsing core node, all in CSS. No JavaScript. It does not animate under `prefers-reduced-motion`.

## Method

Each variant was built as a production build (`VERCEL_ENV=production`) and served with `next start`. On each build, two measurements were taken:

- **JavaScript weight:** every script and model file the home page fetched in Chromium, split into what arrived before and after the `load` event. Sizes are gzip level 9, the same measure as `scripts/check-js-budget.mjs`.
- **Lighthouse 12.6.1:** five runs on `/`, with the median reported.
  - Mobile used the settings in `lighthouserc.json`: simulated throttling and a 412 x 823 screen at 1.75x.
  - Desktop used Lighthouse's desktop preset.

All runs were on one machine on Nov 4, 2026. Absolute numbers run a little slower than CI. On this machine the static page's LCP is 2,551 ms, against a CI budget of 2,500 ms. Compare the variants with each other, not with the CI budgets.

The scripts are `scripts/spike/topology-glb.mjs`, `scripts/spike/measure.mjs` and `scripts/spike/run.sh`, all on the spike branch.

## Results

| Measure (median of 5)           | Static SVG (today) | B, CSS 3D | A, R3F                                          |
| ------------------------------- | ------------------ | --------- | ----------------------------------------------- |
| JS before `load`, gzip          | 141.6 KB           | 141.6 KB  | 141.6 KB                                        |
| JS and model after `load`, gzip | 4.3 KB             | 4.3 KB    | 260.9 KB (R3F and three 248.8 KB, model 7.8 KB) |
| Mobile Performance score        | 97                 | 97        | **72** (71 to 72 in every run)                  |
| Mobile Total Blocking Time      | 41 ms              | 42 ms     | 1,355 ms                                        |
| Mobile Time to Interactive      | 2,598 ms           | 2,653 ms  | 4,534 ms                                        |
| Mobile LCP                      | 2,551 ms           | 2,571 ms  | 2,593 ms                                        |
| Mobile CLS                      | 0                  | 0         | 0                                               |
| Desktop Performance score       | 100                | not run   | 84 (84 to 90)                                   |
| Desktop Total Blocking Time     | 0 ms               | not run   | 358 ms                                          |

Loading after first paint does keep the initial bundle and LCP unchanged. It does not keep the score. Lighthouse's trace runs until the page is quiet, and parsing and starting 249 KB of three.js and R3F is about 1.3 seconds of main-thread work on a throttled phone. A real phone pays the same cost, so delaying the import further would only hide it from the test. It would also break the 200 ms interaction budget from PTR-32 for anyone who taps during that window.

## Decision

The answer to the spike question is no: an R3F topology that loads on mobile cannot keep mobile Performance at 90.

PTR-29 builds approach B, the CSS 3D treatment of the existing SVG. It costs no JavaScript, does not change the score, keeps one accessible image, and degrades to the static SVG under `prefers-reduced-motion`.

R3F is not adopted. If a true 3D model is wanted later, the only variant worth measuring is one that loads only when a desktop visitor asks for it (a "view in 3D" control). That control would still have to pass the 200 ms interaction budget on the click that loads it, and this spike suggests it would not without a smaller renderer than R3F.

## Consequences

- No `three` or `@react-three/fiber` dependency, and no glTF pipeline, in the site.
- The hero keeps one SVG for every visitor. Its 3D effect is a tilt and sway, not a model a visitor can rotate.
- ADR 0004's fallback rule still holds. Under `prefers-reduced-motion` the hero shows the static SVG.
- PTR-29's acceptance criteria should require the score, Total Blocking Time and JavaScript weight to be unchanged from the static page within run-to-run noise.
