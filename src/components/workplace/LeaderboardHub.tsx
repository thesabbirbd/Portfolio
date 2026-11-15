"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Medal, Award, Flame, Zap, Search, ShieldCheck, ArrowUpRight, Sparkles, User, RefreshCw } from "lucide-react";
import { sound } from "@/lib/sound";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import type { WorkspaceUser, XpLedgerItem } from "@/lib/db/workplace-store";

interface LeaderboardUser extends WorkspaceUser {
  rank: number;
  tier: string;
}

export function LeaderboardHub() {
  const { user: currentUser } = useWorkplaceAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [recentEvents, setRecentEvents] = useState<XpLedgerItem[]>([]);
  const [filterType, setFilterType] = useState<"all" | "members" | "guests">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workplace/leaderboard?type=${filterType}&limit=60`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
        setRecentEvents(data.recentEvents || []);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filterType]);

  const filteredUsers = leaderboard.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.displayName.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q);
  });

  const podium = leaderboard.slice(0, 3);

  return (
    <div className="w-full space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
          <Trophy className="w-3.5 h-3.5" />
          <span>THE SABBiR OS Workplace Leaderboard</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Global Creators &amp; Builders Ranking
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400">
          Earn XP by exporting everyday studio outputs, completing arcade speed-runs, and sharing 24-hour creative builds.
        </p>

        {currentUser && (
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-2 text-xs text-neutral-300 backdrop-blur-md">
            <span>Signed in as <strong className="text-white">{currentUser.displayName}</strong></span>
            <span className="text-neutral-600">•</span>
            <span className="text-amber-400 font-bold">⚡ {currentUser.totalXp} XP</span>
            <span className="text-neutral-600">•</span>
            <span className="rounded bg-neutral-800 px-2 py-0.5 capitalize text-[11px] text-neutral-300">
              {currentUser.role}
            </span>
          </div>
        )}
      </div>

      {/* Podium Cards (Top 3) */}
      {!loading && podium.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* #2 Silver */}
          {podium[1] && (
            <div className="order-2 md:order-1 rounded-3xl border border-neutral-700/60 bg-neutral-900/70 p-6 flex flex-col items-center text-center relative shadow-lg backdrop-blur-md">
              <div className="absolute -top-3.5 flex h-7 items-center justify-center rounded-full bg-neutral-700 px-3 text-xs font-bold text-neutral-200 border border-neutral-500 shadow">
                🥈 Rank #2
              </div>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-2xl font-bold text-neutral-300 border border-neutral-700">
                {podium[1].displayName.charAt(0)}
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{podium[1].displayName}</h3>
              <p className="text-xs text-neutral-400">@{podium[1].handle}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                ⚡ {podium[1].totalXp} XP
              </div>
              <div className="mt-2 text-[11px] text-neutral-500">
                {podium[1].exportsCount} studio exports · {podium[1].tier}
              </div>
            </div>
          )}

          {/* #1 Gold */}
          {podium[0] && (
            <div className="order-1 md:order-2 rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-500/15 to-neutral-900/90 p-7 flex flex-col items-center text-center relative shadow-2xl shadow-amber-500/10 backdrop-blur-md -translate-y-2">
              <div className="absolute -top-4 flex h-8 items-center justify-center rounded-full bg-amber-500 px-4 text-xs font-extrabold text-neutral-950 shadow-md">
                👑 Champion #1
              </div>
              <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl font-bold text-amber-400 border border-amber-500/40">
                {podium[0].displayName.charAt(0)}
              </div>
              <h3 className="mt-3 text-lg font-bold text-white">{podium[0].displayName}</h3>
              <p className="text-xs text-amber-300/80">@{podium[0].handle}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1 text-xs font-extrabold text-neutral-950 shadow-md">
                ⚡ {podium[0].totalXp} XP
              </div>
              <div className="mt-2 text-xs text-neutral-300 font-medium">
                {podium[0].exportsCount} studio exports · {podium[0].tier}
              </div>
            </div>
          )}

          {/* #3 Bronze */}
          {podium[2] && (
            <div className="order-3 rounded-3xl border border-neutral-700/60 bg-neutral-900/70 p-6 flex flex-col items-center text-center relative shadow-lg backdrop-blur-md">
              <div className="absolute -top-3.5 flex h-7 items-center justify-center rounded-full bg-amber-700/80 px-3 text-xs font-bold text-amber-200 border border-amber-600 shadow">
                🥉 Rank #3
              </div>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-2xl font-bold text-amber-600 border border-neutral-700">
                {podium[2].displayName.charAt(0)}
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{podium[2].displayName}</h3>
              <p className="text-xs text-neutral-400">@{podium[2].handle}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                ⚡ {podium[2].totalXp} XP
              </div>
              <div className="mt-2 text-[11px] text-neutral-500">
                {podium[2].exportsCount} studio exports · {podium[2].tier}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-neutral-900 p-1 w-full sm:w-auto">
          <button
            onClick={() => {
              setFilterType("all");
              sound.click();
            }}
            className={`flex-1 sm:flex-none rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filterType === "all" ? "bg-amber-500 text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            All Creators
          </button>
          <button
            onClick={() => {
              setFilterType("members");
              sound.click();
            }}
            className={`flex-1 sm:flex-none rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filterType === "members" ? "bg-amber-500 text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Registered Members
          </button>
          <button
            onClick={() => {
              setFilterType("guests");
              sound.click();
            }}
            className={`flex-1 sm:flex-none rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filterType === "guests" ? "bg-amber-500 text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Guests
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creator by name or handle..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Rankings Table + Side Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-400" />
              <span>Leaderboard Standings</span>
            </h2>
            <span className="text-xs text-neutral-500">{filteredUsers.length} creators listed</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-neutral-500 animate-pulse">
              Syncing live workplace XP rankings...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-500">
              No creators found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Creator</th>
                    <th className="py-3 px-3">Tier</th>
                    <th className="py-3 px-3 text-center">Role</th>
                    <th className="py-3 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser?.handle === u.handle;
                    return (
                      <tr
                        key={u.id}
                        className={`transition-colors ${
                          isSelf ? "bg-amber-500/10 font-medium" : "hover:bg-neutral-800/40"
                        }`}
                      >
                        <td className="py-3.5 px-3 font-mono font-bold text-neutral-400">
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : `#${u.rank}`}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{u.displayName}</span>
                            {isSelf && (
                              <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500">@{u.handle}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-medium text-neutral-300 border border-neutral-700">
                            {u.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                              u.role === "superadmin"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : u.role === "pro"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : u.role === "member"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400">
                          ⚡ {u.totalXp} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Column: XP Rules & Live Feed */}
        <div className="space-y-6">
          {/* XP Rewards Guide */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>How to Earn Workplace Points</span>
            </h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center justify-between rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800">
                <span>⚡ Tool Export (Guest)</span>
                <span className="font-mono font-bold text-amber-400">+25 XP</span>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800">
                <span>🚀 Tool Export (Member)</span>
                <span className="font-mono font-bold text-emerald-400">+50 XP</span>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800">
                <span>🕹️ Arcade Game Victory</span>
                <span className="font-mono font-bold text-blue-400">+100 XP</span>
              </li>
              <li className="flex items-center justify-between rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800">
                <span>🤖 Swarm Execution</span>
                <span className="font-mono font-bold text-purple-400">+50 XP</span>
              </li>
            </ul>
            <div className="pt-2 text-center">
              <Link
                href="/tools"
                onClick={() => sound.navigate()}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                <span>Launch Studio Tools &amp; Earn</span>
                <span>➔</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity Ticker */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Live Activity Stream</span>
              </h3>
              <button
                onClick={fetchLeaderboard}
                title="Refresh feed"
                className="text-neutral-500 hover:text-white p-1 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentEvents.length === 0 ? (
              <p className="text-xs text-neutral-500">No recent activity recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentEvents.slice(0, 8).map((evt) => (
                  <div key={evt.id} className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-2.5 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-neutral-300">
                      <strong className="text-white">{evt.displayName}</strong>
                      <span className="font-mono font-bold text-amber-400">+{evt.xpDelta} XP</span>
                    </div>
                    <div className="text-neutral-500 flex items-center justify-between">
                      <span className="capitalize">{evt.actionType.replace(/_/g, " ")} ({evt.targetSlug})</span>
                      <time className="text-[10px] text-neutral-600">
                        {new Date(evt.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
