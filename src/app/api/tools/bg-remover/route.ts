import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { success: false, error: "Image data (base64 string or data URL) is required" },
        { status: 400 }
      );
    }

    const pythonPath = "/home/thesabbir/AI/cptr/.venv/bin/python";
    const scriptPath = path.join(process.cwd(), "scripts/autonomous/rembg_cutout_agent.py");

    if (!fs.existsSync(pythonPath) || !fs.existsSync(scriptPath)) {
      return NextResponse.json({
        success: false,
        error: "Neural Python AI environment not found locally",
        fallbackAvailable: true,
      });
    }

    // Execute Python neural agent
    const child = spawn(pythonPath, [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (chunk) => {
      stdoutData += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      child.on("close", resolve);
      child.stdin.write(JSON.stringify({ image }));
      child.stdin.end();
    });

    if (exitCode !== 0 || !stdoutData.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: stderrData || "Neural agent cutout execution failed",
          fallbackAvailable: true,
        },
        { status: 500 }
      );
    }

    const result = JSON.parse(stdoutData.trim());
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
