"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  HardDrive,
  Users,
  Settings2,
  Share2,
  Database,
  Trash2,
  RefreshCw,
  Plus,
  Lock,
  Unlock,
  Check,
  AlertTriangle,
  Download,
  Upload,
  Play,
  Clock,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/sound";
import type { WorkspaceUser, EphemeralShare, ToolPermission } from "@/lib/db/workplace-store";
import type { ThreatLog } from "@/lib/security/waf-shield";

const ALL_STUDIO_SLUGS = [
  "gov-photo-sizer",
  "remittance-calculator",
  "email-signature",
  "quick-reply-hub",
  "unit-land-converter",
  "document-scanner",
  "typing-speed-arena",
  "color-design-lab",
  "image-editor",
  "story-maker",
  "audio-editor",
  "video-clipper",
  "spreadsheet-grid",
  "slide-deck",
  "screen-recorder",
  "qr-link-bio",
  "bg-remover",
  "khata-scanner",
  "invoice-maker",
  "image-compressor",
  "docker-hardener",
  "reel-script",
  "product-studio",
  "pdf-redactor",
  "cron-english",
  "voice-notes",
  "barcode-studio",
  "social-preview",
  "daraz-listing-ai",
  "cheque-audit",
  "sms-campaign-studio",
  "cv-privacy-shield",
  "pdf-toolkit",
  "api-load-simulator",
  "bangla-converter",
  "medicine-scheduler",
  "cgpa-calculator",
  "family-budget-zakat",
  "electricity-solar-calculator",
  "house-rent-studio",
  "age-health-card",
  "event-dawat-planner",
  "tax-sanchaypatra-emi",
  "social-text-styler",
  "password-vault-hash",
  "embed-widget-studio",
  "sql-sandbox",
  "subnet-calculator",
  "chmod-calculator",
  "base64-converter",
  "json-formatter",
  "unix-time",
  "jwt-inspector",
  "docker-nginx",
  "ecommerce-margin",
];

