"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, ChevronDown, Wrench, Shield, Zap, Grid, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// Fallback services in case DB is loading or empty
const fallbackServices = [
  { title: "Steel Fabrication", slug: "steel-fabrication", description: "Custom steel structures and industrial frameworks." },
  { title: "Roof Structure & Sheet Work", slug: "roof-structure-sheet-work", description: "Complete metal roofing and PEB solutions." },
  { title: "Pipeline Work", slug: "pipeline-work", description: "Process piping, water lines, and drainage." },
  { title: "Air Line Work", slug: "air-line-work", description: "Compressed air distribution GI networks." },
  { title: "Machining Work", slug: "machining-work", description: "CNC & manual precision parts machining." },
  { title: "Puff Panel Partition", slug: "puff-panel-partition", description: "Clean room insulation partitioning systems." },
];

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    companyName: "RD Engineering",
    companyPhone: "8883389766",
    companyEmail: "rdengineering1212@gmail.com",
    companyWhatsapp: "918883389766",
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Fetch site configurations and services
    Promise.all([
      fetch("/api/settings").then((res) => res.json()).catch(() => null),
      fetch("/api/services").then((res) => res.json()).catch(() => null),
    ]).then(([settingsData, servicesData]) => {
      if (settingsData) setSettings(settingsData);
      if (Array.isArray(servicesData) && servicesData.length > 0) {
        setServices(servicesData);
      } else {
        setServices(fallbackServices);
      }
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  const hasDarkHero = [
    "/", "/about", "/services", "/projects", "/contact", "/quote",
    "/clients", "/faq", "/machinery", "/blog", "/team", "/careers",
  ].some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));

  const isTransparent = mounted && hasDarkHero && !scrolled;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isTransparent
            ? "bg-transparent backdrop-blur-[2px]"
            : "bg-[#0A1628]/95 backdrop-blur-md border-b border-white/5 shadow-lg"
        )}
      >
        {/* Top Info Bar */}
        <div
          className={cn(
            "hidden lg:block transition-all duration-300 overflow-hidden border-b",
            scrolled ? "h-0 opacity-0 py-0" : "h-auto opacity-100 py-2.5",
            isTransparent ? "border-white/10" : "border-white/5"
          )}
        >
          <div className="container-padding flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs font-medium text-gray-300">
              <a href={`tel:+${settings.companyPhone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="h-3.5 w-3.5 text-accent" />
                +{settings.companyPhone}
              </a>
              <a href={`mailto:${settings.companyEmail}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="h-3.5 w-3.5 text-accent" />
                {settings.companyEmail}
              </a>
            </div>
            <Link href="/quote" className="text-xs font-semibold text-accent hover:text-white transition-colors">
              Request an Industrial Quote →
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="container-padding relative">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="RD Engineering Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-base font-heading font-black text-white leading-tight tracking-tight uppercase">
                  {settings.companyName}
                </p>
                <p className="text-[9px] tracking-widest uppercase text-gray-400 font-medium">
                  INDUSTRIAL ENGINEERING
                </p>
              </div>
            </Link>

            {/* Desktop Menu links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  isActive("/") ? "text-accent bg-white/5" : "text-gray-200 hover:text-accent hover:bg-white/5"
                )}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  isActive("/about") ? "text-accent bg-white/5" : "text-gray-200 hover:text-accent hover:bg-white/5"
                )}
              >
                About
              </Link>

              {/* Mega Dropdown menu for Services */}
              <div
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link
                  href="/services"
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                    isActive("/services") || megaMenuOpen ? "text-accent bg-white/5" : "text-gray-200 hover:text-accent hover:bg-white/5"
                  )}
                >
                  Services
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", megaMenuOpen && "rotate-180")} />
                </Link>

                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-4 lg:right-6 xl:left-1/2 xl:-translate-x-1/2 top-full mt-2 w-[720px] max-w-[90vw] bg-[#0A1628] border border-white/5 rounded-2xl shadow-2xl p-6 z-50 grid grid-cols-2 gap-4"
                    >
                      <div className="col-span-2 border-b border-white/5 pb-3 mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Engineering Divisions</span>
                        <Link href="/services" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-medium">
                          All Services <LayoutGrid className="h-3 w-3" />
                        </Link>
                      </div>

                      {services.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/services/${item.slug}`}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0 group-hover:scale-105 transition-transform">
                            <Wrench className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{item.title}</h4>
                            <p className="text-xs text-gray-400 mt-1 leading-snug line-clamp-1">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/projects"
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  isActive("/projects") ? "text-accent bg-white/5" : "text-gray-200 hover:text-accent hover:bg-white/5"
                )}
              >
                Projects
              </Link>
              <Link
                href="/clients"
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  isActive("/clients") ? "text-accent bg-white/5" : "text-gray-200 hover:text-accent hover:bg-white/5"
                )}
              >
                Clients
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  isActive("/contact") ? "text-accent bg-white/5" : "text-gray-200 hover:text-accent hover:bg-white/5"
                )}
              >
                Contact
              </Link>

              <Link
                href="/quote"
                className="ml-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent text-primary px-5 py-2.5 font-button text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md"
              >
                Get a Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle Navigation menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-[#0A1628] shadow-2xl overflow-hidden"
            >
              <div className="container-padding py-4 space-y-1">
                {[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Projects", href: "/projects" },
                  { label: "Clients", href: "/clients" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                      isActive(link.href) ? "text-accent bg-white/5" : "text-gray-300 hover:text-accent hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 space-y-3 border-t border-white/5">
                  <Link
                    href="/quote"
                    onClick={() => setIsOpen(false)}
                    className="block text-center rounded-lg bg-accent text-primary px-5 py-3 font-button text-sm font-semibold shadow-md"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
