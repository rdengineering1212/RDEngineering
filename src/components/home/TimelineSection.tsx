"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Building2, Users, Layers, Cog, TrendingUp, CheckCircle2 } from "lucide-react";

const milestones = [
  {
    year: "2010",
    title: "Company Established",
    description:
      "RD Engineering was founded with a focus on delivering reliable steel fabrication and structural engineering services.",
    icon: Building2,
  },
  {
    year: "2012",
    title: "Expansion into Industrial Fabrication",
    description:
      "Broadened service capabilities to include roof structures, pipeline systems, and air line installations.",
    icon: Layers,
  },
  {
    year: "2016",
    title: "Large-Scale Industrial Projects",
    description:
      "Executed major structural and fabrication projects for leading industrial clients across multiple sectors.",
    icon: Cog,
  },
  {
    year: "2020",
    title: "Advanced Steel Infrastructure",
    description:
      "Completed complex steel infrastructure projects including PEB systems, large-span roof structures, and precision machining work.",
    icon: TrendingUp,
  },
  {
    year: "2023",
    title: "Growing Client Network",
    description:
      "Expanded relationships across industries — serving 50+ clients with consistent quality and on-time delivery.",
    icon: Users,
  },
  {
    year: "2026 – Present",
    title: "Continuing to Deliver",
    description:
      "Providing reliable industrial engineering solutions across 9 service categories with a skilled team and modern equipment.",
    icon: CheckCircle2,
  },
];

export default function TimelineSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-4">
            Our Journey
          </span>
          <h2 className="section-title mb-4">
            Built Over <span className="gradient-text">15 Years</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A consistent record of growth, capability, and client satisfaction.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/60 via-accent/30 to-transparent md:-translate-x-px" />

          <div className="space-y-10 md:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                className={`relative flex items-start gap-8 md:mb-16 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Icon dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className="h-14 w-14 rounded-full bg-card border-2 border-accent/50 shadow-md shadow-accent/10 flex items-center justify-center hover:border-accent transition-colors duration-300">
                    <milestone.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`ml-24 md:ml-0 md:w-[calc(50%-3.5rem)] ${
                    index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                  }`}
                >
                  <div className="bg-card rounded-2xl p-6 border border-border/40 shadow-sm hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-400">
                    <span className="inline-block text-accent font-heading font-bold text-xl mb-1">
                      {milestone.year}
                    </span>
                    <h3 className="text-base font-heading font-bold text-primary mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
