import { NextResponse } from "next/server";
import { angelOne } from "@/lib/angelone/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const token = searchParams.get("token");
  const exchange = searchParams.get("exchange") || "NSE";

  if (!symbol || !token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const data = await angelOne.getLTP(exchange, symbol, token);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
