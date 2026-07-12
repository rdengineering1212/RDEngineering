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

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
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
