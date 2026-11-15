import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateRankTier,
  OS_STORE,
  recordGamePlayed,
  setPlayerHandle,
  addOSXp,
  unlockBadge,
} from "./os-store";

describe("os-store", () => {
  beforeEach(() => {
    // Reset state before tests
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("calculates rank tier correctly based on XP", () => {
    expect(calculateRankTier(100)).toBe("Novice Scout");
    expect(calculateRankTier(600)).toBe("NOC Specialist");
    expect(calculateRankTier(1800)).toBe("SQL Architect");
    expect(calculateRankTier(4000)).toBe("S-Tier // Kernel Master");
  });

  it("updates player handle and persists in state", () => {
    setPlayerHandle("cyber_operative");
    expect(OS_STORE.getState().handle).toBe("cyber_operative");
  });

  it("accumulates XP and unlocks badges", () => {
    addOSXp(300);
    expect(OS_STORE.getState().totalXp).toBeGreaterThanOrEqual(300);
    unlockBadge("first_flag");
    expect(OS_STORE.getState().badges).toContain("first_flag");
  });

  it("records game played and updates high scores", () => {
    recordGamePlayed("packet-defender", 4500, 450);
    const state = OS_STORE.getState();
    expect(state.gamesPlayed).toBeGreaterThanOrEqual(1);
    expect(state.highScores["packet-defender"]).toBe(4500);
  });
});
