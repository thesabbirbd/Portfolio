# THE SABBiR — v4.0.1 · Phases 11–12 Report: Mobile, desktop & tablet refinement

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

## Status
**PASS.** I ran the full responsive matrix (17 routes × 14 viewports) on the production build.
- One real issue was found and fixed: the desktop chapter rail's tap targets were too small.
- After the fix: **0 findings** for horizontal overflow, sub-11 px text and tap targets under 24 px.

## Phase 11 — Mobile refinement

### Compacting after "The Engineering Evolution" (Home, 390×844)

| Section | Before | After | Change |
|---|---|---|---|
| 04 Engineering Lab | 1,035 px | **950 px** | Home teaser cards on phones: description clamped to 2 lines; only the first 3 tech tags (the Lab page still shows all) |
| 05 Latest thinking | 900 px | **780 px** | Content cards on phones: description clamped to 2 lines (3 from `sm`); tags hidden on phones (they remain on each article) |
| Skills, mission & community | 757 px | 757 px | already compact (one-row cards) |
| Contact | 575 px | 575 px | — |
| **Whole Home page** | 9,615 px | **9,410 px** | − 205 px |

- Earlier in this program (Phase 5), the Aiyaar chapter was also tightened on phones.
- No section on a phone is taller than 1.15 screens, except "Selected work", which holds the Omnidesk BD flagship (2.55 screens). `OmnideskSection` must stay mounted and complete.

### Short landscape
- 667×375, 740×360 and 844×390 are part of the matrix, with 0 findings.
- `controls-choreo` checks short landscape:
  - the dock stays vertical-only (0 px horizontal travel);
  - 0 collisions and 0 jumps.
- The existing `max-height: 450px` landscape rules and `short-landscape:` variants are unchanged.

## Phase 12 — Desktop & tablet refinement
- Desktop composition was checked visually from full-resolution screenshots:
  - **1920×1080:** hero, Aiyaar chapter;
  - **1366×768:** hero;
  - **1024×768:** Selected work / Omnidesk BD.
- Results:
  - the grid is centred at `max-w-7xl`;
  - the hero headline scales;
  - the portrait orbit sits clear of the nav;
  - the floating controls stay in their corners.
- **Fixed: the desktop ChapterRail links were 94×15 px**, below WCAG 2.2's 24 px target size, on every desktop viewport from 1280 px up. They now have `min-h-6` (24 px) with a smaller gap, so the rail looks the same and is easier to hit.

## Responsive matrix (production build)

`scripts/qa/mobile-audit.mjs` covered these 17 routes:
- `/`, `/about`, `/projects`, `/engineering-lab`, `/experience`, `/exploration`, `/contact`, `/notes`, `/journal`, `/resume`, `/search`, `/aiyaar`;
- one page of each content type;
- the 404 page.

| Viewport | Class | Result |
|---|---|---|
| 320×640 | small phone | 0 findings |
| 360×800 | Android | 0 |
| 390×844 | iPhone 12–15 | 0 |
| 402×874 | iPhone 16 Pro | 0 |
| 430×932 | large phone | 0 |
| 667×375 | short landscape | 0 |
| 740×360 | short landscape | 0 |
| 844×390 | landscape | 0 |
| 768×1024 | tablet portrait | 0 |
| 1024×768 | tablet landscape / small laptop | 0 |
| 1280×800 | laptop | 0 (was 6: ChapterRail) |
| 1366×768 | laptop | 0 (was 6) |
| 1440×900 | desktop | 0 (was 6) |
| 1920×1080 | full HD | 0 (was 6) |

The fix was re-checked on the final build: 6 key routes × 7 viewports, 0 findings.

**Performance on the final build** (phone profile, 4× CPU throttle, load under 4):

| Route | LCP | CLS | Scroll |
|---|---|---|---|
| Home | 0.47 s | 0 | 60 fps |
| `/aiyaar` | 0.48 s | 0 | 60 fps |
| `/about` | 0.63 s | 0 | 60 fps |

## Not tested
- Real devices: no physical iPhone or Android, and no Safari or Firefox engine. All runs used headless Chromium with device emulation.
- 2560 px and ultrawide screens. The layout caps at `max-w-7xl`, so these should only add side margin, but that was not measured.

## Gate
**PASS.** No horizontal overflow, giant gaps or inaccessible controls. The responsive matrix is documented above.
