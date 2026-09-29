## 2024-05-19 - Added ARIA labels to interactive icon-only buttons
**Learning:** Found multiple instances of icon-only interactive elements lacking ARIA labels across navigation components (`SearchInterface`, `MorphingNav`, `IdentityDock`, `TerminalModal`). This represents an accessibility gap for screen readers.
**Action:** Applied appropriate `aria-label`s to ensure the purpose of each button is clear. Future UI components should include `aria-label` on icon-only interactive elements by default.
