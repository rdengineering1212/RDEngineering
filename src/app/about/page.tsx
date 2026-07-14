"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Eye, Heart, Shield, Users, Award } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Quality Without Compromise",
    description:
      "Every weld, every joint, every installation is inspected before handover. We don't pass problems on to clients.",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    description:
      "We work alongside our clients from first site visit to final handover, maintaining clear communication throughout.",
  },
  {
    icon: Award,
    title: "Accountability",
    description:
      "We stand behind our work. If something isn't right, we fix it — without debate and without delay.",
  },
];

const teamMembers = [
  {
    name: "Management",
    role: "Strategy & Operations",
    description:
      "Experienced in large-scale industrial project coordination, client relations, and technical oversight.",
  },
  {
    name: "Supervisors",
    role: "Site & Project Management",
    description:
      "Hands-on supervisors who manage safety, quality, and scheduling on every active project.",
  },
  {
    name: "Technical Workforce",
    role: "Fabrication & Installation",
    description:
      "Skilled welders, machinists, pipe fitters, painters, and civil workers with years of industrial experience.",
  },
];

export default function AboutPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 rounded-full px-4 py-1.5 text-accent text-xs font-semibold tracking-widest uppercase mb-6"
          >
            Est. 2010
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >
            About <span className="gradient-text">RD Engineering</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed"
          >
            A trusted industrial engineering company with over 15 years of project delivery experience.
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-4">
                Our Story
              </span>
              <h2 className="section-title mb-6">
                Built on <span className="gradient-text">Consistent Delivery</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>
                  RD Engineering was established in 2010 with a straightforward objective — to deliver
                  reliable steel fabrication and industrial construction services to clients who value
                  precision and accountability.
                </p>
                <p>
                  Over 15 years, we have grown steadily, adding capabilities in roofing systems, pipeline
                  work, air line installation, machining, partitioning, and finishing works. Today, our team
                  handles projects from initial survey to final inspection.
                </p>
                <p>
                  We have completed 500+ projects for 50+ clients — including established names in
                  automotive components, precision manufacturing, and industrial processing. Our work speaks
                  through the relationships we maintain with clients who return for every new project.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80"
                  alt="RD Engineering Workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-card border border-border/40 rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-heading font-bold text-primary">15+</div>
                <div className="text-xs text-muted-foreground tracking-wide">Years of Operation</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={ref} className="py-20 bg-muted/40">
        <div className="container-padding">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              What We Stand For
            </span>
            <h2 className="section-title">
              Mission, Vision & <span className="gradient-text">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To execute industrial engineering projects with technical accuracy, safety, and on-time delivery — every time.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                description:
                  "To be the most reliable engineering contractor for industrial clients who require consistent quality and long-term partnership.",
              },
              {
                icon: Heart,
                title: "Our Values",
                description:
                  "Integrity in every quote. Precision in every weld. Responsibility on every site. These are non-negotiable.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border/40 hover:border-accent/20 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-20 h-20 bg-accent/5 rounded-full blur-2xl" />
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/15 to-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-heading font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-4">
              Our People
            </span>
            <h2 className="section-title mb-4">
              The Team Behind <span className="gradient-text">Every Project</span>
            </h2>
            <p className="section-subtitle">
              Experienced professionals who take ownership of every task, from planning to completion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-card rounded-2xl border border-border/40 hover:border-accent/20 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-5 border-2 border-accent/20">
                  <span className="text-xl font-heading font-bold text-accent">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-base font-heading font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-accent font-semibold text-xs tracking-wider uppercase mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-primary">
        <div className="container-padding">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent/80 mb-4">
              Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              What We <span className="gradient-text">Stand By</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The standards we hold ourselves to — on every project, for every client.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-accent/30 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-20 h-20 bg-accent/5 rounded-full blur-2xl" />
                <value.icon className="h-8 w-8 text-accent mb-5" />
                <h3 className="text-base font-heading font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container-padding text-center max-w-2xl mx-auto">
          <h2 className="section-title mb-4">Ready to Work Together?</h2>
          <p className="section-subtitle mb-8">
            Tell us about your project and we&apos;ll respond within one business day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/projects" className="btn-outline">
              View Our Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
