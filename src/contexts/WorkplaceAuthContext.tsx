"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { WorkspaceUser } from "@/lib/db/workplace-store";

const STORAGE_KEY = "sabbir_workplace_session_v5";

interface WorkplaceAuthContextType {
  user: WorkspaceUser | null;
  sessionToken: string | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  signUp: (data: { displayName: string; handle?: string; email?: string; password?: string }) => Promise<WorkspaceUser>;
  continueAsGuest: (displayName: string) => Promise<WorkspaceUser>;
  login: (data: { handle: string; password: string }) => Promise<WorkspaceUser>;
  logout: () => void;
  recordExport: (toolSlug: string) => Promise<number>;
  refreshUser: () => Promise<void>;
}

const WorkplaceAuthContext = createContext<WorkplaceAuthContextType | undefined>(undefined);

export function WorkplaceAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WorkspaceUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.sessionToken) {
          setUser(parsed.user);
          setSessionToken(parsed.sessionToken);
        }
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  const saveSession = (u: WorkspaceUser, token: string) => {
    setUser(u);
    setSessionToken(token);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, sessionToken: token }));
    } catch {
      // storage unavailable
    }
  };

  const continueAsGuest = useCallback(async (displayName: string): Promise<WorkspaceUser> => {
    const res = await fetch("/api/workplace/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "guest", displayName }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to continue as guest");
    }

    saveSession(data.user, data.sessionToken);
    return data.user;
  }, []);

  const signUp = useCallback(async (form: { displayName: string; handle?: string; email?: string; password?: string }): Promise<WorkspaceUser> => {
    const res = await fetch("/api/workplace/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", ...form }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create account");
    }

    saveSession(data.user, data.sessionToken);
    return data.user;
  }, []);

  const login = useCallback(async (form: { handle: string; password: string }): Promise<WorkspaceUser> => {
    const res = await fetch("/api/workplace/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", ...form }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to log in");
    }

    saveSession(data.user, data.sessionToken);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSessionToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!sessionToken || !user) return;
    try {
      const res = await fetch("/api/workplace/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "me", sessionToken }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, sessionToken }));
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }
  }, [sessionToken, user]);

  const recordExport = useCallback(async (toolSlug: string): Promise<number> => {
    if (!user) return 0;

    const xpDelta = user.role === "guest" ? 25 : 50;

    try {
      const res = await fetch("/api/workplace/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userHandle: user.handle,
          displayName: user.displayName,
          actionType: "tool_export",
          targetSlug: toolSlug,
          xpDelta,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser: WorkspaceUser = {
          ...user,
          totalXp: data.newTotalXp || user.totalXp + xpDelta,
          exportsCount: user.exportsCount + 1,
        };
        setUser(updatedUser);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser, sessionToken }));
        } catch {}
        return xpDelta;
      }
    } catch {
      // update locally
      const updatedUser: WorkspaceUser = {
        ...user,
        totalXp: user.totalXp + xpDelta,
        exportsCount: user.exportsCount + 1,
      };
      setUser(updatedUser);
    }

    return xpDelta;
  }, [user, sessionToken]);

  return (
    <WorkplaceAuthContext.Provider
      value={{
        user,
        sessionToken,
        isGuest: user?.role === "guest",
        isAuthenticated: !!user,
        signUp,
        continueAsGuest,
        login,
        logout,
        recordExport,
        refreshUser,
      }}
    >
      {children}
    </WorkplaceAuthContext.Provider>
  );
}

export function useWorkplaceAuth() {
  const context = useContext(WorkplaceAuthContext);
  if (!context) {
    throw new Error("useWorkplaceAuth must be used within a WorkplaceAuthProvider");
  }
  return context;
}
