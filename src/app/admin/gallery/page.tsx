"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", imageUrl: "", category: "" });

  const fetchImages = () => {
    fetch("/api/admin/gallery")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load gallery images");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filtered = images.filter((i) =>
    (i.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl || !form.category) {
      toast.error("Image URL and Category are required");
      return;
    }
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          imageUrl: form.imageUrl,
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setImages([newItem, ...images]);
      toast.success("Image added successfully");
      setShowForm(false);
      setForm({ title: "", imageUrl: "", category: "" });
    } catch {
      toast.error("Failed to add image");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      setImages(images.filter((i) => i.id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-white">Gallery Management</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:bg-secondary/90">
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search images..." className="w-full h-12 pl-12 pr-4 bg-card border border-border/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border/40 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
          <h2 className="text-lg font-heading font-bold text-white mb-4 relative z-10">Add Image to Gallery</h2>
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div><label className="block text-sm font-medium mb-1">Title (Optional)</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Steel Fabrication Workshop" /></div>
            <div><label className="block text-sm font-medium mb-1">Image URL</label><Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." required /></div>
            <div><label className="block text-sm font-medium mb-1">Category</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Steel Fabrication" required /></div>
            <div className="flex gap-3">
              <Button type="submit" className="btn-primary">Add Image</Button>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square border border-border/40">
                <Image src={img.imageUrl} alt={img.title || "Gallery image"} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDelete(img.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium">{img.title || "Untitled"}</p>
                  <p className="text-gray-300 text-xs">{img.category}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No gallery images found</div>
          )}
        </>
      )}
    </div>
  );
}

