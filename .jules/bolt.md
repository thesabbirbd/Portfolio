## 2026-09-29 - [Debounce Search Inputs]
**Learning:** React state updates linked to complex filtering or DOM manipulations (like CommandMenu) can cause significant UI thread blocking if updated on every keystroke.
**Action:** Always debounce search inputs linked to filtering operations or complex component re-renders to ensure a snappy user experience.
