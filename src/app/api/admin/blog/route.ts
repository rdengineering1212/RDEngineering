import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const post = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || "",
        content: body.content || "",
        imageUrl: body.imageUrl || null,
        author: body.author || "RD Engineering",
        category: body.category || null,
        tags: body.tags ? body.tags.split(",").map((t: string) => t.trim()) : [],
        published: body.published || false,
        featured: body.featured || false,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating post", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const post = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ? (typeof data.tags === "string" ? data.tags.split(",").map((t: string) => t.trim()) : data.tags) : undefined,
      },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating post", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}
