import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import TimelineSection from "@/components/home/TimelineSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ClientsSection from "@/components/home/ClientsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import BlogSection from "@/components/home/BlogSection";
import ContactCTASection from "@/components/home/ContactCTASection";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
  }

  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection initialProjects={projects} />
      <TimelineSection />
      <WhyChooseUsSection />
      <ClientsSection />
      <TestimonialsSection />
      <FaqSection />
      <BlogSection />
      <ContactCTASection />
    </>
  );
}
