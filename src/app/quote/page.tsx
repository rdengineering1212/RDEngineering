"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Send, CheckCircle2, ArrowRight, Phone, Mail } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const services = [
  { value: "Steel Fabrication", label: "Steel Fabrication" },
  { value: "Roof Structure & Sheet Work", label: "Roof Structure & Sheet Work" },
  { value: "Pipeline Work", label: "Pipeline Work" },
  { value: "Air Line Work", label: "Air Line Work" },
  { value: "Machining Work", label: "Machining Work" },
  { value: "Puff Panel Partition", label: "Puff Panel Partition" },
  { value: "Aluminium Partition", label: "Aluminium Partition" },
  { value: "False Ceiling", label: "False Ceiling" },
  { value: "Painting Works", label: "Painting Works" },
  { value: "Other", label: "Other" },
];

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 409) {
        toast.error(json.message || "We already received this quote request. Please wait a few minutes.");
        return;
      }
      if (res.status === 429) {
        toast.error(json.message || "Too many requests. Please try again later.");
        return;
      }
      if (!res.ok) {
        toast.error(json.message || "Failed to submit. Please call us at +91 8883389766.");
        return;
      }

      toast.success("Quote request submitted! We'll respond within 48 hours.");
      setIsSubmitted(true);
      reset();
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Request a <span className="gradient-text">Quote</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >Get a detailed quotation for your industrial engineering project within 48 hours.</motion.p>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-background text-primary">
        <div className="container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Info Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-card rounded-2xl p-8 border border-border/40 hover:border-accent/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <h3 className="text-xl font-heading font-bold text-primary mb-4 z-10 relative">Why Request a Quote?</h3>
                <ul className="space-y-4 z-10 relative">
                  {[
                    "Free detailed quotation within 48 hours",
                    "No obligation or hidden charges",
                    "Customized solutions for your needs",
                    "Competitive pricing with quality guarantee",
                    "Expert consultation included",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-8 border border-border/40 hover:border-accent/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <h3 className="text-xl font-heading font-bold text-primary mb-4 z-10 relative">Need Quick Help?</h3>
                <p className="text-muted-foreground text-sm mb-6 z-10 relative">Call or WhatsApp us for immediate assistance.</p>
                <div className="space-y-3 z-10 relative">
                  <a href="tel:+918883389766" className="flex items-center gap-3 text-primary/95 hover:text-accent transition-colors">
                    <Phone className="h-5 w-5 text-accent" /> +91 8883389766
                  </a>
                  <a href="mailto:rdengineering1212@gmail.com" className="flex items-center gap-3 text-primary/95 hover:text-accent transition-colors">
                    <Mail className="h-5 w-5 text-accent" /> rdengineering1212@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {!isSubmitted ? (
                <div className="bg-card rounded-2xl border border-border/40 p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                  <h3 className="text-2xl font-heading font-bold text-primary mb-6">Project Details</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Name *</label>
                        <Input {...register("name")} placeholder="Your full name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Email *</label>
                        <Input {...register("email")} type="email" placeholder="your@email.com" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Phone *</label>
                        <Input {...register("phone")} placeholder="+91 9876543210" />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Service *</label>
                        <Select {...register("service")} options={services} placeholder="Select service" />
                        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Company</label>
                        <Input {...register("company")} placeholder="Company name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Budget Range</label>
                        <Select {...register("budget")} options={[
                          { value: "Less than ₹50,000", label: "Less than ₹50,000" },
                          { value: "₹50,000 - ₹2,00,000", label: "₹50,000 - ₹2,00,000" },
                          { value: "₹2,00,000 - ₹10,00,000", label: "₹2,00,000 - ₹10,00,000" },
                          { value: "₹10,00,000 - ₹50,00,000", label: "₹10,00,000 - ₹50,00,000" },
                          { value: "More than ₹50,00,000", label: "More than ₹50,00,000" },
                          { value: "Not sure", label: "Not sure" },
                        ]} placeholder="Select budget range" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary/80 mb-1">Timeline</label>
                        <Select {...register("timeline")} options={[
                          { value: "ASAP", label: "ASAP" },
                          { value: "Within 1 month", label: "Within 1 month" },
                          { value: "1-3 months", label: "1-3 months" },
                          { value: "3-6 months", label: "3-6 months" },
                          { value: "Not sure", label: "Not sure" },
                        ]} placeholder="Select timeline" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary/80 mb-1">Project Description *</label>
                      <Textarea {...register("description")} placeholder="Describe your project in detail..." />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <Button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Quote Request"} <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-border/40 p-12 shadow-xl text-center">
                  <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-4">Quote Request Submitted!</h3>
                  <p className="text-muted-foreground mb-8">Thank you! Our team will review your requirements and provide a detailed quotation within 48 hours.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/" className="btn-dark">Back to Home</Link>
                    <button onClick={() => setIsSubmitted(false)} className="btn-outline border-primary text-primary hover:bg-primary hover:text-white">Submit Another</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
