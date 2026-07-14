import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUpRight, Clock } from "lucide-react";
import { headers } from "next/headers";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  if (pathname.startsWith("/admin")) return null;

  const settings = await getSettings();
  
  // Fetch up to 6 services to show in footer dynamically
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      orderBy: { order: "asc" },
      take: 6
    });
  } catch (error) {
    // Fallback if db is not setup
    services = [
      { title: "Steel Fabrication", slug: "steel-fabrication" },
      { title: "Roof Structure & Sheet Work", slug: "roof-structure-sheet-work" },
      { title: "Pipeline Work", slug: "pipeline-work" },
      { title: "Air Line Work", slug: "air-line-work" },
    ];
  }

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Clients", href: "/clients" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="relative bg-[#0A1628] text-white overflow-hidden border-t border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative container-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-16 lg:py-20">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="RD Engineering Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white">{settings.companyName}</h3>
                <p className="text-xs text-accent tracking-wider uppercase">Industrial Engineering</p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              {settings.footerText || "Specialising in steel fabrication, roof structures, pipeline systems, and industrial construction since 2010."}
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${settings.companyWhatsapp}?text=Hello%20RD%20Engineering`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300 border border-white/10"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-bold text-accent uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-all duration-200 text-sm flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-bold text-accent uppercase tracking-wider">
              Divisions
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-gray-400 hover:text-accent transition-all duration-200 text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-heading font-bold text-accent uppercase tracking-wider">
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:+${settings.companyPhone}`} className="flex items-start gap-2.5 text-gray-400 hover:text-accent transition-colors">
                  <Phone className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm">+{settings.companyPhone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.companyEmail}`} className="flex items-start gap-2.5 text-gray-400 hover:text-accent transition-colors">
                  <Mail className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm break-all">{settings.companyEmail}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{settings.companyAddress}</span>
              </li>
              <li className="flex items-start gap-2.5 text-gray-400">
                <Clock className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Mon - Sat: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="border-t border-white/5 py-6">
          <div className="w-full h-44 rounded-xl overflow-hidden border border-white/5 relative">
            <iframe
              src={settings.googleMapsLink}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
              className="opacity-75 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
