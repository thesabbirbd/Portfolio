# THE SABBiR — Phase 7 Report: Career & Growth Timeline (signature experience)

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete.**

## Observed problems
- **Two timeline datasets:** `src/data/journey.ts` (used) and `src/data/timeline.ts` (imported nowhere). The dead file held real context (Rajshahi College, BM Technical College, Shunno IT NOC/MTCNA, the BHTPA Python course) mixed with overclaims ("mastering Linux under production conditions", "Uptime SLAs", "Production Containerization & Pipeline Mastery").
- **No years anywhere in the source content.** A "year selector" would require inventing dates.
- **The timeline swapped layouts after hydration** (the server rendered the phone layout; desktop switched with `useMediaQuery`). That needed a deep-link re-align workaround (Phase 3) and briefly showed the wrong layout.
- **No evidence links:** the phases were not connected to the projects, notes and lab entries that back them.
- **Two blockers to `position: sticky`:** `/about` wrapped the timeline in `overflow-hidden`, and `body` used `overflow-x: hidden` (fixed in Phase 6). Both create scroll containers.
- **Light-mode readability while moving:** the old desktop nodes dimmed to 35% opacity.

## Decisions
- **One canonical dataset** (`src/data/journey.ts`). Each phase has `stage`, `status` (done/current/next), `context` (factual, from existing content) and `evidence` (links **only** to pages that exist). `timeline.ts` was merged and deleted; its overclaiming copy was not carried over.
- **Phases, not years:** the selector steps through 01–08. No dates were invented.
- **One server-rendered layout for every viewport;** CSS decides what shows. No hydration swap, and deep links land exactly.
- **One-way state:** an IntersectionObserver picks the active phase. Jump links are plain anchors (keyboard and no-JS friendly). Nothing scrolls the page programmatically, so the scrubber and the user's scroll can't fight. Progress lines are MotionValues on `transform`.

## Changes implemented
- `src/data/journey.ts`: typed `JourneyStep` (`stage`, `status`, `context`, `evidence[]`). Evidence includes the Custom UPS, MikroTik NOC lab, OpenWrt NAS note, Ubuntu dev environment journal, Virtual display lab, StudyOS, LLM inference benchmarks, the Qwen lab write-up, the AI-strategy journal, the Omnidesk case study and the active mission.
- `src/data/timeline.ts`: **deleted** (dead code; its facts were merged).
- `src/components/about/JourneyTimeline.tsx` (rewritten):
  - **Desktop:** a sticky context panel (`top-28`) with a large "0N/08" phase counter, title and context, plus a progress rail of anchor links. Dots mark completed, current and upcoming phases, and the active dot scales up. The rail fill is scroll-linked (`scaleY`).
  - **Phones:** a sticky, opaque phase selector (chips plus a progress bar). The active chip auto-centres inside its own horizontal scroller only.
  - **Phase cards:** active phase emphasised with a border, shadow and an orange left bar. Inactive cards stay at 75% opacity on desktop only (readable), with no dimming on phones. "NOW" badges mark current phases, followed by the context line, description and evidence chips.
  - **Deep links:** `#journey-<id>` selects its phase immediately. The detection band sits at 25–30% of the viewport (where anchors land), so the highlighted phase always matches the card being read.
  - A `sabbir:milestone` event fires when the active phase changes (hook for the Phase 12 optional sound).
- `src/components/about/AboutSection.tsx`: `overflow-hidden` → `overflow-x-clip`, so sticky works.

## Validation
- `pnpm test` 69/69 · build pass · app `tsc` 0 · `link-audit`: 23 pages, 0 problems (every evidence link resolves).
- **Desktop scroll test (1440×900):** the panel stays at 112px through the timeline. Active phase goes 04 Linux → 07 Backend → 08 DevOps, and the panel releases at the end.
- **Phone scroll test (390×844):** the selector stays at 0px. Active goes 03 Networking → 08 DevOps, the chip strip scrolls 128 → 460px horizontally, and the selector releases at the end.
- **Deep links:**
  - `#journey-ai` lands at 128px on desktop and 96px on phones, with Local AI active.
  - `#journey-linux` lands the same way, with Linux active.
  - 0 page exceptions.
- **Screenshots:** desktop light (sticky panel, rail, evidence chips); phone dark (selector, NOW badges).

## Performance evidence (headless Chrome, idle machine)

| Page / profile | Result |
|---|---|
| `/about` phone 4× CPU | idle 60 · scroll 59.8 fps · LCP 0.63 s · CLS 0 · height 5,609px |
| `/about` desktop 2× CPU | idle 60 · scroll 60 fps · LCP 0.56 s · CLS 0 · height 4,646px (was 5,387) |
| Home phone (regression check) | idle 60 · scroll 60 fps · CLS 0 |

The `/about` phone height grew from 4,733 to 5,609px. Every phase now carries its context line and evidence links: more real content, deliberately.

## Regressions / risks
- Phase labels have no dates, by design (none exist in the source).
- The Home journey preview still lists phases without evidence (by design; it hands off to `/about`).

## Unresolved factual decisions
None. The "Python" phase context ("BHTPA · Introduction to Python course") comes from the former `timeline.ts` and the About Honors card ("NOC Intern · BHTPA"). Worth confirming the course name.

## Next phase
Phase 8 — Luxury Glass & Fluid system rollout.
