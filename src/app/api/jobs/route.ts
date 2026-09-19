import { NextRequest, NextResponse } from "next/server";
import { Job, JobStatus } from "@/types/job";
import { getInitialMockJobs } from "@/data/mockJobs";

// Server-side in-memory job store
let memoryJobs: Job[] = getInitialMockJobs();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shouldSimulateDelay = searchParams.get("delay") === "true";
  const shouldSimulateError = searchParams.get("error") === "true";

  if (shouldSimulateDelay) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  if (shouldSimulateError) {
    return NextResponse.json(
      { success: false, error: "Simulated MES Database Connection Timeout (500)" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: memoryJobs,
    meta: {
      count: memoryJobs.length,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes, machine } = body as {
      id: string;
      status?: JobStatus;
      notes?: string;
      machine?: string;
    };

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required Job ID" },
        { status: 400 }
      );
    }

    const jobIndex = memoryJobs.findIndex((j) => j.id === id);
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Job with ID ${id} not found` },
        { status: 404 }
      );
    }

    const existing = memoryJobs[jobIndex];
    const updated: Job = {
      ...existing,
      status: status !== undefined ? status : existing.status,
      notes: notes !== undefined ? notes : existing.notes,
      machine: machine !== undefined ? machine : existing.machine,
      lastUpdated: "Just now",
    };

    // If status changed to Completed and completedQuantity < quantity, auto set completedQuantity to full
    if (status === "Completed" && existing.status !== "Completed") {
      updated.completedQuantity = updated.quantity;
    }

    memoryJobs[jobIndex] = updated;

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process job update" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "reset") {
      memoryJobs = getInitialMockJobs();
      return NextResponse.json({
        success: true,
        message: "Data reset to factory defaults",
        data: memoryJobs,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
