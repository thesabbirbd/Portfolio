## 2024-05-19 - Added ARIA labels to interactive icon-only buttons
**Learning:** Found multiple instances of icon-only interactive elements lacking ARIA labels across navigation components (\`SearchInterface\`, \`MorphingNav\`, \`IdentityDock\`, \`TerminalModal\`). This represents an accessibility gap for screen readers.
**Action:** Applied appropriate \`aria-label\`s to ensure the purpose of each button is clear. Future UI components should include \`aria-label\` on icon-only interactive elements by default.

## 2026-09-29 - [IdentityDock ARIA Labels]
**Learning:** Found several floating and interactive UI components in the design system relying purely on icons or profile images without accompanying text or aria-labels, which diminishes screen reader accessibility for primary navigation features like the dock and profile panels.
**Action:** Always verify custom components with mapped icons or toggle buttons (like \`IdentityDock.tsx\`) for \`aria-label\`s, especially since these components often use titles that don't effectively override generic button roles for all assistive technologies.
## 2024-10-27 - [Filter Tabs Accessibility Standardization]
**Learning:** Found inconsistency in custom filter tabs across different content browsers (Search, Notes, Projects, Lab). Some used simple groups of buttons without proper semantic grouping or state indicators, while others (like Projects and Lab) had `role="group"` and `aria-pressed`. This inconsistency means screen readers handle filtering differently depending on which page the user is on.
**Action:** Standardized all custom filter tab groups to use `role="group"` with a descriptive `aria-label` (e.g., "Filter results by type"), and added `aria-pressed` tracking to all filter buttons to explicitly indicate the currently active filter state. Also hid decorative filter labels from screen readers using `aria-hidden="true"` to reduce noise.
