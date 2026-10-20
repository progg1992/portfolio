# ADR 0006: Self-hosted fonts

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** PTR-12

## Context

The design uses Geist and JetBrains Mono. `next/font/google` downloads fonts from Google at build time; the first build in a restricted network failed for exactly that reason. A build that depends on a third-party fetch is less reproducible, and CI runners are not guaranteed network access to every host.

## Decision

Commit the variable woff2 files to `src/fonts` and load them with `next/font/local`: Geist (100 to 900) and JetBrains Mono, Latin subset (100 to 800). Their SIL Open Font License files sit beside them.

## Consequences

- Builds and visitors make no font requests to third parties.
- About 110 KB of fonts in the repository. They change only when the fonts are deliberately updated.
- `display: swap` with metric-matched fallbacks from `next/font` keeps layout shift at zero.
