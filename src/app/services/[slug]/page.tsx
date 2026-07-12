"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Building2, Wrench, Cog, PaintBucket, Pipette, PanelTop, Columns3, DollarSign, Warehouse } from "lucide-react";
import { useInView } from "react-intersection-observer";

const servicesData: Record<string, { icon: any; title: string; description: string; benefits: string[]; applications: string[]; process: string[] }> = {
  "steel-fabrication": {
    icon: Building2, title: "Steel Fabrication",
    description: "RD Engineering specializes in custom steel fabrication for industrial, commercial, and infrastructure projects. From structural beams and columns to complex frameworks and platforms, we deliver precision-engineered steel solutions that meet international quality standards.",
    benefits: ["High strength-to-weight ratio structures", "Custom designs to exact specifications", "Rapid installation and construction", "Cost-effective compared to concrete", "Recyclable and environmentally friendly", "Superior durability and longevity"],
    applications: ["Factory buildings and warehouses", "Industrial sheds and workshops", "Mezzanine floors and platforms", "Structural steel for buildings", "Equipment support structures", "Conveyor system frameworks"],
    process: ["Requirement Analysis & Site Survey", "Detailed Engineering & Design", "Material Procurement & Quality Check", "Fabrication & Welding", "Surface Preparation & Painting", "Transportation & Erection", "Quality Inspection & Handover"],
  },
  "roof-structure-sheet-work": {
    icon: Warehouse, title: "Roof Structure & Sheet Work",
    description: "Complete industrial roofing solutions including PEB structures, metal sheet roofing, insulation, skylights, and waterproofing. Our team ensures leak-proof, durable, and energy-efficient roofing systems.",
    benefits: ["Weather-resistant and durable", "Energy-efficient with proper insulation", "Quick installation", "Low maintenance", "Customizable design options", "Cost-effective solution"],
    applications: ["Industrial factory roofs", "Warehouse roofing", "Commercial building roofs", "Sports complex roofs", "Agricultural shed roofing", "Parking lot canopies"],
    process: ["Structural Assessment", "Design & Material Selection", "Steel Framework Installation", "Insulation & Waterproofing", "Sheet Laying & Fixing", "Finishing & Quality Check"],
  },
  "pipeline-work": {
    icon: DollarSign, title: "Pipeline Work",
    description: "Professional pipeline design, fabrication, and installation for industrial applications. We handle water, gas, chemical, and steam pipeline systems with full pressure testing and certification.",
    benefits: ["Leak-proof joints and connections", "High-pressure handling capability", "Corrosion-resistant materials", "Custom routing and layout", "Complete system integration", "Certified quality assurance"],
    applications: ["Industrial water supply lines", "Gas pipeline systems", "Chemical processing pipelines", "Steam distribution lines", "Cooling water systems", "Fire hydrant systems"],
    process: ["Route Survey & Design", "Material Selection & Procurement", "Pipe Fabrication & Welding", "Installation & Alignment", "Pressure Testing", "Insulation & Coating", "System Commissioning"],
  },
  "air-line-work": {
    icon: Wrench, title: "Air Line Work",
    description: "Compressed air line installation, maintenance, and repair services for industrial facilities. Complete pneumatic system solutions including piping, fittings, and accessories.",
    benefits: ["Efficient compressed air distribution", "Minimal pressure drop design", "Oil-free air options", "Modular and expandable systems", "Energy-efficient operation", "Low maintenance requirements"],
    applications: ["Factory compressed air systems", "Pneumatic tool supply lines", "Automated machinery air supply", "HVAC control air systems", "Process air systems", "Instrument air systems"],
    process: ["Load Analysis & Design", "Compressor Selection", "Pipeline Layout Planning", "Installation & Testing", "Air Quality Verification", "System Optimization"],
  },
  "machining-work": {
    icon: Cog, title: "Machining Work",
    description: "Precision machining services including column drilling, grinding, cutting, and custom machining operations for industrial components. State-of-the-art equipment for accurate results.",
    benefits: ["High precision and accuracy", "Consistent quality output", "Fast turnaround times", "Complex geometries possible", "Wide material compatibility", "Competitive pricing"],
    applications: ["Component manufacturing", "Equipment part fabrication", "Custom tool making", "Repair and reconditioning", "Prototype development", "Production runs"],
    process: ["Requirement Analysis", "Material Selection", "Machine Setup & Programming", "Precision Machining", "Quality Inspection", "Surface Finishing", "Delivery"],
  },
  "puff-panel-partition": {
    icon: PanelTop, title: "Puff Panel Partition",
    description: "PUF (Polyurethane Foam) panel partition walls for clean rooms, cold storage facilities, HVAC enclosures, and industrial space division. Thermal and acoustic insulation properties.",
    benefits: ["Excellent thermal insulation", "Soundproofing properties", "Fire-resistant options", "Quick installation", "Hygienic and easy to clean", "Lightweight yet strong"],
    applications: ["Clean rooms and laboratories", "Cold storage and freezer rooms", "Office partition walls", "HVAC enclosure rooms", "Pharmaceutical facilities", "Food processing units"],
    process: ["Space Assessment & Design", "Panel Selection", "Framework Installation", "Panel Assembly & Fixing", "Joint Sealing", "Finishing & Quality Check"],
  },
  "aluminium-partition": {
    icon: Columns3, title: "Aluminium Partition",
    description: "Modern aluminium partition systems for offices, work areas, and commercial spaces. Custom designs with glass and solid panel options for a professional look.",
    benefits: ["Modern and professional appearance", "Durable and corrosion-resistant", "Customizable designs", "Natural light optimization", "Easy maintenance", "Reusable and adjustable"],
    applications: ["Office cabins and workstations", "Reception areas", "Conference rooms", "Industrial control rooms", "Commercial spaces", "Healthcare facilities"],
    process: ["Layout Design & Planning", "Aluminium Frame Fabrication", "Glass/Panel Preparation", "Frame Installation", "Panel Fixing & Sealing", "Hardware Installation", "Final Finishing"],
  },
  "false-ceiling": {
    icon: Pipette, title: "False Ceiling",
    description: "Professional false ceiling installation using gypsum, PVC, metal, and mineral fiber materials. Aesthetic and functional ceiling solutions for various applications.",
    benefits: ["Aesthetic appeal and design flexibility", "Acoustic improvement", "Thermal insulation", "Concealed wiring and ducts", "Easy maintenance access", "Fire-resistant options"],
    applications: ["Office ceilings", "Commercial spaces", "Industrial clean rooms", "Hospital and clinic ceilings", "Educational institutions", "Retail spaces"],
    process: ["Design & Material Selection", "Grid Framework Installation", "Lighting & Service Integration", "Panel Installation", "Edge Finishing", "Quality Inspection"],
  },
  "painting-works": {
    icon: PaintBucket, title: "Painting Works",
    description: "Industrial painting, protective coatings, epoxy flooring, and surface finishing for factories, structures, and equipment. Using high-quality paints and advanced application techniques.",
    benefits: ["Corrosion protection", "Enhanced appearance", "Long-lasting finish", "Weather resistance", "Chemical resistance options", "Improved safety with markings"],
    applications: ["Factory wall and structure painting", "Steel structure coating", "Epoxy flooring systems", "Equipment and machinery painting", "Safety markings and signage", "Anti-corrosion treatments"],
    process: ["Surface Preparation & Cleaning", "Primer Application", "Putty & Smoothing", "Paint Application (Multiple Coats)", "Finishing & Texture", "Quality Inspection"],
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  if (!service) {
    return (
      <section className="pt-32 pb-20">
        <div className="container-padding text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Service Not Found</h1>
          <p className="mb-8">The service you're looking for doesn't exist.</p>
          <Link href="/services" className="btn-primary">View All Services</Link>
        </div>
      </section>
    );
  }

  const Icon = service.icon;

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary" />
        <div className="container-padding relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-accent mb-6 transition-colors">
              <ArrowRight className="h-4 w-4 rotate-180" /> Back to Services
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white">
                {service.title}
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-3xl">{service.description}</p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="py-20">
        <div className="container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 border border-accent/10 h-full">
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">Benefits</h2>
                <ul className="space-y-4">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 border border-accent/10 h-full">
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">Applications</h2>
                <ul className="space-y-4">
                  {service.applications.map((app) => (
                    <li key={app} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 border border-accent/10 h-full">
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">Our Process</h2>
                <ol className="space-y-4">
                  {service.process.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Need {service.title} Services?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and detailed quote.
          </p>
          <Link href="/quote" className="btn-primary text-base">
            Request a Quote <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
