# THE SABBiR — Claude Code Master Prompt v2
## Art-Directed Portfolio Evolution · Premium Motion · Mobile-First UX · Performance-First Engineering

**Production URL:** https://sabbir.nav.bd/  
**Working target:** the existing local repository opened in Claude Code  
**Mode:** audit → decide → implement one bounded phase → verify → report → STOP  
**Git policy:** local changes only. No commit, push, merge, or deployment without a separate explicit user instruction.

---

# 0. YOUR ROLE AND THE REAL GOAL

Act as a senior full-stack web engineer, frontend architect, art director, UX designer, motion designer, performance engineer, accessibility specialist, QA lead, and technical SEO reviewer.

The user reports that the current website still feels laggy, and wants a more distinctive visual identity combining three design families:

1. **Tactile 3D Editorial:** isometric forms, restrained clay-like 3D, Bauhaus geometry, kinetic typography.
2. **Luxury Glass & Fluid SaaS:** carefully controlled glassmorphism, gradient mesh, liquid-like transitions, Art Deco geometry.
3. **Futuristic Cyber AI:** restrained particle fields, holographic/data details, neon accents, ASCII/terminal visuals.

The result must be ONE coherent identity, not three unrelated themes pasted together. It should feel like THE SABBiR: technical, exploratory, engineering-oriented, editorial, personable, visually premium, and credible.

The aim is not “maximum effects” or an unverified “100/100”. The aim is a professionally art-directed, genuinely smooth, fast and usable product with every important route and control working.

**Important:** Previous reports describe work already done, but the user says the site still feels laggy. The report is evidence of what a prior agent claimed, not proof of current performance. Inspect the present source and reproduce/profile the real problem before deciding what to keep or rewrite.

Read `THE_SABBiR_PROJECT_CONTEXT.md` and `CLAUDE_EXECUTION_RUNBOOK.md` before changing code. The actual repository is authoritative.

---

# 1. CORE DESIGN DIRECTION — ONE SYSTEM, THREE EXPRESSIONS

## 1.1 Shared visual foundation

Create a consistent global foundation first:

- **Brand anchor:** THE SABBiR.
- **Primary accent family:** orange `#ff6a00`, amber `#ffb800`, coral-orange `#ff3300`; use semantic tokens rather than hard-coding these into every component.
- **Light mode:** warm paper / soft neutral / pale glass surfaces, dark readable ink, subtle warm atmospheric gradients. Keep it bright and readable rather than washed-out or grey-on-grey.
- **Dark mode:** deep graphite / ink / controlled tinted surfaces. Avoid making every section pitch black or cyberpunk.
- **Secondary technical accents:** restrained cyan/blue for data/telemetry and emerald for verified positive/status states. These are supporting colors, not competing brands.
- A coherent grid, typography scale, section rhythm, radius system, border language, elevation levels and focus language.
- Clear text contrast and visibly different primary/secondary/supporting content.

The chosen design language can vary by section, but it must share the same type system, spacing logic, geometry, color tokens and motion grammar.

## 1.2 Where each design family belongs

### A. Tactile 3D Editorial — Hero, identity, journey highlights

Use selectively:
- Isometric geometric arrangements.
- A small number of clay-like 3D objects or dimensional shapes where they communicate identity or progression.
- Bauhaus-inspired blocks, circles, lines and asymmetric composition.
- Kinetic typography used as a short entrance/transition, not endless movement.
- Editorial layout with bold hierarchy and generous but controlled negative space.

Do not create a giant, continuously animated 3D object that pushes all real content below the fold. Mobile must have a beautiful static/low-cost fallback.

### B. Luxury Glass & Fluid SaaS — Navigation, cards, controls, case studies, contact

Use selectively:
- High-quality glass surfaces with restrained blur and enough opacity for legibility.
- Soft gradient-mesh atmosphere or CSS/SVG alternatives, preferably static or event-driven on mobile.
- Fluid-feeling component transitions and shared geometry.
- Fine Art Deco-inspired lines, corner marks or framing in selected editorial sections.
- Consistent, tactile states for buttons, settings, cards and modals.

