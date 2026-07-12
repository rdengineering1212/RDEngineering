"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, FileText, Briefcase, Edit3,
  Image, LogOut, Menu, X, ChevronRight, Users, Settings, BarChart3
} from "lucide-react";
import toast from "react-hot-toast";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { label: "Quote Requests", href: "/admin/quotes", icon: FileText },
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Blog", href: "/admin/blog", icon: Edit3 },
  { label: "Projects", href: "/admin/projects", icon: BarChart3 },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Skip layout for login page
  if (pathname === "/admin/login") return <>{children}</>;

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || true) && (
          <motion.aside
            initial={false}
            className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/40 text-white transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-6">
              <Link href="/admin/dashboard" className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">RD</span>
                </div>
                <div>
                  <h2 className="font-heading font-bold text-sm">RD Engineering</h2>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </Link>

              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                        isActive ? "bg-accent text-primary font-semibold" : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/40 bg-card">
              <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
                <ChevronRight className="h-4 w-4" /> View Website
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Top Bar */}
        <header className="bg-card border-b border-border/40 px-6 py-4 flex items-center justify-between lg:justify-end sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-muted/80 text-white rounded-lg transition-colors">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Admin</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

