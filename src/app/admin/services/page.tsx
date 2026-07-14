"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Loader2,
  X,
  Briefcase,
  Layers,
  Wrench,
  Hammer,
  Shield,
  Zap,
  Grid,
  FileText
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

const ICON_OPTIONS = [
  { name: "Briefcase", icon: Briefcase },
  { name: "Layers", icon: Layers },
  { name: "Wrench", icon: Wrench },
  { name: "Hammer", icon: Hammer },
  { name: "Shield", icon: Shield },
  { name: "Zap", icon: Zap },
  { name: "Grid", icon: Grid },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    icon: "Wrench",
    imageUrl: "",
    benefits: [] as string[],
    process: [] as string[],
    order: 0,
    featured: false,
  });

  // Temporary item inputs for arrays
  const [newBenefit, setNewBenefit] = useState("");
  const [newProcessStep, setNewProcessStep] = useState("");

  const fetchServices = () => {
    setLoading(true);
    fetch("/api/admin/services")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load services");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openNewForm = () => {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      content: "",
      icon: "Wrench",
      imageUrl: "",
      benefits: [],
      process: [],
      order: services.length + 1,
      featured: false,
    });
    setNewBenefit("");
    setNewProcessStep("");
    setShowForm(true);
  };

  const openEditForm = (service: any) => {
    setEditId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      content: service.content || "",
      icon: service.icon || "Wrench",
      imageUrl: service.imageUrl || "",
      benefits: service.benefits || [],
      process: service.process || [],
      order: service.order || 0,
      featured: service.featured || false,
    });
    setNewBenefit("");
    setNewProcessStep("");
    setShowForm(true);
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setForm({
      ...form,
      benefits: [...form.benefits, newBenefit.trim()],
    });
    setNewBenefit("");
  };

  const removeBenefit = (index: number) => {
    setForm({
      ...form,
      benefits: form.benefits.filter((_, idx) => idx !== index),
    });
  };

  const addProcessStep = () => {
    if (!newProcessStep.trim()) return;
    setForm({
      ...form,
      process: [...form.process, newProcessStep.trim()],
    });
    setNewProcessStep("");
  };

  const removeProcessStep = (index: number) => {
    setForm({
      ...form,
      process: form.process.filter((_, idx) => idx !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Title and Description are required");
      return;
    }

    setSaving(true);
    const isEdit = !!editId;
    const url = "/api/admin/services";
    const method = isEdit ? "PUT" : "POST";
    const payload = isEdit ? { id: editId, ...form } : form;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save service");
      }

      if (isEdit) {
        setServices(services.map((s) => (s.id === editId ? data : s)));
        toast.success("Service updated successfully");
      } else {
        setServices([...services, data].sort((a, b) => a.order - b.order));
        toast.success("Service created successfully");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service permanently?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setServices(services.filter((s) => s.id !== id));
      toast.success("Service deleted successfully");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" style={{ color: "var(--admin-text-1)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Services CMS</h1>
          <p className="admin-page-subtitle">Manage core engineering and manufacturing services offered</p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="admin-btn admin-btn-primary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="relative"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)", padding: "1rem", borderRadius: "0.75rem" }}
      >
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--admin-text-4)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="admin-input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
      </div>

      {/* Editor Form Panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border-med)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--admin-border)" }}
            >
              <h2 className="text-base font-bold" style={{ color: "var(--admin-text-1)" }}>
                {editId ? "Edit Service Entry" : "Create New Service Entry"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--admin-text-3)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="admin-label">Service Title *</label>
                  <input
                    className="admin-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. Pipeline & Piping Systems"
                  />
                </div>

                <div>
                  <label className="admin-label">Display Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="admin-input"
                    style={{ background: "#0F1E36", color: "#F0F4FF", cursor: "pointer" }}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.name} value={opt.name} style={{ background: "#0F1E36", color: "#F0F4FF" }}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="admin-label">Display / Sort Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 1"
                  />
                </div>

                <div
                  className="p-4 rounded-xl flex items-center"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--admin-border)" }}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-4 w-4 rounded"
                    />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: "var(--admin-text-1)" }}>Pin / Feature Service</span>
                      <span className="block text-xs" style={{ color: "var(--admin-text-3)" }}>Featured services will highlight prominently</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="admin-label">Brief Description *</label>
                <textarea
                  className="admin-input"
                  style={{ height: "auto", padding: "0.75rem 1rem", resize: "vertical" }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="Enter a brief summary overview..."
                  rows={2}
                />
              </div>

              <div>
                <label className="admin-label">Detailed Content / Specifications (Optional)</label>
                <textarea
                  className="admin-input"
                  style={{ height: "auto", padding: "0.75rem 1rem", resize: "vertical" }}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Full scope, technology used, and technical data..."
                  rows={4}
                />
              </div>

              {/* Dynamic Benefits Editor */}
              <div className="border-t border-border/20 pt-6" style={{ borderColor: "var(--admin-border)" }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--admin-text-1)" }}>Benefits / Key Advantages</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    className="admin-input"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="e.g. Highly durable corrosion protection"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="admin-btn admin-btn-secondary shrink-0"
                    style={{ padding: "0.5rem 1.25rem" }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)", color: "var(--admin-text-2)" }}
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(idx)}
                        className="transition-colors font-bold"
                        style={{ color: "var(--admin-red)" }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {form.benefits.length === 0 && (
                    <span className="text-xs" style={{ color: "var(--admin-text-4)" }}>No benefits added yet.</span>
                  )}
                </div>
              </div>

              {/* Dynamic Process Editor */}
              <div className="border-t border-border/20 pt-6" style={{ borderColor: "var(--admin-border)" }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--admin-text-1)" }}>Operational / Implementation Process Steps</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    className="admin-input"
                    value={newProcessStep}
                    onChange={(e) => setNewProcessStep(e.target.value)}
                    placeholder="e.g. Step 1: Initial design blueprinting"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addProcessStep();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addProcessStep}
                    className="admin-btn admin-btn-secondary shrink-0"
                    style={{ padding: "0.5rem 1.25rem" }}
                  >
                    Add
                  </button>
                </div>
                <ol className="space-y-2">
                  {form.process.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg text-xs"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--admin-border)", color: "var(--admin-text-2)" }}
                    >
                      <span>{idx + 1}. {step}</span>
                      <button
                        type="button"
                        onClick={() => removeProcessStep(idx)}
                        className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: "var(--admin-red)" }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                  {form.process.length === 0 && (
                    <li className="text-xs" style={{ color: "var(--admin-text-4)" }}>No process steps added yet.</li>
                  )}
                </ol>
              </div>

              {/* Image Uploader */}
              <div className="border-t border-border/20 pt-6" style={{ borderColor: "var(--admin-border)" }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--admin-text-1)" }}>Service Cover Image</h3>
                <ImageUploader
                  images={form.imageUrl ? [form.imageUrl] : []}
                  onChange={(urls) => setForm({ ...form, imageUrl: urls[0] || "" })}
                  maxImages={1}
                  folderName="services"
                />
              </div>

              <div className="border-t border-border/20 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="admin-btn admin-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary flex items-center gap-2"
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editId ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Table List */}
      {loading ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <div style={{ height: "3rem", borderBottom: "1px solid var(--admin-border)" }} className="dark-shimmer" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 dark-shimmer" style={{ height: "4.5rem", borderBottom: "1px solid var(--admin-border)" }} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title &amp; Description</th>
                <th style={{ textAlign: "center" }}>Order</th>
                <th style={{ textAlign: "center" }}>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => (
                <tr key={service.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.imageUrl || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=120&q=80"}
                      alt={service.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      style={{ border: "1px solid var(--admin-border)" }}
                    />
                  </td>
                  <td>
                    <div className="font-semibold text-sm" style={{ color: "var(--admin-text-1)" }}>
                      {service.title}
                    </div>
                    <div className="text-xs mt-1 line-clamp-1" style={{ color: "var(--admin-text-3)" }}>
                      {service.description}
                    </div>
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "monospace", color: "var(--admin-text-2)" }}>
                    {service.order}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {service.featured ? (
                      <span className="admin-badge admin-badge-accent">Featured</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(service)}
                        className="p-2 rounded-lg transition-colors"
                        title="Edit"
                        style={{ color: "var(--admin-text-3)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-accent)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-accent-dim)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(service.id)}
                        className="p-2 rounded-lg transition-colors"
                        title="Delete"
                        style={{ color: "var(--admin-text-3)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-red)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-red-dim)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="admin-empty">
              <FileText className="h-12 w-12" />
              <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>No services found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
