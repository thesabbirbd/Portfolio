# THE SABBiR — Project Context for Claude Code

This file captures stable project context and user preferences to help Claude Code review the local `sabbir.nav.bd` repository. It is not a substitute for inspecting the actual source code. When a detail conflicts with the current repository, verify it and report the discrepancy rather than guessing.

---

## 1. Identity and portfolio purpose

- **Public brand:** `THE SABBiR`
- **Full professional name used in factual profile content:** `Md Sabbirul Islam Khan`
- **Website:** `https://sabbir.nav.bd/`
- **Location context:** Rajshahi, Bangladesh
- **Education context:** BBA/Honours in Management at Rajshahi College (National University); technical foundation at Hat Gangopara BM Technical College.
- **Primary technical direction:** Backend Engineering and DevOps.
- **Related interests/experience areas:** IT support, NOC/network monitoring, MikroTik/networking, Linux/Ubuntu, cloud, Python training, AI/ML and local AI/Ollama, automation, computer hardware, GPU, UPS/solar/electronics, multimedia, photography/video, and business/management.
- **Community/exploration context:** Google Maps Local Guide/contributor and photography/exploration interests.

Use only details that are actually supported by the existing portfolio content or other verified source material. Do not transform interests, training, or exposure into claims of professional mastery. Do not invent years of experience, employers, customers, production deployments, metrics, or credentials.

### Branding constraints

Use `THE SABBiR` consistently as the public brand. Do not use alternate branding variants such as `SABBIR` or plain `Sabbir` as the brand identity. Do not combine the personal name and brand with parentheses. Keep the person’s name and brand distinct where needed.

### Main personal links (verify against the repository before changing)

- GitHub: `https://github.com/thesabbirbd`
- LinkedIn: `https://www.linkedin.com/in/thesabbirbd/`
- Facebook: `https://facebook.com/iamthesabbir`
- Instagram: `https://www.instagram.com/iam_thesabbir`
- X: `https://x.com/thesabbirbd`

A Google Maps contribution profile may also exist in the project README or social links. Use the exact existing verified URL; do not invent one.

---

## 2. Design direction and preferences

The desired website is a premium personal engineering portfolio with a strong sense of product design. Priorities, in order:

1. UI/UX clarity and professional composition.
2. Functional integrity: every meaningful control and link works.
3. Smoothness and responsiveness, especially on mobile.
4. Technical credibility and genuine content.
5. Performance, accessibility, reliability, and maintainability.
6. Motion graphics, spatial depth, and visual polish where they improve the experience.

### Preferred look and feel

- Modern, premium, tactile, spatial, glass-inspired design.
- Restrained glassmorphism; not every component should be blurred/translucent.
- Vibrant orange accents: `#ff6a00`, `#ffb800`, `#ff3300`.
- Coherent light/dark/system themes if already supported.
- Clear readable light mode; avoid making the whole site excessively dark or cyberpunk.
- Strong typography hierarchy, refined spacing, balanced color, clean card design, purposeful depth, careful iconography.
- Smooth, selective Motion/Framer Motion animation and usable transitions.
- Optional 3D/spatial effects should enhance the content rather than compete with it.
- Keep sound off by default if any sound feature exists, and respect user preferences.

Design inspirations should inform principles—not be copied as proprietary layouts, assets, or code.

---

## 3. Expected site content areas

The live source may have changed. Discover the actual routes/components before assuming all of these exist.

Possible major areas include:

- Hero / primary CTA
- Identity / About
- “THE ENGINEERING EVOLUTION” and its supporting line, “A continuous journey from business strategy to systems architecture.”
- World Identity Matrix / identity information cards
- Education and geographic context
- Career & Growth / journey timeline / explorer
- Projects and full project case studies
- Engineering Lab and technical experiments
- Notes
- Journal
- Skills and technologies
- Learning/courses
- Resume / print view
- Contact form or mailto-based fallback
- External profile links and community/exploration
- Footer
- Search and command menu
- Settings, theme, Motion and 3D preferences
- Terminal or other engineering interaction
- Image/media viewer and any photography-specific experience
- Error/not-found/loading states
- PWA/offline support if present

