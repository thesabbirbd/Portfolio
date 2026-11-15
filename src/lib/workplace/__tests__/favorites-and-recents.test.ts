import { describe, it, expect, beforeEach } from "vitest";
import {
  getPinnedTools,
  isToolPinned,
  toggleToolPin,
  getRecentTools,
  recordToolVisit,
  clearRecentTools,
} from "../favorites-and-recents";

describe("Favorites & Recents Engine (v5.2.12)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default pinned tools when storage is empty", () => {
    const pinned = getPinnedTools();
    expect(pinned.length).toBeGreaterThanOrEqual(3);
    expect(pinned).toContain("bg-remover");
  });

  it("toggles tool pin status correctly and persists to localStorage", () => {
    const slug = "test-custom-tool";
    expect(isToolPinned(slug)).toBe(false);

    // Pin
    const isNowPinned = toggleToolPin(slug);
    expect(isNowPinned).toBe(true);
    expect(isToolPinned(slug)).toBe(true);
    expect(getPinnedTools()).toContain(slug);

    // Unpin
    const isNowUnpinned = toggleToolPin(slug);
    expect(isNowUnpinned).toBe(false);
    expect(isToolPinned(slug)).toBe(false);
    expect(getPinnedTools()).not.toContain(slug);
  });

  it("records recent visits in LRU order and caps at 8 items", () => {
    expect(getRecentTools()).toEqual([]);

    recordToolVisit("tool-1");
    recordToolVisit("tool-2");
    recordToolVisit("tool-3");

    let recents = getRecentTools();
    expect(recents).toEqual(["tool-3", "tool-2", "tool-1"]);

    // Re-visiting tool-1 moves it to the front
    recordToolVisit("tool-1");
    recents = getRecentTools();
    expect(recents).toEqual(["tool-1", "tool-3", "tool-2"]);

    // Fill up to 10 items, verify max 8
    for (let i = 4; i <= 10; i++) {
      recordToolVisit(`tool-${i}`);
    }
    recents = getRecentTools();
    expect(recents.length).toBe(8);
    expect(recents[0]).toBe("tool-10");
  });

  it("clears recent tools cleanly", () => {
    recordToolVisit("tool-a");
    recordToolVisit("tool-b");
    expect(getRecentTools().length).toBe(2);

    clearRecentTools();
    expect(getRecentTools()).toEqual([]);
  });
});
