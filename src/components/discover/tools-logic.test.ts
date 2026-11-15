import { describe, it, expect } from "vitest";
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
} from "./ToolsLogic";

describe("Subnet calculator", () => {
  it("calculates network, broadcast, and host count accurately", () => {
    const res = subnet("192.168.10.77/26");
    expect("rows" in res).toBe(true);
    if ("rows" in res && res.rows) {
      const map = Object.fromEntries(res.rows);
      expect(map["Network"]).toBe("192.168.10.64/26");
      expect(map["Broadcast"]).toBe("192.168.10.127");
      expect(map["Usable hosts"]).toBe("62");
    }
  });

  it("handles point-to-point /31 and invalid IP", () => {
    const p2p = subnet("10.0.0.0/31");
    if ("rows" in p2p && p2p.rows) {
      const map = Object.fromEntries(p2p.rows);
      expect(map["Usable hosts"]).toBe("2");
    }
    expect("error" in subnet("999.1.1.1/24")).toBe(true);
  });
});

describe("Base64 UTF-8 roundtrip", () => {
  it("encodes and decodes English & Bangla text without data loss", () => {
    const sample = "THE SABBiR — বাংলা ইঞ্জিনিয়ারিং ল্যাব";
    expect(b64decode(b64encode(sample))).toBe(sample);
  });
});

describe("Cron & systemd Timer Explainer", () => {
  it("parses daily midnight schedule and generates systemd timer", () => {
    const res = parseCron("0 0 * * *");
    expect(res.valid).toBe(true);
    expect(res.human).toContain("At 00:00 every day");
    expect(res.humanBn).toContain("প্রতিদিন");
    expect(res.systemdCalendar).toBe("*-*-* 00:00:00");
    expect(res.systemdTimerUnit).toContain("OnCalendar=*-*-* 00:00:00");
    expect(res.systemdServiceUnit).toContain("Type=oneshot");
  });

  it("parses interval cron like */15 * * * *", () => {
    const res = parseCron("*/15 * * * *");
    expect(res.valid).toBe(true);
    expect(res.human).toContain("Every 15 minutes");
    expect(res.systemdCalendar).toBe("*:0/15");
  });

  it("rejects invalid cron expressions", () => {
    const res = parseCron("invalid cron");
    expect(res.valid).toBe(false);
  });
});

describe("BD E-Commerce & POS Margin Calculator", () => {
  it("calculates net profit, margin % and break-even accurately", () => {
    const res = calculateEcommerceMargin({
      sellingPrice: 1200,
      productCost: 600,
      courierFee: 120,
      customerDeliveryFee: 120,
      codPercent: 1.0,
      gatewayPercent: 0,
      packagingCost: 30,
      returnRatePercent: 5,
      courierReturnFee: 60,
    });

    expect(res.totalInvoice).toBe(1320);
    expect(res.codDeduction).toBe(13.2);
    expect(res.netDeliveredProfit).toBeGreaterThan(500);
    expect(res.isProfitable).toBe(true);
    expect(res.breakEvenPrice).toBeGreaterThan(0);
    expect(res.expectedBlendedProfit).toBeGreaterThan(0);
  });

  it("flags loss-making pricing scenarios", () => {
    const res = calculateEcommerceMargin({
      sellingPrice: 200,
      productCost: 350,
      courierFee: 150,
      customerDeliveryFee: 0,
      packagingCost: 40,
      returnRatePercent: 20,
    });
    expect(res.isProfitable).toBe(false);
    expect(res.expectedBlendedProfit).toBeLessThan(0);
  });
});

describe("Docker Compose & Nginx Generator", () => {
  it("generates production docker-compose.yml and nginx.conf with postgres and ssl", () => {
    const res = generateDockerNginx({
      serviceName: "fastapi-store",
      port: 8000,
      domain: "api.store.bd",
      database: "postgres",
      enableSSL: true,
      enableRateLimit: true,
    });

    expect(res.dockerCompose).toContain("fastapi-store");
    expect(res.dockerCompose).toContain("postgres:17-alpine");
    expect(res.dockerCompose).toContain("pgdata:");
    expect(res.nginxConf).toContain("server_name api.store.bd");
    expect(res.nginxConf).toContain("limit_req_zone");
    expect(res.nginxConf).toContain("listen 443 ssl http2");
  });
});

