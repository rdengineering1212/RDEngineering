"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Download, ChevronDown, ChevronUp, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const perPage = 10;

  useEffect(() => {
    fetch("/api/admin/careers")
      .then(res => res.json())
      .then(data => { setApplications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.position?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setApplications(applications.filter(a => a.id !== id));
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    const csv = [["Name", "Email", "Phone", "Position", "Experience", "Qualification", "Date"]];
    applications.forEach(a => csv.push([a.name, a.email, a.phone, a.position, a.experience, a.qualification, a.createdAt]));
    const blob = new Blob([csv.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "applications.csv"; a.click();
    toast.success("Applications exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold text-white">Job Applications</h1>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:bg-secondary/90">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search applications..." className="w-full h-12 pl-12 pr-4 bg-card border border-border/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>

      <div className="space-y-3">
        {paginated.map((app: any) => (
          <div key={app.id} className="bg-card rounded-xl border border-border/40 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-20 h-20 bg-secondary/5 rounded-full blur-2xl" />
            <button onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors relative"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold">{app.name.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">{app.name}</p>
                  <p className="text-xs text-gray-400">{app.position} - {app.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">{new Date(app.createdAt).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(app.id); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                {expanded === app.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </div>
            </button>
            {expanded === app.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border/20 relative">
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div><span className="text-gray-400">Phone:</span> <span className="text-white">{app.phone}</span></div>
                  <div><span className="text-gray-400">Experience:</span> <span className="text-white">{app.experience}</span></div>
                  <div><span className="text-gray-400">Qualification:</span> <span className="text-white">{app.qualification}</span></div>
                </div>
                {app.coverLetter && (
                  <div className="mt-4 p-4 bg-muted/30 border border-border/10 rounded-lg">
                    <p className="text-sm text-gray-300 leading-relaxed">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {paginated.length === 0 && <div className="text-center py-12 text-gray-400">No applications found</div>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all ${page === i + 1 ? "bg-secondary text-primary" : "bg-card text-gray-300 hover:bg-muted/80 border border-border/40"}`}
            >{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}

