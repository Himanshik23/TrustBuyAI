import { NextResponse } from "next/server";
import { getInvestigationById } from "@/lib/api-mock-engine";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getInvestigationById(id);
  if (!detail) {
    return NextResponse.json({ error: { message: "Investigation not found." } }, { status: 404 });
  }

  // Generate a minimal valid PDF document blob
  const title = detail.product?.title || "TrustBuy AI Investigation Report";
  const verdict = detail.recommendation?.verdict || "buy";
  const pdfContent = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Count 1 /Kids [3 0 R]>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>> >> endobj
4 0 obj <</Length 120>> stream
BT
/F1 16 Tf
50 720 Td
(${title}) Tj
0 -30 Td
(Verdict: ${verdict.toUpperCase()}) Tj
ET
endstream endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000414 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
485
%%EOF`;

  const bytes = new TextEncoder().encode(pdfContent);

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="trustbuy-report-${id}.pdf"`,
    },
  });
}
