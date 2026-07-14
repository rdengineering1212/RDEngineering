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
  Star,
  Quote,
  FileText
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatarUrl: "",
    featured: false,
  });

  const fetchTestimonials = () => {
    setLoading(true);
    fetch("/api/admin/testimonials")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load testimonials");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openNewForm = () => {
    setEditId(null);
    setForm({
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatarUrl: "",
      featured: false,
    });
    setShowForm(true);
  };

  const openEditForm = (testimonial: any) => {
    setEditId(testimonial.id);
    setForm({
      name: testimonial.name,
      role: testimonial.role || "",
      company: testimonial.company || "",
      content: testimonial.content,
      rating: testimonial.rating || 5,
      avatarUrl: testimonial.avatarUrl || "",
      featured: testimonial.featured || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("Name and review content are required");
      return;
    }

    setSaving(true);
    const isEdit = !!editId;
    const url = "/api/admin/testimonials";
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
        throw new Error(data.message || "Failed to save testimonial");
      }

      if (isEdit) {
        setTestimonials(testimonials.map((t) => (t.id === editId ? data : t)));
        toast.success("Testimonial updated successfully");
      } else {
        setTestimonials([data, ...testimonials]);
        toast.success("Testimonial added successfully");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast.success("Testimonial deleted successfully");
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase()) ||
    (t.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" style={{ color: "var(--admin-text-1)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Testimonials CMS</h1>
          <p className="admin-page-subtitle">Manage client reviews, ratings, corporate positions, and highlights</p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="admin-btn admin-btn-primary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Plus className="h-4 w-4" /> Add Testimonial
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
            placeholder="Search reviews, names, or companies..."
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
                {editId ? "Edit Testimonial Details" : "Add New Testimonial"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="admin-label">Reviewer Name *</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="admin-label">Rating (1 to 5 Stars)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}
                    className="admin-input"
                    style={{ background: "#0F1E36", color: "#F0F4FF", cursor: "pointer" }}
                  >
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <option key={stars} value={stars} style={{ background: "#0F1E36", color: "#F0F4FF" }}>
                        {"★".repeat(stars) + "☆".repeat(5 - stars)} ({stars} Star{stars > 1 ? "s" : ""})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-label">Role / Designation</label>
                  <input
                    className="admin-input"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Chief Operating Officer"
                  />
                </div>

                <div>
                  <label className="admin-label">Company Name</label>
                  <input
                    className="admin-input"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Apollo Infrastructure"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Review Content *</label>
                <textarea
                  className="admin-input"
                  style={{ height: "auto", padding: "0.75rem 1rem", resize: "vertical" }}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                  placeholder="Paste or write the review statement here..."
                  rows={4}
                />
              </div>

              <div
                className="p-4 rounded-xl"
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
                    <span className="text-sm font-semibold" style={{ color: "var(--admin-text-1)" }}>Pin / Feature Testimonial</span>
                    <span className="block text-xs" style={{ color: "var(--admin-text-3)" }}>Featured reviews will display on main website sections</span>
                  </div>
                </label>
              </div>

              {/* Avatar Image Upload */}
              <div className="border-t border-border/20 pt-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--admin-text-1)" }}>Reviewer Avatar / Photo Upload</h3>
                <ImageUploader
                  images={form.avatarUrl ? [form.avatarUrl] : []}
                  onChange={(urls) => setForm({ ...form, avatarUrl: urls[0] || "" })}
                  maxImages={1}
                  folderName="testimonials"
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
                  {editId ? "Update Testimonial" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/40 p-6 rounded-2xl space-y-4 dark-shimmer" style={{ height: "12rem" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl p-6 relative space-y-4 hover:shadow-lg transition-all flex flex-col justify-between group"
              style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonial.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80"}
                      alt={testimonial.name}
                      className="w-12 h-12 object-cover rounded-full bg-muted/40"
                      style={{ border: "1px solid var(--admin-border)" }}
                    />
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: "var(--admin-text-1)" }}>
                        {testimonial.name}
                      </h4>
                      <p className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                        {testimonial.role ? `${testimonial.role}, ` : ""}
                        {testimonial.company || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(testimonial)}
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
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 rounded-lg transition-colors"
                      title="Delete"
                      style={{ color: "var(--admin-text-3)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-red)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-red-dim)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-xs" style={{ color: "var(--admin-yellow)" }}>
                  {"★".repeat(testimonial.rating)}
                  {"☆".repeat(5 - testimonial.rating)}
                </div>

                <div className="text-xs leading-relaxed italic relative pl-4 border-l border-secondary/35" style={{ color: "var(--admin-text-2)" }}>
                  <Quote className="absolute -left-1 -top-2.5 h-6 w-6 opacity-10 -scale-x-100" />
                  "{testimonial.content}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/10" style={{ borderColor: "var(--admin-border)" }}>
                <span className="text-[10px] font-semibold uppercase font-mono" style={{ color: "var(--admin-text-3)" }}>
                  Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
                {testimonial.featured && (
                  <span className="admin-badge admin-badge-accent">Featured</span>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 admin-empty">
              <FileText className="h-12 w-12" />
              <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>No testimonials found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
