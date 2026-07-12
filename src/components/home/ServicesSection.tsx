"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  DollarSign,
  Wrench,
  Pipette,
  Cog,
  PanelTop,
  Columns3,
  ArrowRight,
  PaintBucket,
  Warehouse,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const services = [
  {
    icon: Building2,
    title: "Steel Fabrication",
    description: "Custom steel structures, beams, columns, and industrial frameworks fabricated to exact specifications.",
    href: "/services/steel-fabrication",
  },
  {
    icon: Warehouse,
    title: "Roof Structure & Sheet Work",
    description: "Industrial roofing solutions including PEB structures, sheet roofing, and insulation work.",
    href: "/services/roof-structure-sheet-work",
  },
  {
    icon: DollarSign,
    title: "Pipeline Work",
    description: "Industrial pipeline installation, maintenance, and repair for various applications.",
    href: "/services/pipeline-work",
  },
  {
    icon: Wrench,
    title: "Air Line Work",
    description: "Compressed air line installation and maintenance for industrial facilities.",
    href: "/services/air-line-work",
  },
  {
    icon: Cog,
    title: "Machining Work",
    description: "Precision machining services including drilling, grinding, and cutting operations.",
    href: "/services/machining-work",
  },
  {
    icon: PanelTop,
    title: "Puff Panel Partition",
    description: "PUF panel partition walls for clean rooms, cold storage, and industrial spaces.",
    href: "/services/puff-panel-partition",
  },
  {
    icon: Columns3,
    title: "Aluminium Partition",
    description: "Modern aluminium partition systems for offices and industrial work areas.",
    href: "/services/aluminium-partition",
  },
  {
    icon: Pipette,
    title: "False Ceiling",
    description: "Professional false ceiling installation with various materials and designs.",
    href: "/services/false-ceiling",
  },
  {
    icon: PaintBucket,
    title: "Painting Works",
    description: "Industrial painting, protective coatings, and surface finishing services.",
    href: "/services/painting-works",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ServicesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-padding relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-title mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive industrial engineering solutions delivered with precision,
            quality, and decades of expertise.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Link
                href={service.href}
                className="group block p-8 bg-card rounded-2xl border border-border/40 hover:border-accent/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/15 to-accent/25 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-accent/25 group-hover:to-accent/35 transition-all duration-500">
                  <service.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                  Learn More <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn-primary">
            View All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
