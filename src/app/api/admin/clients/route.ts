import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, industry, logoUrl, website, featured, order } = body;

    if (!name) {
      return NextResponse.json({ message: "Client name is required" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        industry: industry || null,
        logoUrl: logoUrl || null,
        website: website || null,
        featured: Boolean(featured),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating client", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, industry, logoUrl, website, featured, order } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        industry: industry || null,
        logoUrl: logoUrl || null,
        website: website || null,
        featured: Boolean(featured),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json(client);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating client", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting client", error: error.message },
      { status: 500 }
    );
  }
}
