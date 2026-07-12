"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Building2, Users, CheckCircle, HardHat, Trophy, Cog } from "lucide-react";

const stats = [
  { icon: Trophy, value: 15, suffix: "+", label: "Years Experience" },
  { icon: CheckCircle, value: 500, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 50, suffix: "+", label: "Happy Clients" },
  { icon: Building2, value: 9, suffix: "", label: "Service Categories" },
  { icon: Cog, value: 20, suffix: "+", label: "Machines & Equipment" },
  { icon: HardHat, value: 50, suffix: "+", label: "Skilled Workforce" },
];

function Counter({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: any }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-accent/10 border border-accent/25 mb-4">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
        {count}{suffix}
      </div>
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="relative bg-background border-b border-border/20 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.03),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.03),transparent_50%)]" />
      </div>

      <div className="container-padding relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-title mb-4">
            By the <span className="gradient-text">Numbers</span>
          </h2>
          <p className="section-subtitle">
            Our track record speaks for itself. We've delivered excellence across
            Tamil Nadu's industrial sector.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {stats.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
