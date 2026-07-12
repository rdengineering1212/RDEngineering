"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Loader2, MapPin, Building2, ArrowRight, FolderOpen } from "lucide-react";
import { useInView } from "react-intersection-observer";

const fallbackProjects = [
  {
    id: "1",
    title: "Steel Structure Fabrication",
    category: "Steel Fabrication",
    clientName: "L.S Automotive India Pvt Ltd",
    location: "Kadambathur, TN",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80",
    description:
      "Full-scope steel structure fabrication and erection for an automotive manufacturing facility, including structural columns, beams, bracing, and mezzanine decking.",
    featured: true,
  },
  {
    id: "2",
    title: "Industrial Roofing System",
    category: "Roof Structure",
    clientName: "Daeseung Autoparts India Pvt Ltd",
    location: "Kadambathur, TN",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-84280e292091?w=800&q=80",
    description:
      "Design and installation of a PEB roofing system with insulated panels, skylights, and rainwater management for a 12,000 sqft production hall.",
    featured: true,
  },
  {
    id: "3",
    title: "Industrial Pipeline Network",
    category: "Pipeline Work",
    clientName: "Competition Team Technology India Pvt Ltd",
    location: "Chennai, TN",
    imageUrl: "https://images.unsplash.com/photo-1565072888287-8e8f6a6a75b7?w=800&q=80",
    description:
      "End-to-end industrial pipeline design, fabrication, and installation covering water supply, drainage, and process piping across a multi-floor facility.",
    featured: false,
  },
  {
    id: "4",
    title: "Compressed Air Line Installation",
    category: "Air Line Work",
    clientName: "Duck Woo Auto India Pvt Ltd",
    location: "Kadambathur, TN",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    description:
      "Complete compressed air distribution system for a manufacturing plant, including compressor room, GI pipework, drops, and regulator stations.",
    featured: false,
  },
  {
    id: "5",
    title: "Precision Component Machining",
    category: "Machining Work",
    clientName: "VTK Industries",
    location: "Chennai, TN",
    imageUrl: "https://images.unsplash.com/photo-1565043589221-1a6fd9d45c5a?w=800&q=80",
    description:
      "CNC and conventional machining of industrial components including shafts, brackets, housings, and custom jig parts to client specifications.",
    featured: false,
  },
  {
    id: "6",
    title: "Clean Room PUF Panel Partition",
    category: "Puff Panel Partition",
    clientName: "IHD Industries Pvt Ltd",
    location: "Kadambathur, TN",
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80",
    description:
      "Insulated PUF panel partition system installed for a controlled clean room environment, with airtight joints and integrated door systems.",
    featured: false,
  },
  {
    id: "7",
    title: "Industrial Painting & Epoxy Flooring",
    category: "Painting Works",
    clientName: "ILGAHNG Automotive India Pvt Ltd",
    location: "Chennai, TN",
    imageUrl: "https://images.unsplash.com/photo-1516893848020-38bb4c19622c?w=800&q=80",
    description:
      "Surface preparation, anti-corrosion priming, industrial paint application, and epoxy floor coating for a 20,000 sqft factory floor.",
    featured: false,
  },
  {
    id: "8",
    title: "Aluminium Partition & False Ceiling",
    category: "Aluminium Partition",
    clientName: "VTK Industries",
    location: "Kadambathur, TN",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    description:
      "Modern aluminium framed partition system with integrated glazing, combined with a grid-type false ceiling for a corporate office space.",
    featured: false,
  },
];

const categories = ["All", "Steel Fabrication", "Roof Structure", "Pipeline Work", "Air Line Work", "Machining Work", "Puff Panel Partition", "Painting Works", "Aluminium Partition"];

const stats = [
  { value: "500+", label: "Projects Delivered" },
  { value: "9", label: "Service Categories" },
  { value: "50+", label: "Clients Served" },
  { value: "15+", label: "Years of Operation" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) && data.length > 0 ? data : fallbackProjects);
      })
      .catch(() => setProjects(fallbackProjects))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const featured = projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 rounded-full px-4 py-1.5 text-accent text-xs font-semibold tracking-widest uppercase mb-6"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Portfolio
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-5"
            >
              Our <span className="gradient-text">Projects</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              A selection of completed works across steel fabrication, roofing, pipeline systems, 
              machining, and industrial fit-out — delivered on time and to specification.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-card border-b border-border/40">
        <div className="container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center py-6 px-4">
                <div className="text-2xl md:text-3xl font-heading font-bold text-primary mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={ref} className="py-20 bg-background">
        <div className="container-padding">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Category filter */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-12"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-primary text-white shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* Grid */}
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((project, index) => (
                    <motion.div
                      key={project.id || `${project.category}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      onClick={() => setSelectedProject(project)}
                      className="group cursor-pointer relative rounded-2xl overflow-hidden border border-border/40 bg-card hover:border-accent/25 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={project.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {project.featured && (
                          <div className="absolute top-3 left-3 bg-accent text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-accent">
                          {project.category}
                        </span>
                        <h3 className="text-sm font-heading font-bold text-primary mt-1 mb-1.5 leading-snug">
                          {project.title}
                        </h3>
                        {project.clientName && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span className="truncate">{project.clientName}</span>
                          </div>
                        )}
                        {project.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{project.location}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  No projects found in this category.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/40 border-t border-border/40">
        <div className="container-padding text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
            Have a project in mind?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Tell us what you need and we&apos;ll provide a detailed quote within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/quote" className="btn-primary">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border/40 rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative w-full h-56 md:h-80">
                <Image
                  src={selectedProject.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-7">
                <span className="text-[10px] font-bold tracking-widest uppercase text-accent">
                  {selectedProject.category}
                </span>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-primary mt-1 mb-4">
                  {selectedProject.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5 pb-5 border-b border-border/40">
                  {selectedProject.clientName && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4 text-accent shrink-0" />
                      <span>{selectedProject.clientName}</span>
                    </div>
                  )}
                  {selectedProject.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-accent shrink-0" />
                      <span>{selectedProject.location}</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {selectedProject.description}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/quote" className="btn-primary text-sm">
                    Get Similar Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="btn-outline text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
