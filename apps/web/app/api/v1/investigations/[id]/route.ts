import { NextResponse } from "next/server";
import { getInvestigationById } from "@/lib/api-mock-engine";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getInvestigationById(id);

  if (!detail) {
    return NextResponse.json({ error: { message: "Investigation not found." } }, { status: 404 });
  }

  return NextResponse.json(detail, { status: 200 });
}
