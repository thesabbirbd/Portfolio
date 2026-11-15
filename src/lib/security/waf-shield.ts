import { hashIp } from "./crypto-auth";

export type RouteCategory = "general" | "auth" | "share" | "superadmin" | "export";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  retryAfterSec?: number;
}

interface Bucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRatePerMs: number;
}

const RATE_LIMIT_CONFIGS: Record<RouteCategory, { maxTokens: number; windowMs: number }> = {
  general: { maxTokens: 60, windowMs: 60_000 },       // 60 req / min
  auth: { maxTokens: 12, windowMs: 60_000 },          // 12 req / min
  share: { maxTokens: 25, windowMs: 60_000 },         // 25 req / min
  superadmin: { maxTokens: 15, windowMs: 60_000 },    // 15 req / min
  export: { maxTokens: 40, windowMs: 60_000 },        // 40 req / min
};

// In-memory token buckets map: `${category}:${ip}` -> Bucket
const buckets = new Map<string, Bucket>();

// Maximum size of in-memory threat ring-buffer
const MAX_THREAT_LOGS = 250;

export interface ThreatLog {
  id: string;
  ipHash: string;
  route: string;
  threatType: "sqli" | "xss" | "path_traversal" | "ddos" | "rce";
  payloadSnippet: string;
  blocked: boolean;
  createdAt: string;
}

const threatLogsRingBuffer: ThreatLog[] = [];

/**
 * Check rate limit using Token Bucket algorithm with Sliding Window replenishment.
 */
export function checkRateLimit(
  ip: string,
  category: RouteCategory | string = "general",
  options?: { customLimit?: number; customWindowMs?: number }
): RateLimitResult {
  const cleanIp = ip || "127.0.0.1";
  const catStr = String(category || "general").toLowerCase();
  const resolvedCategory: RouteCategory = catStr.includes("auth")
    ? "auth"
    : catStr.includes("share")
    ? "share"
    : catStr.includes("superadmin")
    ? "superadmin"
    : catStr.includes("export")
    ? "export"
    : "general";

  const key = `${resolvedCategory}:${cleanIp}`;
  const now = Date.now();

  const cfg = RATE_LIMIT_CONFIGS[resolvedCategory] || RATE_LIMIT_CONFIGS.general;
  const maxTokens = options?.customLimit ?? cfg.maxTokens;
  const windowMs = options?.customWindowMs ?? cfg.windowMs;
  const refillRatePerMs = maxTokens / windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = {
      tokens: maxTokens,
      lastRefill: now,
      maxTokens,
      refillRatePerMs,
    };
    buckets.set(key, bucket);
  }

  // Refill tokens based on time elapsed
  const elapsed = Math.max(0, now - bucket.lastRefill);
  bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + elapsed * bucket.refillRatePerMs);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    const remaining = Math.floor(bucket.tokens);
    const resetMs = Math.ceil((bucket.maxTokens - bucket.tokens) / bucket.refillRatePerMs);
    return {
      allowed: true,
      remaining,
      resetMs,
    };
  }

  // Limit exceeded
  const retryAfterSec = Math.max(1, Math.ceil((1 - bucket.tokens) / (bucket.refillRatePerMs * 1000)));
  const ipH = hashIp(cleanIp);
  logThreat({
    ipHash: ipH,
    route: `rate-limit:${resolvedCategory}`,
    threatType: "ddos",
    payloadSnippet: `Burst rate exceeded in ${resolvedCategory} bucket (${maxTokens}/${Math.round(windowMs / 1000)}s)`,
    blocked: true,
  });

  return {
    allowed: false,
    remaining: 0,
    resetMs: retryAfterSec * 1000,
    retryAfterSec,
  };
}

/**
 * SQL Injection (SQLi) Detection Patterns.
 * Uses high-specificity regexes to avoid false positives on natural text, Bangla descriptions,
 * or markdown content.
 */
