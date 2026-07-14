"use client";

import { useState, useEffect } from "react";
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

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>({
    companyPhone: "8883389766",
    companyEmail: "rdengineering1212@gmail.com",
    companyAddress: "No.4/372, Nehru Street, Ambedkar Nagar, Kadambathur, Tiruvallur, Tamil Nadu 631209",
    googleMapsLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5451631527715!2d79.82772591482229!3d13.128522690753066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5291deb1eb4cff%3A0xb76184061c882d4c!2sRD+ENGINEERING!5e0!3m2!1sen!2sin!4v1783763063456",
    companyWhatsapp: "918883389766",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

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
        const phoneNo = settings.companyPhone.startsWith('+') ? settings.companyPhone : `+${settings.companyPhone}`;
        toast.error(json.message || `Failed to send message. Please call us at ${phoneNo}.`);
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

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: settings.companyPhone.startsWith('+') ? settings.companyPhone : `+${settings.companyPhone}`,
      href: settings.companyPhone.startsWith('+') ? `tel:${settings.companyPhone}` : `tel:+${settings.companyPhone}`,
      description: "Mon–Sat, 8am–6pm",
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.companyEmail,
      href: `mailto:${settings.companyEmail}`,
      description: "We respond within 24 hours",
    },
    {
      icon: MapPin,
      label: "Address",
      value: settings.companyAddress,
      description: "Office and Work site",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon – Sat: 8:00 AM – 6:00 PM",
      description: "Sunday: Closed",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0A1628] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/95 to-[#0A1628]" />
        <div className="container-padding relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-accent text-sm font-semibold mb-6"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="uppercase tracking-widest text-xs">Get In Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-4"
          >
            Contact <span className="gradient-text">Our Team</span>
          </motion.h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Get in touch with us for all structural steel engineering, fabrication, and industrial installations.
          </p>
        </div>
      </section>
 
      {/* Contact Cards */}
      <section className="py-12 bg-[#080F1C] border-b border-white/5">
        <div className="container-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[#0F1E36] rounded-xl p-5 border border-white/5 hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 text-accent">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-bold text-white hover:text-accent transition-colors block truncate">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-bold text-white leading-tight">{item.value}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Main Content */}
      <section className="py-20 bg-[#080F1C]">
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
                <h2 className="text-2xl font-heading font-black text-white mb-2">Office & Workshop Location</h2>
                <p className="text-gray-400 text-sm">
                  Visit us at our main structural steel workspace in Kadambathur, Tamil Nadu.
                </p>
              </div>
 
              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden border border-white/5 shadow-xl h-80">
                <iframe
                  src={settings.googleMapsLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RD Engineering Location Map"
                />
              </div>
 
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={settings.companyPhone.startsWith('+') ? `tel:${settings.companyPhone}` : `tel:+${settings.companyPhone}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent text-primary px-5 py-2.5 text-sm font-semibold hover:bg-white hover:-translate-y-0.5 shadow-sm transition-all"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href={`https://wa.me/${settings.companyWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 text-white bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                >
                  WhatsApp
                </a>
                <a
                  href="https://maps.app.goo.gl/6CSfGda3Y32MKsva7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 text-white bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                >
                  Open in Maps
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
                <div className="bg-[#0F1E36] rounded-2xl border border-white/5 p-8 shadow-xl relative overflow-hidden">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">Send Us a Message</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Fill out the form below and we will get back to you within 24 hours.
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input {...register("name")} placeholder="Your name" />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input {...register("email")} type="email" placeholder="your@email.com" />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                        <Input {...register("phone")} placeholder="+91 9876543210" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Service Interested In</label>
                        <Select
                          {...register("service")}
                          options={services}
                          placeholder="Select a service"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Name</label>
                      <Input {...register("company")} placeholder="Your company (optional)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-primary px-6 py-3.5 font-button text-sm font-bold shadow-md hover:bg-white hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-[#0F1E36] rounded-2xl border border-white/5 p-12 shadow-xl text-center">
                  <div className="h-20 w-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                    Thank you for contacting us. We will review your message and get back to you within 24 hours.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href={`tel:+${settings.companyPhone}`} className="inline-flex items-center gap-2 rounded-lg bg-accent text-primary px-5 py-2.5 text-sm font-semibold hover:bg-white transition-all">
                      <Phone className="h-4 w-4" /> Call Us Now
                    </a>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 text-white px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition-all"
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
