# THE SABBiR — v4.0.1 · Phase 15: Final verification & release report

**Date:** 2026-10-29 · **Status: local release candidate.** No Git commit, push, merge, PR or deployment was made. Everything is uncommitted in the working tree for the owner to review.

## 1. Phase status

| Phase | Status | Report |
|---|---|---|
| 0 Baseline & risk map | PASS | `PHASE_0_REPORT.md` |
| 1 Performance foundation | PASS | `PHASE_1_REPORT.md` |
| 2 Links & content integrity | PASS | `PHASE_2_REPORT.md`, `LINK_INVENTORY.md` |
| 3 Three-theme architecture | PASS | `PHASE_3_REPORT.md` |
| 4 Shared design language | PASS | `PHASE_4-9_REPORT.md` |
| 5 Homepage composition | PASS | 〃 |
| 6 Cinematic motion system | PASS | 〃 |
| 7 Timeline | PASS | 〃 |
| 8 Floating controls | PASS | 〃 |
| 9 Purposeful 3D | PASS | 〃 |
| 10 Sound FX | **PASS (automated); speaker test is the owner's** | `PHASE_10_REPORT.md` |
| 11 Mobile refinement | PASS | `PHASE_11-12_REPORT.md` |
| 12 Desktop/tablet refinement | PASS | 〃 |
| 13 SEO / sitemap / publishing | PASS | `PHASE_13_REPORT.md` |
| 14 Future feature proposal | PASS (proposal only) | `PHASE_14_ROADMAP.md` |
| 15 Final verification | PASS | this file |

## 2. Files changed and why (80 tracked files modified or deleted, 21 new)

| Area | Files | Purpose |
|---|---|---|
| Release mark | `package.json`, `src/lib/version.ts`(+test), `public/sw.js` | v4.0.1; footer and terminals show it; new SW cache names |
| Performance | `layout.tsx`, `DeferredThirdParty.tsx`(+test), `OmnideskSection.tsx`, `SpatialCore.tsx`, `ContentLayout.tsx`, `useNavVisibility.ts`(+test), `MorphingNav.tsx`, `globals.css` | Right-sized images; GA/Clarity deferred; one shared scroll store; no blur on phone controls; grain overlay on desktop only |
| Aiyaar / CPM | `src/data/aiyaar.ts`, `experience.ts`, Hero, Footer, Terminal, CommandMenu, IdentityDock, AiyaarFeature, About, WorkHistory, Resume, `/aiyaar`, `/experience` | "Chief Product Manager (CPM)" from a single source; meaningful Aiyaar links |
| Themes | `theme-color.ts`, `theme-color-store.ts`(+test), `ThemeToast.tsx`(+test), `SettingsPanel`, `SettingsContext`, `SpatialScene`, `ui-events.ts`, `globals.css`; `ThemeWelcomePopup.tsx` deleted | Orange, Green and Blue, random per session, a saved manual choice and Randomize; set before paint; a toast once per session |
| Design language | `globals.css`, `SectionHeader.tsx` | Per-theme radius, eyebrow, corner motif and elevation |
| Composition, motion, timeline, dock, 3D | `AiyaarFeature`, `motion-presets.ts`, `template.tsx`, `HeroSection`, `journey.ts`, `JourneyTimeline`, `JourneyPreview`, `IdentityDock`, `SpatialCore` | Phases 5–9 (see that report) |
| Sound | `sound.ts`(+test), `SettingsContext`, `SettingsPanel`, `CopyButton`, `TerminalModal`, `TerminalCard`, `CommandMenu`, `MorphingNav`, `IdentityDock`, `Footer`, `ProjectModal`, `ToastContext`, `globals.css` | Audible levels, limiter, volume slider, category cues, true mute |
| Responsive | `EngineeringLabSection`, `ContentCard`, `ChapterRail` | Compact phone teasers; 24 px desktop rail targets |
| SEO / publishing | `seo.ts`, `content-date.ts`, `JsonLd.tsx`, `sitemap.ts`, `feed.xml/route.ts`, `api/search/route.ts`, `content.ts`, all 16 `page.tsx`, `PageHeader`, the Content/Project/Lab layouts, `SearchInterface`, `ConnectedKnowledge`, 5 project `.mdx` | Per-page canonical and share cards; honest dates; BreadcrumbList and Article JSON-LD; real sitemap; static search index |
| Quality gate | `next.config.ts`, `content.test.ts`, `analytics.test.ts`, `sound.test.ts`, `route.test.ts` | The 9 test-file type errors were fixed, so **`ignoreBuildErrors` is removed** and type errors now fail the build. Image `qualities` reduced to `[75]`. `allowedDevOrigins` added for LAN testing. |
| Tests / QA | `content-integrity.test.ts`, `seo-publishing.test.ts`, `scripts/qa/*` (new: theme-audit, theme-contrast, link-inventory, perf-probe, perf-trace, section-heights; extended: cdp, sound-audit, interaction-audit, controls-choreo, perf-bench) | Automated evidence for every gate |

## 3. Performance: before and after (headless Chrome, production build)

| Metric | Phase 0 baseline | Final |
|---|---|---|
| Home image transfer, phone | 555 KB | **74 KB** |
| Hero portrait (LCP) at 640w | 150 KB | **30 KB** |
| GA/Clarity | at load, doubled first-3 s long tasks | **~3.5 s after load, in idle time**: long tasks about equal to analytics blocked |
| Forced style recalcs from scroll listeners | 55 per 3 s | **one shared listener** |
| Blur layers on phone fixed controls | yes | **0** |
| Home, phone profile (4× CPU) | — | **LCP 0.47 s · CLS 0 · scroll 60 fps (p95 16.7 ms)** · JS 276 KB |
| `/aiyaar`, phone | 0.47 s (Phase 1) | **0.48 s · CLS 0 · 60 fps** |
| `/about`, phone | 0.62 s (Phase 1) | **0.63 s · CLS 0 · 60 fps** |
| Home length, phone (390 px) | 9,615 px (before Phase 11) | **9,410 px** |

