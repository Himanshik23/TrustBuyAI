import { NextResponse } from "next/server";
import { getOrCreateCopilotConversation } from "@/lib/api-mock-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const investigationId = body?.investigation_id || "default";
    const conv = getOrCreateCopilotConversation(investigationId);
    return NextResponse.json(conv, { status: 200 });
  } catch {
    return NextResponse.json({ error: { message: "Failed to initialize conversation." } }, { status: 500 });
  }
}