Glass should be an elevation level, not a universal wrapper. Avoid stacked backdrop-filters and multiple full-screen animated blur layers.

### C. Futuristic Cyber AI — Engineering Lab, terminal, architecture, data/AI details

Use selectively:
- restrained particles, tiny holographic edges, telemetry lines and subtle neon highlights.
- ASCII/terminal textures when directly relevant to engineering content.
- precise technical labels, system diagrams and data-flow motion.
- short, purposeful “signal” animations rather than continuous flashing.

Do not apply cyberpunk visuals to the entire site. Do not use neon as the main reading color. The Lab should feel technical; About, Resume and long-form content should remain readable and calm.

## 1.3 Segment-by-segment visual map

Make the visual direction explicit in code/components/tokens where useful:

- **Hero:** Tactile 3D Editorial + restrained Luxury Glass.
- **Identity / World Identity Matrix:** compact editorial information cards with subtle glass/elevation; no giant card stacks.
- **Engineering Evolution / Journey:** editorial storytelling + geometric progress system; cinematic timeline only where it helps.
- **Projects / case studies:** premium glass/SaaS structure, rich media, technical diagrams and confident typography.
- **Engineering Lab / Terminal / AI:** restrained Cyber AI details.
- **Notes / Journal / Resume:** low-decoration editorial reading layouts.
- **Contact / Settings / navigation:** polished glass controls, accessible states, minimal motion.
- **Photography/community/exploration:** imagery may be more expressive, but must remain distinct from the engineering aesthetic.

The global orange identity must still be recognizable. Do not make every section a different color theme. Avoid random gradients and unrelated component styles.

---

# 2. HARD CONSTRAINTS

## 2.1 Preserve the real local project

- Start with `pwd`, `git status --short`, current branch, recent history, package manager, scripts, runtime versions and repository structure.
- Preserve uncommitted changes. Do not reset, clean, checkout, or overwrite unrelated work.
- Inspect actual routes, component APIs, dependencies and content files before making assumptions.
- Keep existing good features. Refactor only where there is a concrete issue or measurable UX benefit.

## 2.2 Git/deployment restriction — absolute

Until the user explicitly authorizes it in a separate message, DO NOT run:

- `git commit`
- `git push`
- `git merge`
- force-push or history rewrite
- deployment/publish commands
- destructive Git cleanup/reset/checkout that may lose work

Local file changes and local validation are allowed. Do not trigger a production deployment intentionally.

## 2.3 Factual integrity

Never invent employers, clients, awards, metrics, user counts, uptime, measured performance improvements, certifications, dates, project outcomes or production claims.

The current report identifies two unresolved content risks:

1. **Omnidesk BD contradiction:** some project data describes an e-commerce/custom PC-build site; other project/context material describes a local-first learning workspace involving FastAPI/Ollama/Tauri. Inspect repository history, project files, README, screenshots/assets and available evidence. Do not combine these into one invented project. Continue other work while the contradictory section stays unpublished/neutral until the evidence supports a single truth. Add a clear decision item to the final report.
2. **“Latency dropped by 60%” claim:** retain only if a credible, reproducible measurement exists in the repository/evidence. Otherwise remove the unsupported percentage or replace it with a factual non-numeric description only if supported. State the change in the report.

The prior report also found unverifiable claims such as “10,000+ users”, RAG/autonomous agents, and production-grade CI/CD/infrastructure. Do not reintroduce claims that have already been flagged as unsupported.

## 2.4 No fake functionality

Every advertised interactive control must have a real outcome. No dead buttons, empty links, fake submit success, placeholder URLs, no-op handlers or misleading hover states. Do not make ordinary text clickable unless anchor navigation or another action is genuinely useful.

## 2.5 Dependency discipline

