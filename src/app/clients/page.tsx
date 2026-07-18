"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Building2, Factory, Wrench, Cog } from "lucide-react";

const clients = [
  { name: "L.S Automotive India Pvt Ltd", industry: "Automotive", description: "Steel fabrication, roofing, and pipeline installations for production facilities." },
  { name: "Competition Team Technology India Pvt Ltd", industry: "Technology", description: "Industrial fit-out including pipeline systems and structural works." },
  { name: "Daeseung Autoparts India Pvt Ltd", industry: "Automotive", description: "Roofing systems and structural steel for auto parts manufacturing plant." },
  { name: "Duck Woo Auto India Pvt Ltd", industry: "Automotive", description: "Compressed air line systems and steel works for automotive component production." },
  { name: "VTK Industries", industry: "Manufacturing", description: "Machining, aluminium partitioning, and structural fabrication services." },
  { name: "ILGAHNG Automotive India Pvt Ltd", industry: "Automotive", description: "Industrial painting, epoxy flooring, and factory fit-out works." },
  { name: "IHD Industries Pvt Ltd", industry: "Manufacturing", description: "PUF panel partition systems and clean room fit-out." },
];

const industries = [
  { icon: Factory, name: "Automotive", count: "5+", description: "Leading automotive manufacturers" },
  { icon: Building2, name: "Manufacturing", count: "3+", description: "Industrial production units" },
  { icon: Wrench, name: "Engineering", count: "2+", description: "Engineering and technology firms" },
  { icon: Cog, name: "Industrial", count: "7+", description: "Industrial sector companies" },
];

export default function ClientsPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Our <span className="gradient-text">Clients</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-gray-300 max-w-xl mx-auto"
          >Companies we have worked with across industrial and manufacturing sectors.</motion.p>
        </div>
      </section>

      {/* Industries Served */}
      <section ref={ref} className="py-20 bg-muted/40">
        <div className="container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="section-title mb-4">Industries <span className="gradient-text">Served</span></h2>
            <p className="section-subtitle">Industrial sectors where we have delivered ongoing project work.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div key={industry.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border/40 hover:border-accent/20 hover:shadow-xl transition-all duration-500 text-center relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-20 h-20 bg-accent/5 rounded-full blur-2xl" />
                <industry.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-primary mb-1">{industry.name}</h3>
                <span className="text-3xl font-heading font-bold text-accent block mb-2">{industry.count}</span>
                <p className="text-sm text-muted-foreground">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Cards */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="section-title mb-4">Our Valued <span className="gradient-text">Clients</span></h2>
            <p className="section-subtitle">Companies that trust us with their engineering and construction needs.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div key={client.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-card rounded-2xl p-8 border border-border/40 hover:border-accent/20 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/15 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl font-heading font-bold text-accent">{client.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300"><span className="notranslate" translate="no">{client.name}</span></h3>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold mb-2">{client.industry}</span>
                <p className="text-sm text-muted-foreground">{client.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
