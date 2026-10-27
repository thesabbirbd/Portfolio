# THE SABBiR — Phase 11 Report: Fixed-control & navigation choreography

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete** within the available test environment: headless Chrome via CDP, with frame-by-frame rect sampling. Not tested on physical iOS/Android devices.

## Method
**New** `scripts/qa/controls-choreo.mjs`. It records the rects of the Terminal launcher, Settings button, IdentityDock and the visible nav **on every animation frame** while scripted scrolls run:
- slow down → stop → fast down → reverse up → stop → ±6px jitter → stop.

It then reports:
- control-to-control **collisions** per frame;
- **jumps** (more than 48px in one frame);
- nav **state flips** per phase (flicker);
- final resting slots.

Extra probes covered orientation change (390×844 ↔ 844×390 while scrolled), expanding the dock and then changing route, reduced motion, and the scroll position after client navigation.

> The probe scrolls with `behavior: "instant"`. The site's `html { scroll-behavior: smooth }` otherwise turns every scripted `scrollTo` into a restarted smooth scroll. That first made it look as if the desktop nav never hid. Real wheel and touch scrolling are not affected.

## Observed problems (baseline)
1. **Settings × IdentityDock collisions on phones** during every nav hide/show (1–3 frames each at 320, 360 and 390px). When the nav hid, the dock travelled diagonally from its slot above Settings to the bottom centre and dropped 124px, faster than Settings dropped 68px, so it clipped the button. The reverse happened on show.
2. **Breakpoint mismatch:** the mobile choreography switches at **768px** (`isDesktop`), but Terminal and Settings used `sm:` (640px) for position, safe-area and the launcher label. Between 640 and 767px the corner buttons sat at 24px while the nav pill sat at 16px, the Terminal grew a text label that broke the raise geometry, and the safe-area margin was dropped.
3. **Short landscape (844×390, desktop mode):**
   - The text "terminal `" launcher pill and the bottom-centre dock sat over the reading column.
   - The top nav kept full padding.
   - No left/right safe-area handling for notched phones.
4. **Desktop:** the dock (bottom centre) stayed over the reading column while scrolling.
5. **Route change:**
   - An expanded mobile dock stayed open after navigating.
   - New pages opened at **y = 24**, not 0: Next aligned the new segment and skipped the page's top padding.
6. **The site's "Animations" switch didn't cover CSS transitions** (the nav slide, hovers). Only the OS setting did; Framer was already covered by `MotionConfig`.

## Decisions
- **Keep the intended slot design from the brief:**
  - At rest: Terminal and Settings are raised above the nav pill and the dock sits above Settings.
  - Scrolling down: the nav hides, the corners drop, and the dock goes to the bottom centre.
- **Fix ownership and path, not durations.** One store (`useNavVisibility`) still owns state. Each control owns its own transform. The dock gets a **per-axis transition**:
  - Hiding: sideways first, then down (55ms stagger).
  - Showing: up first, then sideways.
  - Its path therefore never crosses the Settings button.
- **Desktop and short landscape:** the dock steps out of the reading column (down and faded, `inert`) while the visitor scrolls down, and returns with the nav. The launcher is icon-only in short landscape.
- **Reduced motion:** controls change slot instantly (no travel). The site switch now also zeroes CSS transitions.

## Changes implemented
- `src/lib/fixed-controls.ts`: `dockTransition(navHidden)`, the per-axis spring with stagger.
- `src/components/ui/IdentityDock.tsx`:
  - Uses `dockTransition`.
  - Desktop "away" state while scrolling down (`aria-hidden` + `inert`).
  - Collapses on route change (`usePathname`).
  - Bottom offset on `md`/`short-landscape`.
- `src/components/ui/TerminalModal.tsx`: launcher uses `md:` breakpoints, is icon-only in short landscape, and always gets the bottom and left safe-area insets.
- `src/components/ui/SettingsPanel.tsx`: `md:` breakpoints, short-landscape offsets, bottom and right safe-area insets.
- `src/components/navigation/MorphingNav.tsx`: compact top padding in short landscape.
- `src/app/globals.css`: `html[data-motion="reduced"]` zeroes CSS animations and transitions (matching the OS media query).
- `src/app/template.tsx`: client navigations start at the true top unless the URL has a hash.

## Validation

| Viewport | Collisions | Jumps | Nav flips per phase | Resting gap, dock ↔ Settings |
|---|---|---|---|---|
| 390×844 | **0** (was 6) | 0 | 1 hide · 1 show · 0 on jitter | 10px |
| 360×800 | **0** | 0 | same | 10px |
| 320×640 | **0** (was 10) | 0 | same | 10px |
| 844×390 | 0 | 0 | same | — (dock bottom centre) |
| 1440×900 | 0 | 0 | same | — |

- **Reduced motion (390, `/about`):** 0 collisions. Controls switch slots instantly, as intended for reduced motion.
- **Orientation:** portrait → landscape → portrait while scrolled. Every control lands in the correct slot for each mode, and the dock stays collapsed.
- **Expand dock, then navigate** (`/` → `/notes`): the dock collapses; the new page starts at y = 0 (was 24).
- **Screenshots** (390×844 and 844×390): mid-scroll (nav hidden, corners docked, dock centred or away) and at rest (nav, raised corners and dock returned).
- `pnpm test` 69/69 · build pass · app `tsc` 0.

## Regressions / risks
- At rest, the corner controls still overlay page content by design (the brief's slot layout). Mitigations: they retreat during reading-scroll, there's 10px spacing, and footer and hero padding clear them.
- Physical-device behaviour (iOS rubber-band overscroll, dynamic toolbar resizing) is untested here.

## Unresolved factual decisions
None.

## Next phase
Phase 12 — Optional Sound FX system.
