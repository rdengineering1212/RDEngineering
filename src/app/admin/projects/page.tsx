"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    clientName: "",
    location: "",
    imageUrl: "",
  });

  const fetchProjects = () => {
    fetch("/api/admin/projects")
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

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    (p.clientName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error("Title, Description, and Category are required");
      return;
    }

    const projectData = {
      title: form.title,
      slug: generateSlug(form.title),
      description: form.description,
      content: form.content,
      category: form.category,
      clientName: form.clientName || undefined,
      location: form.location || undefined,
      imageUrl: form.imageUrl || undefined,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      setProjects([data, ...projects]);
      toast.success("Project created successfully");
      setShowForm(false);
      setForm({ title: "", description: "", content: "", category: "", clientName: "", location: "", imageUrl: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Projects Management</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:bg-secondary/90">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search projects..." className="w-full h-12 pl-12 pr-4 bg-card rounded-xl border border-border/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border/40 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
          <h2 className="text-lg font-heading font-bold text-white mb-4 relative z-10">New Project Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title *</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Structural Steel Fabrication" /></div>
              <div><label className="block text-sm font-medium mb-1">Category *</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required placeholder="e.g. Steel Fabrication" /></div>
              <div><label className="block text-sm font-medium mb-1">Client Name</label><Input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="e.g. L.S Automotive" /></div>
              <div><label className="block text-sm font-medium mb-1">Location</label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kadambathur" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Image URL</label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." /></div>
            <div><label className="block text-sm font-medium mb-1">Description * (Brief)</label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Enter brief overview..." /></div>
            <div><label className="block text-sm font-medium mb-1">Content (Full details, markdown allowed)</label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Enter detailed content here..." /></div>
            <div className="flex gap-3">
              <Button type="submit" className="btn-primary">Create Project</Button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-300 hover:bg-muted/80 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      ) : (
        <>
          <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr><th className="text-left p-4 font-semibold text-white">Title</th><th className="text-left p-4 font-semibold text-white hidden md:table-cell">Category</th><th className="text-left p-4 font-semibold text-white hidden sm:table-cell">Client</th><th className="text-right p-4 font-semibold text-white">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-white">{project.title}</td>
                    <td className="p-4 text-gray-400 hidden md:table-cell">{project.category}</td>
                    <td className="p-4 text-gray-400 hidden sm:table-cell">{project.clientName || "-"}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No projects found</div>
          )}
        </>
      )}
    </div>
  );
}

