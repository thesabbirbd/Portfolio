# THE SABBiR — v4.0.1 · Phase 0 Report: Baseline & risk map

**Date:** 2026-10-29 · **Pack:** Super OS Portfolio (`CLAUDE_CODE_MASTER_PROMPT.md`, `CLAUDE_EXECUTION_RUNBOOK.md`, `THE_SABBiR_PROJECT_CONTEXT.md`) · **Git:** inspection only — no commit, push, merge or deploy.

## Status
**PASS.** No design or source edits were made in this phase. The only new files are measurement tools in `scripts/qa/` (`perf-probe.mjs`, `perf-trace.mjs`) and a small `on()` event helper added to `scripts/qa/cdp.mjs`.

## Repository state

| Item | Observed |
|---|---|
| Branch | `main` |
| HEAD | `d435043` = `origin/main` (nothing ahead/behind) |
| Working tree at start | **Clean** (0 modified, 0 untracked) |
| Last release commit | `8675b71 release(v4.0)` — the previous 16-phase program, committed and pushed by the owner |
| After v4.0 | 13 merged commits. 12 are test-only (feed route, SafeWebGL, CommunitySection, ui-events, fixed-controls). 1 source change: `92ba751` replaced `dangerouslySetInnerHTML` with `children` for the `/aiyaar` JSON-LD |
| `package.json` version | `4.0.0` (this program marks **4.0.1**) |
| Package manager | pnpm (`pnpm-lock.yaml`, current). **A stale `package-lock.json` is also tracked** (last changed 2026-09-28 and still lists the removed `lenis`) |
| Framework | Next.js 16.3.5 (Turbopack), React 19.2.8, Tailwind v4, framer-motion 13 |
| Instructions | `CLAUDE.md` → `AGENTS.md` (read Next docs in `node_modules/next/dist/docs`) |

**Preserved user changes:** everything the owner committed, including the merged test PRs and the `/aiyaar` JSON-LD change. I verified the JSON-LD still renders valid JSON on `/` and `/aiyaar`.

## Commands and results (actual)

| Command | Result |
|---|---|
| `pnpm test` (vitest) | **17 files, 100/100 passed** (8.2 s) |
| `npx tsc --noEmit` | 9 errors, **all in test files** (`content.test.ts` ×6, `route.test.ts`, `analytics.test.ts`, `sound.test.ts`). App code: 0 |
| `pnpm lint` (`eslint .`) | **0 errors, 13 warnings** (`react-hooks/set-state-in-effect` hydration patterns, one `no-img-element`) |
| `pnpm build` | **Pass.** `content:check` reports 0 errors, then Next builds 34 static pages |

## Route inventory (from `src/app`)
- **Static:** `/`, `/about`, `/aiyaar`, `/experience`, `/projects`, `/engineering-lab`, `/notes`, `/journal`, `/exploration`, `/contact`, `/resume`, `/search`.
- **SSG detail pages:** `/projects/[slug]` ×7, `/notes/[slug]` ×2, `/journal/[slug]` ×2, `/engineering-lab/[slug]` ×1.
- **Generated files:** `/feed.xml` (revalidates hourly), `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon.png`, `/apple-icon.png`.
- **Dynamic:** `/api/search` (ƒ, a serverless function on Vercel). **No client code calls it**; `/search` gets its data at build time.
- **Error pages:** `not-found`, `error`, `template` (route transitions).

## Performance baseline (headless Chrome via CDP, production build, service worker bypassed)

> **Environment caveat (observed):** during the first runs an unrelated `python` process used about 380% CPU (load average 8.4 on 8 cores). Home then measured 46–54 fps with p95 33–50 ms. After it ended (load under 4) the same page measured 60 fps / p95 16.7 ms, three runs in a row. From now on every benchmark is taken with load below 4.

| Route (phone 390×844, 4× CPU) | LCP | CLS | JS | Scroll |
|---|---|---|---|---|
| `/` | 0.36–0.42 s | 0 | 268 KB | 60 fps, p95 16.7 ms |
| `/aiyaar` | 0.43 s | 0 | 268 KB | 60 fps |
| `/about` | 0.62 s | 0 | 280 KB | 60 fps |
| `/experience` | 0.63 s | 0 | 273 KB | 60 fps |
| `/projects` | 0.48 s | 0 | 271 KB | 59.9 fps |
| `/projects/omnidesk` | 0.52 s | 0 | 271 KB | 60 fps |
| `/engineering-lab` | 0.81 s | 0 | 275 KB | 59.9 fps |
| `/contact` | 0.49 s | 0 | 279 KB | 59.9 fps |
| `/resume` | 0.72 s | 0 | 274 KB | 60 fps |

LCP is measured over localhost; real networks add latency. On this machine the live site's br-compressed HTML (33 KB) took between **0.7 s and 10.6 s** to first byte across runs.

## Evidence of real bottlenecks (what the 60 fps headline hides)

