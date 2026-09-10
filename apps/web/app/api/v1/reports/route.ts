import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([], { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      {
        id: `rep-${Date.now()}`,
        report_type: body?.report_type || "suspicious_seller",
        description: body?.description || "",
        product_id: body?.product_id,
        seller_id: body?.seller_id,
        status: "pending",
        upvotes: 1,
        downvotes: 0,
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: { message: "Failed to submit community report." } }, { status: 500 });
  }
}
