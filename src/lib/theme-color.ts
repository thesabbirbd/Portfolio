/**
 * Colour themes (v4.0.1): Orange "Royal", Green "Studio", Blue "Tech".
 *
 * Selection rules
 *  - A manual choice (Settings / command menu) is saved in localStorage and always wins.
 *  - Without one, each new browser session gets one random theme, stored in sessionStorage so it
 *    stays the same on every route and reload of that session.
 *  - "Randomize" clears the saved choice and rolls a new session theme.
 *
 * The pre-paint script (THEME_INIT_SCRIPT, inlined in <head>) applies the same rules before the
 * first paint, so there is no flash and no server/client mismatch: the server never renders a
 * theme — CSS reads `html[data-theme-color]`, and the React state below is read from that
 * attribute after mount. Theme state lives in a tiny external store (theme-color-store.ts, not
 * SettingsContext), so switching re-renders only the few components that display the theme.
 *
 * This module has no React imports so the server layout can inline THEME_INIT_SCRIPT.
 */

export const THEME_COLORS = ["orange", "green", "blue"] as const;
export type ThemeColor = (typeof THEME_COLORS)[number];
export type ThemeSource = "saved" | "session" | "random";

export const THEME_STORAGE_KEY = "sabbir_color_theme"; // localStorage: manual choice
export const THEME_SESSION_KEY = "sabbir_session_theme"; // sessionStorage: this visit's random pick
export const THEME_TOAST_KEY = "sabbir_theme_toast_seen"; // sessionStorage: entry toast shown

export const THEME_META: Record<ThemeColor, { label: string; family: string; detail: string; swatch: string }> = {
  orange: { label: "Orange", family: "Royal", detail: "Amber Glass", swatch: "#ff6a00" },
  green: { label: "Green", family: "Studio", detail: "Emerald", swatch: "#10b981" },
  blue: { label: "Blue", family: "Tech", detail: "Cyan Circuit", swatch: "#3b82f6" },
};

export const isThemeColor = (v: unknown): v is ThemeColor => typeof v === "string" && (THEME_COLORS as readonly string[]).includes(v);

/** Pure selection logic shared by the pre-paint script (mirrored) and the tests. */
export function resolveThemeColor(saved: string | null, session: string | null, random: number): { color: ThemeColor; source: ThemeSource } {
  if (isThemeColor(saved)) return { color: saved, source: "saved" };
  if (isThemeColor(session)) return { color: session, source: "session" };
  return { color: THEME_COLORS[Math.min(THEME_COLORS.length - 1, Math.floor(random * THEME_COLORS.length))], source: "random" };
}

/** Same rules as resolveThemeColor, as a tiny inline script for <head> (runs before first paint). */
export const THEME_INIT_SCRIPT = `try{var d=document.documentElement,k=${JSON.stringify(THEME_COLORS)},c=null,s="saved";try{c=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(k.indexOf(c)<0){s="session";try{c=sessionStorage.getItem("${THEME_SESSION_KEY}")}catch(e){c=null}if(k.indexOf(c)<0){s="random";c=k[Math.min(k.length-1,Math.floor(Math.random()*k.length))];try{sessionStorage.setItem("${THEME_SESSION_KEY}",c)}catch(e){}}}d.setAttribute("data-theme-color",c);d.setAttribute("data-theme-source",s);try{if(localStorage.getItem("sabbir_reduced_motion")==="true")d.dataset.motion="reduced"}catch(e){}}catch(e){}`;
