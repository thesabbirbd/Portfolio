# THE SABBiR — Phase 6 Report: Cinematic Scroll Grammar

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete.**

## Observed problems
1. **Seven sections were invisible until hydration.** `SectionReveal` faded them in with Framer `whileInView`, starting at `opacity: 0`, so the server HTML shipped them invisible until JS hydrated and the section scrolled into view. Affected: About, Projects, Lab, Contact, Skills, Maps. This hurt slow phones, failed JS, crawlers and LCP.
2. **`body { overflow-x: hidden }`** (declared after `clip`, so it won) made `<body>` a scroll container that never scrolls. This silently:
   - broke any `position: sticky` (needed for Phase 7);
   - attached CSS `view()` timelines to `<body>`, so every element looked "fully in view".
3. **No coherent scroll story:** each section had its own (or no) entrance, and there was no sense of chapter progress.

## Design / engineering decision
**One restrained grammar, CSS-first:**
- `.reveal`: small units (chapter headers, cards, continue-link rows) rise 28px and fade in as they enter. It uses **native scroll-driven animations** (`animation-timeline: view()`), so it runs off the main thread, reverses cleanly on scroll-back, and needs **no JavaScript**.
- `.reveal-bar`: editorial eyebrow bars draw from the left as their header enters (progressive emphasis).
- It is applied through the shared primitives (`SectionHeader`, `Card`, `MoreLinks`), so every chapter uses the same grammar with no per-section code. It is never applied to whole tall sections.
- **Progressive enhancement:** browsers without `animation-timeline`, reduced-motion users (OS setting, or the in-app toggle exposed as `html[data-motion="reduced"]` and applied before first paint), and no-JS visitors simply see the content.
- **Chapter marker (Home only):**
  - Desktop xl+: a fixed rail of real anchor links (01–07) with a progress line.
  - Smaller screens: a 2px reading-progress bar at the top edge.
  - Both are driven by a MotionValue bound to `transform` (no React render per scroll frame). The active chapter comes from one IntersectionObserver.
- Native scrolling is untouched: no pinning, no scroll-jacking, anchors work. Sticky storytelling is reserved for the Phase 7 timeline.

## Changes implemented
- `src/app/globals.css`:
  - Scroll grammar (`@keyframes reveal-in`, `draw-x`), using animation **longhands** with `animation-duration: auto`. The shorthand resets the duration to `0s`, which made the animations finish instantly; this was found and fixed during validation.
  - `body { overflow-x: clip }`.
- `src/components/ui/SectionReveal.tsx`: now a plain wrapper (API kept). Content is never hidden in the server HTML.
- `src/components/system/SectionHeader.tsx` (`reveal`, `reveal-bar`), `Card.tsx` (`reveal` prop, default on), `MoreLink.tsx` (`MoreLinks` reveal).
- `src/contexts/SettingsContext.tsx` and `src/app/layout.tsx`: `data-motion` attribute, set on toggle and pre-paint.
- **New** `src/components/home/ChapterRail.tsx`, mounted in `src/app/page.tsx`. Labels show on hover/focus, plus the active label at 2xl, after a collision with content at 1440px was found in the screenshots.

## Validation
- `pnpm test` 69/69 · build pass · app `tsc` 0 · `link-audit`: 23 pages, 0 problems.
- **Reveal behaviour** (headless Chrome, computed styles):
  - Below the fold: opacity 0.
  - In view: opacity 1.
  - After scrolling back up: below-fold elements return to opacity 0 (reverses).
  - Anchor landing (`/#lab`, `/#writing`): the target header is at opacity 1 and lands at 80px.
- **No-JS:** `/contact` renders its full content (it was previously invisible inside `SectionReveal`).
- **Visual:** chapter rail on desktop dark (numbers plus progress line, no collision after the fix); 2px progress bar on the phone.

## Performance evidence (headless Chrome, idle machine)

| Profile | Phase 4 | Phase 6 |
|---|---|---|
| Phone 4× CPU | idle 60 / scroll 60 fps · LCP 0.42 s · CLS 0 | idle 60 / scroll 60 fps · LCP 0.45 s · CLS 0 |
| Desktop 2× CPU | idle 59.7 / scroll 60 fps · LCP 1.32 s | idle 60 / scroll 57.7 fps · **LCP 0.41 s** · CLS 0 |

Scroll-driven reveals added no measurable frame cost. Desktop LCP improved because content is no longer hidden until hydration. Not real-device measurements.

## Regressions / risks
- Firefox (no `animation-timeline` without a flag) and older Safari show content without reveals. That is the intended fallback, but these browsers were **not** tested in this environment.
- A full-page static screenshot shows below-fold reveal units at opacity 0. Crawlers still read the text; this only affects pixel captures.

## Unresolved factual decisions
None.

## Next phase
Phase 7 — Career & Growth timeline signature experience.
