# THE SABBiR — Phase 15 Report: Final verification & release-candidate summary

**Date:** 2026-10-28 · **Git:** local only. **Nothing committed, pushed, merged or deployed.**

## Status
**Local release candidate: complete and validated** to the limits of the available environment (headless Chrome via CDP, plus this machine's Node toolchain).

## Before → after (same machine, same harness, measured today)
"Before" is the **live sabbir.nav.bd** (the committed code). "After" is the local production build of this working tree, measured with the service worker bypassed so byte counts are real network transfers. Network differs (remote vs localhost), so compare LCP loosely. Frame metrics are taken after load. The headless software GPU is pessimistic in absolute terms.

| Metric | Live site (before) | Release candidate (after) |
|---|---|---|
| **Phone** 390×844, 4× CPU · JS transferred | 557 KB | **266 KB** |
| Phone · LCP | 4.59 s | **0.47 s** |
| Phone · CLS | 0.295 | **0** |
| Phone · idle fps / scroll fps | 14.3 / 13.6 | **60 / 59.5** |
| Phone · Home page height | 16,952 px | **8,456 px** |
| **Desktop** 1440×900, 2× CPU · JS transferred | 557 KB | **269 KB** |
| Desktop · LCP | 3.49 s | **0.41 s** |
| Desktop · idle fps / scroll fps | 8.4 / 8.2 | **60 / 60** |
| Desktop · Home page height | 14,323 px | **7,171 px** |

**Every key route on a phone** (4× CPU, release candidate):

| Route | Result |
|---|---|
| `/` | LCP 0.32 s · CLS 0 · 60 fps |
| `/about` | 0.68 s · CLS 0 · 59.8 fps |
| `/experience` | 0.36 s · CLS 0 · 60 fps |
| `/projects` | 0.41 s · CLS 0 · 59.9 fps |
| `/projects/omnidesk` | 0.35 s · CLS 0 · 60 fps |
| `/engineering-lab` | 0.34 s · CLS 0 · 60 fps |
| `/contact` | 0.33 s · CLS 0 · 60 fps |

**Media:**
- Procedural motion loops: 8 files, 26–263 KB each, about 1.1 MB in total.
- Video plays only at tablet width and up, when 3D is enabled, and pauses off-screen.
- **Media requests now bypass the service worker.**

> Measurement note: with the service worker active, Resource Timing reports SW-served chunks with larger sizes (for example `/contact` 337 KB vs 273 KB bypassed). Use the bypassed numbers above. `scripts/qa/cdp.mjs` supports `NO_SW=1` for this.

## Exact final outcomes
- `pnpm test`: **71/71 passed** (12 files). This was 69/69 at baseline; 2 sound-policy tests were added.
- `pnpm build`: **pass** (Next 16.3.5, Turbopack).
- `tsc --noEmit`: **0 errors in app code**. 9 errors remain in **pre-existing test files** (unchanged since baseline; `next.config.ts` keeps `ignoreBuildErrors: true`).
- `pnpm lint`: **0 errors, 12 warnings.** It was **broken** at baseline because Next 16 removed `next lint`. Migrated to the ESLint CLI with flat config per the Next 16 docs (`eslint.config.mjs`, `"lint": "eslint ."`). The warnings are `react-hooks/set-state-in-effect`, set to *warn* on purpose: client-only preferences are read after mount to keep hydration consistent. There is also one `no-img-element` warning.
- **QA tooling** (all in `scripts/qa/`, no new dependencies):
  - `link-audit`: 23 pages, **0 problems**.
  - `mobile-audit`: 16 routes × 9 viewports, **0 findings** (baseline 843).
  - `controls-choreo`: **0 collisions, 0 jumps** at 390, 360, 320, 844×390 and 1440. Exactly one nav hide and one show per scroll phase, no flicker on jitter.
  - `interaction-audit`: **21/21**, stable over 3 runs.
  - `sound-audit`: **6/6**.
  - `a11y-audit`: **0 issue groups** (light desktop, dark phone).
  - `resilience-audit`: **14/14** (images blocked, offline via SW, no-JS, skip link).
- **Browsers:**
  - Chromium (Google Chrome headless): tested.
  - **Firefox:** not installed (snap stub only). **WebKit/Safari:** not available. **Physical devices:** not tested.

## Cleanup done in this phase
- **Removed the `lenis` dependency** (unused since Lenis was dropped in Phase 1). `package.json` and `pnpm-lock.yaml` were updated by `pnpm remove`; no other packages changed. A `pnpm-workspace.yaml` that pnpm generated with placeholder values was deleted again.
- **Removed dead modules:**
  - `LoadingScreen.tsx` and `TiltCard.tsx`, made unused by this program.
  - `ImageViewer.tsx` (unused even before, and it carried lint errors) and `ScrollMotionHUD.tsx` (unused even before).
  - Earlier phases also removed `SmoothScroll.tsx` and `src/data/timeline.ts`.
- **Lint-driven fixes:**
  - `ImageTrail`: the random tilt was moved out of render.
  - `SafeWebGL`: now uses `useSyncExternalStore` with a cached probe.
  - `IdentityDock`: the phone menu resets during render instead of in an effect.
- Debug `console.log`s were removed from the SW registration. No debug code remains in `src/` (`console.log`/`debug`: 0).

## Git diff inspection (read-only)
`git status`: 82 modified, 6 deleted, 34 untracked. All changes belong to this program:
- source files;
- new system primitives and hooks;
- the `docs/reports/` phase reports;
- `scripts/qa/`;
- light-variant videos;
- `eslint.config.mjs`;
- `.claude/launch.json`.

The modified `CLAUDE_CODE_MASTER_PROMPT.md` and `THE_SABBiR_PROJECT_CONTEXT.md`, and the untracked `CLAUDE_EXECUTION_RUNBOOK.md`, are the owner's v2 pack copied into the repo root. **Nothing was committed or staged.**

## What the program delivered (Phases 0–15, one line each)
- **0–1:** baseline, defect map; three.js out of the root bundle; Lenis removed; hero CLS fixed; phone video off.
- **2:** design tokens and the surface/elevation system; system primitives.
- **3:** Home reduced to a 7-chapter overview; depth moved to `/about`, `/experience` and `/engineering-lab`; SafeWebGL boundary.
- **4:** hero: kinetic wordmark, short-portrait composition, no-JS safety.
- **5:** `/about` identity composition; brand naming fixed.
- **6:** CSS `view()` scroll grammar; chapter rail.
- **7:** sticky career timeline with evidence links; one canonical dataset.
- **8:** glass-and-fluid system rollout; Settings with real switches and focus management.
- **9:** Engineering Lab "Cyber AI" expression; architecture as a readable figure; globe render gating.
- **10:** mobile composition (843 → 0 findings); PageHeader; honest skills matrix; contact flow fixed on phones.
- **11:** fixed-control choreography without collisions; safe areas; short landscape.
- **12:** optional, gesture-gated procedural sound (off by default).
- **13:** interaction integrity (21 checks); dialog semantics; overclaims removed.
- **14:** accessibility (0 audit issues), skip link, landmarks; service worker actually registers; offline works.
- **15:** final verification, lint restored, dependency and dead-code cleanup.

## Known issues / open items
- **Lint warnings (12)** for the after-mount hydration pattern. Converting each to `useSyncExternalStore` is a safe follow-up.
- **9 type errors in test files** are pre-existing and do not affect the app build.
- **Untested:** Firefox, Safari/WebKit, physical devices, real speakers (sound loudness), and real-GPU desktop video cost (D20).
- At rest, the corner controls overlay page content by design (the brief's slot layout). They retreat while the visitor reads-scrolls.

## Unresolved factual decisions (for the owner)
1. **NOC internship:** `/resume` says **Shunno IT (2022–2023)**; the About Honors card says **"NOC Intern · BHTPA"**. Confirm whether these are the same programme.
2. **BHTPA Python course name** on the Python timeline phase.
3. **Custom UPS status** is now shown as "completed" (it was "Field Operational").
4. **Skills that were only in the old hardcoded matrix** (Node.js, Redis, WebSockets, Cisco, Nginx, Systemd, DaVinci, After Effects, OSM) are no longer listed. Add any real ones to `src/data/skills.ts`.
5. **Omnidesk BD:** **resolved.** Published copy matches the repository README (a local-first learning and engineering workspace); no unverified Omnidesk claim is published.
6. **Removed as unsupported:** "10,000+ users", RAG/agentic claims, production-grade CI/CD, "Top Contributor", "help millions navigate Bangladesh", "enterprise-level … massive user base", "Live telemetry" and "SPRINT_TARGET: PRODUCTION_GRADE".

## Hand-off
Preview with `pnpm dev` (http://localhost:3000). Review in the browser, then decide on commit and deploy yourself; this program performed neither.
