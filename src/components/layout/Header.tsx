"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Steel Fabrication", href: "/services/steel-fabrication" },
      { label: "Roof Structure & Sheet Work", href: "/services/roof-structure-sheet-work" },
      { label: "Pipeline Work", href: "/services/pipeline-work" },
      { label: "Air Line Work", href: "/services/air-line-work" },
      { label: "Machining Work", href: "/services/machining-work" },
      { label: "Puff Panel Partition", href: "/services/puff-panel-partition" },
      { label: "Aluminium Partition", href: "/services/aluminium-partition" },
      { label: "False Ceiling", href: "/services/false-ceiling" },
      { label: "Painting Works", href: "/services/painting-works" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Clients", href: "/clients" },
  { label: "Contact", href: "/contact" },
];

const darkHeroPages = [
  "/", "/about", "/services", "/projects", "/contact", "/quote",
  "/clients", "/faq", "/machinery", "/blog", "/team", "/careers",
];

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Determine if we're on a page that uses a dark hero banner and haven't scrolled down yet
  const hasDarkHero = darkHeroPages.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p)
  );
  
  // Safe transparent state: only allow transparency once mounted to avoid SSR mismatch
  const isTransparent = mounted && hasDarkHero && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isTransparent
            ? "bg-transparent backdrop-blur-[2px]"
            : "bg-white backdrop-blur-md border-b border-border/30 shadow-md"
        )}
        style={
          isTransparent
            ? {
                background:
                  "linear-gradient(to bottom, rgba(8,15,28,0.7) 0%, rgba(8,15,28,0.15) 70%, transparent 100%)",
              }
            : undefined
        }
      >
        {/* Top contact bar — only visible when not scrolled */}
        <div
          className={cn(
            "hidden lg:block transition-all duration-300 overflow-hidden",
            scrolled ? "h-0 opacity-0" : "h-auto opacity-100",
            isTransparent ? "border-b border-white/10" : "border-b border-border/30 bg-muted/80"
          )}
        >
          <div className="container-padding flex items-center justify-between py-2">
            <div className="flex items-center gap-6 text-sm">
              <a
                href="tel:+918883389766"
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  isTransparent ? "text-white/80 hover:text-accent" : "text-muted-foreground hover:text-accent"
                )}
              >
                <Phone className="h-3.5 w-3.5 text-accent" />
                +91 8883389766
              </a>
              <a
                href="mailto:rdengineering1212@gmail.com"
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  isTransparent ? "text-white/80 hover:text-accent" : "text-muted-foreground hover:text-accent"
                )}
              >
                <Mail className="h-3.5 w-3.5 text-accent" />
                rdengineering1212@gmail.com
              </a>
            </div>
            <Link
              href="/quote"
              className={cn(
                "text-sm font-semibold transition-colors",
                isTransparent ? "text-accent hover:text-white" : "text-primary hover:text-accent"
              )}
            >
              Request a Quote →
            </Link>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="container-padding">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="RD Engineering Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className={cn(
                  "text-sm sm:text-base font-heading font-bold leading-tight transition-colors duration-300 whitespace-nowrap",
                  isTransparent ? "text-white" : "text-primary"
                )}>
                  RD Engineering
                </p>
                <p className={cn(
                  "text-[8px] sm:text-[10px] tracking-wider uppercase transition-colors duration-300 whitespace-nowrap",
                  isTransparent ? "text-white/50" : "text-muted-foreground",
                  scrolled && "hidden"
                )}>
                  Industrial Engineering
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                      isActive(link.href)
                        ? isTransparent
                          ? "text-accent bg-white/10"
                          : "text-accent bg-accent/10"
                        : isTransparent
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-[#0F172A] hover:text-accent hover:bg-muted/80",
                      activeDropdown === link.label && (isTransparent ? "text-white" : "text-accent")
                    )}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          activeDropdown === link.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-card shadow-2xl border border-border/30 overflow-hidden z-50"
                        >
                          <div className="p-2">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2.5 text-sm font-medium text-primary/80 hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-150"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}

              <Link
                href="/quote"
                className="ml-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent text-primary px-5 py-2.5 font-button text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md"
              >
                Get a Quote
              </Link>
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-primary hover:bg-muted"
                )}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "lg:hidden border-t border-border/30 overflow-hidden shadow-xl",
                isTransparent ? "bg-[#0B1323]/98 backdrop-blur-md" : "bg-white"
              )}
            >
              <div className="container-padding py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
                        isActive(link.href)
                          ? "text-accent bg-accent/10"
                          : isTransparent
                          ? "text-white hover:text-accent hover:bg-white/5"
                          : "text-primary hover:text-accent hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 space-y-0.5 pb-2 border-l-2 border-border/30 ml-6 pl-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-lg transition-all duration-150",
                              isTransparent ? "text-gray-400 hover:text-accent" : "text-muted-foreground hover:text-accent"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 space-y-3 border-t border-border/30">
                  <Link
                    href="/quote"
                    onClick={() => setIsOpen(false)}
                    className="block text-center rounded-lg bg-accent text-primary px-5 py-3 font-button text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-white"
                  >
                    Request a Quote
                  </Link>
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <a href="tel:+918883389766" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 text-accent" /> Call Us
                    </a>
                    <a href="mailto:rdengineering1212@gmail.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Mail className="h-4 w-4 text-accent" /> Email
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
