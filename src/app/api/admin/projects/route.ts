import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  try {
    const items = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = projectSchema.parse(body);

    const item = await prisma.project.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        category: validated.category,
        clientName: validated.clientName || null,
        location: validated.location || null,
        imageUrl: validated.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80",
        images: validated.images || [],
        featured: validated.featured || false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    // Handle unique slug constraint violation
    if (error.code === "P2002") {
      return NextResponse.json({ message: "A project with this slug already exists." }, { status: 409 });
    }
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Error creating project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const body = await req.json();
    const validated = projectSchema.parse(body);

    const item = await prisma.project.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        category: validated.category,
        clientName: validated.clientName || null,
        location: validated.location || null,
        imageUrl: validated.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80",
        images: validated.images || [],
        featured: validated.featured || false,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ message: "A project with this slug already exists." }, { status: 409 });
    }
    console.error("Error updating project:", error);
    return NextResponse.json({ message: "Error updating project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
  }
}
