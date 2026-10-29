# THE SABBiR — v4.0.1 · Phases 4–9 Report

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

These six phases built on the large v4.0 redesign (committed by the owner as `release(v4.0)`), which already provided:
- the card, button and section primitives;
- the CSS reveal system;
- the career timeline with its mobile selector;
- the fixed-control choreography.

The v4.0.1 work here refines that system. It does not rebuild it. The gate evidence comes from the final production-build audit run; see `PHASE_15_FINAL_REPORT.md`.

## Phase 4 — Shared design language · PASS
**One set of primitives, one motif per theme, in CSS only** (no extra DOM, no animation). The block is `SHARED DESIGN LANGUAGE` in `src/app/globals.css`.

| | Orange · Royal | Green · Studio | Blue · Tech |
|---|---|---|---|
| Card radius (`--radius-card`) | 20 px (refined) | 24 px (soft, Bauhaus) | 14 px (tight, technical) |
| Section eyebrow bar | Art-Deco double hairline | dot + bar | dashed schematic rule |
| Card corner (`.deco-corners`) | hairline corners | quarter-circle accent | signal-coloured brackets |
| Elevation | standard | deeper "clay" `--elev-1` | standard |

- `SectionHeader` now carries the `eyebrow-bar` class, so every section header picks up the motif.
- Spacing, type, borders and shadows still come from the shared tokens. The shadow hue follows the theme (Phase 3).
- **Gate:** theme contrast 0 failures; mobile-audit 0 overflow findings for green and blue (Phase 4 run); final responsive matrix 0 findings.

## Phase 5 — Homepage composition · PASS
Home stays the curated overview, and each chapter hands off to its real route. The Aiyaar chapter was tightened on phones:
- section padding `py-10` → `py-8`;
- the second paragraph shows from `sm` up;
- the feature spotlight shows the first 4 of 8 areas on phones, with the rest one tap away on `/aiyaar`.

**Gate (no important content orphaned):**
- Nothing was removed. Every trimmed detail lives on `/aiyaar`, which Home links to from the hero badge, the Aiyaar chapter heading and its CTA.
- The link inventory reports **0 orphan routes**: every sitemap route has inbound links.

## Phase 6 — Cinematic motion system · PASS
- **Shared presets** (`src/lib/motion-presets.ts`): durations aligned with the CSS tokens — fast 150 ms, base 300 ms, slow 500 ms. Before this they were 200/400/800 ms, out of sync with CSS.
- **New `swapTransition` preset** (0.35 s, expo-out) used by both:
  - the route transition (`src/app/template.tsx`);
  - the hero role swap.
- **Rules kept:**
  - native scroll only;
  - transform and opacity only (no layout properties animated);
  - first load paints immediately from server HTML; only client navigations get the soft entrance;
  - reduced motion is honoured by `MotionConfig` and by global CSS rules.
- **Gate:** the interaction audit covers keyboard (⌘K, "/", Esc, Tab trap), anchors (`/#contact`, `/experience#skills`) and route changes; see Phase 15.

## Phase 7 — Timeline · PASS
- **Dates added only where the CV documents them** (`period?` in `src/data/journey.ts`):

| Phase | Period |
|---|---|
| Management | 2021 – exp. 2026 |
| IT Support | 2021 – 2022 |
| Networking | 2025 |
| Python | 2023 – 2024 |
| Backend | 2026 – now |

- **Phases without a documented date show none.** No chronology was invented.
- Dates render in the desktop rail card, the sticky detail panel and the Home preview.
- **Gate:** the content-integrity unit test checks timeline years against the CV. Keyboard and touch parity come from the existing selector, which is covered by the interaction audit.

## Phase 8 — Floating controls · PASS
- The IdentityDock on phones is now a **stable anchor that moves vertically only**.
  - Its collapsed target is `{ x: rightShift, y: navHidden ? −(DOCK_RAISE − CORNER_RAISE) : −DOCK_RAISE }`.
  - It no longer slides sideways when the bottom nav hides or shows. That sideways slide was the "zig-zag".
- The terminal launcher, Settings gear and nav keep their shared choreography (`src/lib/fixed-controls.ts`).
- **Gate:** `controls-choreo` gained a `dockXTravel` metric.
  - It measured **0 px horizontal travel** at 390×844, 320×640, 360×800 and 844×390.
  - There were **0 collisions and 0 jumps**.

## Phase 9 — Purposeful 3D · PASS
- **The hero's orbiting skill nodes are now real links to evidence.** Before, they were decorative `cursor-default` chips.

| Node | Goes to |
|---|---|
| FastAPI | `/projects/omnidesk` |
| PostgreSQL | `/projects/omnidesk` |
| Docker | `/experience#skills` |
| Ollama / AI | `/projects/ollama-bench` |
| Ubuntu / Linux | `/journal/ubuntu-dev-environment` |
| NOC & Network | `/projects/noc-router` |

- Each node has an `aria-label` and a `title`, plus a visible focus ring. The content-integrity test checks that every target exists.
- **Fallbacks:**
  - The nodes are hidden on phones and in short landscape, where they would crowd the portrait.
  - The optional WebGL scene (`SpatialScene`) stays **off by default** (Settings → 3D).
  - The scene subscribes to the theme store instead of polling.
  - With 3D off, with reduced motion, or without WebGL, the static portrait composition is shown.
- **Gate:** the resilience audit (no-JS / reduced-motion) and the link inventory; see Phase 15.
