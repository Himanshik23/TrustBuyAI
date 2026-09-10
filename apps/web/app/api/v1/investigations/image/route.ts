import { NextResponse } from "next/server";
import { analyzeAndCreateInvestigation } from "@/lib/api-mock-engine";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const url = (formData.get("url") as string | null) ?? "";

    const detail = analyzeAndCreateInvestigation(url || "Image Screenshot Analysis", image || undefined);
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
    return NextResponse.json({ error: { message: "Failed to process image investigation." } }, { status: 500 });
  }
}
