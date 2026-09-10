import { NextResponse } from "next/server";
import { getAgentsById } from "@/lib/api-mock-engine";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agents = getAgentsById(id);
  return NextResponse.json(agents, { status: 200 });
}
