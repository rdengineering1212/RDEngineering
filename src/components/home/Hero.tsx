"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen, CheckCircle, Clock, Award } from "lucide-react";

const stats = [
  {
    label: "Years in Operation",
    value: "15+",
    icon: Award,
    description: "Est. 2010",
  },
  {
    label: "Projects Delivered",
    value: "500+",
    icon: FolderOpen,
    description: "Across 9 services",
  },
  {
    label: "Active Clients",
    value: "50+",
    icon: CheckCircle,
    description: "Long-term partners",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20 sm:pt-28"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80')] bg-cover bg-center bg-no-repeat" />
        {/* Primary dark navy directional overlay — left heavy for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,15,28,0.92) 0%, rgba(8,15,28,0.78) 50%, rgba(8,15,28,0.55) 100%)",
          }}
        />
        {/* Bottom vignette for grounding */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,15,28,0.70) 0%, transparent 45%)",
          }}
        />
      </div>

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient orbs */}
      <motion.div
        animate={{ y: [0, -28, 0], x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-16 w-80 h-80 bg-accent/6 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-16 w-96 h-96 bg-accent/4 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative container-padding w-full">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2 mb-10"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-xs font-semibold tracking-widest uppercase">
              Industrial Engineering Since 2010
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-heading font-bold text-white leading-[1.08] tracking-tight mb-7"
          >
            Engineering{" "}
            <span className="gradient-text">Precision.</span>
            <br />
            Building{" "}
            <span className="text-white">Excellence.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="text-base md:text-lg text-gray-200 max-w-2xl mb-11 leading-relaxed font-light"
            style={{ textShadow: "0 1px 12px rgba(8,15,28,0.8)" }}
          >
            Delivering high-quality steel fabrication, industrial construction, roofing, 
            pipeline systems, and structural engineering solutions — with precision, 
            reliability, and uncompromising workmanship.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20"
          >
            <Link href="/quote" className="btn-primary text-sm group">
              Request a Quote
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-accent transition-colors duration-300 group"
            >
              <span className="h-px w-8 bg-white/30 group-hover:bg-accent group-hover:w-12 transition-all duration-300" />
              View Our Work
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.6 }}
            className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden max-w-2xl"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center px-4 py-6 transition-colors duration-300"
                style={{
                  background: "rgba(8,15,28,0.45)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "rgba(8,15,28,0.58)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "rgba(8,15,28,0.45)")
                }
              >
                <stat.icon className="h-5 w-5 text-accent mb-2" />
                <span className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-200 mt-1">{stat.label}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{stat.description}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400"
        >
          <div className="h-9 w-5 rounded-full border border-gray-500 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="h-2 w-0.5 rounded-full bg-accent"
            />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-gray-500">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
