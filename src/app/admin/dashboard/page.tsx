"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, FileText, Briefcase, Eye, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const statCards = [
    { label: "Contact Messages", value: stats?.contacts ?? 0, icon: MessageSquare, href: "/admin/contacts", color: "from-blue-500 to-blue-600" },
    { label: "Quote Requests", value: stats?.quotes ?? 0, icon: FileText, href: "/admin/quotes", color: "from-secondary to-accent" },
    { label: "Job Applications", value: stats?.careers ?? 0, icon: Briefcase, href: "/admin/careers", color: "from-green-500 to-green-600" },
    { label: "Page Views", value: stats?.pageViews ?? 0, icon: Eye, href: "#", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to RD Engineering admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Link href={card.href} className="block bg-card rounded-xl border border-border/40 p-6 hover:shadow-lg hover:border-secondary/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-20 h-20 bg-secondary/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300" />
              </div>
              <div className="text-3xl font-heading font-bold text-white">{card.value}</div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border/40 p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
        <h2 className="text-lg font-heading font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "View Contacts", href: "/admin/contacts", icon: MessageSquare },
            { label: "Manage Blog", href: "/admin/blog", icon: FileText },
            { label: "Review Applications", href: "/admin/careers", icon: Briefcase },
            { label: "Update Projects", href: "/admin/projects", icon: TrendingUp },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border border-border/20 hover:bg-muted/80 transition-all duration-300"
            >
              <action.icon className="h-5 w-5 text-secondary" />
              <span className="text-sm font-semibold text-white">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

