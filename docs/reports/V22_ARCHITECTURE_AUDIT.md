# THE SABBiR V2.2 — ARCHITECTURE AUDIT

## 1. DUPLICATED FUNCTIONALITY
*   **Navigations:** `Navbar.tsx`, `MorphingNav.tsx`, `sparkle-navbar.tsx`, and `morphing-navigation.tsx`. (`MorphingNav` is active, others are dead).
*   **Globes:** `Globe.tsx` (maps), `globe.tsx` (lightswind), `plasma-globe.tsx`.
*   **Scroll Engines:** Both `framer-motion` and `gsap` are installed and used across various components. 

## 2. CONFLICTING STATE OWNERSHIP
*   **Settings / 3D State:** `SettingsContext.tsx` stores `is3DEnabled` (using `localStorage` key `sabbir_3d_enabled`), whereas `SettingsPanel.tsx` implements completely disjointed local state `spatial3D` (using key `sabbir_spatial_3d`).
*   **Color Theme:** `SettingsPanel` contains local state for `colorTheme` but does not pipe it to `<html data-theme-color="orange">`.
*   **Motion / Sound:** Managed via standalone local state in `SettingsPanel.tsx` and `sound.ts` globally, leading to a fractured source of truth.

## 3. REPEATED DEPENDENCIES
*   `framer-motion` + `gsap`
*   `cobe`, `ogl`, `three`, `@react-three/fiber`, `@tsparticles/react` (Many WebGL engines running concurrently).

## 4. DUPLICATED ANIMATION ENGINES
*   Usage of GSAP alongside Framer Motion. Project directive favors Framer Motion + Lenis.

## 5. HARD-CODED COLORS
*   Extensive use of Hex values (`#ff6a00`, `#00f0ff`) inside `SettingsPanel.tsx` and `SpatialCore.tsx`.
*   Unintended hardcoded Tailwind classes (`text-slate-900`) persisting in utility elements instead of `text-foreground`.

## 6. UNNECESSARY RENDERS
*   Numerous independent `addEventListener('scroll')` hooks trigger un-throttled React state updates (e.g. `MorphingNav`).

## 7. WEBGL USAGE
*   `AuroraShader` uses `ogl`.
*   `Globe` uses `cobe`.
*   No centralized `SpatialController` exists to toggle WebGL processing when `is3DEnabled === false`. They just keep rendering.

## 8. SCROLL LISTENERS
*   14+ instances of `window.addEventListener("scroll")`. Should be consolidated into a single `useSpatialScroll()` Hook driven by Lenis.

## 9. POINTER/MOUSE LISTENERS
*   Multiple isolated `mousemove` event listeners in cards and hero sections, instead of a unified magnetic cursor registry.

## 10. LOCALSTORAGE KEYS
*   `sabbir_3d_enabled` vs `sabbir_spatial_3d`
*   `sabbir_reduced_motion`, `sabbir_color_theme` are accessed inconsistently.

## 11. HYDRATION RISKS
*   `useEffect` hooks reading `localStorage` post-mount without matching server-rendered states leading to layout shifts (e.g., 3D objects or colored themes snapping in after the first frame).

## 12. UNUSED COMPONENTS & DEAD CODE
*   `src/components/navigation/Navbar.tsx`
*   `src/components/lightswind/sparkle-navbar.tsx`
*   `src/components/lightswind/morphing-navigation.tsx`
*   `src/components/skills/SkillsSection.tsx` (Replaced by `SkillsBento.tsx`)

## 13. DUPLICATE LIGHTSWIND COMPONENTS
*   Multiple iterations of `Globe` and `Nav` primitives.
