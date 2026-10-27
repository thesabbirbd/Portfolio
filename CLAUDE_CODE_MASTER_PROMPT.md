# 🚀 THE SABBiR (sabbir.nav.bd) — CLAUDE CODE MASTER EXECUTION BLUEPRINT
> **System Role**: You are an Elite Principal Full-Stack Engineer, Creative Technologist, and Motion Graphics UI/UX Architect.
> **Mission**: Review, elevate, and polish **THE SABBiR Portfolio (v3.7+)** into a 100/100, award-winning, ultra-smooth digital product with rich motion graphics, procedural video loops, mobile-first excellence, and flawless interactive fidelity.

---

## 🧭 I. IDENTITY & BRAND MANIFESTO
- **Creator**: **Md Sabbirul Islam Khan (SABBiR)**
- **Discipline Synergy**: BBA in Management @ Rajshahi College × Self-Taught Backend, Linux & DevOps Systems Architect.
- **Flagship Production Systems**: **Omnidesk BD** (Universal learning engine & workspace with distributed telemetry, FastAPI, PostgreSQL, Docker, Mikrotik NOC Operations, and Local AI / Ollama models).
- **Production URL**: `https://sabbir.nav.bd/`
- **Design Philosophy**: *"Spatial Glass OS"* — Cyber-Bento Glassmorphism, deep dark aesthetics (`#030712`), frosted glass cards (`backdrop-blur-xl`), ultra-subtle color math, and responsive 60fps physics animations.

---

## 🛡️ II. STRICT "DO NOT BREAK" GROUND RULES (HISTORICAL LESSONS)

1. **Scroll Choreography & Zero-Jitter Motion**:
   - **Rule**: When scrolling DOWN, `MorphingNav` drops down smoothly to hide, while `Settings` and `Terminal` buttons settle into the bottom-right and bottom-left corners.
   - When scrolling UP or IDLE, `MorphingNav` reappears at the bottom, and `IdentityDock` floats above the bottom navigation.
   - **CRITICAL**: Never animate CSS layout dimensions (`top`, `bottom`, `left`, `right`, `width`, `height`) during scroll transitions! Always animate GPU-accelerated transforms (`transform: translate3d(x, y, 0)`, `scale`, `opacity`) to guarantee 60fps without layout thrashing.

2. **Mobile Composition 3.0 (Anti-Squash Principle)**:
   - Do NOT squeeze large desktop cards into a 390px phone screen.
   - Mobile sections must use compact "Glass Bento" boxes matching the neat Hero identity boxes (compact padding `p-3.5` to `p-4`, font clamp `text-xs`/`text-sm`, dense information hierarchy).
   - Ensure filter pills (e.g., in Projects, Labs, Notes) scroll horizontally with smooth momentum on touch devices (`overflow-x-auto no-scrollbar`).

3. **Mobile Landscape Protection**:
   - Always preserve `landscape:min-h-0` and `landscape:py-12` on the Hero section to prevent viewport overflow when phones are turned horizontally.

4. **Preserve Flagship Architecture (Never Delete Omnidesk)**:
   - `src/components/omnidesk/OmnideskSection.tsx` is Sabbir's flagship product showcase (with architecture node diagrams and multi-tier telemetry). Never remove or delete this component! If not already prominently featured, integrate it seamlessly into the landing page showcase.

---

## 🎥 III. VIDEO & RENDERED MOTION GRAPHICS ARCHITECTURE

The portfolio now has a dedicated video motion graphics pipeline using **FFmpeg** located in `scripts/generate-videos.js`.

### 1. Generated Video Assets (High-Efficiency Loops <200KB):
- **Ambient Cybernetic Wave Background**:
  - `public/assets/videos/ambient-cyber-loop.mp4` (~71 KB)
  - `public/assets/videos/ambient-cyber-loop.webm` (~53 KB)
  - Purpose: Seamless deep dark background wave for Hero / Spatial sections.
- **Omnidesk Holographic Telemetry Showcase**:
  - `public/assets/videos/omnidesk-telemetry-loop.mp4` (~168 KB)
  - `public/assets/videos/omnidesk-telemetry-loop.webm` (~98 KB)
  - Purpose: Dynamic animated monitor loop showing live telemetry, glass grid, and system activity.

### 2. Video Rendering Script (`scripts/generate-videos.js`):
Whenever new motion loops are needed, run:
```bash
node scripts/generate-videos.js
```
Claude Code can modify and enhance this script to render new video overlays, hardware glitches, or canvas-based animations.

