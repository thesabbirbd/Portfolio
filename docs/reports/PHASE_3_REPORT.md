# THE SABBiR — Phase 3 Report: Home Composition & Long-Page Breakup

**Date:** 2026-10-28 · **Previous:** `PHASE_2_REPORT.md` (verified against the working tree first)
**Git:** local only. Nothing committed, pushed or deployed.
**Mode change:** mid-phase, the user asked for phases to run back-to-back without stopping for review. Each phase still validates and writes its own report.

## Phase / status
**Complete.**

## Observed problem
- Home was **16,712px on a phone (19.8 screens)** and **15,498px on desktop (17.2 screens)**. About alone was 3,068px on phones and 4,328px on desktop. Skills, Maps, Community and Mission added ~5,700px more on phones.
- Several sections existed **only** on Home: the Lab experiments and interactive terminal (`/engineering-lab` showed just one MDX write-up), Community, and the Omnidesk spotlight.
- Duplication: an Omnidesk card in "Selected Builds" sat directly above the full Omnidesk spotlight.
- "Selected Builds" claimed "Production-grade systems" and used 10–11px text in a two-column phone grid.
- **Found during validation (P0):** with 3D enabled and no usable WebGL (GPU blocklisted or disabled, privacy browsers), three.js threw "Error creating WebGL context" inside the React tree. With no error boundary, **the entire site was replaced by Next.js's global error screen.**

## Design / engineering decision
Home becomes a curated overview of seven short chapters. Each chapter ends with a single "continue" link (`MoreLink`) to the route that holds the full content. Nothing was deleted; long content was moved to existing routes, and no new routes were created.

| # | Home chapter | Full content lives at |
|---|---|---|
| — | Hero | (unchanged) |
| 01 | Identity: header + 4 identity facts | `/about` (greeting, portrait modes, "My World", full timeline) · `/resume` |
| 02 | Selected Work: header → Omnidesk flagship (embedded) → 3 more builds, one per discipline, with case-study links and quick-view modal | `/projects` (all case studies) |
| 03 | Journey: 8 steps, **each deep-linking to its phase** (`/about#journey-<id>`) | `/about#timeline` · `/experience` |
| 04 | Lab teaser: header + 3 featured experiments | `/engineering-lab` (**now** hosts the terminal, filters and every experiment, plus the MDX write-ups) |
| 05 | Writing: latest 3 notes/journal/lab entries | `/notes` · `/journal` |
| 06 | Beyond the code: 4 link cards with facts from data | `/experience#skills`, `/experience#mission`, `/experience#community` (**Community moved here**), `/exploration` |
| 07 | Contact CTA (keeps `id="contact"`) | `/contact` (full intent-based form) |

Anchors relied on elsewhere stay valid: `/#about`, `/#projects`, `/#lab`, `#contact`. Nav active-section highlighting still works.

## Changes implemented
- **New:** `src/data/journey.ts`, the canonical Engineering Evolution dataset (full timeline and preview both read it; Phase 7 builds on it).
- **New components:** `src/components/system/MoreLink.tsx`, `src/components/home/JourneyPreview.tsx`, `src/components/home/BeyondChapters.tsx`, `src/components/home/ContactCTA.tsx`, `src/components/system/SafeWebGL.tsx`.
- **`AboutSection`:** `variant="overview" | "full"`. Identity facts are extracted into a shared `IdentityFacts`. A new `PROFILE_DATA.bioShort` one-line summary was written from existing facts.
- **`ProjectsSection`:** rewritten as the "Selected Work" chapter on the design-system primitives. The flagship is passed as children. Picks one build per discipline (Omnidesk not duplicated). "Production-grade" claim removed.
- **`OmnideskSection`:** `embedded` mode (no page padding, `h3` title under the chapter `h2`).
- **`EngineeringLabSection`:** `variant="teaser" | "full"` plus header overrides. The full bench log is mounted on `/engineering-lab` as "Experiments & prototypes" above "Documented write-ups".
- **`LatestThinking`:** uses `SectionHeader` and `MoreLink`s.
- **`/experience`:** adds `CommunitySection`. Mission's "See all community engagements" now points at `#community` on the same page.
- **`TerminalCard`:** `projects` / `skills` / `contact` commands now navigate from any page (`goToSection` with route fallbacks). "Systems Architect" self-title softened to "Backend & DevOps learner".
- **`JourneyTimeline`:** stable `journey-<id>` anchors with `scroll-mt-28`, plus a one-time re-align for deep links (server renders the phone layout; desktop swaps to the taller layout after hydration).
- **WebGL resilience (P0 fix):** `SafeWebGL` probes WebGL support before mounting and wraps the 3D background scene and the Maps globe in an error boundary. The globe shows "3D globe unavailable" instead of crashing the site.
- **Perf regression fix (phone animation budget):** the hero sphere bob, status ping and badge pulse run only at ≥768px. The Phase 2 fix to the `motion-safe:` variant had made the bob run, and several concurrent hero animations dropped phone idle to ~36 fps.

