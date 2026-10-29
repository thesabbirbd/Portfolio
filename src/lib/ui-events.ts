// Explicit global UI events. Components open each other through these instead of
// synthesising keyboard shortcuts, so Ctrl+K never triggers two overlays at once.

export const OPEN_COMMAND_MENU = "sabbir:open-command-menu";
export const OPEN_TERMINAL = "sabbir:open-terminal";
export const OPEN_SETTINGS = "sabbir:open-settings";

export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_COMMAND_MENU));
}

export function openTerminal() {
  window.dispatchEvent(new Event(OPEN_TERMINAL));
}

export function openSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS));
}

/** True when the keyboard focus is in a text field, so global shortcuts should stand down. */
export function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

/**
 * Scroll to an on-page section when it exists, otherwise navigate to the route that hosts it.
 * Keeps CTAs like "Contact" working on every page, not only the home page.
 */
export function goToSection(id: string, fallbackHref: string, navigate: (href: string) => void) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  navigate(fallbackHref);
}