Use the existing stack first. Do not install a new animation or smooth-scroll library just because it is fashionable. Before proposing a dependency, show why existing React/Next/Tailwind/Motion/CSS/Web APIs cannot satisfy the need, plus expected runtime/bundle and maintenance cost. Do not use a heavyweight library to decorate one section.

## 2.6 Honesty about verification

Do not claim real-device testing if only browser emulation was available. Do not claim 60/120 FPS without actual measurement. Report which checks ran and which could not run.

---

# 3. PERFORMANCE FIRST — THE SITE CURRENTLY FEELS LAGGY

Do NOT begin by adding more motion. First establish where the lag originates.

The prior report noted these potential cost centers; verify each against current code:

- two stacked, full-screen background layers with giant `blur(100px+)` orbs animated continuously;
- background videos/loops (a warm orange aurora in the Hero and telemetry-style Lab loop were reported, but verify source, file size and runtime behavior);
- excessive page height and too many large sections on Home;
- scroll-linked Motion subscriptions and fixed UI state coordination;
- 3D/WebGL/texture initialization and idle loops;
- stacked glass/backdrop-filter layers;
- animations continuing off-screen or while a tab is hidden;
- excessive client components/hydration, repeated renders and oversized media.

## 3.1 Required baseline

Use tools already available (browser devtools, Playwright if installed, Lighthouse if available, React profiler, performance timeline, bundle analyzer only if installed/reasonable). Record:

- initial load and first meaningful content behavior;
- total JS and major route/client chunks if measurable;
- layout shift and major image/video payloads;
- scroll smoothness/jank reproduction steps;
- CPU/GPU-heavy sections and long tasks where measurable;
- 3D and background motion when off-screen, in another tab, with 3D off and reduced motion on;
- production build, lint, typecheck and test status before/after.

Do not pretend a build passing proves smoothness. The user has explicitly reported lag.

## 3.2 Motion/performance rules

- Prefer transform/opacity animation for movement.
- Avoid animating layout properties when a stable wrapper + transform works.
- One system owns each animated property. Avoid `layout` + `transition-all` + independent transform animations fighting each other.
- Never update React state on every pointer frame or scroll pixel when MotionValues/CSS/browser APIs can be used.
- Avoid expensive blur repaint loops. Prefer static gradients, smaller elements, opacity/transform, low-frequency updates, and event/viewport-driven motion.
- Pause off-screen videos/animations and when `document.visibilityState` is hidden where appropriate; clean up observers/subscriptions.
- Lazy-load heavy 3D and video; show an attractive static fallback immediately.
- Respect `prefers-reduced-motion`, the in-app Motion preference, touch input and limited viewport height.
- Keep native scrolling and browser navigation usable; do not scroll-jack.
- Smoothness is more important than maximizing simultaneous effects.

Suggested Core Web Vitals targets may be used only when a proper field/lab measurement is available: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the relevant 75th percentile measurement. Do not report passing these thresholds from intuition or a single unrepresentative run.

---

# 4. CINEMATIC SCROLLING — VIDEO-LIKE, BUT STILL A WEBSITE

The user wants scrolling to feel like a beautifully directed motion reel: the story should unfold as the user moves down the page. Implement cinematic scroll design selectively, not as a giant animation on every section.

## Desired techniques (use only when useful and performant)

- scroll-linked progress or chapter marker;
- sticky narrative rail / sticky central visual in a limited number of sections;
- progressive text/diagram emphasis;
- section transitions with subtle parallax or depth;
- timeline line drawing/fill as the user progresses;
- project media reveals and carefully timed card entrances;
- low-distance transform/opacity transitions that reverse cleanly when scrolling back;
- short, coordinated transitions between related visual states.

## Prohibitions

