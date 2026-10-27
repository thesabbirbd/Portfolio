# THE SABBiR — Phase 8 Report: Luxury Glass & Fluid System Rollout

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete** for navigation, Settings, command menu, Contact, content cards and the case-study layout. The Lab/terminal expression is Phase 9.

## Observed problems
1. **~290 undefined colour utilities across 22 files.** `text-muted-foreground` ×126, `bg-muted` ×60, `border-border` ×49, `text-primary-foreground` ×12 and `bg-card` ×8 were never defined, so Tailwind emitted nothing:
   - "muted" text wasn't muted;
   - muted surfaces were transparent;
   - `border border-border` fell back to Tailwind v4's **`currentColor`** default, giving dark ink lines on Notes, Journal, Contact and case studies.
2. **`text-muted` ×32** collided with `bg-muted`: one name can't be both a surface and a text colour.
3. **Settings dialog:** hand-rolled button grids, no `role="switch"`/`aria-checked`, no focus management (focus stayed behind the dialog), legacy variable soup.
4. **Overlay glass too translucent:** page text showed through the Settings dialog content in both themes.
5. **Content cards:** five per-category colour themes (purple/emerald/orange/blue/slate) and **8px tag text** on phones.
6. **Rainbow nav/dock icons** (rose, amber, emerald, sky, violet, fuchsia): unrelated colours, against the art direction.
7. **Case-study status badges, glass inputs and toasts** used off-system slate/zinc/blue/purple colours.

## Decisions
- **Fix centrally, not per file:** the shadcn-style names become **aliases of the design tokens** (`muted`, `muted-foreground`, `border`, `primary-foreground`, `card`, `card-foreground`). Plain `border` defaults to the token hairline in `@layer base`. `--muted` is a solid per-theme tint, so modifiers like `bg-muted/30` stay visible.
- **Glass hierarchy enforced:**
  - Level 1: paper cards, no blur.
  - Level 2: fixed controls, 16px blur.
  - Level 3: overlays, 20px blur, **95% opaque** for legibility.
- **"Fluid" motion only where state changes matter:** a sliding segmented pill for theme and palette (click-driven). Switch thumbs move with a CSS transform.
- **Icons:** ink by default, primary when active or hovered. Status colours are semantic only (signal = info, ok = success/active).

## Changes implemented
- `src/app/globals.css`: alias colour tokens; `--muted` per theme; base border colour; `.surface-overlay` at 95% opacity.
- `text-muted` → `text-ink-3` in 8 files.
  - My regex also matched inside `var(--text-muted)`; I caught this and repaired all 4 affected files (0 broken references remain).
- **New** `src/components/system/Controls.tsx`: `Segmented` (`role="radiogroup"`/`radio`, sliding pill) and `Switch` (`role="switch"`, `aria-checked`).
- `src/components/ui/SettingsPanel.tsx`: dialog rebuilt on the new primitives.
  - Level-3 overlay with Art-Deco corners, and a bottom sheet on phones.
  - Focus moves to Close on open, Tab is trapped inside, Escape closes, and focus returns to the gear.
  - Accurate descriptions; sound is noted as off by default.
- `src/components/content/ContentCard.tsx`: rebuilt on `surface-card` + `surface-interactive`.
  - One category chip style and a `<time>` element.
  - Type is 11px or larger (it was 8px on phones).
  - Joins the scroll grammar.
- `src/components/content/ProjectLayout.tsx`: status badges mapped to semantic tokens (active → ok, experimental → signal, completed → primary, prototype → accent, idea/paused/archived → neutral).
- `src/components/ui/glass/GlassInput.tsx`: `surface-card`, ink text/placeholder, primary focus ring, 16px text on phones (prevents iOS zoom).
- `src/components/navigation/MorphingNav.tsx`, `src/components/ui/IdentityDock.tsx`: unified icon colours; the rainbow `colorClass` fields were removed.
- `src/contexts/ToastContext.tsx`: info → signal, success → ok.

## Validation
- `pnpm test` 69/69 · build pass · app `tsc` 0 · `link-audit`: 23 pages, 0 problems.
- Built CSS confirmed to contain the alias utilities (`bg-muted/NN`, `text-muted-foreground`, `border-border`, `text-primary-foreground`, `bg-card`) and the base border rule.
- **Settings (headless Chrome):** desktop light and phone dark screenshots. Focus lands on "Close settings" on open and returns to "Open System Settings" after Escape. 0 page exceptions.
- Screenshots: command menu (desktop light), `/contact` (desktop dark), `/notes` (phone light), `/projects/omnidesk` (desktop light).

## Performance evidence (headless Chrome, idle machine)

| Page / profile | Result |
|---|---|
| Home phone 4× | idle 60 · scroll 60 fps · LCP 0.38 s · CLS 0 |
| `/contact` phone 4× | idle 60 · scroll 60 fps · LCP 0.36 s · CLS 0 |
| Home desktop 2× | idle 60 · scroll 57.8 fps · LCP 0.42 s · CLS 0 |

## Regressions / risks
- Muted text, card borders and surfaces now render as designed on ~22 files that were previously unstyled. This is a visible, intended change; pages beyond those screenshotted were checked only by crawl.
- Contact copy ("technical consulting", "Backend Architecture") may overstate an entry-level profile → reviewed in Phase 13.
- The Command Menu's internals still use `text-foreground/80`-style classes (valid tokens). The menu itself was not restyled further.

## Unresolved factual decisions
None.

## Next phase
Phase 9 — Engineering Lab / Cyber AI expression.
