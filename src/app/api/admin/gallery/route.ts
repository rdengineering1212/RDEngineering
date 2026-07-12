import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/lib/validations";

export async function GET() {
  try {
    const items = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = gallerySchema.parse(body);

    const item = await prisma.gallery.create({
      data: {
        title: validated.title || null,
        description: validated.description || null,
        imageUrl: validated.imageUrl,
        category: validated.category,
        featured: validated.featured || false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: "Error creating gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await prisma.gallery.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting item" }, { status: 500 });
  }
}