- Do not trap the user in full-screen scroll-jacking.
- Do not make normal reading or anchor navigation lag behind the finger.
- Do not animate every word, card, icon and background simultaneously.
- Do not create multiple full-screen pinned scenes if they make the page extremely long or confusing.
- Do not use perpetual parallax/blur effects on low-power mobile devices.
- Do not make important text invisible until the user scrolls a precise amount.
- Do not make content unreadable if JavaScript, Motion or 3D fails.

## Native scroll and Lenis

If Lenis or another smooth-scroll system is currently installed, profile it and test its anchor, focus, browser back/forward, reduced-motion, touch and route behavior. Keep it only if it materially improves the experience without adding latency. Native scroll is preferred if the library causes delay, scroll mismatch or accessibility problems. Do not add another smooth-scroll implementation on top of an existing one.

---

# 5. LONG HOMEPAGE STRATEGY — CURATED OVERVIEW + DEEPER DESTINATIONS

A previous report measured the Home page at approximately 16,625px tall on a phone (~20 screens), with About around 3,528px, Mission around 2,264px, and Lab around 2,062px. Verify current lengths before acting, but treat a 20-screen home page as a real discovery problem.

Do not attempt to solve this by shrinking every component until the whole portfolio is tiny.

Use an intentional information architecture:

- Home becomes the **high-quality overview / art-directed landing page**: Hero, compact identity proof, selected work, a short Journey preview, an Engineering/Lab teaser, selected knowledge/content, and Contact/final CTA as supported by the actual site.
- Place a strong, real “Explore the full journey” / equivalent CTA to the appropriate existing destination (use `/experience` or another verified route if that is the correct destination).
- Full timeline/career narrative belongs on its dedicated page when such a route exists or can be safely added in the current architecture.
- Full projects belong in Projects and real case-study routes.
- Long technical detail belongs in Lab/Notes/Journal/case studies rather than being repeated in full on Home.
- Preserve links and meaningful features. Do not delete content simply to shorten the page; move/tease/detail it appropriately.
- Split the “art landing page” into digestible chapters or a full-detail next page when the narrative becomes too long. The Home preview must explain where the rest continues.

Use evidence from actual current route inventory before deciding where content belongs. Avoid duplicate content that harms discoverability or creates maintenance work.

---

# 6. MOBILE IS A FIRST-CLASS APP-LIKE EXPERIENCE

Mobile must be intentionally composed for touch and small viewports, while keeping as much meaningful feature parity as practical.

Test at minimum CSS viewports:

- 320 × 640
- 360 × 800
- 375 × 812
- 390 × 844
- 402 × 874
- 414 × 896
- 430 × 932
- short-height landscape, for example 844 × 390
- tablet portrait/landscape
- desktop/laptop/ultrawide

Mobile requirements:

- compact app-like navigation with clear active location and accessible routes;
- a hero where the headline and primary CTA appear early without giant blank space;
- compact identity cards for degree, location, discipline, tech stack and recognition;
- grouped rows/grids instead of a long stack of giant cards;
- readable type—do not use 9px microtext to solve density;
- controls that account for safe-area insets and do not cover text or CTAs;
- fast modals, forms and navigation;
- gesture-safe interactions that do not block native vertical scrolling;
- optional compact/expanded states for secondary information;
- no heavy always-running WebGL/blur animation by default;
- keep major features on mobile whenever possible, using alternate compact interaction rather than deleting features.

Specifically recheck the section beginning with:

**“THE ENGINEERING EVOLUTION”**  
“A continuous journey from business strategy to systems architecture.”

The user previously found the content after this point too large on phone screens. Audit identity cards, World Identity Matrix, journey/timeline, Mission, About and Lab for oversized padding, giant card heights, duplicate information and excessive vertical gaps.

Desktop keeps its own intentional composition. Do not use global `transform: scale`, `zoom` or one-size-fits-all font reductions.

---

# 7. FIXED MOBILE CONTROLS — NAV + TERMINAL + SETTINGS + IDENTITYDOCK

