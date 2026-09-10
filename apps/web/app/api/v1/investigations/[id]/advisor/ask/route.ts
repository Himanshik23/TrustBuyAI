import { NextResponse } from "next/server";
import { askAdvisorQuestion } from "@/lib/api-mock-engine";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const message = body?.message || "";
    const response = askAdvisorQuestion(id, message);
    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: { message: "Failed to query advisor." } }, { status: 500 });
  }
}
