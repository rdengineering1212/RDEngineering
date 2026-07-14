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
  Globe,
  FileText
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [form, setForm] = useState({
    name: "",
    industry: "",
    logoUrl: "",
    website: "",
    featured: false,
    order: 0,
  });

  const fetchClients = () => {
    setLoading(true);
    fetch("/api/admin/clients")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load clients");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openNewForm = () => {
    setEditId(null);
    setForm({
      name: "",
      industry: "",
      logoUrl: "",
      website: "",
      featured: false,
      order: clients.length + 1,
    });
    setShowForm(true);
  };

  const openEditForm = (client: any) => {
    setEditId(client.id);
    setForm({
      name: client.name,
      industry: client.industry || "",
      logoUrl: client.logoUrl || "",
      website: client.website || "",
      featured: client.featured || false,
      order: client.order || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    setSaving(true);
    const isEdit = !!editId;
    const url = "/api/admin/clients";
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
        throw new Error(data.message || "Failed to save client");
      }

      if (isEdit) {
        setClients(clients.map((c) => (c.id === editId ? data : c)));
        toast.success("Client updated successfully");
      } else {
        setClients([...clients, data].sort((a, b) => a.order - b.order));
        toast.success("Client added successfully");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save client");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setClients(clients.filter((c) => c.id !== id));
      toast.success("Client deleted successfully");
    } catch {
      toast.error("Failed to delete client");
    }
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" style={{ color: "var(--admin-text-1)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Clients CMS</h1>
          <p className="admin-page-subtitle">Manage corporate clients, partner logos, and order displays</p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="admin-btn admin-btn-primary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Plus className="h-4 w-4" /> Add Client
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
            placeholder="Search by client name or industry..."
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
                {editId ? "Edit Client details" : "Add New Client logo"}
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
                  <label className="admin-label">Client / Corporate Name *</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Chennai Metro Corp"
                  />
                </div>

                <div>
                  <label className="admin-label">Industry Segment</label>
                  <input
                    className="admin-input"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="e.g. Infrastructure, Manufacturing"
                  />
                </div>

                <div>
                  <label className="admin-label">Website Link</label>
                  <input
                    className="admin-input"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="e.g. https://clientwebsite.com"
                  />
                </div>

                <div>
                  <label className="admin-label">Display Sort Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 1"
                  />
                </div>
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
                    <span className="text-sm font-semibold" style={{ color: "var(--admin-text-1)" }}>Pin / Feature Client</span>
                    <span className="block text-xs" style={{ color: "var(--admin-text-3)" }}>Featured clients show up in priority scrolling reels</span>
                  </div>
                </label>
              </div>

              {/* Logo Image Upload */}
              <div className="border-t border-border/20 pt-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--admin-text-1)" }}>Client Logo Upload</h3>
                <ImageUploader
                  images={form.logoUrl ? [form.logoUrl] : []}
                  onChange={(urls) => setForm({ ...form, logoUrl: urls[0] || "" })}
                  maxImages={1}
                  folderName="clients"
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
                  {editId ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients Table List */}
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
                <th>Logo</th>
                <th>Name &amp; Industry</th>
                <th className="hidden sm:table-cell">Website</th>
                <th style={{ textAlign: "center" }}>Sort Order</th>
                <th style={{ textAlign: "center" }}>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.logoUrl || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&q=80"}
                      alt={client.name}
                      className="w-12 h-12 object-contain bg-white/5 rounded-lg p-1"
                      style={{ border: "1px solid var(--admin-border)" }}
                    />
                  </td>
                  <td>
                    <div className="font-semibold text-sm" style={{ color: "var(--admin-text-1)" }}>
                      {client.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--admin-text-3)" }}>
                      {client.industry || "General Partner"}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    {client.website ? (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 transition-colors"
                        style={{ color: "var(--admin-blue)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
                      >
                        <Globe className="h-3 w-3" /> Visit Site
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "monospace", color: "var(--admin-text-2)" }}>
                    {client.order}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {client.featured ? (
                      <span className="admin-badge admin-badge-accent">Yes</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(client)}
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
                        onClick={() => handleDelete(client.id)}
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
              <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>No clients found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
