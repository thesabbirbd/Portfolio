# THE SABBiR — Phase 10 Report: Dedicated mobile composition

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete.** Fixed-control collisions while scrolling (the floating Terminal, Settings and dock bubbles over content, especially in short landscape) are Phase 11.

## Method
- **New** `scripts/qa/mobile-audit.mjs` (dependency-free, headless Chrome). For every route × viewport it reports:
  - horizontal overflow (elements past the viewport that no ancestor clips);
  - readable text under 11px;
  - tap targets under 24×24 (WCAG 2.2 target size). Inline text links and stretched card links are exempt.
- **Matrix:** 16 routes (13 primary routes + 3 detail pages, including a 404) × 9 viewports (320×640, 360×800, 375×812, 390×844, 402×874, 414×896, 430×932, 844×390, 768×1024).
- Screenshots reviewed at 320×640, 360×800, 375×667, 390×844 and 844×390.

## Observed problems
1. **Baseline matrix: 843 findings.**
   - Footer social row overflowed at 320 and 360px (7 icons in a non-wrapping row).
   - 10px text in ~20 places: hero badge, portrait label, mission numbers, status badges, resume levels, map captions, community text, architecture node numbers, and a footer "Press Ctrl+K" hint shown on touch phones.
   - 20px or shorter tap targets: every breadcrumb, "Case study" and "View case study" links, community links (15px), resume evidence links, the Lab terminal input, and timeline rail links.
2. **Capabilities Matrix (`/experience`) broken on phones:**
   - "+N MORE" text overlapped the chips and a white gradient washed them out.
   - Hidden skills appeared only on **hover**, so they were unreachable by touch.
   - Fixed 160px rows left large empty card areas.
   - The skills list was hardcoded and contradicted the canonical data. It included **"RAG Systems", "Agentic Workflows", "LangChain", "BGP/OSPF", "Zabbix", "Grafana", "CI/CD"** — claims the project rules say not to make.
3. **Contact flow broken on phones.** Tapping a reason rendered the form **below the Quick Links**, off screen, so the tap appeared to do nothing. The empty state said "on the left", which is wrong on phones.
4. **Inner-page openings were oversized:**
   - `pt-20` stacked on the layout's `md:pt-24` (176px before the breadcrumb on desktop, 92px on phones).
   - Two long intro paragraphs on Projects, Contact, Experience and Exploration.
   - Each page hand-rolled its own breadcrumb and h1.
5. **Mission section (`/experience`):**
   - Simulated telemetry: "Live command center", a "Deployment Pulse: Active" tile, "SPRINT_TARGET: PRODUCTION_GRADE".
   - Overclaiming pillars: "High-Throughput APIs", "Linux kernel optimization", "Cloud Automation".
   - A rainbow gradient title and 11px pillar text in a cramped 2-column grid on phones.
6. **Projects (`/projects`):**
   - The filter wrapped into 3 rows on phones.
   - Free-form status labels outside the code's own status vocabulary: "Production Bench", "Field Operational", "Benchmark Active", "Active R&D".
   - Two near-duplicate categories ("AI" and "AI & Automation").
7. **Hero at 320×640:** the "Connect With Me" CTA sat under the bottom dock.

## Decisions
- **11px is the floor** for readable text. Decorative `aria-hidden` art (FloatingGlassBackground) is exempt. Keyboard hints are hidden on touch layouts instead of being shrunk.
- **Touch parity:** nothing is revealed only on hover. Every skill is visible, with its honest level (Active Focus, Hands-on or Foundational) from `src/data/skills.ts`.
- **One `PageHeader` primitive** for inner routes: breadcrumb plus an h1 `SectionHeader` with a single short lede. The same compact opening on every page.
- **Contact:** the same order on every screen size (reason → message → links). An explicit tap on a reason scrolls the form into view on phones; this is the user's action, not scroll-jacking.
- **Status labels normalised** to the code's existing union (`active` / `experimental` / `completed`).
  - "Production Bench" (a home MikroTik lab) became `active`.
  - "Field Operational" (the custom UPS build) became `completed`.
- **No global scaling:** every change is per-component and responsive.

## Changes implemented
- **New primitives and tools:**
  - `src/components/system/PageHeader.tsx`.
  - `scripts/qa/mobile-audit.mjs`.
