"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { authenticateWithBlankOrPassword, recoverAccountWithMobileCity } from "@/lib/auth/immortal-identity";
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
  const { continueAsGuest, refreshUser } = useWorkplaceAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<"blank" | "password" | "recover">("blank");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Blank-password & Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [optionalPassword, setOptionalPassword] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

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

  // 1. Blank-Password Username Login / Instant Guest
  const handleBlankLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const clean = identifier.trim();
    if (!clean) {
      setError("দয়া করে আপনার নাম বা ইউজারনেম দিন।");
      sound.error();
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateWithBlankOrPassword(clean, "");
      if (!res.ok) {
        if (res.requiresPassword) {
          setError(res.error || "এই একাউন্টটি পাসওয়ার্ড সুরক্ষিত। পাসওয়ার্ড দিন।");
          setActiveTab("password");
          return;
        }
        throw new Error(res.error || "লগইন ব্যর্থ হয়েছে");
      }

      await continueAsGuest(clean);
      sound.levelUp();
      onClose();
      onAuthenticatedProceed();
    } catch (err: any) {
      setError(err?.message || "লগইন করা যায়নি");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  // 2. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!identifier.trim() || !password) {
      setError("ইউজারনেম এবং পাসওয়ার্ড উভয়ই প্রয়োজন।");
      sound.error();
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateWithBlankOrPassword(identifier.trim(), password);
      if (!res.ok) {
        throw new Error(res.error || "ভুল পাসওয়ার্ড!");
      }
      await refreshUser();
      sound.confirm();
      onClose();
      onAuthenticatedProceed();
    } catch (err: any) {
      setError(err?.message || "লগইন ব্যর্থ হয়েছে");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  // 3. Account Recovery with Mobile + City
  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!identifier.trim() || !phone.trim() || !city.trim()) {
      setError("ইউজারনেম, মোবাইল নম্বর এবং শহরের নাম দেওয়া বাধ্যতামূলক।");
      sound.error();
      return;
    }

    setLoading(true);
    try {
      const res = await recoverAccountWithMobileCity(
        identifier.trim(),
        phone.trim(),
        city.trim(),
        optionalPassword.trim() || undefined
      );

      if (!res.ok) {
        throw new Error(res.error || "রিকভারি মেলেনি");
      }

      setSuccessMsg(res.message || "একাউন্ট সফলভাবে রিকভার হয়েছে!");
      sound.levelUp();
      await refreshUser();
      setTimeout(() => {
        onClose();
        onAuthenticatedProceed();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "রিকভারি ব্যর্থ হয়েছে");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-700 bg-[#0d0d12] p-6 shadow-2xl text-neutral-100 sm:p-8">
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
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <span>🔐 Export & Workplace Save</span>
            <span className="text-amber-400/60">•</span>
            <span>{toolName}</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
            ফাইলটি সেভ করুন ও XP অর্জন করুন
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            পাসওয়ার্ড ছাড়া শুধু নাম দিয়ে আজীবন লগইন থাকুন অথবা পাসওয়ার্ড দিয়ে লক করুন।
          </p>
        </div>

        {/* 3 Tabs */}
        <div role="tablist" aria-label="Export options" className="mb-5 grid grid-cols-3 rounded-xl bg-neutral-950/80 p-1 border border-neutral-800 text-xs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "blank"}
            onClick={() => {
              setActiveTab("blank");
              setError(null);
              sound.click();
            }}
            className={`py-2 rounded-lg font-medium transition-all text-center ${
              activeTab === "blank" ? "bg-amber-500 text-black font-bold shadow-sm" : "text-neutral-400 hover:text-white"
            }`}
          >
            ⚡ নাম (পাসওয়ার্ড ছাড়া)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "password"}
            onClick={() => {
              setActiveTab("password");
              setError(null);
              sound.click();
            }}
            className={`py-2 rounded-lg font-medium transition-all text-center ${
              activeTab === "password" ? "bg-amber-500 text-black font-bold shadow-sm" : "text-neutral-400 hover:text-white"
            }`}
          >
            🔑 পাসওয়ার্ড লগইন
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "recover"}
            onClick={() => {
              setActiveTab("recover");
              setError(null);
              sound.click();
            }}
            className={`py-2 rounded-lg font-medium transition-all text-center ${
              activeTab === "recover" ? "bg-amber-500 text-black font-bold shadow-sm" : "text-neutral-400 hover:text-white"
            }`}
          >
            🔄 একাউন্ট রিকভারি
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            ✅ {successMsg}
          </div>
        )}

        {/* Tab 1: Blank-Password Username */}
        {activeTab === "blank" && (
          <form onSubmit={handleBlankLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                আপনার নাম বা পছন্দসই ইউজারনেম (বা গেস্ট আইডি e.g. SB-4829)
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="যেমন: tanvir_dev, rahim_coder, বা SB-4829"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-neutral-400">
                💡 কোনো পাসওয়ার্ডের ঝামেলা নেই। এই নাম দিয়ে আজীবন যেকোনো ব্রাউজার থেকে সরাসরি লগইন করতে পারবেন।
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "ভেরিফাই হচ্ছে..." : "⚡ সরাসরি ডাউনলোড করুন ও +25 XP পান"}
            </button>
          </form>
        )}

        {/* Tab 2: Password Login */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                ইউজারনেম বা হ্যান্ডেল
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="যেমন: thesabbirbd"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন ও ফাইল ডাউনলোড"}
            </button>
          </form>
        )}

        {/* Tab 3: Account Recovery */}
        {activeTab === "recover" && (
          <form onSubmit={handleRecovery} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                ইউজারনেম বা গেস্ট আইডি
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="যেমন: tanvir_dev বা SB-4829"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  শহরের নাম
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="যেমন: Rajshahi / Dhaka"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                নতুন পাসওয়ার্ড (ফাঁকা রাখলে পাসওয়ার্ডবিহীন মোড হবে)
              </label>
              <input
                type="password"
                value={optionalPassword}
                onChange={(e) => setOptionalPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড (ঐচ্ছিক)"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? "রিকভার হচ্ছে..." : "একাউন্ট রিকভার ও আনলক"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
