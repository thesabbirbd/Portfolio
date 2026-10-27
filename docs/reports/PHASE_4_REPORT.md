# THE SABBiR — Phase 4 Report: Hero & Opening Sequence

**Date:** 2026-10-28 · **Git:** local only, nothing committed/pushed/deployed.
**Note:** the PC hung during validation; the machine restarted. Phase 4 edits were verified intact afterwards. `/tmp` was wiped, so the QA scripts were recreated **inside the repo** under `scripts/qa/` (see below).

## Phase / status
**Complete.**

## Observed problems
- **D20:** the masked full-hero ambient video was the largest remaining desktop frame cost. It costs frames even while paused (it is composited as a large layer).
- **Without JavaScript or before hydration:**
  - The full name kept a Framer `y: 15` initial offset frozen in the HTML, overlapping the wordmark.
  - The rotating role pill started at `opacity: 0` and was missing entirely.
- **Phones lost first-screen space:** `main` reserved 64px at the top on phones even though the phone nav sits at the bottom. On 320×640 the primary CTA was below the fold; on 360×640 it was hidden behind the bottom nav.
- **Short landscape (844×390):** the desktop top nav plus `pt-24` left ~190px for content, and the wordmark was oversized.
- **Bauhaus geometry vs orbit chips (desktop):** the amber sun overlapped "NOC & Network" and the ink bars overlapped "FastAPI".
- **Scroll parallax ignored reduced motion:** `MotionConfig` does not cover style-bound MotionValues.
- **Phone videos:** the Omnidesk and Lab-terminal telemetry loops still played on phones.

## Decisions
- **D20 decided:** the hero ambient video is now part of the opt-in **3D / Spatial effects** setting (off by default, tablet/desktop only). The Settings description says so ("3D scene, globe & ambient hero video (uses more GPU)"). The feature is kept; the default is fast.
- **Kinetic typography, once and cheap:** "THE" and "SABBiR" each rise from a mask (`animate-reveal`, transform only, motion-safe, 0.75 s, 90 ms stagger). No looping text motion.
- **Hierarchy:** display wordmark > statement > role pill. The role pill was reduced from 20px to 16px on desktop.
- **Clear next action:** a static "01 / Identity ↓" link to the first chapter (desktop). No looping bounce.

## Changes implemented
- `src/components/hero/HeroSection.tsx`:
  - Opt-in video gated on `spatial3D`.
  - Parallax disabled for reduced motion (OS setting or the in-app toggle).
  - The kinetic wordmark is a plain `h1`, with no Framer initial transforms baked into the HTML.
  - The full name is a plain `p` with a CSS `rise` entrance.
  - `AnimatePresence initial={false}` for the role pill, so the first role is in the server HTML.
  - The badge fits one line on 320px.
  - Tech pills are hidden on short portrait screens (≤700px tall); the same facts appear in the Identity chapter.
  - Tighter gaps, a smaller short-landscape wordmark, and the next-chapter cue.
- `src/app/globals.css`:
  - `--animate-reveal` keyframe.
  - New `short-portrait` custom variant: `(orientation: portrait) and (max-height: 700px)`.
- `src/components/hero/SpatialCore.tsx`: `short-portrait` sizes for the core, rings and sphere.
- `src/components/system/BauhausField.tsx`: the sun moved to (336, 46), r32, outside the chip ring; the ink bars moved below the FastAPI chip.
- `src/app/layout.tsx`: phones no longer reserve top-nav space (`pt-[max(0.75rem,env(safe-area-inset-top))]`); short landscape uses `pt-16`.
- `src/components/omnidesk/OmnideskSection.tsx`, `src/components/lab/TerminalCard.tsx`: telemetry loops are tablet/desktop only.
- `src/components/ui/SettingsPanel.tsx`: the 3D setting description is now accurate.
- **New QA tooling (repo, no dependencies):**
  - `scripts/qa/cdp.mjs`: shared helper.
  - `scripts/qa/link-audit.mjs`: crawl, with non-200 links and missing `#anchor` checks.
  - `scripts/qa/perf-bench.mjs`: CPU-throttled headless benchmark.
  - `scripts/qa/shots.mjs`: viewport/theme/reduced-motion/no-JS screenshots.

## Validation
- `pnpm test` 69/69 · `pnpm build` pass · app `tsc` 0 errors · `link-audit`: 23 pages, 0 problems.
- **Primary CTA position on the first screen** (headless, light): above the bottom nav at 320×640, 360×640, 360×800, 375×812, 390×844, 402×874, 414×896 and 430×932.
  - 320×640: CTA bottom at 532px (nav at 570).
  - 360×640: CTA bottom at 510px (nav at 570).
- **Screenshots checked:**
  - Desktop light and dark: Bauhaus geometry clear of the chips.
  - 320×640: full identity and CTA visible.
  - 844×390 landscape.
  - Reduced motion.
  - **JavaScript disabled:** wordmark, name, role pill and both CTAs render with no overlap.
- 3D disabled is the default; the hero has no 3D dependency.

## Performance evidence (same machine, same moment, headless Chrome, software GPU)

| Profile | Live sabbir.nav.bd | Local build (after Phase 4) |
|---|---|---|
| Phone 390×844, 4× CPU | JS 557 KB · LCP 4.87 s · CLS 0.295 · idle 11.7 fps · scroll 10.1 fps (median frame 100 ms) | JS 262 KB · LCP 0.42 s · CLS 0 · **idle 60 fps · scroll 60 fps** (median 16.7 ms) |
| Desktop 1440×900, 2× CPU | JS 557 KB · LCP 3.82 s · idle 7 fps · scroll 6.6 fps (median 150 ms) | JS 266 KB · LCP 1.32 s · CLS 0 · **idle 59.7 fps · scroll 60 fps** |

Absolute fps differs from earlier phases. Those runs shared the CPU with a dev server, a prod server and the in-app browser; this one ran on a freshly restarted, idle machine. Compare **within a row**, not across reports. These are not real-device measurements.

## Regressions / risks
- The ambient hero video no longer plays by default. It returns when the visitor enables 3D / Spatial effects.
- In short landscape, the floating Terminal pill and the dock still overlap hero text → **Phase 11** (fixed-control choreography).
- `landscape:min-h-0` (a CLAUDE.md ground rule) also applies to desktop landscape screens, so the desktop hero is content-height (~655px) rather than 90vh. Kept intentionally: the rule is preserved, and the next chapter peeking into view works as an overview cue.

## Unresolved factual decisions
None.

## Next phase
Phase 5 — Identity Matrix and compact information composition.
