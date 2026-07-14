"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, ArrowRight, User, Loader2 } from "lucide-react";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/blog")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogPosts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category).filter(Boolean)))];

  const filtered = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/95 to-[#0A1628]" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-4"
          >Our <span className="gradient-text">Blog</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Insights, guides, and updates from the RD Engineering team.</motion.p>
        </div>
      </section>

      <section className="py-20 bg-[#080F1C] min-h-screen">
        <div className="container-padding max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Search and Filter */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-gray-500" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {categories.map((cat) => (
                    <button key={cat as string} onClick={() => setActiveCategory(cat as string)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        activeCategory === cat
                          ? "bg-accent text-primary shadow-md"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >{cat}</button>
                  ))}
                </div>
              </motion.div>

              {/* Blog Grid */}
              <AnimatePresence mode="popLayout">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filtered.map((post, index) => (
                    <motion.div key={post.slug || post.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                      <Link href={`/blog/${post.slug}`} className="group block bg-[#0F1E36] rounded-2xl border border-white/5 overflow-hidden hover:border-accent/30 hover:shadow-2xl transition-all duration-500 relative h-full flex flex-col justify-between">
                        <div>
                          <div className="relative h-48 sm:h-56 overflow-hidden">
                            <Image src={post.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                          </div>
                          <div className="p-6 relative">
                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                              <span className="px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold uppercase tracking-wider">{post.category || "General"}</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">{post.title}</h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          </div>
                        </div>
                        <div className="px-6 pb-6 pt-0">
                          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                            <span className="flex items-center gap-1 text-xs text-gray-400"><User className="h-3 w-3" />{post.author || "RD Engineering"}</span>
                            <span className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">Read More <ArrowRight className="h-4 w-4" /></span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400 border border-dashed border-white/10 rounded-2xl">
                  No articles found matching your search.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