Measured with `scripts/qa/perf-probe.mjs` (rAF counts, listeners, animations, CDP Performance metrics, CPU sampling) and `scripts/qa/perf-trace.mjs` (main-thread trace).

1. **Unoptimised hero-weight images on Home (P0 for mobile data).**
   - The Omnidesk screenshots render through `next/image` with `unoptimized`, `quality={100}` and `sizes="100vw"`, so **phones download the raw 507 KB PNG** (`omnidesk-glass-dashboard.png`). Total image transfer on Home is 555 KB.
   - `public/assets` holds 7 images over 240 KB (largest: 767 KB PNG). Most go through the optimiser; this one doesn't.
   - The image also carries a CSS `filter: contrast(1.05)` plus a hover scale.
2. **Third-party analytics compete for the main thread (P1).**
   - Same page, idle window 3–6 s after load, 4× CPU: script time is **1.10 s per 3 s with Clarity + GA**, versus **0.15–0.21 s per 3 s with them blocked**.
   - Microsoft Clarity (session recording) and GA load with `lazyOnload`, i.e. right after the `load` event, while hydration tasks may still be running.
3. **Long main-thread tasks during load (P1, interactivity).**
   - Home on the phone profile shows **19–20 long tasks totalling 2.9–3.5 s, the longest 395–665 ms**, with third parties blocked.
   - The CPU profile attributes about 1.78 s of busy time to: Turbopack module evaluation (~320 ms), React hydration/render in react-dom (~450 ms), and framer-motion `useScroll` measurement (~240 ms, which includes the first forced layout of the 10,000 px page).
   - Home hydrates one large client tree: 44 `"use client"` files in total, with all Home sections hydrating in one pass.
4. **Scroll handlers force style recalculation (P2).**
   - The scroll trace (3 s, 4× CPU): `EventDispatch(scroll)` 344 ms; **55 forced style recalcs (176 ms)** inside JS.
   - Cause: three independent window scroll listeners each read `window.scrollY` while the CSS scroll-driven `.reveal` animations have invalidated style:
     - `useNavVisibility`;
     - `MorphingNav`'s own `scrolled` listener;
     - framer `useScroll` (Hero parallax + ChapterRail).
   - The hottest JS function while scrolling was the `useNavVisibility` handler (215 ms self time, mostly the forced recalc).
5. **Fixed glass layers on phones (P2, not measurable here).**
   - `backdrop-filter` is active on fixed, always-visible elements: the mobile nav pill and the IdentityDock, plus `surface-glass` corner buttons.
   - On real mobile GPUs a blurred backdrop over scrolling content is re-rendered every frame. Headless Chrome uses software compositing, so this cost cannot be quantified here; it is a known mobile risk the brief also calls out.
6. **Not a problem (verified):**
   - Idle rAF: framer's frame loop runs only for the hero's rotating role (~42 frames every 2.8 s).
   - The touch/wheel/pointer listeners on `document` and the root `div` are React's own event delegation.
   - The only infinite animation on Home is a tiny `pulse` dot.
   - CLS is 0 everywhere.

## Risk map (ranked)

| # | Risk | Area | Phase |
|---|---|---|---|
| 1 | 507 KB unoptimised PNG on Home (and other raw/oversized assets) | Mobile data / LCP | **1** |
| 2 | Clarity + GA load right after `load` and compete with hydration | Main thread / INP | **1** |
| 3 | Monolithic Home hydration (long tasks up to ~0.6 s at 4× CPU) | Interactivity | **1** |
| 4 | Duplicate scroll listeners forcing style recalcs | Scroll smoothness | **1** |
| 5 | Backdrop blur on fixed mobile controls | Real-GPU scroll cost | **1** (mobile only) |
| 6 | **Aiyaar title is wrong** ("Chief Project Manager", 19 code occurrences); the brief requires **Chief Product Manager (CPM)** | Content integrity | **2** |
| 7 | Parenthetical name construction in `/aiyaar` metadata ("Md Sabbirul Islam Khan (THE SABBiR)"); one uppercase CSS transform renders "THE SABBIR" on `/about` | Brand rules | **2** |
| 8 | No random-per-session theme and no theme-aware entry toast; the existing popup only names light/dark | Theme architecture | **3** |
| 9 | IdentityDock still moves horizontally (centre ↔ right above Settings) on phones | Controls | 8 |
| 10 | Sound "barely audible" report not yet investigated | Sound | 10 |
| 11 | `/api/search` is an unused serverless function | Vercel Free | 13 |
| 12 | Stale `package-lock.json` beside `pnpm-lock.yaml`; 22 dependencies never imported (`gsap`, `@tsparticles/*`, `recharts`, `ai`, `@ai-sdk/openai`, `sonner`…) | Build hygiene | 15 (owner decision) |
| 13 | `next.config.ts` keeps `typescript.ignoreBuildErrors: true` (9 test-file type errors) | Quality gate | 15 |

## Gate
**PASS.** Baseline, commands and results, route inventory and preserved user changes are recorded above. Proceeding to Phase 1.
