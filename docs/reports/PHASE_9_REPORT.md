# THE SABBiR — Phase 9 Report: Engineering Lab / Cyber AI expression

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete.**

## Observed problems
1. **Case-study architecture diagrams** were a generic Tailwind box grid with a `GitBranch` icon. They didn't read as an engineering artefact, and the data flow (`source -> target`) was hard to follow.
2. **`/engineering-lab` had no identity of its own.** It was the Home teaser stretched to a page, with no Cyber AI expression.
3. **Lab write-up badges** (result and "Experiment" chip) used off-system purple, blue and green.
4. **Global terminal (`` ` `` launcher and modal):** legacy `glass-panel`, slate and `--color-secondary` styling. The window was `bg-slate-900/95`, which looked grey-blue next to the Lab terminal (`#0b0d12`).
5. **Globe (D21):** `cobe` v2 has **no internal render loop**. Frames are drawn only on `update()`, so the `onRender` rotation callback never ran and the globe was frozen. There was also no off-screen or reduced-motion policy for when it does animate.
6. A "bench log" label appeared twice on `/engineering-lab` (the page rule plus the section eyebrow), with a large gap between them.

## Decisions
- The **Cyber AI expression applies only to technical surfaces**: the Lab, terminals and case-study architecture. These are always dark panels (`#0b0d12`) in both themes, with signal-cyan accents, mono labels and a signal grid. Editorial pages are untouched.
- **Architecture as a readable figure:** numbered component nodes, then a numbered flow list (`1 React Client ──▶ 2 FastAPI Gateway`). It uses no graph library, real text, and semantic `ol`/`ul` with labels.
- **Globe rotation runs on our own `requestAnimationFrame` loop.** It only runs while the canvas intersects the viewport and motion is allowed (both the `data-motion` setting and `prefers-reduced-motion`). Under reduced motion the globe stays a still image.

## Changes implemented
- **New** `src/components/system/Signal.tsx`:
  - `AsciiRule`: a mono divider, `── // label ─────`.
  - `SignalDiagram`: the dark architecture figure.
- `src/components/content/ProjectLayout.tsx`: `ArchitectureGraph` now renders `SignalDiagram` (the unused `GitBranch` import was removed).
- `src/components/content/LabLayout.tsx`: result badges use the ok/accent/neutral tokens; the Experiment chip uses signal tokens.
- `src/app/engineering-lab/page.tsx`:
  - Signal-grid header, breadcrumb, and an `h1` "Engineering **Lab**" with the signal expression.
  - The duplicate rule was removed. The "write-ups" `AsciiRule` now leads the documented write-ups.
- `src/components/lab/EngineeringLabSection.tsx`: the full variant gets tighter top padding (the teaser keeps the chapter rhythm).
- `src/components/ui/TerminalModal.tsx`:
  - Launcher → `surface-glass`, ink text, signal icon, and a `bg-muted` kbd.
  - Window → `#0b0d12` with `signal-edge` and `shadow-e3`.
  - Prompt → fixed cyan (readable on the dark window in both themes).
  - Close → `slate-400`.
- `src/components/maps/Globe.tsx`: a rAF loop driving `globe.update({ phi })`, gated by an IntersectionObserver and the reduced-motion setting; cleanup on unmount.
- `scripts/qa/shots.mjs`: new `sel:<css selector>` target.

## Validation
- `pnpm test` 69/69 · build pass · app `tsc` 0 (the 9 errors are in pre-existing test files only) · `link-audit`: 23 pages, 0 problems.
- **Screenshots:**
  - `/engineering-lab`: desktop light and dark, phone dark.
  - `/projects/omnidesk` architecture figure: desktop dark. 7 numbered nodes, 6 flows, all legible.
- **Global terminal (in-app browser):** the launcher opens the modal, and the window background computes to `rgb(11, 13, 18)`.

## Performance evidence (headless Chrome, idle machine)

| Page / profile | Result |
|---|---|
| `/engineering-lab` phone 4× | idle 60 · scroll 60 fps · LCP 0.29 s · CLS 0 |
| `/projects/omnidesk` phone 4× | idle 60 · scroll 60 fps · LCP 0.46 s · CLS 0 |
| Home desktop 2× | idle 60 · scroll 60 fps · LCP 0.48 s · CLS 0 · JS 267 KB |

## Regressions / risks
- **The globe now actually rotates** (when 3D is enabled and it's on screen). This is intended behaviour that had silently stopped working.
- **On phones, the floating controls** (terminal launcher, settings gear, dock avatar) sit over the bottom of the Lab terminal → Phase 11 (fixed-control choreography).

## Unresolved factual decisions
None.

## Next phase
Phase 10 — Dedicated mobile composition.
