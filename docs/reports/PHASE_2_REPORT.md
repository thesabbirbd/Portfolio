# THE SABBiR — Phase 2 Report: Art Direction & Design-System Foundation

**Date:** 2026-10-28 · **Previous:** `docs/reports/PHASE_0_1_REPORT.md` (verified present in the working tree before starting)
**Git:** local changes only. Nothing was committed, pushed, merged or deployed.

---

## Phase / status

**Complete.** The tokens and primitives work without regression. The system is applied to the three representative areas: Hero, identity cards and Lab. Per the brief it is **not** rolled out site-wide; the other sections inherit only the shared-primitive changes (tokens, surfaces, buttons, font).

## Observed problems (proven in source and screenshots)

1. **The brand font was never applied.** Geist is loaded by `next/font`, but `body` used a system-ui stack, so Linux showed Ubuntu/Cantarell and other systems differed again.
2. **Two colour systems coexisted.** Glass surfaces, hovers and shadows were hard-coded blue/cyan (`rgba(0,102,255,…)`, `rgba(0,240,255,…)`), competing with the orange identity. `--color-secondary` was amber in light mode and purple in dark mode.
3. **Text tokens failed contrast.** Light-mode amber `#ffb800` was used as a text colour (55 uses) at ≈1.7:1, and the previous light primary `#ea580c` was 3.4:1.
4. **Nine overlapping glass classes, all with backdrop blur.** Every in-flow card carried a backdrop filter ("universal wrapper").
5. **Two owners of `transform`.** `GlassCard` (`transition-all` + Framer `whileHover`), Lab cards (`transition-all` + Framer `layout`) and About matrix cards (Framer `whileHover` + CSS hover lift).
6. **Hero entrances hid content until hydration.** The status badge, tech pills and both CTAs started at `opacity: 0` via Framer, so the primary CTA was invisible until JS ran.
7. **`motion-safe:` variants were silently ignored.** They were applied to plain CSS classes, so Phase 1's `motion-safe:animate-float-subtle` never ran.
8. **Overclaiming bio copy.** "production-grade software engineering … architecting resilient backend systems, deploying local-first AI pipelines" conflicts with the context rules.

## Design / engineering decisions

**One identity, three expressions, one token layer** (`src/app/globals.css`):

| Layer | Tokens | Notes |
|---|---|---|
| Editorial base | `--paper`, `--ink`, `--ink-2`, `--ink-3` | Warm paper `#faf8f5` / graphite `#0d0d10`; stone ink |
| Surfaces | `--surface`(+alpha), `--line`(+alpha), `--elev-1/2/3` | Warm-neutral shadows; no blue tints |
| Brand (decorative) | `--brand`, `--brand-2`, `--brand-3` | Vivid `#ff6a00/#ffb800/#ff3300` in both themes, used for shapes and gradients |
| Brand (text/fill) | `--primary`, `--accent`, `--color-secondary`, `--on-primary` | Per palette and theme, chosen by measured contrast (below) |
| Supporting | `--signal` (cyan), `--ok` (emerald) | Data/telemetry and verified/status only, never brand |
| Type | `text-display`, `text-h2`, `text-h3`, `text-lede`, `text-eyebrow`; `--font-sans/mono` = Geist | Tailwind `@theme` tokens |
| Shape / motion | `rounded-card`, `rounded-panel`, `ease-out-expo`, `--dur-fast/base/slow`, `animate-rise`, `animate-bob` | Mirrors `src/lib/motion-presets.ts` |

Tailwind utilities come from the tokens: `bg-paper`, `text-ink-2`, `border-line`, `text-signal`, `bg-ok/10`, `fill-brand`, `shadow-e2`, etc. Legacy variables (`--text-primary`, `--border-glass`, `--bg-card`, `--vibrant-*`, …) are now **aliases** of the semantic tokens, so 60+ existing components adopt the system without per-file edits.

