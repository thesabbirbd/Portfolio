# THE SABBiR — Phase 14 Report: Accessibility, resilience & cross-device regression

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete** for Chromium (Google Chrome headless via CDP).

**Not tested:**
- **Firefox:** `/usr/bin/firefox` is only a snap stub ("snap install firefox"); it is not installed.
- **WebKit / Safari:** no Playwright WebKit build exists locally.
- Physical iOS / Android devices.

## Method (new dependency-free tools)
- **`scripts/qa/a11y-audit.mjs`** checks 16 routes, including a detail page of each type and the 404:
  - exactly one `h1` and one `main`, and no heading-level skips;
  - `html[lang]` and a skip link;
  - accessible names for links and controls, `img[alt]`, form labels, duplicate ids;
  - **rendered text contrast**: foreground against the composited background-colour stack, with WCAG thresholds for normal and large text. Gradients, images and transparent text are skipped.
  - Run in light 1440×900, dark 1440×900 and dark 390×844.
- **`scripts/qa/resilience-audit.mjs`** checks:
  - all images blocked;
  - service-worker registration plus **offline navigation**;
  - **no-JS rendering** of 5 routes;
  - the keyboard skip link and focus indicator.
- The interaction and sound audits from Phases 12–13 re-cover dialog focus, Escape and focus return.

## Observed problems
1. **No skip link.** The first Tab stop was the logo.
2. **Nested `<main>`** on every case study, note, journal entry and lab write-up (layout `main` plus a page `main`).
3. **Heading outline gaps:**
   - List pages (Projects, Notes, Journal, Search) went from `h1` straight to card `h3`s.
   - Case-study and lab side panels used `h3` below the `h1`.
   - "Knowledge graph" references used `h4` under `h2`.
   - The footer used `h3`/`h4`, so the 404 page went `h1` → `h3`.
4. **Unlabelled inputs:** the notes filter and the search field relied on placeholders only.
5. **Contrast:** the `/exploration` "View Local Guide Profile" button was **1.73:1** in dark mode (white text on bright amber).
6. **Resume toggles** were hand-rolled pills with the active colour on an absolutely positioned sibling. They now use the system `Segmented` (radiogroup) control.
7. **The IdentityDock profile dialog** didn't move focus in or return it.
8. **The service worker never registered** on fast loads. Its `load` listener was added from an `afterInteractive` script that runs *after* `load`, so offline support silently didn't work. The SW also tried to cache video (Range/206) responses, which the Cache API rejects, and could resolve `respondWith(null)` on a cache miss while offline.
9. Debug `console.log`s in the SW registration.

## Changes implemented
- `src/app/layout.tsx`:
  - "Skip to content" link (visible on focus); `main#main-content` with `tabIndex={-1}`.
  - SW registers immediately if the page has already loaded; logs removed.
- `ContentLayout`, `LabLayout`, `ProjectLayout`: inner `main` → `div`. Side-panel and changelog headings re-levelled (`h2`/`h3`).
- `ConnectedKnowledge`: "Knowledge graph" is an `h2`, its groups are `h3`.
- `Footer`: brand is a paragraph and column titles are `h2`; the visual style is unchanged.
- **List pages** (`/projects`, `/notes`, `/journal`, `/search`): a screen-reader-only `h2` names each list.
- `NotesBrowser`, `SearchInterface`: `aria-label`s on the inputs.
- `MapsExplorerSection`: profile button uses `bg-accent text-on-primary`, which passes in both themes and every palette.
- `ResumeInterface`: role and view switches use `Segmented` (`role="radiogroup"`, `aria-checked`); Print is a labelled button with a focus ring.
- `IdentityDock`: the profile dialog focuses Close on open and returns focus to the avatar.
- `public/sw.js`:
  - Same-origin GET only.
  - **Media and Range requests bypass the SW.**
  - `Response.error()` instead of `null`.
  - Cache names bumped so old caches are cleaned up.

## Validation
- **`a11y-audit`: 0 issue groups** in light 1440×900 and dark 390×844. The earlier dark desktop run flagged only the two issues fixed above. Every route has one `h1`, one `main`, no skips, no unnamed controls, no missing alt or labels, no duplicate ids, and no rendered text under the contrast threshold.
- **`resilience-audit`: 14/14:**
  - With images blocked (`/`, `/about`, `/projects/omnidesk`), content renders, all images have alt text, and no exceptions are thrown.
  - The service worker reaches `ready`. Going **offline and navigating to `/notes` shows the site** (titled "Engineering Notes | THE SABBiR"), not the browser's offline page.
  - **No-JS** `/`, `/about`, `/projects`, `/contact` and `/engineering-lab`: the h1 is visible at opacity 1, and no heading or paragraph is hidden.
  - **Keyboard:** the first Tab shows "Skip to content", Enter moves focus to `main`, and the next Tab lands on a link with a visible outline.
- `interaction-audit` 21/21 (covers dialog focus/Escape/return) · `sound-audit` 6/6 · `mobile-audit` 0 findings · `link-audit` 0 problems.
- `pnpm test` 71/71 · build pass · app `tsc` 0.

## Regressions / risks
- **The service worker now actually registers in production.** This is intended, existing functionality that was silently broken. Navigations are network-first (always fresh HTML) and static assets are content-hashed. Images under `/assets/` use stale-while-revalidate, so a replaced image at the same path shows the old copy once.
- The contrast checker cannot evaluate text over gradients or images (the hero wordmark, video overlays). Those were checked visually in earlier phases.
- Firefox, Safari/WebKit and real devices are untested.

## Unresolved factual decisions
None.

## Next phase
Phase 15 — Final performance verification & release-candidate report.
