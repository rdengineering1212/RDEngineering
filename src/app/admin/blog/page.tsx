"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const initialPosts = [
  { id: "1", title: "Steel Fabrication Best Practices", slug: "steel-fabrication-best-practices", status: "published", date: "2025-01-15" },
  { id: "2", title: "Industrial Roofing Guide", slug: "industrial-roofing-guide", status: "published", date: "2025-01-10" },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "", tags: "" });

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPosts(posts.map(p => p.id === editingId ? { ...p, title: form.title, slug: form.slug } : p));
      toast.success("Post updated");
    } else {
      setPosts([...posts, { id: String(Date.now()), title: form.title, slug: form.slug, status: "draft", date: new Date().toISOString().split("T")[0] }]);
      toast.success("Post created");
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", category: "", tags: "" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this post?")) return;
    setPosts(posts.filter(p => p.id !== id));
    toast.success("Post deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Blog Management</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: "", slug: "", excerpt: "", content: "", category: "", tags: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:bg-secondary/90">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search posts..." className="w-full h-12 pl-12 pr-4 bg-card rounded-xl border border-border/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border/40 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
          <h2 className="text-lg font-heading font-bold text-white mb-4 relative z-10">{editingId ? "Edit Post" : "New Post"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="min-h-[200px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="btn-primary">{editingId ? "Update" : "Create"} Post</Button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-300 hover:bg-muted/80 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-4 font-semibold text-white">Title</th>
              <th className="text-left p-4 font-semibold text-white hidden md:table-cell">Slug</th>
              <th className="text-left p-4 font-semibold text-white hidden sm:table-cell">Status</th>
              <th className="text-left p-4 font-semibold text-white hidden lg:table-cell">Date</th>
              <th className="text-right p-4 font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-white">{post.title}</td>
                <td className="p-4 text-gray-400 hidden md:table-cell">{post.slug}</td>
                <td className="p-4 hidden sm:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400 hidden lg:table-cell">{post.date}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditingId(post.id); setShowForm(true); setForm({ ...form, title: post.title, slug: post.slug }); }}
                      className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

