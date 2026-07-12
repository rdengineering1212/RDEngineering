"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageSquare } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function ContactCTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/95" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-padding relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
            Ready to Start Your{" "}
            <span className="gradient-text">Industrial Project?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get in touch with our team today. We'll provide a free consultation,
            detailed quote, and timeline for your project.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/quote" className="btn-primary text-base group">
              Get Free Quote
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="btn-outline text-base border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <a
              href="tel:+918883389766"
              className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
            >
              <Phone className="h-4 w-4 text-accent" />
              +91 8883389766
            </a>
            <a
              href="mailto:rdengineering1212@gmail.com"
              className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4 text-accent" />
              rdengineering1212@gmail.com
            </a>
            <a
              href="https://wa.me/918883389766"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-accent" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
