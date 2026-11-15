"use client";

import React, { useState } from "react";
import {
  Clock,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Server,
  Calendar,
  Layers,
  ArrowRight,
  Bot,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

interface CronPreset {
  phrase: string;
  cron: string;
  desc: string;
  systemdOnCalendar: string;
}

export function PlainEnglishCronStudio() {
  const presets: CronPreset[] = [
    {
      phrase: "Every Friday at 3:00 AM",
      cron: "0 3 * * 5",
      desc: "At 03:00 AM, only on Friday",
      systemdOnCalendar: "Fri *-*-* 03:00:00",
    },
    {
      phrase: "Every 15 minutes during office hours (9 AM - 6 PM, Mon-Fri)",
      cron: "*/15 9-18 * * 1-5",
      desc: "Every 15 minutes, between 09:00 AM and 06:59 PM, Monday through Friday",
      systemdOnCalendar: "Mon..Fri *-*-* 09..18:00/15:00",
    },
    {
      phrase: "Every midnight (00:00)",
      cron: "0 0 * * *",
      desc: "At 12:00 AM (midnight), every day",
      systemdOnCalendar: "*-*-* 00:00:00",
    },
    {
      phrase: "Every 5 minutes",
      cron: "*/5 * * * *",
      desc: "Every 5 minutes, 24/7",
      systemdOnCalendar: "*:00/5",
    },
    {
      phrase: "First day of every month at midnight",
      cron: "0 0 1 * *",
      desc: "At 12:00 AM, on day 1 of every month",
      systemdOnCalendar: "*-*-01 00:00:00",
    },
    {
      phrase: "Every 30 minutes on weekends",
      cron: "*/30 * * * 0,6",
      desc: "Every 30 minutes, only on Saturday and Sunday",
      systemdOnCalendar: "Sat,Sun *-*-* *:00/30",
    },
  ];

  const [inputPhrase, setInputPhrase] = useState(presets[0].phrase);
  const [cronExpression, setCronExpression] = useState(presets[0].cron);
  const [description, setDescription] = useState(presets[0].desc);
  const [systemdCalendar, setSystemdCalendar] = useState(presets[0].systemdOnCalendar);
  const [serviceName, setServiceName] = useState("db-backup");
  const [command, setCommand] = useState("/usr/local/bin/backup-postgres.sh");
  const [activeTab, setActiveTab] = useState<"crontab" | "systemd-timer" | "systemd-service">("crontab");
  const [copied, setCopied] = useState(false);

  // Parse natural English to Cron
  const parseNaturalPhrase = (text: string) => {
    setInputPhrase(text);
    const lower = text.toLowerCase();

    // Check exact match in presets
    const match = presets.find((p) => p.phrase.toLowerCase() === lower);
    if (match) {
      setCronExpression(match.cron);
      setDescription(match.desc);
      setSystemdCalendar(match.systemdOnCalendar);
      return;
    }

    if (lower.includes("every 5 min") || lower.includes("5 minutes")) {
      setCronExpression("*/5 * * * *");
      setDescription("Every 5 minutes, every day");
      setSystemdCalendar("*:00/5");
    } else if (lower.includes("every 10 min")) {
      setCronExpression("*/10 * * * *");
      setDescription("Every 10 minutes, every day");
      setSystemdCalendar("*:00/10");
    } else if (lower.includes("every 15 min")) {
      setCronExpression("*/15 * * * *");
      setDescription("Every 15 minutes, every day");
      setSystemdCalendar("*:00/15");
    } else if (lower.includes("every hour") || lower.includes("hourly")) {
      setCronExpression("0 * * * *");
      setDescription("At minute 0 of every hour");
      setSystemdCalendar("hourly");
    } else if (lower.includes("midnight") || lower.includes("daily")) {
      setCronExpression("0 0 * * *");
      setDescription("At 12:00 AM (midnight), every day");
      setSystemdCalendar("daily");
    } else if (lower.includes("friday") && lower.includes("3 am")) {
      setCronExpression("0 3 * * 5");
      setDescription("At 03:00 AM, only on Friday");
      setSystemdCalendar("Fri *-*-* 03:00:00");
    } else if (lower.includes("sunday")) {
      setCronExpression("0 2 * * 0");
      setDescription("At 02:00 AM, only on Sunday");
      setSystemdCalendar("Sun *-*-* 02:00:00");
    } else if (lower.includes("month")) {
      setCronExpression("0 0 1 * *");
      setDescription("At 12:00 AM on day 1 of every month");
      setSystemdCalendar("monthly");
    } else {
      // Default fallback
      setCronExpression("0 4 * * *");
      setDescription("At 04:00 AM, every day (Custom fallback)");
      setSystemdCalendar("*-*-* 04:00:00");
    }
  };

  const cronParts = cronExpression.split(" ");
  const cronFields = [
    { name: "Minute", val: cronParts[0] || "*", range: "0-59" },
    { name: "Hour", val: cronParts[1] || "*", range: "0-23" },
    { name: "Day of Month", val: cronParts[2] || "*", range: "1-31" },
    { name: "Month", val: cronParts[3] || "*", range: "1-12" },
    { name: "Day of Week", val: cronParts[4] || "*", range: "0-7 (0=Sun)" },
  ];

  // Calculate simulated next 5 run times
  const nextRuns = [
    "Today at 03:00:00 AM BST",
    "Next Friday at 03:00:00 AM BST",
    "Following Friday at 03:00:00 AM BST",
    "3rd Friday at 03:00:00 AM BST",
    "4th Friday at 03:00:00 AM BST",
  ];

  const systemdTimerUnit = `[Unit]
Description=Timer for ${serviceName} service
Requires=${serviceName}.service

[Timer]
Unit=${serviceName}.service
OnCalendar=${systemdCalendar}
Persistent=true

[Install]
WantedBy=timers.target`;

  const systemdServiceUnit = `[Unit]
Description=Job execution for ${serviceName}
After=network.target

[Service]
Type=oneshot
User=thesabbir
ExecStart=${command}
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`;

  const crontabLine = `${cronExpression} ${command} >> /var/log/${serviceName}.log 2>&1`;

  const getActiveCode = () => {
    if (activeTab === "crontab") return crontabLine;
    if (activeTab === "systemd-timer") return systemdTimerUnit;
    return systemdServiceUnit;
  };

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    osStore.addXp(20, "Generated Cron & Systemd Timer");
    osStore.incrementToolRun();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Plain-English to Cron & Systemd Timer
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  SecOps Guardian
                </span>
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                সাধারণ বাক্য থেকে লিনাক্স ক্রন এক্সপ্রেশন ও আধুনিক systemd.timer ইউনিট ফাইল স্বয়ংক্রিয়ভাবে তৈরি করুন
              </p>
            </div>
          </div>

          <a
            href="/agents?agent=secops-guardian"
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            Open SecOps Agent
          </a>
        </div>

        {/* Preset Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.toggleSwitch();
                setInputPhrase(p.phrase);
                setCronExpression(p.cron);
                setDescription(p.desc);
                setSystemdCalendar(p.systemdOnCalendar);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors"
            >
              {p.phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Breakdown */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <label className="text-xs font-medium text-neutral-400 block">
              Type Schedule in Plain English or Banglish
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputPhrase}
                onChange={(e) => parseNaturalPhrase(e.target.value)}
                placeholder="e.g. Every Friday at 3:00 AM"
                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-sm font-medium"
              />
            </div>

            {/* Generated Cron Expression Display */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Cron Expression</span>
                <span className="text-emerald-400 font-medium">{description}</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white tracking-widest text-center py-2 bg-neutral-900/50 rounded-lg border border-neutral-800/80">
                {cronExpression}
              </div>
            </div>

            {/* Field breakdown 5 boxes */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {cronFields.map((field, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                  <div className="text-base font-mono font-bold text-emerald-400">{field.val}</div>
                  <div className="text-[10px] text-neutral-300 font-medium mt-1 truncate">{field.name}</div>
                  <div className="text-[9px] text-neutral-500 font-mono">{field.range}</div>
                </div>
              ))}
            </div>

            {/* Service & Command Params */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400 font-medium">Service / Job Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400 font-medium">Executable Path / Command</label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Projected Execution Schedule */}
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
            <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Simulated Next 5 Run Times
            </h4>
            <div className="space-y-1.5">
              {nextRuns.map((run, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-neutral-400 font-mono px-2 py-1 rounded bg-neutral-950/40">
                  <span className="text-neutral-500">Run #{idx + 1}</span>
                  <span className="text-neutral-200">{run}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code Generation Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  onClick={() => setActiveTab("crontab")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                    activeTab === "crontab"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Crontab
                </button>
                <button
                  onClick={() => setActiveTab("systemd-timer")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                    activeTab === "systemd-timer"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  .timer
                </button>
                <button
                  onClick={() => setActiveTab("systemd-service")}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                    activeTab === "systemd-service"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  .service
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy File"}
              </button>
            </div>

            {/* Target file location indicator */}
            <div className="text-[11px] font-mono text-neutral-500">
              {activeTab === "crontab" && "Append to crontab via: crontab -e"}
              {activeTab === "systemd-timer" && `/etc/systemd/system/${serviceName}.timer`}
              {activeTab === "systemd-service" && `/etc/systemd/system/${serviceName}.service`}
            </div>

            {/* Code Output block */}
            <div className="flex-1 min-h-[260px] relative">
              <pre className="w-full h-full p-4 rounded-xl bg-neutral-950 font-mono text-xs text-neutral-200 border border-neutral-800 overflow-x-auto leading-relaxed select-all">
                {getActiveCode()}
              </pre>
            </div>

            {/* Quick Linux activation commands */}
            {activeTab !== "crontab" && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-neutral-500"># To activate in systemd:</div>
                <div className="text-emerald-400">sudo systemctl daemon-reload</div>
                <div className="text-emerald-400">sudo systemctl enable --now {serviceName}.timer</div>
                <div className="text-emerald-400">systemctl list-timers</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
