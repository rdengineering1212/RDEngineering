"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const teamMembers = [
  { name: "Management Team", role: "Strategic Leadership", description: "Experienced management professionals guiding the company with strategic vision and industry expertise.", responsibilities: ["Business Strategy & Growth", "Client Relations", "Quality Management", "Financial Planning"] },
  { name: "Supervisors", role: "Project Management", description: "Dedicated supervisors ensuring every project meets quality standards and timelines.", responsibilities: ["Project Planning & Execution", "Team Coordination", "Quality Control", "Safety Management"] },
  { name: "Welders", role: "Fabrication Specialists", description: "Certified welders with expertise in MIG, TIG, and arc welding for industrial applications.", responsibilities: ["Steel Fabrication", "Structural Welding", "Pipe Welding", "Quality Testing"] },
  { name: "Painters", role: "Finishing Experts", description: "Skilled painters specializing in industrial coatings and protective finishes.", responsibilities: ["Surface Preparation", "Industrial Painting", "Protective Coatings", "Quality Inspection"] },
  { name: "Helpers", role: "Support Staff", description: "Dedicated support team ensuring smooth operations and project efficiency.", responsibilities: ["Material Handling", "Equipment Maintenance", "Site Support", "Logistics"] },
];

export default function TeamPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Our <span className="gradient-text">Team</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Meet the skilled professionals behind RD Engineering's success.</motion.p>
        </div>
      </section>

      <section ref={ref} className="py-20 bg-background">
        <div className="container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="section-title mb-4">Our <span className="gradient-text">Workforce</span></h2>
            <p className="section-subtitle">A team of 50+ skilled professionals dedicated to delivering engineering excellence.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-2xl border border-border/40 hover:border-accent/20 hover:shadow-2xl transition-all duration-500 p-8 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl animate-pulse" />
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl font-heading font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-300">{member.name}</h3>
                <p className="text-accent font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{member.description}</p>
                <div className="space-y-2">
                  {member.responsibilities.map((resp) => (
                    <div key={resp} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {resp}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
