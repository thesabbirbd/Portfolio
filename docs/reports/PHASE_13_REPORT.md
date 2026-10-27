# THE SABBiR — Phase 13 Report: Whole-site interactions & deep-route integrity

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete.**

## Route inventory (discovered from `src/app`)
- **Pages:** `/`, `/about`, `/experience`, `/projects`, `/projects/[slug]` (7), `/engineering-lab`, `/engineering-lab/[slug]` (1), `/notes`, `/notes/[slug]` (2), `/journal`, `/journal/[slug]` (2), `/exploration`, `/contact`, `/resume`, `/search`.
- **Other routes:** `not-found`, `error`.
- **Endpoints:** `/api/search` (a static index; filtering happens on the client), `/feed.xml`, `/sitemap.xml`, `/robots.txt`.

## Method
- `link-audit` crawls every internal page, then checks every `<a href>` for a 200 status and that each `#anchor` exists. It also prints the external links.
- **New** `scripts/qa/interaction-audit.mjs`: **21 ACTION → FEEDBACK → RESULT checks** using real CDP keyboard and mouse input. It covers the command menu, global terminal, search, settings, IdentityDock, the home quick-view dialog, the Lab filter, resume print, 404 and RSS. It was run 3 times to rule out flakiness.

## Observed problems
1. **Project quick-view dialog** (`ProjectModal`):
   - No `role="dialog"`, no `aria-modal` and no accessible name.
   - Focus stayed behind the dialog, never returned to the trigger, and was not trapped.
   - Clicking the backdrop did nothing.
   - At `z-50` it tied with the nav layers.
2. **Overclaims still in the codebase:**
   - **Resume:** NOC internship described as "enterprise-level network monitoring … for a **massive user base** … structural network issues".
   - **Maps data:** "**Top Contributor**" status (unverified) and "help **millions** navigate Bangladesh" (an invented scale), shown on `/exploration` and the Home "Beyond" chapter.
   - **Global terminal:**
     - `status` labelled "**Live** system telemetry" (it's static text).
     - `whoami` said "building resilient software architectures & local AI pipelines".
     - `maps` repeated "Top Contributor".
     - `omnidesk` listed "PWA" (the case-study stack lists Tauri and React).
3. **LinkedIn in three URL forms** (`bd.linkedin.com/…`, `www.linkedin.com/…/`, `linkedin.com/…`).
4. **Resume:**
   - Top padding doubled with the layout's (`md:pt-24` + `md:pt-24`).
   - Mode/role toggles had no pressed state for assistive tech.
   - "Print PDF" implied a generated file; it's the browser print dialog.
5. **Previously reported issues re-verified (not blindly re-patched):**
   - Search links: `/api/search` builds `/<type>/<slug>` and maps `lab` → `/engineering-lab`. **No `/undefined/` anywhere.**
   - Latest-thinking links: all resolve in the crawl.
   - **Omnidesk slug:** `PROJECTS_DATA` id `omnidesk-bd` → slug `omnidesk` → `/projects/omnidesk` (200). Every command-menu project link resolves.

## Changes implemented
- `src/components/projects/ProjectModal.tsx`:
  - `role="dialog"`, `aria-modal`, `aria-labelledby` pointing at the title.
  - Focus moves to Close on open and returns to the trigger on close; Tab is trapped inside.
  - Backdrop click closes; Escape closes.
  - The body overflow is restored; `z-[100]`; a clearer close label.
- `src/components/resume/ResumeInterface.tsx`:
  - Factual NOC description ("network monitoring and first-line support as an intern …").
  - `aria-pressed` on the role and mode toggles; "Print / Save PDF"; normalised top padding.
- `src/data/community.ts` (maps):
  - "Active contributor".
  - "Received a gift from Google HQ as a Local Guide" (consistent with the About Honors card).
  - Narrative without invented scale.
- `src/components/ui/TerminalModal.tsx`:
  - Factual `whoami`, `status`, `omnidesk`, `maps` and `mission` outputs.
  - Case-study and page paths included.
- `src/components/lab/TerminalCard.tsx`: messages match the renamed sections.
- **LinkedIn:** a single canonical URL from `src/data/socials.ts`. Contact now reads it from data; About uses the same URL.
- *(Earlier this phase-run:* contact copy and the intent flow were rewritten in Phase 10.)

## Validation
- **`interaction-audit`: 21/21, three consecutive runs.**
  1. `Ctrl+K` opens the command menu. Typing "Journal" then Enter navigates to `/journal`. Escape closes it.
  2. `` ` `` opens the terminal. `help` lists the commands, `omnidesk` prints the case-study path, and Escape closes it.
  3. Searching "omnidesk" shows the case-study result, and clicking it opens `/projects/omnidesk`. No `/undefined/` appears.
  4. Settings: Dark sets `html.dark` and Blue sets `data-theme-color="blue"`. Escape closes and **focus returns to the gear**.
  5. The quick-view button opens the project dialog. Escape closes it and restores page scroll.
  6. The Lab category filter narrows the list (6 → 1).
  7. Resume Print switches to professional mode and calls `window.print`.
  8. Dock: Toggle Theme flips the scheme; Contact scrolls to the Home contact chapter.
  9. An unknown route returns **404** with a link home.
  10. `feed.xml`: all 12 item links resolve (200).
- `link-audit`: 23 pages, 0 problems.
- **External links:** 19 unique (profiles, Omnidesk repo, community organisations, maps), all well formed. They weren't fetched, to avoid hammering third-party sites.
- `pnpm test` 71/71 · build pass · app `tsc` 0.

## Regressions / risks
- Wording changes in data (Local Guide status, NOC description) are visible on `/exploration`, Home "Beyond" and `/resume`. They are deliberate, per "less hype, more defensible evidence".
- The `/about` "In my own words" passage is the owner's personal voice ("my heart beats in the terminal"). It was left unchanged as voice, not factual claim.

## Unresolved factual decisions
- **Omnidesk:** the published claims match the repository README (local-first learning workspace). No unresolved claim is published.
- **NOC internship:** `/resume` says **Shunno IT (2022–2023)**; the About Honors card says **"NOC Intern · BHTPA"**. Both come from the repository. The owner should confirm whether these are the same programme.

## Next phase
Phase 14 — Accessibility, resilience & cross-device regression.
