# THE SABBiR — Phase 0 + Phase 1 Report

**Date:** 2026-10-28 · **Pack:** `CLAUDE_CODE_MASTER_PROMPT.md` v2 + `CLAUDE_EXECUTION_RUNBOOK.md` + `THE_SABBiR_PROJECT_CONTEXT.md` (copied into repo root)
**Git:** local changes only — nothing committed, pushed, merged or deployed.

---

## Phase / status

- **Phase 0 — Repository truth, baseline, defect map:** Complete.
- **Phase 1 — Performance stabilization:** Complete for all confirmed P0/P1 causes except the desktop hero video layer (deferred to Phase 4, see risks).

## Repository truth (verified, not taken from older reports)

- Branch `main`, last commit `c921a24`. Working tree carries the uncommitted work from the previous session (45+ files) plus this phase. Nothing was reset or overwritten.
- Next.js 16.3.5 (Turbopack), React 19.2.8, framer-motion 13, Tailwind v4, pnpm 12, Node 24.
- 23 crawlable HTML routes (home, about, projects + 7 case studies, engineering-lab + 1, notes + 2, journal + 2, experience, exploration, contact, resume, search) plus `/api/search`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`.
- Pack context is partly stale and was superseded by the user in-session:
  - **Omnidesk BD — resolved (user, 2026-10-27):** it is the local-first learning workspace (public repo `thesabbirbd/Omnidesk-BD`). The e-commerce copy was removed from `content/projects/omnidesk.mdx`, `src/data/projects.ts` and the résumé; `OmnideskSection` is mounted on Home.
  - **"Latency dropped by 60%" — removed.** No measurement existed; it lived only in the old e-commerce highlights/changelog, which were replaced with repo-verifiable facts.

## Baseline checks

| Check | Before Phase 1 | After Phase 1 |
|---|---|---|
| `pnpm test` | 69/69 pass | 69/69 pass |
| `pnpm build` | pass | pass |
| `tsc --noEmit` (app code) | 0 errors | 0 errors |
| `tsc --noEmit` (test files) | 9 errors | 9 errors (unchanged, pre-existing) |
| `pnpm lint` | **broken** — `next lint` was removed in Next 16 and there is no ESLint config | unchanged (P2, open) |
| Internal link crawl (prod build) | 0 broken | 0 broken (23 pages) |

## Observed problem — where the lag came from

Evidence came from four sources: source inspection, in-browser instrumentation of the production build (`next start`), long-animation-frame attribution, and a headless-Chrome DevTools-protocol benchmark with CPU throttling. One-variable A/B toggles isolated each cost.

### Defect map (ranked)

| # | Pri | Defect | Evidence | Status |
|---|---|---|---|---|
| D1 | P0 | three.js + React Three Fiber (~292 KB gz / 1 MB parsed) statically imported in the root layout via `FloatingGlassBackground` — shipped to every route even with 3D off | largest chunk contained WebGLRenderer; loaded on `/` with 0 canvases | **Fixed** — dynamic import only when 3D is enabled |
| D2 | P0 | 4 full-screen orbs with `blur(80–140px)` animated forever by CSS keyframes **and** Framer scroll parallax on the same `transform` (two owners); plus 3 more animated `blur(100–120px)` orbs with `mix-blend-mode` (desktop) | 12 running animations at top; 5 big blurs in view on phone | **Fixed** — one static, filter-free gradient atmosphere |
| D3 | P0 | Lenis: rAF loop every frame forever; `lerp: 0.1` makes wheel scrolling trail input (~22 frames ≈ 365 ms to reach 90%) | source + `lenis` class on `<html>` | **Fixed** — removed; native scroll + CSS smooth anchors |
| D4 | P1 | Hero portrait core client-only (`ssr:false`) with a mismatched/absent placeholder → 212 px jump; LCP image deferred until JS | CLS 0.146–0.203 attributed to hero column | **Fixed** — server-rendered, stable box |
| D5 | P1 | `app/template.tsx` server-rendered every page at `opacity: 0` until hydration | inline style on `main > div` | **Fixed** — no fade on first load; fade kept for client navigations |
| D6 | P1 | Desktop nav used Framer `layout` (+3 `layout="position"` + `layoutId` pill); every nav re-render during scroll snapshotted all layout nodes on the page | 3× 84 ms rAF callbacks in Framer's projection chunk | **Fixed** — stable geometry, opacity-faded glass surface |
| D7 | P1 | Desktop cursor: React state update every 15 px of mouse movement, up to 25 particles animating `filter: blur()` | source | **Fixed** — imperative 14-node pool, transform/opacity only |
| D8 | P1 | Hero video: per-frame CSS `invert()+hue-rotate()` in light mode, masked full-hero layer; played on phones too | A/B: phone idle 24 → 47 fps without video | **Fixed on phones** (tablet+ only) and **filter removed** (pre-rendered light variants). **Desktop layer cost open** (D20) |
| D9 | P1 | Infinite decorative animations on phones (3 spinning rings, spinning Settings gear) driving style recalcs during scroll | A/B: pausing animations cut scroll style time ~66% | **Fixed** — rings spin only ≥768 px + motion-safe; gear rotates on hover |
| D10 | P1 | Google Tag Manager / Clarity loaded `afterInteractive`, competing with hydration (170 ms + 82 ms tasks) | LoAF attribution | **Fixed** — `lazyOnload` (still tracks every visit) |
| D11 | P2 | Fixed controls re-blurring at 40 px every scroll frame; nested backdrop blur in nav logo | computed styles | **Fixed** — 16 px, more opaque surface, no nesting |
| D12 | P2 | Large static `blur-3xl` glows (hero core, Omnidesk, Mission, Maps) | A/B desktop: removing filters 11 → 17–20 fps | **Fixed** — radial gradients, no filter |
| D13 | P2 | Home is ~16.6k px on a phone (~20 screens), ~19k px desktop | measured | Open → **Phase 3** |
| D14 | P2 | `pnpm lint` broken (Next 16 removed `next lint`; no ESLint config) | command output | Open |
| D15 | P2 | 9 type errors in test files; `next.config.ts` has `ignoreBuildErrors: true` | tsc | Open |
| D16 | P2 | Hydration still costs ~4–5 s of long tasks at 4× CPU throttle (large client tree, many Framer components) | headless benchmark | Open → Phase 3/15 |
| D17 | P3 | `lenis` dependency is now unused | grep | Open → Phase 15 cleanup |
| D18 | P2 | 3D-mode decorative chips showed fabricated telemetry ("99.9% UP", "AWS_CLOUD SYNCING…", "High memory usage on Node 3") | source | **Fixed** — neutral labels |
| D19 | P3 | Welcome popup used `var(--primary)` (raw RGB triplet) as a colour → black border | screenshot | **Fixed** |
| D20 | P2 | Desktop hero video layer: even paused it costs frames in the software-GPU harness (idle 11–16 vs 26 fps removed) | A/B | Open → **Phase 4** decision (harness exaggerates compositing; needs real-hardware check) |
| D21 | P3 | `cobe` globe (3D mode only) renders every frame, never pauses off-screen | source | Open → Phase 9 |

## Changes implemented (Phase 1)

- Lazy-loaded the 3D scene; replaced animated blur orbs with one static gradient atmosphere; made `LiquidBackground` static.
- Removed Lenis (and its CSS/attributes); native scrolling with `scroll-margin-top` for anchored sections.
- Server-rendered the hero portrait core; CSS-keyframe bob; no backdrop filters on moving/tilting parts; static glow.
- First page load paints immediately (template fade only on client navigations).
- Desktop nav: no Framer layout projection; glass surface fades in by opacity; active link via CSS opacity.
- Cursor trail/burst: fixed DOM pool animated with WAAPI transform/opacity.
- Hero video: tablet/desktop only; pre-rendered light-theme variants (`*-light.mp4/.webm`) chosen by theme in `MotionLoopVideo`; generator script now produces them.
- Mobile animation budget: rings static on phones; Settings gear no longer spins continuously.
- Analytics deferred to `lazyOnload`; fixed-control blur 40 → 16 px; static blur glows → radial gradients.

## Files changed (this phase)

- **Performance / layers:** `src/components/ui/FloatingGlassBackground.tsx`, `src/components/ui/LiquidBackground.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/template.tsx`, `src/components/ui/SmoothScroll.tsx` (deleted), `src/hooks/useSpatialScroll.ts` (comment)
- **Hero:** `src/components/hero/HeroSection.tsx`, `src/components/hero/SpatialCore.tsx`
- **Controls / interaction:** `src/components/navigation/MorphingNav.tsx`, `src/components/ui/IdentityDock.tsx`, `src/components/ui/SettingsPanel.tsx`, `src/components/ui/CustomCursor.tsx`, `src/components/ui/CommandMenu.tsx`, `src/components/ui/TerminalModal.tsx`, `src/components/lab/TerminalCard.tsx` (inert attribute removal)
- **Video pipeline:** `src/components/ui/MotionLoopVideo.tsx`, `scripts/generate-videos.js`, `public/assets/videos/*-light.{mp4,webm}` (new), `src/components/omnidesk/OmnideskSection.tsx`
- **Static glows / tokens:** `src/components/mission/MissionSection.tsx`, `src/components/maps/MapsExplorerSection.tsx`, `src/components/ui/ThemeWelcomePopup.tsx`
- **Docs:** `CLAUDE_CODE_MASTER_PROMPT.md`, `THE_SABBiR_PROJECT_CONTEXT.md` (replaced with pack v2), `CLAUDE_EXECUTION_RUNBOOK.md` (new), this report; `.claude/launch.json` gained a `prod` config (port 3100).

## Validation

- `pnpm test` 69/69 · `pnpm build` pass · app `tsc` 0 errors · link crawl 0 broken (prod build, 23 pages).
- Visual: headless Chrome screenshots of the production build at 1440×900 and 390×844 in light and dark; in-app browser pane at 390×844 for fixed-control geometry (dock right edge 374 px, 10 px above Settings).
- **Not done:** physical phone testing; Firefox/WebKit; a GPU-accelerated frame benchmark. The in-app pane was off-screen for most of the session, so its frame timings were throttled and are not reported.

## Performance evidence

### Headless Chrome (DevTools protocol, cache disabled, software GPU) — home page

"Before" = **live sabbir.nav.bd** (the committed code you currently experience). "After" = local production build of this working tree. Network differs (remote vs localhost), so compare LCP loosely; frame metrics are measured after load.

| Profile | Metric | Live (before) | Local (after) |
|---|---|---|---|
| Phone 390×844 DPR3, **4× CPU** | JS transferred | 550 KB | 274 KB |
| | LCP | 7.3–7.7 s | 0.7–1.3 s |
| | CLS | 0.015 | 0.000 |
| | Idle at top | 5.9–6.0 fps | 43–52 fps |
| | Scripted scroll (12,000 px / 10 s) | 5.4–5.8 fps, median frame 167 ms | 40.6–44.2 fps, median frame 16.7 ms |
| Desktop 1440×900, **2× CPU** | JS transferred | 557 KB | 278 KB |
| | Idle at top | 4.0 fps | 11–14 fps |
| | Scripted scroll | 3.3 fps, median 267 ms | 12.5–13.1 fps, median 67 ms |

Headless software-GPU rendering exaggerates compositing costs, so absolute desktop numbers are pessimistic. They are useful for before/after comparison, not as real-device FPS.

### In-app browser, production build, 390×844 (static metrics)

| Metric | Before | After |
|---|---|---|
| JS transferred / parsed | 539 KB / 1,875 KB | 267 KB / 880 KB |
| three.js loaded | yes | no |
| CLS on load | 0.203 | 0.000 |
| Big `blur()` layers in viewport | 5 | 1 |
| Running animations at top | 12 | 7 |

## Regressions or risks

- The desktop nav no longer morphs width; the glass pill fades in instead. The visual change is intentional; refine in Phase 11.
- The hero video no longer appears on phones (the static gradient remains). The desktop video stays pending the D20 decision.
- Spinning rings are static on phones.
- Native scrolling replaces Lenis's eased wheel scroll. This is intended (lower latency), but the feel is different.

## Unresolved factual decisions

- None open for Omnidesk or the 60% claim (both resolved above).

## Git / deployment

Local only. No commit, push, merge or deploy.

## Design-system proposal (for Phase 2)

One identity, three expressions, shared tokens:

- **Tokens:** `--primary` orange (`#ea580c` light / `#ff6a00` dark), `--accent` amber, `--signal` cyan (data/telemetry only), `--ok` emerald (verified/status only); surfaces `paper` / `card` / `glass` (glass = elevation level 2+ only); radius scale 8/12/16/24; type scale with editorial display (Geist, tight tracking) + mono labels; motion grammar: 150 ms state, 300 ms enter, 500 ms section; transform/opacity only; one owner per property.
- **Tactile Editorial** (Hero, identity, journey highlights): Bauhaus shapes as static SVG/CSS (circle, quarter-arc, bar) in brand orange on paper; kinetic headline as a single entrance; no perpetual 3D.
- **Luxury Glass & Fluid** (nav, cards, Settings, modals, case studies, contact): glass only on elevated/fixed surfaces (≤16 px blur, opaque enough for AA text); Art-Deco hairline corner marks on featured cards.
- **Cyber AI** (Lab, terminals, architecture diagrams): cyan signal lines, ASCII/grid textures, telemetry loop — confined to Lab/terminal surfaces.

## Next phase

**Phase 2 — art direction and design-system foundation:** implement the tokens and shared primitives above, starting with Hero, one information-card area and the Lab.
