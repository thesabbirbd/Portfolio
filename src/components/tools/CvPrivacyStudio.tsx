"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Lock,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

const DEMO_RESUME = `Md Tanvir Hasan
Full-Stack Software Engineer
Phone: +8801711223344 | Email: tanvir.hasan@example.com
NID: 19942691523456789 | Date of Birth: 14-Aug-1994
Present Address: House 24, Road 4, Sector 7, Uttara, Dhaka 1230

PROFESSIONAL SUMMARY
Results-driven software engineer with 4+ years of experience building high-scale web applications, microservices, and POS systems.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, Bash
Frontend: Next.js, React, Tailwind CSS, Redux, WebSockets
Backend: Node.js, Express, PostgreSQL, Redis, Docker, Nginx, REST APIs

EXPERIENCE
Software Engineer — TechCorp Dhaka (2022 - Present)
- Engineered high-throughput checkout APIs using Node.js and PostgreSQL, serving 50k daily active users.
- Containerized microservices using Docker and orchestrated multi-stage builds.
- Integrated automated testing with Vitest and CI/CD pipelines.

REFERENCES
Available upon request.`;

const DEMO_JOB_DESC = `We are looking for a Senior Full-Stack Engineer with strong experience in:
- TypeScript, Next.js, and modern React architectures
- PostgreSQL database schema design, index optimization, and Redis caching
- Docker containerization, Kubernetes, and Linux server hardening
- WebSockets, GraphQL, and microservice resiliency
- Excellent communication and system architecture problem-solving skills.`;

export function CvPrivacyStudio() {
  const [resumeText, setResumeText] = useState(DEMO_RESUME);
  const [jobDescText, setJobDescText] = useState(DEMO_JOB_DESC);
  const [isCopied, setIsCopied] = useState(false);

  // ATS Keyword Extraction & Scoring Engine
  const atsAnalysis = useMemo(() => {
    const commonKeywords = [
      "typescript", "javascript", "python", "sql", "postgresql", "redis",
      "next.js", "react", "tailwind", "docker", "kubernetes", "nginx",
      "websockets", "graphql", "rest", "ci/cd", "vitest", "microservices",
      "caching", "linux", "aws", "architecture"
    ];

    const lowerResume = resumeText.toLowerCase();
    const lowerJob = jobDescText.toLowerCase();

    const targetKeywords = commonKeywords.filter((k) => lowerJob.includes(k));
    const matched = targetKeywords.filter((k) => lowerResume.includes(k));
    const missing = targetKeywords.filter((k) => !lowerResume.includes(k));

    const score = targetKeywords.length > 0 ? Math.round((matched.length / targetKeywords.length) * 100) : 85;

    return {
      score,
      matched,
      missing,
      totalTracked: targetKeywords.length,
    };
  }, [resumeText, jobDescText]);

  // Privacy Scrubber: Removes Phone, NID, Address, DOB
  const sanitizedPublicCv = useMemo(() => {
    let clean = resumeText;
    // Scrub phone
    clean = clean.replace(/(\+?8801|01)[3-9]\d{8}/g, "[PHONE_REDACTED_FOR_PRIVACY]");
    // Scrub NID
    clean = clean.replace(/\b\d{10,17}\b/g, "[NID_REDACTED]");
    // Scrub DOB
    clean = clean.replace(/Date of Birth:.*$/gim, "Date of Birth: [CONFIDENTIAL]");
    // Scrub exact address
    clean = clean.replace(/Present Address:.*$/gim, "Location: Dhaka, Bangladesh (Public View)");
    return clean;
  }, [resumeText]);

  const handleCopyCleaned = async () => {
    sound.copy();
    await navigator.clipboard.writeText(sanitizedPublicCv);
    setIsCopied(true);
    osStore.addXp(20, "Copied Privacy-Cleaned CV");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadCleaned = () => {
    sound.shutter();
    osStore.addXp(30, "Exported Privacy-Cleaned CV");
    osStore.incrementToolRun();

    const blob = new Blob([sanitizedPublicCv], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `public-safe-resume-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Public CV Privacy Cleaner &amp; ATS Keyword Matcher
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            0-100% ATS Keyword Scorer • Missing Skill Identifier • Phone/NID/Address Auto-Scrubber for LinkedIn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCleaned}
            className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? "Copied" : "Copy Clean CV"}</span>
          </button>
          <button
            onClick={handleDownloadCleaned}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Public-Safe Markdown</span>
          </button>
        </div>
      </div>

      {/* ATS Score & Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
        <div className="p-3 rounded-xl bg-surface border border-line flex items-center justify-between">
          <div>
            <span className="text-[10px] text-ink-3 block">ATS Match Score</span>
            <span className="text-xl font-bold text-ink">{atsAnalysis.score}%</span>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
              atsAnalysis.score >= 80
                ? "bg-emerald-500/10 text-emerald-600"
                : atsAnalysis.score >= 60
                ? "bg-amber-500/10 text-amber-600"
                : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {atsAnalysis.score >= 80 ? "High Match" : atsAnalysis.score >= 60 ? "Moderate" : "Needs Keywords"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-line space-y-1">
          <span className="text-[10px] text-emerald-600 font-bold block">
            Matched Skills ({atsAnalysis.matched.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {atsAnalysis.matched.slice(0, 6).map((m, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px]">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-line space-y-1">
          <span className="text-[10px] text-rose-500 font-bold block">
            Missing ATS Keywords ({atsAnalysis.missing.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {atsAnalysis.missing.length > 0 ? (
              atsAnalysis.missing.map((m, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px]">
                  {m}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-ink-3">All critical keywords present!</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Dual Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-mono">
        <div className="lg:col-span-6 space-y-2">
          <span className="font-bold text-ink uppercase block">Target Job Description:</span>
          <textarea
            rows={10}
            value={jobDescText}
            onChange={(e) => setJobDescText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-surface border border-line text-ink leading-relaxed font-mono"
            placeholder="Paste target job description here..."
          />
        </div>

        <div className="lg:col-span-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-emerald-600 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Public-Safe Sanitized Resume:
            </span>
            <span className="text-[10px] text-ink-3">Protected against phone/address scraping</span>
          </div>
          <div className="w-full p-4 rounded-2xl bg-muted/10 border border-line text-ink leading-relaxed whitespace-pre-wrap h-[216px] overflow-y-auto">
            {sanitizedPublicCv}
          </div>
        </div>
      </div>
    </div>
  );
}
