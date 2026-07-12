import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUpRight, Clock } from "lucide-react";

const services = [
  { label: "Steel Fabrication", href: "/services/steel-fabrication" },
  { label: "Roof Structure & Sheet Work", href: "/services/roof-structure-sheet-work" },
  { label: "Pipeline Work", href: "/services/pipeline-work" },
  { label: "Air Line Work", href: "/services/air-line-work" },
  { label: "Machining Work", href: "/services/machining-work" },
  { label: "Puff Panel Partition", href: "/services/puff-panel-partition" },
  { label: "Aluminium Partition", href: "/services/aluminium-partition" },
  { label: "False Ceiling", href: "/services/false-ceiling" },
  { label: "Painting Works", href: "/services/painting-works" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Clients", href: "/clients" },
  { label: "Machinery", href: "/machinery" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

const companyInfo = [
  { icon: Phone, label: "Phone", value: "+91 8883389766", href: "tel:+918883389766" },
  { icon: Mail, label: "Email", value: "rdengineering1212@gmail.com", href: "mailto:rdengineering1212@gmail.com" },
  { icon: MapPin, label: "Address", value: "4/372 Nehru St, Dr Ambedkar Nagar, Kadambathur, Tamil Nadu" },
  { icon: Clock, label: "Working Hours", value: "Mon - Sat: 8:00 AM - 6:00 PM" },
];

export default function Footer() {
  return (
    <footer className="relative bg-primary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative container-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-16 lg:py-20">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0">
                <Image
                  src="/logo.png"
                  alt="RD Engineering Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold">RD Engineering</h3>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Industrial Engineering</p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Specialising in steel fabrication, roof structures, pipeline systems,
              and industrial construction — with a commitment to quality workmanship
              and on-time delivery since 2010.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/918883389766?text=Hello%20RD%20Engineering"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold text-accent mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent transition-all duration-300 group"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-bold text-accent mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-accent transition-all duration-300 group"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm">
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-bold text-accent mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4">
              {companyInfo.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-start gap-3 text-gray-400 hover:text-accent transition-colors group"
                    >
                      <item.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{item.value}</span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-gray-400">
                      <item.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{item.value}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Google Map Location */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-bold text-accent mb-6">
              Our Location
            </h4>
            <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.6035!2d79.8220!3d13.0025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5293b8d5555555%3A0xaabbccdd11223344!2sKadambathur%2C%20Tamil%20Nadu%20631203!5e0!3m2!1sen!2sin!4v1720700000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RD Engineering Office Location"
                className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} RD Engineering. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="text-gray-500 hover:text-accent transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
