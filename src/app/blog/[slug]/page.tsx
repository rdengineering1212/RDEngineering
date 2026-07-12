"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Tags, Share2 } from "lucide-react";

const blogPosts = [
  { slug: "steel-fabrication-best-practices", title: "Steel Fabrication Best Practices for Industrial Projects", content: `
    <p>Steel fabrication is the backbone of modern industrial construction. At RD Engineering, we've spent over 15 years perfecting our fabrication processes to deliver structures that are not just strong, but also cost-effective and durable.</p>
    <h2>1. Quality Material Selection</h2>
    <p>The foundation of any great steel structure starts with the right materials. We source our steel from certified suppliers and conduct thorough material testing before any fabrication begins. This ensures that every beam, column, and connection meets the required strength specifications.</p>
    <h2>2. Precision Cutting and Shaping</h2>
    <p>Modern fabrication requires precision. Using advanced cutting equipment and techniques, we ensure that every component is cut and shaped to exact specifications. This precision reduces waste, speeds up installation, and results in stronger connections.</p>
    <h2>3. Expert Welding Techniques</h2>
    <p>Our certified welders use a combination of MIG, TIG, and arc welding techniques depending on the application. Each weld is inspected and tested to ensure it meets quality standards. Proper welding is critical for structural integrity.</p>
    <h2>4. Surface Preparation and Coating</h2>
    <p>Protecting steel from corrosion is essential for longevity. We follow stringent surface preparation protocols including shot blasting, priming, and applying protective coatings. This extends the life of the structure significantly.</p>
    <h2>5. Quality Control at Every Stage</h2>
    <p>Quality control isn't just a final step — it's integrated into every stage of our fabrication process. From material inspection to dimensional checks, weld testing to surface finish inspection, we ensure excellence at every step.</p>
    <p>By following these best practices, RD Engineering delivers steel structures that stand the test of time. Contact us to learn more about our steel fabrication capabilities.</p>
  `, excerpt: "Learn about the latest steel fabrication techniques and quality standards that ensure durable, safe, and cost-effective industrial structures.", category: "Steel Fabrication", author: "RD Engineering", date: "2025-01-15", tags: ["Steel", "Fabrication", "Quality"], image: "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80" },
  { slug: "industrial-roofing-guide", title: "Complete Guide to Industrial Roofing Systems", content: `
    <p>Choosing the right roofing system for your industrial facility is a critical decision that affects safety, energy efficiency, and long-term maintenance costs. Here's our comprehensive guide to industrial roofing.</p>
    <h2>Types of Industrial Roofing</h2>
    <p>PEB (Pre-Engineered Building) roofs are the most popular choice for industrial facilities due to their cost-effectiveness and quick installation. Metal sheet roofing offers durability and weather resistance. Insulated roofing systems provide energy efficiency.</p>
    <h2>Key Considerations</h2>
    <p>When selecting a roofing system, consider factors like span requirements, local weather conditions, insulation needs, and budget. Each type of roofing has specific advantages depending on your application.</p>
    <h2>Installation Best Practices</h2>
    <p>Proper installation is critical for roof performance. This includes correct purlin spacing, proper sheet lapping, adequate fastening, and effective sealing at joints and penetrations.</p>
    <p>RD Engineering provides end-to-end roofing solutions from design to installation. Contact us for a consultation.</p>
  `, excerpt: "Discover the different types of industrial roofing systems, their benefits, and how to choose the right solution for your facility.", category: "Roofing", author: "RD Engineering", date: "2025-01-10", tags: ["Roofing", "Industrial", "Construction"], image: "https://images.unsplash.com/photo-1504307651254-84280e292091?w=800&q=80" },
  { slug: "pipeline-maintenance-tips", title: "Essential Pipeline Maintenance Tips for Industrial Facilities", content: `
    <p>Regular pipeline maintenance is crucial for the safe and efficient operation of any industrial facility. Here are expert tips to keep your pipeline systems running smoothly.</p>
    <h2>Regular Inspection</h2>
    <p>Schedule regular visual inspections of exposed pipelines for signs of corrosion, leaks, or mechanical damage. Early detection can prevent costly repairs and downtime.</p>
    <h2>Pressure Testing</h2>
    <p>Periodic pressure testing helps identify weak points in your pipeline system before they fail. Hydrostatic testing is the most reliable method for verifying system integrity.</p>
    <h2>Corrosion Protection</h2>
    <p>Apply and maintain protective coatings on pipelines. Consider cathodic protection for underground pipelines. Address any coating damage promptly.</p>
    <p>RD Engineering provides comprehensive pipeline maintenance and repair services. Contact us to schedule an inspection.</p>
  `, excerpt: "Regular pipeline maintenance is crucial for industrial operations. Here are expert tips to keep your pipeline systems running efficiently.", category: "Pipeline", author: "RD Engineering", date: "2025-01-05", tags: ["Pipeline", "Maintenance", "Safety"], image: "https://images.unsplash.com/photo-1565072888287-8e8f6a6a75b7?w=800&q=80" },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <section className="pt-32 pb-20">
        <div className="container-padding text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-300 hover:text-accent mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">{post.category}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{post.date}</span>
              <span className="flex items-center gap-1"><Tags className="h-4 w-4" />{post.tags.join(", ")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-padding max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Image src={post.image} alt={post.title} width={800} height={400} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 border border-border/20" />
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary prose-p:text-muted-foreground prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/40">
              <Link href="/blog" className="btn-outline text-sm"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                }
              }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
