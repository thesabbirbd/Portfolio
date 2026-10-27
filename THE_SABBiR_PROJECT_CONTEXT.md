# THE SABBiR — Project Context for Claude Code (Updated)

**Purpose:** supporting facts and preferences for the local repository review.  
**Important:** these notes include historical user context and a Claude-reported audit. They are not proof that the current code still behaves the same. Verify against the current repository.

---

## 1. Identity and portfolio purpose

- Full name: **Md Sabbirul Islam Khan**.
- Public brand: **THE SABBiR**.
- Portfolio: https://sabbir.nav.bd/
- Location context: Rajshahi, Bangladesh; roots in Hat Gangopara / Bagmara, Rajshahi.
- Education: Honours 4th year in Management at Rajshahi College (National University), according to the latest supplied context. Verify the current page before changing wording.
- Primary technical direction: Backend Engineering + DevOps.
- Adjacent interests/experience include IT Support/NOC, networking/MikroTik, Linux/Ubuntu, cloud, local AI/Ollama, Python training, hardware troubleshooting, GPU, UPS/electronics, multimedia, photography/videography and Google Maps Local Guide/exploration.
- The honest presentation standard is **“Less hype, more defensible evidence.”** Entry-level technical capability should not be inflated.

### Branding constraints

Use `THE SABBiR` as public brand. Do not use `(Sabbir)`, `Sabbir` as the standalone brand, `SABBIR`, or alternate inconsistent casing. Do not combine personal name and brand using parentheses.

### Known public profiles — verify before modifying

- GitHub: https://github.com/thesabbirbd
- LinkedIn: https://www.linkedin.com/in/thesabbirbd/
- Facebook: https://facebook.com/iamthesabbir
- Instagram: https://www.instagram.com/iam_thesabbir
- X: https://x.com/thesabbirbd
- Google Maps contribution profile: use the exact verified URL already present in repository/README; do not invent one.

Omnidesk BD is one project among multiple interests/projects. It must not dominate the complete identity unless the actual content makes that appropriate.

---

## 2. New requested art direction — MIXED, BUT COHERENT

The user wants a significant visual direction update, not only minor polish. Blend these design families into one underlying design system:

### A. Tactile 3D Editorial
- Isometric geometry
- restrained clay 3D objects
- Bauhaus-inspired shapes
- carefully used kinetic typography
- best for Hero, identity moments and timeline/journey highlights

### B. Luxury Glass & Fluid SaaS
- controlled glassmorphism
- restrained gradient mesh
- fluid-feeling state transitions
- subtle Art Deco detail
- best for selected information cards, navigation, modals, project storytelling and contact

### C. Futuristic Cyber AI
- light particle/data elements
- holographic/telemetry detail
- restrained neon
- ASCII/terminal expression
- best for Engineering Lab, terminal, architecture diagrams, AI/networking material

**Synthesis:** one shared THE SABBiR visual identity: warm paper/neutral light mode, controlled graphite dark mode, signature orange/amber accents, consistent typography and spacing, and three restrained “expressions” by content category. No disconnected mini-themes, full-site cyberpunk, excessive blur, random gradients, or continuous effects on every element.

Core accent family: `#ff6a00`, `#ffb800`, `#ff3300`. Cool technical colors can be secondary accents. Maintain contrast and a readable light theme.

---

## 3. Priorities (highest first)

1. UI/UX and visual hierarchy.
2. Real smoothness, low latency and stable scrolling.
3. Mobile-first/app-like composition while retaining useful feature parity.
4. Functional integrity: every real interactive element works.
5. Professional storytelling, content architecture and evidence.
6. Desktop composition and responsiveness at all sizes.
7. Motion graphics and optional sound only where useful.
8. Accessibility, SEO, security, reliability and maintainability.

The user reports the site still feels laggy despite a prior report saying build/tests passed. The next engineering pass should profile and verify runtime behavior; passing tests alone is not proof of smoothness.

---

## 4. Current request: cinematic but lightweight website

The user wants:

