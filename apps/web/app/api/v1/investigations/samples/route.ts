import { NextResponse } from "next/server";
import { getSampleInvestigationsList } from "@/lib/api-mock-engine";

export async function GET() {
  const samples = getSampleInvestigationsList();
  return NextResponse.json(samples, { status: 200 });
}