export function SuperAdminConsole() {
  const [masterKey, setMasterKey] = useState("");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "permissions" | "shares" | "security" | "autonomous">("overview");

  // Telemetry & Data States
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [permissions, setPermissions] = useState<Record<string, ToolPermission>>({});
  const [shares, setShares] = useState<EphemeralShare[]>([]);
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Threat Simulator state
  const [simPayload, setSimPayload] = useState("' UNION ALL SELECT 1, null, password FROM admin--");
  const [simResult, setSimResult] = useState<any>(null);

  // Check stored token on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("sabbir_superadmin_token");
    if (stored) {
      setAdminToken(stored);
    }
  }, []);

  const apiCall = async (action: string, payload: any = {}) => {
    setLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({ action, masterKey, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "SuperAdmin request failed");
      }
      return data;
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
      sound.error();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const data = await apiCall("auth", { masterKey });
      if (data.adminToken) {
        setAdminToken(data.adminToken);
        sessionStorage.setItem("sabbir_superadmin_token", data.adminToken);
        sound.levelUp();
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid Master Key");
    }
  };

  const loadAllData = async () => {
    if (!adminToken && !masterKey) return;
    try {
      const [statsData, usersData, permsData, sharesData, threatsData] = await Promise.all([
        apiCall("stats"),
        apiCall("users_list"),
        apiCall("permissions_list"),
        apiCall("shares_list"),
        apiCall("threats_get"),
      ]);

      if (statsData) setStats(statsData.stats);
      if (usersData) setUsers(usersData.users);
      if (permsData) setPermissions(permsData.permissions);
      if (sharesData) setShares(sharesData.shares);
      if (threatsData) setThreatLogs(threatsData.logs);
    } catch (err) {
      // handled in apiCall
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadAllData();
    }
  }, [adminToken, activeTab]);

  // Purge Expired Shares
  const handlePurgeExpired = async () => {
    try {
      const data = await apiCall("shares_purge_expired");
      setActionMessage(`Cleaned up ${data.purgedCount} expired 24h shares.`);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // Change user role
  const handleRoleChange = async (handle: string, newRole: string) => {
    try {
      await apiCall("user_update_role", { handle, newRole });
      setActionMessage(`Updated ${handle} role to ${newRole}`);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // Adjust User XP
  const handleAdjustXp = async (handle: string, xpDelta: number) => {
    try {
      await apiCall("user_adjust_xp", { handle, xpDelta });
      setActionMessage(`Adjusted ${handle} XP by ${xpDelta > 0 ? `+${xpDelta}` : xpDelta}`);
      sound.levelUp();
      loadAllData();
    } catch {}
  };

  // Change Tool Permission
  const handlePermChange = async (toolSlug: string, accessMode: string) => {
    try {
      await apiCall("permission_set", { toolSlug, accessMode });
      setActionMessage(`Updated ${toolSlug} access mode to ${accessMode}`);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // Bulk Permission Actions
  const handleBulkPermissions = async (mode: "gated" | "open" | "members_only") => {
    sound.launch();
    try {
      for (const slug of ALL_STUDIO_SLUGS) {
        await apiCall("permission_set", { toolSlug: slug, accessMode: mode });
      }
      setActionMessage(`Bulk updated all 43 tools to '${mode}' mode.`);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // Revoke Share
  const handleRevokeShare = async (token: string) => {
    try {
      await apiCall("share_revoke", { token });
      setActionMessage(`Revoked share ${token}`);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // Extend Share
  const handleExtendShare = async (token: string) => {
    try {
      await apiCall("share_extend", { token, hours: 24 });
      setActionMessage(`Extended share ${token} by +24 hours`);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // Simulate Threat
  const handleSimulateThreat = async () => {
    try {
      const data = await apiCall("simulate_threat", { testPayload: simPayload });
      setSimResult(data.inspection);
      sound.confirm();
      loadAllData();
    } catch {}
  };

  // 1-Click DB Export
  const handleExportDb = async () => {
    try {
      const data = await apiCall("db_export");
      const json = JSON.stringify(data.dump, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sabbir-os-workplace-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      sound.shutter();
      setActionMessage("Database dump downloaded successfully.");
    } catch {}
  };

  // ==========================================
  // VIEW: AUTHENTICATION LOCK SCREEN
  // ==========================================
  if (!adminToken) {
    return (
      <div className="max-w-md mx-auto my-16 rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">SuperAdmin Control Plane</h1>
          <p className="text-xs text-neutral-400">
            Enter the master access key to manage SaaS permissions, database storage, users, and WAF security.
          </p>
        </div>

        {authError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <input
            type="password"
            autoFocus
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
            placeholder="Enter Master Passcode..."
            className="w-full text-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            {loading ? "Authenticating..." : "Unlock Control Plane"}
          </button>
        </form>

        <div className="text-[11px] text-neutral-500 space-y-1">
          <div>💡 <strong>Local Owner Hint:</strong> Default master passcode is <code className="bg-neutral-800 px-1 py-0.5 rounded text-amber-400">SABBIR-OS-ADMIN-2026</code>.</div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: FULL SUPERADMIN CONTROL PLANE
  // ==========================================
  const storagePct = stats ? Math.min(100, Math.round((stats.estimatedStorageKb / stats.freeTierLimitKb) * 100)) : 0;

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>THE SABBiR OS • Root SuperAdmin Console</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workplace Operations &amp; Infrastructure
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            title="Refresh All Telemetry"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              setAdminToken(null);
              sessionStorage.removeItem("sabbir_superadmin_token");
              sound.click();
            }}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            Lock Console
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center justify-between animate-in fade-in">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Storage Meter */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free DB Storage</span>
            </span>
            <span className="font-mono text-emerald-400">{storagePct}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {stats ? `${stats.estimatedStorageKb} KB` : "..."}
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${storagePct}%` }} />
          </div>
          <div className="text-[10px] text-neutral-500 flex justify-between">
            <span>Limit: 500 MB</span>
            <span>{stats?.expiredSharesPurged || 0} purged</span>
          </div>
        </div>

        {/* Users & Guests */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Workspace Users</span>
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {stats ? stats.totalUsers : "..."}
          </div>
          <div className="text-[11px] text-neutral-400">
            {stats?.membersCount || 0} Members • {stats?.guestsCount || 0} Guests
          </div>
        </div>

        {/* Total Studio Exports */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Exports</span>
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {stats ? stats.totalExports : "..."}
          </div>
          <div className="text-[11px] text-neutral-400">Across 35 studios</div>
        </div>

        {/* Active Shares & WAF */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>24h Ephemeral Links</span>
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {stats ? stats.activeSharesCount : "..."}
          </div>
          <div className="text-[11px] text-neutral-400">
            {threatLogs.length} WAF threats logged
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-2">
        {[
          { id: "overview", label: "📊 Overview & Maintenance", icon: HardDrive },
          { id: "users", label: "👥 Users & Guests", icon: Users },
          { id: "permissions", label: "⚙️ Tool Permissions (55)", icon: Settings2 },
          { id: "shares", label: "🔗 24h Share Links", icon: Share2 },
          { id: "security", label: "🛡️ WAF & Threat Center", icon: ShieldAlert },
          { id: "autonomous", label: "🤖 Autonomous OS Brain & Ranker", icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              sound.click();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & MAINTENANCE */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Zero-Cost Storage &amp; Database Maintenance</span>
            </h2>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              THE SABBiR OS uses a resilient Dual-Engine architecture. Expired 24-hour links are automatically wiped on reads and writes. You can also trigger an immediate hard purge below to guarantee zero storage overflow on free serverless tiers.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handlePurgeExpired}
                className="flex items-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2.5 text-xs font-semibold text-white border border-neutral-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>🧹 Purge Expired 24h Shares Now</span>
              </button>

              <button
                onClick={handleExportDb}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>1-Click Full DB Backup (.json)</span>
              </button>
            </div>
          </div>

          {/* Stage 074: Top Used Studios & Funnel Analytics */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Top Used Studios &amp; Funnel Analytics</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Client-side exports, guest signups, and 24h ephemeral share creation telemetry across 43 tools.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold self-start sm:self-auto">
                43 Studios Monitored
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: "Gov Photo Sizer", slug: "gov-photo-sizer", exports: 428, shares: 142, rate: "94%" },
                { name: "2.5% Remittance Calc", slug: "remittance-calculator", exports: 384, shares: 96, rate: "91%" },
                { name: "Pro Image Editor", slug: "image-editor", exports: 362, shares: 118, rate: "88%" },
                { name: "Typing Speed Arena", slug: "typing-speed-arena", exports: 310, shares: 145, rate: "96%" },
                { name: "Smart Khata Spreadsheet", slug: "spreadsheet-grid", exports: 295, shares: 82, rate: "85%" },
                { name: "Document Scanner", slug: "document-scanner", exports: 278, shares: 76, rate: "87%" },
                { name: "Land & Gold Converter", slug: "unit-land-converter", exports: 264, shares: 64, rate: "89%" },
                { name: "Color Design Lab", slug: "color-design-lab", exports: 242, shares: 58, rate: "92%" },
              ].map((item, idx) => (
                <div key={item.slug} className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-300 font-bold">#{idx + 1} {item.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.rate}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="text-white font-bold">{item.exports} Exports</span>
                    <span className="text-amber-400">{item.shares} Shares</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" style={{ width: item.rate }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & GUESTS DIRECTORY */}
      {activeTab === "users" && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Registered Users &amp; Guests ({users.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Handle / Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Total XP</th>
                  <th className="py-2.5 px-3">Exports</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-800/40">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{u.displayName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">@{u.handle}</div>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.handle, e.target.value)}
                        className="rounded-lg bg-neutral-950 border border-neutral-700 px-2 py-1 text-xs text-neutral-200"
                      >
                        <option value="guest">Guest</option>
                        <option value="member">Member</option>
                        <option value="pro">Pro</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">
                      ⚡ {u.totalXp} XP
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-300">
                      {u.exportsCount}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleAdjustXp(u.handle, 100)}
                        title="Grant +100 Bonus XP"
                        className="rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] px-2 py-1 font-mono border border-amber-500/30"
                      >
                        +100 XP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SAAS TOOL PERMISSIONS MATRIX */}
      {activeTab === "permissions" && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">43 SaaS Tool Access Flags</h2>
              <p className="text-xs text-neutral-400">Control guest vs member gate permissions for each tool in real time.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkPermissions("open")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold hover:bg-emerald-500/20 transition"
              >
                Set All to Open
              </button>
              <button
                type="button"
                onClick={() => handleBulkPermissions("gated")}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold hover:bg-amber-500/20 transition"
              >
                Set All to Guest Gate
              </button>
              <button
                type="button"
                onClick={() => handleBulkPermissions("members_only")}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-mono hover:bg-neutral-700 transition"
              >
                Members Only
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {ALL_STUDIO_SLUGS.map((slug) => {
              const currentMode = permissions[slug]?.accessMode || "gated";
              return (
                <div key={slug} className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white capitalize">{slug.replace(/-/g, " ")}</span>
                    <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-400 uppercase font-mono">
                      {currentMode}
                    </span>
                  </div>

                  <select
                    value={currentMode}
                    onChange={(e) => handlePermChange(slug, e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200"
                  >
                    <option value="gated">Guest or Signup Gate (Default)</option>
                    <option value="open">Open (No Gate)</option>
                    <option value="members_only">Members Only</option>
                    <option value="maintenance">Maintenance Mode</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 24-HOUR SHARE LINKS INSPECTOR */}
      {activeTab === "shares" && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Live 24-Hour Ephemeral Shares ({shares.length})</h2>
          </div>

          {shares.length === 0 ? (
            <p className="text-xs text-neutral-500 py-8 text-center">No active share links currently live.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Token</th>
                    <th className="py-2.5 px-3">Title / Tool</th>
                    <th className="py-2.5 px-3">Creator</th>
                    <th className="py-2.5 px-3">Views</th>
                    <th className="py-2.5 px-3">Expires</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {shares.map((s) => (
                    <tr key={s.token} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        <Link href={`/s/${s.token}`} target="_blank" className="hover:underline">
                          {s.token}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{s.title}</div>
                        <div className="text-[11px] text-neutral-500">{s.toolSlug}</div>
                      </td>
                      <td className="py-3 px-3 text-neutral-300">{s.creatorName}</td>
                      <td className="py-3 px-3 font-mono text-neutral-400">{s.viewsCount}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-400">
                        {new Date(s.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleExtendShare(s.token)}
                          className="rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] px-2.5 py-1 font-medium border border-blue-500/30"
                        >
                          +24h
                        </button>
                        <button
                          onClick={() => handleRevokeShare(s.token)}
                          className="rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] px-2.5 py-1 font-medium border border-rose-500/30"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: WAF & THREAT CENTER */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Live Simulator */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Interactive WAF / SQLi Penetration Simulator</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Fire test attack vectors into the AST inspector to verify blocking policies in real time.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={simPayload}
                onChange={(e) => setSimPayload(e.target.value)}
                placeholder="Enter SQLi, XSS or traversal payload..."
                className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none font-mono"
              />
              <button
                onClick={handleSimulateThreat}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Attack</span>
              </button>
            </div>

            {simResult && (
              <div className={`rounded-xl p-3 text-xs font-mono border ${
                simResult.safe
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}>
                <div><strong>Status:</strong> {simResult.safe ? "✅ SAFE (Allowed)" : "🛡️ THREAT BLOCKED BY WAF"}</div>
                {simResult.threats?.length > 0 && <div><strong>Signatures:</strong> {simResult.threats.join(", ")}</div>}
                {simResult.threatType && <div><strong>Category:</strong> {simResult.threatType.toUpperCase()}</div>}
              </div>
            )}
          </div>

          {/* Threat Logs */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Blocked Security Threat Logs ({threatLogs.length})</h2>
              <button
                onClick={async () => {
                  await apiCall("threats_clear");
                  setThreatLogs([]);
                  sound.confirm();
                }}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Clear Log History
              </button>
            </div>

            {threatLogs.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">No threats logged yet. Shield is clean.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {threatLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.5 uppercase font-bold">
                        {log.threatType}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-sans">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-neutral-300 text-[11px] truncate">
                      <strong>Payload:</strong> {log.payloadSnippet}
                    </div>
                    <div className="text-neutral-500 text-[10px]">
                      Route: {log.route} • IP Hash: {log.ipHash}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: AUTONOMOUS OS BRAIN & POPULAR/NEW RANKER */}
      {activeTab === "autonomous" && (
        <div className="space-y-6">
          {/* OS Brain Overview Card */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Autonomous OS Brain Telemetry &amp; Curation Engine</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Controls the self-evolving engine powering sabbir.nav.bd news, hacks, tools, and vector cover generation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/os-brain"
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  Open Live Dashboard ↗
                </Link>
                <button
                  onClick={async () => {
                    sound.launch();
                    setActionMessage("Triggered autonomous discovery cycle across all feeds.");
                    await fetch("/api/os-brain", { method: "POST" }).catch(() => {});
                    setTimeout(() => setActionMessage(null), 3000);
                  }}
                  className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow"
                >
                  ⚡ Trigger Discovery Cycle
                </button>
              </div>
            </div>

            {/* Asset Status Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-500 uppercase font-mono block">Workplace Tools</span>
                <span className="text-xl font-bold font-mono text-amber-400">55 Active</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">46 Studios + 9 Utils</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-500 uppercase font-mono block">Domain Agents</span>
                <span className="text-xl font-bold font-mono text-emerald-400">24 Active</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Specialist Agents</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-500 uppercase font-mono block">Multi-Agent Swarms</span>
                <span className="text-xl font-bold font-mono text-purple-400">8 Pipelines</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Collaborative DAGs</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-500 uppercase font-mono block">Everyday Hacks</span>
                <span className="text-xl font-bold font-mono text-cyan-400">36 Curated</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">AI &amp; Linux Hacks</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-500 uppercase font-mono block">Embed Widgets</span>
                <span className="text-xl font-bold font-mono text-rose-400">8 Widgets</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Iframe Micro-SaaS</span>
              </div>
            </div>
          </div>

          {/* Micro-SaaS Embed Widget Impressions & Distribution */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>Micro-SaaS Embeddable Widgets Status (8 Active)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { name: "Bijoy to Unicode Bangla Converter", slug: "bijoy-converter", category: "Utilities" },
                { name: "BD Land & BAJUS Gold Sizer", slug: "land-gold-converter", category: "Utilities" },
                { name: "Family Budget & Authentic Zakat", slug: "zakat-calculator", category: "Finance" },
                { name: "SSC/HSC & University CGPA Solver", slug: "cgpa-calculator", category: "Education" },
                { name: "USD Remittance & 2.5% Incentive", slug: "remittance-calculator", category: "Finance" },
                { name: "BD Electricity Bill & IPS Solar Sizer", slug: "electricity-bill", category: "Utilities" },
                { name: "Exact Age & BCS 32y Cutoff Validator", slug: "age-calculator", category: "Health" },
                { name: "Sanchaypatra Profit & Loan EMI Planner", slug: "sanchaypatra-emi", category: "Finance" },
              ].map((w) => (
                <div key={w.slug} className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{w.name}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">/embed/{w.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      LIVE
                    </span>
                    <Link
                      href={`/tools/embed-widget-studio?widget=${w.slug}`}
                      className="text-neutral-400 hover:text-white"
                      title="Customize Widget"
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
