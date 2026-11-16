"use client";

/**
 * THE SABBiR OS // Immortal Identity Subsystem
 * Triple-Layer Session Persistence (localStorage + IndexedDB + 400-day Cookie)
 * Supports Blank-Password Username Login and Mobile + City Account Recovery.
 */

export interface ImmortalUser {
  id: string; // e.g. "usr-guest-4829" or "SB-4829"
  handle: string; // username or Guest ID
  displayName: string;
  email?: string | null;
  role: "guest" | "member" | "pro" | "superadmin";
  totalXp: number;
  xp?: number; // alias for totalXp
  exportsCount: number;
  hasPassword: boolean;
  phone?: string;
  city?: string;
  recoveryCity?: string;
  recoveryPhoneMasked?: string;
  guestIdMasked?: string;
  pinnedStudios?: string[];
  sessionToken: string;
  createdAt: string;
  lastActiveAt: string;
}

const STORAGE_KEY = "sabbir_immortal_session_v5";
const COOKIE_NAME = "sabbir_os_uid";

// Broadcast channel for real-time cross-tab synchronization
let authChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    authChannel = new BroadcastChannel("sabbir_os_auth_sync");
  } catch {}
}

export function notifyAuthSync(user: ImmortalUser | null): void {
  if (authChannel) {
    try {
      authChannel.postMessage({ type: "AUTH_UPDATE", user });
    } catch {}
  }
}

export function subscribeToAuthSync(callback: (user: ImmortalUser | null) => void): () => void {
  if (!authChannel) return () => {};
  const handler = (e: MessageEvent) => {
    if (e.data?.type === "AUTH_UPDATE") {
      callback(e.data.user || null);
    }
  };
  authChannel.addEventListener("message", handler);
  return () => authChannel?.removeEventListener("message", handler);
}

/**
 * Layer 1: Cookie Persistence (400 days max standard)
 */
export function setImmortalCookie(userId: string): void {
  if (typeof document === "undefined") return;
  const maxAge = 400 * 24 * 60 * 60; // 400 days in seconds
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(userId)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getImmortalCookie(): string | null {
  if (typeof document === "undefined") return null;
  const matches = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
}

export function clearImmortalCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Layer 2: localStorage Cache
 */
export function getStoredSession(): ImmortalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ImmortalUser;
  } catch {
    return null;
  }
}

export function saveStoredSession(user: ImmortalUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setImmortalCookie(user.id);
    notifyAuthSync(user);
  } catch {}
}

export function removeStoredSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    clearImmortalCookie();
    notifyAuthSync(null);
  } catch {}
}

/**
 * Helper to generate deterministic Guest ID: "SB-XXXX"
 */
export function generateGuestId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SB-${num}`;
}

/**
 * Blank-Password & Guest Login API Invoker
 */
export async function authenticateWithBlankOrPassword(
  identifier: string,
  passwordInput: string = ""
): Promise<{ ok: boolean; success: boolean; user?: ImmortalUser; session?: ImmortalUser; error?: string; requiresPassword?: boolean }> {
  try {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password: passwordInput }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        success: false,
        error: data.error || "Authentication failed",
        requiresPassword: data.requiresPassword || false,
      };
    }

    if (data.user) {
      saveStoredSession(data.user);
    }

    return { ok: true, success: true, user: data.user, session: data.user };
  } catch (err) {
    const stored = getStoredSession();
    if (stored && (stored.handle.toLowerCase() === identifier.toLowerCase() || stored.id === identifier)) {
      if (!stored.hasPassword || passwordInput.length > 0) {
        return { ok: true, success: true, user: stored, session: stored };
      }
      return { ok: false, success: false, requiresPassword: true, error: "Password required" };
    }
    return { ok: false, success: false, error: (err as Error).message };
  }
}

export const getImmortalIdentity = getStoredSession;
export const saveImmortalIdentity = saveStoredSession;
export type ImmortalUserSession = ImmortalUser;

/**
 * Mobile + City Name Account Recovery Invoker
 */
export async function recoverAccountWithMobileCity(
  identifier: string,
  phone: string,
  city: string,
  newPassword?: string
): Promise<{ ok: boolean; message?: string; error?: string; user?: ImmortalUser }> {
  try {
    const res = await fetch("/api/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, phone, city, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || "Recovery failed" };
    }

    if (data.user) {
      saveStoredSession(data.user);
    }

    return { ok: true, message: data.message, user: data.user };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
