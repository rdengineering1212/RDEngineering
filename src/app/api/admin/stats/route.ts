import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [contacts, quotes, careers, blogCount] = await Promise.all([
      prisma.contact.count(),
      prisma.quote.count(),
      prisma.career.count(),
      prisma.blog.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      contacts,
      quotes,
      careers,
      blogPosts: blogCount,
      pageViews: 0,
    });
  } catch {
    return NextResponse.json({ contacts: 0, quotes: 0, careers: 0, blogPosts: 0, pageViews: 0 });
  }
}
