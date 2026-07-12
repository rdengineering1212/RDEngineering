"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useInView } from "react-intersection-observer";

const projects = [
  {
    title: "Steel Structure for Automotive Plant",
    category: "Steel Fabrication",
    client: "L.S Automotive India Pvt Ltd",
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=600&q=80",
  },
  {
    title: "Industrial Roofing System Installation",
    category: "Roof Structure",
    client: "Daeseung Autoparts India Pvt Ltd",
    image: "https://images.unsplash.com/photo-1578996952315-f9e9eb0e6030?w=600&q=80",
  },
  {
    title: "Pipeline Infrastructure Project",
    category: "Pipeline Work",
    client: "Competition Team Technology India Pvt Ltd",
    image: "https://images.unsplash.com/photo-1565072888287-8e8f6a6a75b7?w=600&q=80",
  },
  {
    title: "Factory Air Line System",
    category: "Air Line Work",
    client: "Duck Woo Auto India Pvt Ltd",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  },
];

export default function ProjectsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href="/projects"
                className="group relative block h-72 md:h-80 rounded-2xl overflow-hidden border border-border/40 hover:border-accent/20 transition-all duration-500 shadow-lg"
              >
                <Image
                  src={project.image}
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
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-300">{project.client}</p>
                </div>
                <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="h-5 w-5 text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
