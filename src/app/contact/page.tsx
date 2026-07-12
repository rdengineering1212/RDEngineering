"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
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

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 8883389766",
    href: "tel:+918883389766",
    description: "Mon–Sat, 8am–6pm",
  },
  {
    icon: Mail,
    label: "Email",
    value: "rdengineering1212@gmail.com",
    href: "mailto:rdengineering1212@gmail.com",
    description: "We respond within 24 hours",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "4/372 Nehru St, Kadambathur, TN",
    description: "Dr Ambedkar Nagar, Tamil Nadu 631209",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat: 8:00 AM – 6:00 PM",
    description: "Sunday: Closed",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 409) {
        toast.error(json.message || "This message was already sent. Please wait a few minutes.");
        return;
      }
      if (res.status === 429) {
        toast.error(json.message || "Too many submissions. Please try again later.");
        return;
      }
      if (!res.ok) {
        toast.error(json.message || "Failed to send message. Please call us at +91 8883389766.");
        return;
      }

      toast.success("Message sent! We'll get back to you within 24 hours.");
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
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Get In Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >
            Contact <span className="gradient-text">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Get in touch with RD Engineering for all your industrial engineering needs. We respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-muted/40">
        <div className="container-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl p-5 border border-border/40 hover:border-accent/20 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-primary hover:text-accent transition-colors block truncate">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-primary">{item.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column — Map + Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary mb-2">Our Location</h2>
                <p className="text-muted-foreground text-sm">
                  Visit us at our office and workshop in Kadambathur, Tamil Nadu.
                </p>
              </div>

              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-lg" style={{ height: "320px" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.6035!2d79.8220!3d13.0025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5293b8d5555555%3A0xaabbccdd11223344!2sKadambathur%2C%20Tamil%20Nadu%20631203!5e0!3m2!1sen!2sin!4v1720700000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RD Engineering Location — Kadambathur, Tamil Nadu"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+918883389766"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href="https://wa.me/918883389766"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary text-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="https://maps.google.com/?q=Kadambathur,Tamil+Nadu+631203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-muted text-primary px-5 py-2.5 text-sm font-semibold hover:bg-muted/80 transition-all duration-300"
                >
                  <MapPin className="h-4 w-4 text-accent" /> Get Directions
                </a>
              </div>
            </motion.div>

            {/* Right Column — Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {!isSubmitted ? (
                <div className="bg-card rounded-2xl border border-border/40 p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">Send Us a Message</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input {...register("name")} placeholder="Your name" />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input {...register("email")} type="email" placeholder="your@email.com" />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Phone Number</label>
                        <Input {...register("phone")} placeholder="+91 9876543210" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Service Interested In</label>
                        <Select
                          {...register("service")}
                          options={services}
                          placeholder="Select a service"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">Company Name</label>
                      <Input {...register("company")} placeholder="Your company (optional)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        {...register("message")}
                        placeholder="Tell us about your project or inquiry..."
                        className="min-h-[130px]"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-6 py-3.5 font-button text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-accent hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-border/40 p-12 shadow-xl text-center">
                  <div className="h-20 w-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Thank you for contacting us. We&apos;ll review your message and get back to you within 24 hours.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="tel:+918883389766" className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-all">
                      <Phone className="h-4 w-4" /> Call Us Now
                    </a>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-primary text-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                    >
                      Send Another
                    </button>
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
