import { describe, it, expect } from "vitest";
import { inspectPayloadSecurity, checkRateLimit } from "../waf-shield";

describe("OWASP Automated Penetration Test Suite (Stage 091)", () => {
  const SQLI_ATTACK_VECTORS = [
    "admin' OR '1'='1",
    "1' OR 1=1 --",
    "' UNION SELECT null, username, password FROM users --",
    "'; DROP TABLE workspace_users; --",
    "admin' AND 1=1 --",
    "1 UNION ALL SELECT 1, 2, 3, 4, 5",
    "test'; EXEC xp_cmdshell('dir'); --",
    "' OR '' = '",
    "1; WAITFOR DELAY '0:0:5'--",
    "admin' /*!50000OR*/ 1=1 --",
  ];

  const XSS_ATTACK_VECTORS = [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(document.cookie)>",
    "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/'/+/onmouseover=1+(alert)(1)//>",
    "<svg onload=alert(1)>",
    "<iframe src='javascript:alert(1)'></iframe>",
  ];

  const PATH_TRAVERSAL_VECTORS = [
    "../../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\cmd.exe",
    "....//....//....//etc/shadow",
    "/var/www/../../etc/passwd",
    "..%2f..%2f..%2fetc%2fpasswd",
  ];

  const LEGITIMATE_BUSINESS_TEXTS = [
    "চাল ৫ কেজি ৩৫০ টাকা (PAID), তেল ২ লিটার ৩৭৫ টাকা (BAKI)",
    "Customer requested delivery via Steadfast Courier to Gulshan-2, Dhaka.",
    "Pro Bluetooth Smartwatch with Bangla Display and 6-month warranty.",
    "Invoice #INV-2026-1142: Subtotal 12,500 BDT, VAT 5%, Total 13,125 BDT.",
    "THE SABBiR OS Workplace Studio: Image Editor, Story Maker, Audio DAW, Spreadsheet.",
  ];

  it("blocks 100% of OWASP SQL Injection attack vectors", () => {
    SQLI_ATTACK_VECTORS.forEach((vector) => {
      const result = inspectPayloadSecurity(vector);
      expect(result.safe).toBe(false);
      expect(result.threatType).toBeDefined();
    });
  });

  it("blocks 100% of XSS attack vectors", () => {
    XSS_ATTACK_VECTORS.forEach((vector) => {
      const result = inspectPayloadSecurity(vector);
      expect(result.safe).toBe(false);
    });
  });

  it("blocks 100% of Path Traversal attack vectors", () => {
    PATH_TRAVERSAL_VECTORS.forEach((vector) => {
      const result = inspectPayloadSecurity(vector);
      expect(result.safe).toBe(false);
    });
  });

  it("allows 100% of legitimate Bengali & English business text with ZERO false positives", () => {
    LEGITIMATE_BUSINESS_TEXTS.forEach((text) => {
      const result = inspectPayloadSecurity(text);
      expect(result.safe).toBe(true);
      expect(result.threatType).toBeUndefined();
    });
  });

  it("throttles burst traffic with Token-Bucket HTTP 429 when limits exceeded", () => {
    const testIp = `pen-test-bot-${Date.now()}`;
    const category = "/api/workplace/auth";

    let blockedAtLeastOnce = false;
    for (let i = 0; i < 25; i++) {
      const rate = checkRateLimit(testIp, category);
      if (!rate.allowed) {
        blockedAtLeastOnce = true;
        expect(rate.retryAfterSec).toBeGreaterThan(0);
      }
    }
    expect(blockedAtLeastOnce).toBe(true);
  });
});
