import { NextResponse } from "next/server";
import { getOrCreateCopilotConversation } from "@/lib/api-mock-engine";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conv = getOrCreateCopilotConversation(id);
  return NextResponse.json(conv, { status: 200 });
}
