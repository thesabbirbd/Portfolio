## 2026-09-29 - [Debounce Search Inputs]
**Learning:** React state updates linked to complex filtering or DOM manipulations (like CommandMenu) can cause significant UI thread blocking if updated on every keystroke.
**Action:** Always debounce search inputs linked to filtering operations or complex component re-renders to ensure a snappy user experience.

## 2024-03-24 - [Refactor resize listeners to matchMedia]
**Learning:** Using `window.addEventListener('resize', ...)` in React components can cause unnecessary rapid state evaluations during window resizing.
**Action:** Refactor these to use `window.matchMedia(query).addEventListener('change', ...)` which only triggers an event when the breakpoint is crossed, improving responsiveness and performance.