**Surface (elevation) system.** It lives in `@layer components`, so Tailwind utilities can still override it.
- **Level 1 `surface-card`**: in-flow content with **no backdrop-filter**. Legacy `.glass-subtle` and `.glass-interactive` map here.
- **Level 2 `surface-glass`**: fixed/floating controls, 16px blur. `.glass-panel` and `.spatial-glass` map here.
- **Level 3 `surface-overlay`**: modals and the command menu, 20px blur. `.glass-spatial` and `.spatial-glass-heavy` map here.
- Interactive cards change paint only in CSS; movement is owned by one system per element.
- Dead classes were removed: `glass-featured`, `glass-panel-hover`, `glass-specular-top`, `bg-grid-pattern`, `ambient-radial-glow`, and the old blue `spatial-glass`.

**Expression details (CSS, no extra DOM, no runtime cost):** `deco-corners` (Art-Deco hairline corners), `signal-grid` (static masked grid), `signal-edge` (cyan top hairline), `text-display-gradient`.

**New primitives** (`src/components/system/`, server-safe):
- `SectionHeader` with `Eyebrow`, `Accent`: one heading pattern; `expression="editorial" | "glass" | "signal"`.
- `Card` (`paper | elevated | glass | signal`, `deco`, `interactive`) and `RoleIcon` (`brand | accent | signal | ok`: colour encodes meaning).
- `BauhausField`: a static SVG composition (dot grid, gradient quarter disc, amber sun with offset shadow disc, ink bars, dashed arc).

**Shared primitives updated:** `GlowButton`, `GlassButton` and `GlassCard` now use tokens. `GlassCard` defaults to level-1 surfaces, and its transform has a single owner. Primary buttons use `--on-primary` (white in light mode, dark ink in dark mode), so the CTA passes AA in both themes.

## Changes implemented (representative areas)

- **Hero — Tactile Editorial + restrained glass:**
  - Editorial wordmark: **THE** in ink, **SABBiR** in the display gradient (`text-display`).
  - Static `BauhausField` behind the portrait core, sized to the core so it never sits over text on phones.
  - Portrait rings, glow and shadow moved to brand tokens.
  - Role pill and tech pills moved onto `surface-card`.
  - Status dot uses `ok`.
  - Entrances use the CSS `rise` keyframe, so badge/pills/CTAs are visible from first paint.
  - The sphere bob now actually runs (`motion-safe:animate-bob`).
- **Identity cards (About) — editorial cards:**
  - `SectionHeader` (index 01, editorial expression).
  - The four facts (Academic/Base/Discipline/Honors) became `Card deco` with `RoleIcon` roles brand/accent/signal/ok and readable type (no text below 12px).
  - "My World" matrix cards use `Card interactive` with a CSS-only hover lift (single transform owner).
  - Emoji removed from section titles.
- **Lab — restrained Cyber AI:**
  - `SectionHeader expression="signal"` (bracketed mono eyebrow, cyan accent).
  - Static `signal-grid` behind the header.
  - Filter pills are neutral mono with a signal active state and `aria-pressed`; the five competing colour themes are gone.
  - Experiment cards are `article` elements with `signal-edge`, a signal category chip and an `ok` status.
  - The terminal is solidly dark in both themes, with a signal edge.
- **Palette persistence:** a pre-paint inline script applies the saved `data-theme-color`, so a saved Blue or Green palette no longer flashes Orange on load.
- **Copy (factual integrity):** "production-grade software engineering" → "hands-on software engineering". "Architecting resilient backend systems, deploying local-first AI pipelines, and mastering the modern DevOps lifecycle" → "building reliable backend systems, experimenting with local-first AI, and learning the modern DevOps lifecycle" (`src/data/profile.ts`).

## Files changed (this phase)

- **Tokens / surfaces / typography:** `src/app/globals.css`, `src/app/layout.tsx` (pre-paint palette script), `src/lib/motion-presets.ts` (comment link)
- **New primitives:** `src/components/system/SectionHeader.tsx`, `src/components/system/Card.tsx`, `src/components/system/BauhausField.tsx`
- **Shared primitives:** `src/components/ui/GlowButton.tsx`, `src/components/ui/glass/GlassButton.tsx`, `src/components/ui/GlassCard.tsx`
- **Representative application:** `src/components/hero/HeroSection.tsx`, `src/components/hero/SpatialCore.tsx`, `src/components/about/AboutSection.tsx`, `src/components/lab/EngineeringLabSection.tsx`, `src/components/lab/TerminalCard.tsx`
- **Content:** `src/data/profile.ts` (bio wording)

