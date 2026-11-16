import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, inspectPayloadSecurity } from "@/lib/security/waf-shield";
import {
  createJobTicket,
  getJobTicket,
  listUserJobs,
  listAllJobs,
  executeLocalWorkerJob,
  updateJobTicket,
} from "@/lib/agents/input-to-action-dispatcher";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (jobId) {
    const job = getJobTicket(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, job });
  }

  if (userId) {
    const jobs = listUserJobs(userId);
    return NextResponse.json({ success: true, jobs });
  }

  // Default to recent jobs
  const jobs = listAllJobs(30);
  return NextResponse.json({ success: true, jobs });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(ip, "job-dispatch");
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  const { agentId, userId, username, inputPayload, mode = "instant_local", inputParams } = body;

  if (!agentId || !inputPayload) {
    return NextResponse.json({ error: "Missing required fields: agentId, inputPayload" }, { status: 400 });
  }

  // WAF payload security inspection
  const inspection = inspectPayloadSecurity(body, "/api/jobs/dispatch", ip);
  if (!inspection.safe) {
    return NextResponse.json(
      { error: "Payload blocked by WAF security guard", threats: inspection.threats },
      { status: 403 }
    );
  }

  const ticket = createJobTicket({
    agentId: String(agentId),
    userId: String(userId || "guest"),
    username: String(username || "Guest User"),
    inputPayload: String(inputPayload),
    mode: mode === "github_action_cloud" ? "github_action_cloud" : "instant_local",
    inputParams,
  });

  if (ticket.mode === "instant_local") {
    // Execute immediately in local worker runtime
    const completedJob = await executeLocalWorkerJob(ticket.id);
    return NextResponse.json({ success: true, job: completedJob });
  }

  // GitHub Action cloud mode: mark queued and return ticket with dispatch command
  updateJobTicket(ticket.id, {
    status: "dispatched_github_action",
    progressPercent: 20,
    statusMessage: "Job ticket dispatched. Awaiting GitHub Action cloud worker pickup...",
    terminalLogs: [
      `[${new Date().toLocaleTimeString()}] Ticket ${ticket.id} synchronized for GitHub Actions dispatch`,
      `[${new Date().toLocaleTimeString()}] Runner target: .github/workflows/sabbir-os-user-job-worker.yml`,
    ],
  });

  return NextResponse.json({
    success: true,
    job: getJobTicket(ticket.id),
    githubWorkflow: {
      workflow: "sabbir-os-user-job-worker.yml",
      jobId: ticket.id,
      instruction: "Triggered via GitHub repository_dispatch or workflow_dispatch",
    },
  });
}

export async function PUT(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { jobId, status, progressPercent, statusMessage, terminalLog, artifact, errorMessage } = body;
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const updated = updateJobTicket(jobId, {
      status,
      progressPercent,
      statusMessage,
      terminalLogs: terminalLog ? [terminalLog] : undefined,
      artifact,
      errorMessage,
      completedAt: status === "completed" || status === "failed" ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update job" }, { status: 404 });
  }
}
