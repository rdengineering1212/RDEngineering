import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    const quote = await prisma.quote.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ message: "Error updating quote" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}
