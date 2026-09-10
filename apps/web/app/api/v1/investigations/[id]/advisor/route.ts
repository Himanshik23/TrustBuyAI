import { NextResponse } from "next/server";
import { getAdvisorReportById } from "@/lib/api-mock-engine";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getAdvisorReportById(id);
  return NextResponse.json(report, { status: 200 });
}