Important: Omnidesk BD is one project among others, not the entire personal identity. Do not let one project dominate every profile section unless current content explicitly requires it.

---

## 4. Technical stack — known history, verify locally

Historical project context mentions:

- Next.js
- React
- Tailwind CSS
- Framer Motion / Motion
- Three.js / React Three Fiber for selected spatial components
- Vercel deployment via GitHub and the custom `sabbir.nav.bd` domain
- Reusable UI components, content data, responsive rules, and PWA/service-worker work

This stack history may be out of date. Inspect `package.json`, lockfile, Next.js version, source directory, routing conventions, styling system, Motion version, and available scripts first. Do not assume a particular API/version until verified.

---

## 5. Previous UX / interaction history

The project has previously received substantial work in areas such as:

- responsive calibration and mobile density
- command menu and navigation behavior
- timeline interaction and scroll-linked state
- image viewer and copy controls
- theme/Motion/3D settings
- error/not-found routes
- interaction inventory and link/button fixes
- PWA and offline fallback
- content relationships and case-study architecture
- pointer companion that is smaller than the original and direction-aware
- reduced-motion and touch behavior

These were historical reports, not guarantees that every behavior still works. Audit the live source, test actual behavior, and avoid repeating successful work unnecessarily.

### Pointer companion

A previous pass reported a small (~11px) resting companion and ~19–20px active state, directional rotation, native browser cursor preserved, and custom cursor behavior disabled on touch/reduced-motion. Verify actual implementation. Do not make the pointer bigger or reintroduce expensive per-pointer-event React state without a demonstrated reason.

---

## 6. Important mobile issue: fixed controls and navigation

The most recent reported problem concerns a potentially glitchy transition between `MorphingNav`, `IdentityDock`, Terminal, and Settings.

### Source files/components previously mentioned

- `src/components/ui/IdentityDock.tsx`
- `src/components/navigation/MorphingNav.tsx`
- `src/components/ui/TerminalModal.tsx`
- `src/components/ui/SettingsPanel.tsx`
- `src/hooks/useSpatialScroll` (verify exact path/name and current usage)

The actual source paths may have changed. Discover them rather than assuming they still exist.

### Prior attempted IdentityDock patch

An earlier Antigravity workflow attempted to:

- import/use `useMotionValueEvent` and `useSpatialScroll`
- derive `isNavHidden` from scroll direction
- switch IdentityDock between a right-side elevated position and bottom-center
- use `motion.div layout`
- use CSS classes with changing `bottom`, `left`, `right`, and `-translate-x-1/2`
- apply `transition-all duration-700 ease-in-out`

The report said the result still felt glitchy. The patch was subsequently built/committed/pushed in that earlier task, but the current user now requires **no new Git commits/pushes/deployments unless explicitly authorized**.

The likely investigation targets are not assumptions of the exact root cause; check them empirically:

- Motion `layout` competing with fixed-position changes
- CSS `transition-all` competing with Framer Motion
- animating `left/right/bottom` and transform simultaneously
- duplicate scroll observers/state sources
- inconsistent wrapper geometry or containing blocks
- `useState` updating on every small scroll-direction change
- no meaningful hysteresis/debounce/settle strategy
- controls colliding with one another or safe-area boundaries

### Desired mobile behavior (must verify and implement coherently)

On meaningful downward scrolling:

- main MorphingNav hides per its intended behavior
- Terminal moves smoothly to bottom-left
- Settings moves smoothly to bottom-right
- IdentityDock/spread control takes the intended bottom-center position when that layout is safe and non-overlapping

When scrolling stops or the user moves upward:

- main nav reappears smoothly
- Terminal and Settings lift into their normal elevated positions in a coordinated sequence
- IdentityDock/spread control returns to its intended position above Settings when appropriate

