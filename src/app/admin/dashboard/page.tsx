"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FolderKanban,
  Wrench,
  Image as ImageIcon,
  Users,
  Star,
  MessageSquare,
  ArrowUpRight,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "contact" | "project" | "quote";
  time: string;
}

interface Stats {
  projects: number;
  services: number;
  gallery: number;
  clients: number;
  testimonials: number;
  contacts: number;
  recentActivities: Activity[];
}

const STAT_CARDS = [
  {
    key: "projects" as keyof Stats,
    label: "Total Projects",
    icon: FolderKanban,
    href: "/admin/projects",
    iconBg: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
    glowColor: "rgba(59,130,246,0.18)",
  },
  {
    key: "services" as keyof Stats,
    label: "Total Services",
    icon: Wrench,
    href: "/admin/services",
    iconBg: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    glowColor: "rgba(245,158,11,0.18)",
  },

  {
    key: "clients" as keyof Stats,
    label: "Total Clients",
    icon: Users,
    href: "/admin/clients",
    iconBg: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
    glowColor: "rgba(34,197,94,0.18)",
  },
  {
    key: "testimonials" as keyof Stats,
    label: "Testimonials",
    icon: Star,
    href: "/admin/testimonials",
    iconBg: "linear-gradient(135deg, #F43F5E 0%, #EF4444 100%)",
    glowColor: "rgba(244,63,94,0.18)",
  },
  {
    key: "contacts" as keyof Stats,
    label: "Contact Messages",
    icon: MessageSquare,
    href: "/admin/contacts",
    iconBg: "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)",
    glowColor: "rgba(14,165,233,0.18)",
  },
];

const QUICK_LINKS = [
  { label: "New Project", href: "/admin/projects?new=true", icon: FolderKanban },
  { label: "Quote Requests", href: "/admin/quotes", icon: FileText },
  { label: "Job Applications", href: "/admin/careers", icon: Briefcase },
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "View Website", href: "/", icon: ChevronRight },
];