const SQLI_PATTERNS: Array<{ regex: RegExp; name: string }> = [
  // UNION SELECT attacks
  { regex: /\bunion(\s+all)?\s+select\b/i, name: "UNION_SELECT" },
  // Boolean-based tautology: OR 1=1, OR 'a'='a', ' OR '1'='1', OR '' = ''
  { regex: /\b(or|and)\s+['"]?(\w*)['"]?\s*=\s*['"]?\2['"]?/i, name: "BOOLEAN_TAUTOLOGY" },
  // SQL comments combined with quotes or statement terminators
  { regex: /['";]\s*(--|\/\*)/i, name: "SQL_COMMENT_INJECTION" },
  // Stacked queries: ; DROP TABLE, ; ALTER TABLE, ; TRUNCATE, ; EXEC
  { regex: /;\s*(drop|alter|truncate|delete|insert|update|create|exec|waitfor)\s+/i, name: "STACKED_QUERY" },
  // Dangerous time-based functions
  { regex: /\b(sleep\s*\(\s*\d+\s*\)|benchmark\s*\(|waitfor\s+delay)\b/i, name: "TIME_BASED_BLIND" },
  // Command execution
  { regex: /\b(xp_cmdshell|exec\s+sp_executesql|exec\s+xp_)\b/i, name: "XP_CMDSHELL" },
  // MySQL conditional comment evasion
  { regex: /\/\*!\d*.*?\*\//i, name: "COMMENT_EVASION" },
];

/**
 * Cross-Site Scripting (XSS) Detection Patterns.
 */
const XSS_PATTERNS: Array<{ regex: RegExp; name: string }> = [
  { regex: /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/i, name: "SCRIPT_TAG" },
  { regex: /<\s*script[^>]*>/i, name: "UNCLOSED_SCRIPT_TAG" },
  { regex: /javascript\s*:/i, name: "JAVASCRIPT_URI" },
  { regex: /data\s*:\s*text\/html/i, name: "DATA_HTML_URI" },
  { regex: /\bon(error|load|click|mouseover|focus|blur|mouseenter|pointerdown)\s*=/i, name: "INLINE_EVENT_HANDLER" },
  { regex: /<[a-z0-9_-]+\b[^>]*\bon[a-z]+\s*=/i, name: "TAG_WITH_EVENT_HANDLER" },
  { regex: /<\s*(iframe|object|embed|applet)[^>]*>/i, name: "DANGEROUS_DOM_CONTAINER" },
];

/**
 * Path Traversal Patterns.
 */
const PATH_TRAVERSAL_PATTERNS: Array<{ regex: RegExp; name: string }> = [
  { regex: /(\.\.[\/\\]|\.\.%2f|\.\.%5c|\.\.\/\/)/i, name: "DIRECTORY_TRAVERSAL" },
  { regex: /(etc|proc|sys)[\/\\](passwd|shadow|hosts)/i, name: "SENSITIVE_UNIX_PATH" },
  { regex: /(windows|winnt)[\/\\]system32/i, name: "SENSITIVE_WIN_PATH" },
];

export interface PayloadInspectionResult {
  safe: boolean;
  threats: string[];
  threatType?: "sqli" | "xss" | "path_traversal" | "rce";
  offendingSnippet?: string;
}

/**
 * Deep inspection of string or object payload for SQLi, XSS, and Path Traversal.
 */
export function inspectPayloadSecurity(payload: unknown, contextRoute?: string, ip?: string): PayloadInspectionResult {
  const threats: string[] = [];
  let threatType: PayloadInspectionResult["threatType"] = undefined;
  let offendingSnippet: string | undefined = undefined;

  function scanString(str: string): boolean {
    if (!str || typeof str !== "string") return false;

    let decoded = str;
    try {
      decoded = decodeURIComponent(str);
    } catch {
      decoded = str;
    }

    // Fast path: if neither raw nor decoded string has any suspicious tokens, skip
    if (!/[<>';=/\-*\\%]|union|select|drop|alter|exec|table|passwd|shadow/i.test(decoded)) {
      return false;
    }

    const candidates = decoded !== str ? [str, decoded] : [str];

    for (const cand of candidates) {
      // 1. Check SQLi
      for (const { regex, name } of SQLI_PATTERNS) {
        if (regex.test(cand)) {
          threats.push(`SQLi:${name}`);
          threatType = "sqli";
          offendingSnippet = str.slice(0, 120);
          return true;
        }
      }

      // 2. Check XSS
      for (const { regex, name } of XSS_PATTERNS) {
        if (regex.test(cand)) {
          threats.push(`XSS:${name}`);
          threatType = "xss";
          offendingSnippet = str.slice(0, 120);
          return true;
        }
      }

      // 3. Check Path Traversal
      for (const { regex, name } of PATH_TRAVERSAL_PATTERNS) {
        if (regex.test(cand)) {
          threats.push(`PathTraversal:${name}`);
          threatType = "path_traversal";
          offendingSnippet = str.slice(0, 120);
          return true;
        }
      }
    }

    return false;
  }

  function traverse(node: unknown, depth = 0): void {
    if (depth > 12) return; // Guard against circular/deeply nested objects
    if (threats.length > 0) return; // Stop on first hit

    if (typeof node === "string") {
      scanString(node);
    } else if (Array.isArray(node)) {
      for (const item of node) {
        traverse(item, depth + 1);
        if (threats.length > 0) break;
      }
    } else if (node && typeof node === "object") {
      for (const [key, val] of Object.entries(node)) {
        // Also check object keys for injection
        if (scanString(key)) break;
        traverse(val, depth + 1);
        if (threats.length > 0) break;
      }
    }
  }

  traverse(payload);

  const safe = threats.length === 0;

  if (!safe && threatType) {
    const ipH = ip ? hashIp(ip) : "anon";
    logThreat({
      ipHash: ipH,
      route: contextRoute || "unknown",
      threatType,
      payloadSnippet: offendingSnippet || "Suspicious payload blocked by AST scanner",
      blocked: true,
    });
  }

  return {
    safe,
    threats,
    threatType,
    offendingSnippet,
  };
}

/**
 * Log a threat event to the ring buffer.
 */
export function logThreat(threat: Omit<ThreatLog, "id" | "createdAt">): ThreatLog {
  const entry: ThreatLog = {
    id: `threat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...threat,
    createdAt: new Date().toISOString(),
  };

  threatLogsRingBuffer.unshift(entry);
  if (threatLogsRingBuffer.length > MAX_THREAT_LOGS) {
    threatLogsRingBuffer.pop();
  }
  return entry;
}

/**
 * Retrieve recent security threat logs for SuperAdmin inspection.
 */
export function getThreatLogs(limit: number = 50): ThreatLog[] {
  return threatLogsRingBuffer.slice(0, limit);
}

/**
 * Clear in-memory threat logs (for testing or admin maintenance).
 */
export function clearThreatLogs(): void {
  threatLogsRingBuffer.length = 0;
}

/**
 * Reset rate limit buckets (for testing).
 */
export function resetRateLimits(): void {
  buckets.clear();
}
