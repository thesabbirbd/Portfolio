"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Trophy, Shield, Key, LogOut, Copy, Check, Sparkles, X, LayoutDashboard } from "lucide-react";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { sound } from "@/lib/sound";

export function UserIdentityDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useWorkplaceAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopyHandle = () => {
    sound.copy();
    navigator.clipboard.writeText(user.handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-full bg-[#0e0e14] border-l border-neutral-800 p-6 flex flex-col justify-between shadow-2xl text-neutral-100 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">{user.displayName}</h3>
                <span className="text-xs font-mono text-neutral-400">{user.handle}</span>
              </div>
            </div>
            <button
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Details & Stats */}
          <div className="space-y-3 mb-6">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-neutral-300">Total Career XP</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-400">{user.totalXp} XP</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-neutral-300">Account Role</span>
              </div>
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {user.role}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-neutral-300">Login Security</span>
              </div>
              <span className="text-xs font-mono text-blue-400">
                {user.passHash ? "Password Protected" : "⚡ Blank-Password (Fast)"}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={handleCopyHandle}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors text-xs font-semibold"
            >
              <span className="flex items-center gap-2 text-neutral-300">
                <Copy className="w-4 h-4 text-neutral-400" /> Copy Username / ID
              </span>
              {copied ? <span className="text-emerald-400 text-[11px]">Copied!</span> : <span className="font-mono text-neutral-500">{user.handle}</span>}
            </button>

            <Link
              href="/dashboard"
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors text-xs font-semibold text-amber-300"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-amber-400" /> Open SaaS User Dashboard
              </span>
              <span>→</span>
            </Link>

            <Link
              href="/leaderboard"
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors text-xs font-semibold text-neutral-300"
            >
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Global Leaderboard & Badges
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-neutral-800">
          <button
            onClick={() => {
              sound.click();
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out / Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
