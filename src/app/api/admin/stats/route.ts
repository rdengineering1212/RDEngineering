import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      projectCount,
      serviceCount,
      clientCount,
      testimonialCount,
      contactCount,
      quoteCount,
      careerCount,
      recentContacts,
      recentProjects,
      recentQuotes
    ] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.client.count(),
      prisma.testimonial.count(),
      prisma.contact.count(),
      prisma.quote.count(),
      prisma.career.count(),
      prisma.contact.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      prisma.project.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      prisma.quote.findMany({ take: 5, orderBy: { createdAt: "desc" } })
    ]);

    // Build a list of recent activities from contacts, quotes, and projects
    const activities: any[] = [];

    recentContacts.forEach((c: any) => {
      activities.push({
        id: c.id,
        type: "contact",
        title: `New contact request from ${c.name}`,
        description: c.message.substring(0, 60) + (c.message.length > 60 ? "..." : ""),
        time: c.createdAt,
      });
    });

    recentProjects.forEach((p: any) => {
      activities.push({
        id: p.id,
        type: "project",
        title: `Project created: ${p.title}`,
        description: `Category: ${p.category}`,
        time: p.createdAt,
      });
    });

    recentQuotes.forEach((q: any) => {
      activities.push({
        id: q.id,
        type: "quote",
        title: `New quote request from ${q.name}`,
        description: `Service: ${q.service}`,
        time: q.createdAt,
      });
    });

    // Sort all activities by time descending
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      projects: projectCount,
      services: serviceCount,
      clients: clientCount,
      testimonials: testimonialCount,
      contacts: contactCount,
      quotes: quoteCount,
      careers: careerCount,
      recentActivities: activities.slice(0, 8),
    });
  } catch (error) {
    console.error("Error in stats API:", error);
    return NextResponse.json({
      projects: 0,
      services: 0,
      clients: 0,
      testimonials: 0,
      contacts: 0,
      quotes: 0,
      careers: 0,
      recentActivities: [],
    });
  }
}