- a landing page that looks like a professionally art-directed product, not a generic portfolio template;
- section-specific visual character using the 3 design families above;
- a visual journey that unfolds during scrolling, “like a video” while staying a normal, controllable, accessible website;
- especially beautiful scroll-linked Timeline/Career & Growth effects;
- optional sound FX like motion reels, but not autoplay and not constant sound during scroll;
- mobile that feels app-like and intentionally designed, retaining important features from desktop where practical;
- a better information architecture: if Home becomes too long, keep it as an overview and send the detailed story to the appropriate next page/route rather than stacking everything into a 20-screen phone page;
- full link/title/header/card/button/CTA interaction audit;
- actual recommendations and implementation, not just a report.

### Sound preference

Sound should be optional, OFF by default and enabled only by a deliberate user action. Use original procedural sounds or appropriately licensed assets. Subtle tactile clicks, milestone cues and occasional short whooshes are acceptable. No autoplay, no audio on every scroll frame, no loud FX and no unknown/copyrighted audio.

### Mobile screen focus

Test around 390–402px width as well as narrower/wider sizes. The section beginning “THE ENGINEERING EVOLUTION” and its subtitle “A continuous journey from business strategy to systems architecture.” has previously been reported as followed by oversized cards/sections. Re-audit identity information cards, World Identity Matrix, Mission, About, timeline and Lab.

Aim for compact, grouped, readable cards—never use 9px microtext or shrink everything indiscriminately. Keep important content/features available via alternate layouts and progressive disclosure.

---

## 5. Claude-reported audit (user-provided; verify current state)

The last Claude Code report claims the following were changed or verified locally. These are **reported outcomes only** until rechecked:

### Reported fixes

- Ctrl+K had opened both Command Menu and Terminal; it was changed so Ctrl+K opens only Command Menu, `/` also opens the Command Menu in the intended context, and backtick opens Terminal. Terminal does not open while typing in a form.
- Search results previously used `/undefined/<slug>`; content metadata was reportedly fixed at the loader source. RSS links reportedly fixed too.
- A link had targeted `/projects/omnidesk-bd` while the actual project route was `/projects/omnidesk`.
- Home’s “Latest Thinking” link reportedly pointed to a journal entry under the wrong content type path.
- Work CTA had pointed to a nonexistent `#work` section.
- Settings was reportedly made global instead of Home-only; Motion toggle reportedly controls site-wide motion.
- Orange palette reportedly now applies on first paint; primary GlassButton follows theme token.
- Contact form reportedly explains that it opens an email draft and includes a copy fallback rather than pretending an email was sent through a backend.
- Type errors reportedly went from 38 to 0.
- A new shared scroll source was reportedly used by MorphingNav, IdentityDock, Terminal and Settings to coordinate docking/reveal behavior and reduce jitter.
- On mobile the collapsed IdentityDock reportedly becomes a single avatar bubble.
- A `short-landscape` compact two-column hero was reportedly added.
- A warm orange aurora loop was reportedly added to Hero, and a telemetry-style loop to the Lab; generated videos were reported as lightweight and paused off-screen/reduced motion. Verify the actual file sizes, codecs, behavior and performance.
- The “Engineering Evolution” copy reportedly had overclaims removed and its timeline became a compact rail on phones.
- Home/About/Mission/Lab reportedly had compactness changes; 9px mobile body text was reportedly eliminated (decorative chips excepted).
- Settings was reportedly verified on a non-home page; Escape closed it in the final test.

### Reported validation

- 24 routes/pages crawled with zero broken internal links in that pass.
- 69/69 tests passed.
- Production build reportedly passed.
- App type errors reportedly reached 0.
- Browser-emulated mobile testing was done, but the report explicitly says it was **not tested on a physical phone**.

Do not assume these results still hold after later edits or in another working tree. Re-run current commands and tests. The user currently says the site still feels laggy.

---

## 6. Unresolved facts that must not be guessed

### Omnidesk BD project contradiction

Claude found a contradiction:

- `projects.mdx` and `projects.ts` describe an e-commerce/custom PC-build platform.
- README/Omnidesk section/context refer to a local-first learning workspace using FastAPI/Ollama/Tauri.
- The last report says `OmnideskSection` is not mounted on a page while this is unresolved.

