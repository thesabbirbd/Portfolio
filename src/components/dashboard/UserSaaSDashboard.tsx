"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Image as ImageIcon,
  Star,
  Trophy,
  Key,
  Download,
  Copy,
  Check,
  Share2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";
import { sound } from "@/lib/sound";
import {
  getImmortalIdentity,
  saveImmortalIdentity,
  authenticateWithBlankOrPassword,
  recoverAccountWithMobileCity,
  type ImmortalUserSession,
} from "@/lib/auth/immortal-identity";
import { listUserJobs, type JobTicket } from "@/lib/agents/input-to-action-dispatcher";

export function UserSaaSDashboard() {
  const [session, setSession] = useState<ImmortalUserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"jobs" | "shares" | "pinned" | "passport" | "security">("jobs");
  const [jobs, setJobs] = useState<JobTicket[]>([]);
  const [shares, setShares] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  // Security Form State
  const [enablePassword, setEnablePassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  // Load Immortal Session on Mount
  useEffect(() => {
    const s = getImmortalIdentity();
    setSession(s);
    if (s) {
      setEnablePassword(s.hasPassword);
      // Fetch user jobs
      fetchUserJobs(s.id);
      fetchUserShares();
    }
  }, []);

  const fetchUserJobs = async (userId: string) => {
    try {
      const res = await fetch(`/api/jobs/dispatch?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      } else {
        // Fallback to local memory list
        setJobs(listUserJobs(userId));
      }
    } catch {
      setJobs(listUserJobs(userId));
    }
  };

  const fetchUserShares = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("sabbir_os_my_shares");
        if (stored) {
          setShares(JSON.parse(stored));
        }
      } catch {
        setShares([]);
      }
    }
  };

  const handleCopyLink = (token: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/s/${token}`;
      navigator.clipboard.writeText(url);
      setCopiedId(token);
      sound.copy();
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownloadArtifact = (job: JobTicket) => {
    if (!job.artifact) return;
    sound.shutter();

    const blob = new Blob([job.artifact.content || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = job.artifact.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    sound.click();
    setIsUpdatingSecurity(true);
    setSecuritySuccess(null);

    try {
      const updatedSession: ImmortalUserSession = {
        ...session,
        hasPassword: enablePassword,
        phone: phoneInput || session.phone,
        city: cityInput || session.city,
      };

      saveImmortalIdentity(updatedSession);
      setSession(updatedSession);
      setSecuritySuccess("লগইন ও রিকভারি সেটিংস সফলভাবে আপডেট হয়েছে!");
      sound.complete();
    } catch (err: any) {
      alert("Error saving settings");
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleDownloadPassport = () => {
    sound.shutter();
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, 1200, 630);

    // Frame
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1120, 550);

    // Header
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 24px monospace";
    ctx.fillText("THE SABBiR OS // CAREER PASSPORT", 80, 110);

    // User details
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText(session?.handle || "THE SABBiR CITIZEN", 80, 200);

    ctx.fillStyle = "#A1A1AA";
    ctx.font = "24px sans-serif";
    ctx.fillText(`Guest ID: ${session?.guestIdMasked || "SB-4829"} · Rank: ${session?.role || "Explorer"}`, 80, 250);
    ctx.fillText(`Total XP: ${session?.xp || 250} · Verified Local-First Identity`, 80, 290);

    // Footer Watermark
    ctx.fillStyle = "#71717A";
    ctx.font = "16px monospace";
    ctx.fillText("Issued by THE SABBiR OS (sabbir.nav.bd) · Zero-Knowledge Cryptographic Passport", 80, 530);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `career-passport-${session?.handle || "user"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 my-8 px-4 sm:px-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl font-mono">
            {session?.handle?.slice(0, 2).toUpperCase() || "SB"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {session?.handle || "অতিথি ব্যবহারকারী (Guest)"}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                {session?.guestIdMasked || "SB-4829"}
              </span>
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
              <span>{session?.role || "পাওয়ার ইউজার"}</span>
              <span>•</span>
              <span className="text-amber-400 font-mono font-bold">⚡ {session?.xp || 250} XP</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {session?.hasPassword ? "পাসওয়ার্ড সুরক্ষিত" : "পাসওয়ার্ডবিহীন (Blank-Password)"}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/agents"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>নতুন এজেন্ট জব</span>
          </Link>
          <Link
            href="/tools"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            <span>৬৪ টি টুলস</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 5-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
        {[
          { id: "jobs", label: "⚡ My Agent Jobs", bangla: "ইনপুট-টু-অ্যাকশন জবস", icon: Zap },
          { id: "shares", label: "🖼️ My Visual Shares", bangla: "ভিজ্যুয়াল শেয়ার কার্ড", icon: ImageIcon },
          { id: "pinned", label: "⭐ Pinned Workspace", bangla: "পিন করা টুলস", icon: Star },
          { id: "passport", label: "🏆 XP & Career Passport", bangla: "পাসপোর্ট ও র‍্যাংক", icon: Trophy },
          { id: "security", label: "🔑 Login & Security", bangla: "পাসওয়ার্ড ও রিকভারি", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                sound.click();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-neutral-800/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: My Agent Jobs */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>আমার সাবমিট করা এজেন্ট জব তালিকা ({jobs.length})</span>
            </h3>
            <button
              onClick={() => session && fetchUserJobs(session.id)}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3 h-3" /> রিফ্রেশ
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">এখনো কোনো এজেন্ট জব চালানো হয়নি</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  ১৫টি ইনপুট-টু-অ্যাকশন এজেন্টের যেকোনোটিতে ফাইল বা টেক্সট পাঠিয়ে কাজ করান।
                </p>
              </div>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors"
              >
                <span>এজেন্ট স্টুডিও ওপেন করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-neutral-700"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{job.id}</span>
                      <span className="text-xs font-bold text-white">{job.agentName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          job.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono line-clamp-1">{job.inputPayload}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {job.completedAt ? new Date(job.completedAt).toLocaleTimeString() : "In Progress"} •{" "}
                      {job.durationMs ? `${job.durationMs}ms` : ""}
                    </p>
                  </div>

                  {job.artifact && (
                    <button
                      onClick={() => handleDownloadArtifact(job)}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{job.artifact.filename} ({job.artifact.sizeBytes} B)</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Visual Shares */}
      {activeTab === "shares" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>আমার অ্যাক্টিভ ভিজ্যুয়াল শেয়ার কার্ড ({shares.length})</span>
            </h3>
            <span className="text-xs text-neutral-500 font-mono">২৪ ঘণ্টা পর স্বয়ংক্রিয়ভাবে মুছে যায়</span>
          </div>

          {shares.length === 0 ? (
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs text-neutral-400">কোনো অ্যাক্টিভ শেয়ার নেই। যেকোনো স্টুডিওতে শেয়ার বাটন চাপুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shares.map((share, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 font-bold">{share.token}</span>
                    <span className="text-neutral-500 text-[11px]">24h Active</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{share.title || "Studio Snapshot"}</h4>
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                    <Link
                      href={`/s/${share.token}`}
                      target="_blank"
                      className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold text-center flex items-center justify-center gap-1"
                    >
                      <span>ভিউ কার্ড</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => handleCopyLink(share.token)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    >
                      {copiedId === share.token ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Pinned Workspace */}
      {activeTab === "pinned" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>পিন করা দ্রুত লঞ্চপ্যাড (Quick Launch Studios)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { slug: "mess-bazar-splitter", name: "মেস বাজার ও মিল রেট", icon: "Utensils" },
              { slug: "image-format-converter", name: "মাল্টি-ফরম্যাট ইমেজ কনভার্টার", icon: "Image" },
              { slug: "marriage-biodata-maker", name: "ম্যারেজ বায়োডাটা মেকার", icon: "Heart" },
              { slug: "bd-emergency-courier-tracker", name: "কুরিয়ার ও হেল্পলাইন হাব", icon: "Truck" },
              { slug: "prescription-health-pad", name: "ডাক্তার প্রেসক্রিপশন প্যাড", icon: "Activity" },
              { slug: "school-result-id-studio", name: "স্কুল রেজাল্ট ও আইডি কার্ড", icon: "GraduationCap" },
              { slug: "tailor-boutique-memo", name: "দর্জি মাপ খাতা ও মেমো", icon: "Scissors" },
              { slug: "freelancer-proposal-contract", name: "ফ্রিল্যান্সার প্রপোজাল চুক্তি", icon: "FileText" },
            ].map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="p-4 rounded-2xl border border-neutral-800 bg-neutral-950/80 hover:border-amber-500/50 hover:bg-neutral-900 transition-all space-y-2 group"
              >
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                  ★
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-[10px] font-mono text-neutral-500">/tools/{tool.slug}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: XP Career Passport */}
      {activeTab === "passport" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">CRYPTOGRAPHIC IDENTITY</span>
                <h3 className="text-xl font-bold text-white">THE SABBiR OS ক্যারিয়ার পাসপোর্ট</h3>
                <p className="text-xs text-neutral-400">লোকাল-ফার্স্ট প্রুফ-অব-ওয়ার্ক ও এক্সপি অর্জনের সার্টিফিকেট</p>
              </div>
              <button
                onClick={handleDownloadPassport}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>পাসপোর্ট ইমেজ ডাউনলোড (PNG)</span>
              </button>
            </div>

            {/* Visual Passport Mockup */}
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400">PASSPORT // BD-OS-2026</span>
                <span className="text-xs font-mono text-neutral-400">{session?.guestIdMasked || "SB-4829"}</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white">{session?.handle || "THE SABBiR CITIZEN"}</h2>
                <p className="text-xs font-mono text-neutral-400">Status: Verified Citizen · Role: {session?.role || "Power User"}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500">TOTAL XP</span>
                  <p className="text-sm font-mono font-bold text-amber-400">⚡ {session?.xp || 250}</p>
                </div>
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500">SECURITY</span>
                  <p className="text-sm font-mono font-bold text-emerald-400">
                    {session?.hasPassword ? "Password" : "Blank-PW"}
                  </p>
                </div>
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500">COMMITS</span>
                  <p className="text-sm font-mono font-bold text-sky-400">100% Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Login & Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>ব্ল্যাঙ্ক-পাসওয়ার্ড ও একাউন্ট রিকভারি সেটিংস</span>
              </h3>
              <p className="text-xs text-neutral-400">
                পাসওয়ার্ডবিহীন আজীবন লগইন অথবা পাসওয়ার্ড দিয়ে প্রোটেক্ট করার অপশন।
              </p>
            </div>

            {securitySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{securitySuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecuritySettings} className="space-y-4 max-w-md">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    {enablePassword ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{enablePassword ? "পাসওয়ার্ড দিয়ে সুরক্ষিত রাখুন" : "পাসওয়ার্ডবিহীন ব্ল্যাঙ্ক লগইন মোড"}</span>
                  </label>
                  <p className="text-[11px] text-neutral-400">
                    {enablePassword ? "লগইন করতে পাসওয়ার্ড লাগবে" : "পাসওয়ার্ড বক্স ফাঁকা রেখেই লগইন হবে"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {enablePassword && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড..."
                    className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">রিকভারি মোবাইল নম্বর (ঐচ্ছিক)</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="017... (পাসওয়ার্ড ভুলে গেলে লাগবে)"
                  className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">রিকভারি শহর (City Name)</label>
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="যেমন: Rajshahi বা Dhaka"
                  className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingSecurity}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors cursor-pointer"
              >
                <span>সেটিংস সেভ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
