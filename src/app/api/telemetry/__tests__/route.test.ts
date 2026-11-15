import { describe, it, expect } from "vitest";
import { GET, POST } from "../route";

describe("GET & POST /api/telemetry", () => {
  it("rejects GET request without slug", async () => {
    const req = new Request("http://localhost:3000/api/telemetry");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns default metrics for a new slug", async () => {
    const req = new Request("http://localhost:3000/api/telemetry?slug=tool:sql-sandbox");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.metrics.slug).toBe("tool:sql-sandbox");
    expect(data.metrics.viewsCount).toBe(0);
  });

  it("rejects POST without slug", async () => {
    const req = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "copy" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("records telemetry action successfully", async () => {
    const req = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "vlog:pdf-action-plan",
        category: "vlog",
        action: "copy",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.slug).toBe("vlog:pdf-action-plan");
  });
});
