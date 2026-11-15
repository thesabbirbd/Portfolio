import { NextResponse } from "next/server";
import { getOSBrainTelemetry } from "@/lib/autonomous/os-autonomous-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const telemetry = getOSBrainTelemetry();

  return NextResponse.json(
    {
      success: true,
      data: telemetry,
      serverTime: new Date().toISOString(),
      version: "5.2.14",
      system: "THE SABBiR OS Autonomous Engine",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-OS-Brain-Status": "operational",
      },
    }
  );
}

export async function POST() {
  // Simulates or triggers an in-browser live autonomous pulse sync
  const telemetry = getOSBrainTelemetry();
  return NextResponse.json({
    success: true,
    message: "Autonomous OS Brain discovery cycle completed successfully.",
    syncedAt: new Date().toISOString(),
    metrics: telemetry,
  });
}
