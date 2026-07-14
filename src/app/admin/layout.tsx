"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import {
  LayoutDashboard, MessageSquare, FileText, Briefcase, Edit3,
  LogOut, Menu, X, ChevronRight, Users, Settings, BarChart3,
  Layers, Star, Globe
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const NAV_GROUPS = [
  {
    label: "Analytics",
    links: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Leads",
    links: [
      { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
      { label: "Quote Requests", href: "/admin/quotes", icon: FileText },
    ],
  },
  {
    label: "Content",
    links: [
      { label: "Projects", href: "/admin/projects", icon: BarChart3 },
      { label: "Services", href: "/admin/services", icon: Layers },
      { label: "Clients", href: "/admin/clients", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
    ],
  },
  {
    label: "HR & Marketing",
    links: [
      { label: "Blog", href: "/admin/blog", icon: Edit3 },
      { label: "Careers", href: "/admin/careers", icon: Briefcase },
    ],
  },
  {
    label: "System",
    links: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Skip layout for login page
  if (pathname === "/admin/login") return <>{children}</>;

  if (!mounted) return <div className="min-h-screen" style={{ background: "#080F1C" }} />;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Supabase signout API failed, clearing local session anyway.", error);
    } finally {
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast.success("Logged out successfully");
      router.push("/admin/login");
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="dark min-h-screen flex font-body" style={{ background: "var(--admin-bg, #080F1C)", color: "#F0F4FF" }}>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col
          border-r transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: "#0A1628",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative h-10 w-10 shrink-0">
            <NextImage src="/logo.png" alt="RD Logo" fill className="object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "#F0F4FF" }}>RD Engineering</p>
            <p className="text-[10px] font-medium" style={{ color: "#7A8EAD" }}>Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1 rounded transition-colors"
            style={{ color: "#7A8EAD" }}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 admin-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest uppercase" style={{ color: "#4A5D7A" }}>
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                      style={active ? {
                        background: "rgba(212,175,55,0.12)",
                        color: "#D4AF37",
                        borderLeft: "2px solid #D4AF37",
                        paddingLeft: "10px",
                      } : {
                        color: "#7A8EAD",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLElement).style.color = "#B8C5DC";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = "";
                          (e.currentTarget as HTMLElement).style.color = "#7A8EAD";
                        }
                      }}
                    >
                      <link.icon className="h-4 w-4 shrink-0" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 space-y-1 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: "#7A8EAD" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.color = "#B8C5DC";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "#7A8EAD";
            }}
          >
            <Globe className="h-4 w-4 shrink-0" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left"
            style={{ color: "#7A8EAD" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
              (e.currentTarget as HTMLElement).style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "#7A8EAD";
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b"
          style={{
            background: "#0A1628",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#7A8EAD" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb / page name */}
          <p className="hidden lg:block text-sm font-semibold" style={{ color: "#B8C5DC" }}>
            {NAV_GROUPS.flatMap(g => g.links).find(l => l.href === pathname)?.label || "Admin"}
          </p>

          {/* User badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: "#7A8EAD" }}>rdengineering1212@gmail.com</span>
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto" style={{ background: "#080F1C" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
