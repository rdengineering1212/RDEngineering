"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Loader2, MapPin, Building2, ArrowRight, FolderOpen, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

const CATEGORIES = ["All", "Steel Fabrication", "Pipeline", "Roofing", "Painting", "PUF Panels", "Aluminium", "Machining", "Others"];

export default function ProjectsClient({ initialProjects = [] }: { initialProjects?: any[] }) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  // Lightbox index for sub-gallery inside preview
  const [activeImageIdx, setActiveImageIdx] = useState<number>(-1); 

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  useEffect(() => {
    if (initialProjects.length === 0) {
      fetch("/api/projects", { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("API unavailable");
          return res.json();
        })
        .then((data) => {
          setProjects(data);
        })
        .catch(() => {});
    }
  }, [initialProjects]);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const openProjectDetails = (project: any) => {
    setSelectedProject(project);
    setActiveImageIdx(-1);
  };

  const handleNextImage = (images: string[]) => {
    if (activeImageIdx === -1) return;
    setActiveImageIdx((activeImageIdx + 1) % images.length);
  };

  const handlePrevImage = (images: string[]) => {
    if (activeImageIdx === -1) return;
    setActiveImageIdx((activeImageIdx - 1 + images.length) % images.length);
  };

  // Combine cover image and gallery images for lightbox
  const getProjectAllImages = (proj: any) => {
    const list = [];
    if (proj.imageUrl) list.push(proj.imageUrl);
    if (proj.images && proj.images.length > 0) {
      list.push(...proj.images);
    }
    return list;
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0A1628] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/95 to-[#0A1628]" />
        <div className="container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
            >
              <FolderOpen className="h-3.5 w-3.5 text-accent" />
              <span className="text-gray-300 text-xs font-semibold tracking-widest uppercase">Project Case Studies</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-5"
            >
              Our Engineering <span className="gradient-text">Portfolio</span>
            </motion.h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Explore our record of structural fabrication, insulated panels, pipeline setups, and custom machine works built across South India.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section ref={ref} className="py-20 bg-[#080F1C]">
        <div className="container-padding">
          <>
            {/* Category Filter Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-12"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-accent text-primary shadow-lg"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* Grid Layout */}
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      onClick={() => openProjectDetails(project)}
                      className="group cursor-pointer bg-[#0F1E36] rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Image Cover */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image
                            src={project.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080F1C]/90 via-transparent to-transparent opacity-60" />
                          {project.featured && (
                            <span className="absolute top-3 left-3 bg-accent text-primary text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-2">
                          <span className="text-[9px] font-bold tracking-widest uppercase text-accent">
                            {project.category}
                          </span>
                          <h3 className="text-base font-heading font-bold text-white leading-tight group-hover:text-accent transition-colors line-clamp-2">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-0 space-y-1 border-t border-white/5 mt-3">
                        {project.clientName && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Building2 className="h-3.5 w-3.5 text-accent shrink-0" />
                            <span className="truncate notranslate" translate="no">{project.clientName}</span>
                          </div>
                        )}
                        {project.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                            <span className="truncate">{project.location}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  No projects found under this division.
                </div>
              )}
          </>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0A1628] border border-white/10 rounded-2xl max-w-3xl w-full my-8 max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover Header */}
              <div className="relative h-64 sm:h-80 w-full bg-[#080F1C]">
                <Image
                  src={selectedProject.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-accent text-primary font-black uppercase text-[10px] px-2 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-heading font-bold text-white mt-2 leading-tight">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Specs & Description */}
              <div className="p-6 space-y-6 text-white">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Client</div>
                      <div className="text-xs font-semibold truncate max-w-[120px]">{selectedProject.clientName || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Location</div>
                      <div className="text-xs font-semibold">{selectedProject.location || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Completed</div>
                      <div className="text-xs font-semibold">
                        {selectedProject.date ? new Date(selectedProject.date).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-accent shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Category</div>
                      <div className="text-xs font-semibold truncate max-w-[120px]">{selectedProject.category}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase text-accent mb-2">Project Overview</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{selectedProject.description}</p>
                </div>

                {selectedProject.content && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-accent mb-2">Technical Specifications</h3>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedProject.content}</p>
                  </div>
                )}

                {/* Sub-gallery grids */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-accent mb-3">Project Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedProject.images.map((imgUrl: string, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setActiveImageIdx(idx + 1)} // idx+1 matches list having cover at idx=0
                          className="relative aspect-video rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:brightness-110 transition-all"
                        >
                          <Image src={imgUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 30vw" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Close Case Study
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox full-screen viewer */}
      <AnimatePresence>
        {selectedProject && activeImageIdx > -1 && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 select-none"
            onClick={() => setActiveImageIdx(-1)}
          >
            <div className="relative w-full max-w-4xl aspect-[16/10] max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveImageIdx(-1)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-accent transition-colors"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>

              <button
                onClick={() => handlePrevImage(getProjectAllImages(selectedProject))}
                className="absolute left-0 p-2 text-white hover:text-accent bg-black/40 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <div className="relative w-full h-full">
                <Image
                  src={getProjectAllImages(selectedProject)[activeImageIdx]}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              <button
                onClick={() => handleNextImage(getProjectAllImages(selectedProject))}
                className="absolute right-0 p-2 text-white hover:text-accent bg-black/40 rounded-full transition-colors z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>
            
            <span className="text-white text-xs mt-4">
              Image {activeImageIdx + 1} of {getProjectAllImages(selectedProject).length}
            </span>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