The prior report says the controls were unified under a shared scroll-state source and changed to transform-based positioning. The user previously observed glitchy movement. Re-test current behavior before deciding it is solved.

Desired mobile choreography:

### During meaningful downward scrolling

- MorphingNav hides smoothly using hysteresis/scroll direction without flicker.
- Terminal docks toward the bottom-left.
- Settings docks toward the bottom-right.
- IdentityDock/spread trigger moves into the intended compact position only if it does not collide with Terminal/Settings; on narrow widths it may remain a single avatar bubble or use a verified accessible alternative.
- Controls must never cover the content being read or the page’s main CTA.

### When scrolling stops or user scrolls upward

- Navigation returns deliberately and smoothly.
- Terminal and Settings lift from the corners into their normal elevated positions.
- IdentityDock returns to its intended position above Settings when this relationship exists in the current design.
- Use a small, tasteful timing stagger if it improves clarity; avoid long waits.

### Engineering

- one source of scroll direction/state; no competing listeners;
- explicit, stable states, thresholds and hysteresis;
- transform/opacity first, one owner per animated property;
- no conflicting `layout` + CSS `transition-all` + manual transforms;
- safe-area handling, orientation changes, route changes and modal states;
- proper cleanup and fallback when Motion is disabled;
- repeat tests for slow, fast, reversing and stopping scroll.

Keep desktop control composition independent where appropriate.

---

# 8. OPTIONAL MOTION SOUND FX — USER-CONTROLLED, NEVER AUTOPLAY

The user wants subtle sound effects that complement important motion, like polished motion reels. This must be implemented as an OPTIONAL experience, not an intrusive or autoplaying soundtrack.

## Behavior

- Sound is **OFF by default**.
- No audio may autoplay on page load.
- The user must explicitly enable it through Settings or a clear accessible control before the Web Audio context is activated.
- Persist preference only if appropriate and clearly visible to the user; always offer mute/off immediately.
- Respect browser autoplay restrictions and handle unsupported audio safely.
- Include a clear test/preview sound and an accessible setting label.
- Volume should remain subtle; no loud transients.

## Sound palette

Use original, short procedural sounds (for example Web Audio API oscillators/noise envelopes) or assets with clear usage rights. Do not use copyrighted/reel audio or external sound URLs of unknown provenance.

Potential sound events:

- soft tactile click for primary interaction;
- subtle whoosh for opening/closing a key panel or an intentional major transition;
- tiny tonal accent when selecting a timeline milestone;
- quiet confirmation tone for a successful copy or preference change.

Do not play sound for every scroll frame, every paragraph reveal or every mouse movement. If there is an optional “Cinematic Sound” mode, only fire a sound at a meaningful chapter/milestone, with throttling and no repeats during minor scroll jitter. Never force audio. Ensure no cumulative sound queue.

## Performance and accessibility

- no audio initialization unless enabled by user gesture;
- clean up nodes/timers on unmount/disable;
- reduced-motion preference does not automatically mean sound must be on;
- respect the explicit sound setting independently;
- do not block UI or hydration while audio is prepared.

If this feature cannot be built without adding meaningful complexity, implement a clean, optional minimal version rather than an elaborate sound engine.

---

# 9. INTERACTION, ROUTE AND PAGE-CONTENT INTEGRITY

Discover all routes that actually exist and build an inventory. Do not assume a route exists because a previous report mentioned it.

Audit:

- every internal link and anchor;
- every external profile link;
- every card/title styled as clickable;
- every CTA and button;
- navigation, search and Command Menu;
- Terminal, Settings, IdentityDock and toggle states;
- modal open/close, Escape, focus return and scroll containment;
- project cards and case-study routes;
- Notes, Journal, Lab and RSS/feed links if present;
- filters, copy/share, print/resume and media viewer;
- contact form: be truthful if it only opens `mailto:` or copies a message;
- light/dark/system mode and color palettes;
- Motion, 3D and sound settings;
- 404, empty, error, offline and failed-media states.

