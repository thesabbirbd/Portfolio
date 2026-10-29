# THE SABBiR — v4.0.1 · Phase 1 Report: Performance foundation

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

## Status
**PASS.** Tests, build and lint pass. Every fix targets a cause measured in Phase 0.

> **Benchmark hygiene:** the owner's Remotion/ffmpeg video renders pushed load to 11–19 during part of this phase. Timing numbers below were taken only with load under 4. While load was high, I used only load-independent evidence (bytes, counts, request timestamps).

## Fixes (cause → change → evidence)

### 1. Oversized images on Home (mobile data and LCP)

**Omnidesk screenshots.**
- **Cause:** they rendered with `unoptimized`, `quality={100}` and `sizes="100vw"`, so phones received the raw 507 KB PNG.
- **Change:** they now go through the optimiser with sizes matching the measured widths (332 px on phone, 678 px on tablet, 1174 px at most). The CSS `contrast(1.05)` filter is removed.
- **Evidence:** 31 KB WebP at 1080w (7–15 KB at phone widths), versus 507 KB before.

**Hero portrait (the LCP image).**
- **Cause:** `quality={100}` with `sizes` of 300/600 px. A 3× phone fetched the 1080w file at 227 KB.
- **Change:** default quality, `sizes="(max-width: 639px) 215px, 320px"`, and the CSS filter removed.
- **Evidence:** 640w drops from 150 KB to 30 KB.

**Author avatar on articles.** A raw `<img>` replaced with `next/image`, which also clears the lint warning.

**Result: Home image transfer on the phone profile went from 555 KB to 74 KB.**

### 2. Analytics competing with hydration and the first taps
- **Cause:** GA4 and Microsoft Clarity loaded with `lazyOnload`, i.e. right after `load`. In Phase 0 they doubled long-task time: 2.9 s with them, 1.3 s blocked.
- **Change:** new `src/components/system/DeferredThirdParty.tsx` replaces both inline `<Script>`s. It uses the same GA ID and Clarity ID, and injects them about 3.5 s after `load` in the next idle period. It runs in production builds only, so local development never sends analytics. Vercel Analytics and Speed Insights still record every page view immediately.
- **Evidence:**
  - Requests now start at **5.48 s** (the load event was at 1.32 s). GA, Clarity, `clarity.js` and `collect` beacons all still fire.
  - **Long tasks in the first 3 s** (phone, 4× CPU, three runs): **1.35–1.51 s** with analytics, versus **1.34–1.42 s** with analytics blocked. The first seconds are now effectively analytics-free.
- **Trade-off (deliberate):**
  - The analytics cost still exists; it now lands around 5–6 s. When it falls inside a benchmark window, Home idle can dip to 40 fps for a moment (scroll 57.8–59.3 fps, versus 59.5–59.6 fps blocked).
  - GA and Clarity miss visits shorter than about 5 s. Vercel Analytics still counts them.

### 3. Duplicate scroll listeners forcing style recalculation
- **Cause:** `MorphingNav` kept its own `scroll` listener reading `window.scrollY`, alongside the shared nav-visibility store and framer `useScroll`. Each extra read can force a style recalc while CSS scroll-driven reveals run (Phase 0 trace: 55 forced recalcs in 3 s).
- **Change:** the shared store (`src/hooks/useNavVisibility.ts`) now also owns "left the top" via the new `useScrolledPastTop()`, and MorphingNav's listener is gone.
- **Evidence:** window scroll listeners went from 5 to 4. A unit test asserts both hooks share one listener.

### 4. Blurred fixed layers on phones (real-GPU cost)
- **Cause:**
  - `backdrop-filter` blur on always-visible fixed controls: the nav pill, IdentityDock, and the terminal and settings buttons.
  - A full-viewport `grain-overlay` alpha layer above all content.
- **Change:**
  - New `.surface-control`: glass (16 px blur) from 768 px up, and an opaque 94% surface with **no blur on phones**. Applied to all four fixed controls.
  - The grain overlay now renders from 768 px up only.
- **Evidence:** visible `backdrop-filter` elements on Home (phone) went from 2 to **0**. This cannot be timed in headless Chrome, which uses software compositing; it is a known mobile-GPU cost the brief also calls out.

## Not changed (measured, low value or later phase)
- **Idle rAF** is framer's loop for the rotating hero role (about 42 frames every 2.8 s). Cheap.
- **Remaining load long tasks** are framework/module evaluation: react-dom 69 KB gz, the Next runtime 44 KB gz, framer-motion 39 KB gz. The layout's client UI chunk is only 22 KB gz. Reducing framer cost (`LazyMotion`) belongs to the Phase 6 motion system. Splitting dialogs belongs to Phase 8.
- **Unused dependencies** (22 packages) don't reach the client bundle; listed for Phase 15 as an owner decision.

## Tools added (`scripts/qa/`, no dependencies)
- **`perf-probe.mjs`:** rAF/s, running animations, listener inventory, CDP style/layout/script metrics, long tasks split at 3 s, optional CPU profile (`PROFILE=1`) and request blocking (`BLOCK_URLS`/`BLOCK_3P`).
- **`perf-trace.mjs`:** main-thread trace during scroll, forced versus frame recalcs, and which nodes repaint.
- `perf-bench.mjs` gained `BLOCK_URLS`. `cdp.mjs` gained `on()` and `NO_SW=1`, which bypasses the service worker so byte counts are honest.

## Validation (actual)
- `pnpm test`: all pass. New tests: `DeferredThirdParty` (3: nothing in the first 3 s, GA and Clarity once settled, never outside production) and the shared scroll listener (1).
- `pnpm build` passes · `pnpm lint` 0 errors · app `tsc` 0.

**Phone profile (4× CPU, load under 4):**

| Route | LCP | CLS | Scroll |
|---|---|---|---|
| `/aiyaar` | 0.47 s | 0 | 60 fps |
| `/about` | 0.62 s | 0.001 | 60 fps |
| `/projects/omnidesk` | 0.70 s | 0 | 60 fps |
| `/contact` | 0.47 s | 0 | 60 fps |
| `/` (Home) | — | — | 57.8–59.3 fps (analytics landing in the window); 59.5–59.6 fps with analytics blocked |

Desktop Home: LCP 0.41 s, scroll 58.5 fps.

## Gate
**PASS.**
