"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Play, Database, Layers, ArrowUpRight, Cpu, Server, Shield } from "lucide-react";
import { sound } from "@/lib/sound";

interface ApiEndpoint {
  id: string;
  method: "GET" | "POST";
  path: string;
  category: string;
  title: string;
  description: string;
  queryParams?: Record<string, string>;
  requestBody?: object;
  sqlQuery?: string;
  mockResponse: object;
  expectedLatencyMs: number;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "fefo-inventory",
    method: "GET",
    path: "/api/v1/inventory/batches/fefo",
    category: "Aiyaar Pharmacy & POS",
    title: "FEFO Batch Expiry Queue",
    description: "Queries batch-level medicine stock prioritized by nearest expiry date with automated status flags.",
    queryParams: {
      shop_id: "rajshahi-pharmacy-01",
      days_threshold: "60",
    },
    sqlQuery: `SELECT b.batch_no, p.name AS medicine_name, b.expiry_date, b.stock_qty,
       CASE 
         WHEN b.expiry_date <= CURRENT_DATE THEN 'QUARANTINE_EXPIRED'
         WHEN b.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'CRITICAL_30D'
         ELSE 'ACTIVE_SAFE'
       END AS quarantine_status
FROM inventory_batches b
JOIN products p ON b.product_id = p.id
WHERE b.shop_id = 'rajshahi-pharmacy-01'
ORDER BY b.expiry_date ASC
LIMIT 10;`,
    mockResponse: {
      status: "success",
      query_timestamp: "2026-11-15T00:10:00Z",
      batches_count: 3,
      data: [
        { batch_no: "B-8810", medicine_name: "Amoxicillin 500mg", expiry_date: "2026-12-05", stock_qty: 48, quarantine_status: "CRITICAL_30D" },
        { batch_no: "B-9021", medicine_name: "Azithromycin 250mg", expiry_date: "2026-12-28", stock_qty: 120, quarantine_status: "CRITICAL_30D" },
        { batch_no: "B-9430", medicine_name: "Paracetamol 500mg", expiry_date: "2027-04-15", stock_qty: 500, quarantine_status: "ACTIVE_SAFE" },
      ],
    },
    expectedLatencyMs: 1.4,
  },
  {
    id: "local-ai-orchestration",
    method: "POST",
    path: "/api/v1/ai/orchestrate",
    category: "StudyOS & Local AI",
    title: "Local LLM Ledger Extraction",
    description: "Extracts structured debit/credit JSON from raw Bengali text via local Ollama without cloud tokens.",
    requestBody: {
      model: "qwen2.5:0.5b",
      raw_text: "রহিম স্টোরের বাকি বিক্রি: প্যারাসিটামল ৪ পাতা ১২০ টাকা, ক্যাশ দিল ৫০ টাকা বাকি ৭০ টাকা।",
      temperature: 0.1,
    },
    sqlQuery: `-- Execution Pipeline:
-- 1. Tokenize Input -> Quantized GGUF Q4_K_M
-- 2. GPU Compute offloaded to NVIDIA MX350 (2GB VRAM)
-- 3. JSON Schema Enforcer: Validate debit + credit balance
-- 4. Emit structured event to local SQLite WAL queue`,
    mockResponse: {
      status: "parsed",
      model: "qwen2.5:0.5b-instruct-q4",
      tokens_per_sec: 28.4,
      structured_output: {
        customer: "Rahim Store",
        total_amount: 120.0,
        paid_amount: 50.0,
        due_amount: 70.0,
        items: [{ name: "Paracetamol", quantity: 4, unit: "strip" }],
      },
      audit: { zero_cloud_leak: true, cost_usd: 0.0 },
    },
    expectedLatencyMs: 98.6,
  },
  {
    id: "mikrotik-telemetry",
    method: "GET",
    path: "/api/v1/network/telemetry",
    category: "NOC & Homelab",
    title: "MikroTik Gateway Health",
    description: "Fetches dual-WAN latency metrics, ping loss counters, and failover status from RouterOS.",
    queryParams: {
      router_id: "hex-rb750gr3-bench",
    },
    sqlQuery: `SELECT r.router_id, r.model, t.ping_latency_ms, t.packet_loss_pct,
       t.wan1_status, t.wan2_status, t.active_gateway, t.recorded_at
FROM noc_routers r
JOIN router_telemetry t ON r.id = t.router_id
WHERE r.router_id = 'hex-rb750gr3-bench'
ORDER BY t.recorded_at DESC
LIMIT 1;`,
    mockResponse: {
      router: "MikroTik hEX (RB750Gr3)",
      routeros_version: "v7.16 LTS",
      telemetry: {
        wan1_ping_latency_ms: 4.1,
        wan2_ping_latency_ms: 17.8,
        packet_loss_pct: 0.0,
        active_gateway: "ether1-fiber-primary",
        failover_state: "STANDBY_READY",
        uptime: "48 days, 14 hours, 22 mins",
      },
    },
    expectedLatencyMs: 2.1,
  },
  {
    id: "offline-pos-sync",
    method: "POST",
    path: "/api/v1/pos/khata/sync",
    category: "Offline Architecture",
    title: "Idempotent POS Sync",
    description: "Uploads an offline SQLite queue of cash memos to central PostgreSQL with idempotent replay protection.",
    requestBody: {
      device_id: "pos-terminal-04",
      idempotency_key: "tx-20261114-8841-99",
      transactions: [
        { type: "cash_sale", amount: 850.0, memo: "Walk-in OTC" },
        { type: "baki_credit", amount: 350.0, customer_id: "cust-412" },
      ],
    },
    sqlQuery: `INSERT INTO sales_invoices (idempotency_key, device_id, amount, status)
VALUES ('tx-20261114-8841-99', 'pos-terminal-04', 1200.00, 'COMMITTED')
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING id, idempotency_key, created_at;`,
    mockResponse: {
      status: "committed",
      idempotency_verified: true,
      records_synced: 2,
      ledger_balance_delta: { cash: "+850.00", baki_receivable: "+350.00" },
      telegram_alert_sent: true,
    },
    expectedLatencyMs: 8.5,
  },
];