- **Inner pages.** These now use `PageHeader` and `pt-6 md:pt-8`:
  - `src/app/{projects,contact,notes,journal,exploration,search,experience,engineering-lab}/page.tsx`.
  - The journal rail is narrower on phones.
  - `ContentLayout`, `LabLayout` and `ProjectLayout` get the same top padding.
- `src/components/skills/SkillsBento.tsx`: rebuilt from canonical skills data, with a level legend, level dots plus screen-reader text, and a 1/2/3-column grid. The invented skills list is gone.
- `src/data/skills.ts`: taglines and contexts toned down ("High-throughput", "High availability", "Stateless microservice", "VPS Orchestration" removed). The NOC context now matches the "NOC intern" fact.
- `src/components/mission/MissionSection.tsx` and `src/data/profile.ts` (mission):
  - Static, factual mission card with five focus areas and an "In progress" status.
  - A "Code on GitHub" card linking Omnidesk BD.
  - A community roll-call.
  - No fake live data.
- `src/components/contact/ContactSection.tsx`:
  - Intents are a `radiogroup` (2×2 on phones).
  - Numbered steps, form directly under the choice, scroll-into-view on tap.
  - Token styling and 16px inputs on phones.
  - Truthful draft and copy feedback kept.
  - Neutral placeholders; the subject uses the intent title.
- `src/components/content/ProjectBrowser.tsx`:
  - Single-row scrollable filter (`aria-pressed`) and token cards.
  - The stretched title link makes the whole card tappable.
  - Status chips use semantic colours, plus a live result count for screen readers.
- `content/projects/*.mdx`: `projectStatus` normalised; "AI" and "AI & Automation" became **"Local AI"**. `src/data/projects.ts` statuses aligned.
- `src/components/layout/Footer.tsx`:
  - Static: no `whileInView` opacity 0, so it is visible without JS.
  - Token-based, monochrome wrapping icons with 44px targets.
  - Clear link labels.
  - Phone bottom padding clears the dock (with safe-area).
  - Description toned down.
- 10px → 11px (or `text-xs`) across 16 components.
- Breadcrumb target size handled centrally in `globals.css` (`@layer base`).
- Larger targets for: case-study links, community links, resume links, timeline rail links, the hero chapter cue and the Lab terminal input.
- Hero (`short-portrait`): tighter top padding, role row and CTA gap, so both CTAs clear the dock at 320×640.

## Validation
- **`mobile-audit`:** baseline **843 findings** → **0 findings** (16 routes × 9 viewports).
- `link-audit`: 23 pages, 0 problems · `pnpm test` 69/69 · build pass · app `tsc` 0.
- **Contact flow (390×844, headless):**
  - Tapping "Career / Hiring" sets `aria-checked="true"` and scrolls the form into view (heading at 69px, Name field at 211px). Screenshot captured.
- **Screenshots:**
  - Hero at 320×640, 360×800 and 375×667: both CTAs are above the dock.
  - `/experience`: header, mission and skills.
  - `/projects` filter row; `/journal` at 360px; `/contact`.

## Performance evidence (headless Chrome, phone profile, 4× CPU)

| Route | Result | Page height at 390px |
|---|---|---|
| Home | idle 60 · scroll 60 fps · LCP 0.43 s · CLS 0 | 8,456 (was 8,538) |
| `/experience` | idle 60 · scroll 60 fps · LCP 0.53 s · CLS 0 | 5,654 (was 6,549) |
| `/projects` | idle 60 · scroll 60 fps · LCP 0.44 s · CLS 0 | 3,308 (was 4,402) |
| `/contact` | idle 60 · scroll 60 fps · LCP 0.33 s · CLS 0 | 1,846 (was 2,770) |

## Regressions / risks
- **Status labels on project cards changed wording.** For example "Production Bench" → "active" and "Field Operational" → "completed". This is a factual-tone decision; the owner may prefer different wording for the UPS build.
- **Experience skills now show only the canonical list.** Skills that existed only in the old hardcoded matrix (Node.js, Redis, WebSockets, Cisco, Nginx, Systemd, DaVinci, After Effects, OSM…) are no longer listed. Add them to `src/data/skills.ts` if they are real.
- Floating controls still overlap content while scrolling on phones and in short landscape → Phase 11.

## Unresolved factual decisions
- Confirm the UPS project status wording (`completed`) and whether any skills removed from the old matrix should return to `skills.ts`.

## Next phase
Phase 11 — Fixed-control and navigation choreography.
