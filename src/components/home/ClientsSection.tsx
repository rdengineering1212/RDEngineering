"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const clients = [
  { name: "L.S Automotive India Pvt Ltd", industry: "Automotive" },
  { name: "Competition Team Technology India Pvt Ltd", industry: "Technology" },
  { name: "Daeseung Autoparts India Pvt Ltd", industry: "Automotive" },
  { name: "Duck Woo Auto India Pvt Ltd", industry: "Automotive" },
  { name: "VTK Industries", industry: "Manufacturing" },
  { name: "ILGAHNG Automotive India Pvt Ltd", industry: "Automotive" },
  { name: "IHD Industries Pvt Ltd", industry: "Manufacturing" },
];

export default function ClientsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-muted/30">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-title mb-4">
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="section-subtitle">
            We are proud to serve some of the most respected names in the automotive
            and industrial manufacturing sectors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group bg-card rounded-xl border border-border/40 hover:border-accent/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 p-6 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-20 h-20 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/15 to-accent/25 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-accent font-bold text-lg font-heading">
                  {client.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                <span className="notranslate" translate="no">{client.name}</span>
              </h3>
              <p className="text-xs text-muted-foreground">{client.industry}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