const ACTIVITY_ICONS: Record<Activity["type"], { icon: typeof MessageSquare; bg: string; color: string }> = {
  contact: { icon: MessageSquare, bg: "rgba(14,165,233,0.12)", color: "var(--admin-blue)" },
  project: { icon: FolderKanban, bg: "rgba(99,102,241,0.12)", color: "#818CF8" },
  quote: { icon: FileText, bg: "rgba(245,158,11,0.12)", color: "var(--admin-yellow)" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────── */}
      <div>
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">
          Real-time metrics and quick management of the RD Engineering platform.
        </p>
      </div>

      {/* ── Stat Cards Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="dark-shimmer rounded-2xl"
                style={{ height: "9rem", border: "1px solid var(--admin-border)" }}
              />
            ))
          : STAT_CARDS.map((card, index) => {
              const Icon = card.icon;
              const value = stats ? (stats[card.key] as number) : 0;
              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                >
                  <Link href={card.href} className="block admin-stat-card group">
                    {/* Ambient glow blob */}
                    <div
                      className="absolute -right-10 -top-10 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
                      style={{ background: card.glowColor, opacity: 0.6 }}
                    />
                    <div className="relative flex items-center justify-between mb-5">
                      {/* Icon box */}
                      <div
                        className="h-11 w-11 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                        style={{ background: card.iconBg }}
                      >
                        <Icon className="h-5 w-5" style={{ color: "#fff" }} />
                      </div>
                      {/* Manage arrow */}
                      <span
                        className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                        style={{ color: "var(--admin-text-4)" }}
                      >
                        Manage
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div
                      className="text-4xl font-black tracking-tight font-heading relative"
                      style={{ color: "var(--admin-text-1)" }}
                    >
                      {value}
                    </div>
                    <div
                      className="text-sm font-medium mt-1 relative"
                      style={{ color: "var(--admin-text-3)" }}
                    >
                      {card.label}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
      </div>

      {/* ── Bottom Row: Activities + Shortcuts ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Recent Activities ─────────────────────── */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
            }}
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--admin-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.12)" }}
                >
                  <Clock className="h-4 w-4" style={{ color: "var(--admin-accent)" }} />
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ color: "var(--admin-text-1)" }}>
                    Recent Activities
                  </h2>
                  <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                    Latest actions and form submissions
                  </p>
                </div>
              </div>
            </div>

            {/* Activity list */}
            <div className="p-4 space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="dark-shimmer rounded-xl"
                    style={{ height: "4.5rem", border: "1px solid var(--admin-border)" }}
                  />
                ))
              ) : stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((act, i) => {
                  const meta = ACTIVITY_ICONS[act.type] ?? ACTIVITY_ICONS.contact;
                  const ActivityIcon = meta.icon;
                  return (
                    <motion.div
                      key={`${act.id}-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.3 }}
                      className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--admin-border)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--admin-border-med)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.02)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--admin-border)";
                      }}
                    >
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: meta.bg }}
                      >
                        <ActivityIcon className="h-4 w-4" style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--admin-text-1)" }}
                        >
                          {act.title}
                        </p>
                        <p
                          className="text-xs mt-0.5 truncate"
                          style={{ color: "var(--admin-text-3)" }}
                        >
                          {act.description}
                        </p>
                        <span
                          className="text-[10px] mt-1.5 block font-mono"
                          style={{ color: "var(--admin-text-4)" }}
                        >
                          {new Date(act.time).toLocaleString()}
                        </span>
                      </div>
                      <span className={`admin-badge ${
                        act.type === "contact"
                          ? "admin-badge-blue"
                          : act.type === "project"
                          ? "admin-badge-accent"
                          : "admin-badge-yellow"
                      } self-start`}>
                        {act.type}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div
                  className="admin-empty rounded-xl"
                  style={{ border: "1px solid var(--admin-border)" }}
                >
                  <Clock className="h-10 w-10" />
                  <p className="text-sm font-semibold mt-2" style={{ color: "var(--admin-text-2)" }}>
                    No activity yet
                  </p>
                  <p className="text-xs mt-1">
                    Activities will appear here as your team interacts with the platform.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column ──────────────────────────── */}
        <div className="space-y-5">

          {/* Quick Shortcuts */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
            }}
          >
            <div
              className="px-5 py-4"
              style={{ borderBottom: "1px solid var(--admin-border)" }}
            >
              <h2 className="text-sm font-bold" style={{ color: "var(--admin-text-1)" }}>
                Quick Shortcuts
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-3)" }}>
                Jump to frequently used sections
              </p>
            </div>
            <div className="p-3 space-y-1">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="dark-shimmer rounded-lg"
                      style={{ height: "2.75rem" }}
                    />
                  ))
                : QUICK_LINKS.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group"
                        style={{ color: "var(--admin-text-2)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--admin-text-1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--admin-text-2)";
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <LinkIcon
                            className="h-4 w-4 shrink-0"
                            style={{ color: "var(--admin-accent)" }}
                          />
                          <span className="text-sm font-medium">{link.label}</span>
                        </div>
                        <ChevronRight
                          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                          style={{ color: "var(--admin-text-4)" }}
                        />
                      </Link>
                    );
                  })}
            </div>
          </div>

          {/* Fast Updates Banner */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 60%, rgba(15,30,54,0) 100%)",
              border: "1px solid rgba(212,175,55,0.18)",
            }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
              style={{ background: "rgba(212,175,55,0.15)" }}
            />
            <div className="relative flex items-center gap-2 mb-2">
              <TrendingUp
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--admin-accent)" }}
              />
              <h3 className="text-sm font-bold" style={{ color: "var(--admin-text-1)" }}>
                Live Updates
              </h3>
            </div>
            <p
              className="text-xs leading-relaxed relative"
              style={{ color: "var(--admin-text-3)" }}
            >
              All changes applied inside this CMS propagate instantly to the main website
              frontend — no rebuilds or redeployment required.
            </p>
            <div className="flex items-center gap-1.5 mt-3 relative">
              <div
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "var(--admin-green)" }}
              />
              <span className="text-[10px] font-semibold" style={{ color: "var(--admin-green)" }}>
                LIVE
              </span>
            </div>
          </div>

          {/* Platform Summary */}
          {!loading && stats && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-5"
              style={{
                background: "var(--admin-card)",
                border: "1px solid var(--admin-border)",
              }}
            >
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--admin-text-3)" }}
              >
                Platform Summary
              </h3>
              <div className="space-y-2.5">
                {STAT_CARDS.map((card) => {
                  const Icon = card.icon;
                  const value = stats[card.key] as number;
                  return (
                    <div key={card.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="h-3.5 w-3.5"
                          style={{ color: "var(--admin-text-3)" }}
                        />
                        <span className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                          {card.label}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: "var(--admin-text-1)" }}
                      >
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
