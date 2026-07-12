"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useInView } from "react-intersection-observer";

const faqs = [
  { question: "What services does RD Engineering offer?", answer: "We offer 9 comprehensive service categories including Steel Fabrication, Roof Structure & Sheet Work, Pipeline Work, Air Line Work, Machining Work, Puff Panel Partition, Aluminium Partition, False Ceiling, and Painting Works." },
  { question: "What industries do you serve?", answer: "We primarily serve automotive, manufacturing, and industrial sectors. Our clients include L.S Automotive, Daeseung Autoparts, Duck Woo Auto, and other leading companies." },
  { question: "How do I request a quote?", answer: "You can request a quote through our online form, call us at +91 8883389766, or email us at rdengineering1212@gmail.com. We respond within 48 hours." },
  { question: "Do you provide custom steel fabrication?", answer: "Yes, we specialize in custom steel fabrication to your exact specifications with strict quality control and timely delivery." },
  { question: "What areas do you serve?", answer: "We serve clients across Tamil Nadu and surrounding regions from our base in Kadambathur." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background">
      <div className="container-padding max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-title mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-subtitle">
            Quick answers to common questions about our services and process.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card rounded-xl overflow-hidden border border-border/40 hover:border-accent/20 transition-all duration-300 relative"
            >
              <div className="absolute -right-10 -top-10 w-20 h-20 bg-accent/5 rounded-full blur-2xl" />
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left relative"
              >
                <span className="text-sm font-semibold text-primary pr-4">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-accent shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0 relative">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link href="/faq" className="text-primary hover:text-accent font-semibold text-sm inline-flex items-center gap-2 transition-colors">
            View All FAQs <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