export function ApiExplorer() {
  const [activeEndpointId, setActiveEndpointId] = useState(ENDPOINTS[0].id);
  const [activeTab, setActiveTab] = useState<"response" | "sql" | "curl">("response");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);

  const endpoint = ENDPOINTS.find((e) => e.id === activeEndpointId) ?? ENDPOINTS[0];

  const handleRunRequest = () => {
    sound.click();
    setIsLoading(true);
    setMeasuredLatency(null);

    setTimeout(() => {
      setIsLoading(false);
      setMeasuredLatency(endpoint.expectedLatencyMs);
      sound.success();
    }, 280);
  };

  const getCurlSnippet = () => {
    if (endpoint.method === "GET") {
      const q = endpoint.queryParams ? "?" + new URLSearchParams(endpoint.queryParams).toString() : "";
      return `curl -X GET "https://sabbir.nav.bd${endpoint.path}${q}" \\
  -H "Accept: application/json"`;
    }
    return `curl -X POST "https://sabbir.nav.bd${endpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.requestBody, null, 2)}'`;
  };

  const handleCopyCurl = () => {
    sound.copy();
    navigator.clipboard.writeText(getCurlSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Endpoint Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ENDPOINTS.map((ep) => {
          const isSelected = ep.id === activeEndpointId;
          const isGet = ep.method === "GET";
          return (
            <button
              key={ep.id}
              onClick={() => {
                sound.click();
                setActiveEndpointId(ep.id);
                setMeasuredLatency(null);
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "surface-card text-ink-2 border-line hover:border-primary/40"
              }`}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isGet
                    ? isSelected
                      ? "bg-emerald-950 text-emerald-300"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : isSelected
                    ? "bg-purple-950 text-purple-300"
                    : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}
              >
                {ep.method}
              </span>
              <span>{ep.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Request & Response Card */}
      <div className="rounded-2xl surface-card border border-line shadow-sm overflow-hidden">
        {/* URL Header Bar */}
        <div className="p-4 sm:p-5 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-surface">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs ${
                endpoint.method === "GET"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30"
              }`}
            >
              {endpoint.method}
            </span>
            <span className="font-semibold text-ink break-all">{endpoint.path}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCurl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line hover:border-primary/40 text-xs font-mono text-ink-2 hover:text-ink transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied cURL" : "Copy cURL"}</span>
            </button>
            <button
              type="button"
              onClick={handleRunRequest}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-semibold hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Executing..." : "Execute Query"}</span>
            </button>
          </div>
        </div>

        {/* Endpoint Metadata & Description */}
        <div className="p-4 sm:p-5 border-b border-line bg-muted/20">
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mb-1">
            <span>Domain: {endpoint.category}</span>
          </div>
          <p className="text-sm text-ink-2">{endpoint.description}</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 px-4 sm:px-5 pt-3 border-b border-line text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("response")}
            className={`pb-2.5 transition-colors border-b-2 font-semibold ${
              activeTab === "response"
                ? "border-primary text-primary"
                : "border-transparent text-ink-3 hover:text-ink"
            }`}
          >
            Response Payload {measuredLatency && <span className="text-emerald-500 font-bold ml-1">({measuredLatency}ms)</span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sql")}
            className={`pb-2.5 transition-colors border-b-2 font-semibold ${
              activeTab === "sql"
                ? "border-primary text-primary"
                : "border-transparent text-ink-3 hover:text-ink"
            }`}
          >
            SQL / Query Execution Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("curl")}
            className={`pb-2.5 transition-colors border-b-2 font-semibold ${
              activeTab === "curl"
                ? "border-primary text-primary"
                : "border-transparent text-ink-3 hover:text-ink"
            }`}
          >
            cURL Snippet
          </button>
        </div>

        {/* Code Content Window */}
        <div className="p-4 sm:p-5 bg-zinc-950 text-zinc-300 font-mono text-xs sm:text-sm overflow-x-auto min-h-[220px]">
          {activeTab === "response" && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500">
                <span className="text-emerald-400 font-bold">HTTP/2 200 OK</span>
                <span>Latency: {measuredLatency ?? endpoint.expectedLatencyMs}ms (In-Memory / Fast Execution)</span>
              </div>
              <pre className="text-emerald-300 leading-relaxed">
                {JSON.stringify(endpoint.mockResponse, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === "sql" && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500">
                <span className="text-cyan-400 font-bold">SQL Architecture &amp; Indexing</span>
                <span>Target: Neon Serverless PostgreSQL</span>
              </div>
              <pre className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {endpoint.sqlQuery}
              </pre>
            </div>
          )}

          {activeTab === "curl" && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-500">
                <span className="text-zinc-400">Terminal Shell Command</span>
                <span>Copy &amp; test directly in Bash</span>
              </div>
              <pre className="text-amber-300 leading-relaxed whitespace-pre-wrap">
                {getCurlSnippet()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
