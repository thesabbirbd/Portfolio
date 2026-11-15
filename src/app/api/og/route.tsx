import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "THE SABBiR OS";
  const type = searchParams.get("type") || "default";
  const rank = searchParams.get("rank") || "Chief Systems Architect";

  if (type === "swarm") {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0a0f1d",
            color: "#ffffff",
            padding: "60px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 28, color: "#ff6a00", fontWeight: "bold" }}>
              🐝 MULTI-AGENT SWARM RUNTIME
            </span>
            <span style={{ fontSize: 20, color: "#94a3b8" }}>THE SABBiR OS · sabbir.nav.bd</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: 48, fontWeight: "bold", color: "#ffffff", lineHeight: 1.2 }}>
              {title}
            </div>
            <div style={{ fontSize: 24, color: "#38bdf8" }}>
              Sequential DAG Execution: Agent 1 ──▶ Agent 2 ──▶ Agent 3
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: "24px",
              fontSize: 18,
              color: "#94a3b8",
            }}
          >
            <span>Verified Zero-Cloud Client Architecture</span>
            <span style={{ color: "#10b981" }}>100% Privacy &amp; Data Sovereignty</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  if (type === "passport") {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0a0f1d",
            color: "#ffffff",
            padding: "60px",
            border: "6px solid #ff6a00",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 32, color: "#ff6a00", fontWeight: "bold" }}>
              🪪 VERIFIED SYSTEMS ARCHITECT PASSPORT
            </span>
            <span style={{ fontSize: 22, color: "#10b981" }}>PASS LEVEL A+</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ fontSize: 52, fontWeight: "bold", color: "#ffffff" }}>
              {title}
            </div>
            <div style={{ fontSize: 28, color: "#38bdf8" }}>
              Rank: {rank}
            </div>
            <div style={{ fontSize: 22, color: "#cbd5e1" }}>
              Certified across 18 Super-Tools, 12 Autonomous Agents &amp; 7 Engineering Games
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "2px solid rgba(255,255,255,0.2)",
              paddingTop: "24px",
              fontSize: 20,
              color: "#94a3b8",
            }}
          >
            <span>Issued by: Md Sabbirul Islam Khan · THE SABBiR OS</span>
            <span>Host: sabbir.nav.bd</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Default OpenGraph Card
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0f1d",
          color: "#ffffff",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 28, color: "#ff6a00", fontWeight: "bold" }}>
            THE SABBiR OS
          </span>
          <span style={{ fontSize: 20, color: "#94a3b8" }}>sabbir.nav.bd</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 52, fontWeight: "bold", color: "#ffffff", lineHeight: 1.2 }}>
            {title}
          </div>
          <div style={{ fontSize: 24, color: "#94a3b8" }}>
            Backend, DevOps, Systems Architecture &amp; Client-Side AI
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "24px",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>Md Sabbirul Islam Khan</span>
          <span>Chief Product Manager (CPM) · Aiyaar</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
