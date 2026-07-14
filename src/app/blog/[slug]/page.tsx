"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Tags, Share2, Loader2 } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPost(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-[#080F1C]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-[#080F1C] text-white">
        <div className="container-padding text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Post Not Found</h1>
          <p className="mb-8 text-gray-400">The blog post you're looking for doesn't exist or is not published yet.</p>
          <Link href="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative pt-32 pb-20 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/95 to-[#0A1628]" />
        <div className="container-padding relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <br />
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
              {post.category || "General"}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author || "RD Engineering"}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
              {post.tags && post.tags.length > 0 && (
                <span className="flex items-center gap-1"><Tags className="h-4 w-4" />{post.tags.join(", ")}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#080F1C] min-h-screen text-white">
        <div className="container-padding max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Image src={post.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80"} alt={post.title} width={1200} height={600} className="w-full h-64 md:h-[400px] object-cover rounded-2xl mb-10 border border-white/10" />
            
            {/* Display Markdown Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-white prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
              <Link href="/blog" className="btn-outline text-sm"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                }
              }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