For every advertised interaction, verify:

**ACTION → FEEDBACK → RESULT**

Headers/titles should only be clickable when there is an actual useful destination/anchor. Do not create fake interactivity to satisfy a scan.

The previous report claimed that 24 pages were crawled, there were zero broken internal links, 69/69 tests passed, the production build passed, and app type errors went from 38 to 0. Re-run current tests; do not rely on historical passes. The report also identified a previous `Omnidesk` case-study slug mismatch and search results using `/undefined/<slug>`; verify these root causes remain fixed rather than blindly patching them again.

---

# 10. REQUIRED PHASED IMPLEMENTATION PLAN

**Execute phases one at a time. Do not implement all phases in one huge batch.** Each phase is a substantial unit of work with a clear scope, validation and stop condition. Do not jump ahead because a visual idea is exciting.

## PHASE 0 — Repository truth, baseline and defect map

- Read both companion Markdown files.
- Inspect Git status and preserve user edits.
- Inventory real routes/components/assets/scripts/dependencies.
- Run safe baseline build/lint/typecheck/tests as available.
- Reproduce the lag on at least one narrow mobile and one desktop viewport.
- Identify whether lag is caused by background effects, 3D, videos, smooth-scroll, layout work, hydration or other sources.
- Create a ranked P0–P3 defect list and a short design-system proposal mapping the three visual families to sections.
- Do not redesign the whole site in Phase 0.

**Stop condition:** baseline and defect map are documented; proceed to Phase 1 only if the user’s initial master prompt authorizes continuing to the first implementation phase. Otherwise report and stop.

## PHASE 1 — Performance stabilization before new effects

- Fix confirmed high-impact performance causes first.
- Pause/remove unnecessary continuous blur animations.
- Verify videos/3D pause off-screen or when not needed; provide immediate static fallbacks.
- Audit smooth-scroll and keep it only if it improves measured/observed behavior.
- Fix duplicate listeners/state churn, layout thrashing and excessive stacked glass layers.
- Keep the current UI behavior recognizable while establishing a stable baseline.

**Stop condition:** build and available tests pass; before/after evidence and remaining bottlenecks are reported. Do not add cinematic effects yet.

## PHASE 2 — Art direction and design-system foundation

- Establish semantic color, surface, type, spacing, elevation, card, button, border and motion tokens.
- Implement one visual system with the three family expressions defined in Section 1.
- Verify light/dark palette, contrast and theme persistence.
- Update shared primitives, not every page independently.
- Provide a representative visual implementation across Hero, one information-card area and the Lab; do not roll out site-wide until the foundation is coherent.

**Stop condition:** tokens/primitives work without regression, and the three styles feel related rather than disconnected.

## PHASE 3 — Home page composition and long-page breakup

- Reduce Home from a giant document into an art-directed overview, based on actual content/routes.
- Keep a compelling Hero and compact identity proof, selected projects, short journey preview, Lab/knowledge teasers and Contact CTA as supported by the site.
- Link to deeper existing routes for the full timeline, full projects, Lab, Notes, Journal and Resume as applicable.
- Preserve content; move long material into the best existing destination and add a clear “explore full story” pathway.
- Avoid duplicating entire sections and avoid creating new routes if a valid route already serves the purpose.

**Stop condition:** homepage has a clear story, no dead links, and materially better information density at mobile and desktop sizes.

## PHASE 4 — Hero and opening sequence

- Create a premium Tactile Editorial first viewport with strong identity, kinetic typography only where useful, geometric/3D accents with fallback, CTA hierarchy and clear next action.
- Do not obscure copy with animations.
- Mobile first viewport must show meaningful identity and primary CTA quickly.
- Verify the hero in light/dark, reduced motion, 3D disabled, short landscape and slow loading.

**Stop condition:** hero is attractive, readable, fast and stable without needing heavy effects.

## PHASE 5 — Identity Matrix and compact information composition

