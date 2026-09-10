import { NextResponse } from "next/server";
import { getEvidenceById } from "@/lib/api-mock-engine";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = getEvidenceById(id);
  return NextResponse.json(items, { status: 200 });
}