describe("Interactive SQL & Schema Sandbox", () => {
  it("executes Aiyaar FEFO analytical queries and returns expiring batches", () => {
    const res = runSqlQuery("aiyaar_pharmacy", "SELECT p.name, b.batch_no, b.expiry_date, b.stock_units FROM inventory_batches b JOIN products p ON p.id = b.product_id WHERE b.expiry_date <= '2026-12-15' ORDER BY b.expiry_date ASC;");
    expect(res.rowCount).toBeGreaterThan(0);
    expect(res.columns).toContain("Product");
    expect(res.columns).toContain("Expiry Date");
    expect(res.executionTimeMs).toBeGreaterThan(0);
  });

  it("executes NOC router telemetry query", () => {
    const res = runSqlQuery("noc_telemetry", "SELECT r.hostname, r.location, p.loss_pct, p.latency_ms, p.status FROM ping_logs p JOIN routers r ON r.id = p.router_id WHERE p.loss_pct > 2.0 ORDER BY p.loss_pct DESC;");
    expect(res.rowCount).toBeGreaterThan(0);
    expect(res.columns).toContain("Loss %");
  });

  it("executes Omnidesk study LLM analytics query", () => {
    const res = runSqlQuery("omnidesk_study", "SELECT model_name, COUNT(*) AS sessions, SUM(tokens_generated) AS total_tokens, AVG(latency_ms) AS avg_latency_ms FROM llm_sessions GROUP BY model_name;");
    expect(res.rowCount).toBeGreaterThan(0);
    expect(res.columns).toContain("Model Name");
  });
});

describe("R-C-O Prompt Architect", () => {
  it("builds structured prompt with role, context, constraints, and output", () => {
    const prompt = buildRcoPrompt({
      role: "PostgreSQL DBA",
      context: "FEFO batch query tuning for high-traffic pharmacy POS.",
      constraints: "Indexes on expiry_date, zero table locks.",
      outputFormat: "SQL EXPLAIN ANALYZE comparison table.",
    });

    expect(prompt).toContain("[ROLE]\nYou are a PostgreSQL DBA.");
    expect(prompt).toContain("[CONTEXT & OBJECTIVE]");
    expect(prompt).toContain("[CONSTRAINTS & RULES]");
    expect(prompt).toContain("[OUTPUT FORMAT]");
  });
});

describe("Thermal POS Receipt Formatter", () => {
  it("formats 58mm and 80mm receipts with correct alignment and calculations", () => {
    const res = formatThermalReceipt({
      paperWidth: "58mm",
      shopName: "Aiyaar Pharmacy & Mart",
      tagline: "Quality Medicine & Daily Essentials",
      phone: "+8801711000000",
      invoiceNo: "INV-2026-9921",
      dateStr: "2026-11-14 14:30",
      items: [
        { name: "Napa Extra 500mg", qty: 2, priceBdt: 3.0 },
        { name: "Azithromycin 500mg", qty: 1, priceBdt: 35.0 },
      ],
      discountBdt: 5.0,
      vatPct: 5.0,
      footerNote: "Thank you for shopping with us!",
    });

    expect(res.lineWidth).toBe(32);
    expect(res.subtotal).toBe(41.0);
    expect(res.discount).toBe(5.0);
    expect(res.grandTotal).toBe(37.8);
    expect(res.formattedText).toContain("AIYAAR PHARMACY & MART");
    expect(res.formattedText).toContain("INV: INV-2026-9921");
    expect(res.formattedText).toContain("GRAND TOTAL:");
    expect(res.estimatedEscPosBytes).toBeGreaterThan(100);
  });
});

describe("Client-Side JWT Inspector", () => {
  it("decodes valid JWT tokens and extracts payload and expiration", () => {
    // Generate a valid mock JWT token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1kIFNhYmJpcnVsIElzbGFtIEtoYW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MjAwMDAwMDAwMH0.signature
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: "user_42", iss: "the-sabbir-os", iat: 1700000000, exp: 2000000000 }));
    const mockJwt = `${header}.${payload}.mockSignature123`;

    const res = inspectJwt(mockJwt);
    expect(res.valid).toBe(true);
    expect(res.algorithm).toBe("HS256");
    expect(res.subject).toBe("user_42");
    expect(res.issuer).toBe("the-sabbir-os");
    expect(res.isExpired).toBe(false);
  });

  it("handles malformed tokens gracefully", () => {
    const res = inspectJwt("not-a-valid-jwt");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Invalid JWT format");
  });
});
