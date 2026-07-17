"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function ProjectsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter to featured or top 4
          const featured = data.filter((p: any) => p.featured);
          setProjectsList(featured.length > 0 ? featured.slice(0, 4) : data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-2xl">
            <h2 className="section-title mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="section-subtitle mx-0">
              Showcasing our finest work across various industrial sectors in Tamil Nadu.
              Each project reflects our commitment to quality and excellence.
            </p>
          </div>
          <Link
            href="/projects"
            className="btn-outline shrink-0"
          >
            View All Projects
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-72 md:h-80 rounded-2xl bg-white/5 animate-pulse border border-border/40"
              />
            ))}
          </div>
        ) : projectsList.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-dashed border-border/40 rounded-2xl">
            <p className="text-sm">No featured projects found. Add projects in the CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsList.map((project, index) => (
              <motion.div
                key={project.id || project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/projects#${project.slug || ""}`}
                  className="group relative block h-72 md:h-80 rounded-2xl overflow-hidden border border-border/40 hover:border-accent/20 transition-all duration-500 shadow-lg"
                >
                  <Image
                    src={project.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=600&q=80"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent text-xs font-semibold mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-1">{project.clientName || "RD Engineering Partner"}</p>
                  </div>
                  <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
