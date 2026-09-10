import { NextResponse } from "next/server";
import { getUserInvestigations } from "@/lib/api-mock-engine";

export async function GET() {
  const items = getUserInvestigations();
  return NextResponse.json(items, { status: 200 });
}
