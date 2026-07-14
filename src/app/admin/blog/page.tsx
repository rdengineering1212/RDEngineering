"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Search, X, Eye, EyeOff, Loader2,
  FileText, Tag, Calendar, ImageIcon, Globe
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

const CATEGORIES = ["News", "Project Update", "Industry Insights", "Case Study", "Tutorial", "Announcement"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "RD Engineering",
  category: "News",
  tags: "",
  imageUrl: "",
  published: false,
  featured: false,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/admin/blog")
      .then(res => res.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setPosts([]); setLoading(false); });
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setImageUrls([]);
    setShowForm(true);
  };

  const openEdit = (post: any) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "RD Engineering",
      category: post.category || "News",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || ""),
      imageUrl: post.imageUrl || "",
      published: post.published || false,
      featured: post.featured || false,
    });
    setImageUrls(post.imageUrl ? [post.imageUrl] : []);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.excerpt.trim()) { toast.error("Excerpt is required"); return; }

    setSaving(true);
    const payload = {
      ...form,
      imageUrl: imageUrls[0] || "",
      slug: form.slug || slugify(form.title),
    };

    try {
      const res = await fetch("/api/admin/blog", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      const saved = await res.json();
      if (editingId) {
        setPosts(prev => prev.map(p => p.id === editingId ? saved : p));
        toast.success("Post updated successfully");
      } else {
        setPosts(prev => [saved, ...prev]);
        toast.success("Post created successfully");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleTogglePublish = async (post: any) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
      toast.success(updated.published ? "Post published" : "Post unpublished");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" style={{ color: "var(--admin-text-1)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Blog Management</h1>
          <p className="admin-page-subtitle">{posts.length} posts &mdash; {posts.filter(p => p.published).length} published</p>
        </div>
        <button
          type="button"
          onClick={showForm ? () => setShowForm(false) : openNew}
          className="admin-btn admin-btn-primary flex items-center gap-2"
          style={{ padding: "0.625rem 1.25rem" }}
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Close" : "New Post"}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--admin-text-4)" }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts by title, category..."
          className="admin-input"
          style={{ paddingLeft: "2.5rem" }}
        />
      </div>

      {/* Create / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border-med)" }}
          >
            {/* Form Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--admin-border)" }}
            >
              <h2 className="text-base font-bold" style={{ color: "var(--admin-text-1)" }}>
                {editingId ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--admin-text-3)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "var(--admin-text-1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title + Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Post Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                    placeholder="e.g. Steel Fabrication Best Practices"
                    required
                  />
                </div>
                <div>
                  <label className="admin-label">URL Slug</label>
                  <input
                    type="text"
                    className="admin-input font-mono text-xs"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                    placeholder="auto-generated from title"
                  />
                </div>
              </div>

              {/* Author + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Author</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    placeholder="e.g. RD Engineering"
                  />
                </div>
                <div>
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-input"
                    style={{ cursor: "pointer" }}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} style={{ background: "#0F1E36", color: "#F0F4FF" }}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="admin-label">Excerpt / Summary *</label>
                <textarea
                  className="admin-input"
                  style={{ height: "auto", padding: "0.75rem 1rem", resize: "vertical", minHeight: "5rem" }}
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A brief summary (2-3 sentences shown in listings)..."
                  rows={3}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="admin-label">Full Content</label>
                <textarea
                  className="admin-input"
                  style={{ height: "auto", padding: "0.75rem 1rem", resize: "vertical", minHeight: "10rem" }}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Full blog post content in plain text or markdown..."
                  rows={10}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="admin-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. steel fabrication, pipeline, industrial"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="admin-label">Cover Image</label>
                <ImageUploader
                  images={imageUrls}
                  onChange={urls => { setImageUrls(urls); setForm({ ...form, imageUrl: urls[0] || "" }); }}
                  maxImages={1}
                  folderName="blog"
                />
              </div>

              {/* Toggles */}
              <div
                className="flex flex-wrap gap-6 py-4 px-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--admin-border)" }}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: "var(--admin-text-1)" }}>Published</span>
                    <span className="block text-xs" style={{ color: "var(--admin-text-3)" }}>Visible on public blog page</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: "var(--admin-text-1)" }}>Featured</span>
                    <span className="block text-xs" style={{ color: "var(--admin-text-3)" }}>Highlighted at top of blog</span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div
                className="flex items-center justify-end gap-3 pt-2"
                style={{ borderTop: "1px solid var(--admin-border)" }}
              >
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="admin-btn admin-btn-ghost"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary flex items-center gap-2"
                  style={{ padding: "0.5rem 1.5rem", opacity: saving ? 0.7 : 1 }}
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update Post" : "Publish Post"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Table */}
      {loading ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <div style={{ height: "3rem", borderBottom: "1px solid var(--admin-border)" }} className="dark-shimmer" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 dark-shimmer" style={{ height: "4.5rem", borderBottom: "1px solid var(--admin-border)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty rounded-2xl" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <FileText className="h-12 w-12" />
          <p className="text-base font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>
            {search ? "No posts match your search" : "No blog posts yet"}
          </p>
          <p className="text-sm mt-1">
            {search ? "Try a different search term" : "Click 'New Post' to create your first blog post."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title &amp; Category</th>
                <th className="hidden md:table-cell">Author</th>
                <th className="hidden sm:table-cell">Status</th>
                <th className="hidden lg:table-cell">Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {post.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-9 w-14 rounded object-cover shrink-0"
                          style={{ border: "1px solid var(--admin-border)" }}
                        />
                      ) : (
                        <div
                          className="h-9 w-14 rounded flex items-center justify-center shrink-0"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--admin-border)" }}
                        >
                          <ImageIcon className="h-3.5 w-3.5" style={{ color: "var(--admin-text-4)" }} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--admin-text-1)" }}>{post.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Tag className="h-2.5 w-2.5" style={{ color: "var(--admin-text-4)" }} />
                          <span className="text-xs" style={{ color: "var(--admin-text-3)" }}>{post.category || "Uncategorized"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="text-sm" style={{ color: "var(--admin-text-2)" }}>{post.author || "—"}</span>
                  </td>
                  <td className="hidden sm:table-cell">
                    {post.published ? (
                      <span className="admin-badge admin-badge-green">Published</span>
                    ) : (
                      <span className="admin-badge admin-badge-muted">Draft</span>
                    )}
                    {post.featured && (
                      <span className="admin-badge admin-badge-accent ml-1">Featured</span>
                    )}
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" style={{ color: "var(--admin-text-4)" }} />
                      <span className="text-xs" style={{ color: "var(--admin-text-3)" }}>
                        {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post)}
                        className="p-2 rounded-lg transition-colors"
                        title={post.published ? "Unpublish" : "Publish"}
                        style={{ color: "var(--admin-text-3)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-green)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-green-dim)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(post)}
                        className="p-2 rounded-lg transition-colors"
                        title="Edit"
                        style={{ color: "var(--admin-text-3)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-blue)"; (e.currentTarget as HTMLElement).style.background = "var(--admin-blue-dim)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--admin-text-3)"; (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
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
        </div>
      )}
    </div>
  );
}
