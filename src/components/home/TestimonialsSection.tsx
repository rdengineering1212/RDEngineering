"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Operations Director",
    company: "L.S Automotive India Pvt Ltd",
    content: "RD Engineering has been our trusted partner for steel fabrication and structural work. Their professionalism, quality, and timely delivery are exceptional. Highly recommended for industrial projects.",
    rating: 5,
  },
  {
    name: "Plant Manager",
    company: "Daeseung Autoparts India Pvt Ltd",
    content: "We've worked with RD Engineering on multiple projects including roof structures and pipeline work. Their team's expertise and attention to detail set them apart from other contractors.",
    rating: 5,
  },
  {
    name: "CEO",
    company: "Competition Team Technology India Pvt Ltd",
    content: "Outstanding work on our facility expansion. RD Engineering delivered beyond our expectations. Their project management and quality control are world-class.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-padding relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="section-title text-white mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Don't just take our word for it. Here's what our clients have to say
            about working with RD Engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.company}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-card border border-border/40 rounded-2xl p-8 h-full hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
                <Quote className="h-10 w-10 text-accent/30 mb-6 group-hover:text-accent/50 transition-colors relative z-10" />
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm relative z-10">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex gap-1 mb-4 relative z-10">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="relative z-10">
                  <p className="text-primary font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
