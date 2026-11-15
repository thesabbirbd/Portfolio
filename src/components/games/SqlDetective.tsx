"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Database,
  ShieldAlert,
  Terminal,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  UserCheck,
  FileSearch,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import type { ScorecardData } from "@/lib/scorecard-canvas";

export interface SqlDetectiveProps {
  onComplete?: (data: ScorecardData) => void;
}

interface LogEntry {
  [key: string]: string | number;
}

// Database tables for the Rajshahi Server Heist investigation
const CRIME_SCENE_REPORT: LogEntry[] = [
  {
    incident_id: "INC-2026-0315",
    timestamp: "2026-11-14 03:15:00 UTC",
    location: "Rajshahi Regional Medical Supply Hub",
    summary: "At 03:15 AM, an unauthorized SQL dump exported 45,000 patient pharmacy records. The perpetrator accessed via VPN and triggered an internal DB replica query.",
    clue: "Security guard reports only 3 individuals checked into the physical server room or had active remote VPN tokens between 02:45 AM and 03:30 AM.",
  },
];

const VPN_ACCESS_LOGS: LogEntry[] = [
  { session_id: "VPN-8801", user_handle: "dev_tanvir", ip_address: "103.205.180.42", login_time: "2026-11-14 01:10:00", logout_time: "2026-11-14 02:20:00", client_device: "MacBook Pro" },
  { session_id: "VPN-8802", user_handle: "sec_farhan", ip_address: "103.205.180.99", login_time: "2026-11-14 02:50:12", logout_time: "2026-11-14 03:45:00", client_device: "ThinkPad X1 Linux" },
  { session_id: "VPN-8803", user_handle: "admin_nasir", ip_address: "182.160.112.14", login_time: "2026-11-14 03:02:40", logout_time: "2026-11-14 03:22:15", client_device: "Kali Linux / OpenVPN" },
  { session_id: "VPN-8804", user_handle: "intern_shuvo", ip_address: "103.48.16.5", login_time: "2026-11-14 04:00:00", logout_time: "2026-11-14 04:30:00", client_device: "Windows 11" },
];

const BADGE_CHECKINS: LogEntry[] = [
  { badge_id: "BDG-104", employee_name: "Farhan Ahmed (Security Lead)", room: "Server Room B", checkin_time: "02:48:00", verified_biometric: "YES" },
  { badge_id: "BDG-209", employee_name: "Nasir Uddin (External DBA Contractor)", room: "Remote VPN Token", checkin_time: "03:00:10", verified_biometric: "NO (Token Overridden)" },
  { badge_id: "BDG-312", employee_name: "Tanvir Hossain (Frontend Dev)", room: "Office Cafeteria", checkin_time: "01:05:00", verified_biometric: "YES" },
];

const DB_QUERY_HISTORY: LogEntry[] = [
  { query_id: "QRY-901", user_handle: "sec_farhan", query_text: "SELECT * FROM system_health WHERE status != 'OK';", execution_time: "02:55:10", rows_returned: 0 },
  { query_id: "QRY-902", user_handle: "admin_nasir", query_text: "COPY (SELECT * FROM patient_prescriptions) TO '/tmp/dump_2026.sql';", execution_time: "03:14:48", rows_returned: 45000 },
  { query_id: "QRY-903", user_handle: "admin_nasir", query_text: "TRUNCATE audit_query_logs; -- Attempt to wipe traces", execution_time: "03:17:02", rows_returned: 0 },
  { query_id: "QRY-904", user_handle: "sec_farhan", query_text: "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';", execution_time: "03:25:00", rows_returned: 1 },
];