No jumping, flickering, snapping, simultaneous conflicting transitions, or controls covering content. Ensure the behavior remains usable when Motion is disabled and on short screens/landscape. Desktop can have a separate arrangement.

---

## 7. Mobile composition is a first-class priority

Mobile must not be desktop scaled down.

The user specifically observed that, after “THE ENGINEERING EVOLUTION” and the sentence “A continuous journey from business strategy to systems architecture.”, many sections/cards were too large on a phone.

The following kind of content should be organized in compact but readable information cards or grouped modules, not huge repetitive card stacks:

- name/avatar and online/building/learning status
- academic degree and department
- technical foundation
- city/country and roots
- timezone
- core disciplines
- backend technology stack
- local AI/hardware context
- community recognition
- verified training or NOC-related context

The existing content may vary; use factual source text. Do not create one giant compressed block of unreadable microtext. Use compact hierarchy, tight internal spacing, sensible rows/grids, controlled metadata, content-driven card heights, and progressive disclosure when appropriate.

Mobile improvements should consider at least common narrow portrait widths, especially around 390–402px, plus short-height landscape and tablet. Keep desktop spacious and intentional rather than forcing shared compact values globally.

Keep the meaningful features available on mobile where practical. Prefer alternate layout/interaction rather than simply deleting advanced features.

---

## 8. Functional integrity expectations

The user cares strongly that links, titles, buttons, headers, and controls do what their appearance promises.

- All advertised interactive surfaces must work.
- Titles and section headers can offer anchor navigation where useful, but static copy should not be made falsely interactive.
- Do not use empty links, placeholder URLs, or no-op handlers.
- Every primary CTA needs a real destination or honest fallback.
- All internal routes should load directly and survive refresh.
- Search and filters should work on real available content.
- Dialogs should open/close correctly and manage focus.
- Settings toggles should have genuine effects.
- Contact feedback must be truthful. If email is opened with `mailto:`, do not claim the form was delivered server-side.
- External URLs must be validated against the repository or reliable existing content.

Use an explicit action → feedback → result audit.

---

## 9. Content and credibility rules

- “Less hype, more defensible evidence.”
- Do not inflate backend/DevOps coding experience beyond what the repository/content establishes.
- Do not claim “production-grade,” “enterprise-level,” or “10,000+ users” without supporting evidence.
- Do not imply BGP/OSPF/Cisco or other infrastructure tools were used hands-on unless the content proves it.
- Do not turn an AI-generated prototype into a claimed production deployment without evidence.
- Keep the site useful for entry-level technical opportunities without hiding genuine breadth.
- Projects, notes, lab work, learning, and journey content should cross-link only when the relationship actually exists.

---

## 10. Local workflow / safety preferences

- Work in the existing local repository.
- Inspect `git status --short` first and preserve any uncommitted user changes.
- Do not ask repeatedly for approval on ordinary low-risk UI/UX improvements; use professional judgment and implement sensible fixes.
- Do not fabricate test results or pretend to have accessed a physical device if only a browser emulator was used.
- Do not commit, push, merge, force-push, or deploy unless the user explicitly requests it later.
- Do not reset/clean unrelated work.
- Use existing scripts and package manager; avoid dependency churn.
- After implementation, run all applicable local checks and give a precise report with remaining limitations.

---

## 11. Definition of success

The desired end state is a complete, professional, smooth, premium, evidence-based website where:

- visual hierarchy is consistent across all pages
- mobile has its own compact, intentional composition
- desktop/tablet retain strong spatial composition
- fixed controls move smoothly without glitching or collision
- meaningful features remain available on phone screens
- all meaningful links and interactive elements function
- no route is silently broken
- motion is purposeful and respects accessibility
- performance is measured/verified rather than exaggerated
- content remains authentic
- the codebase is more reliable and easier to maintain
- local changes are tested and reported honestly
- no Git commit/push or deployment occurs without explicit approval

END OF PROJECT CONTEXT.