## Files changed (this phase)
- `src/app/page.tsx`, `src/app/engineering-lab/page.tsx`, `src/app/experience/page.tsx`
- `src/components/about/AboutSection.tsx`, `src/components/about/JourneyTimeline.tsx`, `src/components/projects/ProjectsSection.tsx`, `src/components/omnidesk/OmnideskSection.tsx`, `src/components/lab/EngineeringLabSection.tsx`, `src/components/lab/TerminalCard.tsx`, `src/components/content/LatestThinking.tsx`, `src/components/mission/MissionSection.tsx`, `src/components/ui/FloatingGlassBackground.tsx`, `src/components/maps/MapsExplorerSection.tsx`, `src/components/hero/HeroSection.tsx`, `src/components/hero/SpatialCore.tsx`
- New: `src/data/journey.ts`, `src/components/home/{JourneyPreview,BeyondChapters,ContactCTA}.tsx`, `src/components/system/{MoreLink,SafeWebGL}.tsx`
- `src/data/profile.ts` (`bioShort`)

## Validation
- `pnpm test` 69/69 · `pnpm build` pass · app `tsc` 0 errors.
- Link + anchor crawl (prod build): 23 pages, **0 broken links or missing anchors**. This includes the new `/about#journey-*`, `/experience#skills|mission|community`, and the `/#about|projects|lab|contact` targets.
- Deep links checked in the in-app browser: `/experience#community` lands at 80px (just under the nav). `/about#journey-linux` lands at 71px on a 977px-wide viewport after the fix (it was −153px before).
- WebGL failure scenario (3D on, WebGL disabled in the in-app browser): `/experience`, `/exploration` and Home render fully. The globe shows its fallback; no global error screen.
- Visual: headless screenshots of every new chapter (1440×900 light, 390×844 dark), `/engineering-lab` bench log, `/experience` community, `/about` deep link.
- **A harness bug, caught and fixed:** the screenshot script removed the welcome toast's DOM node behind React's back, which crashed the page about 11s later. It now suppresses the toast via `sessionStorage` before load and logs any page exceptions. 0 exceptions were recorded on the new runs.

## Performance evidence (headless Chrome, same harness)

| Metric | Before Phase 3 | After Phase 3 |
|---|---|---|
| Home height, phone 390×844 | 16,712px (19.8 screens) | **8,501px (10.1 screens), −49%** |
| Home height, desktop 1440×900 | 15,498px (17.2 screens) | **7,218px (8.0 screens), −53%** |
| Phone (4× CPU) idle / scroll | 52–55 / 49.7–50.6 fps | **56.7–57.7 / 52.3–53.5 fps** |
| Phone LCP / CLS / JS | 0.67 s / 0 / 275 KB | 1.1–1.2 s / 0 / **262 KB** |
| Desktop (2× CPU) idle / scroll | 18.6 fps scroll | 17.9 / 15.1 fps (within run-to-run variance; video-bound, see D20) |

Phone LCP moved from ~0.7 s to ~1.1 s across runs. The LCP element is still the hero portrait, and the variation is within what this harness shows between runs. It will be re-checked in Phase 15. Software-GPU numbers are for comparison only, not real-device FPS.

## Regressions or risks
- **Phase 3 only changed placement:** Skills, Maps, Community and Mission no longer appear on Home. Their full versions are on `/experience` and `/exploration`, linked from "Beyond the code".
- **Desktop `/about` hydration swap:** the timeline switches from the phone layout to the desktop layout after hydration. Deep links are re-aligned now, but the swap itself is below the fold. Phase 7 rebuilds the timeline and should remove it.
- **`TiltCard` is now unused** → Phase 15 cleanup (with `lenis`).
- **Copy not yet tokenised:** `/engineering-lab` and `/experience` page headers still use legacy styling (Phase 8/10).

## Unresolved factual decisions
None new. Copy edits this phase:
- "Production-grade systems…" was removed.
- The terminal's "Systems Architect" was softened to "Backend & DevOps learner".
- The new `bioShort` restates existing facts only.

## Next phase
Phase 4 — Hero and opening sequence (includes the D20 desktop hero-video decision).
