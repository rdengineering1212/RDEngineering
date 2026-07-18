import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Prisma setting fetch failed:", error);
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}
