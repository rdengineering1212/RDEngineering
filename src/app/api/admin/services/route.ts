import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, content, icon, imageUrl, benefits, process, order, featured } = body;

    if (!title || !description) {
      return NextResponse.json({ message: "Title and description are required" }, { status: 400 });
    }

    const slug = generateSlug(title);

    // Check if slug is unique, adjust if needed
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.service.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        content: content || null,
        icon: icon || null,
        imageUrl: imageUrl || null,
        benefits: benefits || [],
        process: process || [],
        order: Number(order) || 0,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating service", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, content, icon, imageUrl, benefits, process, order, featured } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required for update" }, { status: 400 });
    }

    const updateData: any = {
      description,
      content: content || null,
      icon: icon || null,
      imageUrl: imageUrl || null,
      benefits: benefits || [],
      process: process || [],
      order: Number(order) || 0,
      featured: Boolean(featured),
    };

    if (title) {
      updateData.title = title;
      // Option: regenerate slug or keep existing one. Usually keep existing unless explicitly requested, 
      // but let's regenerate it to match title edits.
      const slug = generateSlug(title);
      // Ensure unique slug doesn't conflict with another service's slug
      const existingService = await prisma.service.findUnique({ where: { slug } });
      if (existingService && existingService.id !== id) {
        updateData.slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      } else {
        updateData.slug = slug;
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating service", error: error.message },
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

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting service", error: error.message },
      { status: 500 }
    );
  }
}
