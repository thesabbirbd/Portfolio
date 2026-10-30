# v4.0.1 performance pass (after the owner rounds)

Date: 2026-10-30. Local only: nothing committed, pushed or deployed.

## How it was measured

- **Builds:** production builds of both versions, served side by side.
  - Before: `HEAD` 0c46242, built in a throwaway worktree.
  - After: this working tree.
- **Browser:** headless Chrome with software GPU. Phone runs used 4× CPU throttle, desktop runs 2×.
- **Analytics blocked:** Clarity and GA were blocked, because their start time lands randomly inside the measurement window.
- **Scrolling:** real synthesized touch/wheel gestures (`Input.synthesizeScrollGesture`). Earlier benches called `scrollTo()` from script, which itself forces style and layout and distorts the result.
- **Metric:** total main-thread time from a trace (`CrRendererMain`). This was steadier than fps while other apps kept the machine load between 3 and 8.

## Results (main-thread time; lower is better)

| Route | Device | Mode | Before | After | Change |
|---|---|---|---|---|---|
| `/` | phone | idle 3 s | 2,379 ms | 969 ms | −59% |
| `/` | phone | 3 scroll flings | 3,706 ms | 2,968 ms | −20% |
| `/about` | phone | idle 3 s | 2,032 ms | 63 ms | −97% |
| `/about` | phone | 3 scroll flings | 3,362 ms | 2,270 ms | −32% |
| `/tools` | phone | idle 3 s | 1,899 ms | 61 ms | −97% |
| `/tools` | phone | 3 scroll flings | 3,099 ms | 1,474 ms | −52% |
| `/` | desktop | idle 3 s | 2,760 ms | 1,124 ms | −59% |
| `/` | desktop | 3 scroll flings | 3,917 ms | 3,740 ms | −5% |
| `/about` | desktop | 3 scroll flings | 4,141 ms | 3,736 ms | −10% |
| `/tools` | desktop | 3 scroll flings | 3,453 ms | 2,320 ms | −33% |

Other measurements:
- **Frame rate:** with the machine quieter, the home page on a phone profile (4× CPU, `scroll-bench.mjs`) ran at 58.7 fps idle and 56.4 fps while scrolling.
- **Looping animations:** 31 run at once on the home page before, 8 after.
- **Style recalcs during a home scroll:** elements re-styled per pass fell from 2,897 to 1,490.
- **Load metrics:** LCP is unchanged at about 0.96 s on both builds (hero paragraph, 4× CPU). CLS is 0.007.

## What changed and why

1. **SVG stroke animations replaced.**
   - The line graph and the Blue theme's circuit, network packets and dashboard sparkline animated `stroke-dashoffset`. That repaints on the main thread every frame.
   - The lines now "draw" by scaling their `<svg>` box. Packets are small HTML dots moved with `transform` (`Trace` in `AmbientBackdrop.tsx`). The look is the same, and only the compositor does the work.
2. **One animation per meter.**
   - The 9 equaliser bars and the 7 dashboard bars each ran their own loop. Every running loop costs a style update per frame.
   - Each meter is now a single strip of bars that slides like a scrolling waveform (`Meter`).
   - The 10 gold-dust specks now move as 2 groups.
3. **Off-screen loops pause.**
   - `AnimationCulling.tsx` runs one IntersectionObserver. It pauses the drift-layer objects and the hero rings while they are out of view (`data-cull`, `data-cull-children`).
   - Scroll-driven animations are not touched.
4. **One scroll-position read per frame.**
   - Reading `window.scrollY` inside a `scroll` event forced a full style recalc. The nav-visibility store and SoundScape each paid it, so there were two recalcs per frame.
   - `lib/scroll-frame.ts` now reads the position once per frame inside requestAnimationFrame and hands it to both.
   - SoundScape now caches the page height (ResizeObserver) and its timeline zones (IntersectionObserver) instead of measuring them on scroll.
5. **No duplicate JS scroll motion.**
   - The hero ran framer-motion parallax (`useScroll`) on top of the CSS `cine-exit-*` scroll timelines. The framer part is removed.
   - The rotating role line is now its own component, so the 2.8 s swap no longer re-renders the whole hero.
   - The home chapter rail and the `/about` timeline progress bars now use CSS scroll and view timelines. Their progress matches the old framer values: 0.39/0.79 vs 0.40/0.79 at the same scroll points.
   - The phone-only top progress bar was removed. It duplicated the gold scroll thread.
6. **`/about` chip auto-scroll is phone-only.** It measured a hidden chip row on desktop at every phase change, which forced a layout mid-scroll.

## QA tooling

- **New:** `scripts/qa/scroll-bench.mjs`, a gesture-driven scroll bench. Set `BLOCK_3P=1` to block analytics.
- **Fixed:** `scripts/qa/cdp.mjs` now deletes its throwaway Chrome profile. The deferred delete never ran before the scripts exited, so about 3 GB of `~/.cache/sabbir-qa-*` profiles had piled up; they have been removed. Chrome now runs in its own process group so `close()` also ends its renderer processes.

## Verification on the final build

| Check | Result |
|---|---|
| tsc | 0 errors |
| Build | pass |
| Tests | 172/172 |
| Lint | 0 errors, 9 existing warnings |
| interaction-audit | 23/23 |
| theme-audit | 15/15 |
| sound-audit | 8/8 |
| resilience-audit | 14/14 |
| a11y-audit | 0 issues (light desktop, dark phone) |
| link-inventory | 1,402 links, 0 problems |
| mobile-audit | 16 routes × 9 viewports, 0 findings |
| controls-choreo | 0 collisions, 0 jumps |

## Not done / limits

- **Headless numbers only.** All numbers come from headless Chrome with a software GPU. Real-phone fps was not measured.
- **Desktop scroll gain is small** (−5 to −10% on `/` and `/about`).
  - Most of what remains is the per-frame style update from the scroll-driven reveal animations, which is inherent to them.
  - The desktop nav's backdrop blur was also kept. It is a deliberate design choice and was already removed on phones in an earlier phase.
