"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Home,
  Share2,
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Globe,
  BarChart3,
  Facebook,
  Linkedin,
  Instagram,
  Image as ImageIcon,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

type TabType = "profile" | "homepage" | "socials";

const TABS: { id: TabType; label: string; icon: any; desc: string }[] = [
  { id: "profile", label: "Company Profile", icon: Building2, desc: "Contact info & logo" },
  { id: "homepage", label: "Homepage", icon: Home, desc: "Hero text & stats" },
  { id: "socials", label: "Social Media", icon: Share2, desc: "Social links" },
];

const defaultForm = {
  companyName: "",
  phone: "",
  email: "",
  whatsapp: "",
  address: "",
  mapLink: "",
  logoUrl: "",
  heroTitle: "",
  heroSubtitle: "",
  stat1_label: "",
  stat1_value: "",
  stat2_label: "",
  stat2_value: "",
  stat3_label: "",
  stat3_value: "",
  stat4_label: "",
  stat4_value: "",
  facebook: "",
  linkedin: "",
  instagram: "",
};

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs" style={{ color: "var(--admin-text-4)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function InputWithIcon({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
        style={{ color: "var(--admin-text-4)" }}
      />
      <input {...props} className="admin-input" style={{ paddingLeft: "2.5rem" }} />
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div
      className="flex items-center gap-3 pb-4 mb-2"
      style={{ borderBottom: "1px solid var(--admin-border)" }}
    >
      <div className="rounded-xl p-2.5" style={{ background: "var(--admin-accent-dim)" }}>
        <Icon className="h-5 w-5" style={{ color: "var(--admin-accent)" }} />
      </div>
      <div>
        <h2 className="text-base font-bold" style={{ color: "var(--admin-text-1)" }}>
          {title}
        </h2>
        <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setForm({ ...defaultForm, ...data });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    toast.loading("Saving settings...", { id: "save-settings" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save settings");

      setForm((f) => ({ ...f, ...(data.settings || {}) }));
      toast.success("Settings saved successfully", { id: "save-settings" });
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings", { id: "save-settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="dark-shimmer rounded-xl" style={{ height: "2.25rem", width: "14rem" }} />
          <div className="dark-shimmer rounded-lg" style={{ height: "1rem", width: "22rem" }} />
        </div>
        {/* Layout skeleton */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-56 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="dark-shimmer rounded-xl" style={{ height: "3.5rem" }} />
            ))}
          </div>
          <div
            className="flex-1 rounded-2xl p-6 space-y-4"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="dark-shimmer rounded-xl" style={{ height: "3rem" }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="dark-shimmer rounded-xl" style={{ height: "2.75rem" }} />
            ))}
            <div className="dark-shimmer rounded-xl" style={{ height: "5rem" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="admin-page-title">System Settings</h1>
        <p className="admin-page-subtitle">
          Configure contact information, homepage content, and social media handles
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tab Navigation — Sidebar on desktop, pills on mobile */}
          <nav className="flex md:flex-col gap-2 md:w-56 shrink-0 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-3 rounded-xl text-left transition-all shrink-0 md:shrink"
                  style={{
                    padding: "0.75rem 1rem",
                    background: isActive ? "var(--admin-accent)" : "var(--admin-card)",
                    color: isActive ? "#080F1C" : "var(--admin-text-2)",
                    border: isActive ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="hidden md:block">
                    <div className="text-sm font-semibold leading-tight">{tab.label}</div>
                    <div
                      className="text-xs mt-0.5 leading-tight"
                      style={{ color: isActive ? "rgba(8,15,28,0.65)" : "var(--admin-text-3)", fontWeight: 400 }}
                    >
                      {tab.desc}
                    </div>
                  </div>
                  <span className="md:hidden text-sm font-semibold whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="p-6 space-y-6"
              >
                {/* ── COMPANY PROFILE TAB ── */}
                {activeTab === "profile" && (
                  <>
                    <SectionHeader
                      icon={Building2}
                      title="Company Profile"
                      subtitle="Configure key identifiers and communication lines for clients"
                    />

                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Company Name">
                          <InputWithIcon
                            icon={Building2}
                            value={form.companyName}
                            onChange={(e) => set("companyName", e.target.value)}
                            placeholder="e.g. RD Engineering"
                          />
                        </Field>
                        <Field label="Email Address">
                          <InputWithIcon
                            icon={Mail}
                            type="email"
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="e.g. contact@rdengineering.in"
                          />
                        </Field>
                        <Field label="Phone Number">
                          <InputWithIcon
                            icon={Phone}
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="e.g. +91 88833 89766"
                          />
                        </Field>
                        <Field label="WhatsApp Number">
                          <div className="relative">
                            <Phone
                              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                              style={{ color: "var(--admin-green)" }}
                            />
                            <input
                              type="text"
                              value={form.whatsapp}
                              onChange={(e) => set("whatsapp", e.target.value)}
                              placeholder="e.g. +91 88833 89766"
                              className="admin-input"
                              style={{ paddingLeft: "2.5rem" }}
                            />
                          </div>
                        </Field>
                      </div>

                      <Field label="Postal Address">
                        <div className="relative">
                          <MapPin
                            className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                            style={{ color: "var(--admin-text-4)" }}
                          />
                          <textarea
                            value={form.address}
                            onChange={(e) => set("address", e.target.value)}
                            placeholder="e.g. No. 12, Industrial Area, Chennai..."
                            rows={3}
                            className="admin-input"
                            style={{ height: "auto", padding: "0.625rem 1rem 0.625rem 2.5rem", resize: "vertical" }}
                          />
                        </div>
                      </Field>

                      <Field label="Google Maps Link" hint="Paste the full maps.google.com embed or share URL">
                        <InputWithIcon
                          icon={Globe}
                          value={form.mapLink}
                          onChange={(e) => set("mapLink", e.target.value)}
                          placeholder="e.g. https://maps.google.com/?q=..."
                        />
                      </Field>
                    </FieldGroup>

                    {/* Logo Upload */}
                    <div
                      className="rounded-xl p-4 space-y-3"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--admin-border)" }}
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" style={{ color: "var(--admin-accent)" }} />
                        <h3 className="text-sm font-semibold" style={{ color: "var(--admin-text-1)" }}>
                          Company Logo
                        </h3>
                      </div>
                      <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                        Used in site header, footer, and email templates. Recommended: transparent PNG or SVG.
                      </p>
                      <ImageUploader
                        images={form.logoUrl ? [form.logoUrl] : []}
                        onChange={(urls) => set("logoUrl", urls[0] || "")}
                        maxImages={1}
                        bucketName="rd-engineering"
                        folderName="settings/logo"
                      />
                    </div>
                  </>
                )}

                {/* ── HOMEPAGE TAB ── */}
                {activeTab === "homepage" && (
                  <>
                    <SectionHeader
                      icon={Home}
                      title="Homepage Configuration"
                      subtitle="Modify the primary landing text copy and key operational stats"
                    />

                    <FieldGroup>
                      <Field label="Main Hero Title" hint="Large headline displayed on the homepage hero section">
                        <input
                          type="text"
                          value={form.heroTitle}
                          onChange={(e) => set("heroTitle", e.target.value)}
                          placeholder="e.g. Premium Engineering Solutions"
                          className="admin-input"
                        />
                      </Field>

                      <Field label="Hero Subtitle / Description" hint="Supporting text below the main headline">
                        <textarea
                          value={form.heroSubtitle}
                          onChange={(e) => set("heroSubtitle", e.target.value)}
                          placeholder="e.g. Building the infrastructure of tomorrow with precision and excellence..."
                          rows={4}
                          className="admin-input"
                          style={{ height: "auto", padding: "0.625rem 1rem", resize: "vertical" }}
                        />
                      </Field>
                    </FieldGroup>

                    {/* Stats Blocks */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-4 w-4" style={{ color: "var(--admin-accent)" }} />
                        <h3 className="text-sm font-bold" style={{ color: "var(--admin-text-1)" }}>
                          Stats Numbers Overview
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {([
                          { num: 1, labelKey: "stat1_label" as const, valueKey: "stat1_value" as const },
                          { num: 2, labelKey: "stat2_label" as const, valueKey: "stat2_value" as const },
                          { num: 3, labelKey: "stat3_label" as const, valueKey: "stat3_value" as const },
                          { num: 4, labelKey: "stat4_label" as const, valueKey: "stat4_value" as const },
                        ]).map(({ num, labelKey, valueKey }) => (
                          <div
                            key={num}
                            className="rounded-xl p-4 space-y-3"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--admin-border)" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--admin-accent)" }}>
                                Stat Block {num}
                              </span>
                              <div
                                className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                                style={{ background: "var(--admin-accent-dim)", color: "var(--admin-accent)" }}
                              >
                                {num}
                              </div>
                            </div>
                            <div>
                              <label className="admin-label">Label</label>
                              <input
                                type="text"
                                value={form[labelKey]}
                                onChange={(e) => set(labelKey, e.target.value)}
                                placeholder="e.g. Projects Completed"
                                className="admin-input"
                              />
                            </div>
                            <div>
                              <label className="admin-label">Value</label>
                              <input
                                type="text"
                                value={form[valueKey]}
                                onChange={(e) => set(valueKey, e.target.value)}
                                placeholder="e.g. 150+"
                                className="admin-input"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── SOCIAL MEDIA TAB ── */}
                {activeTab === "socials" && (
                  <>
                    <SectionHeader
                      icon={Share2}
                      title="Social Media Links"
                      subtitle="Provide official handles and pages for footer and header links"
                    />

                    <FieldGroup>
                      <Field label="Facebook Page URL">
                        <div className="relative">
                          <Facebook
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                            style={{ color: "#1877F2" }}
                          />
                          <input
                            type="url"
                            value={form.facebook}
                            onChange={(e) => set("facebook", e.target.value)}
                            placeholder="https://facebook.com/yourpage"
                            className="admin-input"
                            style={{ paddingLeft: "2.5rem" }}
                          />
                        </div>
                      </Field>

                      <Field label="LinkedIn Profile / Company URL">
                        <div className="relative">
                          <Linkedin
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                            style={{ color: "#0A66C2" }}
                          />
                          <input
                            type="url"
                            value={form.linkedin}
                            onChange={(e) => set("linkedin", e.target.value)}
                            placeholder="https://linkedin.com/company/yourcompany"
                            className="admin-input"
                            style={{ paddingLeft: "2.5rem" }}
                          />
                        </div>
                      </Field>

                      <Field label="Instagram Handle URL">
                        <div className="relative">
                          <Instagram
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                            style={{ color: "#E1306C" }}
                          />
                          <input
                            type="url"
                            value={form.instagram}
                            onChange={(e) => set("instagram", e.target.value)}
                            placeholder="https://instagram.com/yourhandle"
                            className="admin-input"
                            style={{ paddingLeft: "2.5rem" }}
                          />
                        </div>
                      </Field>
                    </FieldGroup>

                    {/* Preview cards */}
                    <div
                      className="rounded-xl p-4 space-y-3"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--admin-border)" }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-text-3)" }}>
                        Link Preview
                      </p>
                      {[
                        { key: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2", bg: "rgba(24,119,242,0.1)" },
                        { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2", bg: "rgba(10,102,194,0.1)" },
                        { key: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C", bg: "rgba(225,48,108,0.1)" },
                      ].map(({ key, label, icon: Icon, color, bg }) => {
                        const val = form[key as keyof typeof form];
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 rounded-lg px-3 py-2"
                            style={{ background: bg, border: `1px solid ${color}22` }}
                          >
                            <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                            <span className="text-xs font-medium shrink-0" style={{ color, minWidth: "4.5rem" }}>
                              {label}
                            </span>
                            <span className="text-xs truncate" style={{ color: val ? "var(--admin-text-2)" : "var(--admin-text-4)" }}>
                              {val || "Not configured"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Sticky Save Footer */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}
            >
              <p className="text-xs" style={{ color: "var(--admin-text-4)" }}>
                Changes apply globally across the website
              </p>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary flex items-center gap-2"
                style={{ padding: "0.625rem 1.5rem" }}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