## Validation

- `pnpm test` 69/69 · `pnpm build` pass · `tsc` app code 0 errors · internal link crawl (prod build) 23 pages, 0 broken.
- **Contrast (WCAG 2.x), computed from the token values:** every text token on paper and on card surfaces, on-primary buttons, and text on its own 10% tint chip. **0 failures** (≥ 4.5:1) in light and dark for the Orange palette; Blue and Green palettes also pass in both themes.

  | Light (orange) | paper | card | tint chip |
  |---|---|---|---|
  | ink / ink-2 / ink-3 | 16.5 / 9.7 / 7.2 | 17.2 / 10.1 / 7.5 | — |
  | primary `#bc3f0b` | 5.14 | 5.36 | 4.63 |
  | accent `#ad4f08` | 5.08 | 5.30 | 4.63 |
  | signal / ok | 5.05 / 5.17 | 5.27 / 5.40 | 4.59 / 4.70 |
  | white on primary button | 5.45 | | |

  Dark: all ≥ 6.3:1 on paper/card, and dark ink on the orange button is 6.76:1.
- **Theme persistence, through the real Settings dialog (in-app browser, production build):** Dark + Blue applied immediately and was stored, survived a reload (`data-theme-color="blue"`, dark class, no inline overrides), and resetting to Orange + Light works. The body font resolves to Geist.
- **Visual:** headless Chrome screenshots of Hero, identity cards and Lab at 1440×900 and 390×844, light and dark. Issues found and fixed during the phase: Bauhaus geometry overlapping hero text on phones, grey terminal in light mode, Art-Deco corners clipped by the card radius.

## Performance evidence (headless Chrome, same harness as Phase 1)

| Profile | Phase 1 end | Phase 2 |
|---|---|---|
| Phone 390×844, 4× CPU — scroll | 40.6–44.2 fps | **49.7–50.6 fps** (median frame 16.7 ms) |
| Phone — idle at top | 43–52 fps | 52–55 fps |
| Phone — LCP / CLS / JS | 0.7–1.3 s / 0 / 274 KB | 0.67 s / 0 / 275 KB |
| Desktop 1440×900, 2× CPU — scroll | 12.5–13.1 fps | **18.6 fps** |

The gain comes mainly from removing backdrop-filter from in-flow cards. Software-GPU numbers are for comparison only, not real-device FPS.

## Regressions or risks

- **Visible, intentional changes:**
  - The site-wide font is now Geist.
  - Light-mode orange is deeper (`#bc3f0b`) for AA; vivid orange stays in decorative shapes and dark mode.
  - Cards outside the three areas lose their backdrop blur (they are now paper surfaces).
  - The hero name is no longer a blue/cyan gradient.
- **Not yet migrated** (Phases 3–9): Projects/Omnidesk, Skills, Maps, Community, Mission and Contact still use per-component `slate-*`/blue/cyan classes. They inherit the tokens only where they use the legacy variables or glass classes.
- **Off-brand accents remain** inside the About portrait overlay (cyan "S" badge and label); Phase 5 recomposes the identity area.
- The `BauhausField` SVG uses fixed ids (`bh-dots`, `bh-disc`). That is fine with one instance per page; give them unique ids if it is ever reused twice on a page.
- **Not done:** physical-device testing, Firefox/WebKit, automated axe audit (Phase 14).

## Unresolved factual decisions

None new. Omnidesk and the 60% claim were already resolved (see the Phase 0–1 report). The only copy edits were the two bio phrases above.

## Git / deployment

Local only. No commit, push, merge or deploy.

## Next phase

**Phase 3 — Home composition and long-page breakup.** Turn the ~16.6k px phone homepage into a curated overview using `SectionHeader`/`Card`, with "explore the full story" paths to the existing routes.
