import { NextResponse } from "next/server";
import { analyzeAndCreateInvestigation } from "@/lib/api-mock-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body?.url ?? "";
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: { message: "Invalid product URL provided." } }, { status: 400 });
    }

    const detail = analyzeAndCreateInvestigation(url);
    return NextResponse.json(
      {
        investigation_id: detail.investigation_id,
        status: detail.status,
        estimated_seconds: 0,
        detected_platform: detail.detected_platform,
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json({ error: { message: "Failed to create investigation." } }, { status: 500 });
  }
}