Inspect all relevant source, history and evidence. Do not merge these descriptions into one invented narrative. Continue unrelated work while this remains unresolved. Keep a neutral/unpublished state until evidence makes the correct description clear, then note it in the report for the user.

### Unsupported “60% latency” claim

Claude asked whether the statement “latency dropped by 60%” in `projects.ts` is measured. Keep only with verifiable measurement/evidence; otherwise remove the unverified number or use a factual, supported non-numeric description. Mention the edit in the report.

### Previous overclaims

Do not reintroduce claims such as “10,000+ users”, RAG/autonomous agents, production-grade CI/CD or infrastructure-as-code unless source/evidence genuinely supports them.

---

## 7. Historical technical context — verify locally

Previous project reports mention:

- Next.js + React + Tailwind CSS
- Framer Motion / Motion
- Three.js / React Three Fiber for selected 3D
- custom Motion presets and a pointer companion
- Lenis smooth scrolling in the recent Claude report
- Next.js content routes, Notes, Journal, Projects, Lab and case studies
- PWA/service worker/offline fallback
- Vercel deployment with custom domain `sabbir.nav.bd`

This may change. Inspect package.json, lockfile and source before relying on it. Do not add another smooth-scroll implementation on top of an existing one without proving the need.

### Historic pointer behavior

A prior pass reported a resting pointer companion around 11px and active state around 19–20px, directional rotation with angle wrapping, native cursor preserved, and behavior disabled for touch/reduced-motion. Verify current source; avoid reintroducing larger cursor effects or React state on every pointer frame.

### Prior floating-control issue

Previously, IdentityDock, Terminal, Settings and MorphingNav could conflict/glitch because positioning and scroll state were managed independently. A later report says they now share state/transforms, but the user had experienced glitches before. Re-test current real behavior at narrow mobile widths, scrolling down/stopping/up, orientation change, and with reduced motion. Fix underlying state/geometry/animation ownership, not only duration/easing.

---

## 8. Links, interactions and content integrity

User explicitly wants every meaningful clickable control to work:

- correct routes and anchors;
- cards and CTAs lead to real content;
- titles only act as links when useful;
- Command Menu and Terminal shortcuts do not conflict;
- search/results/feeds use correct content type/slug metadata;
- Settings toggles actually apply and persist appropriately;
- dialogs use Escape, visible close buttons and proper focus behavior;
- contact feedback is truthful;
- internal routes survive direct open/refresh/back/forward;
- no empty href, placeholder link, fake button, no-op click or misleading hover state.

Use a real action → feedback → result test. Do not create routes or features just to fill the site. Reuse existing valid destinations where possible.

---

## 9. Social links (verify before touching)

- GitHub: `https://github.com/thesabbirbd`
- LinkedIn: `https://www.linkedin.com/in/thesabbirbd/`
- Facebook: `https://facebook.com/iamthesabbir`
- Instagram: `https://www.instagram.com/iam_thesabbir`
- X: `https://x.com/thesabbirbd`
- Google Maps Local Guide/Street View contribution profile: use the current URL already recorded in the repository, not an invented one.

---

## 10. Local-workflow restrictions

- Preserve existing user changes; inspect `git status --short` first.
- Local implementation and tests are allowed.
- Do not commit, push, merge, force-push or deploy until the user separately authorizes it.
- Do not reset/clean unrelated work.
- Use existing scripts/package manager.
- Be clear about browser/device emulation vs physical testing.
- Do not claim an unmeasured FPS, perfect score or verified physical-device result.

---

## 11. Definition of success

The website should feel:

- visually distinctive and coherent;
- cinematic during selected scroll narratives but never scroll-jacked;
- lightweight and smooth, particularly on mobile;
- app-like and compact on phone screens while retaining useful features;
- spacious and professionally art-directed on desktop;
- different by content segment while recognizably one THE SABBiR identity;
- optionally sound-enabled, OFF by default;
- fully navigable, evidence-based, accessible and easier to maintain;
- verified by local evidence, not just a successful build.

END OF CONTEXT.
