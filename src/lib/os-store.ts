"use client";

import { useSyncExternalStore } from "react";
import { sound } from "./sound";

export type OSRankTitle = "Novice Scout" | "NOC Specialist" | "SQL Architect" | "S-Tier // Kernel Master";

export interface OSRank {
  tier: number;
  title: OSRankTitle;
  badge: string;
  minXp: number;
  maxXp: number;
  color: string;
}

export const OS_RANKS: OSRank[] = [
  { tier: 1, title: "Novice Scout", badge: "🌱", minXp: 0, maxXp: 499, color: "text-emerald-400" },
  { tier: 2, title: "NOC Specialist", badge: "🌐", minXp: 500, maxXp: 1499, color: "text-cyan-400" },
  { tier: 3, title: "SQL Architect", badge: "⚡", minXp: 1500, maxXp: 2999, color: "text-purple-400" },
  { tier: 4, title: "S-Tier // Kernel Master", badge: "👑", minXp: 3000, maxXp: Infinity, color: "text-amber-400" },
];

export interface OSBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ALL_OS_BADGES: OSBadge[] = [
  { id: "first-breach", title: "Kernel Breached", description: "Solved Level 1 in Terminal CTF", icon: "🛡️" },
  { id: "firewall-hero", title: "Packet Defender", description: "Blocked 50+ DDoS packets in NOC Firewall", icon: "🔥" },
  { id: "binary-blitz", title: "Binary Blitz", description: "Achieved 3x Overclock in Subnet Sprint", icon: "⚡" },
  { id: "index-wizard", title: "Index Optimizer", description: "Cooled server CPU down in Query Optimizer", icon: "🧊" },
  { id: "chaos-master", title: "Chaos Survivor", description: "Kept 99.99% uptime in Chaos Simulator", icon: "🚀" },
  { id: "tool-runner", title: "Tool Craftsman", description: "Executed 10+ browser SaaS tools", icon: "🛠️" },
  { id: "prompt-stealer", title: "Prompt Architect", description: "Copied 5+ lab session prompts", icon: "📋" },
];

export interface OSProfileState {
  handle: string;
  totalXp: number;
  badges: string[];
  highScores: Record<string, number>;
  toolsRun: number;
  promptsCopied: number;
  gamesPlayed: number;
}

const STORAGE_KEY = "the_sabbir_os_state_v5";

const DEFAULT_STATE: OSProfileState = {
  handle: "guest_operative",
  totalXp: 120,
  badges: ["first-breach"],
  highScores: {},
  toolsRun: 0,
  promptsCopied: 0,
  gamesPlayed: 0,
};

let currentState: OSProfileState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function loadState(): OSProfileState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: OSProfileState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or private mode
  }
}

// Initialise from storage if in browser
if (typeof window !== "undefined") {
  currentState = loadState();
}

export function getRankForXp(xp: number): OSRank {
  for (let i = OS_RANKS.length - 1; i >= 0; i--) {
    if (xp >= OS_RANKS[i].minXp) {
      return OS_RANKS[i];
    }
  }
  return OS_RANKS[0];
}

export function calculateRankTier(xp: number): OSRankTitle {
  return getRankForXp(xp).title;
}

export const osStore = {
  getState(): OSProfileState {
    return currentState;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setHandle(newHandle: string) {
    const clean = newHandle.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20) || "operative";
    currentState = { ...currentState, handle: clean };
    saveState(currentState);
    emitChange();
  },

  addXp(amount: number, reason?: string) {
    if (amount <= 0) return;
    const prevRank = getRankForXp(currentState.totalXp);
    const nextXp = currentState.totalXp + amount;
    const nextRank = getRankForXp(nextXp);

    currentState = { ...currentState, totalXp: nextXp };
    saveState(currentState);
    emitChange();

    if (nextRank.tier > prevRank.tier) {
      sound.levelUp();
    }
  },

  unlockBadge(badgeId: string) {
    if (currentState.badges.includes(badgeId)) return;
    currentState = {
      ...currentState,
      badges: [...currentState.badges, badgeId],
      totalXp: currentState.totalXp + 150,
    };
    saveState(currentState);
    emitChange();
    sound.milestone(badgeId);
  },

  recordGameScore(gameId: string, score: number) {
    const prevHigh = currentState.highScores[gameId] || 0;
    const newHigh = Math.max(prevHigh, score);
    const xpReward = Math.round(score * 0.1);

    currentState = {
      ...currentState,
      gamesPlayed: currentState.gamesPlayed + 1,
      highScores: { ...currentState.highScores, [gameId]: newHigh },
      totalXp: currentState.totalXp + xpReward,
    };
    saveState(currentState);
    emitChange();
  },

  incrementToolRun() {
    const nextCount = currentState.toolsRun + 1;
    currentState = {
      ...currentState,
      toolsRun: nextCount,
      totalXp: currentState.totalXp + 10,
    };
    if (nextCount >= 10) {
      osStore.unlockBadge("tool-runner");
    }
    saveState(currentState);
    emitChange();
  },

  incrementPromptCopy() {
    const nextCount = currentState.promptsCopied + 1;
    currentState = {
      ...currentState,
      promptsCopied: nextCount,
      totalXp: currentState.totalXp + 15,
    };
    if (nextCount >= 5) {
      osStore.unlockBadge("prompt-stealer");
    }
    saveState(currentState);
    emitChange();
  },
};

export const OS_STORE = osStore;
export const setPlayerHandle = (h: string) => osStore.setHandle(h);
export const addOSXp = (amt: number, reason?: string) => osStore.addXp(amt, reason);
export const unlockBadge = (badgeId: string) => osStore.unlockBadge(badgeId);
export const recordGamePlayed = (gameId: string, score: number, xp?: number) => osStore.recordGameScore(gameId, score);

export function useOSStore(): OSProfileState & { rank: OSRank } {
  const state = useSyncExternalStore(
    osStore.subscribe,
    osStore.getState,
    () => DEFAULT_STATE
  );
  const rank = getRankForXp(state.totalXp);
  return { ...state, rank };
}