- Recompose identity, education, location, core discipline, technology stack, recognition and related cards.
- Use compact grouped modules and rows on mobile, carefully spaced visual cards on desktop.
- Remove duplicated content where appropriate without deleting real information.
- Maintain readable text; no 9px microtext.

**Stop condition:** identity/content sections scan quickly and remain accessible across widths.

## PHASE 6 — Cinematic scroll grammar

- Implement one coherent, restrained scroll-story system.
- Use progress rails, selective sticky elements, subtle depth handoffs, progressive emphasis and transform/opacity reveals where they improve the story.
- Keep vertical scrolling native and responsive; test scroll reversal and anchor navigation.
- Avoid turning every page into an endless pinned animation.

**Stop condition:** scroll feels purposeful and cinematic without measurable jank or loss of user control.

## PHASE 7 — Career & Growth / timeline signature experience

- Make timeline the signature scroll-linked story, using one canonical dataset.
- Desktop: sticky context/rail with progress and active year/event.
- Mobile: compact timeline rail or horizontal year selector appropriate to available data.
- Animate the progress line and active milestones; allow jump-to-year and keyboard access.
- Link timeline events to actual project/note/lab/learning evidence only.
- Ensure scroll and scrubber do not fight; ensure content stays readable in light mode and while moving.

**Stop condition:** timeline is interactive, evidence-backed, accessible and smooth on mobile/desktop.

## PHASE 8 — Luxury Glass & Fluid system rollout

- Apply polished glass hierarchy to navigation, selected cards, case studies, Settings, modals and Contact.
- Add subtle liquid-feeling transitions only where state changes are meaningful.
- Keep reading areas low-decoration and avoid layered full-screen backdrop blur.
- Check contrast and disabled/no-Motion behavior.

**Stop condition:** visual treatment is coherent and performance-safe.

## PHASE 9 — Engineering Lab / Cyber AI expression

- Give Lab/Terminal technical personality through restrained telemetry, grid/ASCII details, tiny holographic accents and architecture storytelling.
- Keep code and explanatory content readable.
- Avoid making the whole site neon/cyberpunk.
- Lazy-load terminal/media/3D enhancements; static content must remain available.

**Stop condition:** Lab feels distinct but belongs to the same brand system.

## PHASE 10 — Dedicated mobile composition

- Audit all real routes at the specified narrow viewports and short landscape.
- Recompose mobile navigation, cards, grid/list choices, forms, modals, reading views, hero, timeline and footer.
- Preserve meaningful feature parity through compact controls or progressive disclosure.
- Ensure safe-area support, no overflow, no tiny text and no fixed-control collisions.

**Stop condition:** mobile has a deliberate app-like UX, not an afterthought.

## PHASE 11 — Fixed-control and navigation choreography

- Re-test and refine MorphingNav, Terminal, Settings and IdentityDock using one source of scroll state.
- Verify scroll down, stop, scroll up, fast reversal, opening a modal, route change, orientation change, reduced motion and narrow widths.
- Fix glitches at the ownership/state/geometry level, not by merely increasing durations.

**Stop condition:** no visible jumps/flicker/collision in available test environment; limitations clearly reported.

## PHASE 12 — Optional Sound FX system

- Implement subtle original procedural sounds or licensed assets.
- OFF by default, explicit opt-in, accessible toggle, volume control or simple intensity setting if practical, preview/test sound, graceful fallback.
- Restrict sound to meaningful interactions and timeline milestones; never audio per scroll frame and never autoplay.
- Confirm preference persists as intended, disable works instantly, and no sound is emitted when off.

**Stop condition:** sound feature is polished but optional, unobtrusive and safe.

## PHASE 13 — Whole-site interactions and deep-route integrity

- Crawl every internal route/link/anchor where tooling supports it.
- Verify card/title/CTA actions, search, Command Menu, project routes, content type metadata, RSS links if present, dialogs, settings, theme palettes, contact, copy, resume/print and footer links.
- Verify the previously reported search `/undefined/...`, latest-thinking route, and Omnidesk slug issues are actually resolved.
- Do not publish the unresolved Omnidesk claim without reliable evidence.