Benchmarks were only run with system load under 4. The owner's Remotion/ffmpeg renders had caused false regressions earlier.

## 4. Links

- `link-inventory`: **25 pages · 1,030 links · 17 external destinations · 0 problems · 0 orphan routes**.
- `interaction-audit`: **23/23**.
- **Unresolved destinations: none.**
- Remaining **unlinked** Aiyaar mentions are on `/aiyaar` itself, which is deliberate.

## 5. Themes
Three themes: Orange "Royal", Green "Studio" and Blue "Tech", each in light and dark.
- **A new session gets one random theme, set before paint.** It stays the same across routes and reloads within that session.
- **A manual choice in Settings is saved and always wins.** "Randomize" forgets it.
- A **toast** shows once per session and never covers the nav.

Evidence:
- `theme-audit` **15/15**;
- token contrast **0 failures** across all 6 theme×mode combinations;
- `a11y-audit` **0 issue groups**.

## 6. Sound
- **Default OFF.** It never autoplays and is unlocked only by a user gesture.
- Per-note peaks were raised from about −30 dBFS to −12…−17 dBFS, with a **soft-clip limiter** (no clipping).
- **Volume slider 10–100 %** (default 70), plus **Test sound**. Off is a true mute.
- 12 cue categories; typing ticks are throttled.
- `sound-audit` **8/8**. Levels rendered from the real engine: 100 % → −12.6 dBFS, 70 % → −16.8, 10 % → −24.4.

**Devices actually tested:** headless Chromium only. **Not tested:** listening on physical laptop or phone speakers, iOS Safari (the ring/silent switch can mute Web Audio), and Android Chrome.

## 7. SEO / sitemap / feed
- **Sitemap:** `src/app/sitemap.ts` → **https://sabbir.nav.bd/sitemap.xml**.
  - 23 canonical, indexable URLs.
  - `/search` is `noindex` and left out.
  - `lastmod` is a real content date or absent.
- **Feed:** `/feed.xml` (RSS 2.0, 12 items, **0 "Invalid Date"**).
- **Robots:** `/robots.txt` points to the sitemap.
- **Metadata:** every page has its own canonical, `og:url`, title, description and 1200×630 image. `/notes` and `/journal` previously inherited the home canonical.
- **JSON-LD:**
  - BreadcrumbList on every inner page;
  - TechArticle, BlogPosting or CreativeWork on content pages;
  - the existing Person/WebSite and SoftwareApplication data.
- `/api/search` is now prerendered static.
- **Owner follow-up:** placeholder project dates ("2025-01-01") became year-only. Add the real month or day if known.

## 8. Commands actually run (final state)

| Command | Result |
|---|---|
| `pnpm build` | **Pass.** `content:check` 0 errors; **TypeScript checked during the build** (no longer ignored); 34 static pages; `/api/search` ○ static |
| `npx tsc --noEmit` | **0 errors** (baseline: 9, all in test files) |
| `pnpm test` | **23 files, 156/156 passed** (baseline 100/100) |
| `pnpm lint` | **0 errors, 10 warnings** (baseline 13; all `react-hooks/set-state-in-effect` hydration patterns plus one Next location rule) |
| `git diff --check` | clean |
| Secret scan (diff + untracked) | no keys, tokens, private keys or passwords. The only IDs are the existing public GA4/Clarity/Bing verification IDs. |
| `scripts/qa`, production build | link-inventory 0 problems · interaction 23/23 · theme 15/15 · sound 8/8 · resilience 14/14 · a11y 0 · controls-choreo dockXTravel 0, 0 collisions, 0 jumps · responsive 17×14 → 0 findings |

## 9. Viewports
- **Tested** (headless Chromium, emulated): 320×640, 360×800, 390×844, 402×874, 430×932, 667×375, 740×360, 844×390, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080.
- **Not tested:** real phones and tablets, the Safari and Firefox engines, and screens 2560 px and wider.

## 10. Vercel Free (Hobby) assumptions to verify
- The site is static-first. The only function-like routes are prerendered (`/feed.xml` with revalidate 1 h, `/api/search` static). Confirm on the deployment's Functions tab that invocations stay near zero.
- Image optimisation now uses one quality (75) and right-sized `sizes`. Check the Hobby source-image allowance on the Usage page.
- Hobby is for **non-commercial** use. The site mentions a commercial product (Aiyaar), so the owner should confirm this is acceptable or consider the Pro plan.
- After deploying, resubmit `sitemap.xml` in Google Search Console and Bing Webmaster.

## 11. Known issues and next features
- 10 lint warnings, all pre-existing patterns: `set-state-in-effect` for hydration-safe storage reads.
- The `swipe` sound cue exists but is unused, because there is no swipe gesture.
- "Selected work" is still 2.55 screens on phones. It holds the full Omnidesk BD flagship, which must stay mounted.
- The 404 page inherits the home `og:url` (it is `noindex`, so this does not matter for search).
- **Next features** (see `PHASE_14_ROADMAP.md`):
  1. writing cadence with per-post share images;
  2. a client-side subnet/CIDR tool;
  3. a `/now` page.

## 12. Git confirmation
**No Git commit, push, merge, branch, PR or deployment was made in any phase.** `git log -1` is still `d435043` (the owner's last commit). All changes are local and uncommitted:
- 80 tracked files modified or deleted;
- 21 new files and directories, including `docs/reports/v4.0.1/`.
