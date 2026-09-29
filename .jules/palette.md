## 2024-05-19 - Added ARIA labels to interactive icon-only buttons
**Learning:** Found multiple instances of icon-only interactive elements lacking ARIA labels across navigation components (\`SearchInterface\`, \`MorphingNav\`, \`IdentityDock\`, \`TerminalModal\`). This represents an accessibility gap for screen readers.
**Action:** Applied appropriate \`aria-label\`s to ensure the purpose of each button is clear. Future UI components should include \`aria-label\` on icon-only interactive elements by default.

## 2026-09-29 - [IdentityDock ARIA Labels]
**Learning:** Found several floating and interactive UI components in the design system relying purely on icons or profile images without accompanying text or aria-labels, which diminishes screen reader accessibility for primary navigation features like the dock and profile panels.
**Action:** Always verify custom components with mapped icons or toggle buttons (like \`IdentityDock.tsx\`) for \`aria-label\`s, especially since these components often use titles that don't effectively override generic button roles for all assistive technologies.
