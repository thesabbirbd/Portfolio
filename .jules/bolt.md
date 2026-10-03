## 2026-09-29 - [Debounce Search Inputs]
**Learning:** React state updates linked to complex filtering or DOM manipulations (like CommandMenu) can cause significant UI thread blocking if updated on every keystroke.
**Action:** Always debounce search inputs linked to filtering operations or complex component re-renders to ensure a snappy user experience.

## 2024-03-24 - [Refactor resize listeners to matchMedia]
**Learning:** Using `window.addEventListener('resize', ...)` in React components can cause unnecessary rapid state evaluations during window resizing.
**Action:** Refactor these to use `window.matchMedia(query).addEventListener('change', ...)` which only triggers an event when the breakpoint is crossed, improving responsiveness and performance.

## 2024-03-24 - [Avoid Code Duplication for matchMedia]
**Learning:** CI enforces strict duplication limits (SonarCloud Quality Gate: ≤ 3%). Repeating the `matchMedia` listener setup across components causes CI to fail.
**Action:** Always extract shared logic (like media query event listeners) into a reusable custom hook (e.g. `useMediaQuery`) rather than implementing it per component.

## 2024-10-02 - [Fix LCP Delays from framer-motion Opacity]
**Learning:** Initializing text components with `opacity: 0` in `framer-motion` causes the browser to delay painting the element until after JS execution, severely impacting Largest Contentful Paint (LCP).
**Action:** Always ensure critical text elements animated with `framer-motion` start with an initial opacity of 1 (e.g., `initial={{ opacity: 1 }}`) to prevent LCP degradation, adjusting animation variants accordingly.
