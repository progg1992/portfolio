# ADR 0004: Static SVG topology at launch; interactive 3D after launch

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** CR-1 (PTR-46), PTR-47, PTR-28, PTR-29

## Context

The design brief called for an interactive 3D network topology in the hero, built with React Three Fiber. A WebGL scene and its library add significant JavaScript, which threatens the 90+ mobile Performance budget. CR-1 also added roughly 17 points of page work with the launch date held at December 11, 2026.

## Decision

Ship a static, accessible SVG topology in the hero at launch. Move the 3D version, and the spike that decides how to build it, to a post-launch release (PTR-47).

## Consequences

- Launch does not depend on WebGL support, GPU performance, or a 3D asset pipeline.
- The static SVG remains the fallback after 3D ships, for `prefers-reduced-motion`, no WebGL, and low-power devices.
- The spike (PTR-28) must show mobile Performance staying at 90+ with 3D enabled before PTR-29 is built.
