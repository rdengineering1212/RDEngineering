"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useInView } from "react-intersection-observer";

const posts = [
  {
    slug: "steel-fabrication-best-practices",
    title: "Steel Fabrication Best Practices for Industrial Projects",
    excerpt: "Learn about the latest steel fabrication techniques and quality standards that ensure durable, safe, and cost-effective industrial structures.",
    category: "Steel Fabrication",
    date: "2025-01-15",
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=600&q=80",
  },
  {
    slug: "industrial-roofing-guide",
    title: "Complete Guide to Industrial Roofing Systems",
    excerpt: "Discover the different types of industrial roofing systems, their benefits, and how to choose the right solution for your facility.",
    category: "Roofing",
    date: "2025-01-10",
    image: "https://images.unsplash.com/photo-1504307651254-84280e292091?w=600&q=80",
  },
  {
    slug: "pipeline-maintenance-tips",
    title: "Essential Pipeline Maintenance Tips for Industrial Facilities",
    excerpt: "Regular pipeline maintenance is crucial for industrial operations. Here are expert tips to keep your pipeline systems running efficiently.",
    category: "Pipeline",
    date: "2025-01-05",
    image: "https://images.unsplash.com/photo-1565072888287-8e8f6a6a75b7?w=600&q=80",
  },
];

export default function BlogSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-muted/30">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-2xl">
            <h2 className="section-title mb-4">
              Latest from <span className="gradient-text">Our Blog</span>
            </h2>
            <p className="section-subtitle mx-0">
              Insights, guides, and updates from the RD Engineering team.
            </p>
          </div>
          <Link href="/blog" className="btn-outline shrink-0">
            View All Posts <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block bg-card rounded-2xl border border-border/40 overflow-hidden hover:border-accent/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500 h-full relative">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6 relative">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">{post.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