const SUSPECTS = [
  { id: "dev_tanvir", name: "Tanvir Hossain", role: "Frontend Dev", isCulprit: false, motive: "Logged out before the heist took place." },
  { id: "sec_farhan", name: "Farhan Ahmed", role: "Security Lead", isCulprit: false, motive: "Ran health monitoring checks during the incident, did not touch patient tables." },
  { id: "admin_nasir", name: "Nasir Uddin", role: "External DBA Contractor", isCulprit: true, motive: "Logged in via Kali Linux at 03:02 AM, executed unauthorized COPY dump of 45,000 records at 03:14:48 AM, and attempted to truncate logs!" },
  { id: "intern_shuvo", name: "Shuvo Paul", role: "Junior Intern", isCulprit: false, motive: "Logged in at 04:00 AM, long after the incident had completed." },
];

export function SqlDetective({ onComplete }: SqlDetectiveProps) {
  const [activeTable, setActiveTable] = useState<string>("crime_scene_report");
  const [activeResults, setActiveResults] = useState<LogEntry[]>(CRIME_SCENE_REPORT);
  const [customSql, setCustomSql] = useState<string>("SELECT * FROM crime_scene_report;");
  const [investigationLog, setInvestigationLog] = useState<string[]>([
    "🔍 System Incident INC-2026-0315 initialized.",
    "Objective: Query the tables below, cross-reference timestamps, and accuse the true perpetrator.",
  ]);
  const [score, setScore] = useState(1000);
  const [startTime] = useState<number>(() => Date.now());
  const [solved, setSolved] = useState(false);
  const [accusationResult, setAccusationResult] = useState<string | null>(null);

  const executePreset = (tableKey: string, queryStr: string, filterFn?: (item: LogEntry) => boolean) => {
    sound.click();
    setActiveTable(tableKey);
    setCustomSql(queryStr);

    let rawData: LogEntry[] = [];
    if (tableKey === "crime_scene_report") rawData = CRIME_SCENE_REPORT;
    else if (tableKey === "vpn_access_logs") rawData = VPN_ACCESS_LOGS;
    else if (tableKey === "badge_checkins") rawData = BADGE_CHECKINS;
    else if (tableKey === "db_query_history") rawData = DB_QUERY_HISTORY;

    const filtered = filterFn ? rawData.filter(filterFn) : rawData;
    setActiveResults(filtered);
    sound.terminalSubmit();

    setInvestigationLog((prev) => [
      ...prev,
      `$ ${queryStr} -> Returned ${filtered.length} row(s)`,
    ]);
  };

  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const q = customSql.toLowerCase().trim();
    sound.terminalSubmit();

    if (q.includes("vpn")) {
      executePreset("vpn_access_logs", customSql);
    } else if (q.includes("badge")) {
      executePreset("badge_checkins", customSql);
    } else if (q.includes("query") || q.includes("history")) {
      executePreset("db_query_history", customSql);
    } else {
      executePreset("crime_scene_report", customSql);
    }
  };

  const handleAccuse = (suspectId: string) => {
    sound.click();
    const suspect = SUSPECTS.find((s) => s.id === suspectId);
    if (!suspect) return;

    if (suspect.isCulprit) {
      sound.levelUp();
      setSolved(true);
      const elapsedSec = Math.round((Date.now() - startTime) / 1000);
      const finalScore = Math.max(2500, 6000 - elapsedSec * 15);
      setScore(finalScore);
      setAccusationResult(`CASE SOLVED! Perpetrator identified as ${suspect.name} (${suspect.role}). Motive: ${suspect.motive}`);

      osStore.unlockBadge("sql-detective");

      if (onComplete) {
        setTimeout(() => {
          onComplete({
            gameId: "sql-detective",
            gameTitle: "SQL Detective: The Rajshahi Server Heist",
            playerHandle: osStore.getState().handle,
            score: finalScore,
            rankTier: finalScore >= 4500 ? "S-Tier // Kernel Master" : "SQL Architect",
            accuracyPct: 100,
            timeTakenSeconds: elapsedSec,
            xpEarned: Math.round(finalScore * 0.1),
          });
        }, 800);
      }
    } else {
      sound.error();
      setScore((s) => Math.max(500, s - 600));
      setAccusationResult(`WRONG ACCUSATION! ${suspect.name} has a verified alibi: ${suspect.motive} (-600 PTS)`);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-surface/90 shadow-xl overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-line">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs font-semibold text-ink">
            SQL Detective // The Rajshahi Server Heist
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
            Mystery CTF
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} PTS</span>
          </div>
        </div>
      </div>

      {/* Main Investigation Arena */}
      <div className="p-4 sm:p-5 space-y-5 bg-zinc-950 text-zinc-200">
        {/* Crime Brief */}
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-primary font-bold font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>INCIDENT BRIEF: 03:15 AM CLOUD EXFILTRATION</span>
          </div>
          <p className="text-zinc-300 leading-relaxed font-sans">
            Someone extracted 45,000 pharmacy records. Query the 4 database tables below to inspect VPN sessions, physical badge check-ins, and the SQL query log between 02:45 AM and 03:30 AM to catch the true culprit.
          </p>
        </div>

        {/* Query Presets Toolbar */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Investigation SQL Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => executePreset("crime_scene_report", "SELECT * FROM crime_scene_report;")}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition ${
                activeTable === "crime_scene_report"
                  ? "bg-primary text-white border-primary font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              1. Crime Scene Report
            </button>
            <button
              onClick={() =>
                executePreset(
                  "vpn_access_logs",
                  "SELECT user_handle, ip_address, login_time, client_device FROM vpn_access_logs WHERE login_time >= '02:45:00' AND login_time <= '03:30:00';"
                )
              }
              className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition ${
                activeTable === "vpn_access_logs"
                  ? "bg-primary text-white border-primary font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              2. Filter VPN Logs (02:45 - 03:30)
            </button>
            <button
              onClick={() => executePreset("badge_checkins", "SELECT * FROM badge_checkins;")}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition ${
                activeTable === "badge_checkins"
                  ? "bg-primary text-white border-primary font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              3. Check Badge Entries
            </button>
            <button
              onClick={() =>
                executePreset(
                  "db_query_history",
                  "SELECT * FROM db_query_history WHERE rows_returned > 1000 OR query_text LIKE '%COPY%';"
                )
              }
              className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition ${
                activeTable === "db_query_history"
                  ? "bg-primary text-white border-primary font-bold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              4. Audit Large DUMP Queries
            </button>
          </div>
        </div>

        {/* Custom SQL Bar */}
        <form onSubmit={handleCustomQuery} className="flex gap-2">
          <input
            type="text"
            value={customSql}
            onChange={(e) => setCustomSql(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200 outline-none focus:border-primary"
            placeholder="Write custom SQL: SELECT * FROM ... WHERE ..."
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run
          </button>
        </form>

        {/* SQL Results Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="p-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Result Set: {activeTable}</span>
            <span>{activeResults.length} records returned</span>
          </div>
          <div className="overflow-x-auto max-h-56">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                <tr>
                  {activeResults.length > 0 &&
                    Object.keys(activeResults[0]).map((col) => (
                      <th key={col} className="p-2.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {activeResults.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/40">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="p-2.5 whitespace-nowrap text-zinc-300">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Suspect Lineup & Accusation */}
        <div className="pt-3 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-primary" />
              Suspect Lineup — Accuse the Culprit:
            </span>
            {solved && (
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Case Closed!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUSPECTS.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-between gap-3 hover:border-primary/50 transition"
              >
                <div>
                  <div className="font-bold text-xs text-white">{s.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{s.role} (@{s.id})</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAccuse(s.id)}
                  disabled={solved}
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition disabled:opacity-40"
                >
                  Accuse
                </button>
              </div>
            ))}
          </div>

          {accusationResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono ${
                solved
                  ? "bg-emerald-950/70 border-emerald-500 text-emerald-200"
                  : "bg-red-950/70 border-red-500 text-red-200"
              }`}
            >
              {accusationResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
