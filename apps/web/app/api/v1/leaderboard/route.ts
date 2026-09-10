import { NextResponse } from "next/server";
import { getLeaderboardData } from "@/lib/api-mock-engine";

export async function GET() {
  const leaderboard = getLeaderboardData();
  return NextResponse.json(leaderboard, { status: 200 });
}
