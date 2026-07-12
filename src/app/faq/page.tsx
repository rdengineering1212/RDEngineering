"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  { category: "General", question: "What services does RD Engineering offer?", answer: "RD Engineering offers 9 comprehensive service categories including Steel Fabrication, Roof Structure & Sheet Work, Pipeline Work, Air Line Work, Machining Work, Puff Panel Partition, Aluminium Partition, False Ceiling, and Painting Works for industrial and commercial clients." },
  { category: "General", question: "Where is RD Engineering located?", answer: "Our office and workshop are located at 4/372 Nehru Street, Dr Ambedkar Nagar, Kadambathur, Tamil Nadu. We serve clients across Tamil Nadu and surrounding regions." },
  { category: "General", question: "What industries do you serve?", answer: "We primarily serve the automotive, manufacturing, and industrial sectors. Our clients include L.S Automotive, Daeseung Autoparts, Duck Woo Auto, VTK Industries, and other leading companies." },
  { category: "Services", question: "Do you provide custom steel fabrication?", answer: "Yes, we specialize in custom steel fabrication including structural steel, beams, columns, trusses, platforms, and custom frameworks. We fabricate to your exact specifications with strict quality control." },
  { category: "Services", question: "What types of roofing solutions do you offer?", answer: "We offer complete industrial roofing solutions including PEB structures, metal sheet roofing, insulation, skylights, waterproofing, and repair work for industrial and commercial buildings." },
  { category: "Services", question: "Do you handle both small and large projects?", answer: "Absolutely. We handle projects of all sizes, from small repair and maintenance work to large-scale industrial construction projects worth several crores." },
  { category: "Process", question: "How do I request a quote?", answer: "You can request a quote through our online form, call us at +91 8883389766, or email us at rdengineering1212@gmail.com. We typically respond with a detailed quotation within 48 hours." },
  { category: "Process", question: "What is your project timeline?", answer: "Project timelines vary based on scope and complexity. During the quotation process, we provide a detailed timeline. Our team is known for completing projects on or before schedule." },
  { category: "Process", question: "Do you provide project consultation?", answer: "Yes, we provide free initial consultation to understand your requirements, assess feasibility, and recommend the best solutions. Contact us to schedule a consultation." },
  { category: "Quality", question: "What quality standards do you follow?", answer: "We adhere to international quality standards with rigorous inspection at every stage of fabrication and installation. Our team follows strict quality control procedures." },
  { category: "Quality", question: "Do you offer warranty on your work?", answer: "Yes, we stand behind the quality of our work. All our projects come with a warranty. The specific warranty period depends on the type of work and materials used." },
  { category: "Clients", question: "Who are your major clients?", answer: "We are proud to serve L.S Automotive India Pvt Ltd, Competition Team Technology India Pvt Ltd, Daeseung Autoparts India Pvt Ltd, Duck Woo Auto India Pvt Ltd, VTK Industries, ILGAHNG Automotive India Pvt Ltd, and IHD Industries Pvt Ltd." },
  { category: "Clients", question: "Can I see examples of your previous work?", answer: "Yes! You can view our project portfolio in the Projects and Gallery sections of our website. We showcase a variety of completed projects across different service categories." },
];

const categories = ["All", "General", "Services", "Process", "Quality", "Clients"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = faqs.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Frequently Asked <span className="gradient-text">Questions</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Find answers to common questions about our services, process, and company.</motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-padding max-w-3xl mx-auto">
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full h-12 rounded-xl border border-border/40 bg-card pl-12 pr-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground" />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-accent text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >{cat}</button>
            ))}
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filtered.map((faq, index) => (
              <motion.div key={faq.question} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}
                className="bg-card rounded-xl border border-border/40 overflow-hidden hover:border-accent/20 transition-all duration-300"
              >
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-accent bg-accent/15 px-2 py-1 rounded-full">{faq.category}</span>
                    <span className="text-sm font-semibold text-primary">{faq.question}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-accent shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
