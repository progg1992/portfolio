# ADR 0006: Self-hosted fonts

- **Status:** Accepted
- **Date:** 2026-10-19
- **Issue:** PTR-12

## Context

The design uses Geist and JetBrains Mono. `next/font/google` downloads fonts from Google at build time; the first build in a restricted network failed for exactly that reason. A build that depends on a third-party fetch is less reproducible, and CI runners are not guaranteed network access to every host.

## Decision

Commit the variable woff2 files to `src/fonts` and load them with `next/font/local`: Geist, Latin subset (100 to 900), and JetBrains Mono, Latin subset (100 to 800). Their SIL Open Font License files sit beside them.

## Consequences

- Builds and visitors make no font requests to third parties.
- About 110 KB of fonts in the repository. They change only when the fonts are deliberately updated.
- `display: swap` with metric-matched fallbacks from `next/font` keeps layout shift at zero.

## Amendment, 2026-10-23 (PTR-20)

Geist is now a Latin subset as well: Basic Latin, Latin-1, general punctuation, arrows, and the euro sign, with the weight axis and all layout features kept. It went from 68 KB to 31 KB. On the home page the hero paragraph is the largest contentful paint, and under Lighthouse's mobile throttling it waits for this font, so the smaller file brings LCP further under the 2.5 s budget. The full font had no glyphs outside the subset that the site uses. Rebuild the subset with:

```
pyftsubset Geist-Variable.woff2 --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD" --layout-features='*' --flavor=woff2 --output-file=Geist-Variable-latin.woff2
```
