"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen, CheckCircle, Award } from "lucide-react";

function Counter({ value, duration = 2.5 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) {
      setCount(end);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    const timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [numericValue, duration]);

  return <>{count}{suffix}</>;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Setting fetch removed to ensure hardcoded exact strings
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 bg-[#080F1C]"
    >
      {/* Background Graphic */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-25" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(8,15,28,0.96) 0%, rgba(8,15,28,0.85) 50%, rgba(8,15,28,0.4) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(8,15,28,0.8) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative container-padding w-full">
        <div className="max-w-5xl mx-auto">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
          >
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-[10px] font-bold tracking-widest uppercase">
              INDUSTRIAL ENGINEERING SINCE 2010
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.1] tracking-tight mb-6"
          >
            Engineering <span className="gradient-text">Precision.</span><br />
            Building Excellence.
          </motion.h1>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed font-light"
          >
            Delivering high-quality steel fabrication, industrial construction, roofing, pipeline systems, and structural engineering solutions — with precision, reliability, and uncompromising workmanship.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16"
          >
            <Link href="/quote" className="btn-primary text-sm group">
              Request a Quote
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-accent transition-all duration-300 group"
            >
              <span className="h-px w-8 bg-white/20 group-hover:bg-accent group-hover:w-12 transition-all duration-300" />
              View Our Work
            </Link>
          </motion.div>

          {/* Dashboard Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-px rounded-xl overflow-hidden max-w-2xl bg-white/10"
          >
            <div className="flex flex-col items-center text-center px-4 py-5 bg-[#0A1628]/85 backdrop-blur-md hover:bg-[#0A1628]/95 transition-colors">
              <Award className="h-4 w-4 text-accent mb-2" />
              <span className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight"><Counter value="15+" /></span>
              <span className="text-[10px] font-semibold text-gray-300 mt-1 uppercase tracking-wider">Years in Operation</span>
            </div>
            <div className="flex flex-col items-center text-center px-4 py-5 bg-[#0A1628]/85 backdrop-blur-md hover:bg-[#0A1628]/95 transition-colors">
              <FolderOpen className="h-4 w-4 text-accent mb-2" />
              <span className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight"><Counter value="500+" /></span>
              <span className="text-[10px] font-semibold text-gray-300 mt-1 uppercase tracking-wider">Projects Delivered</span>
            </div>
            <div className="flex flex-col items-center text-center px-4 py-5 bg-[#0A1628]/85 backdrop-blur-md hover:bg-[#0A1628]/95 transition-colors">
              <CheckCircle className="h-4 w-4 text-accent mb-2" />
              <span className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight"><Counter value="50+" /></span>
              <span className="text-[10px] font-semibold text-gray-300 mt-1 uppercase tracking-wider">Active Clients</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
