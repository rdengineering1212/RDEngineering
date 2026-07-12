"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, Wrench, Cog, PaintBucket, Pipette, PanelTop, Columns3, DollarSign, Warehouse } from "lucide-react";
import { useInView } from "react-intersection-observer";

const services = [
  { icon: Building2, title: "Steel Fabrication", description: "Custom steel structures, beams, columns, trusses, and industrial frameworks. We fabricate and erect steel structures for factories, warehouses, and commercial buildings with precision engineering.", slug: "steel-fabrication" },
  { icon: Warehouse, title: "Roof Structure & Sheet Work", description: "Complete industrial roofing solutions including PEB structures, metal sheet roofing, insulation, skylights, and waterproofing for industrial and commercial buildings.", slug: "roof-structure-sheet-work" },
  { icon: DollarSign, title: "Pipeline Work", description: "Design, fabrication, and installation of industrial pipeline systems for water, gas, chemicals, and steam applications with pressure testing and certification.", slug: "pipeline-work" },
  { icon: Wrench, title: "Air Line Work", description: "Compressed air line installation, maintenance, and repair services for industrial facilities. Complete pneumatic system solutions.", slug: "air-line-work" },
  { icon: Cog, title: "Machining Work", description: "Precision machining services including column drilling, grinding, cutting, and custom machining operations for industrial components.", slug: "machining-work" },
  { icon: PanelTop, title: "Puff Panel Partition", description: "PUF (Polyurethane Foam) panel partition walls for clean rooms, cold storage facilities, HVAC enclosures, and industrial space division.", slug: "puff-panel-partition" },
  { icon: Columns3, title: "Aluminium Partition", description: "Modern aluminium partition systems for offices, work areas, and commercial spaces. Custom designs with glass and solid panel options.", slug: "aluminium-partition" },
  { icon: Pipette, title: "False Ceiling", description: "Professional false ceiling installation using gypsum, PVC, metal, and mineral fiber materials. Aesthetic and functional ceiling solutions.", slug: "false-ceiling" },
  { icon: PaintBucket, title: "Painting Works", description: "Industrial painting, protective coatings, epoxy flooring, and surface finishing for factories, structures, and equipment.", slug: "painting-works" },
];

export default function ServicesPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Our <span className="gradient-text">Services</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Comprehensive industrial engineering solutions delivered with precision and excellence.</motion.p>
        </div>
      </section>

      <section ref={ref} className="py-20">
        <div className="container-padding">
          <div className="grid grid-cols-1 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/services/${service.slug}`} className="group block bg-card rounded-2xl border border-border p-8 hover:border-secondary/30 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <service.icon className="h-8 w-8 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                    <div className="text-secondary group-hover:translate-x-2 transition-transform duration-300">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
