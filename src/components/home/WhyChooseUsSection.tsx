"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ShieldCheck,
  Clock,
  Users,
  Wrench,
  Award,
  HeadphonesIcon,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Adherence to international quality standards with rigorous inspection at every stage.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "Proven track record of completing projects on or before schedule.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Skilled workforce of 50+ professionals led by experienced management.",
  },
  {
    icon: Wrench,
    title: "Modern Equipment",
    description: "State-of-the-art machinery including drilling, welding, and cutting equipment.",
  },
  {
    icon: Award,
    title: "Industry Experience",
    description: "15+ years serving leading automotive and industrial clients across Tamil Nadu.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support and after-service assistance.",
  },
];

export default function WhyChooseUsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-title mb-4">
            Why Choose <span className="gradient-text">RD Engineering?</span>
          </h2>
          <p className="section-subtitle">
            What sets us apart is our unwavering commitment to quality, safety, and
            customer satisfaction in every project we undertake.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="p-8 rounded-2xl bg-card border border-border/40 hover:border-accent/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 h-full relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent/15 to-accent/25 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-accent/25 group-hover:to-accent/35 transition-all duration-500">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
