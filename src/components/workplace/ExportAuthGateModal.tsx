"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { sound } from "@/lib/sound";

interface ExportAuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName?: string;
  onAuthenticatedProceed: () => void;
}

export function ExportAuthGateModal({
  isOpen,
  onClose,
  toolName = "Studio Output",
  onAuthenticatedProceed,
}: ExportAuthGateModalProps) {
  const { continueAsGuest, signUp, login } = useWorkplaceAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<"guest" | "signup" | "login">("guest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guest Form
  const [guestName, setGuestName] = useState("");

  // Signup / Login Form
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = guestName.trim();
    if (!clean) {
      setError("Please enter your name or handle to proceed.");
      sound.error();
      return;
    }

    setLoading(true);
    try {
      await continueAsGuest(clean);
      sound.levelUp();
      onClose();
      onAuthenticatedProceed();
    } catch (err: any) {
      setError(err?.message || "Failed to continue as guest");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!displayName.trim()) {
      setError("Please enter your display name.");
      sound.error();
      return;
    }
    if (!password || password.length < 4) {
      setError("Please enter a passcode of at least 4 characters.");
      sound.error();
      return;
    }

    setLoading(true);
    try {
      await signUp({
        displayName: displayName.trim(),
        handle: handle.trim() || undefined,
        email: email.trim() || undefined,
        password,
      });
      sound.levelUp();
      onClose();
      onAuthenticatedProceed();
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!handle.trim() || !password) {
      setError("Please provide your username/handle and passcode.");
      sound.error();
      return;
    }

    setLoading(true);
    try {
      await login({
        handle: handle.trim(),
        password,
      });
      sound.confirm();
      onClose();
      onAuthenticatedProceed();
    } catch (err: any) {
      setError(err?.message || "Invalid handle or passcode");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-neutral-900/95 p-6 shadow-2xl text-neutral-100 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.modalClose();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          aria-label="Close export modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <span>🔐 Export & Workplace Save</span>
            <span className="text-amber-400/60">•</span>
            <span>{toolName}</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Claim Your Output & Earn Points
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Join the global leaderboard or continue instantly as a guest creator.
          </p>
        </div>

        {/* Tab Switcher */}
        <div role="tablist" aria-label="Export options" className="mb-6 grid grid-cols-2 rounded-xl bg-neutral-950/60 p-1 border border-neutral-800">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "guest"}
            onClick={() => {
              setActiveTab("guest");
              setError(null);
              sound.click();
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
              activeTab === "guest"
                ? "bg-amber-500 text-black shadow-md font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>⚡ Guest Export</span>
            <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px]">+25 XP</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab !== "guest"}
            onClick={() => {
              setActiveTab("signup");
              setError(null);
              sound.click();
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
              activeTab !== "guest"
                ? "bg-neutral-800 text-white shadow-md font-semibold border border-neutral-700"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>🚀 Full Account</span>
            <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px]">+50 XP</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: GUEST EXPORT */}
        {activeTab === "guest" && (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <label htmlFor="guest-name" className="block text-xs font-medium text-neutral-300 mb-1.5">
                Your Display Name or Handle
              </label>
              <input
                id="guest-name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Rahim Coder or গ্রামীণ ক্রিয়েটর"
                autoFocus
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="mt-1.5 text-[11px] text-neutral-400">
                ⚡ No password required. Downloads immediately and logs your +25 XP on the global leaderboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Preparing Export...</span>
              ) : (
                <>
                  <span>Download Now & Earn +25 XP</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-medium text-neutral-300 mb-1">
                Display Name *
              </label>
              <input
                id="signup-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-handle" className="block text-xs font-medium text-neutral-300 mb-1">
                  Username / Handle
                </label>
                <input
                  id="signup-handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="tanvir_dev"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="signup-pass" className="block text-xs font-medium text-neutral-300 mb-1">
                  Passcode *
                </label>
                <input
                  id="signup-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-neutral-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Download (+50 XP)</span>
                  <span>➔</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setError(null);
                }}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
              >
                Already have an account? Log In
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: LOGIN */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label htmlFor="login-handle" className="block text-xs font-medium text-neutral-300 mb-1">
                Username or Email
              </label>
              <input
                id="login-handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. tanvir_dev"
                autoFocus
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="login-pass" className="block text-xs font-medium text-neutral-300 mb-1">
                Passcode
              </label>
              <input
                id="login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <span>Log In & Export</span>
                  <span>➔</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setError(null);
                }}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
              >
                Need an account? Sign Up (+50 XP)
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="mt-6 border-t border-neutral-800/80 pt-3 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1.5">
          <span>🛡️</span>
          <span>Protected by Enterprise WAF Shield · Zero-Cost Dual Engine</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
