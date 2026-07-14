"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function BlogSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data.slice(0, 3));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) return null;

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
              key={post.slug || post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block bg-[#0F1E36] rounded-2xl border border-white/5 overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 h-full relative flex flex-col">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <div className="relative h-48 overflow-hidden shrink-0">
                  <Image src={post.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6 relative flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">{post.category || "General"}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mt-auto">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
