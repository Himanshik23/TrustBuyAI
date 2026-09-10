import { NextResponse } from "next/server";
import { getPriceHistoryById } from "@/lib/api-mock-engine";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const history = getPriceHistoryById(id);
  return NextResponse.json(history, { status: 200 });
}
