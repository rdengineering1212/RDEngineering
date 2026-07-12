"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Cog, Wrench, HardHat, Drill, Hammer, Gauge, CircleDot, Settings } from "lucide-react";

const machinery = [
  { name: "Column Drilling Machine", description: "Heavy-duty column drilling machine for precision drilling operations in metal and steel fabrication.", icon: Drill, specs: "Capacity: Up to 50mm | Motor: 3HP | Variable Speed | Auto-feed", status: "Operational", quantity: 3 },
  { name: "Arc Welding Machines", description: "Industrial arc welding machines for high-quality metal joining and fabrication work.", icon: Settings, specs: "Current: 400A | Duty Cycle: 60% | Multi-process | Digital Control", status: "Operational", quantity: 10 },
  { name: "Gas Cutting Sets", description: "Professional gas cutting equipment for precision cutting of steel plates and structures.", icon: Gauge, specs: "Cutting Thickness: Up to 200mm | Oxy-Acetylene | Regulator Sets", status: "Operational", quantity: 5 },
  { name: "Cut Off Machines", description: "High-speed cut-off machines for clean, precise cutting of metal sections and pipes.", icon: CircleDot, specs: 'Blade Size: 14" | Motor: 3HP | 3800 RPM | Mitre Cutting', status: "Operational", quantity: 4 },
  { name: "Grinding Machines", description: "Surface and angle grinding machines for finishing and preparation work.", icon: Cog, specs: 'Wheel Size: 7" | Variable Speed | 8500 RPM | Anti-vibration', status: "Operational", quantity: 8 },
  { name: "Portable Drilling Machines", description: "Magnetic base portable drilling machines for on-site fabrication work.", icon: Wrench, specs: "Capacity: Up to 35mm | Magnetic Base | 1200W | Variable Speed", status: "Operational", quantity: 6 },
  { name: "Anchoring Machines", description: "Professional anchoring and fastening equipment for industrial installations.", icon: HardHat, specs: "Impact Energy: 10J | SDS Max | Anti-vibration | Dust Extraction", status: "Operational", quantity: 4 },
  { name: "Hand Saw Machines", description: "Portable hand saw machines for cutting metal, wood, and construction materials.", icon: Hammer, specs: 'Blade Size: 10" | 1500W | Variable Speed | Laser Guide', status: "Operational", quantity: 5 },
  { name: "Pressure Testing Equipment", description: "Hydrostatic pressure testing equipment for pipeline and system validation.", icon: Gauge, specs: "Pressure: Up to 500 Bar | Digital Display | Data Logging | Safety Valves", status: "Operational", quantity: 2 },
];

export default function MachineryPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Our <span className="gradient-text">Machinery</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >State-of-the-art equipment for precision industrial fabrication and construction.</motion.p>
        </div>
      </section>

      <section ref={ref} className="py-20 bg-background">
        <div className="container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machinery.map((machine, index) => (
              <motion.div key={machine.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group bg-card rounded-2xl border border-border/40 hover:border-accent/20 hover:shadow-2xl transition-all duration-500 p-6 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/15 to-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <machine.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary group-hover:text-accent transition-colors duration-300">{machine.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-500/10 dark:text-green-400 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      {machine.status} ({machine.quantity})
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{machine.description}</p>
                <div className="bg-muted/40 rounded-lg p-3 border border-border/20">
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">{machine.specs}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
