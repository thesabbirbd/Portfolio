import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  THEME_COLORS, THEME_INIT_SCRIPT, THEME_SESSION_KEY, THEME_STORAGE_KEY, resolveThemeColor,
} from "./theme-color";
import { randomizeThemeColor, setThemeColor, useThemeColor, useThemeSource } from "./theme-color-store";

const root = document.documentElement;
const runInitScript = () => new Function(THEME_INIT_SCRIPT)();

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  root.removeAttribute("data-theme-color");
  root.removeAttribute("data-theme-source");
});
afterEach(() => vi.restoreAllMocks());

describe("resolveThemeColor", () => {
  it("prefers a saved manual choice, then this session's pick, then a random pick", () => {
    expect(resolveThemeColor("blue", "green", 0)).toEqual({ color: "blue", source: "saved" });
    expect(resolveThemeColor(null, "green", 0)).toEqual({ color: "green", source: "session" });
    expect(resolveThemeColor("nonsense", "also-bad", 0.5)).toEqual({ color: "green", source: "random" });
  });

  it("maps the random number onto all three themes", () => {
    expect([0, 0.34, 0.67, 0.9999].map((r) => resolveThemeColor(null, null, r).color)).toEqual(["orange", "green", "blue", "blue"]);
  });
});

describe("pre-paint script (THEME_INIT_SCRIPT)", () => {
  it("picks a random theme once per session and keeps it on later pages/reloads", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    runInitScript();
    expect(root.getAttribute("data-theme-color")).toBe("green");
    expect(root.getAttribute("data-theme-source")).toBe("random");
    expect(sessionStorage.getItem(THEME_SESSION_KEY)).toBe("green");

    vi.spyOn(Math, "random").mockReturnValue(0.99); // a later page in the same session
    runInitScript();
    expect(root.getAttribute("data-theme-color")).toBe("green");
    expect(root.getAttribute("data-theme-source")).toBe("session");
  });

  it("always applies a saved manual choice", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "blue");
    sessionStorage.setItem(THEME_SESSION_KEY, "green");
    runInitScript();
    expect(root.getAttribute("data-theme-color")).toBe("blue");
    expect(root.getAttribute("data-theme-source")).toBe("saved");
  });

  it("matches resolveThemeColor for every stored state", () => {
    const states: [string | null, string | null][] = [[null, null], ["orange", null], [null, "blue"], ["green", "orange"], ["bad", "worse"]];
    for (const [saved, session] of states) {
      localStorage.clear(); sessionStorage.clear();
      if (saved) localStorage.setItem(THEME_STORAGE_KEY, saved);
      if (session) sessionStorage.setItem(THEME_SESSION_KEY, session);
      vi.spyOn(Math, "random").mockReturnValue(0.1);
      runInitScript();
      const expected = resolveThemeColor(saved, session, 0.1);
      expect(root.getAttribute("data-theme-color")).toBe(expected.color);
      expect(root.getAttribute("data-theme-source")).toBe(expected.source);
    }
  });

  it("never throws when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(runInitScript).not.toThrow();
    expect(THEME_COLORS).toContain(root.getAttribute("data-theme-color"));
  });
});

describe("theme store", () => {
  it("saves a manual choice and notifies subscribers", () => {
    root.setAttribute("data-theme-color", "orange");
    const { result } = renderHook(() => ({ color: useThemeColor(), source: useThemeSource() }));
    act(() => setThemeColor("blue"));
    expect(result.current).toEqual({ color: "blue", source: "saved" });
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("blue");
    expect(sessionStorage.getItem(THEME_SESSION_KEY)).toBe("blue");
  });

  it("randomize forgets the saved choice and switches to a different theme", () => {
    root.setAttribute("data-theme-color", "green");
    localStorage.setItem(THEME_STORAGE_KEY, "green");
    let next: string | undefined;
    act(() => { next = randomizeThemeColor(0); });
    expect(next).not.toBe("green");
    expect(root.getAttribute("data-theme-color")).toBe(next);
    expect(root.getAttribute("data-theme-source")).toBe("random");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(THEME_SESSION_KEY)).toBe(next);
  });
});