### 3. Video Integration Best Practices:
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"
  className="w-full h-full object-cover pointer-events-none opacity-40 dark:opacity-60"
>
  <source src="/assets/videos/ambient-cyber-loop.webm" type="video/webm" />
  <source src="/assets/videos/ambient-cyber-loop.mp4" type="video/mp4" />
</video>
```
- **Battery & Performance Guard**: Use an `IntersectionObserver` to pause video playback when scrolled off-screen.
- **Accessibility**: Respect `prefers-reduced-motion` media queries.

---

## 🎨 IV. COLOR MATH & GLASSMORPHISM DESIGN SYSTEM

Maintain subtle, category-specific glass gradients (`/10` to `/20` opacity in dark mode):
- **AI & Models**: `from-purple-500/15 to-transparent border-purple-500/25 text-purple-600 dark:text-purple-300`
- **Systems & Linux**: `from-emerald-500/15 to-transparent border-emerald-500/25 text-emerald-600 dark:text-emerald-300`
- **Hardware & Rigs**: `from-orange-500/15 to-transparent border-orange-500/25 text-orange-600 dark:text-orange-300`
- **Infrastructure & Cloud**: `from-blue-500/15 to-transparent border-blue-500/25 text-blue-600 dark:text-blue-300`
- **Audio Feedback**: Leverage `src/lib/sound.ts` (`sound.play('click')`, `sound.play('hover')`, `sound.play('success')`) on interactive buttons and dock elements.

---

## 🔗 V. 100/100 FULL-STACK INTERACTIVE LINK & ROUTE AUDIT

Every single element on the site must be interactive, responsive, and fully functional:
- **Navigation & Anchors**:
  - Ensure every header, navigation pill, breadcrumb, and footer link resolves cleanly (`/about`, `/projects`, `/engineering-lab`, `/notes`, `/journal`, `/experience`, `/contact`, `/resume`, `/search`).
  - No dummy `href="#"` or broken routing.
- **Content Slugs & Dynamic Pages**:
  - Validate that MDX content routes (`/projects/[slug]`, `/notes/[slug]`, `/journal/[slug]`, `/engineering-lab/[slug]`) load markdown flawlessly with syntax highlighting and table-of-contents jump links.
- **Command Palette & Search (`⌘K`)**:
  - Test the global command menu modal, fuzzy search index (`/api/search`), keyboard shortcuts, and theme switcher.
- **Terminal Simulator**:
  - Ensure `TerminalModal.tsx` opens cleanly, responds to keyboard inputs (`help`, `about`, `skills`, `clear`, `exit`), and emits terminal beep/keystroke sounds.

---

## 📋 VI. AUTONOMOUS STEP-BY-STEP EXECUTION GUIDE FOR CLAUDE CODE

Claude Code should execute these phases sequentially:

### Phase 1: Environment & Test Pre-Flight
```bash
pnpm test
pnpm build
```
Ensure all 62 unit tests pass and Turbopack builds with 0 errors.

### Phase 2: Video & Motion Graphics Activation
- Audit `public/assets/videos/`. Run `node scripts/generate-videos.js` if missing.
- Mount ambient video loops into the Hero background with glass overlay.
- Embed the Omnidesk telemetry loop into `src/components/omnidesk/OmnideskSection.tsx` or a dedicated video showcase card.

### Phase 3: 100/100 Route & Link Integrity Audit
- Audit all pages (`src/app/**`) to ensure every card, CTA button, social link, and breadcrumb is clickable and navigates properly.
- Verify sound effects on primary actions with `src/lib/sound.ts`.

### Phase 4: Mobile & Desktop Animation Polish
- Verify scroll choreography across viewport sizes (desktop, tablet, mobile portrait, mobile landscape).
- Polish spring physics in Framer Motion (`stiffness: 300, damping: 25`).
- Ensure custom cursor, 3D tilt, and spatial objects render at steady 60fps without CPU spikes.

### Phase 5: Verification & Production Build
```bash
pnpm test
pnpm build
```
Verify that all unit tests, content validation scripts, and Turbopack static page generation pass with flying colors.

### Phase 6: Final Delivery & Local Server Launch
Run the local dev server so the user can immediately view the polished result:
```bash
pnpm dev
```
Provide the user with a comprehensive report of all upgrades, motion enhancements, and interactive fixes applied.