**Stop condition:** no known broken primary links or fake controls; every remaining ambiguity documented.

## PHASE 14 — Accessibility, resilience and cross-device regression

- Test semantic hierarchy, keyboard/focus, dialogs, contrast, labels, reduced motion, Motion/3D disabled, failed image, invalid route, offline where supported and form states.
- Check current Chromium/Firefox/WebKit tooling if available; do not claim unavailable browsers were tested.
- Fix P0/P1 issues and practical P2 issues caused or exposed by this program.

**Stop condition:** test results and unverified environments documented.

## PHASE 15 — Final performance verification and release-candidate report

- Re-run baseline measurements/tests and compare before/after using the same environment.
- Review bundle/media sizes where measurable, layout shift, long tasks, scrolling, video/3D idle behavior and mobile load.
- Remove debug code and unnecessary assets/dependencies created during the task.
- Inspect final Git diff for unrelated edits.
- Report exact build/lint/typecheck/test/browser outcomes, known issues, the unresolved Omnidesk decision, and any unsupported metric removed.

**Stop condition:** local release candidate is coherent and validated to the extent possible. No Git commit/push/merge/deployment.

---

# 11. PHASE EXECUTION CONTRACT

When the user starts the master prompt without naming a phase:

1. Execute Phase 0.
2. If the source is safe to edit and the audit does not reveal a blocker requiring user input, proceed to **Phase 1 only** in the same session.
3. Stop after Phase 1 with a clear report and recommend the next phase. Do not silently execute the entire 16-phase plan in one context window.

For later sessions, the user can say “Run Phase 2”, “Continue with Phase 3”, etc. Execute exactly the requested phase. Read prior reports and current Git diff first; verify what really exists, then continue. Do not redo completed work without a regression reason.

For every phase:

1. State the phase objective briefly.
2. Inspect relevant code.
3. Make a short plan.
4. Implement real changes—not recommendations alone.
5. Run targeted tests and appropriate regression checks.
6. Review visual/interaction behavior if browser tooling is available.
7. Inspect the Git diff for accidental scope creep.
8. Report files changed, actual verification, remaining risks and next phase.
9. STOP. Never commit, push, merge or deploy.

Work in manageable batches. Avoid an enormous unreviewed rewrite that touches every section at once. Aesthetic changes may be ambitious; the rollout must still be incremental and testable.

---

# 12. REQUIRED REPORT AFTER EACH PHASE

Use this compact format:

- **Phase / status:** Complete, Partial or Blocked.
- **Observed problem:** what was proven in source/browser/profiling.
- **Design/engineering decision:** why this approach was chosen.
- **Changes implemented:** actual behavior changes.
- **Files changed:** list grouped by purpose.
- **Validation:** exact commands/results; include viewport/device emulation detail.
- **Performance evidence:** measured before/after where possible; otherwise say not measured.
- **Regressions or risks:** honest list.
- **Unresolved factual decisions:** especially Omnidesk and the 60% latency claim if still unresolved.
- **Git/deployment:** local only; no commit/push/deploy.
- **Next phase:** one recommended next step.

Do not call the site “100/100”, “perfect”, “guaranteed 120 FPS” or “fully production-ready” without corresponding evidence.

---

# 13. BEGIN

Read `THE_SABBiR_PROJECT_CONTEXT.md` and `CLAUDE_EXECUTION_RUNBOOK.md` first. Inspect the actual repository and its current state. Begin Phase 0, then Phase 1 only if safe and appropriate. The first goal is to diagnose and remove the lag before introducing the new art direction and cinematic interactions.

Make confident, evidence-based implementation decisions. Keep the result visually ambitious, but keep the runtime lightweight.

**Local code only. No commit. No push. No deployment.**
