"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerSchema, type CareerInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useInView } from "react-intersection-observer";
import { Briefcase, MapPin, Clock, DollarSign, Upload, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const positions = [
  { value: "Manager", label: "Manager" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "Welder", label: "Welder" },
  { value: "Painter", label: "Painter" },
  { value: "Helper", label: "Helper" },
  { value: "Fabricator", label: "Fabricator" },
  { value: "Machinist", label: "Machinist" },
  { value: "Other", label: "Other" },
];

const jobOpenings = [
  { title: "Experienced Welder", type: "Full-time", location: "Kadambathur", salary: "Negotiable", description: "We are looking for experienced welders proficient in arc welding, MIG, and TIG for industrial fabrication projects." },
  { title: "Site Supervisor", type: "Full-time", location: "Kadambathur", salary: "Negotiable", description: "Experienced site supervisor to manage industrial construction and fabrication projects." },
  { title: "Painter - Industrial", type: "Full-time", location: "Kadambathur", salary: "Negotiable", description: "Skilled industrial painter for protective coatings and finishing work." },
];

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CareerInput>({
    resolver: zodResolver(careerSchema),
  });

  const onSubmit = async (data: CareerInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit application");
      toast.success("Application submitted successfully! We'll be in touch.");
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Join Our <span className="gradient-text">Team</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Build your career with RD Engineering and be part of our growing success story.</motion.p>
        </div>
      </section>

      {/* Current Openings */}
      {!isSubmitted && (
        <section className="py-20">
          <div className="container-padding">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="section-title mb-4">Current <span className="gradient-text">Openings</span></h2>
              <p className="section-subtitle">Explore exciting career opportunities at RD Engineering.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {jobOpenings.map((job, index) => (
                <motion.div key={job.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-secondary/30 hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                  <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
                    <DollarSign className="h-3 w-3" /> {job.salary}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Application Form */}
            <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                <h3 className="text-2xl font-heading font-bold text-primary mb-6 text-center">Apply Now</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Full Name *</label>
                      <Input {...register("name")} placeholder="Your full name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Email *</label>
                      <Input {...register("email")} type="email" placeholder="your@email.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Phone *</label>
                      <Input {...register("phone")} placeholder="+91 9876543210" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Position *</label>
                      <Select {...register("position")} options={positions} placeholder="Select position" />
                      {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Experience *</label>
                      <Input {...register("experience")} placeholder="e.g., 3 years" />
                      {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-1">Qualification *</label>
                      <Input {...register("qualification")} placeholder="e.g., ITI, Diploma, B.E" />
                      {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-1">Cover Letter (Optional)</label>
                    <Textarea {...register("coverLetter")} placeholder="Tell us why you'd be a great fit..." />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"} <Upload className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Success Message */}
      {isSubmitted && (
        <section className="py-20">
          <div className="container-padding">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
              <div className="bg-card rounded-2xl p-12 shadow-xl border border-border">
                <div className="h-20 w-20 rounded-full bg-green-100/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">Application Submitted!</h2>
                <p className="text-muted-foreground mb-8">Thank you for applying. Our team will review your application and contact you if your profile matches our requirements.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn-primary">Submit Another Application</button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
