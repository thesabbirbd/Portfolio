"use client";

import React, { useMemo, useState } from "react";
import {
  Network,
  KeyRound,
  Binary,
  Braces,
  Clock,
  Database,
  Server,
  Calendar,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  Play,
  RotateCcw,
  Receipt,
  Printer,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  FileText,
  Landmark,
  MessageSquare,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { sound } from "@/lib/sound";
import {
  subnet,
  b64encode,
  b64decode,
  parseCron,
  calculateEcommerceMargin,
  generateDockerNginx,
  runSqlQuery,
  buildRcoPrompt,
  formatThermalReceipt,
  inspectJwt,
  PRELOADED_DATABASES,
  type EcommerceMarginInput,
  type ReceiptData,
} from "./ToolsLogic";
import { UniversalFilterSortBar } from "@/components/system/UniversalFilterSortBar";
import { sortItems, type SortOption } from "@/lib/popularity-ranker";
import {
  Wrench,
  Camera,
  Archive,
  FileSpreadsheet,
  ShieldAlert,
  Mic,
  QrCode,
  Video,
  Share2,
  Terminal,
  ExternalLink,
  Flame,
  Bot,
  Smartphone,
  Volume2,
  Film,
  Presentation,
  UserCheck,
  DollarSign,
  Mail,
  MessageCircle,
  Scale,
  ScanLine,
  Keyboard,
  Palette,
  Star,
  Languages,
  Pill,
  GraduationCap,
  Coins,
  Zap,
  Home,
  HeartPulse,
  UtensilsCrossed,
  Type,
  Code,
} from "lucide-react";
import { PinnedAndRecentBar } from "@/components/workplace/PinnedAndRecentBar";
import { ToolCardMicroPreview } from "@/components/tools/ToolCardMicroPreview";
import { usePinnedAndRecents } from "@/lib/workplace/favorites-and-recents";

// Re-export core algorithms for test suites & external consumers
export {
  subnet,
  b64encode,
  b64decode,
  parseCron,
  calculateEcommerceMargin,
  generateDockerNginx,
  runSqlQuery,
  buildRcoPrompt,
  formatThermalReceipt,
  inspectJwt,
};

const field =
  "w-full min-h-11 rounded-xl border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";
const btn =
  "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold surface-card surface-interactive text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all";
const pillBtn =
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-line surface-card surface-interactive text-ink-2 hover:text-ink";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.confirm();
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${pillBtn} text-primary border-primary/30 bg-primary/5`}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function ToolCard({
  id,
  title,
  Icon,
  colSpanFull,
  badge,
  children,
}: {
  id: string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  colSpanFull?: boolean;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`reveal scroll-mt-28 rounded-card surface-card p-4 sm:p-6 lux-card flex flex-col justify-between ${
        colSpanFull ? "lg:col-span-2" : ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 id={`${id}-title`} className="flex items-center gap-2 text-lg sm:text-xl font-bold text-ink">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
              <Icon className="w-[18px] h-[18px]" />
            </span>
            {title}
          </h2>
          {badge && (
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function Result({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 border-b border-line py-1.5">
          <dt className="text-ink-3">{k}</dt>
          <dd className="text-ink text-right break-all">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// 1. Subnet / CIDR
// ---------------------------------------------------------------------------
function SubnetTool() {
  const [value, setValue] = useState("192.168.10.77/26");
  const out = useMemo(() => subnet(value), [value]);
  return (
    <ToolCard id="subnet" title="Subnet / CIDR calculator" Icon={Network} badge="Networking">
      <label htmlFor="subnet-input" className="text-sm text-ink-2">IPv4 address with prefix</label>
      <input
        id="subnet-input"
        className={`${field} mt-1`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          sound.type();
        }}
        spellCheck={false}
        inputMode="decimal"
      />
      {"error" in out ? (
        <p role="alert" className="mt-3 text-sm text-ink-2">{out.error}</p>
      ) : (
        <Result rows={out.rows} />
      )}
      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs font-mono">
        <span className="text-ink-3">Speed challenge:</span>
        <Link
          href="/games?challenge=subnet-sprint"
          className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
        >
          Test your CIDR math in Subnet Sprint →
        </Link>
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 2. chmod
// ---------------------------------------------------------------------------
const WHO = ["Owner", "Group", "Others"] as const;
const PERMS = [["r", 4], ["w", 2], ["x", 1]] as const;

function ChmodTool() {
  const [bits, setBits] = useState([7, 5, 5]);
  const octal = bits.join("");
  const symbolic = bits.map((b) => PERMS.map(([c, v]) => (b & v ? c : "-")).join("")).join("");
  const setOctal = (v: string) => {
    if (/^[0-7]{3}$/.test(v)) setBits(v.split("").map(Number));
  };
  return (
    <ToolCard id="chmod" title="chmod permission calculator" Icon={KeyRound} badge="Linux">
      <div className="grid grid-cols-3 gap-2">
        {WHO.map((who, i) => (
          <fieldset key={who} className="rounded-xl border border-line p-2.5">
            <legend className="px-1 text-xs font-semibold text-ink-2">{who}</legend>
            {PERMS.map(([c, v]) => (
              <label key={c} className="flex min-h-8 items-center gap-2 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 m-0 shrink-0 accent-[rgb(var(--primary))]"
                  checked={(bits[i] & v) !== 0}
                  onChange={() => {
                    setBits((b) => b.map((x, j) => (j === i ? x ^ v : x)));
                    sound.toggleSwitch();
                  }}
                />
                {c === "r" ? "read" : c === "w" ? "write" : "execute"}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <label htmlFor="chmod-octal" className="mt-4 block text-sm text-ink-2">Octal</label>
      <input
        id="chmod-octal"
        className={`${field} mt-1 max-w-[8rem]`}
        value={octal}
        onChange={(e) => setOctal(e.target.value)}
        inputMode="numeric"
        maxLength={3}
      />
      <Result rows={[["Symbolic", symbolic], ["Command", `chmod ${octal} file`]]} />
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 3. Base64
// ---------------------------------------------------------------------------
function Base64Tool() {
  const [text, setText] = useState("THE SABBiR — Backend & DevOps");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (fn: (s: string) => string) => {
    try {
      setOut(fn(text));
      setErr("");
      sound.confirm();
    } catch {
      setOut("");
      setErr("That input isn't valid Base64 (or isn't UTF-8 text).");
      sound.error();
    }
  };
  return (
    <ToolCard id="base64" title="Base64 encode / decode" Icon={Binary} badge="Encoding">
      <label htmlFor="b64-input" className="text-sm text-ink-2">Input (UTF-8 text or Base64)</label>
      <textarea
        id="b64-input"
        rows={3}
        className={`${field} mt-1`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => run(b64encode)}>Encode</button>
        <button type="button" className={btn} onClick={() => run(b64decode)}>Decode</button>
      </div>
      {err && <p role="alert" className="mt-3 text-sm text-ink-2">{err}</p>}
      {out && (
        <div className="mt-3 relative">
          <output className="block rounded-xl bg-muted px-3 py-2 font-mono text-sm text-ink break-all pr-16">{out}</output>
          <div className="absolute top-2 right-2">
            <CopyButton text={out} />
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 4. JSON Formatter
// ---------------------------------------------------------------------------
function JsonTool() {
  const [text, setText] = useState('{"name":"THE SABBiR","role":"Chief Product Manager","stack":["FastAPI","PostgreSQL","Docker"]}');
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (indent: number | undefined) => {
    try {
      setOut(JSON.stringify(JSON.parse(text), null, indent));
      setErr("");
      sound.confirm();
    } catch (e) {
      setOut("");
      setErr((e as Error).message);
      sound.error();
    }
  };
  return (
    <ToolCard id="json" title="JSON formatter & validator" Icon={Braces} badge="Data">
      <label htmlFor="json-input" className="text-sm text-ink-2">Raw JSON</label>
      <textarea
        id="json-input"
        rows={4}
        className={`${field} mt-1`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => run(2)}>Format</button>
        <button type="button" className={btn} onClick={() => run(undefined)}>Minify</button>
      </div>
      {err && <p role="alert" className="mt-3 text-sm text-ink-2">Invalid JSON: {err}</p>}
      {out && (
        <div className="mt-3 relative">
          <pre className="max-h-64 overflow-auto rounded-xl bg-muted p-3 font-mono text-sm text-ink">{out}</pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={out} />
          </div>
        </div>
      )}
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 5. Unix Time
// ---------------------------------------------------------------------------
function TimeTool() {
  const [value, setValue] = useState("1767225600");
  const parsed = useMemo(() => {
    const v = value.trim();
    const ms = /^\d{1,13}$/.test(v) ? (v.length > 10 ? Number(v) : Number(v) * 1000) : Date.parse(v);
    if (Number.isNaN(ms)) return null;
    const d = new Date(ms);
    const rows: [string, string][] = [
      ["Unix seconds", String(Math.floor(ms / 1000))],
      ["ISO 8601 (UTC)", d.toISOString()],
      ["UTC", d.toUTCString()],
    ];
    return { rows, d };
  }, [value]);
  return (
    <ToolCard id="timestamp" title="Unix timestamp converter" Icon={Clock} badge="SysAdmin">
      <label htmlFor="ts-input" className="text-sm text-ink-2">Unix seconds / ms, or ISO timestamp</label>
      <div className="mt-1 flex gap-2">
        <input
          id="ts-input"
          className={field}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
        />
        <button
          type="button"
          className={btn}
          onClick={() => {
            setValue(String(Math.floor(Date.now() / 1000)));
            sound.click();
          }}
        >
          Now
        </button>
      </div>
      {parsed ? (
        <>
          <Result rows={parsed.rows} />
          <p className="mt-2 font-mono text-xs text-ink-2" suppressHydrationWarning>
            Your browser timezone: {parsed.d.toLocaleString()}
          </p>
        </>
      ) : (
        <p role="alert" className="mt-3 text-sm text-ink-2">Not a timestamp or date this tool understands.</p>
      )}
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 6. Interactive In-Browser SQL & Schema Sandbox (Hero Feature)
// ---------------------------------------------------------------------------
function SqlSandboxTool() {
  const [dbKey, setDbKey] = useState("aiyaar_pharmacy");
  const activeDb = useMemo(() => PRELOADED_DATABASES.find((d) => d.key === dbKey) ?? PRELOADED_DATABASES[0], [dbKey]);
  const [query, setQuery] = useState(activeDb.presetQueries[0].query);
  const [execResult, setExecResult] = useState(() => runSqlQuery("aiyaar_pharmacy", activeDb.presetQueries[0].query));

  const handleSelectDb = (key: string) => {
    setDbKey(key);
    const targetDb = PRELOADED_DATABASES.find((d) => d.key === key) ?? PRELOADED_DATABASES[0];
    const initialQuery = targetDb.presetQueries[0].query;
    setQuery(initialQuery);
    setExecResult(runSqlQuery(key, initialQuery));
    sound.click();
  };

  const handleRun = () => {
    sound.launch();
    setExecResult(runSqlQuery(dbKey, query));
  };

  return (
    <ToolCard
      id="sql-sandbox"
      title="Interactive SQL & Schema Sandbox"
      Icon={Database}
      colSpanFull
      badge="WebAssembly SQL"
    >
      <p className="text-sm text-ink-2 mb-4 leading-relaxed">
        Query real database schemas locally in your browser. Inspect First-Expiry-First-Out (FEFO) pharmacy inventory,
        NOC router latency, and personal AI telemetry with microsecond analytical response times.
      </p>

      {/* Schema selector pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRELOADED_DATABASES.map((db) => (
          <button
            key={db.key}
            type="button"
            onClick={() => handleSelectDb(db.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors border ${
              dbKey === db.key
                ? "bg-primary text-white border-primary shadow-sm"
                : "surface-card border-line text-ink-2 hover:text-ink"
            }`}
          >
            {db.title.split("(")[0]}
          </button>
        ))}
      </div>

      {/* 1-Click Preset Queries */}
      <div className="p-3 rounded-xl surface-card border border-line mb-4">
        <span className="text-xs font-semibold text-ink uppercase tracking-wider block mb-2">
          ⚡ 1-Click Analytical Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {activeDb.presetQueries.map((pq) => (
            <button
              key={pq.label}
              type="button"
              onClick={() => {
                setQuery(pq.query);
                setExecResult(runSqlQuery(dbKey, pq.query));
                sound.confirm();
              }}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-left"
            >
              ▶ {pq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query Editor & Controls */}
      <div className="relative">
        <label htmlFor="sql-editor" className="text-xs font-mono text-ink-3 mb-1 block">
          SQL Query Editor (PostgreSQL / SQLite Compatible)
        </label>
        <textarea
          id="sql-editor"
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${field} font-mono text-xs sm:text-sm bg-muted text-ink resize-y`}
          spellCheck={false}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRun}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-white hover:opacity-90 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Query
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery(activeDb.presetQueries[0].query);
                handleRun();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border border-line surface-card text-ink-2 hover:text-ink"
              title="Reset query"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-ink-3">
            <span>Rows: <strong className="text-ink">{execResult.rowCount}</strong></span>
            <span>Latency: <strong className="text-ok">{execResult.executionTimeMs} ms</strong></span>
          </div>
        </div>
      </div>

      {/* Query Results Table */}
      <div className="mt-4 border border-line rounded-xl overflow-hidden bg-paper">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs sm:text-sm">
            <thead className="bg-muted border-b border-line text-ink font-semibold">
              <tr>
                {execResult.columns.map((col) => (
                  <th key={col} className="px-3 py-2.5 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {execResult.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-ink-2 whitespace-nowrap">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 7. Cron & systemd Timer Explainer + Generator
// ---------------------------------------------------------------------------
function CronTimerTool() {
  const [expr, setExpr] = useState("0 0 * * *");
  const [activeTab, setActiveTab] = useState<"explainer" | "timer" | "service">("explainer");
  const parsed = useMemo(() => parseCron(expr), [expr]);

  const presets = [
    { label: "Daily Midnight", expr: "0 0 * * *" },
    { label: "Every 15 min", expr: "*/15 * * * *" },
    { label: "Mon-Fri 6 PM", expr: "0 18 * * 1-5" },
    { label: "Sunday 4 AM", expr: "0 4 * * 0" },
  ];

  return (
    <ToolCard id="cron-timer" title="Cron & systemd Timer Explainer" Icon={Calendar} badge="Linux / SysAdmin">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setExpr(p.expr);
              sound.click();
            }}
            className="text-[11px] font-mono px-2 py-0.5 rounded border border-line surface-card text-ink-2 hover:text-ink"
          >
            {p.label}
          </button>
        ))}
      </div>

      <label htmlFor="cron-input" className="text-sm text-ink-2">Cron expression (5 fields)</label>
      <input
        id="cron-input"
        className={`${field} mt-1`}
        value={expr}
        onChange={(e) => {
          setExpr(e.target.value);
          sound.type();
        }}
        spellCheck={false}
      />

      {/* Tabs */}
      <div className="mt-4 flex border-b border-line gap-2">
        {(["explainer", "timer", "service"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              sound.click();
            }}
            className={`pb-1.5 text-xs font-mono font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-ink-3 hover:text-ink"
            }`}
          >
            {tab === "explainer" ? "Schedule Explainer" : tab === "timer" ? "systemd .timer" : "systemd .service"}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {activeTab === "explainer" && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-muted border border-line">
              <span className="text-xs font-mono text-ink-3 block">Human Schedule</span>
              <p className="text-base font-semibold text-ink mt-0.5">{parsed.human}</p>
              <p className="text-sm font-medium text-primary mt-1 font-sans">{parsed.humanBn}</p>
            </div>
            <div className="p-2.5 rounded-xl surface-card border border-line flex items-center justify-between">
              <span className="text-xs font-mono text-ink-3">systemd OnCalendar</span>
              <code className="text-xs font-mono text-ink font-semibold">{parsed.systemdCalendar}</code>
            </div>
          </div>
        )}

        {activeTab === "timer" && (
          <div className="relative">
            <pre className="p-3 rounded-xl bg-muted font-mono text-xs text-ink overflow-auto max-h-48 border border-line">
              {parsed.systemdTimerUnit}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={parsed.systemdTimerUnit} />
            </div>
          </div>
        )}

        {activeTab === "service" && (
          <div className="relative">
            <pre className="p-3 rounded-xl bg-muted font-mono text-xs text-ink overflow-auto max-h-48 border border-line">
              {parsed.systemdServiceUnit}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={parsed.systemdServiceUnit} />
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 8. Docker Compose & Nginx Reverse-Proxy Generator
// ---------------------------------------------------------------------------
function DockerNginxTool() {
  const [serviceName, setServiceName] = useState("fastapi-prod");
  const [port, setPort] = useState(8000);
  const [domain, setDomain] = useState("api.thesabbir.com");
  const [database, setDatabase] = useState<"none" | "postgres" | "redis" | "both">("postgres");
  const [enableSSL, setEnableSSL] = useState(true);
  const [enableRateLimit, setEnableRateLimit] = useState(true);
  const [tab, setTab] = useState<"docker" | "nginx">("docker");

  const generated = useMemo(
    () =>
      generateDockerNginx({
        serviceName,
        port,
        domain,
        database,
        enableSSL,
        enableRateLimit,
      }),
    [serviceName, port, domain, database, enableSSL, enableRateLimit]
  );

  return (
    <ToolCard id="docker-nginx" title="Docker & Nginx Reverse-Proxy Generator" Icon={Server} badge="DevOps">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label htmlFor="service-name" className="text-xs text-ink-2">Service Name</label>
          <input
            id="service-name"
            className={`${field} mt-1`}
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="service-port" className="text-xs text-ink-2">App Port</label>
          <input
            id="service-port"
            type="number"
            className={`${field} mt-1`}
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="domain-name" className="text-xs text-ink-2">Public Domain</label>
        <input
          id="domain-name"
          className={`${field} mt-1`}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label htmlFor="db-select" className="text-xs text-ink-2">Database Engine</label>
          <select
            id="db-select"
            className={`${field} mt-1`}
            value={database}
            onChange={(e) => setDatabase(e.target.value as "none" | "postgres" | "redis" | "both")}
          >
            <option value="none">No Database</option>
            <option value="postgres">PostgreSQL 17</option>
            <option value="redis">Redis 7</option>
            <option value="both">PostgreSQL + Redis</option>
          </select>
        </div>
        <div className="flex flex-col justify-end gap-1.5 pb-1">
          <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={enableSSL}
              onChange={(e) => setEnableSSL(e.target.checked)}
              className="w-4 h-4 accent-[rgb(var(--primary))]"
            />
            SSL (HTTPS / Let&apos;s Encrypt)
          </label>
          <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={enableRateLimit}
              onChange={(e) => setEnableRateLimit(e.target.checked)}
              className="w-4 h-4 accent-[rgb(var(--primary))]"
            />
            Rate Limiting (15 req/s)
          </label>
        </div>
      </div>

      <div className="flex border-b border-line gap-3 mb-2">
        <button
          type="button"
          onClick={() => {
            setTab("docker");
            sound.click();
          }}
          className={`pb-1 text-xs font-mono font-medium border-b-2 ${
            tab === "docker" ? "border-primary text-primary" : "border-transparent text-ink-3"
          }`}
        >
          docker-compose.yml
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("nginx");
            sound.click();
          }}
          className={`pb-1 text-xs font-mono font-medium border-b-2 ${
            tab === "nginx" ? "border-primary text-primary" : "border-transparent text-ink-3"
          }`}
        >
          nginx.conf
        </button>
      </div>

      <div className="relative">
        <pre className="p-3 rounded-xl bg-muted font-mono text-xs text-ink overflow-auto max-h-56 border border-line">
          {tab === "docker" ? generated.dockerCompose : generated.nginxConf}
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={tab === "docker" ? generated.dockerCompose : generated.nginxConf} />
        </div>
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 9. BD E-Commerce & POS Margin / COD Calculator
// ---------------------------------------------------------------------------
function EcommerceMarginTool() {
  const [params, setParams] = useState<EcommerceMarginInput>({
    sellingPrice: 1200,
    productCost: 650,
    courierFee: 120,
    customerDeliveryFee: 120,
    codPercent: 1.0,
    gatewayPercent: 0,
    packagingCost: 25,
    returnRatePercent: 8,
    courierReturnFee: 60,
  });

  const res = useMemo(() => calculateEcommerceMargin(params), [params]);

  const updateParam = (key: keyof EcommerceMarginInput, val: number) => {
    setParams((p) => ({ ...p, [key]: val }));
  };

  return (
    <ToolCard id="ecommerce-calc" title="BD E-Commerce & POS Margin Calculator" Icon={ShoppingBag} badge="Retail / Aiyaar">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
        <div>
          <label htmlFor="sell-price" className="text-ink-2">Selling Price (BDT)</label>
          <input
            id="sell-price"
            type="number"
            className={`${field} mt-1`}
            value={params.sellingPrice}
            onChange={(e) => updateParam("sellingPrice", Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="cost-price" className="text-ink-2">Product Cost (COGS)</label>
          <input
            id="cost-price"
            type="number"
            className={`${field} mt-1`}
            value={params.productCost}
            onChange={(e) => updateParam("productCost", Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="courier-cost" className="text-ink-2">Courier Charge (BDT)</label>
          <input
            id="courier-cost"
            type="number"
            className={`${field} mt-1`}
            value={params.courierFee}
            onChange={(e) => updateParam("courierFee", Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="delivery-charge" className="text-ink-2">Charged to Client</label>
          <input
            id="delivery-charge"
            type="number"
            className={`${field} mt-1`}
            value={params.customerDeliveryFee}
            onChange={(e) => updateParam("customerDeliveryFee", Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="cod-pct" className="text-ink-2">Courier COD Fee (%)</label>
          <input
            id="cod-pct"
            type="number"
            step="0.5"
            className={`${field} mt-1`}
            value={params.codPercent}
            onChange={(e) => updateParam("codPercent", Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="return-rate" className="text-ink-2">Return Rate / RTO (%)</label>
          <input
            id="return-rate"
            type="number"
            className={`${field} mt-1`}
            value={params.returnRatePercent}
            onChange={(e) => updateParam("returnRatePercent", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Output Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted border border-line font-mono text-xs">
        <div>
          <span className="text-ink-3">Net Profit (Delivered)</span>
          <p className="text-sm font-bold text-ink mt-0.5">৳ {res.netDeliveredProfit} ({res.netDeliveredMarginPct}%)</p>
        </div>
        <div>
          <span className="text-ink-3">Blended Real Profit</span>
          <p className={`text-sm font-bold mt-0.5 ${res.isProfitable ? "text-ok" : "text-warn"}`}>
            ৳ {res.expectedBlendedProfit}
          </p>
        </div>
        <div>
          <span className="text-ink-3">Loss per Return (RTO)</span>
          <p className="text-xs text-ink-2 mt-0.5">৳ {res.returnLossPerOrder}</p>
        </div>
        <div>
          <span className="text-ink-3">Break-Even Selling Price</span>
          <p className="text-xs font-semibold text-primary mt-0.5">৳ {res.breakEvenPrice}</p>
        </div>
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 10. R-C-O AI Prompt Architect
// ---------------------------------------------------------------------------
function RcoPromptTool() {
  const [role, setRole] = useState("Senior DevOps & PostgreSQL DBA");
  const [context, setContext] = useState("Tuning an inventory schema for 5,000 retail shops in Bangladesh with sub-second queries.");
  const [constraints, setConstraints] = useState("Zero table locks, explain compound B-Tree indexes, provide EXPLAIN ANALYZE checklist.");
  const [outputFormat, setOutputFormat] = useState("Production SQL DDL + Migration Script + Benchmark command.");

  const generated = useMemo(
    () => buildRcoPrompt({ role, context, constraints, outputFormat }),
    [role, context, constraints, outputFormat]
  );

  return (
    <ToolCard id="rco-prompt" title="R-C-O AI Prompt Architect" Icon={Sparkles} badge="Prompt Eng">
      <div className="space-y-2 text-xs mb-3">
        <div>
          <label htmlFor="rco-role" className="text-ink-2">Role & Persona</label>
          <input
            id="rco-role"
            className={`${field} mt-1`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rco-context" className="text-ink-2">Context & Problem</label>
          <textarea
            id="rco-context"
            rows={2}
            className={`${field} mt-1`}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rco-constraints" className="text-ink-2">Constraints & Guardrails</label>
          <input
            id="rco-constraints"
            className={`${field} mt-1`}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rco-format" className="text-ink-2">Output Format</label>
          <input
            id="rco-format"
            className={`${field} mt-1`}
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          />
        </div>
      </div>

      <div className="relative">
        <pre className="p-3 rounded-xl bg-muted font-mono text-xs text-ink overflow-auto max-h-48 border border-line whitespace-pre-wrap">
          {generated}
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={generated} />
        </div>
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 11. 58mm / 80mm Thermal POS Receipt Live Previewer
// ---------------------------------------------------------------------------
function ThermalReceiptTool() {
  const [paperWidth, setPaperWidth] = useState<"58mm" | "80mm">("58mm");
  const [shopName, setShopName] = useState("Aiyaar Pharmacy & Mart");
  const [tagline, setTagline] = useState("Quality Medicine & Healthcare");
  const [phone, setPhone] = useState("+8801711000000");
  const [invoiceNo, setInvoiceNo] = useState("INV-2026-9921");
  const [item1Name, setItem1Name] = useState("Napa Extra 500mg");
  const [item1Qty, setItem1Qty] = useState(2);
  const [item1Price, setItem1Price] = useState(3.0);
  const [item2Name, setItem2Name] = useState("Azithromycin 500mg");
  const [item2Qty, setItem2Qty] = useState(1);
  const [item2Price, setItem2Price] = useState(35.0);
  const [discountBdt, setDiscountBdt] = useState(5.0);
  const [vatPct, setVatPct] = useState(5.0);
  const [footerNote, setFooterNote] = useState("Thank you for shopping with us!");

  const receipt = useMemo(
    () =>
      formatThermalReceipt({
        paperWidth,
        shopName,
        tagline,
        phone,
        invoiceNo,
        dateStr: "2026-11-15 14:30",
        items: [
          { name: item1Name, qty: item1Qty, priceBdt: item1Price },
          { name: item2Name, qty: item2Qty, priceBdt: item2Price },
        ],
        discountBdt,
        vatPct,
        footerNote,
      }),
    [paperWidth, shopName, tagline, phone, invoiceNo, item1Name, item1Qty, item1Price, item2Name, item2Qty, item2Price, discountBdt, vatPct, footerNote]
  );

  const handleDownload = () => {
    sound.shutter();
    const blob = new Blob([receipt.formattedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${invoiceNo}-${paperWidth}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <ToolCard id="thermal-receipt" title="58mm / 80mm Thermal POS Receipt Previewer" Icon={Receipt} badge="POS / Hardware" colSpanFull>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Input Form */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Paper Roll Size:</span>
            <div className="flex gap-1.5">
              {(["58mm", "80mm"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setPaperWidth(w);
                    sound.toggleSwitch();
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs transition ${
                    paperWidth === w ? "bg-primary text-white font-bold" : "bg-muted text-ink-2 hover:text-ink"
                  }`}
                >
                  {w} ({w === "58mm" ? "32 cols" : "48 cols"})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="rcpt-shop" className="text-ink-2">Shop / Business Name</label>
              <input id="rcpt-shop" className={`${field} mt-1`} value={shopName} onChange={(e) => setShopName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="rcpt-phone" className="text-ink-2">Contact Phone</label>
              <input id="rcpt-phone" className={`${field} mt-1`} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="rcpt-tag" className="text-ink-2">Tagline / Address</label>
              <input id="rcpt-tag" className={`${field} mt-1`} value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div>
              <label htmlFor="rcpt-inv" className="text-ink-2">Invoice Number</label>
              <input id="rcpt-inv" className={`${field} mt-1`} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-muted/20 space-y-2">
            <span className="text-[11px] font-mono uppercase text-ink-3">Item 1:</span>
            <div className="grid grid-cols-3 gap-2">
              <input className={`${field} col-span-2`} value={item1Name} onChange={(e) => setItem1Name(e.target.value)} placeholder="Item Name" />
              <input type="number" className={field} value={item1Price} onChange={(e) => setItem1Price(Number(e.target.value))} placeholder="Price" />
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-muted/20 space-y-2">
            <span className="text-[11px] font-mono uppercase text-ink-3">Item 2:</span>
            <div className="grid grid-cols-3 gap-2">
              <input className={`${field} col-span-2`} value={item2Name} onChange={(e) => setItem2Name(e.target.value)} placeholder="Item Name" />
              <input type="number" className={field} value={item2Price} onChange={(e) => setItem2Price(Number(e.target.value))} placeholder="Price" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="rcpt-disc" className="text-ink-2">Discount (BDT)</label>
              <input id="rcpt-disc" type="number" className={`${field} mt-1`} value={discountBdt} onChange={(e) => setDiscountBdt(Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="rcpt-vat" className="text-ink-2">VAT %</label>
              <input id="rcpt-vat" type="number" className={`${field} mt-1`} value={vatPct} onChange={(e) => setVatPct(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Right: Thermal Receipt Paper Preview */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-ink-3 mb-2">
              <span className="flex items-center gap-1"><Printer className="w-3.5 h-3.5 text-primary" /> Thermal Output Preview:</span>
              <span>ESC/POS: ~{receipt.estimatedEscPosBytes} bytes</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-zinc-950 font-mono text-xs text-zinc-900 dark:text-zinc-200 border border-amber-200 dark:border-zinc-800 shadow-inner overflow-x-auto whitespace-pre leading-tight">
              {receipt.formattedText}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-line">
            <div className="text-xs font-mono">
              Grand Total: <strong className="text-primary text-sm font-bold">৳ {receipt.grandTotal.toFixed(2)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={receipt.formattedText} label="Copy Receipt" />
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-line surface-card text-ink hover:text-primary transition"
              >
                <FileText className="w-3.5 h-3.5" /> Download .txt
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ---------------------------------------------------------------------------
// 12. Client-Side JWT & Token Inspector
// ---------------------------------------------------------------------------
function JwtInspectorTool() {
  const defaultSample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVyYXRpdmVfNDIiLCJuYW1lIjoiTWQgU2FiYmlydWwgSXNsYW0gS2hhbiIsInJvbGUiOiJDaGllZiBQcm9kdWN0IE1hbmFnZXIgKENPTSkiLCJpYXQiOjE3MzE2MDAwMDAsImV4cCI6MjAwMDAwMDAwMCwiaXNzIjoidGhlLXNhYmJpci1vcyJ9.sample_signature_the_sabbir_os";
  const [tokenInput, setTokenInput] = useState(defaultSample);
  const inspection = useMemo(() => inspectJwt(tokenInput), [tokenInput]);

  return (
    <ToolCard id="jwt-inspector" title="JWT & API Token Inspector (100% Client-Side)" Icon={ShieldCheck} badge="Security / Auth" colSpanFull>
      <div className="space-y-4">
        <div>
          <label htmlFor="jwt-input" className="text-xs text-ink-2 font-mono flex items-center justify-between">
            <span>Paste Encoded JWT Token (Never transmitted over the network):</span>
            <span className="text-emerald-500 font-semibold">100% Client-Side Offline Safe</span>
          </label>
          <textarea
            id="jwt-input"
            rows={3}
            className={`${field} mt-1`}
            value={tokenInput}
            onChange={(e) => {
              setTokenInput(e.target.value);
              sound.type();
            }}
            placeholder="eyJhbGciOi...eyJzdWIiOi..."
          />
        </div>

        {inspection.valid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header Box */}
            <div className="p-3.5 rounded-xl border border-line bg-muted/20 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-ink-3 pb-1 border-b border-line">
                <span className="font-bold text-ink">HEADER: ALGORITHM &amp; TYPE</span>
                <span className="text-primary font-semibold">{inspection.algorithm}</span>
              </div>
              <pre className="text-pink-600 dark:text-pink-400 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(inspection.header, null, 2)}
              </pre>
            </div>

            {/* Payload Box */}
            <div className="p-3.5 rounded-xl border border-line bg-muted/20 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-ink-3 pb-1 border-b border-line">
                <span className="font-bold text-ink">PAYLOAD: CLAIMS &amp; EXPIRATION</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  inspection.isExpired ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  {inspection.timeRemainingText || "Active"}
                </span>
              </div>
              <pre className="text-purple-600 dark:text-purple-400 overflow-x-auto whitespace-pre-wrap max-h-48">
                {JSON.stringify(inspection.payload, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
            ⚠️ {inspection.error}
          </div>
        )}
      </div>
    </ToolCard>
  );
}

export interface SuperToolDef {
  id: string;
  slug: string;
  title: string;
  banglaTitle: string;
  description: string;
  category: "Media & Studio" | "Business & POS" | "Security & Privacy" | "DevOps & Linux" | "Database & SQL";
  popularityScore: number;
  impactScore: number;
  date: string;
  badge: string;
  href: string;
  agentName: string;
  agentSlug: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  addedAt?: string;
  isNew?: boolean;
  lifePersona?: "everyday" | "student" | "business" | "freelance" | "developer";
}

export const SUPER_TOOLS_CATALOG: SuperToolDef[] = [
  {
    id: "bg-remover",
    slug: "bg-remover",
    title: "AI Studio Background Remover",
    banglaTitle: "ছবির ব্যাকগ্রাউন্ড রিমুভার",
    description: "Remove image backgrounds instantly in your browser with edge matting and studio color/gradient backdrops. 100% private, zero uploads.",
    category: "Media & Studio",
    popularityScore: 99,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Most Popular",
    href: "/tools/bg-remover",
    agentName: "PixelForge",
    agentSlug: "pixelforge",
    icon: Camera,
    tags: ["matting", "e-commerce", "webp", "photo"],
  },
  {
    id: "khata-scanner",
    slug: "khata-scanner",
    title: "Khata & Cash Memo to Excel",
    banglaTitle: "দোকানের খাতা ও মেমো স্ক্যানার",
    description: "Turn handwritten or typed Bangla/English ledger memos, receipts, and bazaars into editable Excel/CSV spreadsheets with auto-totals.",
    category: "Business & POS",
    popularityScore: 98,
    impactScore: 99,
    date: "2026-11-15",
    badge: "BD SME Hero",
    href: "/tools/khata-scanner",
    agentName: "KhataVision",
    agentSlug: "khatavision",
    icon: FileSpreadsheet,
    tags: ["baki khata", "excel", "ocr", "receipt"],
  },
  {
    id: "invoice-maker",
    slug: "invoice-maker",
    title: "BD SME Invoice & Thermal Receipt",
    banglaTitle: "ইনভয়েস ও ক্যাশ মেমো মেকার",
    description: "Create professional business invoices, quotations, and 80mm POS thermal receipts with bKash/Nagad QR payment codes and COD shipping.",
    category: "Business & POS",
    popularityScore: 98,
    impactScore: 96,
    date: "2026-11-15",
    badge: "Essential",
    href: "/tools/invoice-maker",
    agentName: "BizDesk BD",
    agentSlug: "bizdesk-bd",
    icon: Receipt,
    tags: ["billing", "bkash qr", "thermal pos", "cash memo"],
  },
  {
    id: "image-compressor",
    slug: "image-compressor",
    title: "Batch 50-Image WebP Compressor",
    banglaTitle: "৫০টি ছবির WebP কম্প্রেসর ও ZIP",
    description: "Compress batches of up to 50 JPG/PNG images to lightweight WebP files. Download individually or as an instant client-side .ZIP archive.",
    category: "Media & Studio",
    popularityScore: 97,
    impactScore: 94,
    date: "2026-11-15",
    badge: "100% Client-Side",
    href: "/tools/image-compressor",
    agentName: "PixelForge",
    agentSlug: "pixelforge",
    icon: Archive,
    tags: ["compression", "zip", "batch", "webp"],
  },
  {
    id: "docker-hardener",
    slug: "docker-hardener",
    title: "Dockerfile AST Security Scanner",
    banglaTitle: "ডকারফাইল সিকিউরিটি হার্ডেনার",
    description: "Audit Dockerfiles for root execution, floating latest tags, and secrets. Get a 0-100 grade and generate an auto-hardened multi-stage container.",
    category: "DevOps & Linux",
    popularityScore: 97,
    impactScore: 97,
    date: "2026-11-15",
    badge: "DevOps Hero",
    href: "/tools/docker-hardener",
    agentName: "SecOps Guardian",
    agentSlug: "secops-guardian",
    icon: ShieldAlert,
    tags: ["docker", "security", "cis", "distroless"],
  },
  {
    id: "reel-script",
    slug: "reel-script",
    title: "60s Viral Reel & .SRT Generator",
    banglaTitle: "ভাইরাল রিল স্ক্রিপ্ট ও .SRT",
    description: "Generate 3-second scroll-stopper hooks, timed 3-column scripts (Time | Voice | Visual/SFX), and downloadable .srt subtitles.",
    category: "Media & Studio",
    popularityScore: 96,
    impactScore: 95,
    date: "2026-11-15",
    badge: "Viral Engine",
    href: "/tools/reel-script",
    agentName: "ViralDirector",
    agentSlug: "viral-director",
    icon: Video,
    tags: ["reels", "tiktok", "hook", "subtitles"],
  },
  {
    id: "product-studio",
    slug: "product-studio",
    title: "Daraz & FB Product Photo Studio",
    banglaTitle: "দারাজ ও ফেসবুক প্রোডাক্ট ফটো স্টুডিও",
    description: "Enhance product photos with preset aspect ratios (1:1, 4:5, 16:9), price badges, COD delivery trust tags, and shadow effects for BD e-commerce.",
    category: "Media & Studio",
    popularityScore: 96,
    impactScore: 93,
    date: "2026-11-15",
    badge: "E-Commerce",
    href: "/tools/product-studio",
    agentName: "PixelForge",
    agentSlug: "pixelforge",
    icon: Camera,
    tags: ["daraz", "facebook shop", "catalog", "badge"],
  },
  {
    id: "pdf-redactor",
    slug: "pdf-redactor",
    title: "Privacy NID, Phone & PII Redactor",
    banglaTitle: "এনআইডি ও গোপন তথ্য রিডাক্টর",
    description: "Detect and redact Bangladeshi NID numbers, phone numbers, emails, and financial information. Blackout sensitive text and export safe files.",
    category: "Security & Privacy",
    popularityScore: 95,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Zero Leak",
    href: "/tools/pdf-redactor",
    agentName: "PrivacyShield",
    agentSlug: "privacy-shield",
    icon: ShieldCheck,
    tags: ["privacy", "nid", "phone", "redaction"],
  },
  {
    id: "cron-english",
    slug: "cron-english",
    title: "Plain-English to Cron & systemd",
    banglaTitle: "সাধারণ ইংরেজি থেকে Cron ও systemd",
    description: "Convert natural language phrases into standard 5-part cron syntax, view projected run timestamps, and generate complete systemd.timer unit files.",
    category: "DevOps & Linux",
    popularityScore: 95,
    impactScore: 92,
    date: "2026-11-15",
    badge: "Sysadmin",
    href: "/tools/cron-english",
    agentName: "SecOps Guardian",
    agentSlug: "secops-guardian",
    icon: Clock,
    tags: ["cron", "systemd", "automation", "linux"],
  },
  {
    id: "voice-notes",
    slug: "voice-notes",
    title: "Voice Memo Summarizer & Action Pad",
    banglaTitle: "ভয়েস মেমো সামারি ও অ্যাকশন প্যাড",
    description: "Live browser speech-to-text recording with real-time waveform visualization, automatic key points extraction, and action items checklist.",
    category: "Media & Studio",
    popularityScore: 94,
    impactScore: 91,
    date: "2026-11-15",
    badge: "Web Speech",
    href: "/tools/voice-notes",
    agentName: "VoiceScribe",
    agentSlug: "voice-scribe",
    icon: Mic,
    tags: ["speech to text", "meeting notes", "bangla audio"],
  },
  {
    id: "barcode-studio",
    slug: "barcode-studio",
    title: "Bulk Barcode & QR Sticker Sheet",
    banglaTitle: "বারকোড ও কিউআর স্টিকার শিট স্টুডিও",
    description: "Generate Code-128 retail barcodes and branded QR code stickers for shop inventory, retail labels, and print-ready A4 sticker sheets.",
    category: "Business & POS",
    popularityScore: 93,
    impactScore: 90,
    date: "2026-11-15",
    badge: "Retail Tool",
    href: "/tools/barcode-studio",
    agentName: "BizDesk BD",
    agentSlug: "bizdesk-bd",
    icon: QrCode,
    tags: ["barcode", "code-128", "qr code", "sticker sheet"],
  },
  {
    id: "social-preview",
    slug: "social-preview",
    title: "Social Preview Card & SEO Meta",
    banglaTitle: "সোশ্যাল প্রিভিউ কার্ড ও মেটা স্টুডিও",
    description: "Live pixel-accurate link preview simulator for Facebook, LinkedIn, X, and WhatsApp. Copy HTML and Next.js Open Graph metadata in 1 click.",
    category: "Media & Studio",
    popularityScore: 92,
    impactScore: 89,
    date: "2026-11-15",
    badge: "OG Live",
    href: "/tools/social-preview",
    agentName: "ViralDirector",
    agentSlug: "viral-director",
    icon: Share2,
    tags: ["open graph", "social card", "seo", "meta"],
  },
  {
    id: "daraz-listing-ai",
    slug: "daraz-listing-ai",
    title: "Daraz & F-Commerce Catalog SEO",
    banglaTitle: "দারাজ ও ফেসবুক শপ ক্যাটালগ অপটিমাইজার",
    description: "Generate ranked Daraz product titles, 5-point specifications, warranty terms, and high-converting Facebook ad copies with pricing psychology.",
    category: "Business & POS",
    popularityScore: 97,
    impactScore: 96,
    date: "2026-11-15",
    badge: "E-Commerce",
    href: "/tools/daraz-listing-ai",
    agentName: "CatalogRanker",
    agentSlug: "catalog-ranker",
    icon: ShoppingBag,
    tags: ["daraz", "catalog", "ad copy", "pricing"],
  },
  {
    id: "cheque-audit",
    slug: "cheque-audit",
    title: "BD Bank Cheque & Taka-in-Words",
    banglaTitle: "চেক ও বাংলা-ইংরেজি কথায় টাকা অডিটর",
    description: "Convert numeric amounts to authentic Bangla and English banking words, audit stale or post-dated cheques, and export bank deposit reconciliation slips.",
    category: "Business & POS",
    popularityScore: 96,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Banking Hero",
    href: "/tools/cheque-audit",
    agentName: "ChequeGuard",
    agentSlug: "cheque-guard",
    icon: Landmark,
    tags: ["cheque", "taka in words", "bank", "deposit slip"],
  },
  {
    id: "sms-campaign-studio",
    slug: "sms-campaign-studio",
    title: "Customer CRM & Bangla SMS Studio",
    banglaTitle: "কাস্টমার CRM ও বাংলা SMS ক্যাম্পেইন",
    description: "Segment customer lists into VIP, Baki/Due, and Inactive groups, generate personalized SMS messages, and calculate exact GSM-7 vs Unicode costs in BDT.",
    category: "Business & POS",
    popularityScore: 95,
    impactScore: 94,
    date: "2026-11-15",
    badge: "CRM & SMS",
    href: "/tools/sms-campaign-studio",
    agentName: "BizDesk BD",
    agentSlug: "bizdesk-bd",
    icon: MessageSquare,
    tags: ["sms", "crm", "baki reminder", "unicode"],
  },
  {
    id: "cv-privacy-shield",
    slug: "cv-privacy-shield",
    title: "Public CV Privacy & ATS Matcher",
    banglaTitle: "পাবলিক সিভি প্রাইভেসি ও ATS স্ক্যানার",
    description: "Score your resume 0-100% against job descriptions, discover missing ATS keywords, and auto-scrub phone, NID, and address for safe public LinkedIn sharing.",
    category: "Security & Privacy",
    popularityScore: 94,
    impactScore: 95,
    date: "2026-11-15",
    badge: "Career Shield",
    href: "/tools/cv-privacy-shield",
    agentName: "CareerShield",
    agentSlug: "career-shield",
    icon: FileText,
    tags: ["cv", "ats resume", "privacy", "scrubber"],
  },
  {
    id: "pdf-toolkit",
    slug: "pdf-toolkit",
    title: "Private In-Browser PDF Suite",
    banglaTitle: "প্রাইভেট ব্রাউজার PDF মার্জ ও স্প্লিট",
    description: "Merge multiple document pages, rotate scans, reorder pages, and apply official verification stamps with 100% private in-browser execution.",
    category: "Security & Privacy",
    popularityScore: 94,
    impactScore: 93,
    date: "2026-11-15",
    badge: "Zero Server",
    href: "/tools/pdf-toolkit",
    agentName: "PrivacyShield",
    agentSlug: "privacy-shield",
    icon: FileText,
    tags: ["pdf merge", "split", "watermark", "stamp"],
  },
  {
    id: "api-load-simulator",
    slug: "api-load-simulator",
    title: "API Latency Probe & k6/Locust Studio",
    banglaTitle: "API লেটেন্সি প্রব ও k6 লোড স্ক্রিপ্ট",
    description: "Benchmark endpoint latency (p50/p95/p99), audit security headers, and generate production k6, Locust, and cURL load scripts in your browser.",
    category: "DevOps & Linux",
    popularityScore: 93,
    impactScore: 94,
    date: "2026-11-15",
    badge: "DevOps Benchmark",
    href: "/tools/api-load-simulator",
    agentName: "NetworkDoctor",
    agentSlug: "network-doctor",
    icon: Activity,
    tags: ["api", "k6", "locust", "latency", "benchmark"],
  },
  {
    id: "image-editor",
    slug: "image-editor",
    title: "Pro Multi-Layer Image Editor Studio",
    banglaTitle: "প্রো ইমেজ এডিটর ও সিনেমাটিক LUT ফিল্টার",
    description: "Photoshop Express alternative. Crop (1:1, 4:5, 16:9), rotate/flip, 12 cinematic LUT filters, Bangla typography layers, and brush retouching in canvas.",
    category: "Media & Studio",
    popularityScore: 99,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/image-editor",
    agentName: "ImageRetouch",
    agentSlug: "image-retouch",
    icon: Camera,
    tags: ["photo editor", "photoshop", "lut", "crop", "canvas"],
  },
  {
    id: "story-maker",
    slug: "story-maker",
    title: "Social Story, Reel Cover & Poster Studio",
    banglaTitle: "সোশ্যাল স্টোরি ও রিল কভার মেকার",
    description: "Canva alternative. 18 curated templates for Instagram/WhatsApp Story (9:16), LinkedIn Carousels (4:5), and YouTube covers with gradient meshes and 1-click export.",
    category: "Media & Studio",
    popularityScore: 98,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/story-maker",
    agentName: "StoryCraft",
    agentSlug: "story-craft",
    icon: Smartphone,
    tags: ["story maker", "canva", "instagram story", "poster", "reel cover"],
  },
  {
    id: "audio-editor",
    slug: "audio-editor",
    title: "WebAudio Waveform DAW & Voice Studio",
    banglaTitle: "ব্রাউজার অডিও এডিটর ও পডকাস্ট ভয়েস বুস্ট",
    description: "Audacity alternative. Interactive waveform zoom, region trimming, 3-band parametric EQ, volume normalization, and sample-accurate 16-bit WAV binary export.",
    category: "Media & Studio",
    popularityScore: 97,
    impactScore: 96,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/audio-editor",
    agentName: "AudioMaster",
    agentSlug: "audio-master",
    icon: Volume2,
    tags: ["audio editor", "audacity", "daw", "wav", "eq", "podcast"],
  },
  {
    id: "video-clipper",
    slug: "video-clipper",
    title: "Video Trimmer, Frame Grabber & GIF Studio",
    banglaTitle: "ভিডিও ট্রিমার ও ১০৮০পি ফ্রেম গ্র্যাবার",
    description: "CapCut & Ezgif alternative. Client-side timeline trimming, subtitle burn-in, aspect ratio reframing (9:16, 4:5, 1:1, 16:9), and 1080p still frame capture.",
    category: "Media & Studio",
    popularityScore: 96,
    impactScore: 95,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/video-clipper",
    agentName: "MotionDirector",
    agentSlug: "motion-director",
    icon: Film,
    tags: ["video trimmer", "frame grabber", "capcut", "gif", "shorts"],
  },
  {
    id: "spreadsheet-grid",
    slug: "spreadsheet-grid",
    title: "Smart Khata & Formula Spreadsheet Studio",
    banglaTitle: "স্মার্ট খাতা ও ফর্মুলা স্প্রেডশিট",
    description: "Excel & Google Sheets alternative. Reactive formulas (=SUM, =AVERAGE, =IF), 5 Bangladeshi Dokan & SaaS templates, real-time SVG charts, and CSV export.",
    category: "Business & POS",
    popularityScore: 99,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/spreadsheet-grid",
    agentName: "PosArchitect",
    agentSlug: "pos-architect",
    icon: FileSpreadsheet,
    tags: ["spreadsheet", "excel", "khata", "formula", "csv", "charts"],
  },
  {
    id: "slide-deck",
    slug: "slide-deck",
    title: "Instant Presentation & Pitch Deck Studio",
    banglaTitle: "ইনস্ট্যান্ট প্রেজেন্টেশন ও পিচ ডেক মেকার",
    description: "PowerPoint & Gamma alternative. Convert markdown notes into structured 16:9 widescreen presentation decks and 4:5 LinkedIn carousels with fullscreen mode.",
    category: "Business & POS",
    popularityScore: 97,
    impactScore: 96,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/slide-deck",
    agentName: "StoryCraft",
    agentSlug: "story-craft",
    icon: Presentation,
    tags: ["presentation", "pitch deck", "slides", "gamma", "powerpoint"],
  },
  {
    id: "screen-recorder",
    slug: "screen-recorder",
    title: "Screen + PiP Webcam & Teleprompter Studio",
    banglaTitle: "স্ক্রিন রেকর্ডার ও সার্কুলার ওয়েবক্যাম স্টুডিও",
    description: "Loom & OBS alternative. Record 1080p 60fps screen + circular webcam PiP + microphone audio with a live teleprompter overlay and zero watermarks.",
    category: "Media & Studio",
    popularityScore: 98,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/screen-recorder",
    agentName: "MediaLaunch",
    agentSlug: "media-launch",
    icon: Video,
    tags: ["screen recorder", "loom", "webcam pip", "teleprompter", "60fps"],
  },
  {
    id: "qr-link-bio",
    slug: "qr-link-bio",
    title: "Digital Visiting Card & vCard Standee Studio",
    banglaTitle: "ডিজিটাল ভিজিটিং কার্ড ও বিকাশ কিউআর স্ট্যান্ডি",
    description: "Linktree & HiHello alternative. Generate RFC 6350 .vcf vCards, printable counter standees (bKash/Nagad Payment, Guest Wi-Fi, Founder Card) in 1 click.",
    category: "Business & POS",
    popularityScore: 96,
    impactScore: 95,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/qr-link-bio",
    agentName: "PosArchitect",
    agentSlug: "pos-architect",
    icon: QrCode,
    tags: ["vcard", "qr standee", "visiting card", "bkash qr", "wifi qr"],
  },
  {
    id: "gov-photo-sizer",
    slug: "gov-photo-sizer",
    title: "Gov & BCS Job Photo Sizer Studio",
    banglaTitle: "বিসিএস ও সরকারি চাকরি ছবি ও স্বাক্ষর রিসাইজার",
    description: "BCS & Teletalk 300x300px (<100KB) photo & 300x80px (<60KB) signature crop, BD E-Passport, US/Schengen Visa presets, and printable 4R 8-photo sheet.",
    category: "Media & Studio",
    popularityScore: 99,
    impactScore: 99,
    date: "2026-11-15",
    badge: "Gov & Visa Hero",
    href: "/tools/gov-photo-sizer",
    agentName: "GovDoc",
    agentSlug: "gov-doc",
    icon: UserCheck,
    tags: ["bcs photo", "teletalk", "signature 300x80", "passport photo", "visa photo", "4r sheet"],
  },
  {
    id: "remittance-calculator",
    slug: "remittance-calculator",
    title: "Freelancer Remittance & 2.5% Incentive Calculator",
    banglaTitle: "রেমিট্যান্স ও সরকারি ২.৫% নগদ প্রণোদনা ক্যালকুলেটর",
    description: "Compare Payoneer, Wise, Upwork, and SWIFT to Bangladesh Bank (with 2.5% cash incentive) vs bKash/Nagad payout, hidden spreads, and summary sheet export.",
    category: "Business & POS",
    popularityScore: 98,
    impactScore: 99,
    date: "2026-11-15",
    badge: "Freelancer Hero",
    href: "/tools/remittance-calculator",
    agentName: "RemitAdvisor",
    agentSlug: "remit-advisor",
    icon: DollarSign,
    tags: ["remittance", "2.5 incentive", "payoneer", "wise", "upwork", "bkash remittance", "bangladesh bank"],
  },
  {
    id: "email-signature",
    slug: "email-signature",
    title: "Executive HTML Email Signature Studio",
    banglaTitle: "এইচটিএমএল ইমেইল সিগনেচার স্টুডিও",
    description: "Generate clean, responsive inline-table email signatures for Gmail and Outlook with social badges, CTA banners, and 1-click rich-text paste.",
    category: "Business & POS",
    popularityScore: 96,
    impactScore: 95,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/email-signature",
    agentName: "BizDesk BD",
    agentSlug: "bizdesk-bd",
    icon: Mail,
    tags: ["email signature", "gmail signature", "outlook html", "vcard", "cta banner"],
  },
  {
    id: "quick-reply-hub",
    slug: "quick-reply-hub",
    title: "F-Commerce & WhatsApp Quick Reply Hub",
    banglaTitle: "এফ-কমার্স ও হোয়াটসঅ্যাপ কুইক রিপ্লাই হাব",
    description: "36+ curated Bangla, Banglish, and English customer support macros for orders, delivery, bKash, and returns with dynamic variable injection and wa.me launcher.",
    category: "Business & POS",
    popularityScore: 97,
    impactScore: 96,
    date: "2026-11-15",
    badge: "F-Commerce Hero",
    href: "/tools/quick-reply-hub",
    agentName: "SupportMacro",
    agentSlug: "support-macro",
    icon: MessageCircle,
    tags: ["f-commerce", "whatsapp reply", "baki reminder", "customer support", "bangla macros"],
  },
  {
    id: "unit-land-converter",
    slug: "unit-land-converter",
    title: "BD Land Measurement & BAJUS Gold Converter",
    banglaTitle: "জমি পরিমাপ (শতক-কাঠা-বিঘা) ও স্বর্ণের ভরি ক্যালকুলেটর",
    description: "Authentic Bangladeshi land conversion (Decimal, Katha, Bigha, Acre, Sq.Ft) with visual plot illustrator plus BAJUS Gold Vori, Ana, Ratti & 5% VAT estimator.",
    category: "Business & POS",
    popularityScore: 98,
    impactScore: 98,
    date: "2026-11-15",
    badge: "BD Essential",
    href: "/tools/unit-land-converter",
    agentName: "BizDesk BD",
    agentSlug: "bizdesk-bd",
    icon: Scale,
    tags: ["land converter", "shotok", "katha", "bigha", "bajus gold", "vori", "ana", "gold price bd"],
  },
  {
    id: "document-scanner",
    slug: "document-scanner",
    title: "Adaptive Document Scanner & Shadow Remover",
    banglaTitle: "ডকুমেন্ট স্ক্যানার ও শ্যাডো রিমুভার",
    description: "Transform shadowed mobile camera photos of deeds, receipts, and memos into crisp white photocopy scans with 4-corner perspective deskew and PDF export.",
    category: "Media & Studio",
    popularityScore: 98,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Everyday Studio",
    href: "/tools/document-scanner",
    agentName: "KhataVision",
    agentSlug: "khatavision",
    icon: ScanLine,
    tags: ["document scanner", "camscanner", "shadow removal", "perspective deskew", "photocopy pdf"],
  },
  {
    id: "typing-speed-arena",
    slug: "typing-speed-arena",
    title: "Typing Speed Arena & Certificate Studio",
    banglaTitle: "টাইপিং স্পিড এরিনা ও ভেরিফায়েড সার্টিফিকেট",
    description: "Interactive WPM and accuracy benchmark across Bangla Unicode, English prose, code, and Linux CLI with live mechanical sound, sparkline, and certificate PNG.",
    category: "DevOps & Linux",
    popularityScore: 99,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Skill Benchmark",
    href: "/tools/typing-speed-arena",
    agentName: "KernelMaster",
    agentSlug: "kernel-master",
    icon: Keyboard,
    tags: ["typing speed", "wpm test", "bangla typing", "monkeytype", "certificate"],
  },
  {
    id: "color-design-lab",
    slug: "color-design-lab",
    title: "Color Design Lab & WCAG Contrast Studio",
    banglaTitle: "কালার ডিজাইন ল্যাব ও টেইলউইন্ড প্যালেট স্টুডিও",
    description: "Perceptual 50-950 Tailwind v4 palette generator, live WCAG 2.1 AA/AAA contrast matrix, frosted glassmorphism CSS generator, and @theme token export.",
    category: "Media & Studio",
    popularityScore: 96,
    impactScore: 96,
    date: "2026-11-15",
    badge: "Design System",
    href: "/tools/color-design-lab",
    agentName: "DesignToken",
    agentSlug: "design-token",
    icon: Palette,
    tags: ["tailwind colors", "wcag contrast", "color palette", "glassmorphism", "design tokens"],
  },
  {
    id: "bangla-converter",
    slug: "bangla-converter",
    title: "Bijoy ↔ Unicode Bangla & Application Studio",
    banglaTitle: "বিজয় ও ইউনিকোড কনভার্টার এবং সরকারি দরখাস্ত",
    description: "Pure client-side bi-directional Bijoy (SutonnyMJ) to Unicode UTF-8 Bangla converter with 12 ready-to-use official administrative application templates.",
    category: "Business & POS",
    popularityScore: 98,
    impactScore: 99,
    date: "2026-11-15",
    badge: "Official Bangla",
    href: "/tools/bangla-converter",
    agentName: "BanglaScribe",
    agentSlug: "bangla-scribe",
    icon: Languages,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["bijoy", "unicode", "sutonnymj", "avro", "official application", "gd format", "bank dorkhashto"],
  },
  {
    id: "medicine-scheduler",
    slug: "medicine-scheduler",
    title: "Prescription Dose Chart & Pill Refill Studio",
    banglaTitle: "প্রেসক্রিপশন ডোজ চার্ট ও ওষুধের হিসাব",
    description: "Convert doctor prescription doses (1+0+1) into printable family wall posters, calculate exact pill refills & pharmacy costs, and export calendar alarms (.ics).",
    category: "Business & POS",
    popularityScore: 96,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Family Health",
    href: "/tools/medicine-scheduler",
    agentName: "HealthRoutine",
    agentSlug: "health-routine",
    icon: Pill,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["medicine", "prescription", "dose chart", "pill refill", "health", "alarm", "ics", "oshudh", "osudh", "daktar"],
  },
  {
    id: "cgpa-calculator",
    slug: "cgpa-calculator",
    title: "SSC / HSC / NU / University CGPA & Target Grade Studio",
    banglaTitle: "এসএসসি, এইচএসসি ও বিশ্ববিদ্যালয় সিজিপিএ ক্যালকুলেটর",
    description: "Exact Bangladesh Education Board SSC/HSC GPA with 4th-subject bonus, UGC University semester CGPA, reverse target GPA solver, and result cards.",
    category: "Business & POS",
    popularityScore: 97,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Education Hero",
    href: "/tools/cgpa-calculator",
    agentName: "AcademicCoach",
    agentSlug: "academic-coach",
    icon: GraduationCap,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "student",
    tags: ["ssc gpa", "hsc gpa", "cgpa calculator", "ugc", "4th subject bonus", "target gpa"],
  },
  {
    id: "family-budget-zakat",
    slug: "family-budget-zakat",
    title: "Family Monthly Hisab, DPS/FDR & Islamic Zakat Studio",
    banglaTitle: "ফ্যামিলি মাসিক বাজেট ও ইসলামিক যাকাত ক্যালকুলেটর",
    description: "50/30/20 Bangla family budgeting, bank DPS/FDR maturity with TIN tax deduction, and authentic BAJUS gold/silver Nisab Zakat math at 2.5%.",
    category: "Business & POS",
    popularityScore: 97,
    impactScore: 99,
    date: "2026-11-15",
    badge: "Islamic Finance",
    href: "/tools/family-budget-zakat",
    agentName: "FamilyCFO",
    agentSlug: "family-cfo",
    icon: Coins,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["family budget", "zakat", "nisab", "dps", "fdr", "bajus gold", "hisab"],
  },
  {
    id: "electricity-solar-calculator",
    slug: "electricity-solar-calculator",
    title: "BD Electricity Bill (LT-A Slab) & Home IPS/Solar Sizer",
    banglaTitle: "বিদ্যুৎ বিল হিসাব ও আইপিএস-সোলার সাইজার",
    description: "Official BERC residential LT-A step-tariff billing calculator with demand charge and 5% VAT, plus home IPS VA, battery Ah, and solar sizing.",
    category: "Business & POS",
    popularityScore: 97,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Utility Sizer",
    href: "/tools/electricity-solar-calculator",
    agentName: "PowerGrid",
    agentSlug: "power-grid",
    icon: Zap,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["electricity bill", "desco", "dpdc", "palli bidyut", "ips sizer", "solar calculator", "berc", "biddyut", "bidyut", "current bill"],
  },
  {
    id: "house-rent-studio",
    slug: "house-rent-studio",
    title: "House Rent Receipt, To-Let Poster & Tenant Agreement",
    banglaTitle: "বাড়ি ভাড়ার রশিদ, টু-লেট পোস্টার ও চুক্তিপত্র",
    description: "Dual-copy rent receipt with Bangla Taka words, high-contrast printable A4 To-Let poster with WhatsApp QR code, and standard tenancy agreements.",
    category: "Business & POS",
    popularityScore: 95,
    impactScore: 96,
    date: "2026-11-15",
    badge: "Property Utility",
    href: "/tools/house-rent-studio",
    agentName: "PropertyDesk",
    agentSlug: "property-desk",
    icon: Home,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["house rent", "rent receipt", "to-let poster", "tenancy agreement", "dmp tenant", "vara", "badi bhara", "to let"],
  },
  {
    id: "age-health-card",
    slug: "age-health-card",
    title: "Exact Job Age Calculator, BMI/BMR & Emergency Medical ID",
    banglaTitle: "চাকরির বয়স ক্যালকুলেটর, বিএমআই ও জরুরি স্বাস্থ্য কার্ড",
    description: "Calendar-exact age with BCS/Govt cutoff validation, Mifflin-St Jeor BMI/BMR diet targets, and wallet-sized Emergency Medical ID card.",
    category: "Business & POS",
    popularityScore: 96,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Health & Career",
    href: "/tools/age-health-card",
    agentName: "AgeHealthBot",
    agentSlug: "age-health-bot",
    icon: HeartPulse,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "student",
    tags: ["age calculator", "bcs age limit", "bmi", "bmr", "emergency medical card"],
  },
  {
    id: "event-dawat-planner",
    slug: "event-dawat-planner",
    title: "Dawat, Wedding & Picnic Raw Catering Sizer & Chanda Split",
    banglaTitle: "দাওয়াতি ক্যাটারিং ও পিকনিক চাঁদা হিসাব",
    description: "Per-head raw ingredient sizing in kg/liters for Kacchi/Polao/Roast feasts, equitable multi-person Chanda cost splitting, and pass cards.",
    category: "Business & POS",
    popularityScore: 94,
    impactScore: 95,
    date: "2026-11-15",
    badge: "Catering Sizer",
    href: "/tools/event-dawat-planner",
    agentName: "DawatChef",
    agentSlug: "dawat-chef",
    icon: UtensilsCrossed,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["dawat planner", "catering calculator", "kacchi biryani", "picnic chanda", "cost split", "dawat", "biyer khabar", "chanda"],
  },
  {
    id: "tax-sanchaypatra-emi",
    slug: "tax-sanchaypatra-emi",
    title: "BD Income Tax, Sanchaypatra Net Profit & Bank Loan EMI",
    banglaTitle: "আয়কর, সঞ্চয়পত্র মুনাফা ও ব্যাংক লোন ইএমআই",
    description: "FY 2025-26 individual income tax slabs (Tk 3.5L exempt), Sanchaypatra tiered net monthly profit with 5%/10% tax, and reducing EMI schedules.",
    category: "Business & POS",
    popularityScore: 98,
    impactScore: 99,
    date: "2026-11-15",
    badge: "Tax & Wealth",
    href: "/tools/tax-sanchaypatra-emi",
    agentName: "TaxAuditPro",
    agentSlug: "tax-audit-pro",
    icon: Receipt,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "business",
    tags: ["income tax bd", "sanchaypatra", "emi calculator", "nbr", "tax slabs", "kisti", "aykor", "shonchoypotro", "zakat"],
  },
  {
    id: "social-text-styler",
    slug: "social-text-styler",
    title: "Social Bold Unicode Text & Viral Caption Hook Styler",
    banglaTitle: "ফেসবুক ও সোশ্যাল বোল্ড টেক্সট স্টাইলার",
    description: "Convert normal text into Bold Sans, Serif, Monospace, Script, and Bubble Unicode glyphs with 20+ battle-tested viral Facebook/LinkedIn hooks.",
    category: "Media & Studio",
    popularityScore: 95,
    impactScore: 96,
    date: "2026-11-15",
    badge: "Viral Copy",
    href: "/tools/social-text-styler",
    agentName: "CopyViral",
    agentSlug: "copy-viral",
    icon: Type,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "freelance",
    tags: ["bold text", "unicode font", "facebook caption", "linkedin hook", "styler"],
  },
  {
    id: "password-vault-hash",
    slug: "password-vault-hash",
    title: "AES-GCM Encrypted Note, Passphrase & Cryptographic Hash Studio",
    banglaTitle: "এনক্রিপ্টেড নোট ও পাসওয়ার্ড ভল্ট স্টুডিও",
    description: "Military-grade in-browser AES-256-GCM note encryption with PBKDF2 key derivation, Diceware passphrase generator, and SHA-256/512 checksums.",
    category: "Security & Privacy",
    popularityScore: 97,
    impactScore: 98,
    date: "2026-11-15",
    badge: "Client-Crypto",
    href: "/tools/password-vault-hash",
    agentName: "CryptoShield",
    agentSlug: "crypto-shield",
    icon: KeyRound,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "developer",
    tags: ["aes-gcm", "encryption", "password generator", "sha256", "diceware", "zero knowledge"],
  },
  {
    id: "embed-widget-studio",
    slug: "embed-widget-studio",
    title: "Embeddable Website Widget & Calculator Studio",
    banglaTitle: "ওয়েবসাইট উইজেট ও ক্যালকুলেটর এমবেড স্টুডিও",
    description: "Generate responsive iframe and JavaScript embed codes for 8 popular tools to embed calculators directly on external blogs, media sites, and stores.",
    category: "DevOps & Linux",
    popularityScore: 96,
    impactScore: 97,
    date: "2026-11-15",
    badge: "Widget Hub",
    href: "/tools/embed-widget-studio",
    agentName: "AutonomousCurator",
    agentSlug: "autonomous-curator",
    icon: Code,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "developer",
    tags: ["embed widget", "iframe generator", "backlink", "external widget", "calculators"],
  },
  {
    id: "id-card-stitcher",
    slug: "id-card-stitcher",
    title: "NID & Dual-Side ID Card Smart Stitcher + Safety Watermark",
    banglaTitle: "এনআইডি ও স্মার্ট কার্ড ২-পার্শ্ব A4 প্রিন্ট ও ওয়াটারমার্ক",
    description: "Photocopy and print Front & Back of National ID (NID), Smart Card, Driving License, or Student ID onto a single aligned A4 sheet with anti-misuse safety watermarks.",
    category: "Security & Privacy",
    popularityScore: 99,
    impactScore: 100,
    date: "2026-11-15",
    badge: "Anti-Misuse NID",
    href: "/tools/id-card-stitcher",
    agentName: "IdentityShield",
    agentSlug: "identity-shield",
    icon: CreditCard,
    isNew: true,
    addedAt: "2026-11-15",
    lifePersona: "everyday",
    tags: ["nid stitcher", "smart card print", "nid photocopy", "nid watermark", "id card a4", "driving license print", "dual side id", "bangladesh nid"],
  },
];

// ---------------------------------------------------------------------------
// Main Tools Suite with Universal Filter & Sort
// ---------------------------------------------------------------------------
export function ToolsSuite() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All (56)");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const { isPinned, togglePin } = usePinnedAndRecents();

  const categories = [
    "All (56)",
    "Media & Studio",
    "Business & POS",
    "Security & Privacy",
    "DevOps & Linux",
    "Database & SQL",
  ];

  // Filter and sort super tools
  const filteredSuperTools = useMemo(() => {
    let list = SUPER_TOOLS_CATALOG;

    if (selectedCategory !== "All (55)") {
      list = list.filter((tool) => tool.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (tool) =>
          tool.title.toLowerCase().includes(q) ||
          tool.banglaTitle.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return sortItems(list, sortBy, {
      getPopularity: (t) => t.popularityScore,
      getImpact: (t) => t.impactScore,
      getTitle: (t) => t.title,
      getDate: (t) => t.date,
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Determine which embedded dev tools match category/search
  const showDevTools = useMemo(() => {
    if (selectedCategory === "All (43)") return true;
    if (selectedCategory === "Database & SQL") return true;
    if (selectedCategory === "DevOps & Linux") return true;
    if (selectedCategory === "Business & POS") return true;
    if (selectedCategory === "Security & Privacy") return true;
    return false;
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Pinned & Recent Tools Quick Bar */}
      <PinnedAndRecentBar />

      {/* Universal Search, Filter & Sort Bar */}
      <UniversalFilterSortBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search 43 tools by name, tag, or utility (e.g. bcs, remittance, land, typing, subnet)..."
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={43}
        filteredCount={filteredSuperTools.length + (showDevTools ? 9 : 0)}
      />

      {/* 34 Everyday & Business Super-Tools Showcase */}
      {filteredSuperTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-wider text-ink-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Dedicated Super Studios ({filteredSuperTools.length})
            </h3>
            <span className="text-xs font-mono text-ink-3">Click to open dedicated studio</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuperTools.map((tool) => {
              const Icon = tool.icon;
              const pinned = isPinned(tool.slug);
              return (
                <div
                  key={tool.id}
                  className="group relative p-5 rounded-2xl bg-surface border border-line hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            togglePin(tool.slug);
                            sound.toggleSwitch();
                          }}
                          aria-label={pinned ? `Unpin ${tool.title}` : `Pin ${tool.title}`}
                          className={`p-1.5 rounded-lg border transition-all ${
                            pinned
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-surface text-ink-3 hover:text-amber-400 border-line hover:border-amber-500/30"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${pinned ? "fill-amber-400" : ""}`} />
                        </button>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {tool.badge}
                        </span>
                        <span className="text-[10px] font-mono text-ink-3">
                          🔥 {tool.popularityScore}
                        </span>
                      </div>
                    </div>

                    <Link href={tool.href} className="block">
                      <h4 className="text-base font-bold text-ink group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {tool.title}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </h4>
                      <p className="text-xs text-primary/80 font-medium mt-0.5">{tool.banglaTitle}</p>
                      <p className="text-xs text-ink-2 mt-2 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </Link>

                    {/* Interactive Animated Micro-Preview */}
                    <div className="pt-2">
                      <ToolCardMicroPreview slug={tool.slug} category={tool.category} />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-ink-3 flex items-center gap-1">
                      <Bot className="w-3 h-3 text-primary" />
                      {tool.agentName}
                    </span>
                    <Link
                      href={tool.href}
                      className="text-primary font-semibold hover:underline"
                    >
                      Open Studio →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embedded Developer Sandboxes Section */}
      {showDevTools && (
        <div className="space-y-4 pt-6 border-t border-line">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-wider text-ink-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              In-Browser Developer &amp; Sysadmin Sandboxes
            </h3>
            <span className="text-xs font-mono text-emerald-500 font-semibold">100% Client-Side</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {/* SQL Sandbox */}
            {(selectedCategory === "All (43)" || selectedCategory === "Database & SQL") && <SqlSandboxTool />}

            {/* POS & Security */}
            {(selectedCategory === "All (43)" || selectedCategory === "Business & POS") && <ThermalReceiptTool />}
            {(selectedCategory === "All (43)" || selectedCategory === "Security & Privacy" || selectedCategory === "DevOps & Linux") && (
              <JwtInspectorTool />
            )}

            {/* DevOps & System Tools */}
            {(selectedCategory === "All (43)" || selectedCategory === "DevOps & Linux") && (
              <>
                <DockerNginxTool />
                <CronTimerTool />
                <SubnetTool />
                <ChmodTool />
                <TimeTool />
              </>
            )}

            {(selectedCategory === "All (43)" || selectedCategory === "Database & SQL") && <JsonTool />}

            {(selectedCategory === "All (43)" || selectedCategory === "Business & POS") && (
              <>
                <EcommerceMarginTool />
                <RcoPromptTool />
                <Base64Tool />
              </>
            )}
          </div>
        </div>
      )}

      {/* Cross-Link Arcade Banner */}
      <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-primary font-bold">Arcade Challenge Mode</span>
          <h3 className="text-base font-bold text-ink mt-0.5">Ready to test your real-time skills under pressure?</h3>
          <p className="text-xs text-ink-2 mt-1">
            Jump into the 5 playable games in THE SABBiR OS Arcade to compete on the global leaderboard and download viral scorecards.
          </p>
        </div>
        <Link
          href="/games"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-mono font-bold hover:bg-primary-hover shadow-md transition shrink-0"
        >
          Launch Arcade Hub <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
