"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  Search,
  Loader2,
  X,
  FileText,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const CATEGORIES = [
  "Steel Fabrication",
  "Pipeline",
  "Roofing",
  "Painting",
  "PUF Panels",
  "Aluminium",
  "Machining",
  "Others"
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Preview State
  const [previewProject, setPreviewProject] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Steel Fabrication",
    clientName: "",
    location: "",
    imageUrl: "",
    images: [] as string[],
    featured: false,
  });

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/admin/projects", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load projects");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openNewForm = () => {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      category: "Steel Fabrication",
      clientName: "",
      location: "",
      imageUrl: "",
      images: [],
      featured: false,
    });
    setShowForm(true);
  };

  const openEditForm = (project: any) => {
    setEditId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "Steel Fabrication",
      clientName: project.clientName || "",
      location: project.location || "",
      imageUrl: project.imageUrl || "",
      images: project.images || [],
      featured: project.featured || false,
    });
    setShowForm(true);
  };

  const handleDuplicate = async (project: any) => {
    const baseTitle = `Copy of ${project.title}`;
    const slug = `${generateSlug(baseTitle)}-${Math.floor(Math.random() * 1000)}`;
    
    const duplicateData = {
      title: project.title + " (Copy)",
      slug,
      description: project.description,
      category: project.category,
      clientName: project.clientName,
      location: project.location,
      imageUrl: project.imageUrl,
      images: project.images,
      featured: false,
    };

    toast.loading("Duplicating project...", { id: "duplicate" });
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to duplicate");
      }

      setProjects([data, ...projects]);
      toast.success("Project duplicated successfully", { id: "duplicate" });
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate project", { id: "duplicate" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error("Title, Description, and Category are required");
      return;
    }

    const payload = {
      ...form,
      slug: generateSlug(form.title),
      imageUrl: form.imageUrl || undefined,
    };

    const isEdit = !!editId;
    const url = isEdit ? `/api/admin/projects?id=${editId}` : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";

    toast.loading(isEdit ? "Saving changes..." : "Creating project...", { id: "save-project" });

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save project");
      }

      if (isEdit) {
        setProjects(projects.map((p) => (p.id === editId ? data : p)));
        toast.success("Project updated successfully", { id: "save-project" });
      } else {
        setProjects([data, ...projects]);
        toast.success("Project created successfully", { id: "save-project" });
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save project", { id: "save-project" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project permanently?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set([...CATEGORIES, ...projects.map((p) => p.category)]));

  return (
    <div className="space-y-6" style={{ color: "var(--admin-text-1)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Projects CMS</h1>
          <p className="admin-page-subtitle">{projects.length} projects &mdash; manage case studies, imagery and categories</p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="admin-btn admin-btn-primary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Filters Bar */}
      <div
        className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--admin-text-4)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category or client..."
            className="admin-input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["All", ...uniqueCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={categoryFilter === cat ? {
                background: "var(--admin-accent)",
                color: "#080F1C",
              } : {
                background: "rgba(255,255,255,0.05)",
                color: "var(--admin-text-3)",
                border: "1px solid var(--admin-border)",
              }}
            >
              {cat === "All" ? "All Categories" : cat}
            </button>
          ))}
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
                {editId ? "Edit Project" : "Create New Project"}
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
                  <label className="admin-label">Project Title *</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. Industrial Warehouse Steel Fabrication"
                  />
                </div>
                <div>
                  <label className="admin-label">Category *</label>
                  <input
                    type="text"
                    list="category-options"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    placeholder="Select or type new category..."
                    className="w-full h-12 px-4 rounded-lg border border-border/40 bg-white/5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all hover:border-border/60"
                  />
                  <datalist id="category-options">
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="admin-label">Client Name</label>
                  <Input
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. Chennai Metro Rail Limited"
                  />
                </div>
                <div>
                  <label className="admin-label">Location</label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Kadambathur, Tiruvallur"
                  />
                </div>


              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Brief Description *</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="Enter a short elevator-pitch overview of the project..."
                  rows={2}
                />
              </div>



              {/* Cover Image Upload */}
              <div className="border-t border-border/20 pt-6">
                <h3 className="text-sm font-semibold text-white mb-2">1. Main Cover Image</h3>
                <ImageUploader
                  images={form.imageUrl ? [form.imageUrl] : []}
                  onChange={(urls) => setForm({ ...form, imageUrl: urls[0] || "" })}
                  maxImages={1}
                  folderName="projects/covers"
                />
              </div>

              {/* Multi-file Gallery Upload */}
              <div className="border-t border-border/20 pt-6">
                <h3 className="text-sm font-semibold text-white mb-1">2. Project Gallery Images</h3>
                <p className="text-xs text-gray-400 mb-3">Upload and arrange multiple high-res shots. The order shown below is how they appear in the website slideshow.</p>
                <ImageUploader
                  images={form.images}
                  onChange={(urls) => setForm({ ...form, images: urls })}
                  maxImages={25}
                  folderName="projects/gallery"
                />
              </div>

              <div className="border-t border-border/20 pt-6 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary focus:ring-offset-0 bg-muted/20"
                  />
                  <div>
                    <span className="text-sm font-medium">Pin / Feature Project</span>
                    <span className="block text-xs text-gray-400">Featured projects show up on the homepage slider</span>
                  </div>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <Button type="submit" className="btn-primary">
                    {editId ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Table List */}
      {loading ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <div style={{ height: "3rem", borderBottom: "1px solid var(--admin-border)" }} className="dark-shimmer" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 dark-shimmer" style={{ height: "4.5rem", borderBottom: "1px solid var(--admin-border)" }} />
          ))}
        </div>
      ) : (
        <>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Project / Category</th>
                    <th className="hidden md:table-cell">Client &amp; Location</th>
                    <th className="hidden sm:table-cell">Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20 transition-colors group">
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=120&q=80"}
                        alt={project.title}
                        className="w-16 h-12 object-cover rounded-lg"
                        style={{ border: "1px solid var(--admin-border)" }}
                      />
                    </td>
                    <td>
                      <div className="font-semibold text-sm line-clamp-1" style={{ color: "var(--admin-text-1)" }}>
                        {project.title}
                      </div>
                      <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "var(--admin-text-3)" }}>
                        <span>{project.category}</span>
                        {project.featured && (
                          <span className="admin-badge admin-badge-accent">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div style={{ color: "var(--admin-text-1)" }}>{project.clientName || "-"}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--admin-text-3)" }}>{project.location || "-"}</div>
                    </td>
                    <td className="hidden sm:table-cell">
                      {project.status === "draft" ? (
                        <span className="admin-badge admin-badge-yellow">Draft</span>
                      ) : (
                        <span className="admin-badge admin-badge-green">Live</span>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => setPreviewProject(project)} title="Preview"
                          className="p-2 rounded-lg transition-colors" style={{ color: "var(--admin-text-3)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                        ><Eye className="h-4 w-4" /></button>
                        <button type="button" onClick={() => handleDuplicate(project)} title="Duplicate"
                          className="p-2 rounded-lg transition-colors" style={{ color: "var(--admin-text-3)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-blue)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-blue-dim)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                        ><Copy className="h-4 w-4" /></button>
                        <button type="button" onClick={() => openEditForm(project)} title="Edit"
                          className="p-2 rounded-lg transition-colors" style={{ color: "var(--admin-text-3)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-accent)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-accent-dim)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                        ><Edit2 className="h-4 w-4" /></button>
                        <button type="button" onClick={() => handleDelete(project.id)} title="Delete"
                          className="p-2 rounded-lg transition-colors" style={{ color: "var(--admin-text-3)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-red)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-red-dim)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="admin-empty">
                <FileText className="h-12 w-12" />
                <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>No projects match the criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border/40 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="relative h-64 w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewProject.imageUrl || "https://images.unsplash.com/photo-1581092162384-8987c1d6c2a7?w=800&q=80"}
                  alt={previewProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setPreviewProject(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-secondary text-primary font-black uppercase text-[10px] px-2 py-0.5 rounded">
                    {previewProject.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold mt-2">{previewProject.title}</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-secondary" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Client</div>
                      <div className="text-xs font-semibold">{previewProject.clientName || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Location</div>
                      <div className="text-xs font-semibold">{previewProject.location || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Completed</div>
                      <div className="text-xs font-semibold">
                        {previewProject.date ? new Date(previewProject.date).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Visibility</div>
                      <div className="text-xs font-semibold capitalize">{previewProject.status}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">Short Description</h3>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">{previewProject.description}</p>
                </div>

                {previewProject.content && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">Case Study Details</h3>
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {previewProject.content}
                    </div>
                  </div>
                )}

                {previewProject.images && previewProject.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-gray-400 mb-3">Gallery Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {previewProject.images.map((imgUrl: string, idx: number) => (
                        <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-border/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-border/20">
                  <button
                    onClick={() => setPreviewProject(null)}
                    className="px-5 py-2.5 bg-muted/40 hover:bg-muted text-sm font-semibold rounded-lg transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
