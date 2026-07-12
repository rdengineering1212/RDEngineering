"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="container-padding relative text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
          >Terms of <span className="gradient-text">Service</span></motion.h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-padding max-w-3xl mx-auto">
          <div className="prose prose-gray max-w-none space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">By accessing and using the RD Engineering website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our website or services.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">2. Services</h2>
            <p className="text-muted-foreground">RD Engineering provides industrial engineering services including steel fabrication, roof structure work, pipeline work, air line work, machining work, partition work, false ceiling, and painting works. All services are provided subject to individual agreements and quotations.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">3. Quotations and Pricing</h2>
            <p className="text-muted-foreground">All quotations provided by RD Engineering are valid for a specified period as stated in the quotation. Prices are subject to change based on material costs, scope changes, or market conditions. Written acceptance of a quotation constitutes a binding agreement.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">4. Project Execution</h2>
            <p className="text-muted-foreground">RD Engineering commits to executing projects with professional care and skill. Project timelines are estimates and may be affected by factors beyond our control. We will communicate any significant delays promptly.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">5. Intellectual Property</h2>
            <p className="text-muted-foreground">All content on this website, including text, images, logos, and designs, is the property of RD Engineering unless otherwise stated. Reproduction or use without permission is prohibited.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">RD Engineering shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or website. Our total liability shall not exceed the amount paid for the specific service giving rise to the claim.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">7. Warranty</h2>
            <p className="text-muted-foreground">RD Engineering provides warranty on workmanship and materials as specified in individual project agreements. Warranty claims must be made in writing within the warranty period.</p>

            <h2 className="text-2xl font-heading font-bold text-primary">8. Governing Law</h2>
            <p className="text-muted-foreground">These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts in Tamil Nadu.</p>

            <p className="text-sm text-muted-foreground mt-12">Last updated: January 2025</p>
          </div>
        </div>
      </section>
    </>
  );
}
