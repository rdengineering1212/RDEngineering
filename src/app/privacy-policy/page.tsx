"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Privacy <span className="gradient-text">Policy</span></motion.h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-padding max-w-3xl mx-auto">
          <div className="prose prose-gray max-w-none space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary">1. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information you provide directly to us, including your name, email address, phone number, company name, and project details when you fill out our contact form, quote request form, or career application form.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to respond to your inquiries, provide quotes for our services, process job applications, improve our website and services, and communicate with you about your projects.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">3. Information Sharing</h2>
            <p className="text-muted-foreground">We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">4. Data Security</h2>
            <p className="text-muted-foreground">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">5. Cookies</h2>
            <p className="text-muted-foreground">Our website may use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, though this may affect some features of our website.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to access, update, or delete your personal information. You may contact us at any time to exercise these rights or to withdraw consent for our use of your information.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">7. Contact Us</h2>
            <p className="text-muted-foreground">If you have any questions about this Privacy Policy, please contact us at rdengineering1212@gmail.com or call +91 8883389766.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">8. Updates</h2>
            <p className="text-muted-foreground">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>

            <p className="text-sm text-muted-foreground mt-12">Last updated: January 2025</p>
          </div>
        </div>
      </section>
    </>
  );
}
