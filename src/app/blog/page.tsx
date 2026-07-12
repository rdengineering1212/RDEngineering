"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, ArrowRight, User } from "lucide-react";

const blogPosts = [
  { slug: "steel-fabrication-best-practices", title: "Steel Fabrication Best Practices for Industrial Projects", excerpt: "Learn about the latest steel fabrication techniques and quality standards that ensure durable, safe, and cost-effective industrial structures.", category: "Steel Fabrication", author: "RD Engineering", date: "2025-01-15", tags: ["Steel", "Fabrication", "Quality"], image: "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80" },
  { slug: "industrial-roofing-guide", title: "Complete Guide to Industrial Roofing Systems", excerpt: "Discover the different types of industrial roofing systems, their benefits, and how to choose the right solution for your facility.", category: "Roofing", author: "RD Engineering", date: "2025-01-10", tags: ["Roofing", "Industrial", "Construction"], image: "https://images.unsplash.com/photo-1504307651254-84280e292091?w=800&q=80" },
  { slug: "pipeline-maintenance-tips", title: "Essential Pipeline Maintenance Tips for Industrial Facilities", excerpt: "Regular pipeline maintenance is crucial for industrial operations. Here are expert tips to keep your pipeline systems running efficiently.", category: "Pipeline", author: "RD Engineering", date: "2025-01-05", tags: ["Pipeline", "Maintenance", "Safety"], image: "https://images.unsplash.com/photo-1565072888287-8e8f6a6a75b7?w=800&q=80" },
  { slug: "choosing-right-partition-system", title: "How to Choose the Right Partition System for Your Facility", excerpt: "Compare PUF panels, aluminium partitions, and drywall systems to find the best solution for your industrial or commercial space.", category: "Partition", author: "RD Engineering", date: "2024-12-28", tags: ["Partition", "Interior", "Design"], image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
  { slug: "industrial-painting-standards", title: "Industrial Painting Standards and Best Practices", excerpt: "Understanding industrial painting standards is key to protecting your assets. Learn about surface preparation, coating types, and quality inspection.", category: "Painting", author: "RD Engineering", date: "2024-12-20", tags: ["Painting", "Coating", "Standards"], image: "https://images.unsplash.com/photo-1516893848020-38bb4c19622c?w=800&q=80" },
  { slug: "safety-industrial-construction", title: "Safety First: Best Practices in Industrial Construction", excerpt: "Safety is paramount in industrial construction. Explore essential safety protocols and practices we follow at RD Engineering.", category: "Safety", author: "RD Engineering", date: "2024-12-15", tags: ["Safety", "Construction", "Best Practices"], image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" },
];

const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Our <span className="gradient-text">Blog</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Insights, guides, and updates from the RD Engineering team.</motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-padding max-w-5xl mx-auto">
          {/* Search and Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full h-12 rounded-xl border border-border/40 bg-card pl-12 pr-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-accent text-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >{cat}</button>
              ))}
            </div>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((post, index) => (
              <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Link href={`/blog/${post.slug}`} className="group block bg-card rounded-2xl border border-border/40 overflow-hidden hover:border-accent/20 hover:shadow-2xl transition-all duration-500 relative">
                  <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <div className="p-6 relative">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold">{post.category}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><User className="h-3 w-3" />{post.author}</span>
                      <span className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">Read More <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
