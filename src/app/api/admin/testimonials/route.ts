import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, company, content, rating, avatarUrl, featured } = body;

    if (!name || !content) {
      return NextResponse.json({ message: "Name and content are required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || null,
        company: company || null,
        content,
        rating: Number(rating) || 5,
        avatarUrl: avatarUrl || null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating testimonial", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, role, company, content, rating, avatarUrl, featured } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        role: role || null,
        company: company || null,
        content,
        rating: Number(rating) || 5,
        avatarUrl: avatarUrl || null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating testimonial", error: error.message },
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

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting testimonial", error: error.message },
      { status: 500 }
    );
  }
}
