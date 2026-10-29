# THE SABBiR — v4.0.1 · Phase 3 Report: Three-theme architecture

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

## Status
**PASS.** Theme audit 15/15. All 6 theme × mode combinations pass contrast at token level (computed CSS) and in rendered pages (17 routes each, 0 issues).

## The three themes

| Theme | Family / name | Light mode | Dark mode |
|---|---|---|---|
| **Orange** | Royal · Amber Glass | Warm ivory paper, champagne tint, primary `#b23a0a`, amber-gold accent, gold/orange brand | Warm graphite, vivid `#ff6a00` / `#ffb800` |
| **Green** | Studio · Emerald | Warm cream paper, emerald `#046a4d`, teal accent, emerald/mint/leaf brand | Deep green-black, mint `#34d399`, leaf accent |
| **Blue** | Tech · Cyan Circuit | Clean cool neutrals, blue `#1d4ed8`, cyan accent, blue/cyan/indigo brand | Deep navy, `#60a5fa` with cyan accent |

Each theme now has its own paper, ink (3 levels), surface, muted tint, line, **shadow hue**, primary, accent, brand trio and display gradient, in both modes. Previously only primary, accent and brand changed. The existing Light / Dark / System controls are preserved. Section-specific motifs (Art Deco, Bauhaus, schematics) belong to Phase 4.

## Selection rules
1. **A manual choice wins** (`localStorage: sabbir_color_theme`) on every visit.
2. **Without one, each new session gets one random theme**, stored in `sessionStorage: sabbir_session_theme`. It stays the same across client navigation, full page loads and reloads of that session, and is never re-rolled per route or render.
3. **"Randomize"** (in Settings and the command menu) forgets the saved choice and rolls a *different* theme for this session.

## How it is built
- **`src/lib/theme-color.ts`** (no React): the theme list and meta, `resolveThemeColor()`, and **`THEME_INIT_SCRIPT`**.
  - That script is inlined in `<head>` and sets `html[data-theme-color]` and `data-theme-source` **before first paint**, using the same rules as `resolveThemeColor`. A unit test runs the script and compares the two.
  - It is safe when storage is blocked (every storage call is wrapped; it falls back to a random theme for this page).
- **Hydration safety:** the server never renders theme-specific markup. CSS reads the attribute; `<html>` already has `suppressHydrationWarning`; React reads the attribute only after mount.
  - Result: **no flash and 0 hydration warnings** (checked by `theme-audit`).
- **`src/lib/theme-color-store.ts`** ("use client"): a tiny `useSyncExternalStore` store with `useThemeColor()`, `useThemeSource()`, `setThemeColor()` and `randomizeThemeColor()`.
  - **Theme state left `SettingsContext`**, so changing theme re-renders only Settings, the command menu, the toast and the 3D scene, not every settings consumer.
  - Changes **cross-fade with the View Transitions API** when motion is allowed, and switch instantly under reduced motion.
- **`SpatialScene` (3D)** used to **poll** the attribute every 500 ms; it now subscribes to the store.
- **Settings:** a "Colour theme" segmented control (Orange / Green / Blue) and a **Randomize** button. A line explains the current state, e.g. "Studio · Emerald — saved on this device" or "… picked at random for this visit".
- **Command menu:** "Colour theme: … (Royal/Studio/Tech)" for the other two themes, plus "Randomize colour theme".

## Entry toast (`src/components/ui/ThemeToast.tsx`)
The old light/dark welcome popup (`ThemeWelcomePopup.tsx`) was removed and replaced.

- **One notice per browser session**, e.g. "Studio theme: Emerald — picked for this visit. Switch anytime in Settings." With a saved choice it says "your saved choice".
- **Not shown again** on other routes or reloads in that session. It also closes when the visitor navigates.
- **Placement:**
  - Phones: top of the screen (the nav lives at the bottom).
  - md and up: **below the desktop nav** at 100 px on the right. The audit verifies **no overlap with the nav**.
- **Behaviour:**
  - Auto-hides after 7 s, paused while hovered or focused.
  - "Change" opens Settings through a new `openSettings()` UI event.
  - The ✕ button is labelled "Dismiss theme notice".
- **Accessibility and rendering:** `role="status"` with `aria-live="polite"`; client-only, so there is no SSR mismatch.

## Contrast (verified two ways)

**`scripts/qa/theme-contrast.mjs`** reads the **computed CSS** of the running site for each theme × mode. Text tokens are measured against paper, cards, muted and the primary/10 tint:

| Theme · mode | ink-3 | primary | accent | signal | ok | on-primary | display |
|---|---|---|---|---|---|---|---|
| Orange light | 6.40 | 4.83 | 4.83 | 5.10 | 5.19 | 6.00 | 3.29 |
| Orange dark | 6.42 | 5.55 | 9.19 | 8.82 | 8.29 | 6.70 | 6.70 |
| Green light | 6.08 | 5.27 | 5.28 | 5.04 | 5.13 | 6.62 | 4.61 |
| Green dark | 6.70 | 8.21 | 10.46 | 8.73 | 8.21 | 10.00 | 7.52 |
| Blue light | 6.12 | 5.41 | 5.11 | 5.11 | 5.20 | 6.70 | 3.46 |
| Blue dark | 6.42 | 6.48 | 9.11 | 9.11 | 8.57 | 7.56 | 7.70 |

All ≥ 4.5 (text) and ≥ 3 (display gradient): **0 failures.**

**`scripts/qa/a11y-audit.mjs`**, rendered-text contrast plus structure, run for each theme in light 1440×900 and dark 390×844 across 17 routes: **0 issue groups in all 6 runs.**

## `scripts/qa/theme-audit.mjs`: 15/15
- A new session gets a valid random theme before paint, and the session key is stored.
- **The toast** names the theme and points to Settings, and does **not** cover the desktop navigation.
- **Same session:**
  - Client navigation keeps the theme.
  - The toast is **not** shown on the next route.
  - Reload keeps the theme (source: session), and the toast is **not** shown after the reload.
  - Full loads of `/about`, `/aiyaar` and `/engineering-lab` keep the theme.
- **New sessions** re-roll: 8 sessions saw all three themes (green, orange, blue).
- **Settings** applies and saves a manual theme and explains its source. The saved theme applies in a new session and survives reload.
- **Randomize** forgets the saved choice and switches to a different theme.
- **0 hydration warnings / console errors.**

Unit tests added (12): resolution precedence, random mapping, init-script parity and storage-blocked safety, store save/randomize, and the toast's once-per-session, dismiss, auto-hide and "Change" behaviour.

## QA determinism
`scripts/qa/cdp.mjs` now saves `THEME=orange` by default (`THEME=green|blue|random` to override) and suppresses the toast unless `TOAST=1`, so audits and screenshots stay comparable.

## Gate
**PASS.** All palettes were tested, and persistence was verified across routes, reloads and sessions.
